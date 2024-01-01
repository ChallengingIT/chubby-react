import React from 'react';
import Button from "@mui/material/Button";

function SaveButton({ onSubmit, buttonText }) {
    return (
        <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            style={{
                backgroundColor: "black",
                marginBottom: "20px",
                "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                },
            }}
        >
            {buttonText || 'Salva'} 
        </Button>
    );
}

export default SaveButton;
