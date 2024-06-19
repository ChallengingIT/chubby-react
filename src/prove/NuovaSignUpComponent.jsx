    // import React, { useState, useEffect } from "react";
    // import { Link, useNavigate } from "react-router-dom";
    // import axios from "axios";
    // import authService from "../services/auth.service";
    // import eventBus from "../common/EventBus";
    // import {
    // Box,
    // Button,
    // Typography,
    // TextField,
    // ThemeProvider,
    // createTheme,
    // IconButton,
    // InputAdornment,
    // Container,
    // } from "@mui/material";
    // import VisibilityIcon from "@mui/icons-material/Visibility";
    // import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
    // import { useAuth } from "../services/authContext";
    // import FormaOnda from "../images/FormaLoginNoOnda.svg";
    // import LockIcon from "@mui/icons-material/Lock"; //password
    // import PersonIcon from "@mui/icons-material/Person"; //nome e cognome
    // import EmailIcon from "@mui/icons-material/Email"; //email
    // import AccountCircleIcon from "@mui/icons-material/AccountCircle"; //username
    // import LoginScheme from "./LoginScheme";

    // const NuovaSignUpComponent = () => {
    // const navigate = useNavigate();
    // const theme = createTheme({
    //     typography: {
    //     fontFamily: "Roboto, sans-serif",
    //     },
    //     components: {
    //     MuiFilledInput: {
    //         styleOverrides: {
    //         root: {
    //             "&:before": {
    //             borderBottom: "2px solid #00B400",
    //             },
    //             "&:after": {
    //             borderBottom: "2px solid #00B400",
    //             },
    //             "&.Mui-focused": {
    //             backgroundColor: "transparent",
    //             },
    //         },
    //         input: {
    //             color: "black", // Colore del testo digitato
    //         },
    //         },
    //     },
    //     MuiInputLabel: {
    //         styleOverrides: {
    //         root: {
    //             color: "#00B400",
    //             "&.Mui-focused": {
    //             color: "#00B400",
    //             },
    //         },
    //         },
    //     },
    //     },
    // });

    // useEffect(() => {
    //     const handleBeforeUnload = (e) => {
    //     sessionStorage.removeItem("user");
    //     };
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //     return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, []);

    // const { register } = useAuth();
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");
    // const [email, setEmail] = useState("");
    // const [nome, setNome] = useState("");
    // const [cognome, setCognome] = useState("");
    // const [loginError, setLoginError] = useState({
    //     username: false,
    //     password: false,
    //     email: false,
    //     name: false,
    //     surname: false,
    // });
    // const [showPassword, setShowPassword] = useState(false);

    // useEffect(() => {
    //     const lastRegisteredUsername = sessionStorage.getItem(
    //     "lastRegisteredUsername"
    //     );
    //     if (lastRegisteredUsername) {
    //     setUsername(lastRegisteredUsername);
    //     sessionStorage.removeItem("lastRegisteredUsername");
    //     }
    // }, []);

    // const handleRegister = async (e) => {
    //     if (e) {
    //     e.preventDefault();
    //     }
    //     console.log("sto effettuando la registrazione dell'utente");
    //     navigate("/");
    // };

    // const handleKeyDown = (e) => {
    //     if (e.keyCode === 13) {
    //     navigate("/");
    //     }
    // };

    // const togglePasswordVisibility = () => {
    //     setShowPassword(!showPassword);
    // };

    // return (
    //     <ThemeProvider theme={theme}>
    //     <LoginScheme>
    //         <Container
    //         maxWidth="sm"
    //         sx={{
    //             position: "relative",
    //             display: "flex",
    //             borderRadius: "20px",
    //             bgcolor: "white",
    //             boxShadow: "10px 10px 10px 10px rgba(0, 0, 0, 0.4)",
    //             height: "auto",
    //             minHeight: '80vh',
    //             overflow: "hidden", // il contenuto non esce fuori dal container
    //         }}
    //         >
    //         <Box
    //             sx={{
    //             position: "absolute",
    //             top: 0,
    //             left: 0,
    //             width: "100%",
    //             height: "100%",
    //             zIndex: 1,
    //             }}
    //         >
    //             <img
    //             alt="Torchy logo"
    //             src={FormaOnda}
    //             style={{
    //                 width: "100%",
    //                 height: "100%",
    //                 objectFit: "cover",
    //                 objectPosition: "center",
    //             }}
    //             />
    //         </Box>
    //         <Box
    //             component="form"
    //             sx={{
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //             justifyContent: "flex-start",
    //             width: "100%",
    //             pr: 4,
    //             pl: 4,
    //             m: "auto",
    //             zIndex: 2,
    //             }}
    //         >
    //             <Box sx={{ alignSelf: "flex-start", mb: 2, mt: 6 }}>
    //             <Typography
    //                 variant="h5"
    //                 sx={{ fontWeight: "bold", fontSize: "3em", textAlign: "left" }}
    //             >
    //                 Sign Up
    //             </Typography>
    //             </Box>
    //             <TextField
    //             variant="filled"
    //             margin="normal"
    //             fullWidth
    //             id="email"
    //             label={
    //                 <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <EmailIcon />
    //                 <Box sx={{ ml: 1 }}>Email</Box>
    //                 </Box>
    //             }
    //             autoComplete="email"
    //             autoFocus
    //             value={email}
    //             onKeyDown={handleKeyDown}
    //             error={loginError.email}
    //             helperText={loginError.email ? "Email non valida" : ""}
    //             onChange={(e) => {
    //                 setEmail(e.target.value);
    //                 setLoginError((errors) => ({ ...errors, email: false }));
    //             }}
    //             sx={{
    //                 mb: 2,
    //                 "& .MuiFilledInput-root.Mui-focused": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiInputBase-root": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiFormLabel-root": {
    //                 color: "#00B400",
    //                 },
    //                 "& .MuiFilledInput-root": {
    //                 "&:before": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 "&:after": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 },
    //             }}
    //             />

    //             <TextField
    //             variant="filled"
    //             margin="normal"
    //             fullWidth
    //             id="nome"
    //             label={
    //                 <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <PersonIcon />
    //                 <Box sx={{ ml: 1 }}>Nome e Cognome</Box>
    //                 </Box>
    //             }
    //             value={`${nome} ${cognome}`.trim()} // Combina nome e cognome
    //             onKeyDown={handleKeyDown}
    //             error={loginError.nome || loginError.cognome}
    //             onChange={(e) => {
    //                 const parts = e.target.value.split(" "); // Divide l'input quando viene inserito uno spazio
    //                 if (parts.length >= 2) {
    //                 setNome(parts[0]); // Imposta il primo elemento come nome
    //                 setCognome(parts.slice(1).join(" ")); // Imposta il resto come cognome
    //                 } else {
    //                 setNome(parts[0] || "");
    //                 setCognome("");
    //                 }
    //                 setLoginError((errors) => ({
    //                 ...errors,
    //                 nome: false,
    //                 cognome: false,
    //                 }));
    //             }}
    //             sx={{
    //                 mb: 2,
    //                 "& .MuiFilledInput-root.Mui-focused": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiInputBase-root": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiFormLabel-root": {
    //                 color: "#00B400",
    //                 },
    //                 "& .MuiFilledInput-root": {
    //                 "&:before": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 "&:after": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 },
    //             }}
    //             />

    //             <TextField
    //             variant="filled"
    //             margin="normal"
    //             fullWidth
    //             id="username"
    //             label={
    //                 <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <AccountCircleIcon />
    //                 <Box sx={{ ml: 1 }}>Username</Box>
    //                 </Box>
    //             }
    //             autoComplete="username"
    //             value={username}
    //             onKeyDown={handleKeyDown}
    //             error={loginError.username}
    //             helperText={loginError.username ? "Username non valido" : ""}
    //             onChange={(e) => {
    //                 setUsername(e.target.value);
    //                 setLoginError((errors) => ({ ...errors, username: false }));
    //             }}
    //             sx={{
    //                 mb: 2,
    //                 "& .MuiFilledInput-root.Mui-focused": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiInputBase-root": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiFormLabel-root": {
    //                 color: "#00B400",
    //                 },
    //                 "& .MuiFilledInput-root": {
    //                 "&:before": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 "&:after": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 },
    //             }}
    //             />
    //             <TextField
    //             variant="filled"
    //             margin="normal"
    //             fullWidth
    //             name="password"
    //             label={
    //                 <Box sx={{ display: "flex", alignItems: "center" }}>
    //                 <LockIcon />
    //                 <Box sx={{ ml: 1 }}>Password</Box>
    //                 </Box>
    //             }
    //             type={showPassword ? "text" : "password"}
    //             id="password"
    //             autoComplete="current-password"
    //             value={password}
    //             onKeyDown={handleKeyDown}
    //             error={loginError.password}
    //             helperText={loginError.password ? "Password non valida." : ""}
    //             onChange={(e) => {
    //                 setPassword(e.target.value);
    //                 setLoginError((errors) => ({ ...errors, password: false }));
    //             }}
    //             InputProps={{
    //                 endAdornment: (
    //                 <InputAdornment position="end">
    //                     <IconButton
    //                     aria-label="toggle password visibility"
    //                     onClick={togglePasswordVisibility}
    //                     edge="end"
    //                     >
    //                     {showPassword ? (
    //                         <VisibilityIcon />
    //                     ) : (
    //                         <VisibilityOffIcon />
    //                     )}
    //                     </IconButton>
    //                 </InputAdornment>
    //                 ),
    //             }}
    //             sx={{
    //                 mb: 2,
    //                 "& .MuiFilledInput-root.Mui-focused": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiInputBase-root": {
    //                 bgcolor: "transparent",
    //                 },
    //                 "& .MuiFormLabel-root": {
    //                 color: "#00B400",
    //                 },
    //                 "& .MuiFilledInput-root": {
    //                 "&:before": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 "&:after": {
    //                     borderBottom: "2px solid #00B400",
    //                 },
    //                 },
    //             }}
    //             />
    //             <Button
    //             color="primary"
    //             variant="contained"
    //             onClick={handleRegister}
    //             sx={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 width: "100%",
    //                 backgroundColor: "#00B401",
    //                 color: "white",
    //                 fontWeight: "bold",
    //                 borderRadius: 2,
    //                 mt: 2,
    //                 "&:hover": {
    //                 backgroundColor: "#116d0e",
    //                 color: "white",
    //                 transform: "scale(1.05)",
    //                 },
    //             }}
    //             >
    //             SignUp
    //             </Button>

    //             <Box sx={{ alignSelf: "center", mb: 2 }}>
    //             <Typography
    //                 variant="h5"
    //                 sx={{
    //                 mt: 3,
    //                 fontWeight: "bold",
    //                 fontSize: "1.1em",
    //                 textAlign: "left",
    //                 }}
    //             >
    //                 have an account?{" "}
    //                 <Link to="/" style={{ color: "#00B400" }}>
    //                 Sign in
    //                 </Link>
    //             </Typography>
    //             </Box>
    //         </Box>
    //         </Container>
    //     </LoginScheme>
    //     </ThemeProvider>
    // );
    // };

    // export default NuovaSignUpComponent;
