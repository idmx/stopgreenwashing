import { FC } from "react";
import { Header } from "../header";
import styles from "./layout.module.css";

type LayoutProps = {
  children?: React.JSX.Element | string;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.layout}>{children}</div>
    </>
  );
};
