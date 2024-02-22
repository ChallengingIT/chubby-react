// import React                      from "react";
// import { useNavigate }            from "react-router-dom";
// import LoginComponent             from "../components/LoginComponent";
// import loginimg                   from "../images/login_scura.jpg";
// import { Box, Typography } from "@mui/material";
// import loginTorchy from "../images/loginTorchy.png";

// export const Login = () => {
//   const navigate = useNavigate();
//   // return (
//   //   <div className="container" style={{ backgroundColor: 'black'}}>
//   //   <div className="login">
//   //     <div className="div-2">
//   //       <p className="WE-HUB">
//   //         <span className="span">WE-</span>
//   //         <span className="text-wrapper-6">HUB</span>
//   //       </p>
//   //       <div className="overlap-group">
//   //         <LoginComponent
//   //           navigate={navigate}
//   //           className="login-component-instance"
//   //         />
//   //       </div>
//   //       <div className="image-container">
//   //       <img className="loginimg" alt="Loginimg" src={loginimg} />
//   //       <div className="loginimg-2" />
//   //       </div>
//   //     </div>
//   //   </div>
//   //   </div>
//   // );
//   return (
//   <Box sx={{
//     backgroundColor: 'black',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     width: '100vw',
//     height: '100vh',
//     position: 'relative',
//   }}>
  
//     <Box sx={{
//       display: 'flex',
//       width: '100vw',
//       height: '100vh',
//       position: 'absolute',
//     }}
//     >
//       <img alt="Loginimg" src={loginTorchy} />
//     </Box>
  
//     <Box sx={{
//       position: 'absolute', 
//       left: '70%', 
//       top: '50%',
//       transform: 'translate(-50%, -50%)', 
//       width: '527px', 
//       height: '441px', 
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//     }}>
//       <LoginComponent
//             navigate={navigate}
//             className="login-component-instance"
//           />
//     </Box>
  
//     <Box sx={{
//       color: 'transparent', 
//       fontFamily: '"Inter-ExtraBold", Helvetica',
//       fontSize: '36px',
//       fontWeight: '800',
//       letterSpacing: '0',
//       lineHeight: 'normal',
//       marginRight: '30px',
//       marginTop: '30px',
//       position: 'absolute',
//       right: '30px', 
//       top: '30px',
//     }}>
//       <span style={{ color: '#14D928' }}>TORCHY</span>
//     </Box>
  
//   </Box>
//   );
  
  
// };
// export default Login;