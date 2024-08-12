import React, { ReactElement, useEffect } from "react";
import "./gradient-animation.css";
import ZapButton from "../../components/ZapButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { setAuthToken } from "../../utils/storage";
import { setAuth } from "../../reducers/authSlice";

interface AuthResponse {
  success: boolean;
  error?: string;
}

export default function SignIn(): ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        alert(`Failed to Sign in: ${JSON.stringify(chrome.runtime.lastError)}`);
        return;
      }
      signInWithCredential(auth, GoogleAuthProvider.credential(null, token))
        .then((res) => {
          console.log("User Signed in successfully");
          console.log("User details:", res.user);
          setAuthToken(token);
          dispatch(setAuth({ isAuthenticated: true, token, user: res.user }));
          navigate("/home");
        })
        .catch((err) => {
          alert(`ailed to Sign in: ${err}`);
        });
    });
  };

  async function handlePasskeyLogin() {
    chrome.runtime.sendMessage(
      { action: "register", username: "Test User" },
      (response: AuthResponse) => {
        if (response.success) {
          console.log("Registration successful!");
        } else {
          console.log("Registration failed: " + response.error);
        }
      }
    );
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
        <ZapButton
          onClick={handleGoogleLogin}
          className="w-full text-lightcolor"
        >
          Login with Google
        </ZapButton>
        <ZapButton
          onClick={handlePasskeyLogin}
          className="w-full text-lightcolor mt-8"
        >
          Login with Passkey
        </ZapButton>
      </div>
      <div className="background-animation absolute inset-0 -z-10"></div>
      <div className="bg-black/50 backdrop-blur-lg absolute inset-0 z-0"></div>
    </div>
  );
}
