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
import { useSelector } from "react-redux";
import { AppRootState } from "../../reducers";

export default function Home(): ReactElement {
  const navigate = useNavigate();
  const requests = useRequests();
  const activeTab = useActiveTab();
  const url = useActiveTabUrl();
  
  const userDetails = useSelector(
    (state: AppRootState) => state.auth.user
  )

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-lightcolor">
      <div className="relative z-10 text-center text-darkcolor p-4 w-full flex flex-col flex-nowrap justify-center">
        <div className="w-full">
          <h1>User - {userDetails?.displayName}</h1>
          <h1>TEST AREA FOR ACTIVE TAB:</h1>
          <div className="w-full flex flex-row items-center justify-center space-x-2 py-6">
            {!!activeTab?.favIconUrl && (
              <img
                src={activeTab?.favIconUrl}
                className="h-5 rounded-full"
                alt="logo"
              />
            )}
            <div className="text-xs text-darkcolor">{url?.hostname}</div>
          </div>
        </div>
        <div className="w-full">
          <h1>TEST AREA FOR REQUESTS:</h1>
          <div className="w-full flex flex-col items-center justify-center space-y-4 py-6">
            <p className="text-xs text-darkcolor">
              <span>Requests</span>
              <span>{`(${requests.length})`}</span>
            </p>
            <ZapButton
              className="w-full"
              onClick={() => console.log("REQUESTS", requests)}
            >
              Test Requests
            </ZapButton>
            <ZapButton
              className="w-full"
              onClick={() => navigate("/url-options")}
            >
              Url Options
            </ZapButton>
            <ZapButton className="w-full" onClick={() => navigate("/requests")}>
              Requests
            </ZapButton>
          </div>
        </div>
      </div>
      {/* <div className="bg-black/50 backdrop-blur-lg absolute inset-0 z-0"></div> */}
    </div>
  );
}
