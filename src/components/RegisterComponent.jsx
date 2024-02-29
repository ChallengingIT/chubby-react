// import PropTypes from "prop-types";
// import React, { useState } from "react";
// import linea from "../images/linea.png";
// import { useNavigate } from "react-router-dom";
// import "../styles/RegisterComponent.css";

// export const RegisterComponent = (props) => {
//   const navigate = useNavigate();

//   const initialValues = {
//     username: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//   };
//   const [formValues, setFormValues] = useState(initialValues);
//   const [formErrors, setFormErrors] = useState({});
//   const [setIsSubmit] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const errors = validate(formValues);

//     if (Object.keys(errors).length === 0) {

//       localStorage.setItem("userData", JSON.stringify(formValues));
//       setIsSubmit(true);
//       localStorage.setItem("lastRegisteredEmail", formValues.email);
//       navigate("/login");
//     } else {
 
//       setFormErrors(errors);
//     }
//   };

//   const validate = (value, existingUserData) => {
//     const errors = {};
//     if (!formValues.username) {
//       errors.username = "Inserire un username!";
//     }
//     const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!formValues.email) {
//       errors.email = "Inserire una mail!";
//     } else if (!regex.test(value.email)) {
//       errors.email = "Formato Email non valido!";
//     } else if (existingUserData && existingUserData.email === formValues.email) {
//       errors.email = "E-mail già utilizzata";
//     }
//     if (!formValues.password) {
//       errors.password = "Inserire una password!";
//     }

//     if (!formValues.confirm_password) {
//       errors.confirm_password = "Inserire la conferma della password!";
//     } else if (formValues.password !== formValues.confirm_password) {
//       errors.confirm_password = "Le password non corrispondono!";
//     }

//     return errors;
//   };




//   return (
//     <div className="register-container">
//       <form onSubmit={handleSubmit}>
//         <div className="text-wrapper-register">Signup</div>
//         <img className="linea" alt="Linea" src={linea || linea} />

//         <div className="input-container">
//           <div className="username-fill">
//             <div className="username-input-container">
//               <input
//                 className="username-input"
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={formValues.username}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="username-error-container">
//               <p className="username-error">{formErrors.username}</p>
//             </div>
//           </div>

//           <div className="email-fill">
//             <div className="email-input-container">
//               <input
//                 className="email-input"
//                 type="text"
//                 name="email"
//                 placeholder="Email"
//                 value={formValues.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="email-error-container">
//               <p className="email-error">{formErrors.email}</p>
//             </div>
//           </div>

//           <div className="password-fill">
//             <div className="password-input-container">
//               <input
//                 className="password-input"
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formValues.password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="password-error-container">
//               <p className="password-error">{formErrors.password}</p>
//             </div>
//           </div>

//           <div className="confirm_password-fill">
//             <div className="confirm_password-input-container">
//               <input
//                 className="confirm_password-input"
//                 type="password"
//                 name="confirm_password"
//                 placeholder="Confirm password"
//                 value={formValues.confirm_password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="confirm_password-error-container">
//               <p className="confirm_password-error">
//                 {formErrors.confirm_password}
//               </p>
//             </div>
//           </div>
//         </div>

//         <button className="register-button">
//           <div className="div-registrati">REGISTRATI</div>
//         </button>

//         <div className="div-account">Hai già un account?</div>
//         <a className="text-wrapper-accedi" href="/login">
//           Sign in!
//         </a>
//       </form>
//     </div>
//   );
// };

// RegisterComponent.propTypes = {
//   line: PropTypes.string,
// };

// export default RegisterComponent;
