import React from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Button from "@mui/material/Button";

function ClipButton({ idFile, fileDescrizione, onClick, hasFile, showSnackbar }) {
  const handleDownload = () => {
    if (hasFile && onClick) {
      onClick();
    } else if (!hasFile && showSnackbar) {
      showSnackbar("Il CV non è presente.");
    } else {
      console.warn("La funzione di download non è definita");
    }
  };

  return (
    <Button
      size="medium"
      startIcon={<AttachmentIcon sx={{ color: hasFile ? "black" : "#808080" }} />}
      onClick={handleDownload}
      sx={{
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

export default ClipButton;
