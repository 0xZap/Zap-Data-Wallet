import { onBeforeRequest, onResponseStarted, onSendHeaders } from "./handlers";
import { deleteCacheByTabId } from "./cache";
import browser from "webextension-polyfill";
import { initRPC } from "./rpc";

(async () => {
  try {
    browser.webRequest.onSendHeaders.addListener(
      onSendHeaders,
      {
        urls: ["<all_urls>"],
      },
      ["requestHeaders", "extraHeaders"]
    );

    browser.webRequest.onBeforeRequest.addListener(
      onBeforeRequest,
      {
        urls: ["<all_urls>"],
      },
      ["requestBody"]
    );

    browser.webRequest.onResponseStarted.addListener(
      onResponseStarted,
      {
        urls: ["<all_urls>"],
      },
      ["responseHeaders", "extraHeaders"]
    );

    browser.tabs.onRemoved.addListener((tabId) => {
      deleteCacheByTabId(tabId);
    });

    //   const { initRPC } = await import("./rpc");
    //   await createOffscreenDocument();
    initRPC();
  } catch (error) {
    console.error("Erro ao inicializar o script:", error);
  }
})();

// let creatingOffscreen: any;
// async function createOffscreenDocument() {
//   const offscreenUrl = browser.runtime.getURL("offscreen.html");
//   // @ts-ignore
//   const existingContexts = await browser.runtime.getContexts({
//     contextTypes: ["OFFSCREEN_DOCUMENT"],
//     documentUrls: [offscreenUrl],
//   });

//   if (existingContexts.length > 0) {
//     return;
//   }

//   if (creatingOffscreen) {
//     await creatingOffscreen;
//   } else {
//     creatingOffscreen = (chrome as any).offscreen.createDocument({
//       url: "offscreen.html",
//       reasons: ["WORKERS"],
//       justification: "workers for multithreading",
//     });
//     await creatingOffscreen;
//     creatingOffscreen = null;
//   }
// }
