import React, { useState, useEffect }                                               from "react";
import { useNavigate }                                                              from "react-router-dom";
import authService                                                                  from "../services/auth.service";
import eventBus                                                                     from "../common/EventBus";
import { Box, Button, Typography, TextField, ThemeProvider, createTheme, IconButton, InputAdornment}            from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import nuovaTorcia from "../images/nuovaTorcia.svg";


const LoginComponent
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
const [ username,           setUsername           ] = useState("");
const [ password,           setPassword           ] = useState("");
const [ loginError,         setLoginError         ] = useState({ username: false, password: false });
const [ showPassword,       setShowPassword       ] = useState(false);
const [ isFlipped,          setIsFlipped          ] = useState(false);


const toggleFlip = () => {
    setIsFlipped(!isFlipped);
};

// Stile per l'effetto di rotazione
const flipStyles = {
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative'
};

useEffect(() => {
    const lastRegisteredUsername = localStorage.getItem("lastRegisteredUsername");
    if (lastRegisteredUsername) {
        setUsername(lastRegisteredUsername);
        localStorage.removeItem("lastRegisteredUsername");
    }
}, []);

const handleLogin = async (e) => {
    if (e) {
        e.preventDefault();
    }
    try {
        const response = await authService.login(username, password);
        if (response && response.token) {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response));
            eventBus.dispatch("loginSuccess");
            const userRole = response.roles[0];


            if (userRole === "ROLE_ADMIN" || userRole === "ROLE_RECRUITER" || userRole === "ROLE_BM") {
                navigate("/dashboard");
            } else if (userRole === "ROLE_USER") {
                navigate("/dashboard");
            }
        }
        } catch (error) {
            console.error('Errore durante il login:', error);
            if (error.message.includes("username")) {
                setLoginError(errors => ({ ...errors, username: true }));
            } else if (error.message.includes("password")) {
                setLoginError(errors => ({ ...errors, password: true }));
            } else {
                setLoginError({ username: true, password: true });
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleLogin();
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
            height: '90vh',
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
            onSubmit={handleLogin}
            noValidate
            sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%'}}
            >
                <ThemeProvider theme={theme}>
                {/* <Box sx={{  display: 'flex', alignSelf: 'flex-start', marginTop: 6, flexGrow: 1 }}> */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>


                <Typography variant="h5" component="h2" sx={{  mb: 5, color: "#00B401", fontSize: '3em', alignSelf: 'flex-start', mt: 2, fontWeight: 600 }}>Sign in</Typography>
                {/* <img src={nuovaTorcia} alt="Torcia" style={{ maxWidth: '100%', width: '30%', alignSelf: 'flex-end', height: '8em' }} /> */}
                {/* </Box> */}
                </Box>
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
                onClick={handleLogin}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: '#00B401',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    mt: 5,
                    mb:1,
                    "&:hover": {
                        backgroundColor: '#00B401',
                        color: 'white',
                        transform: 'scale(1.05)'
                    },
                }}
                >
                    Accedi
                </Button>
                <Typography variant="h6" component="h2" sx={{  fontSize: '1em', color: '#00B401', mb: 1 }}>Forgot password</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', border: 'solid 1px #00B401', borderRadius: 2, mt: 2, mb: 1 }}/>    
                {/* <Button 
                on
                sx={{  display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 2,
                mt: 5,
                mb:1,
                "&:hover": {
                    backgroundColor: 'black',
                    color: 'white',
                    transform: 'scale(1.05)'
                },
                }}
                >
                    Registrati
                </Button> */}
                </ThemeProvider>
            </Box>
        </Box>
    );
};
export default LoginComponent
