    import React from "react";
    import { Box, Container } from "@mui/material";

    const SchemePage = ({ children }) => {
    return (
        <Container maxWidth="false"
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            height: "auto",
            width: "100vw",
        }}
        >
        <Container
        maxWidth="xl"
            sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: 'column',
            p: 3,
            marginLeft: "12.8em",
            // marginTop: "0.5em",
            marginBottom: "0.8em",
            marginRight: "0.8em",
            backgroundColor: "#FEFCFD",
            borderRadius: "20px",
            minHeight: "97vh",
            mt: 1.5,
            }}
        >
            {children}
        </Container>
        </Container>
    );
    };

    export default SchemePage;
