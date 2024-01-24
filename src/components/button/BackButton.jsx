import React from 'react'
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function BackButton() {


    const handleGoBack = () => {
        window.history.back();
      };

return(
    <Button
    color="primary"
    onClick={handleGoBack}
    style={{
      backgroundColor: "black",
      color: "white",
      marginBottom: "20px",
      "&:hover": {
        backgroundColor: "black",
        transform: "scale(1.05)",
      },
    }}
  >
 Indietro
  </Button>
)
};

export default BackButton;