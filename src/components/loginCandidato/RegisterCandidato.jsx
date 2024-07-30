    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import authService from "../../services/auth.service.js";
    import eventBus from "../../common/EventBus.js";
    import {
    Box,
    Button,
    Typography,
    TextField,
    ThemeProvider,
    createTheme,
    IconButton,
    InputAdornment,
    Container,
    } from "@mui/material";
    import VisibilityIcon from "@mui/icons-material/Visibility";
    import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
    import CheckCircleIcon from "@mui/icons-material/CheckCircle";
    import CancelIcon from '@mui/icons-material/Cancel';
    import { useAuth } from "../../services/authContext.js";
    import LoginScheme from '../../prove/LoginScheme.jsx';
    import CVRegisterModal from "../modal/CVRegisterModal.jsx";

    const RegisterCandidato = () => {
    const theme = createTheme({
        components: {
        MuiOutlinedInput: {
            styleOverrides: {
            root: {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4285F4",
                },
            },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
            root: {
                "&.Mui-focused": {
                color: "#4285F4",
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

    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [cellulare, setCellulare] = useState("");
    const [residenza, setResidenza] = useState("");
    const [loginError, setLoginError] = useState({
        username: false,
        password: false,
        email: false,
        nome: false,
        cognome: false,

    });
    const [showPassword, setShowPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [cvError, setCvError] = useState(false);

    useEffect(() => {
        const lastRegisteredUsername = sessionStorage.getItem(
        "lastRegisteredUsername"
        );
        if (lastRegisteredUsername) {
        setUsername(lastRegisteredUsername);
        sessionStorage.removeItem("lastRegisteredUsername");
        }
    }, []);

        const handleRegister = async (e) => {
            if (e) {
            e.preventDefault();
            }
        
            setLoginError({
            username: false,
            password: false,
            email: false,
            nome: false,
            cognome: false,
            });
            setCvError(false);
        
            const errors = {};
            if (!username) errors.username = true;
            if (!password) errors.password = true;
            if (!email) errors.email = true;
            if (!nome) errors.nome = true;
            if (!cognome) errors.cognome = true;
        
            if (!cvFile) {
            setCvError(true);
            }
        
            if (Object.keys(errors).length > 0 || !cvFile) {
            setLoginError(errors);
            return;
            }
        
            try {
            const response = await authService.registerCandidato(username, password, nome, cognome, cellulare, residenza, email, cvFile);
            if (response === "OK") {
                navigate("/login");
            }
            } catch (error) {
            console.error("Errore durante la registrazione del candidato:", error);
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

    const handleOpenModal = (event) => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleFileUpload = (file) => {
        setCvFile(file);
        setCvError(false);
        handleCloseModal();
    };

    return (
        <LoginScheme>
        <Container
            maxWidth="sm"
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "35vw",
            minHeight: "88vh",
            pr: 2,
            pl: 2,
            backgroundColor: "#FEFCFD",
            borderRadius: 8,
            boxShadow: "-10px -10px 10px 0 rgba(0.1, 0.1, 0.1, 0.1)",
            overflow: "auto",
            '&::-webkit-scrollbar': {
                display: 'none', // per Chrome, Safari, e Opera
            },
            scrollbarWidth: 'none', // per Firefox
            msOverflowStyle: 'none', // per Internet Explorer 10+
            }}
        >
            <Box sx={{ width: "100%", height: "100%", perspective: "1000px" }}>
            <Box
                component="form"
                onSubmit={handleRegister}
                noValidate
                sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                }}
            >
                <ThemeProvider theme={theme}>
                <Box
                    sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    }}
                >
                    <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        mb: 3,
                        color: "#00B401",
                        fontSize: "3em",
                        alignSelf: "flex-start",
                        fontWeight: 600,
                    }}
                    >
                    Sign up
                    </Typography>
                </Box>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onKeyDown={handleKeyDown}
                    error={loginError.username}
                    helperText={loginError.username ? "" : ""}
                    onChange={(e) => {
                    setUsername(e.target.value);
                    setLoginError((errors) => ({ ...errors, username: false }));
                    }}
                    sx={{
                    mb: 2,
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
                    required
                    fullWidth
                    id="nome"
                    label="Nome"
                    autoComplete="nome"
                    value={nome}
                    onKeyDown={handleKeyDown}
                    error={loginError.nome}
                    helperText={loginError.nome ? "" : ""}
                    onChange={(e) => {
                    setNome(e.target.value);
                    setLoginError((errors) => ({ ...errors, nome: false }));
                    }}
                    sx={{
                    mb: 2,
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
                    required
                    fullWidth
                    id="cognome"
                    label="Cognome"
                    autoComplete="cognome"
                    value={cognome}
                    onKeyDown={handleKeyDown}
                    error={loginError.cognome}
                    helperText={loginError.cognome ? "" : ""}
                    onChange={(e) => {
                    setCognome(e.target.value);
                    setLoginError((errors) => ({ ...errors, cognome: false }));
                    }}
                    sx={{
                    mb: 2,
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    autoComplete="email"
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
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
                    fullWidth
                    id="cellulare"
                    label="Cellulare"
                    autoComplete="cellulare"
                    value={cellulare}
                    onKeyDown={handleKeyDown}
                    error={loginError.cellulare}
                    helperText={loginError.cellulare ? "" : ""}
                    onChange={(e) => {
                    setCellulare(e.target.value);
                    setLoginError((errors) => ({ ...errors, cellulare: false }));
                    }}
                    sx={{
                    mb: 2,
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
                    fullWidth
                    id="residenza"
                    label="Residenza"
                    autoComplete="residenza"
                    value={residenza}
                    onKeyDown={handleKeyDown}
                    error={loginError.residenza}
                    helperText={loginError.residenza ? "" : ""}
                    onChange={(e) => {
                    setResidenza(e.target.value);
                    setLoginError((errors) => ({ ...errors, residenza: false }));
                    }}
                    sx={{
                    mb: 2,
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <TextField
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
                    helperText={
                    loginError.password ? "" : ""
                    }
                    onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError((errors) => ({ ...errors, password: false }));
                    }}
                    InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                        >
                            {showPassword ? (
                            <VisibilityIcon />
                            ) : (
                            <VisibilityOffIcon />
                            )}
                        </IconButton>
                        </InputAdornment>
                    ),
                    }}
                    sx={{
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: "#00B400",
                    },
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                        borderColor: "#00B400",
                        },
                    },
                    }}
                />
                <Button
                    onClick={handleOpenModal}
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                    backgroundColor: "#00b400",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 2,
                    mt: 2,
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#116d0e",
                        color: "white",
                        transform: "scale(1.05)",
                    },
                    }}
                >
                    Add CV
                    {cvFile ? (
                    <CheckCircleIcon sx={{ ml: 1, color: "white" }} />
                    ) : (
                    cvError && <CancelIcon sx={{ ml: 1, color: "white" }} />
                    )}
                </Button>

                <Box
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    border: "solid 1px #00B401",
                    borderRadius: 2,
                    // mt: 2,
                    mb: 2,
                    }}
                />
                <Button
                    onClick={handleRegister}
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80%",
                    backgroundColor: "#00b400",
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
                    Sign up
                </Button>
                </ThemeProvider>
            </Box>
            </Box>
            <CVRegisterModal
            open={openModal}
            handleClose={handleCloseModal}
            handleFileUpload={handleFileUpload}
            />
        </Container>
        </LoginScheme>
    );
    };

    export default RegisterCandidato;
