import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Slide,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";

function EmailModal({ open, handleClose }) {


  const [ alert, setAlert ] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [formData, setFormData] = useState({
    destinatari: "",
    oggetto: "",
    note: "",
  });

  const handleChange = (name) => (event) => {
    const newValue = event.target.value;
    setFormData({ ...formData, [name]: newValue });
  };

  const onClose = () => {
    setFormData({
      destinatari: "",
      oggetto: "",
      note: "",
    });
    handleClose();
  };

  const handleSubmitEmail = async () => {
    const datiDaInviare = {
      oggetto: formData.oggetto,
      note: formData.note,
      destinatari: formData.destinatari,
    };
    try {
      const responseInviaEmail = await axios.post(
        "http://localhost:8080/email/send",
        datiDaInviare,
        { headers: headers }
      );
      if (responseInviaEmail.data === "OK") {
        onClose();
      }
      if (responseInviaEmail.data === "ERRORE") {
        setAlert({ open: true, message: "errore durante il salvataggio dell'azienda!" });
        console.error("L'azienda non è stata salvata.");
        return;
    }
    } catch (error) {
      console.error("Errore durante l'invio dell'email: ", error);
    }
  };


   //funzione per la chiusura dell'alert
  const handleCloseAlert = (reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlert({...alert, open: false});
  };

  //funzione per la transizione dell'alert
  function TransitionDown(props) {
      return <Slide {...props} direction="down" />;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "70%",
          maxWidth: "70%",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              mt: 3,
              mr: 3,
              backgroundColor: "transparent",
              border: "none",
              color: "#898989",
              "&:hover": {
                border: "none",
                color: "red",
                transform: "scale(1.1)",
              },
            }}
            startIcon={<CloseIcon sx={{ backgroundColor: "transparent" }} />}
          />
        </Box>
        <DialogTitle
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            mt: 0.5,
            fontWeight: "600",
          }}
        >
          Invia Email
        </DialogTitle>
        <DialogContent sx={{ p: 12 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <TextField
              id="destinatari-box"
              label="Destinatari*"
              fullWidth
              variant="filled"
              name="destinatari"
              value={formData.destinatari}
              onChange={handleChange("destinatari")}
              sx={{
                height: "4em",
                p: 1,
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "&:hover .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#00B400",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{ mb: 1, mt: 0.3, ml: 1, color: "#666565", fontSize: "1em" }}
            >
              * Inserire i destinatari separati da " ; "
            </Typography>

            <TextField
              id="oggetto-box"
              label="Oggetto"
              fullWidth
              variant="filled"
              name="oggetto"
              value={formData.oggetto}
              onChange={handleChange("oggetto")}
              sx={{
                height: "4em",
                mb: 8,
                p: 1,
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "&:hover .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#00B400",
                },
              }}
            />

            <TextField
              id="messaggio-box"
              label="Testo del messaggio"
              name="note"
              multiline
              rows={4}
              onChange={handleChange("note")}
              value={formData.note}
              fullWidth
              variant="filled"
              sx={{
                mb: 2,
                p: 1,
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "&:hover .MuiFilledInput-root::before": {
                  borderBottom: "none",
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: "#00B400",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleSubmitEmail}
                variant="contained"
                sx={{
                  borderRadius: "5px",
                  backgroundColor: "#00B401",
                  "&:hover": {
                    backgroundColor: "#00B401",
                    transform: "scale(1.1)",
                  },
                }}
              >
                Invia
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </LocalizationProvider>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
        </Snackbar>
    </Dialog>
  );
}

export default EmailModal;
