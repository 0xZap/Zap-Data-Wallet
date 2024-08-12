import React from "react";
import Header from "../../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-primary to-bkgcolor text-lightcolor">
      <Header />
      <div
        className="flex-grow overflow-y-auto scrollbar"
        style={{ maxHeight: "calc(100vh - 56px)" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
