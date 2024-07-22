// import { LOGGING_LEVEL_INFO } from "./constants";
// import CryptoJS from "crypto-js";

export const NOTARY_API_LS_KEY = "notary-api";
export const PROXY_API_LS_KEY = "proxy-api";
export const MAX_SENT_LS_KEY = "max-sent";
export const MAX_RECEIVED_LS_KEY = "max-received";
export const LOGGING_FILTER_KEY = "logging-filter";
export const URL_PATTERNS_LS_KEY = "url-patterns";
export const AUTH_TOKEN_KEY = "auth-token";

// const SECRET_KEY = "your-secret-key";

export async function set(key: string, value: any) {
  return chrome.storage.sync.set({ [key]: value });
}

export async function get(key: string, defaultValue?: any) {
  return (
    chrome.storage.sync
      .get(key)
      .then((result) => result[key] || defaultValue)
      // mudei essa função para retornar o valor padrão caso o valor não seja encontrado
      // antes estava ""
      .catch(() => defaultValue)
  );
}

export async function setList(key: string, list: any[]) {
  return set(key, JSON.stringify(list));
}

export async function getList(key: string, defaultValue: any[] = []) {
  return get(key).then((value) => {
    try {
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });
}

export async function getMaxSent() {
  return parseInt(await get(MAX_SENT_LS_KEY, "4096"));
}

export async function getMaxRecv() {
  return parseInt(await get(MAX_RECEIVED_LS_KEY, "16384"));
}

export async function getNotaryApi() {
  return await get(NOTARY_API_LS_KEY, "http://0.0.0.0:7047");
}

export async function getProxyApi() {
  return await get(PROXY_API_LS_KEY, "wss://notary.pse.dev/proxy");
}

export async function setAuthToken(token: string): Promise<void> {
  console.log("setAuthToken", token);
  return set(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  console.log("getAuthToken");
  return get(AUTH_TOKEN_KEY, null);
}

// export async function getLoggingFilter() {
//   return await get(LOGGING_FILTER_KEY, LOGGING_LEVEL_INFO);
// }
