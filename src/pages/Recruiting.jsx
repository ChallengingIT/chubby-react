import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PersonInfoButton from "../components/button/PersonInfoButton.jsx";
import DeleteButton from "../components/button/DeleteButton.jsx";
import ClipButton from "../components/button/ClipButton.jsx";
import { Link } from "react-router-dom";
import Tabella from "../components/Tabella.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next"; 


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Button,
  Grid,
  Skeleton,
  IconButton,
  Snackbar,
  Alert,
  Slide,
  CircularProgress
} from "@mui/material";
import SchemePage from "../components/SchemePage.jsx";
import NuovaRicercaRecruiting from "../components/nuoveRicerche/NuovaRicercaRecruiting.jsx";
import CFButton from "../components/button/CFButton.jsx";
import CFModal from "../components/modal/CFModal.jsx";

const Recruiting = () => {
  const { t } = useTranslation(); 


  const [originalRecruiting, setOriginalRecruiting] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [tipologiaOptions, setTipologiaOptions] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [statoOptions, setStatoOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCF, setLoadingCF] = useState(false);
  const [righeTot, setRigheTot] = useState(0);
  const [idCandidato, setIdCandidato] = useState([]);
  const [nomeCandidato, setNomeCandidato] = useState([]);
  const [cognomeCandidato, setCognomeCandidato ] = useState([]);
  const [filtri, setFiltri] = useState(() => {
    const filtriSalvati = sessionStorage.getItem("filtriRicercaRecruiting");
    return filtriSalvati
      ? JSON.parse(filtriSalvati)
      : {
          nome: null,
          cognome: null,
          tipologia: null,
          stato: null,
          tipo: null,
        };
  });


  //stati per la paginazione
  const [pagina, setPagina] = useState(0);
  const quantita = 10;

  //stato per il dialog
  const [openDialogNome, setOpenDialogNome] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Stato per snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [descrizioneModalOpen, setDescrizioneModalOpen] = useState(false);


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  


  const userHasRole = (role) => {
    const userString = sessionStorage.getItem("user");
    if (!userString) {
      return false;
    }
    const userObj = JSON.parse(userString);
    return userObj.roles.includes(role);
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    setLoading(true);

    const filtriDaInviare = {
      nome: null,
      cognome: null,
      email: null,
      tipologia: null,
      tipo: null,
      stato: null,
      pagina: 0,
      quantita: 10,
    };

    try {
      const response = await axios.get(
        "http://localhost:8080/staffing/react/mod",
        { headers: headers, params: filtriDaInviare }
      );
      const responseTipologia = await axios.get(
        "http://localhost:8080/aziende/react/tipologia",
        { headers }
      );
      const responseTipo = await axios.get(
        "http://localhost:8080/staffing/react/tipo",
        { headers }
      );
      const responseStato = await axios.get(
        "http://localhost:8080/staffing/react/stato/candidato",
        { headers }
      );

      if (Array.isArray(responseStato.data)) {
        setStatoOptions(
          responseStato.data.map((stato, index) => ({
            label: stato.descrizione,
            value: stato.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseStato.data
        );
      }

      if (Array.isArray(responseTipologia.data)) {
        setTipologiaOptions(
          responseTipologia.data.map((tipologia, index) => ({
            label: tipologia.descrizione,
            value: tipologia.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseTipologia.data
        );
      }

      if (Array.isArray(responseTipo.data)) {
        setTipoOptions(
          responseTipo.data.map((tipo, index) => ({
            label: tipo.descrizione,
            value: tipo.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseTipo.data
        );
      }
      const { record, candidati } = response.data;

      if (candidati && Array.isArray(candidati)) {
        setOriginalRecruiting(candidati);

        if (typeof record === "number") {
          setRigheTot(record);
        } else {
          console.error(
            "Il numero di record ottenuto non è un numero: ",
            record
          );
        }
      } else {
        console.error(
          "I dati ottenuti non contengono 'candidati' come array: ",
          response.data
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  };


  useEffect(() => {
    const filtriSalvati = sessionStorage.getItem("filtriRicercaRecruiting");
    if (filtriSalvati) {
      const filtriParsed = JSON.parse(filtriSalvati);
      setFiltri(filtriParsed);

      const isAnyFilterSet = Object.values(filtriParsed).some((value) => value);
      if (isAnyFilterSet) {
        handleRicerche();
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }
    // eslint-disable-next-line
  }, []);

  //funzione per la paginazione
  const fetchMoreData = async (newPage) => {
    const filtriAttivi = Object.values(filtri).some(
      (value) => value !== null && value !== ""
    );
    const url = filtriAttivi
      ? "http://localhost:8080/staffing/react/mod/ricerca"
      : "http://localhost:8080/staffing/react/mod";

    const filtriDaInviare = {
      nome: filtri.nome || null,
      cognome: filtri.cognome || null,
      email: null,
      tipologia: filtri.tipologia || null,
      tipo: filtri.tipo || null,
      stato: filtri.stato || null,
      pagina: newPage,
      quantita: 10,
    };

    try {
      const response = await axios.get(url, {
        headers: headers,
        params: filtriDaInviare,
      });
      const { record, candidati } = response.data;

      if (candidati && Array.isArray(candidati)) {
        setOriginalRecruiting(candidati);

        if (typeof record === "number") {
          setRigheTot(record);
        } else {
          console.error(
            "Il numero di record ottenuto non è un numero: ",
            record
          );
        }
      } else {
        console.error(
          "I dati ottenuti non contengono 'candidati' come array: ",
          response.data
        );
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  };

  //funzione per il cambio pagina
  const handlePageChange = (newPage) => {
    setPagina(newPage);
    fetchMoreData(newPage);
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };


  const handleDelete = async () => {
    try {
      const responseDelete = await axios.delete(
        `http://localhost:8080/staffing/elimina/${deleteId}`,
        { headers: headers }
      );
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };


  useEffect(() => {
    sessionStorage.setItem("filtriRicercaRecruiting", JSON.stringify(filtri));
  }, [filtri]);

  const handleRicerche = async () => {
    const isAnyFilterSet = Object.values(filtri).some((value) => value);
    if (!isAnyFilterSet) {
      return;
    }

    const filtriDaInviare = {
      nome: filtri.nome || null,
      cognome: filtri.cognome || null,
      email: null,
      tipologia: filtri.tipologia || null,
      tipo: filtri.tipo || null,
      stato: filtri.stato || null,
      pagina: pagina,
      quantita: 10,
    };

    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:8080/staffing/react/mod/ricerca",
        { headers: headers, params: filtriDaInviare }
      );
      const responseTipologia = await axios.get(
        "http://localhost:8080/aziende/react/tipologia",
        { headers }
      );
      const responseTipo = await axios.get(
        "http://localhost:8080/staffing/react/tipo",
        { headers }
      );
      const responseStato = await axios.get(
        "http://localhost:8080/staffing/react/stato/candidato",
        { headers }
      );

      if (Array.isArray(responseStato.data)) {
        setStatoOptions(
          responseStato.data.map((stato, index) => ({
            label: stato.descrizione,
            value: stato.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseStato.data
        );
      }

      if (Array.isArray(responseTipologia.data)) {
        setTipologiaOptions(
          responseTipologia.data.map((tipologia, index) => ({
            label: tipologia.descrizione,
            value: tipologia.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseTipologia.data
        );
      }

      if (Array.isArray(responseTipo.data)) {
        setTipoOptions(
          responseTipo.data.map((tipo, index) => ({
            label: tipo.descrizione,
            value: tipo.id,
          }))
        );
      } else {
        console.error(
          "I dati ottenuti non sono nel formato Array:",
          responseTipo.data
        );
      }

      const { record, candidati } = response.data;
      if (candidati && Array.isArray(candidati)) {
        setOriginalRecruiting(candidati);
        if (typeof record === "number") {
          setRigheTot(record);
        } else {
          console.error(
            "Il numero di record dei candidati in ricercha non è un numero: ",
            record
          );
        }
      } else {
        console.error(
          "I dati ottenuti per la ricerca non sono nel formato Array:",
          response.data
        );
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati filtrati:", error);
    } finally {
      setLoading(false);
    }
    // }
  };

  const handleFilterChange = (name) => (event) => {
    const newValue = event.target.value;
    setFiltri((currentFilters) => {
      const newFilters = { ...currentFilters, [name]: newValue };
      setPagina(0);
      return newFilters;
    });
  };

  const handleReset = () => {
    setFiltri({
      nome: "",
      cognome: "",
      tipo: null,
      tipologia: null,
      stato: null,
    });
    sessionStorage.removeItem("RicercheRecruiting");
    setPagina(0);

    fetchData();
  };

  const handleDownloadCV = async (idFile, fileDescrizione) => {
    const url = `http://localhost:8080/files/react/download/file/${idFile}`;
    try {
      const responseDownloadCV = await axios({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: headers,
      });
      const fileURL = window.URL.createObjectURL(
        new Blob([responseDownloadCV.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${fileDescrizione}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(
        "Si è verificato un errore durante il download del file: ",
        error
      );
    }
  };

  const handleCheckedCF = (idCandidato, nomeCandidato, cognomeCandidato, file, dataNascita) => {
    if (dataNascita != null && file != null) {
      setIdCandidato(idCandidato);
      setNomeCandidato(nomeCandidato);
      setCognomeCandidato(cognomeCandidato);
      setDescrizioneModalOpen(true);
    } else {
      let message = t(`Attenzione: non è possibile procedere alla creazione del CF per il candidato ${nomeCandidato} ${cognomeCandidato}.`);
      if (file == null) {
        message += t(` Il CV non è presente.`);
      }
      else if (dataNascita == null) {
        message += t(` La data di nascita non è presente.`);
      }
      else if ( file == null && dataNascita == null) {
        message += t(' Il CV e la data di nascita non sono presenti.');
      }
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  }

  const handleDownloadCF = async (idCandidato, nomeCandidato, cognomeCandidato, tipo) => {
      try {
        setLoadingCF(true);
        const downloadUrl = `http://localhost:8080/files/download/cf/${idCandidato}`;
        const params = new URLSearchParams({ tipo });
  
        const responseDownloadCF = await axios({
          method: "GET",
          url: `${downloadUrl}?${params.toString()}`,
          responseType: "blob",
          headers: headers,
        });
  
        const fileURL = window.URL.createObjectURL(
          new Blob([responseDownloadCF.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `CF_${nomeCandidato}_${cognomeCandidato}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoadingCF(false);
      } catch (error) {
        console.error(
          "Si è verificato un errore durante il download del CF: ",
          error
        );
      }
  };
  
  
  

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "nome",
      headerName: t("Nome"),
      flex: 1.3,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "left" }}>
          <Link
            to={`/recruiting/modifica/${params.row.id}`}
            state={{ recruitingData: params.row }}
            style={{ color: "black" }}
          >
            {params.row.nome} {params.row.cognome}
          </Link>
        </div>
      ),
    },
    //   {
    //     field: "nome",
    //     headerName: "Nome",
    //     flex: 1.3,
    //     renderCell: (params) => (
    //         <div style={{ textAlign: "left", cursor: "pointer", textDecoration: "underline" }}>
    //             <span onClick={() => handleClickOpen(params.row)}>
    //                 {params.row.nome} {params.row.cognome}
    //             </span>
    //         </div>
    //     ),
    // },

    //   { field: "email",          headerName: "Email",          flex: 1.5},
    //   { field: "tipologia",      headerName: "Job Title",      flex: 1.4, renderCell: (params) => (
    //     <div style={{ textAlign: "start" }}>
    //       {params.row.tipologia && params.row.tipologia.descrizione
    //         ? params.row.tipologia.descrizione
    //         : "N/A"}
    //     </div>
    //   ),
    // },
    {
      field: "rating",
      headerName: t("Rating"),
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
            {params.row.rating ? params.row.rating.toFixed(2) : ""}
        </div>
    ),
      // renderCell: (params) => getSmileIcon(params),
    }, //fino a 1.9 è rosso, da 2 a 3 giallo, sopra 3 è verde
    {
      field: "owner",
      headerName: t("Owner"),
      flex: 0.6,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.owner && params.row.owner.descrizione
            ? params.row.owner.descrizione
            : "N/A"}
        </div>
      ),
    },
    {
      field: "stato",
      headerName: t("Stato"),
      flex: 0.6,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    {
      field: "dataUltimoContatto",
      headerName: t("Contatto"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: t("azioni"),
      headerName: "",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box>
          {/* <NoteButton
            onClick={() => {
              setNotePopup(true);
              setSelectedNote(params.row.note);
            }}
          />

          <EuroButton
            onClick={() => {
              setRalPopup(true);
              setSelectedRal(params.row.ral);
            }}
          /> */}
          
          <Link
            to={`/recruiting/intervista/${params.row.id}`}
            state={{ recruitingData: params.row }}
          >
            <PersonInfoButton
              hasInterviste={!!params.row?.hasInterviste}
            />
          </Link>
          <ClipButton
            hasFile={!!params.row?.file}
            idFile={params.row.file ? params.row.file.id : null}
            fileDescrizione={
              params.row.file ? params.row.file.descrizione : null
            }
            onClick={() =>
              handleDownloadCV(
                params.row.file ? params.row.file.id : null,
                params.row.file ? params.row.file.descrizione : null
              )
            }
            showSnackbar={showSnackbar}
          />
          <CFButton
            idCandidato={params.row?.id ? params.row?.id : null}
            onClick={() =>
              handleCheckedCF(
                params.row?.id ? params.row?.id : null,
                params.row?.nome ? params.row?.nome : null,
                params.row?.cognome ? params.row?.cognome : null,
                params.row?.file ? params.row?.file : null,
                params.row?.dataNascita ? params.row?.dataNascita : null
              )
            }
            hasFile={!!params.row?.file && !!params.row?.dataNascita}
          />
          {userHasRole("ADMIN") && (
            <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
          )}
        </Box>
      ),
    },
  ];

  function TransitionLeft(props) {
    return <Slide {...props} direction="up" />;
}

  return (
    <SchemePage>
      <NuovaRicercaRecruiting
        filtri={filtri}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={handleRicerche}
        tipologiaOptions={tipologiaOptions}
        statoOptions={statoOptions}
        tipoOptions={tipoOptions}
      />
      <Box sx={{ mr: 0.2 }}>
        {loading ? (
          <>
            {Array.from(new Array(1)).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ marginRight: 2, marginBottom: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={118} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Grid>
            ))}
          </>
        ) : (
          
          <Tabella
            data={originalRecruiting}
            columns={columns}
            title={t("Candidati")}
            getRowId={(row) => row.id}
            pagina={pagina}
            quantita={quantita}
            righeTot={righeTot}
            onPageChange={handlePageChange}
          />
        )}
      </Box>
      {/* {notePopup && (
        <Dialog
            open={notePopup}
            onClose={handleCloseNotesModal}
            sx={{ "& .MuiDialog-paper": { width: "400px", height: "auto", borderRadius: '20px' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <DialogTitle sx={{ m: 0, p: 0 }}>Note</DialogTitle>
              <IconButton onClick={handleCloseNotesModal} sx={{ bgcolor: 'transparent', ml: 2, '&:hover': { bgcolor: 'transparent'} }}>
                <CloseIcon sx={{ '&:hover': { color: 'red'}}} />
              </IconButton>
            </Box>
            <DialogContent>
              <DialogContentText sx={{ pb: 2}}>{selectedNote}</DialogContentText>
            </DialogContent>
          </Dialog>

      )}

      {ralPopup && (
        <Dialog
          open={ralPopup}
          onClose={() => setRalPopup(false)}
          sx={{ "& .MuiDialog-paper": { width: "400px", height: "auto", borderRadius: '20px' } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <DialogTitle sx={{ m: 0, p: 0 }}>Ral</DialogTitle>
              <IconButton onClick={handleCloseRalModal} sx={{ bgcolor: 'transparent', ml: 2, '&:hover': { bgcolor: 'transparent'} }}>
                <CloseIcon sx={{ '&:hover': { color: 'red'}}} />
              </IconButton>
            </Box>
          <DialogContent>
            <DialogContentText sx={{ pb: 2}}>{selectedRal}</DialogContentText>
          </DialogContent>
        </Dialog>
      )} */}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {t("Conferma Eliminazione")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('Sei sicuro di voler eliminare questo candidato?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb:2}}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            sx={{
              width: '8em',
              borderRadius: '10px',
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            {t('Annulla')}
            </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            type="submit"
            sx={{
              width: '8em',
              borderRadius: '10px',
              backgroundColor: "#00B401",
              color: "white",
              "&:hover": {
                backgroundColor: "#019301",
                color: "white",
                transform: "scale(1.05)",
              },
            }}
          >
            {t('Conferma')}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openDialogNome}
        onClose={() => setOpenDialogNome(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "50%",
            maxWidth: "none",
            borderRadius: "20px",
            border: "2px solid #00B400",
            p: 1,
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          <span style={{ fontSize: "180%", fontWeight: "bolder" }}>
            {"Dettagli del Candidato"}
          </span>
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialogNome(false)}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Nome:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.nome}</span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Cognome:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.cognome}</span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Email:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.email}</span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Job Title:{" "}
                </span>
                <span style={{ color: "black" }}>
                  {selectedRow.tipologia?.descrizione}
                </span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Rating:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.rating}</span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Owner:{" "}
                </span>
                <span style={{ color: "black" }}>
                  {selectedRow.owner?.descrizione}
                </span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Stato:{" "}
                </span>
                <span style={{ color: "black" }}>
                  {selectedRow.stato?.descrizione}
                </span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Ultimo Contatto:{" "}
                </span>
                <span style={{ color: "black" }}>
                  {selectedRow.dataUltimoContatto}
                </span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  Note:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.note}</span>
              </DialogContentText>
              <DialogContentText>
                <span style={{ fontWeight: "bold", color: "black" }}>
                  RAL:{" "}
                </span>
                <span style={{ color: "black" }}>{selectedRow.ral}</span>
              </DialogContentText>
              {selectedRow.allegati &&
                selectedRow.allegati.map((file, index) => (
                  <DialogContentText key={index}>
                    <span style={{ fontWeight: "bold", color: "black" }}>
                      {file.descrizione}:{" "}
                    </span>
                    <Button
                      onClick={() =>
                        handleDownloadCV(file.id, file.descrizione)
                      }
                    >
                      Scarica
                    </Button>
                  </DialogContentText>
                ))}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={TransitionLeft}
      >
        <Alert variant='filled' onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {loadingCF ? (
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
          >
          <CircularProgress size={80} />
        </Box>
      ) : (
        <>
          <CFModal
            open={descrizioneModalOpen}
            handleClose={() => setDescrizioneModalOpen(false)}
            idCandidato={idCandidato}
            handleDownloadCF={handleDownloadCF}
            nomeCandidato={nomeCandidato}
            cognomeCandidato={cognomeCandidato}
          />
        </>
      )}
    </SchemePage>
  );
};

export default Recruiting;
