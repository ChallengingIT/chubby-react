import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";

const LogoutPopUp = ({ open, onClose, onLogout }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "white" }}>
        Conferma Logout
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "white" }}>
        <DialogContentText sx={{ backgroundColor: "white" }}>
          Sei sicuro di voler effettuare il logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "white" }}>
        <Button
          onClick={onClose}
          color="primary"
          sx={{
            backgroundColor: "#6C757D",
            color: "white",
            "&:hover": {
              color: "white",
              backgroundColor: "#6C757D",
              padding: " 0.5rem",
            },
          }}
        >
          Annulla
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            onLogout();
            onClose();
          }}
          component={Link}
          to="/login" 
          sx={{
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "black",
              padding: "0.55rem 1.05rem",
            },
          }}
        >
          Conferma
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutPopUp;
