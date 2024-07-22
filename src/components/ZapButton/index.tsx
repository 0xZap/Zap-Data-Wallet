import React from "react";
import { RefreshCw } from "react-feather";
//@ts-ignore
import { twMerge } from "tailwind-merge";

interface ZapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  loading?: boolean;
}

const ZapButton: React.FC<ZapButtonProps> = ({
  children,
  className = "",
  loading = false,
  ...rest
}) => {
  const mergedClassName = twMerge(
    "px-4 py-3 bg-secondary text-white font-semibold rounded-md shadow-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition all duration-500 cubic-bezier(0.4, 0, 0.2, 1) disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed",
    className
  );

  return (
    <button className={mergedClassName} {...rest}>
      {loading ? (
        <div className="flex flex-row items-center justify-center">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ZapButton;
