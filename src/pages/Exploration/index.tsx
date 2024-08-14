import React, { ReactElement } from "react";

interface ExporationSolution {
  name: string;
  url: string;
}

const explorationSolutions: ExporationSolution[] = [
  { name: "Z2Z", url: "https://x.com" },
  { name: "Zap Market", url: "https://instagram.com" },
];

export default function ExplorationPage(): ReactElement {
  return (
    <div className="flex flex-col flex-nowrap flex-grow p-4">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <h1 className="text-xl text-lightcolor mt-4">Exlore Zap Solutions</h1>
      <div className="flex flex-col gap-4 flex-nowrap overflow-y-auto mt-4">
        {explorationSolutions.map((solution, index) => (
          <div
            key={index}
            className="w-full p-4 flex flex-row space-x-4 items-center shadow-xl bg-black/10 backdrop-blur-md rounded-md hover:text-primary hover:bg-secondary transition all duration-500 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer"
          >
            <p className="text-lightcolor font-bold">{solution.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
