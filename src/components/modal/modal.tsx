import { FC, useEffect, useRef } from "react";
import cn from "classnames";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";

import styles from "./modal.module.css";

interface DesktopModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}

export const Modal: FC<DesktopModalProps> = ({
  onClose,
  children,
  isOpen,
  className,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.shadowContainer}>
      <div className={styles.modalBody}>
        {onClose && (
          <IoMdClose className={styles.closeButton} onClick={onClose} />
        )}
        <div className={cn(styles.contentContainer, className)} ref={modalRef}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
