import { getCacheByTabId, getGlobalCache } from "./cache";
import { BackgroundActiontype, RequestLog } from "./rpc";
import mutex from "./mutex";
import browser from "webextension-polyfill";
import { addRequest } from "../../reducers/requests";
import { urlify } from "../../utils/misc";
import { setCookies, setHeaders } from "./db";
import { useDispatch } from "react-redux";
import { getList, URL_PATTERNS_LS_KEY } from "../../utils/storage";
// import { addRequestsToQueue, startQueueProcessing } from './notarizeUtils';

// UrlPatterns to match which requests need to be filtered from the list on local storage

export const onSendHeaders = (
  details: browser.WebRequest.OnSendHeadersDetailsType
) => {
  return mutex.runExclusive(async () => {
    const { method, tabId, requestId } = details;

    if (method !== "OPTIONS") {
      const cache = getGlobalCache();
      const existing = cache.get<RequestLog>(requestId);
      const { hostname } = urlify(details.url) || {};

      const urlPatternStrings = await getList(URL_PATTERNS_LS_KEY);

      const urlPatterns: RegExp[] = urlPatternStrings.map(
        (pattern: any) => new RegExp(pattern)
      );

      function isUrlMatching(url: string, patterns: RegExp[]): boolean {
        return patterns.some((pattern) => pattern.test(url));
      }

      if (isUrlMatching(details.url, urlPatterns)) {
        if (hostname && details.requestHeaders) {
          details.requestHeaders.forEach((header) => {
            const { name, value } = header;
            if (/^cookie$/i.test(name) && value) {
              value
                .split(";")
                .map((v) => v.split("="))
                .forEach((cookie) => {
                  setCookies(hostname, cookie[0].trim(), cookie[1]);
                });
            } else {
              setHeaders(hostname, name, value);
            }
          });
        }

        cache.set(requestId, {
          ...existing,
          method: details.method as "GET" | "POST",
          type: details.type,
          url: details.url,
          initiator: details.initiator || null,
          requestHeaders: details.requestHeaders || [],
          tabId: tabId,
          requestId: requestId,
        });
        // } else {
        //   console.log("Not matching", details.url);
      }
    }
  });
};

export const onBeforeRequest = (
  details: browser.WebRequest.OnBeforeRequestDetailsType
) => {
  mutex.runExclusive(async () => {
    const { method, requestBody, tabId, requestId } = details;

    if (method === "OPTIONS") return;

    if (requestBody) {
      const cache = getGlobalCache();
      const existing = cache.get<RequestLog>(requestId);

      if (requestBody.raw && requestBody.raw[0]?.bytes) {
        try {
          cache.set(requestId, {
            ...existing,
            requestBody: Buffer.from(requestBody.raw[0].bytes).toString(
              "utf-8"
            ),
          });
        } catch (e) {
          console.error(e);
        }
      } else if (requestBody.formData) {
        cache.set(requestId, {
          ...existing,
          formData: requestBody.formData,
        });
      }
    }
  });
};

export const onResponseStarted = (
  details: browser.WebRequest.OnResponseStartedDetailsType
) => {
  mutex.runExclusive(async () => {
    const { method, responseHeaders, tabId, requestId } = details;

    if (method === "OPTIONS") return;

    const cache = getGlobalCache();

    const existing = cache.get<RequestLog>(requestId);

    const urlPatternStrings = await getList(URL_PATTERNS_LS_KEY);

    const urlPatterns: RegExp[] = urlPatternStrings.map(
      (pattern: any) => new RegExp(pattern)
    );

    function isUrlMatching(url: string, patterns: RegExp[]): boolean {
      return patterns.some((pattern) => pattern.test(url));
    }

    if (isUrlMatching(details.url, urlPatterns)) {
      const newLog: RequestLog = {
        requestHeaders: [],
        ...existing,
        method: details.method,
        type: details.type,
        url: details.url,
        initiator: details.initiator || null,
        tabId: tabId,
        requestId: requestId,
        responseHeaders,
      };

      cache.set(requestId, newLog);

      chrome.runtime.sendMessage({
        type: BackgroundActiontype.push_action,
        data: {
          tabId: details.tabId,
          request: newLog,
        },
        action: addRequest(newLog),
      });
      // } else {
      //   console.log("Not matching", details.url);
    }
  });
};
