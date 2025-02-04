import { HandbookCard } from "../../components/handbook-card";
import { catalogMarks } from "../../data/catalog";
import styles from "./handbook-page.module.css";

export const HandbookPage = () => {
  return (
    <div className={styles.cards}>
      {catalogMarks.map((item, index) => (
        <HandbookCard
          key={index}
          country={item.country}
          id={index}
          src={String(
            new URL(
              `../../assets/marks/Picture${index + 1}.png`,
              import.meta.url
            )
          )}
          title={item.title}
        />
      ))}
    </div>
  );
};
