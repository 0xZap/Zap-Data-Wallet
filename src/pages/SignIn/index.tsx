import React, {
  ReactElement,
} from "react";
import "./gradient-animation.css";
import ZapButton from "../../components/ZapButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../reducers/authSlice";
import { setAuthToken } from "../../utils/storage";
import { auth } from "../../firebaseConfig"
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";

interface AuthResponse {
  success: boolean;
  error?: string;
}

export default function SignIn(): ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firebaseConfig = {
    apiKey: "AIzaSyBCcjCa0N1nvZN1pCONtmOweBcUBYhTpSU",
    authDomain: "zap-mobile-71630.firebaseapp.com",
    projectId: "zap-mobile-71630",
    storageBucket: "zap-mobile-71630.appspot.com",
    messagingSenderId: "17528040277",
    appId: "1:17528040277:web:901b2b27a1719217c5dddc"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleGoogleLogin = async () => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
        console.error('Error getting token:', JSON.stringify(chrome.runtime.lastError));
        return;
      }
      
      // After getting the token, use it to sign in to Firebase
      const credential = GoogleAuthProvider.credential(null, token);
      signInWithCredential(auth, credential)
        .then((result) => {
          // User signed in
          console.log(result.user);
        })
        .catch((error) => {
          console.error('Error signing in:', JSON.stringify(error));
        });
    });
  };

  async function handlePasskeyLogin() {
    chrome.runtime.sendMessage({ action: "register", username: 'Test User' }, (response: AuthResponse) => {
      if (response.success) {
        console.log("Registration successful!");
      } else {
        console.log("Registration failed: " + response.error);
      }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div className="relative w-full h-full z-10 text-center flex flex-col justify-center text-lightcolor p-4 rounded-lg">
        <div className="logo mb-4">
          <img
            src="../../assets/zap-text.png"
            alt="Logo"
            className="w-auto h-24 mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">Unlock the Zap</h1>
        <ZapButton onClick={handleGoogleLogin} className="w-full text-lightcolor">
          Login with Google
        </ZapButton>
        <ZapButton onClick={handlePasskeyLogin} className="w-full text-lightcolor mt-8">
          Login with Passkey
        </ZapButton>
      </div>
      <div className="background-animation absolute inset-0 -z-10"></div>
      <div className="bg-black/50 backdrop-blur-lg absolute inset-0 z-0"></div>
    </div>
  );
}
