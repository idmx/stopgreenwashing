import { HandbookCard } from "../../components/handbook-card";
import { catalogMarks } from "../../data/catalog";
import styles from "./handbook-page.module.css";

export const HandbookPage = () => {
  return (
    <div className={styles.cards}>
      {catalogMarks.map((item, index) => (
        <HandbookCard
          country={item.country}
          id={index}
          src={`src/assets/marks/Picture${index + 1}.png`}
          title={item.title}
        />
      ))}
    </div>
  );
};
