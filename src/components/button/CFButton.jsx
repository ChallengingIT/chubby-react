    import React from "react";
    import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
    import Button from "@mui/material/Button";

    function CFButton({ idFile, fileDescrizione, onClick, hasFile }) {
    const handleDownload = () => {
        if (onClick) {
        onClick();
        } else {
        console.warn("La funzione di download non è definita");
        }
    };

    return (
        <Button
        size="medium"
        startIcon={<InsertDriveFileIcon sx={{ color: hasFile ? "black" : "#808080" }} />}
        onClick={handleDownload}
        sx={{
            marginRight: "10%",
            backgroundColor: "transparent",
            borderRadius: "50%",
            minWidth: "2em",
            width: "2em",
            height: "2em",
            padding: "0",
            "& .MuiButton-startIcon": {
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            },
            "&:hover": {
            backgroundColor: "transparent",
            transform: "scale(1.05)",
            cursor: "pointer",
            borderRadius: "50%",
            borderStyle: "none",
            },
        }}
        />
    );
    }

    export default CFButton;
