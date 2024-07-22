import React from "react";
import Header from "../../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex-grow overflow-y-auto">{children}</div>
      <Header />
    </div>
  );
};

export default Layout;
