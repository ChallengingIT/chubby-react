import PropTypes from "prop-types";
import React from "react";
import "../styles/RegisterComponent.css";
import linea from "../images/linea.png";

export const RegisterComponent = ( { linea = "linea.png", inputType = "text" }) => {
    return (
        <div className="register-component">
      <div className="overlap-group">
        <div className="text-wrapper">Register</div>
        <input className="name" placeholder="Full Name" type={inputType} />
        <div className="email">
          <div className="full-name">E-mail</div>
        </div>
        <div className="phone">
          <div className="full-name">Phone</div>
        </div>
        <div className="password">
          <div className="full-name">Password</div>
        </div>
        <div className="confirm-password">
          <div className="full-name">Confirm Password</div>
        </div>
        <button className="register-btn">
          <div className="div">Register</div>
        </button>
        <div className="signup-btn">
          <div className="div">Have account? Sign In</div>
        </div>
        <img className="line" alt="Line" src={ linea || linea} />
      </div>
    </div>
    );
};

RegisterComponent.propTypes = {
  line: PropTypes.string,
  inputType: PropTypes.string,
};

export default RegisterComponent;