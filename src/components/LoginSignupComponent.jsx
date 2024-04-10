// import React, { useState, useEffect }                                               from "react";
// import { useNavigate }                                                              from "react-router-dom";
// import authService                                                                  from "../services/auth.service";
// import eventBus                                                                     from "../common/EventBus";
// import { Box, Button, Typography, TextField, ThemeProvider, createTheme, IconButton, InputAdornment, Autocomplete}            from "@mui/material";
// import Torcia from "../images/torciaSF.png";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import nuovaTorcia from "../images/nuovaTorcia.svg";
// import axios from 'axios';



// const LoginSignupComponent
//  = () => {
    

//     const theme = createTheme({
//         components: {
//             MuiOutlinedInput: {
//                 styleOverrides: {
//                     root: {
//                         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                             borderColor: '#4285F4',
//                     },
//             },
//         },
//     },
//     MuiInputLabel: {
//         styleOverrides: {
//             root: {
//                 '&.Mui-focused': {
//                     color: '#4285F4',
//                 },
//             },
//         },
//     },
// }
//     });


//     useEffect(() => {
//         const handleBeforeUnload = (e) => {
//             localStorage.removeItem("user");
//     };
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => {
//         window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
// }, []);

// const navigate = useNavigate();
// const [ username,           setUsername           ] = useState("");
// const [ password,           setPassword           ] = useState("");
// const [ loginError,         setLoginError         ] = useState({ username: false, password: false });
// const [ showPassword,       setShowPassword       ] = useState(false);
// const [ isFlipped,          setIsFlipped          ] = useState(false);
// const [ signupError,        setSignupError        ] = useState({ nome: false, cognome: false, username: false, password: false });
// const [ values,             setValues             ] = useState({
//     nome: '',
//     cognome: '',
//     username: '',
//     password: '',
//     role: ''
// });




// const ruoliOptions = [
//     {
//         value: 'ROLE_ADMIN',
//         label: 'Admin',
//     },
//     {
//         value: 'ROLE_USER',
//         label: 'User',
//     },
//     {
//         value: 'ROLE_BM',
//         label: 'Business Manager',
//     },
//     {
//         value: 'ROLE_RECRUITER',
//         label: 'Recruiter',
//     }
// ];


// const handleFlip = () => {
//     setIsFlipped(!isFlipped);
//     setSignupError({ nome: false, cognome: false, username: false, password: false });
//     setLoginError({ username: false, password: false });
// };

// // Stile per l'effetto di rotazione
// const flipStyles = {
//     display: 'flex',
//     justifyContent: 'center',
//     width: '100%',
//     transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
//     transition: 'transform 0.6s',
//     transformStyle: 'preserve-3d',
//     position: 'relative'
// };


// const flipContainerStyles = {
//     perspective: '1000px',
//     display: 'flex',
//     width: '60vw',
//     height: '80vh',
//     backgroundColor: 'white',
//     borderRadius: '20px',
//     boxShadow: '-10px -10px 10px 0 rgba(0.1, 0.1, 0.1, 0.1)',
//     overflow: 'hidden',
//     position: 'relative',
//     pl: 5,
//     pr: 5,
//     pt: 4,
//     pb: 1

    
// };


// const frontStyle = {
//     backfaceVisibility: 'hidden',
//     position: 'absolute', 
//     transform: 'rotateY(0deg)', 
//     width: '100%',
//     height: '100%',
//     display: 'flex', 
//     flexDirection: 'column', 
//     alignItems: 'center', 
//     justifyContent: 'center',

    
// };

// const backStyle = {
//     backfaceVisibility: 'hidden',
//     position: 'absolute', 
//     transform: 'rotateY(180deg)', 
//     width: '100%',
//     height: '100%',
//     top: 0, 
//     left: 0, 
//     display: 'flex',
//     flexDirection: 'column', 
//     alignItems: 'center',
//     justifyContent: 'center',
// };

// useEffect(() => {
//     const lastRegisteredUsername = localStorage.getItem("lastRegisteredUsername");
//     if (lastRegisteredUsername) {
//         setUsername(lastRegisteredUsername);
//         localStorage.removeItem("lastRegisteredUsername");
//     }
// }, []);

// const handleLogin = async (e) => {
//     if (e) {
//         e.preventDefault();
//     }
//     try {
//         const response = await authService.login(username, password);
//         if (response && response.token) {
//             localStorage.setItem("token", response.token);
//             localStorage.setItem("user", JSON.stringify(response));
//             eventBus.dispatch("loginSuccess");
//             const userRole = response.roles[0];


//             if (userRole === "ROLE_ADMIN" || userRole === "ROLE_RECRUITER" || userRole === "ROLE_BM") {
//                 navigate("/dashboard");
//             } else if (userRole === "ROLE_USER") {
//                 navigate("/userHompage");
//             }
//         }
//         } catch (error) {
//             console.error('Errore durante il login:', error);
//             if (error.message.includes("username")) {
//                 setLoginError(errors => ({ ...errors, username: true }));
//             } else if (error.message.includes("password")) {
//                 setLoginError(errors => ({ ...errors, password: true }));
//             } else {
//                 setLoginError({ username: true, password: true });
//             }
//         }
//     };


//     const handleRegister = async (event) => {
//         if(event) {
//             event.preventDefault();
//         }
//         try {
//             const response = await axios.post("http://localhost:8080/api/auth/signup", values);
//             // const response = await authService.register(values);
//             if (response.data.message === 'OK') {
//                 handleFlip();
//             }
//         } catch(error) {
//             console.error("Errore durante la registrazione: ", error);
//             if (error.message.includes("nome")) {
//                 setSignupError(errors => ({...errors, nome: true}));
//             } else if (error.message.includes("cognome")) {
//                 setSignupError(errors => ({...errors, cognome: true}));
//             } else if (error.message.includes("username")) {
//                 setSignupError(errors => ({...errors, username: true}));
//             } else if (error.message.includes("password")) {
//                 setSignupError(errors => ({...errors, password: true}));
//             } else if (error.message.includes("roles")) {
//                 setSignupError(errors => ({...errors, roles: true}));
//             } else {
//                 setSignupError({ nome: true, cognome: true, username: true, password: true, roles: true});
//             }
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.keyCode === 13) {
//             handleLogin();
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleInputChange = (name) => (event) => {
//         const newValue = event.target.value;
//         setValues({ ...values, [name]: newValue });
        
//     };


//     return (
//         <Box sx={flipContainerStyles}>
//             <Box sx={{ ...flipStyles, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
//                 <Box sx={frontStyle}>
//                     {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content', p: 3, m: 2 }}> */}
//                     <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography variant="h5" component="h2" sx={{  color: "#00B401", fontSize: '3em', fontWeight: 600, }}>Sign In</Typography>
//                     <img src={nuovaTorcia} alt="Torcia" style={{ maxWidth: '100%', width: '30%', height: '8em' }} />
//                     </Box>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', mt: 5 }}>
                    
//                     <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="username"
//                             label="Username"
//                             autoComplete="username"
//                             autoFocus
//                             value={username}
//                             onKeyDown={handleKeyDown}
//                             error={loginError.username}
//                             helperText={loginError.username? "Username non valido" : ""}
//                             onChange={(e) => {
//                                 setUsername(e.target.value);
//                                 setLoginError(errors => ({...errors, username: false }));
//                             }}
//                             sx={{ mb: 4 }}
//                     />

//                     <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     autoComplete="current-password"
//                     value={password}
//                     onKeyDown={handleKeyDown}
//                     error={loginError.password} 
//                     helperText={loginError.password ? "Password non valida." : ""}
//                     onChange={(e) => {
//                         setPassword(e.target.value);
//                         setLoginError(errors => ({ ...errors, password: false }));
//                     }}
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton
//                                     aria-label="toggle password visibility"
//                                     onClick={togglePasswordVisibility}
//                                     edge="end"
//                                 >
//                                     {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//                                 </IconButton>
//                             </InputAdornment>
//                                 ),
//                             }}
//                     sx={{  mb: 2 }}
//                     />
//                 <Button
//                 color="primary"
//                 variant="contained"
//                 onClick={handleLogin}
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     width: '90%',
//                     backgroundColor: '#00B401',
//                     color: 'white',
//                     fontWeight: 'bold',
//                     borderRadius: 2,
//                     mt: 5,
//                     mb:3,
//                     "&:hover": {
//                         backgroundColor: '#00B401',
//                         color: 'white',
//                         transform: 'scale(1.05)'
//                     },
//                 }}
//                 >
//                     Accedi
//                 </Button>
//                 {/* <Typography variant="h6" component="h2" sx={{  fontSize: '1em', color: '#00B401', mb: 1 }}>Forgot password</Typography> */}
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', border: 'solid 1px #00B401', borderRadius: 2, mt: 2, mb: 1 }}/>    
//                 <Button 
//                 onClick={handleFlip}
//                 sx={{  display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '70%',
//                 backgroundColor: 'black',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 borderRadius: 2,
//                 mt: 5,
//                 mb:1,
//                 "&:hover": {
//                     backgroundColor: 'black',
//                     color: 'white',
//                     transform: 'scale(1.05)'
//                 },
//                 }}
//                 >
//                     Sign Up
//                 </Button>
//                     </Box>
//                     {/* </Box> */}
//                 </Box>





//                 { /* retro */ }
//                 <Box sx={backStyle}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', mb: 10 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 2 }}>
//                     <Typography variant="h5" component="h2" sx={{  color: "#00B401", fontSize: '3em', fontWeight: 600, }}>Sign Up</Typography>
//                     <img src={nuovaTorcia} alt="Torcia" style={{ maxWidth: '100%', width: '30%', height: '8em' }} />
//                 </Box>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow: 'auto' }}>
//                 <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="nome"
//                             label="Nome"
//                             autoComplete="nome"
//                             autoFocus
//                             value={values.nome}
//                             onKeyDown={handleKeyDown}
//                             // error={signupError.username}
//                             // helperText={signupError.username? "Inserire il nome" : ""}
//                             // onChange={(e) => {
//                             //     handleInputChange(e);
//                             //     setSignupError(errors => ({ ...errors, nome: false }));

//                             // }}
//                             onChange={handleInputChange('nome')}

//                             sx={{ mb: 2, mt: 2 }}
//                     />
//                     <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="cognome"
//                             label="Cognome"
//                             autoComplete="cognome"
//                             autoFocus
//                             value={values.cognome}
//                             onKeyDown={handleKeyDown}
//                             // error={signupError.username}
//                             // helperText={signupError.username? "Inserire il cognome" : ""}
//                             // onChange={(e) => {
//                             //     handleInputChange('cognome');
//                             //     setSignupError(errors => ({ ...errors, cognome: false }));

//                             // }}
//                             onChange={handleInputChange('cognome')}
//                             sx={{ mb: 2 }}
//                     />
//                     <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="register-username"
//                             label="Username"
//                             autoComplete="username"
//                             autoFocus
//                             value={values.username}
//                             onKeyDown={handleKeyDown}
//                             // error={signupError.username}
//                             // helperText={signupError.username? "Inserire username" : ""}
//                             // onChange={(e) => {
//                             //     setSignupError(errors => ({...errors, username: false }));
//                             // }}
//                             onChange={handleInputChange('username')}

//                             sx={{ mb: 2 }}
//                     />

//                     <TextField
//                     margin="normal"
//                     required
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type={showPassword ? "text" : "password"}
//                     id="register-password"
//                     autoComplete="current-password"
//                     value={values.password}
//                     onKeyDown={handleKeyDown}
//                     // error={signupError.password} 
//                     // helperText={signupError.password ? "Inserire la password." : ""}
//                     // onChange={(e) => {
//                     //     setSignupError(errors => ({ ...errors, password: false }));
//                     // }}
//                     onChange={handleInputChange('password')}

//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton
//                                     aria-label="toggle password visibility"
//                                     onClick={togglePasswordVisibility}
//                                     edge="end"
//                                 >
//                                     {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//                                 </IconButton>
//                             </InputAdornment>
//                                 ),
//                             }}
//                     sx={{  mb: 2 }}
//                     />
//                     <Autocomplete
//                         fullWidth
//                         error={signupError.password} 
//                         helperText={signupError.password ? "Inserire il ruolo." : ""}
//                         id="role"
//                         options={ruoliOptions}
//                         getOptionLabel={(option) => option.label}
//                         isOptionEqualToValue={(option, value) => option.value === value}
//                         renderInput={(params) => <TextField {...params} label="Role" />}
//                         // onChange={(e) => {
//                         //     handleChange();
//                         //     setSignupError(errors => ({ ...errors, roles: false }));
//                         // }}
//                         onChange={(event, newValue) => {
//                             handleInputChange('role')({ target: { value: newValue?.value || null } });
//                         }}
//                         value={values ? ruoliOptions.find(option => option.value === values) : null}
//                         sx={{ mt: 2 }}
//                     />
//                 <Button
//                 color="primary"
//                 variant="contained"
//                 onClick={handleRegister}
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     width: '90%',
//                     backgroundColor: '#00B401',
//                     color: 'white',
//                     fontWeight: 'bold',
//                     borderRadius: 2,
//                     mt: 3,
//                     mb:2,
//                     "&:hover": {
//                         backgroundColor: '#00B401',
//                         color: 'white',
//                         transform: 'scale(1.05)'
//                     },
//                 }}
//                 >
//                     Registrati
//                 </Button>
//                 {/* <Typography variant="h6" component="h2" sx={{  fontSize: '1em', color: '#00B401', mb: 1 }}>Forgot password</Typography> */}
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', border: 'solid 1px #00B401', borderRadius: 2, mt: 2, mb: 1 }}/>    
//                 <Button 
//                 onClick={handleFlip}
//                 sx={{  display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 width: '70%',
//                 backgroundColor: 'black',
//                 color: 'white',
//                 fontWeight: 'bold',
//                 borderRadius: 2,
//                 mt: 2,
//                 mb:1,
//                 "&:hover": {
//                     backgroundColor: 'black',
//                     color: 'white',
//                     transform: 'scale(1.05)'
//                 },
//                 }}
//                 >
//                     Sign In
//                 </Button>
//                     </Box>

//                 </Box>
//                 </Box>
//             </Box>
//         </Box>

//     );

// };
// export default LoginSignupComponent
