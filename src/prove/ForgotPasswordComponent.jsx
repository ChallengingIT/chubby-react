    import React, { useState, useEffect } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import axios from "axios";
    import authService from "../services/auth.service";
    import eventBus from "../common/EventBus";
    import {
    Box,
    Button,
    Typography,
    TextField,
    ThemeProvider,
    createTheme,

    Container,
    } from "@mui/material";
    import { useAuth } from "../services/authContext";
    import FormaOnda from "../images/FormaLoginNoOnda.svg";
    import EmailIcon from "@mui/icons-material/Email"; //email
    import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'; //icona grande
    import LoginScheme from "./LoginScheme";

    const ForgotPasswordComponent = () => {
    const navigate = useNavigate();
    const theme = createTheme({
        typography: {
        fontFamily: "Roboto, sans-serif",
        },
        components: {
        MuiFilledInput: {
            styleOverrides: {
            root: {
                "&:before": {
                borderBottom: "2px solid #00B400",
                },
                "&:after": {
                borderBottom: "2px solid #00B400",
                },
                "&.Mui-focused": {
                backgroundColor: "transparent",
                },
            },
            input: {
                color: "black", // Colore del testo digitato
            },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
            root: {
                color: "#00B400",
                "&.Mui-focused": {
                color: "#00B400",
                },
            },
            },
        },
        },
    });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
        sessionStorage.removeItem("user");
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const { forgot } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [loginError, setLoginError] = useState({
        username: false,
        password: false,
        email: false,
        name: false,
        surname: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const lastRegisteredUsername = sessionStorage.getItem(
        "lastRegisteredUsername"
        );
        if (lastRegisteredUsername) {
        setUsername(lastRegisteredUsername);
        sessionStorage.removeItem("lastRegisteredUsername");
        }
    }, []);

    const handleForgot = async (e) => {
        if (e) {
        e.preventDefault();
        }
        console.log("sto effettuando la registrazione dell'utente");
        navigate("/");
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
        navigate("/");
        }
    };

    const navigateToLogin = () => {
        navigate("/");
    };

    return (
        <ThemeProvider theme={theme}>
        <LoginScheme>
            <Container
            maxWidth="sm"
            sx={{
                position: "relative",
                display: "flex",
                borderRadius: "20px",
                bgcolor: "white",
                boxShadow: "10px 10px 10px 10px rgba(0, 0, 0, 0.4)",
                height: 'auto',
                minHeight: "80vh",
                overflow: "hidden", // il contenuto non esce fuori dal container
            }}
            >
            <Box
                sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                }}
            >
                <img
                alt="Torchy logo"
                src={FormaOnda}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                }}
                />
            </Box>
            <Box
                component="form"
                sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: '90%',
                p: 3,
                m: "auto",
                zIndex: 2,
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex',
                        alignItems: "center", 
                        justifyContent: 'center', 
                        flexDirection: 'column' 
                    }}
                >
                    <LockResetOutlinedIcon 
                        sx={{ 
                            width: '100px', 
                            height: '100px', 
                            mb: 2 
                        }}
                    />
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.1em', 
                            color: 'black',
                            textAlign: 'center',
                            mb: 2
                        }}
                    >
                        Problemi di accesso?
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: 'center'}}>Inserisci il tuo indirizzo e-mail e ti invieremo un link per accedere di nuovo al tuo account.</Typography>
                </Box>

                <TextField
                variant="filled"
                margin="normal"
                fullWidth
                id="email"
                label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon />
                    <Box sx={{ ml: 1 }}>Email</Box>
                    </Box>
                }
                autoComplete="email"
                autoFocus
                value={email}
                onKeyDown={handleKeyDown}
                error={loginError.email}
                helperText={loginError.email ? "Email non valida" : ""}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError((errors) => ({ ...errors, email: false }));
                }}
                sx={{
                    mb: 2,
                    "& .MuiFilledInput-root.Mui-focused": {
                    bgcolor: "transparent",
                    },
                    "& .MuiInputBase-root": {
                    bgcolor: "transparent",
                    },
                    "& .MuiFormLabel-root": {
                    color: "#00B400",
                    },
                    "& .MuiFilledInput-root": {
                    "&:before": {
                        borderBottom: "2px solid #00B400",
                    },
                    "&:after": {
                        borderBottom: "2px solid #00B400",
                    },
                    },
                }}
                />


                <Button
                color="primary"
                variant="contained"
                onClick={handleForgot}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "#00B401",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mt: 2,
                    "&:hover": {
                    backgroundColor: "#116d0e",
                    color: "white",
                    transform: "scale(1.05)",
                    },
                }}
                >
                Send Email
                </Button>


            <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                mt: 6 
            }}
        >
            <Box 
                sx={{ 
                    flexGrow: 1, 
                    height: '1px', 
                    backgroundColor: '#00B400' 
                }} 
            />
            <Typography 
                sx={{ 
                    margin: '0 8px', 
                    color: 'grey' 
                }}
            >
                O
            </Typography>
            <Box 
                sx={{ 
                    flexGrow: 1, 
                    height: '1px', 
                    backgroundColor: '#00B400' 
                }} 
            />
        </Box>

                <Box sx={{ alignSelf: "center", mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{
                    mt: 1,
                    fontWeight: "bold",
                    fontSize: "1.1em",
                    textAlign: "left",
                    }}
                >
                    {" "}
                    <Link to="/signup" style={{ color: "#00B400", textDecoration: 'none', cursor: 'pointer' }}>
                    Create new account
                    </Link>
                </Typography>
                </Box>

                <Button
                color="primary"
                variant="contained"
                onClick={navigateToLogin}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                    backgroundColor: "#00B401",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mt: 1,
                    "&:hover": {
                    backgroundColor: "#116d0e",
                    color: "white",
                    transform: "scale(0.90)",
                    },
                }}
                >
                Back to Login
                </Button>

            </Box>
            </Container>
        </LoginScheme>
        </ThemeProvider>
    );
    };

    export default ForgotPasswordComponent;
