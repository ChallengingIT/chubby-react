import React, { useState, useEffect }                                               from "react";
import { useNavigate }                                                              from "react-router-dom";
import authService                                                                  from "../services/auth.service";
import eventBus                                                                     from "../common/EventBus";
import { Box, Button, Typography, TextField, ThemeProvider, createTheme, IconButton, InputAdornment}            from "@mui/material";
import Torcia from "../images/torciaSF.png";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import nuovaTorcia from "../images/nuovaTorcia.svg";


const SignupComponent
 = () => {
    

    const theme = createTheme({
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4285F4',
                    },
            },
        },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                '&.Mui-focused': {
                    color: '#4285F4',
                },
            },
        },
    },
}
    });


    useEffect(() => {
        const handleBeforeUnload = (e) => {
            localStorage.removeItem("user");
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, []);

const navigate = useNavigate();
const [ nome,               setNome               ] = useState("");     
const [ cognome,            setCognome            ] = useState(""); 
const [ username,           setUsername           ] = useState("");
const [ password,           setPassword           ] = useState("");
const [ loginError,         setLoginError         ] = useState({ username: false, password: false });
const [ showPassword,       setShowPassword       ] = useState(false);


useEffect(() => {
    const lastRegisteredUsername = localStorage.getItem("lastRegisteredUsername");
    if (lastRegisteredUsername) {
        setUsername(lastRegisteredUsername);
        localStorage.removeItem("lastRegisteredUsername");
    }
}, []);

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


const handleRegister = async (event) => {
    if (event) {
        event.preventDefault();
    }
};

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleRegister();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '85vh',
            p: 3,
            m: 2,
            backgroundColor: '#FEFCFD',
            borderRadius: 8,
            boxShadow: '-10px -10px 10px 0 rgba(0.1, 0.1, 0.1, 0.1)',
            overflow: 'hidden'
            }}
        >

            <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%'}}
            >
                <ThemeProvider theme={theme}>
                {/* <Box sx={{  display: 'flex', alignSelf: 'flex-start', marginTop: 6, flexGrow: 1 }}> */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>


                <Typography variant="h5" component="h2" sx={{  mb: 5, color: "#00B401", fontSize: '3em', alignSelf: 'flex-start', mt: 8, fontWeight: 600 }}>Sign in</Typography>
                <img src={nuovaTorcia} alt="Torcia" style={{ maxWidth: '100%', width: '30%', alignSelf: 'flex-end', height: '8em' }} />
                {/* </Box> */}
                </Box>

                <Typography variant="h6" component="h2" sx={{ alignSelf: 'flex-start', fontSize: '1em' }}>Nome</Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nome"
                    label="Nome"
                    autoFocus
                    value={nome}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setNome(e.target.value);
                    }}
                    sx={{ mb: 4 }}
                    />


                <Typography variant="h6" component="h2" sx={{ alignSelf: 'flex-start', fontSize: '1em' }}>Cognome</Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="cognome"
                    label="Cognome"
                    autoFocus
                    value={cognome}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setCognome(e.target.value);
                    }}
                    sx={{ mb: 4 }}
                    />

                    <Typography variant="h6" component="h2" sx={{ alignSelf: 'flex-start', fontSize: '1em' }}>Enter your username</Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onKeyDown={handleKeyDown}
                    error={loginError.username}
                    helperText={loginError.username? "Username non valido" : ""}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setLoginError(errors => ({...errors, username: false }));
                    }}
                    sx={{ mb: 4 }}
                    />

                    <Typography variant="h6" component="h2" sx={{ alignSelf: 'flex-start', fontSize: '1em' }}>Enter your password</Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onKeyDown={handleKeyDown}
                    error={loginError.password} 
                    helperText={loginError.password ? "Password non valida." : ""}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError(errors => ({ ...errors, password: false }));
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                                ),
                            }}
                    sx={{  mb: 2 }}
                    />
                
                <Button
                color="primary"
                variant="contained"
                onClick={handleRegister}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: '#00B401',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    marginTop: 8,
                    marginBottom: 10,
                    "&:hover": {
                        backgroundColor: '#00B401',
                        color: 'white',
                        transform: 'scale(1.05)'
                    },
                }}
                >
                    Sign up
                </Button>
                </ThemeProvider>
            </Box>
        </Box>
    );
};
export default SignupComponent