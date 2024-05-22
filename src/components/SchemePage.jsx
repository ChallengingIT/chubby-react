    import React from "react";
    import { Box } from "@mui/material";

    const SchemePage = ({ children }) => {
    return (
        <Box
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            height: "auto",
            width: "100vw",
        }}
        >
        <Box
            sx={{
                flexGrow: 1,
                p: 3,
                marginLeft: "12.8em",
                marginTop: "0.5em",
                marginBottom: "0.8em",
                marginRight: "0.8em",
                backgroundColor: "#FEFCFD",
                borderRadius: "20px",
                minHeight: "98vh",
                mt: 1.5,
            }}
        >
            {children}
        </Box>
        </Box>
    );
    };

    export default SchemePage;
