    import React from "react";
    import { Box, Typography, Button } from "@mui/material";
    import { useNavigate } from "react-router-dom";
    import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";

    const NotFoundPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        sessionStorage.clear();
        navigate("/"); // Modifica questo percorso se vuoi reindirizzare a una pagina diversa
    };

    return (
        <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            p: 3,
        }}
        >
        <SentimentVeryDissatisfiedRoundedIcon
            sx={{ fontSize: 200, color: "#00B400" }}
        />
        <Typography
            variant="h1"
            component="h2"
            gutterBottom
            sx={{ color: "#00B400" }}
        >
            404
        </Typography>
        <Typography variant="h5" gutterBottom>
            Oops! La pagina che stavi cercando non esiste.
        </Typography>
        <Button
            variant="contained"
            onClick={goHome}
            sx={{
            mt: 3,
            backgroundColor: "#00B400",
            color: "white",
            "&:hover": {
                backgroundColor: "#00B400",
                color: "white",
                transform: "scale(1.01)",
            },
            }}
        >
            Torna alla Login
        </Button>
        </Box>
    );
    };

    export default NotFoundPage;
