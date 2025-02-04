import { FC, useEffect } from "react";
import styles from "./slider.module.css";
import { IoMdClose } from "react-icons/io";
import cn from "classnames";

type SliderProps = {
  items: Array<{ title: string; cb: () => void; isActive?: boolean }>;
  isOpen: boolean;
  onClose: () => void;
};

export const Slider: FC<SliderProps> = ({ items, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <div className={cn(styles.slider, { [styles.isOpen]: isOpen })}>
        <IoMdClose className={styles.closeButton} onClick={onClose} />
        {items.map((item) => (
          <div
            key={item.title}
            onClick={() => {
              item.cb();
              onClose();
            }}
            className={cn(styles.item, {
              [styles.active]: item.isActive,
              [styles.isOpenItem]: isOpen,
            })}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div
        className={cn(styles.overlay, { [styles.isOverlayOpen]: isOpen })}
        onClick={onClose}
      />
    </>
  );
};
