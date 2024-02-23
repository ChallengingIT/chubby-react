import React, { useState, useEffect }                                               from "react";
import { useNavigate }                                                              from "react-router-dom";
import authService                                                                  from "../services/auth.service";
import eventBus                                                                     from "../common/EventBus";
import { Box, Button, Typography, TextField, ThemeProvider, createTheme}            from "@mui/material";



const LoginComponentTorchy = () => {

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
        if (response && response.accessToken) {
            localStorage.setItem("accessToken", response.accessToken);
            localStorage.setItem("user", JSON.stringify(response));
            eventBus.dispatch("loginSuccess");
            const userRole = response.roles[0];

            if (userRole === "ROLE_ADMIN" || userRole === "ROLE_RECRUITER" || userRole === "ROLE_BM") {
                navigate("/homepage");
            } else if (userRole === "ROLE_USER") {
                navigate("/userHompage");
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


    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '75%',
            height: '100%',
            p: 3,
            m: 2,
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '-10px -10px 10px 0 rgba(0.1, 0.1, 0.1, 0.1)' 
            }}
        >
            <Box sx={{  display: 'flex', alignSelf: 'flex-start', width: '100%', marginTop: 6 }}>
            <Typography variant="h5" component="h2" sx={{ ml: 4, mb: 4, color: "#1A9431", fontSize: '3em' }}>Sign in</Typography>
            </Box>
            <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '90%'}}
            >
                <ThemeProvider theme={theme}>
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
                    type="password"
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
                    sx={{  mb: 2 }}
                    />
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                <Typography variant="h6" component="h2" sx={{  fontSize: '1em' }}>No Account?</Typography>
                <Typography variant="h6" component="h2" sx={{  fontSize: '1em', color: '#1a9431' }}>Forgot password</Typography>

                </Box>
                <Typography variant="h6" component="h2" sx={{ alignSelf: 'flex-start', fontSize: '1em', color: '#1a9431' }}>Sign up</Typography>

                </ThemeProvider>
                <Button
                color="primary"
                variant="contained"
                onClick={handleLogin}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: '#1a9431',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    marginTop: 8,
                    marginBottom: 10,
                    "&:hover": {
                        backgroundColor: '#1a9431',
                        color: 'white',
                        transform: 'scale(1.05)'
                    },
                }}
                >
                    Sign in
                </Button>
            </Box>
        </Box>
    )


 
    



};
export default LoginComponentTorchy