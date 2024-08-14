import React, { ReactElement, useState } from "react";
import "./gradient-animation.css";
import ZapButton from "../../components/ZapButton";
import ZapInput from "../../components/ZapInput";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../reducers/authSlice";
import { setPassword } from "../../utils/storage";

export default function CreatePassword(): ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [passwordCopy, setPasswordCopy] = useState("");

  const createPassword = () => {
    if (newPassword !== "" && newPassword === passwordCopy) {
      setPassword(newPassword);
      dispatch(setAuth({ isAuthenticated: true, password: newPassword }));
      navigate("/home");
    } else {
      alert("Senha incorreta");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div className="relative w-full h-full z-10 text-center flex flex-col justify-center text-lightcolor p-4 rounded-lg">
        <span className="shooting-star absolute"></span>
        <span className="shooting-star absolute"></span>
        <span className="shooting-star absolute"></span>
        <span className="shooting-star absolute"></span>
        <div className="logo mb-4">
          <img
            src="../../assets/zap-text.png"
            alt="Logo"
            className="w-auto h-24 mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold mt-1">Create a password</h1>
        <h5 className="font-bold mb-6">
          Remember this password to unlock Zap next time
        </h5>
        <ZapInput
          type="password"
          placeholder="Create password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4"
        />
        <ZapInput
          type="password"
          placeholder="Re-enter password"
          value={passwordCopy}
          onChange={(e) => setPasswordCopy(e.target.value)}
          className="w-full mb-4"
        />
        <ZapButton onClick={createPassword} className="w-full text-lightcolor">
          Create password
        </ZapButton>
      </div>
      <div className="background-animation absolute inset-0 -z-10"></div>
      <div className="bg-black/50 backdrop-blur-lg absolute inset-0 z-0"></div>
    </div>
  );
}
