import { useNavigate } from "react-router-dom";
import styles from "./menu.module.css";

export const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.menu}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        stop greenwashing
      </div>
      <div className={styles.rightSide}>
        <div className={styles.menuItem} onClick={() => navigate("/")}>
          Главная страница
        </div>
        <div className={styles.menuItem} onClick={() => navigate("/handbook")}>
          Справочник
        </div>
        <div className={styles.menuItem} onClick={() => navigate("/scanner")}>
          Сканер
        </div>
      </div>
    </div>
  );
};
