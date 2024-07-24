import React     from "react";
import Button    from "@mui/material/Button";
import ChecklistIcon                                    from '@mui/icons-material/Checklist';


function CheckListButton({ onClick, id }) {
  return (
    <Button
      startIcon={<ChecklistIcon />}
      sx={{
        color: "black",
        minWidth: "2em",
        height: "2em",
        bgcolor: 'transparent',
        p: 0,
        m: 0,
        "&:hover": {
          color: "red",
          cursor: "pointer",
          bgcolor: 'transparent'
        },
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default CheckListButton;
