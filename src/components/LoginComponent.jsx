import React, { useState, useEffect } from "react";
import linea from "../images/linea.png";
import { useNavigate } from "react-router-dom";
import "../styles/LoginComponent.css";

export const LoginComponent = (props) => {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const lastRegisteredEmail = localStorage.getItem("lastRegisteredEmail");
    if (lastRegisteredEmail) {
      setEmail(lastRegisteredEmail);
      localStorage.removeItem("lastRegisteredEmail");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const saveUserData = JSON.parse(localStorage.getItem("userData"));

    console.log("Utenti in localStorage:", saveUserData);

    if (saveUserData) {
      if (saveUserData.email === email && saveUserData.password === password) {
        console.log("Login riuscito!");
        navigate("/homepage");
      } else {
        console.log("Credenziali non corrispondenti.");
        setLoginError(true);
      }
    } else {
      console.log("Utente non trovato.");
      setLoginError(true);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="text-wrapper-login">Login</div>
        <img className="linea" alt="Linea" src={linea || linea} />

        <div className="input-login-container">
          <div className="email-fill">
            <div className="email-input-container">
              <input
                className="email-input"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="password-fill">
            <div className="password-input-container">
              <input
                className="password-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="password-error-container">
                {loginError && <p className="password-error">Credenziali non valide.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="text-wrapper-password-dimenticata">
          Hai dimenticato la Password?
        </div>
        <button className="login-button" onClick={handleLogin}>
          <div className="div">LOGIN</div>
        </button>
        <div className="text-wrapper-noAccount">Non hai un account?</div>
        <a className="text-wrapper-registrati" href="/register">
          Registrati ora!
        </a>
      </form>
    </div>
  );
};

export default LoginComponent;
