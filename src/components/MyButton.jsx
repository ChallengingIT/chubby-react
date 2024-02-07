import React from 'react'
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

function MyButton({onClick, children}) {
  return (
    <Button
    className="button-add"
    variant="contained"
    size="medium"
    startIcon={<AddIcon />}
    onClick={onClick}
    sx={{
      width: "100%",
      maxWidth: "200px",
      backgroundColor: "black",
      color: "white",
      borderRadius: "10px",
      fontSize: "0.7rem",
      fontWeight: "bolder",
      marginLeft: "30px",
      padding: "0.5rem 1rem",
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      textAlign:'center',

      "&:hover": {
        backgroundColor: "#ffb800",
        transform: "scale(1.05)",
        color: 'black',
      },
    }}
  >
    <span>{children}</span>
  </Button>
  )
}

export default MyButton