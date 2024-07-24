import React, { ReactElement, useCallback, useEffect, useState } from "react";
import "./index.scss";
import browser from "webextension-polyfill";
// import { fetchPluginConfigByHash, runPlugin } from "../../utils/rpc";
// import {
//   getPluginConfig,
//   hexToArrayBuffer,
//   makePlugin,
//   PluginConfig,
//   StepConfig,
// } from "../../utils/misc";
// import { PluginList } from "../../components/PluginList";
// import DefaultPluginIcon from "../../assets/img/default-plugin-icon.png";
// import logo from "../../assets/img/icon-128.png";
// import classNames from "classnames";
// import Icon from "../../components/Icon";
// import { useRequestHistory } from "../../reducers/history";
// import { BackgroundActiontype } from "../Background/rpc";
// import { getPluginByHash, getPluginConfigByHash } from "../Background/db";
import ZapButton from "../../components/ZapButton";
import { SidePanelActionTypes } from "./types";
import { CheckCircle, XCircle } from "react-feather";
import {
  setActiveTab,
  setRequests,
  useRequest,
  useRequests,
} from "../../reducers/requests";
import { BackgroundActiontype, RequestLog } from "../Background/rpc";
import { metadataList } from "../../pages/DynamicProofApproval";
import { urlify } from "../../utils/misc";
import store from "../../utils/store";
import { useDispatch } from "react-redux";
import axios from "axios";

export type StepConfig = {
  title: string;
  description?: string;
  cta: string;
  action: string;
  url?: string;
};

const stepsRevolut: StepConfig[] = [
  {
    title: "Access Revolut Account",
    description: "Login with your credentials",
    cta: "Check Revolut Access",
    action: "Link",
    url: "^https://app\\.revolut\\.com/home$",
  },
  {
    title: "Access Transaction Info",
    description: "Go to your transaction details",
    cta: "Check Transaction Info",
    action: "Link",
    url: "^https://app\\.revolut\\.com/transactions/[a-z0-9-]+\\?legId=[a-z0-9-]+&accountId=[a-z0-9-]+$",
  },
  // {
  //   title: "Step 3",
  //   description: "Description 3",
  //   cta: "Notarize Request",
  //   action: "Notarize",
  // },
  {
    title: "Verify Proof",
    description: "Verify the notarized data received",
    cta: "Verify",
    action: "Verify",
  },
];

type stepsType = {
  [key: string]: StepConfig[];
};

const steps: stepsType = {
  revolut: stepsRevolut,
};

export default function SidePanel(): ReactElement {
  //   const [config, setConfig] = useState<PluginConfig | null>(null);
  const [type, settype] = useState("revolut");
  const dispatch = useDispatch();

  useEffect(() => {
    (async function () {
      const result = await browser.storage.local.get("dynamic_type");
      console.log("result", result);
      const { dynamic_type } = result;

      // TODO: Here we need to create a Config in the ./db to then set and get
      // the dynamic proof metadata and config
      // I will do a mocked data version for now

      // const config = await getPluginConfigByHash(type);
      settype(dynamic_type);
      // setConfig(config);
      //   await browser.storage.local.set({ dynamic_type: "" });
    })();
  }, []);

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

      // await browser.runtime.sendMessage({
      //   type: BackgroundActiontype.get_prove_requests,
      //   data: tab?.id,
      // });
    })();
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
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
        // case BackgroundActiontype.change_route: {
        //   if (request.data.tabId === "background") {
        //     navigate(request.route);
        //     break;
        //   }
        // }
      }
    });
  }, []);

  return (
    <div className="flex flex-col bg-darkcolor w-screen h-screen overflow-hidden">
      <div className="relative flex flex-nowrap flex-shrink-0 flex-row items-center gap-2 h-9 p-2 cursor-default justify-center bg-primary w-full">
        {/* <img className="h-5" src={logo} alt="logo" /> */}
        <button
          className="button absolute right-2 text-darkcolor"
          onClick={() => window.close()}
        >
          Close
        </button>
      </div>
      {/* {!config && <PluginList />}
      {config && <PluginBody hash={hash} config={config} />} */}
      <div className="flex-1 overflow-y-auto">
        <RequestBody type={type} />
      </div>
    </div>
  );
}

function RequestBody(props: {
  //   config: PluginConfig;
  type: string;
}): ReactElement {
  const { type } = props;
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [processStepId, setProcessStepId] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const requests = useRequests();
  // TODO: Tudo que ta aqui vou ter que mudar
  const [txId, setTxId] = useState<string | undefined>();
  const [txCurrency, setTxCurrency] = useState<string | undefined>();
  const [txAmount, setTxAmount] = useState<string | undefined>();
  const [txRecipient, setTxRecipient] = useState<string | undefined>();
  const [txProof, setTxProof] = useState<string | undefined>();
  // here comes back to normal
  const [proofData, setProofData] = useState<any>();
  const [requestId, setRequestId] = useState<string | undefined>();
  const [filteredRequests, setFilteredRequests] = useState<RequestLog[]>([]);
  const req = useRequest(requestId);
  const [loading, setLoading] = useState(false);
  //   const { title, description, icon, steps } = props.config;
  //   const [responses, setResponses] = useState<any[]>([]);
  //   const [notarizationId, setNotarizationId] = useState("");
  //   const notaryRequest = useRequestHistory(notarizationId);

  //   const setResponse = useCallback(
  //     (response: any, i: number) => {
  //       const result = responses.concat();
  //       result[i] = response;
  //       setResponses(result);
  //       if (i === steps!.length - 1 && !!response) {
  //         setNotarizationId(response);
  //       }
  //     },
  //     [hash, responses]
  //   );

  useEffect(() => {
    if (requests) {
      const regex = new RegExp(metadataList[type].proofRegex);
      const filteredRequests = requests.filter((request) =>
        regex.test(request.url)
      );

      setFilteredRequests(filteredRequests);

      if (filteredRequests.length > 0) {
        setRequestId(filteredRequests[filteredRequests.length - 1].requestId);
      } else {
        setRequestId(undefined);
      }
    } else {
      setFilteredRequests([]);
    }
  }, [requests]);

  useEffect(() => {
    if (status === "success") {
      browser.runtime.sendMessage({
        type: SidePanelActionTypes.execute_dynamic_proof_response,
        data: {
          type,
          proof: proofData,
        },
      });
    } else if (status === "error") {
      browser.runtime.sendMessage({
        type: SidePanelActionTypes.execute_dynamic_proof_response,
        data: {
          type,
          error: "error",
        },
      });
    }
  }, [type, status]);

  useEffect(() => {
    const handleTabUpdated = async (
      _tabId: any,
      changeInfo: any,
      _tab: any
    ) => {
      if (changeInfo.url) {
        setCurrentUrl(changeInfo.url);
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []);

  const handleNotarizeRequest = useCallback(async () => {
    setLoading(true);
    if (!filteredRequests || filteredRequests.length === 0) return;

    if (!req) return;

    console.log("Request: ", req);

    const hostname = urlify(req.url)?.hostname;
    const headers: { [k: string]: string } = req.requestHeaders.reduce(
      (acc: any, h) => {
        acc[h.name] = h.value;
        return acc;
      },
      { Host: hostname }
    );

    //TODO: for some reason, these needs to be override to work
    headers["Accept-Encoding"] = "identity";
    headers["Connection"] = "close";

    const data = {
      url: req.url,
      method: req.method,
      headers: headers,
      body: req.requestBody,
    };

    console.log("Data: ", data);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/proof_of_transaction",
        data
      );
      console.log("Response: ", response);
      setTxId(response.data.id);
      setTxCurrency(response.data.currency);
      setTxAmount(response.data.amount);
      setTxRecipient(response.data.recipient);
      setTxProof(response.data.transaction_proof);

      const transactionData = {
        tlsn_id: response.data.id,
        currency: response.data.currency,
        amount: response.data.amount,
        recipient: response.data.recipient,
        transaction_proof: response.data.transaction_proof,
      };

      setProofData(transactionData);

      // chrome.runtime.sendMessage({
      //   action: "request_extension_data",
      //   data: transactionData,
      // });

      setLoading(false);
    } catch (error) {
      console.error("Error: ", error);
      setLoading(false);
    }
  }, [req]);

  function divideAndFormat(numberStr: string): string {
    // Convert the string to a BigInt
    const number = BigInt(numberStr);

    // Perform the division
    const divisor = BigInt(10 ** 18);
    const result = number / divisor;

    // Get the remainder for the decimal part
    const remainder = number % divisor;
    const decimalPart = Number(remainder) / Number(divisor);

    // Format the result with 2 decimal places
    const formattedResult = `${result}.${Math.floor(decimalPart * 100)
      .toString()
      .padStart(2, "0")}`;

    return formattedResult;
  }

  function handleSendProof() {
    setStatus("success");
  }

  return (
    <div className="flex flex-col px-4">
      {/* <div className="flex flex-row items-center gap-4">
        <img className="w-12 h-12 self-start" src={icon || DefaultPluginIcon} />
        <div className="flex flex-col w-full items-start">
          <div className="font-bold flex flex-row h-6 items-center justify-between w-full text-base">
            {type}
          </div>
          <div className="text-slate-500 text-sm">{description}</div>
        </div>
      </div> */}
      <div className="flex flex-col items-start gap-6 mt-8">
        {/* {steps?.map((step, i) => (
          <StepContent
            hash={hash}
            index={i}
            setResponse={setResponse}
            lastResponse={i > 0 ? responses[i - 1] : undefined}
            responses={responses}
            {...step}
          />
        ))} */}
        {/* <ZapButton className="w-full" onClick={() => setStatus("success")}>
          Success
        </ZapButton>
        <ZapButton className="w-full" onClick={() => setStatus("error")}>
          Error
        </ZapButton> */}
        {steps[type]?.map((step, i) => (
          <StepContent
            key={i}
            index={i}
            processStepId={processStepId}
            setProcessStepId={setProcessStepId}
            currentUrl={currentUrl}
            handleNotarizeRequest={handleNotarizeRequest}
            loading={loading}
            {...step}
          />
        ))}
      </div>
      <div className="w-full flex flex-col items-start gap-4 mt-6">
        <div className="w-full p-4 flex flex-col gap-2 flex-nowrap border-[1px] border-primary rounded-md">
          <p className="text-lightcolor truncate">
            <span className="font-bold">Transaction ID: </span>
            {txId}
          </p>
          <p className="text-lightcolor truncate">
            <span className="font-bold">Currency: </span>
            {txCurrency}
          </p>
          <p className="text-lightcolor truncate">
            <span className="font-bold">Amount: </span> ${" "}
            {divideAndFormat(txAmount ?? "0")}
          </p>
          <p className="text-lightcolor truncate">
            <span className="font-bold">Recipient: </span> @{txRecipient}
          </p>
          <p className="text-lightcolor truncate">
            <span className="font-bold">Proof: </span>
            {txProof}
          </p>
        </div>
        <div className="flex flex-row text-base w-full">
          {/* <div className="text-lightcolor self-start">
            {steps[type]?.length + 1}
          </div> */}
          <div className="flex flex-col flex-grow flex-shrink w-0">
            <ZapButton
              onClick={handleSendProof}
              className="w-full text-sm py-2 text-darkcolor"
            >
              Send Proof to Z2Z
            </ZapButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepContent(
  props: StepConfig & {
    index: number;
    processStepId: number;
    setProcessStepId: any;
    currentUrl: string;
    handleNotarizeRequest: () => void;
    loading: boolean;
  }
): ReactElement {
  const {
    title,
    description,
    cta,
    action,
    url,
    index,
    processStepId,
    setProcessStepId,
    currentUrl,
    handleNotarizeRequest,
    loading,
  } = props;
  const [completed, setCompleted] = useState(false);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  const getCurrentTabUrl = () => {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0].url);
      });
    });
  };

  const handleClick = async () => {
    try {
      setError("");
      if (action === "Link") {
        const currentUrl = await getCurrentTabUrl();

        // Compile the regex from the string stored in url
        const urlRegex = url ? new RegExp(url) : null;

        if (urlRegex && urlRegex.test(currentUrl as string)) {
          setCompleted(true);
          setProcessStepId(processStepId + 1);
        } else {
          // raise error here
          console.log("URL não correspondente:", currentUrl);
          setError("URL verification does not match");
        }
      } else if (action === "Notarize") {
        console.log("Notarize action triggered");
        // Dummy function for Notarize
      } else if (action === "Verify") {
        console.log("Verify action triggered");
        await handleNotarizeRequest();
        setCompleted(true);
        setProcessStepId(processStepId + 1);
        // Dummy function for Verify
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Unkonwn error");
    }
  };

  useEffect(() => {
    const checkUrl = async () => {
      if (action === "Link" && !pending && !completed) {
        const urlRegex = url ? new RegExp(url) : null;
        if (urlRegex && urlRegex.test(currentUrl)) {
          setError("");
          setCompleted(true);
          setProcessStepId(processStepId + 1);
        }
      }
    };

    checkUrl();
  }, [currentUrl, action, url, processStepId, setProcessStepId]);

  useEffect(() => {
    if (index === processStepId) {
      setPending(false);
    }
  }, [processStepId]);

  return (
    <div className="flex flex-row gap-4 text-base w-full">
      <div className="text-lightcolor self-start">{index + 1}.</div>
      <div className="flex flex-col flex-grow flex-shrink w-0">
        <div
          className={`font-semibold ${
            completed ? "line-through text-lightcolor" : "text-blue-500"
          }`}
        >
          {title}
        </div>
        {!!description && (
          <div className="text-lightcolor text-sm">{description}</div>
        )}
        {/* {!!error && <div className="text-red-500 text-sm">{error}</div>} */}
        <ZapButton
          onClick={handleClick}
          disabled={completed || pending || loading}
          loading={loading && action === "Verify"}
          className={`w-full text-sm py-2 mt-4 text-darkcolor ${
            completed
              ? "disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-500"
              : ""
          }`}
        >
          {cta}
        </ZapButton>
        {!!error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
}

// function StepContent(
//   props: StepConfig & {
//     hash: string;
//     index: number;
//     setResponse: (resp: any, i: number) => void;
//     responses: any[];
//     lastResponse?: any;
//   }
// ): ReactElement {
//   const {
//     index,
//     title,
//     description,
//     cta,
//     action,
//     setResponse,
//     lastResponse,
//     prover,
//     hash,
//   } = props;
//   const [completed, setCompleted] = useState(false);
//   const [pending, setPending] = useState(false);
//   const [error, setError] = useState("");
//   const [notarizationId, setNotarizationId] = useState("");
//   const notaryRequest = useRequestHistory(notarizationId);

//   const getPlugin = useCallback(async () => {
//     const hex = await getPluginByHash(hash);
//     const config = await getPluginConfigByHash(hash);
//     const arrayBuffer = hexToArrayBuffer(hex!);
//     return makePlugin(arrayBuffer, config!);
//   }, [hash]);

//   const processStep = useCallback(async () => {
//     const plugin = await getPlugin();
//     if (!plugin) return;
//     if (index > 0 && !lastResponse) return;

//     setPending(true);
//     setError("");

//     try {
//       const out = await plugin.call(action, JSON.stringify(lastResponse));
//       const val = JSON.parse(out.string());
//       if (val && prover) {
//         setNotarizationId(val);
//       } else {
//         setCompleted(!!val);
//       }
//       setResponse(val, index);
//     } catch (e: any) {
//       console.error(e);
//       setError(e?.message || "Unkonwn error");
//     } finally {
//       setPending(false);
//     }
//   }, [action, index, lastResponse, prover, getPlugin]);

//   const onClick = useCallback(() => {
//     if (
//       pending ||
//       completed ||
//       notaryRequest?.status === "pending" ||
//       notaryRequest?.status === "success"
//     )
//       return;
//     processStep();
//   }, [processStep, pending, completed, notaryRequest]);

//   const viewProofInPopup = useCallback(async () => {
//     if (!notaryRequest) return;
//     chrome.runtime.sendMessage<any, string>({
//       type: BackgroundActiontype.verify_prove_request,
//       data: notaryRequest,
//     });
//     await browser.runtime.sendMessage({
//       type: BackgroundActiontype.open_popup,
//       data: {
//         position: {
//           left: window.screen.width / 2 - 240,
//           top: window.screen.height / 2 - 300,
//         },
//         route: `/verify/${notaryRequest.id}`,
//       },
//     });
//   }, [notaryRequest, notarizationId]);

//   useEffect(() => {
//     processStep();
//   }, [processStep]);

//   let btnContent = null;

//   if (completed) {
//     btnContent = (
//       <button
//         className={classNames(
//           "button mt-2 w-fit flex flex-row flex-nowrap items-center gap-2",
//           "!bg-green-200 !text-black cursor-default border border-green-500 rounded"
//         )}
//       >
//         <Icon className="text-green-600" fa="fa-solid fa-check" />
//         <span className="text-sm">DONE</span>
//       </button>
//     );
//   } else if (notaryRequest?.status === "success") {
//     btnContent = (
//       <button
//         className={classNames(
//           "button button--primary mt-2 w-fit flex flex-row flex-nowrap items-center gap-2"
//         )}
//         onClick={viewProofInPopup}
//       >
//         <span className="text-sm">View Proof</span>
//       </button>
//     );
//   } else if (notaryRequest?.status === "pending" || pending || notarizationId) {
//     btnContent = (
//       <button className="button mt-2 w-fit flex flex-row flex-nowrap items-center gap-2 cursor-default">
//         <Icon className="animate-spin" fa="fa-solid fa-spinner" size={1} />
//         <span className="text-sm">{cta}</span>
//       </button>
//     );
//   } else {
//     btnContent = (
//       <button
//         className={classNames(
//           "button mt-2 w-fit flex flex-row flex-nowrap items-center gap-2"
//         )}
//         disabled={index > 0 && typeof lastResponse === "undefined"}
//         onClick={onClick}
//       >
//         <span className="text-sm">{cta}</span>
//       </button>
//     );
//   }

//   return (
//     <div className="flex flex-row gap-4 text-base w-full">
//       <div className="text-slate-500 self-start">{index + 1}.</div>
//       <div className="flex flex-col flex-grow flex-shrink w-0">
//         <div
//           className={classNames("font-semibold", {
//             "line-through text-slate-500": completed,
//           })}
//         >
//           {title}
//         </div>
//         {!!description && (
//           <div className="text-slate-500 text-sm">{description}</div>
//         )}
//         {!!error && <div className="text-red-500 text-sm">{error}</div>}
//         {btnContent}
//       </div>
//     </div>
//   );
// }
