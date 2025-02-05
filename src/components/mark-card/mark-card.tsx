import { useLocation } from "react-router-dom";
import styles from "./mark-card.module.css";
import { catalogMarks } from "../../data/catalog";

export const MarkCard = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/")[2] as unknown as number;
  const mark = catalogMarks[id];

  return (
    <div className={styles.markCard}>
      <img
        src={String(
          new URL(`../../assets/marks/Picture${+id + 1}.png`, import.meta.url)
        )}
        alt={mark.title}
        className={styles.image}
      />
      <div className={styles.textBlock}>
        <div className={styles.title}>{mark.title}</div>
        <div className={styles.country}>{mark.country}</div>
        <p className={styles.description}>{mark.description}</p>
      </div>
    </div>
  );
};
