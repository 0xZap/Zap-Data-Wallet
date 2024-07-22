import React from "react";
import { Home, User, Settings } from "react-feather";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 w-full shadow-up border-t-[1px] border-graycolor bg-lightcolor text-graycolor">
      <div className="flex justify-around p-4">
        <div
          onClick={() => navigate("/home")}
          className="flex flex-col items-center space-y-1"
        >
          <Home className="h-6 w-6 hover:text-primary cursor-pointer transition-all duration-500 ease-in-out" />
        </div>
        <div
          onClick={() => navigate("/requests")}
          className="flex flex-col items-center space-y-1"
        >
          <User className="h-6 w-6 hover:text-primary cursor-pointer transition-all duration-500 ease-in-out" />
        </div>
        <div
          onClick={() => navigate("/history")}
          className="flex flex-col items-center space-y-1"
        >
          <User className="h-6 w-6 hover:text-primary cursor-pointer transition-all duration-500 ease-in-out" />
        </div>
        <div
          onClick={() => navigate("/url-options")}
          className="flex flex-col items-center space-y-1"
        >
          <Settings className="h-6 w-6 hover:text-primary cursor-pointer transition-all duration-500 ease-in-out" />
        </div>
      </div>
    </div>
  );
};

export default Header;
