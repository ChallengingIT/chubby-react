// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import authService from "../services/auth.service";
// import eventBus from "../common/EventBus";
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   ThemeProvider,
//   createTheme,
//   IconButton,
//   InputAdornment,
//   Container,
// } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { useAuth } from "../services/authContext";
// import FormaOnda from "../images/FormaLoginNoOnda.svg";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import LoginScheme from "./LoginScheme";

// const NuovaLogin = () => {
//   const theme = createTheme({
//     typography: {
//       fontFamily: 'Roboto, sans-serif', 
//     },
//     components: {
//       MuiFilledInput: {
//         styleOverrides: {
//           root: {
//             "&:before": {
//               borderBottom: "2px solid #00B400",
//             },
//             "&:after": {
//               borderBottom: "2px solid #00B400",
//             },
//             "&.Mui-focused": {
//               backgroundColor: "transparent",
//             },
//           },
//           input: {
//             color: "black", // Colore del testo digitato
//           },
//         },
//       },
//       MuiInputLabel: {
//         styleOverrides: {
//           root: {
//             color: "#00B400",
//             "&.Mui-focused": {
//               color: "#00B400",
//             },
//           },
//         },
//       },
//     },
//   });

//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       sessionStorage.removeItem("user");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [nome, setNome] = useState("");
//   const [cognome, setCognome] = useState("");
//   const [loginError, setLoginError] = useState({
//     username: false,
//     password: false,
//     email: false,
//     name: false,
//     surname: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);

//   const toggleFlip = () => {
//     setIsFlipped(!isFlipped);
//   };

//   const toggleForgot = () => {
//     setForgotPassword(!forgotPassword);
//   };

//   const flipStyles = {
//     transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
//     transition: "transform 0.6s",
//     transformStyle: "preserve-3d",
//     position: "relative",
//     width: "100%",
//     height: "100%",
//   };

//   useEffect(() => {
//     const lastRegisteredUsername = sessionStorage.getItem(
//       "lastRegisteredUsername"
//     );
//     if (lastRegisteredUsername) {
//       setUsername(lastRegisteredUsername);
//       sessionStorage.removeItem("lastRegisteredUsername");
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     if (e) {
//       e.preventDefault();
//     }
//     try {
//       const response = await authService.login(username, password);
//       if (response && response.token) {
//         sessionStorage.setItem("token", response.token);
//         sessionStorage.setItem("user", JSON.stringify(response));
//         login(response);
//         eventBus.dispatch("loginSuccess");
//         const userRole = response.roles[0];

//         if (
//           userRole === "ADMIN" ||
//           userRole === "RECRUITER" ||
//           userRole === "BM"
//         ) {
//           navigate("/dashboard");
//         } else if (userRole === "USER" || userRole === "BUSINESS") {
//           navigate("/homepage");
//         }
//       }
//     } catch (error) {
//       console.error("Errore durante il login:", error);
//       if (error.message.includes("username")) {
//         setLoginError((errors) => ({ ...errors, username: true }));
//       } else if (error.message.includes("password")) {
//         setLoginError((errors) => ({ ...errors, password: true }));
//       } else {
//         setLoginError({ username: true, password: true });
//       }
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.keyCode === 13) {
//       handleLogin();
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/auth/lost/password",
//         {
//           email,
//         }
//       );
//     } catch (error) {
//       console.error("Error during password recovery:", error);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <LoginScheme>
//       <Container
//         maxWidth="sm"
//         sx={{
//           position: "relative",
//           display: "flex",
//           borderRadius: "20px",
//           bgcolor: "white",
//           boxShadow: "10px 10px 10px 10px rgba(0, 0, 0, 0.4)",
//           height: "auto",
//           minHeight: '80vh',
//           overflow: "hidden", // il contenuto non esce fuori dal container
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             zIndex: 1,
//           }}
//         >
//           <img
//             alt="Torchy logo"
//             src={FormaOnda}
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover", 
//               objectPosition: "center", 
//             }}
//           />
//         </Box>
//         <Box
//           component="form"
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "flex-start",
//             width: "100%",
//             pr: 4,
//             pl: 4,
//             m: "auto",
//             zIndex: 2, 
//           }}
//         >
//           <Box sx={{ alignSelf: 'flex-start', mb: 2, mt: 6 }}>
//             <Typography
//               variant="h5"
//               sx={{ fontWeight: "bold", fontSize: "3em", textAlign: "left" }}
//             >
//               Sign in
//             </Typography>
//           </Box>
//           <TextField
//             variant="filled"
//             margin="normal"
//             fullWidth
//             id="username"
//             label={
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <PersonIcon />
//                 <Box sx={{ ml: 1 }}>Username</Box>
//               </Box>
//             }
//             autoComplete="username"
//             autoFocus
//             value={username}
//             onKeyDown={handleKeyDown}
//             error={loginError.username}
//             helperText={loginError.username ? "Username non valido" : ""}
//             onChange={(e) => {
//               setUsername(e.target.value);
//               setLoginError((errors) => ({ ...errors, username: false }));
//             }}
//             sx={{
//               mb: 2,
//               "& .MuiFilledInput-root.Mui-focused": {
//                 bgcolor: "transparent",
//               },
//               "& .MuiInputBase-root": {
//                 bgcolor: "transparent",
//               },
//               "& .MuiFormLabel-root": {
//                 color: "#00B400",
//               },
//               "& .MuiFilledInput-root": {
//                 "&:before": {
//                   borderBottom: "2px solid #00B400",
//                 },
//                 "&:after": {
//                   borderBottom: "2px solid #00B400",
//                 },
//               },
//             }}
//           />
//           <TextField
//             variant="filled"
//             margin="normal"
//             fullWidth
//             name="password"
//             label={
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <LockIcon />
//                 <Box sx={{ ml: 1 }}>Password</Box>
//               </Box>
//             }
//             type={showPassword ? "text" : "password"}
//             id="password"
//             autoComplete="current-password"
//             value={password}
//             onKeyDown={handleKeyDown}
//             error={loginError.password}
//             helperText={loginError.password ? "Password non valida." : ""}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               setLoginError((errors) => ({ ...errors, password: false }));
//             }}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={togglePasswordVisibility}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               mb: 2,
//               "& .MuiFilledInput-root.Mui-focused": {
//                 bgcolor: "transparent",
//               },
//               "& .MuiInputBase-root": {
//                 bgcolor: "transparent",
//               },
//               "& .MuiFormLabel-root": {
//                 color: "#00B400",
//               },
//               "& .MuiFilledInput-root": {
//                 "&:before": {
//                   borderBottom: "2px solid #00B400",
//                 },
//                 "&:after": {
//                   borderBottom: "2px solid #00B400",
//                 },
//               },
//             }}
//           />
//           <Box sx={{ alignSelf: 'flex-end', mb: 2}}>
//              <Typography variant="h5" sx={{ fontSize: "0.9em", textAlign: "left" }}>
//             <Link to="/forgotPassword" style={{ color: 'black' }}>Forgot Password?</Link>
//             </Typography>
//           </Box>
//           <Button
//             color="primary"
//             variant="contained"
//             onClick={handleLogin}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               width: "100%",
//               backgroundColor: "#00B401",
//               color: "white",
//               fontWeight: "bold",
//               borderRadius: 2,
//               mb: 2,
//               "&:hover": {
//                 backgroundColor: "#116d0e",
//                 color: "white",
//                 transform: "scale(1.05)",
//               },
//             }}
//           >
//             Sign in
//           </Button>

//           <Box sx={{ alignSelf: 'center', mb: 2 }}>
//             <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: "1.1em", textAlign: "left" }}>
//               Don't have an account? <Link to="/signup" style={{ color: '#00B400' }}>Sign up</Link>
//             </Typography>
//           </Box>

//         </Box>
//       </Container>
//       </LoginScheme>
//     </ThemeProvider>
//   );
// };

// export default NuovaLogin;
