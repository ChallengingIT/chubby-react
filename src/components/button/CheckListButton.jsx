import React     from "react";
import Button    from "@mui/material/Button";
import ChecklistIcon                                    from '@mui/icons-material/Checklist';


function CheckListButton({ onClick, id }) {
  return (
    <Button
      startIcon={<ChecklistIcon />}
      sx={{
        backgroundColor: "transparent",
            color: "#00B400",
            borderRadius: "50%",
            minWidth: "2em",
            width: "2em",
            height: "2em",
            padding: 0,
            "& .MuiButton-startIcon": {
                margin: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            },
            "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.05)",
                color: "#00B400",
                cursor: "pointer",
                borderRadius: "50%",
                borderStyle: "none",
            },
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default CheckListButton;
