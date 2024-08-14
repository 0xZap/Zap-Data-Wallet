import React from "react";
import { Home, User, Settings, Zap, Circle, ShoppingBag } from "react-feather";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 w-full h-14 z-20">
      <div className="relative">
        {/* Main content */}
        <div className="shadow-up border-t-[1px] border-primary bg-bkgcolor text-lightcolor">
          {/* Gradient overlay from bottom to top */}
          <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-bkgcolor opacity-50 to-transparent pointer-events-none"></div>

          <div className="flex justify-around p-4">
            <div
              onClick={() => navigate("/home")}
              className="group flex flex-col items-center space-y-1"
            >
              <Home className="h-6 w-6 group-hover:text-secondary cursor-pointer transition-all duration-500 ease-in-out" />
            </div>
            <div
              onClick={() => navigate("/exploration")}
              className="group flex flex-col items-center space-y-1"
            >
              <ShoppingBag className="h-6 w-6 group-hover:text-secondary cursor-pointer transition-all duration-500 ease-in-out" />
            </div>
            <div
              onClick={() => navigate("/dynamic-history")}
              className="group flex flex-col items-center space-y-1"
            >
              <Zap className="h-6 w-6 group-hover:text-secondary cursor-pointer transition-all duration-500 ease-in-out" />
            </div>
            <div
              onClick={() => navigate("/static-history")}
              className="group flex flex-col items-center space-y-1"
            >
              <Circle className="h-6 w-6 group-hover:text-secondary cursor-pointer transition-all duration-500 ease-in-out" />
            </div>
            <div
              onClick={() => navigate("/url-options")}
              className="group flex flex-col items-center space-y-1"
            >
              <Settings className="h-6 w-6 group-hover:text-secondary cursor-pointer transition-all duration-500 ease-in-out" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
