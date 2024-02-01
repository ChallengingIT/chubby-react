import React, { useState, useEffect }           from "react";
import linea                                    from "../images/linea.png";
import { useNavigate }                          from "react-router-dom";
import authService                              from "../services/auth.service";
import "../styles/LoginComponent.css";
import eventBus from "../common/EventBus";

export const LoginComponent = (props) => {




  const { onLoginSuccess } = props;



  useEffect(() => {
    const handleBeforeUnload = (e) => {
      localStorage.removeItem("user");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const initialValues = { username: "", password: "" };
  const navigate = useNavigate();

  const [ username,           setUsername           ] = useState("");
  const [ password,           setPassword           ] = useState("");
  const [ loginError,         setLoginError         ] = useState(false);

  useEffect(() => {


    const lastRegisteredUsername = localStorage.getItem("lastRegisteredUsername");
    if (lastRegisteredUsername) {
      setUsername(lastRegisteredUsername);
      localStorage.removeItem("lastRegisteredUsername");
    }
  }, []);

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await authService.login(username, password);
    console.log("DATI INVIATI: ", username, password);

    if (response && response && response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response));
      console.log("UTENTE LOGGATO DA LOGIN: ", response);
  eventBus.dispatch("loginSuccess");

     const userRole = response.roles[0];

     if (userRole === "ROLE_ADMIN") {
       navigate("/homepage");
     } else if (userRole === "ROLE_USER") {
       navigate("/userHomepage");
     }
   }
 } catch (error) {
   console.error("Errore di login:", error);
   setLoginError(true);
 }
};

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="text-wrapper-login">Login</div>
        <img className="linea" alt="Linea" src={linea || linea} />

        <div className="input-login-container">
          <div className="username-fill">
            <div className="username-input-container">
              <input
                className="username-input"
                type="text"
                name="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="password-error-container">
                {loginError && <p className="password-error">Username non valido.</p>}
              </div>
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
                {loginError && <p className="password-error">Password non valida.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="text-wrapper-password-dimenticata">
          Hai dimenticato la Password?
        </div> */}
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
