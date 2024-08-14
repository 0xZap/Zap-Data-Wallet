import React from "react";

interface ToggleProps {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
}

function ZapToggle({ isOn, onToggle }: ToggleProps) {
  const handleToggle = () => {
    onToggle(!isOn);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer shadow-md border-[2px] ${
        isOn ? "bg-secondary border-primary" : "bg-primary border-secondary"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
          isOn ? "translate-x-5 bg-primary" : "bg-secondary"
        }`}
      ></div>
    </div>
  );
}

export default ZapToggle;
