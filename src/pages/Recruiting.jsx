import React, { useEffect, useState } from "react";
import axios from "axios";
import PersonInfoButton from "../components/button/PersonInfoButton.jsx";
import DeleteButton from "../components/button/DeleteButton.jsx";
import ClipButton from "../components/button/ClipButton.jsx";
import { Link } from "react-router-dom";
import Tabella from "../components/Tabella.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SchemePage from "../components/SchemePage.jsx";
import NuovaRicercaRecruiting from "../components/nuoveRicerche/NuovaRicercaRecruiting.jsx";
import CFButton from "../components/button/CFButton.jsx";
import CFModal from "../components/modal/CFModal.jsx";
import InfoIcon from '@mui/icons-material/Info';

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
  CircularProgress,
  FormControl,
  Autocomplete,
  TextField,
  Tooltip
} from "@mui/material";
import EditButton from "../components/button/EditButton.jsx";
import { Typography } from "antd";


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
  const [cognomeCandidato, setCognomeCandidato] = useState([]);
  const [modalCambiaStato, setModalCambiaStato] = useState(false);
  const [anchorElStato, setAnchorElStato] = useState(null);
  const [snackbarType, setSnackbarType] = useState('success');
  const [alert, setAlert] = useState(false);
  const [values, setValues] = useState({});
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);






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
        location: null,
        skills: null
      };
  });


  //stati per la paginazione
  // const [pagina, setPagina] = useState(""); //da vedere meglio il fatto del ritornare alla pagina che si era lasciata
  const [pagina, setPagina] = useState(() => {
    const paginaSalvata = sessionStorage.getItem("paginaRecruiting");
    return paginaSalvata ? parseInt(paginaSalvata, 10) : 0;
  });


  const quantita = 10;

  //stato per il dialog
  const [openDialogNome, setOpenDialogNome] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Stato per snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [descrizioneModalOpen, setDescrizioneModalOpen] = useState(false);


  // Varianti di animazione per far apparire la tabella
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 }, // Parte dal basso
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Appare al centro
  };

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

  const fetchData = async (paginaCorrente = pagina) => {
    setLoading(true);

    const filtriDaInviare = {
      nome: null,
      cognome: null,
      email: null,
      tipologia: null,
      tipo: null,
      stato: null,
      skills: null,
      location: null,
      pagina: paginaCorrente,
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
      console.log("Dati ricevuti dal server:", response.data);

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





  // useEffect(() => {
  //   const filtriSalvati = sessionStorage.getItem("filtriRicercaRecruiting");
  //   if (filtriSalvati) {
  //     const filtriParsed = JSON.parse(filtriSalvati);
  //     setFiltri(filtriParsed);

  //     const isAnyFilterSet = Object.values(filtriParsed).some((value) => value);
  //     if (isAnyFilterSet) {
  //       handleRicerche();
  //     } else {
  //       fetchData();
  //     }
  //   } else {
  //     fetchData();
  //   }
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    if (hasFetched) return;

    const filtriSalvati = sessionStorage.getItem("filtriRicercaRecruiting");
    const paginaSalvata = sessionStorage.getItem("paginaRecruiting");
    const paginaDaUsare = paginaSalvata ? parseInt(paginaSalvata, 10) : 0;

    setPagina(paginaDaUsare);

    if (filtriSalvati) {
      const filtriParsed = JSON.parse(filtriSalvati);
      setFiltri(filtriParsed);

      if (Object.values(filtriParsed).some(value => value)) {
        handleRicerche(filtriParsed, paginaDaUsare);
      } else {
        fetchData(paginaDaUsare);
      }
    } else {
      fetchData(paginaDaUsare);
    }

    setHasFetched(true);
  }, [hasFetched]);


  //funzione per la paginazione
  const fetchMoreData = async (newPage, currentFilters) => {
    const filtriAttivi = Object.values(currentFilters).some(
      (value) => value !== null && value !== ""
    );

    const url = filtriAttivi
      ? "http://localhost:8080/staffing/react/filtri/ricerca"
      : "http://localhost:8080/staffing/react/mod";

    const filtriDaInviare = {
      nome: currentFilters.nome || null,
      cognome: currentFilters.cognome || null,
      email: null,
      tipologia: currentFilters.tipologia || null,
      tipo: currentFilters.tipo || null,
      stato: currentFilters.stato || null,
      skills: currentFilters.skills ? JSON.stringify(currentFilters.skills) : null,
      location: currentFilters.location || null,
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
          console.error("Il numero di record ottenuto non è un numero: ", record);
        }
      } else {
        console.error("I dati ottenuti non contengono 'candidati' come array: ", response.data);
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  };


  //funzione per il cambio pagina
  // const handlePageChange = (newPage) => {
  //   setPagina(newPage);
  //   fetchMoreData(newPage);
  // };

  const handlePageChange = (newPage) => {
    setPagina(newPage);
    sessionStorage.setItem("paginaRecruiting", newPage);

    if (Object.values(filtri).some(value => value)) {
      handleRicerche(filtri, newPage);
    } else {
      fetchData(newPage);
    }
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
      window.location.reload(true);
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };


  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const responseNeedSkills = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
        if (Array.isArray(responseNeedSkills.data)) {
          setSkillsOptions(responseNeedSkills.data.map((skill) => ({
            label: skill.descrizione,
            value: skill.id,
          })));
        } else {
          console.error("Response Need Skills non è un array:", responseNeedSkills.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle skill:", error);
      }
    };
    fetchSkills();
  }, []);


  useEffect(() => {
    sessionStorage.setItem("filtriRicercaRecruiting", JSON.stringify(filtri));
  }, [filtri]);

  // useEffect(() => {
  //   return () => {
  //     sessionStorage.removeItem("paginaRecruiting");
  //   };
  // }, []);

  const handleRicerche = async () => {
    const paginaSalvata = sessionStorage.getItem("paginaRecruiting");
    const paginaDaUsare = paginaSalvata ? parseInt(paginaSalvata, 10) : 0;

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
      skills: filtri.skills ? filtri.skills.join(",") : null,
      location: filtri.citta || null,
      pagina: paginaDaUsare,
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
        { headers: headers }
      );
      const responseTipo = await axios.get(
        "http://localhost:8080/staffing/react/tipo",
        { headers: headers }
      );
      const responseStato = await axios.get(
        "http://localhost:8080/staffing/react/stato/candidato",
        { headers: headers }
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
      sessionStorage.setItem("filtriRicercaRecruiting", JSON.stringify(newFilters));
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
      location: "",
      skills: null
    });

    sessionStorage.removeItem("filtriRicercaRecruiting");
    sessionStorage.removeItem("paginaRecruiting");
    setPagina(0);

    fetchData(0);
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
      else if (file == null && dataNascita == null) {
        message += t(' Il CV e la data di nascita non sono presenti.');
      }
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  }

  const getFilenameFromContentDisposition = (disposition) => {
    if (!disposition) return null;
    const m1 = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(disposition);
    if (m1 && m1[1]) return decodeURIComponent(m1[1]);
    const m2 = /filename\s*=\s*"?(.*?)"?($|;)/i.exec(disposition);
    if (m2 && m2[1]) return m2[1].replace(/"/g, '').trim();
    return null;
  };

  const extFromContentType = (ct) => {
    if (!ct) return '';
    const t = ct.split(';')[0].trim().toLowerCase();
    if (t.includes('pdf')) return 'pdf';
    if (t.includes('zip')) return 'zip';
    if (t.includes('json')) return 'json';
    if (t.includes('spreadsheet') || t.includes('excel')) return 'xlsx';
    if (t.includes('msword') || t.includes('wordprocessingml')) return 'docx';
    if (t.includes('presentation')) return 'pptx';
    if (t.includes('image/jpeg')) return 'jpg';
    if (t.includes('image/png')) return 'png';
    if (t.includes('image/gif')) return 'gif';
    return '';
  };

  const ensureExt = (name, ext) => {
    if (!ext) return name;
    return /\.[a-z0-9]{2,5}$/i.test(name) ? name : `${name}.${ext}`;
  };


  const handleDownloadCF = async (idCandidato, nomeCandidato, cognomeCandidato, tipo) => {
    try {
      setLoadingCF(true);
      const downloadUrl = `http://localhost:8080/files/download/cf/${idCandidato}`;
      const params = new URLSearchParams({ tipo });

      const res = await axios({
        method: 'GET',
        url: `${downloadUrl}?${params.toString()}`,
        responseType: 'blob',
        headers,
      });

      const contentDisposition = res.headers?.['content-disposition'] || res.headers?.['Content-Disposition'];
      const contentType = res.headers?.['content-type'] || res.headers?.['Content-Type'];

      let filename = `CF_${nomeCandidato || ''}_${cognomeCandidato || ''}`.replace(/\s+/g, '_').trim();
      const fromContentDisposition = getFilenameFromContentDisposition(contentDisposition);
      if (fromContentDisposition) filename = fromContentDisposition;
      if (!/\.[a-z0-9]{2,5}$/i.test(filename)) {
        const ext = extFromContentType(contentType) || 'bin';
        filename = ensureExt(filename || `documento_${idCandidato}`, ext);
      }

      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 0);

      setLoadingCF(false);
    } catch (error) {
      setLoadingCF(false);
      showSnackbar('Errore nel download del documento');
      console.error('Errore durante il download del CF:', error);
    }
  };

  const handleOpenStatoModal = (id, stato, event) => {
    if (event && typeof event.stopPropagation === "function") {
      event.stopPropagation();
    } else {
      console.warn("L'evento non è valido o non è stato passato correttamente.");
    }

    setModalCambiaStato(true);
    setIdCandidato(id);
    setValues((prevValues) => ({
      ...prevValues,
      stato,
    }));
  };




  const openStato = Boolean(anchorElStato);


  //funzioni per gestire lo snackbar
  const handleOpenSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };



  //funzione per il cambio stato
  const handleUpdateStato = async () => {
    const idStato = values.stato;
    const params = new URLSearchParams({ stato: idStato });
    try {
      const responseUpdateStato = await axios.post
        // (`http://localhost:8080/keypeople/react/salva/stato/${idKeypeople}?${params.toString()}`, {}, { headers: headers });
        (`http://localhost:8080/staffing/react/salva/stato/${idCandidato}?${params.toString()}`, {}, { headers: headers });
      setModalCambiaStato(false);
      fetchData();
      handleOpenSnackbar(t('Stato aggiornato con successo!'), 'success');
      if (responseUpdateStato.data === "ERRORE") {
        setAlert({ open: true, message: "errore durante il salvataggio dell'azienda!" });
        console.error("L'azienda non è stata salvata.");
        return;
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato: ", error);
      handleOpenSnackbar(t('Errore durante l aggiornamento dello stato.'), 'error');
    }
  };







  const columns = [

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
    // {
    //   field: "skills",
    //   headerName: t("Skills"),
    //   flex: 1,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    // },
    {
      field: "tipologia",
      headerName: t("Job Title"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.tipologia && params.row.tipologia.descrizione
            ? params.row.tipologia.descrizione
            : "N/A"}
        </div>
      ),
    },
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
      field: "citta",
      headerName: t("Location"),
      flex: 0.8,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: t("azioni"),
      headerName: "",
      flex: 1.2,
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
            style={{ textDecoration: "none" }}
          >
            <Tooltip title="Intervista">
              <span>
                <PersonInfoButton hasInterviste={!!params.row?.hasInterviste} />
              </span>
            </Tooltip>
          </Link>

          <Tooltip title="Download CV">
            <span>
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
            </span>
          </Tooltip>

          <Tooltip title="Crea CF">
            <span>
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
            </span>
          </Tooltip>

          <Tooltip title="Modifica stato">
            <span>
              <EditButton
                onClick={(event) => handleOpenStatoModal(params?.row?.id, params?.row?.stato, event)}
                rowData={params.row}
              />
            </span>
          </Tooltip>
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
        onSearch={() => handleRicerche(filtri, 0)}
        tipologiaOptions={tipologiaOptions}
        statoOptions={statoOptions}
        tipoOptions={tipoOptions}
        skillsOptions={skillsOptions}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
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
      </motion.div>
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
            borderRadius: "20px",
            width: "30vw",
            position: "relative",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {t("Conferma Eliminazione")}
        </DialogTitle>
        <DialogContent>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#8e8e8e",
              bgcolor: 'transparent',
              "&:hover": {
                color: "#db000e",
                bgcolor: 'transparent',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContentText id="alert-dialog-description">
            {t('Sei sicuro di voler eliminare questo candidato?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            sx={{
              width: '8em',
              borderRadius: '10px',
              backgroundColor: "#bfbfbf",
              color: "white",
              "&:hover": {
                backgroundColor: "#8e8e8e",
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
              backgroundColor: "#ea333f",
              color: "white",
              "&:hover": {
                backgroundColor: "#db000e",
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
        <Alert variant='filled' onClose={handleSnackbarClose} severity={snackbarType} sx={{ width: "100%" }}>
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
      { /* MODAL PER IL CAMBIO STATO */}
      <Dialog
        open={modalCambiaStato}
        onClose={() => setModalCambiaStato(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
          <Typography sx={{ fontWeight: '600', fontSize: '1.5em' }}>
            {t('Cambia Stato Del Contatto')}
          </Typography>
          <IconButton
            onClick={() => setModalCambiaStato(false)}
            sx={{
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'red',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, py: 2 }}>
          <FormControl fullWidth sx={{ width: '100%', mb: 3 }}>
            <Autocomplete
              id="stato-combo-box"
              options={statoOptions}
              getOptionLabel={(option) => option.label}
              value={statoOptions.find(option => option.value === values.stato) || null}
              onChange={(event, newValue) => {
                setValues(prevValues => ({
                  ...prevValues,
                  stato: newValue ? newValue.value : null,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Stato")}
                  variant="filled"
                  fullWidth
                  sx={{
                    height: '4em',
                    p: 1,
                    borderRadius: '20px',
                    backgroundColor: '#EDEDED',
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-underline:after': {
                      borderBottomColor: 'transparent',
                    },
                    '& .MuiFilledInput-root::before': {
                      borderBottom: 'none',
                    },
                    '&:hover .MuiFilledInput-root::before': {
                      borderBottom: 'none',
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#00B400',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleUpdateStato}
            sx={{
              width: '60%',
              backgroundColor: '#00B400',
              color: 'white',
              borderRadius: '10px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#019301',
                transform: 'scale(1.02)',
              },
            }}
          >
            {t("Cambia")}
          </Button>
        </DialogActions>
      </Dialog>

    </SchemePage>
  );
};

export default Recruiting;
