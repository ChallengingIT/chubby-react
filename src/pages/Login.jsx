import React                      from "react";
import { useNavigate }            from "react-router-dom";
import LoginComponent             from "../components/LoginComponent";
import loginimg                   from "../images/loginimg.jpeg";
import "../styles/Login.css";

export const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ backgroundColor: 'black'}}>
    <div className="login">
      <div className="div-2">
        <p className="WE-HUB">
          <span className="span">WE-</span>
          <span className="text-wrapper-6">HUB</span>
        </p>
        <div className="overlap-group">
          <LoginComponent
            navigate={navigate}
            className="login-component-instance"
          />
        </div>
        <div className="image-container">
        <img className="loginimg" alt="Loginimg" src={loginimg} />
        <div className="loginimg-2" />
        </div>
      </div>
    </div>
    </div>
  );
};
export default Login;