import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { urlify } from "../../utils/misc";
import browser from "webextension-polyfill";
import { BackgroundActiontype } from "../../entries/Background/rpc";
import { BaseApproval } from "../BaseApproval";
import { setList, getList, URL_PATTERNS_LS_KEY } from "../../utils/storage";
// import {
//   getPluginConfigByHash,
//   getPluginMetadataByHash,
// } from '../../entries/Background/db';

type DynamicProofMetadata = {
  icon: string;
  name: string;
  url: string;
  proofRegex: string;
  description: string;
};

type metadataListType = {
  [key: string]: DynamicProofMetadata;
};

export const metadataList: metadataListType = {
  revolut: {
    icon: "",
    name: "Revolut Transaction",
    url: "https://app.revolut.com/start",
    proofRegex: "https://app.revolut.com/api/retail/transaction/\\S+",
    description: "This is a revolut transaction proof",
  },
};

export function DynamicProofApproval(): ReactElement {
  const [params] = useSearchParams();
  const origin = params.get("origin");
  const favIconUrl = params.get("favIconUrl");
  const type = params.get("type");
  const hostname = urlify(origin || "")?.hostname;
  const [error, showError] = useState("");
  const [dynamicMetadata, setDynamicMetadata] = useState<DynamicProofMetadata>({
    icon: "",
    name: "",
    url: "",
    proofRegex: "",
    description: "",
  });
  const [urls, setUrls] = useState<string[]>([]);

  const onCancel = useCallback(() => {
    browser.runtime.sendMessage({
      type: BackgroundActiontype.run_dynamic_proof_response,
      data: false,
    });
  }, []);

  const onAccept = useCallback(async () => {
    if (!type) return;
    try {
      // Here I changed the urls in the database to push the dynamic url I want to access
      let updatedUrls = [...urls];
      if (!updatedUrls.includes(metadataList[type].proofRegex)) {
        updatedUrls.push(metadataList[type].proofRegex);
      }
      setList(URL_PATTERNS_LS_KEY, updatedUrls);
      console.log("Updated URLs", updatedUrls);
      setUrls([]);

      const tab = await browser.tabs.create({
        url: metadataList[type].url,
        active: true,
      });

      await browser.storage.local.set({ dynamic_type: type });

      chrome.sidePanel.setOptions({
        enabled: true,
      });

      // @ts-ignore
      if (chrome.sidePanel) await chrome.sidePanel.open({ tabId: tab.id });

      browser.runtime.sendMessage({
        type: BackgroundActiontype.run_dynamic_proof_response,
        data: true,
      });
    } catch (e: any) {
      showError(e.message);
    }
  }, [type]);

  useEffect(() => {
    (async () => {
      if (!type) return;

      // TODO: Here we need to create a Config in the ./db to then set and get
      // the dynamic proof metadata and config
      // I will do a mocked data version for now
      try {
        setDynamicMetadata(metadataList[type]);
      } catch (e: any) {
        showError(e?.message || "Invalid Content");
      }
    })();
  }, [type]);

  // Here I need to get the storedUrls to not modify anything pre-existing
  useEffect(() => {
    getList(URL_PATTERNS_LS_KEY).then((storedUrls) => {
      setUrls(storedUrls);
    });
  }, []);

  return (
    <BaseApproval
      header={`Execute Proof`}
      onSecondaryClick={onCancel}
      onPrimaryClick={onAccept}
    >
      <div className="flex flex-col items-center gap-2 py-8">
        {!!favIconUrl ? (
          <img
            src={favIconUrl}
            className="h-16 w-16 rounded-full border border-slate-200 bg-slate-200"
            alt="logo"
          />
        ) : (
          //   <Icon
          //     fa="fa-solid fa-globe"
          //     size={4}
          //     className="h-16 w-16 rounded-full border border-slate-200 text-blue-500"
          //   />
          <></>
        )}
        <div className="text-2xl text-center px-8 text-lightcolor">
          <b className="text-blue-500">{hostname}</b> wants to execute a proof
          in:
        </div>
      </div>
      {!dynamicMetadata && (
        <div className="flex flex-col items-center flex-grow gap-4 border border-slate-300 p-8 mx-8 rounded bg-slate-100">
          {/* <Icon
            className="animate-spin w-fit text-slate-500"
            fa="fa-solid fa-spinner"
            size={1}
          /> */}
        </div>
      )}
      {dynamicMetadata && (
        <div className="flex flex-col gap-4 border border-graycolor p-4 mx-8 rounded-md shadow-xl bg-black/30 backdrop-blur-md">
          <div className="flex flex-col items-center">
            {/* <img
              className="w-12 h-12 mb-2"
              src={dynamicMetadata.icon}
              alt="Plugin Icon"
            /> */}
            <span className="text-2xl text-blue-600 font-semibold">
              {dynamicMetadata.name}
            </span>
            {/* <div className="text-slate-500 text-base">
              {dynamicMetadata.description}
            </div> */}
          </div>
        </div>
      )}
    </BaseApproval>
  );
}
