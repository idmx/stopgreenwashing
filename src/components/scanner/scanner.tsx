import { useState, useRef, ChangeEvent } from "react";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import styles from "./scanner.module.css";

const marks = import.meta.glob("../../assets/marks/*.png", {
  query: { format: "webp;avif;jpg", width: "200;400;600;1200", picture: "" },
  import: "default",
  eager: true,
}) as Record<string, string>;

type ImageType = string | ArrayBuffer | null | undefined;
type BestMatch = { name: string | null; score: number };

export const Scanner = () => {
  const [result, setResult] = useState("");
  const [image, setImage] = useState<ImageType>(null); // Состояние для загруженного/снятого изображения
  const [searchImage, setSearchImage] = useState<string | null>(null); // Состояние для загруженного/снятого изображения
  const webcamRef = useRef<Webcam>(null);

  // Функция для захвата изображения с камеры
  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImage(imageSrc);
    compareImage(imageSrc);
  };

  // Функция для загрузки изображения
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result ?? null);
        compareImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filterMatchesWithRANSAC = (
    keyPoints1: cv.DMatchVector,
    keyPoints2: cv.DMatchVector,
    matches: cv.DMatchVector
  ) => {
    // Проверяем, достаточно ли совпадений для вычисления гомографии
    if (matches.size() < 4) {
      console.error("Not enough matches to compute homography.");
      return matches; // Возвращаем все совпадения, если их меньше 4
    }

    try {
      // Собираем точки из ключевых точек
      const points1 = [];
      const points2 = [];
      for (let i = 0; i < matches.size(); i++) {
        const match = matches.get(i);
        const pt1 = keyPoints1.get(match.queryIdx).pt;
        const pt2 = keyPoints2.get(match.trainIdx).pt;

        // Проверяем, что точки корректны
        if (
          isFinite(pt1.x) &&
          isFinite(pt1.y) &&
          isFinite(pt2.x) &&
          isFinite(pt2.y)
        ) {
          points1.push([pt1.x, pt1.y]);
          points2.push([pt2.x, pt2.y]);
        }
      }

      // Проверяем, что осталось достаточно точек
      if (points1.length < 4) {
        console.error("Not enough valid points to compute homography.");
        return matches; // Возвращаем все совпадения, если точек меньше 4
      }

      // Преобразуем точки в матрицы
      const srcPoints = cv.matFromArray(
        points1.length,
        1,
        cv.CV_32FC2,
        points1.flat()
      );
      const dstPoints = cv.matFromArray(
        points2.length,
        1,
        cv.CV_32FC2,
        points2.flat()
      );

      // Находим гомографию
      const homography = cv.findHomography(srcPoints, dstPoints, cv.RANSAC, 5);

      // Проверяем, была ли найдена гомография
      if (homography.empty()) {
        console.error("Homography could not be computed.");
        srcPoints.delete();
        dstPoints.delete();
        return matches; // Возвращаем все совпадения, если гомография не найдена
      }

      // Создаем матрицу для выходных точек
      const transformedPoints = new cv.Mat(
        srcPoints.rows,
        srcPoints.cols,
        cv.CV_32FC2
      );

      // Применяем перспективное преобразование
      cv.perspectiveTransform(srcPoints, transformedPoints, homography);

      const inliers = new cv.DMatchVector();

      // Фильтруем совпадения
      for (let i = 0; i < matches.size(); i++) {
        const match = matches.get(i);
        const points = keyPoints2.get(match.trainIdx).pt;

        // Получаем преобразованную точку
        const transformedPt = [
          transformedPoints.data32F[i * 2], // x-координата
          transformedPoints.data32F[i * 2 + 1], // y-координата
        ];

        // Вычисляем расстояние между преобразованной точкой и целевой точкой
        const distance = Math.sqrt(
          Math.pow(transformedPt[0] - points.x, 2) +
            Math.pow(transformedPt[1] - points.y, 2)
        );

        // Если расстояние меньше порога, считаем это совпадением
        if (distance < 5) {
          inliers.push_back(match);
        }
      }

      // Освобождаем память
      srcPoints.delete();
      dstPoints.delete();
      homography.delete();
      transformedPoints.delete();

      return inliers;
    } catch (error) {
      console.error("Error in filterMatchesWithRANSAC:", error);
      return new cv.DMatchVector();
    }
  };

  // Функция для сравнения изображений с использованием OpenCV
  const compareImage = async (scannedImageSrc: ImageType) => {
    if (!cv) {
      console.error("OpenCV is not loaded yet.");
      return;
    }

    try {
      // Загружаем изображение с камеры/загрузки
      const scannedImage = await loadImage(scannedImageSrc);

      // Преобразуем изображение в grayscale
      const scannedGray = new cv.Mat();
      cv.cvtColor(scannedImage, scannedGray, cv.COLOR_RGBA2GRAY, 0);

      // Применяем гауссово размытие
      const blurred = new cv.Mat();
      cv.GaussianBlur(scannedGray, blurred, new cv.Size(5, 5), 0);

      // Инициализируем ORB детектор
      const orb = new cv.ORB();

      // Находим ключевые точки и дескрипторы для сканированного изображения
      const scannedKeyPoints = new cv.KeyPointVector();
      const scannedDescriptors = new cv.Mat();
      orb.detectAndCompute(
        scannedGray,
        new cv.Mat(),
        scannedKeyPoints,
        scannedDescriptors
      );

      let bestMatch: BestMatch = { name: null, score: 0 };

      // Проходим по всем изображениям из папки marks
      const markPaths = Object.values(marks);
      for (const markPath of markPaths) {
        // Загружаем изображение из папки marks
        const markImage = await loadImage(markPath);

        // Преобразуем изображение в grayscale
        const markGray = new cv.Mat();
        cv.cvtColor(markImage, markGray, cv.COLOR_RGBA2GRAY, 0);

        // Применяем гауссово размытие
        const markBlurred = new cv.Mat();
        cv.GaussianBlur(markGray, markBlurred, new cv.Size(5, 5), 0);

        // Находим ключевые точки и дескрипторы для изображения из marks
        const markKeyPoints = new cv.KeyPointVector();
        const markDescriptors = new cv.Mat();
        orb.detectAndCompute(
          markGray,
          new cv.Mat(),
          markKeyPoints,
          markDescriptors
        );

        // Сравниваем дескрипторы с помощью BFMatcher
        const bfMatcher = new cv.BFMatcher(cv.NORM_HAMMING, true);
        const matches = new cv.DMatchVector();
        bfMatcher.match(scannedDescriptors, markDescriptors, matches);

        // Фильтруем совпадения с помощью RANSAC
        const inliers = filterMatchesWithRANSAC(
          scannedKeyPoints,
          markKeyPoints,
          matches
        );

        // // Оцениваем качество совпадения
        const matchScore = inliers.size();
        if (matchScore > bestMatch.score) {
          bestMatch = { name: markPath, score: matchScore };
        }

        // Освобождаем память
        markGray.delete();
        // markBlurred.delete();
        markKeyPoints.delete();
        markDescriptors.delete();
        matches.delete();
      }
      // Выводим результат
      console.log(bestMatch);
      if (bestMatch.name) {
        setResult(`Best match: ${bestMatch.name} (Score: ${bestMatch.score})`);
        setSearchImage(bestMatch.name);
      } else {
        setResult("No match found");
      }

      // Освобождаем память
      scannedImage.delete();
      scannedGray.delete();
      scannedKeyPoints.delete();
      scannedDescriptors.delete();
    } catch (error) {
      console.error("Error comparing images:", error);
    }
  };

  // Функция для загрузки изображения в OpenCV
  const loadImage = (src: ImageType): Promise<cv.Mat> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx!.getImageData(0, 0, img.width, img.height);
        const mat = cv.matFromImageData(imageData);
        resolve(mat);
      };
      img.onerror = reject;
    });
  };

  return (
    <div>
      <h1>Scanner</h1>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.camera}
        />
        <button onClick={captureImage}>Capture Photo</button>
      </div>
      <div>
        <h2>Or upload an image:</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {image && (
        <div>
          <h2>Captured/Uploaded Image:</h2>
          <img
            src={image as string}
            alt="Captured"
            style={{ width: "300px", height: "auto" }}
          />
        </div>
      )}
      <div>
        <h2>Result:</h2>
        <span>{result}</span>
        <img
          src={searchImage as string}
          alt="Captured"
          style={{ width: "300px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default Scanner;
