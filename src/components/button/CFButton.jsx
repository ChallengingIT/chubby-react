    import React          from "react";
    import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';    import Button         from "@mui/material/Button";

    function CFButton({ idFile, fileDescrizione, onClick }) {
    const handleDownload = () => {
        if (onClick) {
        onClick();
        } else {
        console.warn("La funzione di download non è definita");
        }
    };

    return (
        <Button
        // variant="contained"
        size="medium"
        startIcon={<InsertDriveFileIcon />}
        onClick={handleDownload}
        sx={{
            marginRight: "10%",
            backgroundColor: "transparent",
            color: "black",
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
            color: "black",
            cursor: "pointer",
            borderRadius: "50%",
            borderStyle: "none",
            },
        }}
        />
    );
    }

    export default CFButton;