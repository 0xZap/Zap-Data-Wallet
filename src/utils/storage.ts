import { LOGGING_LEVEL_INFO } from "./constants";
// import CryptoJS from "crypto-js";

export const NOTARY_API_LS_KEY = "notary-api";
export const PROXY_API_LS_KEY = "proxy-api";
export const MAX_SENT_LS_KEY = "max-sent";
export const MAX_RECEIVED_LS_KEY = "max-received";
export const LOGGING_FILTER_KEY = "logging-filter";
export const URL_PATTERNS_LS_KEY = "url-patterns";
export const AUTH_TOKEN_KEY = "auth-token";
export const ZAP_POINTS_KEY = "zap-points";
export const PASSWORD_KEY = "password";

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
  return set(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return get(AUTH_TOKEN_KEY, null);
}

// need to fix in the future... maybe put points onchain or even in a server
export async function setZapPoints(newpts: number): Promise<void> {
  const currentPoints = await getZapPoints();
  const updatedPoints = currentPoints + newpts;
  await set(ZAP_POINTS_KEY, updatedPoints.toString());
}

// need to fix in the future... maybe put points onchain or even in a server
export async function getZapPoints(): Promise<number> {
  const points = await get(ZAP_POINTS_KEY, null);
  return points ? parseInt(points, 10) : 0;
}

export async function getLoggingFilter() {
  return await get(LOGGING_FILTER_KEY, LOGGING_LEVEL_INFO);
}

export async function setPassword(password: string): Promise<void> {
  return set(PASSWORD_KEY, password);
}

export async function getPassword(): Promise<string | null> {
  return get(PASSWORD_KEY, null);
}
