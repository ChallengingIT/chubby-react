import React, { useState, useEffect }                                               from "react";
import { useNavigate }                                                              from "react-router-dom";
import authService                                                                  from "../services/auth.service";
import eventBus                                                                     from "../common/EventBus";
import { Box, Button, Typography, TextField, ThemeProvider, createTheme}            from "@mui/material";


export const LoginComponent = (props) => {

    const theme = createTheme({
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                '&.Mui-focused': {
                  color: 'black',
                },
              },
            },
          },
        },
      });
  const { onLoginSuccess } = props;
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      localStorage.removeItem("user");
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const initialValues = { username: "", password: "" };
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
    console.log("DATI INVIATI: ", username, password);
    if (response && response && response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response));
      // onLoginSuccess(response);
      console.log("UTENTE LOGGATO DA LOGIN: ", response);
      // Emesso un evento di login riuscito
      eventBus.dispatch("loginSuccess");
      const userRole = response.roles[0];

      if (userRole === "ROLE_ADMIN" || userRole === "ROLE_RECRUITER" || userRole === "ROLE_BM") {
        navigate("/homepage");
      } else if (userRole === "ROLE_USER") {
        navigate("/userHomepage");
      }
    }
  } catch (error) {
    console.error("Errore di login:", error);
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
    if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
      handleLogin();
    }
  };
return (
    <Box
      sx={{
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        m: 2,
        backgroundColor: '#14D928',
        borderRadius: '20px',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>LOGIN</Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        noValidate
        sx={{ mt: 1 }}
      >
        <ThemeProvider theme={theme}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onKeyDown={handleKeyDown}
          error={loginError.username} 
          helperText={loginError.username ? "Username non valida." : ""}
          onChange={(e) => {
            setUsername(e.target.value);
            setLoginError(errors => ({ ...errors, username: false }));
          }}          sx={{ mb: 2, width: '400px'}}
        />
        {/* {loginError && <p className="password-error">Username non valido.</p>} */}
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
          sx={{ mb: 2, width: '400px' }}
        />
        </ThemeProvider>
        {/* {loginError && <p className="password-error">Password non valido.</p>} */}
  <Button
            color="primary"
            variant="contained"
            onClick={handleLogin}
            sx={{
                marginTop: '20px',
                width: '70%',
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
                borderRadius: '40px',
                "&:hover": {
                backgroundColor: "black",
                color: "white",
                transform: "scale(1.05)",
                },
            }}
            >
            Login
            </Button>
      </Box>
    </Box>
  );
};
export default LoginComponent;