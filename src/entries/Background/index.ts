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

//--------------- Code for Passkey auth (not working) ---------------

interface RegisterRequest {
  action: 'register';
  username: string;
}

interface LoginRequest {
  action: 'login';
}

type AuthRequest = RegisterRequest | LoginRequest;

interface AuthResponse {
  success: boolean;
  error?: string;
}

(async () => {
  try {
    chrome.runtime.onMessage.addListener((request: AuthRequest, sender, sendResponse: (response: AuthResponse) => void) => {
      if (request.action === "register") {
        registerCredential(request.username)
          .then(sendResponse)
          .catch((error: Error) => sendResponse({ success: false, error: error.message }));
        return true;  
      } else if (request.action === "login") {
        authenticateUser()
          .then(sendResponse)
          .catch((error: Error) => sendResponse({ success: false, error: error.message }));
        return true; 
      }
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

async function registerCredential(username: string): Promise<AuthResponse> {
  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: {
      name: "Zap Extension",
      id: chrome.runtime.id
    },
    user: {
      id: crypto.getRandomValues(new Uint8Array(16)),
      name: username,
      displayName: username
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    },
    timeout: 60000
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    }) as PublicKeyCredential;

    // Store the credential ID
    await chrome.storage.local.set({ credential: credential.id });

    return { success: true };
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false };
  }
}

async function authenticateUser(): Promise<AuthResponse> {
  const storedCredential = await chrome.storage.local.get('credential');
  if (!storedCredential.credential) {
    return { success: false, error: "No registered credential found" };
  }

  const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    allowCredentials: [{
      id: Uint8Array.from(atob(storedCredential.credential), c => c.charCodeAt(0)),
      type: 'public-key',
    }],
    userVerification: "required",
    timeout: 60000
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    }) as PublicKeyCredential;

    if (assertion.id === storedCredential.credential) {
      return { success: true };
    } else {
      return { success: false, error: "Authentication failed" };
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return { success: false };
  }
}

//--------------- END of Passkey auth code ---------------

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
