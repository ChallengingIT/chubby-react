    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios"; // Import axios
    import authService from "../services/auth.service";
    import eventBus from "../common/EventBus";
    import {
    Box,
    Button,
    Typography,
    TextField,
    ThemeProvider,
    createTheme,
    IconButton,
    InputAdornment,
    } from "@mui/material";
    import VisibilityIcon from "@mui/icons-material/Visibility";
    import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
    import { useAuth } from "../services/authContext";

    const LoginComponent = () => {
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
    const [loginError, setLoginError] = useState({
        username: false,
        password: false,
        email: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const toggleForgot = () => {
        setForgotPassword(!forgotPassword);
    };

    const flipStyles = {
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.6s",
        transformStyle: "preserve-3d",
        position: "relative",
        width: "100%",
        height: "100%",
    };

    useEffect(() => {
        const lastRegisteredUsername = sessionStorage.getItem(
        "lastRegisteredUsername"
        );
        if (lastRegisteredUsername) {
        setUsername(lastRegisteredUsername);
        sessionStorage.removeItem("lastRegisteredUsername");
        }
    }, []);

    const handleLogin = async (e) => {
        if (e) {
        e.preventDefault();
        }
        try {
        const response = await authService.login(username, password);
        if (response && response.token) {
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("user", JSON.stringify(response));
            login(response);
            eventBus.dispatch("loginSuccess");
            const userRole = response.roles[0];

            if (
            userRole === "ROLE_ADMIN" ||
            userRole === "ROLE_RECRUITER" ||
            userRole === "ROLE_BM"
            ) {
            navigate("/dashboard");
            } else if (userRole === "ROLE_USER" || userRole === "ROLE_BUSINESS") {
            navigate("/homepage");
            }
        }
        } catch (error) {
        console.error("Errore durante il login:", error);
        if (error.message.includes("username")) {
            setLoginError((errors) => ({ ...errors, username: true }));
        } else if (error.message.includes("password")) {
            setLoginError((errors) => ({ ...errors, password: true }));
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post("http://89.46.196.60:8443/api/auth/lost/password", {
            email,
        });
        console.log("Password recovery email sent:", response.data);
        } catch (error) {
        console.error("Error during password recovery:", error);
        }
    };

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "70vh",
            p: 2,
            backgroundColor: "#FEFCFD",
            borderRadius: 8,
            boxShadow: "-10px -10px 10px 0 rgba(0.1, 0.1, 0.1, 0.1)",
            overflow: "hidden",
        }}
        >
        <Box sx={{ width: "100%", height: "100%", perspective: "1000px" }}>
            <Box sx={flipStyles}>
            {/* Front side (Login) */}
            {!forgotPassword && (
                <Box
                component="form"
                onSubmit={handleLogin}
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
                        mb: 5,
                        color: "#00B401",
                        fontSize: "3em",
                        alignSelf: "flex-start",
                        mt: 2,
                        fontWeight: 600,
                        }}
                    >
                        Sign in
                    </Typography>
                    </Box>
                    <Typography
                    variant="h6"
                    component="h2"
                    sx={{ alignSelf: "flex-start", fontSize: "1em" }}
                    >
                    Enter your username
                    </Typography>
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
                    helperText={loginError.username ? "Username non valido" : ""}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setLoginError((errors) => ({ ...errors, username: false }));
                    }}
                    sx={{
                        mb: 4,
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

                    <Typography
                    variant="h6"
                    component="h2"
                    sx={{ alignSelf: "flex-start", fontSize: "1em" }}
                    >
                    Enter your password
                    </Typography>
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
                    helperText={
                        loginError.password ? "Password non valida." : ""
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
                    <Button
                    color="primary"
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        backgroundColor: "#00B401",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 2,
                        mt: 3,
                        mb: 1,
                        "&:hover": {
                        backgroundColor: "#116d0e",
                        color: "white",
                        transform: "scale(1.05)",
                        },
                    }}
                    >
                    Accedi
                    </Button>

                    <Button
                    // onClick={toggleForgot}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        backgroundColor: "transparent",
                        color: "#00b400",
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:hover": {
                        backgroundColor: "transparent",
                        color: "#116d0e",
                        transform: "scale(1.01)",
                        },
                    }}
                    >
                    Forgot password
                    </Button>
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        border: "solid 1px #00B401",
                        borderRadius: 2,
                        mt: 2,
                        mb: 1,
                    }}
                    />
                    <Button
                    // onClick={toggleFlip}
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
                        mb: 1,
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
            )}

            {/* Back side (Register) */}
            {isFlipped && !forgotPassword && (
                <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
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
                        mb: 5,
                        color: "#00B401",
                        fontSize: "3em",
                        alignSelf: "flex-start",
                        mt: 2,
                        fontWeight: 600,
                        }}
                    >
                        Sign up
                    </Typography>
                    </Box>

                    <Typography
                    variant="h6"
                    component="h2"
                    sx={{ alignSelf: "flex-start", fontSize: "1em" }}
                    >
                    Enter your email
                    </Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    autoFocus
                    value={email}
                    onKeyDown={handleKeyDown}
                    error={loginError.email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError((errors) => ({ ...errors, email: false }));
                    }}
                    sx={{
                        mb: 4,
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

                    <Typography
                    variant="h6"
                    component="h2"
                    sx={{ alignSelf: "flex-start", fontSize: "1em" }}
                    >
                    Enter your password
                    </Typography>
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
                    helperText={
                        loginError.password ? "Password non valida." : ""
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

                    <Button
                    color="primary"
                    variant="contained"
                    onClick={toggleFlip}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        backgroundColor: "#00B401",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 2,
                        mt: 5,
                        mb: 1,
                        "&:hover": {
                        backgroundColor: "#116d0e",
                        color: "white",
                        transform: "scale(1.05)",
                        },
                    }}
                    >
                    Go Sign In
                    </Button>
                </ThemeProvider>
                </Box>
            )}

            {/* Forgot Password side */}
            {forgotPassword && (
                <Box
                component="form"
                onSubmit={handleForgotPassword}
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
                        mb: 5,
                        color: "#00B401",
                        fontSize: "3em",
                        alignSelf: "flex-start",
                        mt: 2,
                        fontWeight: 600,
                        }}
                    >
                        Forgot Password
                    </Typography>
                    </Box>
                    <Typography
                    variant="h6"
                    component="h2"
                    sx={{ alignSelf: "flex-start", fontSize: "1em" }}
                    >
                    Enter your email to reset your password
                    </Typography>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="forgot-email"
                    label="Email"
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
                        mb: 4,
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
                    color="primary"
                    variant="contained"
                    type="submit"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        backgroundColor: "#00B401",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: 2,
                        mt: 3,
                        mb: 1,
                        "&:hover": {
                        backgroundColor: "#116d0e",
                        color: "white",
                        transform: "scale(1.05)",
                        },
                    }}
                    >
                    Send reset link
                    </Button>

                    <Button
                    onClick={toggleForgot}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "80%",
                        backgroundColor: "transparent",
                        color: "#00b400",
                        fontWeight: "bold",
                        borderRadius: 2,
                        "&:hover": {
                        backgroundColor: "transparent",
                        color: "#116d0e",
                        transform: "scale(1.05)",
                        },
                    }}
                    >
                    Go back to login
                    </Button>
                </ThemeProvider>
                </Box>
            )}
            </Box>
        </Box>
        </Box>
    );
    };

    export default LoginComponent;
