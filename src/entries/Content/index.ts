import browser from "webextension-polyfill";
import { ContentScriptRequest, ContentScriptTypes, RPCServer } from "./rpc";
import { BackgroundActiontype, RequestHistory } from "../Background/rpc";
import { urlify } from "../../utils/misc";

(async () => {
  loadScript("content.bundle.js");
  const server = new RPCServer();

  server.on(ContentScriptTypes.connect, async () => {
    const connected = await browser.runtime.sendMessage({
      type: BackgroundActiontype.connect_request,
      data: {
        ...getPopupData(),
      },
    });

    console.log("connected in index.ts", connected);

    if (!connected) throw new Error("user rejected.");

    return connected;
  });

  // server.on(
  //   ContentScriptTypes.get_history,
  //   async (
  //     request: ContentScriptRequest<{
  //       method: string;
  //       url: string;
  //       metadata?: { [k: string]: string };
  //     }>
  //   ) => {
  //     const {
  //       method: filterMethod,
  //       url: filterUrl,
  //       metadata,
  //     } = request.params || {};

  //     if (!filterMethod || !filterUrl)
  //       throw new Error("params must include method and url.");

  //     const response: RequestHistory[] = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.get_history_request,
  //       data: {
  //         ...getPopupData(),
  //         method: filterMethod,
  //         url: filterUrl,
  //         metadata,
  //       },
  //     });

  //     return response;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.get_proof,
  //   async (request: ContentScriptRequest<{ id: string }>) => {
  //     const { id } = request.params || {};

  //     if (!id) throw new Error("params must include id.");

  //     const proof = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.get_proof_request,
  //       data: {
  //         ...getPopupData(),
  //         id,
  //       },
  //     });

  //     return proof;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.get_zap,
  //   async (request: ContentScriptRequest<{ url: string }>) => {
  //     const { url } = request.params || {};

  //     if (!url) throw new Error("params must include url.");

  //     const zap = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.get_zap_request,
  //       data: {
  //         ...getPopupData(),
  //         url,
  //       },
  //     });

  //     return zap;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.mint_attestation,
  //   async (
  //     request: ContentScriptRequest<{
  //       txHash: string;
  //       blockHash: string;
  //       decrypted: string;
  //     }>
  //   ) => {
  //     const { txHash, blockHash, decrypted } = request.params || {};

  //     if (!txHash) throw new Error("params must include txHash.");
  //     if (!blockHash) throw new Error("params must include blockHash.");
  //     if (!decrypted) throw new Error("params must include decrypted.");

  //     const attestation = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.mint_attestation_request,
  //       data: {
  //         ...getPopupData(),
  //         txHash,
  //         blockHash,
  //         decrypted,
  //       },
  //     });

  //     return attestation;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.notarize,
  //   async (
  //     request: ContentScriptRequest<{
  //       url: string;
  //       method?: string;
  //       headers?: { [key: string]: string };
  //       metadata?: { [key: string]: string };
  //       body?: string;
  //       notaryUrl?: string;
  //       websocketProxyUrl?: string;
  //       maxSentData?: number;
  //       maxRecvData?: number;
  //       maxTranscriptSize?: number;
  //     }>
  //   ) => {
  //     const {
  //       url,
  //       method,
  //       headers,
  //       body,
  //       maxSentData,
  //       maxRecvData,
  //       maxTranscriptSize,
  //       notaryUrl,
  //       websocketProxyUrl,
  //       metadata,
  //     } = request.params || {};

  //     if (!url || !urlify(url)) throw new Error("invalid url.");

  //     const proof = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.notarize_request,
  //       data: {
  //         ...getPopupData(),
  //         url,
  //         method,
  //         headers,
  //         body,
  //         maxSentData,
  //         maxRecvData,
  //         maxTranscriptSize,
  //         notaryUrl,
  //         websocketProxyUrl,
  //         metadata,
  //       },
  //     });

  //     return proof;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.install_plugin,
  //   async (
  //     request: ContentScriptRequest<{
  //       url: string;
  //       metadata?: { [k: string]: string };
  //     }>
  //   ) => {
  //     const { url, metadata } = request.params || {};

  //     if (!url) throw new Error("params must include url.");

  //     const response: RequestHistory[] = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.install_plugin_request,
  //       data: {
  //         ...getPopupData(),
  //         url,
  //         metadata,
  //       },
  //     });

  //     return response;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.get_plugins,
  //   async (
  //     request: ContentScriptRequest<{
  //       url: string;
  //       origin?: string;
  //       metadata?: { [k: string]: string };
  //     }>
  //   ) => {
  //     const {
  //       url: filterUrl,
  //       origin: filterOrigin,
  //       metadata,
  //     } = request.params || {};

  //     if (!filterUrl) throw new Error("params must include url.");

  //     const response = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.get_plugins_request,
  //       data: {
  //         ...getPopupData(),
  //         url: filterUrl,
  //         origin: filterOrigin,
  //         metadata,
  //       },
  //     });

  //     return response;
  //   }
  // );

  // server.on(
  //   ContentScriptTypes.run_plugin,
  //   async (request: ContentScriptRequest<{ hash: string }>) => {
  //     const { hash } = request.params || {};

  //     if (!hash) throw new Error("params must include hash");

  //     const response = await browser.runtime.sendMessage({
  //       type: BackgroundActiontype.run_plugin_request,
  //       data: {
  //         ...getPopupData(),
  //         hash,
  //       },
  //     });

  //     return response;
  //   }
  // );

  server.on(
    ContentScriptTypes.run_dynamic_proof,
    async (request: ContentScriptRequest<{ type: string }>) => {
      const { type } = request.params || {};

      if (!type) throw new Error("params must include type of the request");

      const response = await browser.runtime.sendMessage({
        type: BackgroundActiontype.run_dynamic_proof_request,
        data: {
          ...getPopupData(),
          type,
        },
      });

      console.log("response in content index.ts", response);

      return response;
    }
  );
})();

function loadScript(filename: string) {
  const url = browser.runtime.getURL(filename);
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", url);
  document.body.appendChild(script);
}

function getPopupData() {
  return {
    origin: window.origin,
    position: {
      left: window.screen.width - 460,
      top: 90,
    },
  };
}
