import React, {
  // MouseEventHandler,
  ReactElement,
  useEffect,
  // ReactNode,
  // useEffect,
  // useState,
} from "react";
import {
  // setActiveTab,
  // setRequests,
  useActiveTab,
  useActiveTabUrl,
  useRequests,
} from "../../reducers/requests";
import ZapButton from "../../components/ZapButton";
import { useNavigate } from "react-router-dom";
import { Circle, ShoppingBag, Zap } from "react-feather";

export default function Home(): ReactElement {
  const navigate = useNavigate();
  const requests = useRequests();
  const activeTab = useActiveTab();
  const url = useActiveTabUrl();

  return (
    <div className="p-4 w-full flex flex-col flex-nowrap justify-center">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <div className="flex flex-col gap-2 flex-nowrap p-4 mt-6 shadow-xl bg-gradient-to-tr from-secondary to-[#4C8568] rounded-md">
        <p className="text-sm text-darkcolor">Total Points</p>
        <p className="text-2xl font-bold text-darkcolor">100 Zaps</p>
      </div>
      <div className="w-full flex flex-col gap-4 flex-nowrap p-4 mt-4 shadow-xl bg-black/10 backdrop-blur-md rounded-md">
        <p>Active tab</p>
        <div className="w-full flex flex-row items-center justify-start">
          {!!activeTab?.favIconUrl && (
            <img
              src={activeTab?.favIconUrl}
              className="h-6 mr-2 rounded-full"
              alt="logo"
            />
          )}
          <div className="text-md text-graycolor">{url?.hostname}</div>
        </div>
      </div>
      <div className="flex flex-row gap-4 flex-nowrap mt-4 w-full">
        <div
          className="w-full flex flex-row justify-between items-center flex-nowrap p-4 shadow-xl bg-black/10 backdrop-blur-md border-[1px] border-primary hover:bg-black/40 hover:border-secondary text-lightcolor hover:text-secondary rounded-md transition all duration-500 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer"
          onClick={() => navigate("/static-history")}
        >
          <p className="text-md font-bold">
            Static <br></br> Proofs
          </p>
          <Circle className="h-6 w-6" />
        </div>
        <div
          className="w-full flex flex-row justify-between items-center flex-nowrap p-4 shadow-xl bg-black/10 backdrop-blur-md border-[1px] border-primary hover:bg-black/40 hover:border-secondary text-lightcolor hover:text-secondary rounded-md transition all duration-500 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer"
          onClick={() => navigate("/dynamic-history")}
        >
          <p className="text-md font-bold">
            Dynamic <br></br> Proofs
          </p>
          <Zap className="h-6 w-6" />
        </div>
      </div>
      <div
        className="mt-4 w-full flex flex-row justify-between items-center flex-nowrap p-4 shadow-xl bg-black/10 backdrop-blur-md border-[1px] border-primary hover:bg-black/40 hover:border-secondary text-lightcolor hover:text-secondary rounded-md transition all duration-500 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer"
        onClick={() => navigate("/exploration")}
      >
        <p className="text-md font-bold">Explore Zap Ecosystem</p>
        <ShoppingBag className="h-6 w-6" />
      </div>
      <ZapButton
        className="w-full bg-black/10 backdrop-blur-md shadow-xl mt-4"
        onClick={() => navigate("/requests")}
      >
        <p className="">
          <span>Requests</span>
          <span>{`(${requests.length})`}</span>
        </p>
      </ZapButton>
    </div>
  );
}
