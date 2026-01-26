import React from "react";
import { useNavigate } from "react-router-dom";
import loginTorchy from "../images/loginTorchy.svg";
import { Box, Container } from "@mui/material";
import TorchyChallenging from "../images/tochyChallenging.svg";

const LoginScheme = ({ children }) => {
    const navigate = useNavigate();
    return (
        <Container
            maxWidth="false"
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                overflow: "hidden",
            }}
        >
            <img
                alt="Login background"
                src={loginTorchy}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: { xs: '2%', sm: '3%', md: '-35%' },
                    left: { xs: '5%', md: '1.5%' },
                    width: { xs: '30%', sm: '25%', md: '25%' },
                    height: { xs: '15%', md: '100%' }
                }}
            >
                <img alt="Torchy logo" src={TorchyChallenging} style={{ width: '100%', height: '100%' }} />
            </Box>

            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {children}
            </Container>
        </Container>
    );
};

export default LoginScheme;
