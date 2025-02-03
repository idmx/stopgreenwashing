import { FC } from "react";
import { Header } from "../header";

type LayoutProps = {
  children?: React.JSX.Element | string;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
