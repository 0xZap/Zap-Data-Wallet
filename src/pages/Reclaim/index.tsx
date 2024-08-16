import React, { ReactElement, useEffect, useState } from "react";
import { setZapPoints } from "../../utils/storage";
import { Reclaim } from "@reclaimprotocol/js-sdk";
import QRCode from "react-qr-code";
import { useSearchParams } from "react-router-dom";

export default function ReclaimPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const providerIdIndex = searchParams.get("index");

  const [message, setMessage] = useState("");
  const [requestUrl, setRequestUrl] = useState("");
  const [signature, setSignature] = useState("");
  const [username, setUsername] = useState("");
  const [verified, setVerified] = useState(false);

  const getVerificationReq = async (providerIdIndex: any) => {
    try {
      const APP_ID = "0xA38277348B7F9d0b0c4ceA9B17Aad749f4e9663A";
      const reclaimClient = new Reclaim.ProofRequest(APP_ID);

      const providerIds = [
        "bc7b8b4f-768a-42a1-8207-f82731951413", // 111
        "6d3f6753-7ee6-49ee-a545-62f1b1822ae5", // GitHub UserName
        "f9f383fd-32d9-4c54-942f-5e9fda349762", // Gmail Account
        "05a9c47e-274b-491d-92cc-9fa48210b59a", // identity_github01
      ];

      await reclaimClient.buildProofRequest(providerIds[providerIdIndex]);

      const APP_SECRET =
        "0xac56092d905741bc6b64a24c66c4b68f71146f85945e33ba34cc283ae39d0fe4"; // your app secret key.
      reclaimClient.setSignature(
        await reclaimClient.generateSignature(APP_SECRET)
      );

      const { requestUrl } = await reclaimClient.createVerificationRequest();

      setRequestUrl(requestUrl);

      await reclaimClient.startSession({
        onSuccessCallback: (proof: any) => {
          console.log("Verification success", proof);

          if (proof && proof.length > 0) {
            const proofData = proof[0]; // Acessa o primeiro item do array proof

            // Extrai a signature
            const signature = proofData.signatures
              ? proofData.signatures[0]
              : null;

            // Extrai e processa o username do contexto
            const contextData = JSON.parse(proofData.claimData.context);
            const username = contextData.extractedParameters.username;

            console.log("Signature:", signature);
            console.log("Username:", username);

            setSignature(signature);
            setUsername(username);
            setVerified(true);

            const pointsToAdd = 10;
            setZapPoints(pointsToAdd);
          }

          setMessage("Verification success");
        },
        onFailureCallback: (error: any) => {
          console.error("Verification failed", error);
          setMessage("Verification failed");
        },
      });
    } catch (error) {
      console.error("An error occurred", error);
      setMessage("An error occurred");
    }
  };

  // useEffect to call getVerificationReq on page load
  useEffect(() => {
    if (providerIdIndex !== null) {
      getVerificationReq(providerIdIndex);
    }
  }, [providerIdIndex]);

  return (
    <div className="flex flex-col flex-nowrap flex-grow p-4">
      <div className="w-full flex justify-start">
        <img
          src="../../assets/zap-logo.png"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <h1 className="text-xl text-lightcolor mt-4">Reclaim QR Code</h1>
      <div className="flex flex-col gap-4 flex-nowrap overflow-y-auto mt-4">
        {requestUrl && !verified && <QRCode value={requestUrl} />}
        <p className="text-white mt-4">{message}</p>
        <p className="text-blue-600 mt-4 truncate">{signature}</p>
        <p className="text-blue-600 mt-4 truncate">{username}</p>
      </div>
    </div>
  );
}
