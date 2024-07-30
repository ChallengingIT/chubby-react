import React                 from "react";
import PersonSearchIcon      from "@mui/icons-material/PersonSearch";
import Button                from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function PersonInfoButton({ onClick, to, hasInterviste }) {
  const navigate = useNavigate();

  const handleEditAction = () => {
    if (to) {
      navigate(to);
    } else {
      console.warn("L'URL non è definito");
    }
  };

  return (
    <Button
      // variant="contained"
      size="medium"
      startIcon={<PersonSearchIcon sx={{ color: hasInterviste ? "black" : "#808080" }} />}
      onClick={handleEditAction}
      sx={{
        // marginRight: "10%",
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

export default PersonInfoButton;
