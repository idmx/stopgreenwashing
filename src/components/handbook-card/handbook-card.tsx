import { FC } from "react";
import styles from "./handbook-card.module.css";
import { useNavigate } from "react-router-dom";

type HandbookCardProps = {
  src: string;
  title: string;
  id: number;
  country: string;
};

export const HandbookCard: FC<HandbookCardProps> = ({
  country,
  id,
  src,
  title,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/handbook/${id}`)}>
      <img src={src} alt={title} className={styles.image} />
      <div className={styles.textBlock}>
        <div className={styles.title}>{title}</div>
        <div className={styles.country}>{country}</div>
      </div>
    </div>
  );
};
