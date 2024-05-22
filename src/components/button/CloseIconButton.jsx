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
        "&:hover": {
          color: "red",
          cursor: "pointer",
        },
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default CloseIconButton;
