    import React                    from "react";
    import { useNavigate }          from "react-router-dom";
    import loginTorchy              from "../images/loginTorchy.svg";
    import { Box }                  from "@mui/material";
    import LoginComponent           from "../components/LoginComponent";
    import TorchyChallenging        from "../images/tochyChallenging.svg";

    const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            owerflow: "hidden",
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
        {/* <Box
            sx={{
            position: "absolute",
            top: "-5%",
            left: "2.5%",
            height: "10%",
            width: "20%",
            }}
        >
            <img alt="Torchy logo" src={TorchyChallenging} objectFit="cover" />
        </Box> */}

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

        <Box
            sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "40%",
            // height: "50vh",
            }}
        >
            <LoginComponent navigate={navigate} />
        </Box>
        </Box>
    );
    };

    export default LoginPage;
