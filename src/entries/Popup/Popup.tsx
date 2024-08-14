import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import UrlOptions from "../../pages/UrlOptions";
import RequestTable from "../../pages/RequestTable";
import Layout from "../../pages/Layout";
import DynamicHistory from "../../pages/Dynamic";
import StaticHistory from "../../pages/Static";
import ExplorationPage from "../../pages/Exploration";
import TestPage from "../../pages/Test";
import { ConnectionApproval } from "../../pages/ConnectionApproval";
import { DynamicProofApproval } from "../../pages/DynamicProofApproval";
// import {
//   setActiveTab,
//   setRequests,
//   useActiveTab,
//   useActiveTabUrl,
// } from '../../reducers/requests';
import { useDispatch } from "react-redux";
import { setAuth } from "../../reducers/authSlice";
import { getAuthToken, setAuthToken } from "../../utils/storage";
import { useSelector } from "react-redux";
import { AppRootState } from "../../reducers";
import {
  setActiveTab,
  setRequests,
  useRequests,
} from "../../reducers/requests";
import { BackgroundActiontype } from "../../entries/Background/rpc";
import browser from "webextension-polyfill";
import store from "../../utils/store";

const Popup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: AppRootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    getAuthToken().then((token) => {
      if (token) {
        dispatch(setAuth({ isAuthenticated: true, token }));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const [tab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      dispatch(setActiveTab(tab || null));

      const logs = await browser.runtime.sendMessage({
        type: BackgroundActiontype.get_requests,
        data: tab?.id,
      });

      dispatch(setRequests(logs));

      await browser.runtime.sendMessage({
        type: BackgroundActiontype.get_prove_requests,
        data: tab?.id,
      });
    })();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      console.log("request in the useeffect popup", request);
      switch (request.type) {
        case BackgroundActiontype.push_action: {
          // if (
          //   request.data.tabId === store.getState().requests.activeTab?.id ||
          //   request.data.tabId === "background"
          // ) {
          //   store.dispatch(request.action);
          // }
          store.dispatch(request.action);
          break;
        }
        case BackgroundActiontype.change_route: {
          if (request.data.tabId === "background") {
            navigate(request.route);
            break;
          }
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/url-options"
          element={
            isAuthenticated ? (
              <Layout>
                <UrlOptions />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/requests"
          element={
            isAuthenticated ? (
              <Layout>
                <RequestTable />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dynamic-history"
          element={
            isAuthenticated ? (
              <Layout>
                <DynamicHistory />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/static-history"
          element={
            isAuthenticated ? (
              <Layout>
                <StaticHistory />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/exploration"
          element={
            isAuthenticated ? (
              <Layout>
                <ExplorationPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/test"
          element={
            isAuthenticated ? (
              <Layout>
                <TestPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/connection-approval" element={<ConnectionApproval />} />
        <Route
          path="/dynamic-proof-approval"
          element={<DynamicProofApproval />}
        />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
};

export default Popup;
