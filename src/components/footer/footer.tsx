import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a href="mailto:stopgreenwashing@mail.ru" className={styles.link}>
        stopgreenwashing@mail.ru
      </a>
    </footer>
  );
};
