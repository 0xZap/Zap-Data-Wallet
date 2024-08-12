import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import "./gradient-animation.css";
import ZapButton from "../../components/ZapButton";
import ZapInput from "../../components/ZapInput";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../reducers/authSlice";
import { setAuthToken } from "../../utils/storage";

export default function Login(): ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "123456") {
      const token = "user-auth-token"; // Normalmente, você obteria isso do servidor após a autenticação bem-sucedida
      setAuthToken(token);
      dispatch(setAuth({ isAuthenticated: true, token }));
      navigate("/home"); // Redirecionar para a página principal após login
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
        <div className="logo mb-8">
          <img
            src="../../assets/zap-text.png"
            alt="Logo"
            className="w-auto h-24 mx-auto"
          />
        </div>
        <h1 className="text-xl font-bold mb-4">Unlock the Zap</h1>
        <ZapInput
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4"
        />
        <ZapButton
          disabled={!password}
          onClick={handleLogin}
          className="w-full text-lightcolor z-0"
        >
          Unlock
        </ZapButton>
        <a href="#" className="block mt-4 text-graycolor">
          Forgot Password?
        </a>
      </div>
      <div className="background-animation absolute inset-0 -z-10"></div>
      <div className="bg-black/50 backdrop-blur-lg absolute inset-0 z-0"></div>
    </div>
  );
}
