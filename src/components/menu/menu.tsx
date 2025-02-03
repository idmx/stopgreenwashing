import { useNavigate } from "react-router-dom";
import styles from "./menu.module.css";
import { Slider } from "../slider";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleMainPage = () => navigate("/");
  const handleHandbook = () => navigate("/handbook");
  const handleScanner = () => navigate("/scanner");

  const items = [
    { title: "Главная страница", cb: handleMainPage },
    { title: "Справочник", cb: handleHandbook },
    { title: "Сканер", cb: handleScanner },
  ];

  return (
    <>
      <div className={styles.menu}>
        <div className={styles.leftSide}>
          <RxHamburgerMenu
            className={styles.burgerButton}
            onClick={() => setIsOpen(true)}
          />
          <div className={styles.logo} onClick={handleMainPage}>
            stop greenwashing
          </div>
        </div>

        <div className={styles.rightSide}>
          {items.map((item) => (
            <div className={styles.menuItem} onClick={item.cb} key={item.title}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
      <Slider isOpen={isOpen} onClose={() => setIsOpen(false)} items={items} />
    </>
  );
};
