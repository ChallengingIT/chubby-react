import React     from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button    from "@mui/material/Button";

function CloseIconButton({ onClick, id }) {
  return (
    <Button
      startIcon={<CloseIcon />}
      sx={{
        color: "black",
        minWidth: "2em",
        height: "2em",
        bgcolor: 'transparent',
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

export default CloseIconButton;
