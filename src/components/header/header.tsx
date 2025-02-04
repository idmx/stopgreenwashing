import { useLocation } from "react-router-dom";
import styles from "./header.module.css";
import { Menu } from "../menu";

export const Header = () => {
  const { pathname } = useLocation();

  const getTitle = () => {
    switch (pathname) {
      case "/":
        return "stop greenwashing";
      case "/handbook":
        return "Справочник";
      case "/scanner":
        return "Сканер";
      case pathname.match(/\/handbook\/\d/)?.[0]:
        return "Маркировка";
      default:
        return "stop greenwashing";
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.overlay} />
      <Menu />
      <h1 className={styles.title}>{getTitle()}</h1>
    </header>
  );
};
