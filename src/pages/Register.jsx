import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import RegisterComponent from "../components/RegisterComponent";
import loginimg from "../images/login_scura.jpeg";


export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="login">
      <div className="div-2">
        <p className="WE-HUB">
          <span className="span">WE-</span>
          <span className="text-wrapper-6">HUB</span>
        </p>
        <div className="overlap-group">
          <RegisterComponent
            navigate={navigate}
            className="register-component-instance"
          />
        </div>
        <img className="loginimg" alt="Loginimg" src={loginimg} />
        <div className="loginimg-2" />
      </div>
    </div>
  );
};

export default Register;
