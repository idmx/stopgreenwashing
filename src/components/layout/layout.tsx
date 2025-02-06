import { FC } from "react";
import { Header } from "../header";
import styles from "./layout.module.css";
import { Footer } from "../footer";

type LayoutProps = {
  children?: React.JSX.Element | string;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.layout}>{children}</main>
      <Footer />
    </>
  );
};
