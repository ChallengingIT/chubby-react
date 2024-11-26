import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";
import dayjs from "dayjs";
import { useUserTheme } from "./TorchyThemeProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Autocomplete,
  Box,
  Typography,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";

function AppuntamentoModal({ open, handleClose }) {
  const theme = useUserTheme();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [alert, setAlert] = useState(false);

  //funzione per la chiusura dell'alert
  const handleCloseAlert = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  //funzione per la transizione dell'alert
  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }

  const [ownerOptions, setOwnerOptions] = useState([]);
  const [formData, setFormData] = useState({
    destinatari: "",
    oggetto: "",
    luogo: "",
    data: "",
    ownerIds: "",
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
      luogo: "",
      data: "",
      ownerIds: "",
      note: "",
      owner: "",
    });
    handleClose();
  };

  const optionSelect = async () => {
    try {
      const ownerResponse = await axios.get(
        "http://89.46.196.60:8443/owner",
        { headers: headers }
      );
      if (Array.isArray(ownerResponse.data)) {
        const ownerOptions = ownerResponse.data.map((owner) => ({
          label: owner.descrizione,
          value: owner.id,
        }));
        setOwnerOptions(ownerOptions);
      }
    } catch (error) {
      console.error("Errore durante il recupero delle province:", error);
    }
  };

  useEffect(() => {
    optionSelect();
  }, []);

  const handleSubmitAppuntamento = async () => {
    const inizio = `${dayjs(formData.data).format(
      "YYYY-MM-DDTHH:mm"
    )}:00.000+01:00`;
    const fine =
      dayjs(inizio).add(1, "hour").format("YYYY-MM-DDTHH:mm:ss") + ".000+01:00";
    const ownerString = formData.owner.join(";");

    const datiDaInviare = {
      oggetto: formData.oggetto,
      luogo: formData.luogo,
      note: formData.note,
      destinatari: formData.destinatari,
      inizio: inizio,
      fine: fine,
      ownerIds: ownerString,
    };
    try {
      const responseInviaAppuntamento = await axios.post(
        "http://89.46.196.60:8443/calendar/insert",
        datiDaInviare,
        { headers: headers }
      );
      if (responseInviaAppuntamento.data === "OK") {
        onClose();
      }
      if (responseInviaAppuntamento.data === "ERRORE") {
        setAlert({
          open: true,
          message: "errore durante il salvataggio dell'appuntamento!",
        });
        console.error("L'azienda non è stata salvata.");
        return;
      }
    } catch (error) {
      console.error("Errore durante l'invio dell'appuntamento: ", error);
    }
  };

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
            fontWeight: "600",
          }}
        >
          Aggiungi Appuntamento
        </DialogTitle>
        <DialogContent sx={{ p: 12 }}>
          <Box>
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
                  color: theme.palette.border.main,
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
              inputProps={{
                maxLength: 120,
              }}
              onChange={handleChange("oggetto")}
              sx={{
                height: "4em",
                mb: 4,
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
                  color: theme.palette.border.main,
                },
              }}
            />

            <TextField
              id="luogo-box"
              label="Luogo"
              fullWidth
              variant="filled"
              name="luogo"
              value={formData.luogo}
              onChange={handleChange("luogo")}
              sx={{
                height: "4em",
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
                  color: theme.palette.border.main,
                },
              }}
            />

            <TextField
              id="data-box"
              label="Data e ora"
              type="datetime-local"
              name="data"
              value={formData.data}
              onChange={handleChange("data")}
              fullWidth
              variant="filled"
              sx={{
                height: "4em",
                mb: 2,
                p: 1,
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                  "&:after": {
                    borderBottomColor: theme.palette.border.main,
                  },
                },
                "& .MuiFilledInput-underline:before": {
                  borderBottomColor: theme.palette.border.main,
                },
                "& .MuiFilledInput-underline:hover:before": {
                  borderBottomColor: [theme.palette.border.main, "!important"],
                },
                "& .MuiFilledInput-underline:after": {
                  borderBottomColor: theme.palette.border.main,
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: theme.palette.border.main,
                },
              }}
            />

            <FormControl fullWidth>
              <Autocomplete
                id="owner-combo-box"
                options={ownerOptions}
                getOptionLabel={(option) => option.label}
                multiple
                value={
                  ownerOptions.filter((option) =>
                    (formData.owner ?? []).includes(option.value)
                  ) || []
                }
                onChange={(event, newValues) => {
                  const selectedValues = newValues.map(
                    (newValue) => newValue.value
                  );
                  handleChange("owner")({
                    target: { value: selectedValues || [] },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Owner"
                    variant="filled"
                    sx={{
                      height: "4em",
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
                        color: theme.palette.border.main,
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <TextField
              id="messaggio-box"
              label="Testo del messaggio"
              name="note"
              multiline
              rows={3}
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
                  color: theme.palette.border.main,
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleSubmitAppuntamento}
                variant="contained"
                sx={{
                  borderRadius: "5px",
                  backgroundColor: theme.palette.button.main,
                  color: theme.palette.textButton.main,
                  "&:hover": {
                    backgroundColor: theme.palette.button.main,
                    color: theme.palette.textButton.main,
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
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={TransitionDown}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default AppuntamentoModal;
