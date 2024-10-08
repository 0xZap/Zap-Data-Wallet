import React from "react";
//@ts-ignore
import { twMerge } from "tailwind-merge";

interface ZapInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const ZapInput: React.FC<ZapInputProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const mergedClassName = twMerge(
    "py-3 px-4 text-lightcolor bg-black/15 backdrop-blur-md text-[1.25em] rounded-md border-[1px] border-primary placeholder:text-graycolor transition all duration-500 focus:border-lightcolor focus:outline-0 cubic-bezier(0.4, 0, 0.2, 1)",
    className
  );

  return (
    <input className={mergedClassName} {...rest}>
      {children}
    </input>
  );
};

export default ZapInput;
