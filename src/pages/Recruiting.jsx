import React, { useEffect, useState }     from "react";
import axios                              from "axios";
import PersonInfoButton                   from "../components/button/PersonInfoButton.jsx";
import DeleteButton                       from "../components/button/DeleteButton.jsx";
import ClipButton                         from "../components/button/ClipButton.jsx";
import { Link }                           from "react-router-dom";
import CloseIcon                          from "@mui/icons-material/Close";
import { useTranslation }                 from "react-i18next";
import { motion }                         from "framer-motion";
import SchemePage                         from "../components/SchemePage.jsx";
import NuovaRicercaRecruiting             from "../components/nuoveRicerche/NuovaRicercaRecruiting.jsx";
import CFButton                           from "../components/button/CFButton.jsx";
import CFModal                            from "../components/modal/CFModal.jsx";
import EditButton                         from "../components/button/EditButton.jsx";
import { Typography }                     from "antd";
import TabellaCandidati                   from "../components/Tabelle/TabellaCandidati.jsx";
import DialogDelete                       from "../components/dialog/DialogDelete.jsx";
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
  Tooltip,
  Tabs,
  Tab
} from "@mui/material";



const Recruiting = () => {
  const { t } = useTranslation();

  const EMPTY_FILTRI = {
    nome: "",
    cognome: "",
    tipologia: null,
    stato: null,
    tipo: null,
    citta: "",
    skills: [],
    email: "",
  };

  const DEFAULT_POOL_VIEW = "ALL";


  const [allRecruiting,                 setAllRecruiting                ] = useState([]);  
  const [openDialog,                    setOpenDialog                   ] = useState(false);
  const [deleteId,                      setDeleteId                     ] = useState(null);
  const [tipologiaOptions,              setTipologiaOptions             ] = useState([]);
  const [tipologieById,                 setTipologieById                ] = useState({});
  const [tipoOptions,                   setTipoOptions                  ] = useState([]);
  const [statoOptions,                  setStatoOptions                 ] = useState([]);
  const [loading,                       setLoading                      ] = useState(false);
  const [loadingCF,                     setLoadingCF                    ] = useState(false);
  const [idCandidato,                   setIdCandidato                  ] = useState([]);
  const [nomeCandidato,                 setNomeCandidato                ] = useState([]);
  const [cognomeCandidato,              setCognomeCandidato             ] = useState([]);
  const [modalCambiaStato,              setModalCambiaStato             ] = useState(false);
  const [anchorElStato,                 setAnchorElStato                ] = useState(null);
  const [snackbarType,                  setSnackbarType                 ] = useState('success');
  const [alert,                         setAlert                        ] = useState(false);
  const [values,                        setValues                       ] = useState({});
  const [skillsOptions,                 setSkillsOptions                ] = useState([]);
  const [hasFetched,                    setHasFetched                   ] = useState(false);

  //stato per il dialog
  const [openDialogNome,                setOpenDialogNome               ] = useState(false);
  const [selectedRow,                   setSelectedRow                  ] = useState(null);

  // Stato per snackbar
  const [snackbarOpen,                  setSnackbarOpen                 ] = useState(false);
  const [snackbarMessage,               setSnackbarMessage              ] = useState("");
  const [descrizioneModalOpen,          setDescrizioneModalOpen         ] = useState(false);

  const [appliedFiltri,                 setAppliedFiltri                ] = useState(EMPTY_FILTRI);
  const [poolView,                      setPoolView                     ] = useState(() => {
    return sessionStorage.getItem("poolView") || DEFAULT_POOL_VIEW;
  });

  const [filtri,                        setFiltri                       ] = useState(() => {
    const saved = sessionStorage.getItem("filtriRicercaRecruiting");
    return saved
      ? JSON.parse(saved)
      : { ...EMPTY_FILTRI };
  });


  //stati per la paginazione
    const [pagina, setPagina] = useState(() => {
    const paginaSalvata = sessionStorage.getItem("paginaRecruiting");
    return paginaSalvata ? parseInt(paginaSalvata, 10) : 0;
  });

  // Varianti di animazione per far apparire la tabella
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 }, // Parte dal basso
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Appare al centro
  };


  useEffect(() => {
    setFiltri((f) => ({
      ...EMPTY_FILTRI,
      ...(f || {}),
      skills: Array.isArray(f?.skills) ? f.skills : [],
    }));
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const norm = (v) => (v ?? "").toString().trim().toLowerCase();

  const filteredRecruiting = React.useMemo(() => {
    const f = appliedFiltri || {};
    const nomeF = norm(f.nome);
    const cognomeF = norm(f.cognome);
    const emailF = norm(f.email);
    const cittaF = norm(f.citta);
    const skillsIds = Array.isArray(f?.skills) ? f.skills : [];


    const toId = (v) => {
      if (v == null || v === "") return null;
      if (typeof v === "object") return v.id ?? v.value ?? null;
      return Number(v);
    };

    const tipologiaId = toId(f.tipologia);
    const statoId     = toId(f.stato);
    const tipoId      = toId(f.tipo);


    return (allRecruiting ?? []).filter((c) => {
      if (nomeF && !norm(c.nome).includes(nomeF)) return false;
      if (cognomeF && !norm(c.cognome).includes(cognomeF)) return false;
      if (emailF && !norm(c.email).includes(emailF)) return false;
      if (cittaF && !norm(c.citta).includes(cittaF)) return false;

      if (tipologiaId && c?.tipologiaId !== tipologiaId) return false;
      if (statoId && c?.stato?.id !== statoId) return false;
      if (tipoId && c?.tipo?.id !== tipoId) return false;
      if (skillsIds.length) {
        const candidateSkills = (c?.skills ?? c?.skill ?? []).map(s => s?.id ?? s).filter(Boolean);
        const hasAll = skillsIds.every(id => candidateSkills.includes(id));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [allRecruiting, appliedFiltri]);  



  const recruitingByPoolView = React.useMemo(() => {
    const data = filteredRecruiting ?? [];

    if (poolView === "POOL") {
      return data.filter((c) => c.pool === 2 || c.pool === 3);
    }

    if (poolView === "HOTPOOL") {
      return data.filter((c) => c.pool === 3);
    }
    return data;
  }, [filteredRecruiting, poolView]);


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

  const handleSearch = () => {
  setAppliedFiltri(filtri);
  setPagina(0);
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

  useEffect(() => {
    const fetchSkills = async () => {

      const responseAree = await axios.get("http://localhost:8080/staffing/react/areas", { headers: headers });

      let groupedSkills = [];

      if (Array.isArray(responseAree.data)) {
        for (const area of responseAree.data) {
          groupedSkills.push({
            label: area.descrizione,
            value: `__header_${area.id}__`,
            isHeader: true,
          });

          try {
            const responseSkillByArea = await axios.get(
              `http://localhost:8080/staffing/react/skill/${area.id}`,
              { headers: headers }
            );

            if (Array.isArray(responseSkillByArea.data)) {
              const skills = responseSkillByArea.data.map(skill => ({
                label: skill.descrizione,
                value: skill.id,
              }));
              groupedSkills = [...groupedSkills, ...skills];
            }
          } catch (err) {
            console.error(`Errore durante il recupero delle skill per l'area ${area.descrizione}:`, err);
          }
        }

        setSkillsOptions(groupedSkills);
      }
    };
    fetchSkills();
  }, []);


  const fetchData = async (paginaCorrente = pagina) => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:8080/staffing/react/mod",
        { headers: headers }
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
        const map = responseTipologia.data.reduce((acc, tipologia) => {
          acc[String(tipologia.id)] = tipologia.descrizione;
          return acc;
        }, {});
        setTipologieById(map);

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


      const lista = response.data?.candidati ?? [];
      setAllRecruiting(lista);
      setLoading(false);
    } catch (error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  };

  useEffect(() => {
    if (hasFetched) return;

    const filtriSalvati = sessionStorage.getItem("filtriRicercaRecruiting");
    const paginaSalvata = sessionStorage.getItem("paginaRecruiting");
    const paginaDaUsare = paginaSalvata ? parseInt(paginaSalvata, 10) : 0;

    setPagina(paginaDaUsare);

    if (filtriSalvati) {
      const filtriParsed = JSON.parse(filtriSalvati);
      setFiltri(filtriParsed);
    } else {
      fetchData(paginaDaUsare);
    }

    setHasFetched(true);
  }, [hasFetched]);

  const handlePageChange = (newPage) => {
    setPagina(newPage);
    sessionStorage.setItem("paginaRecruiting", newPage);
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
    sessionStorage.setItem("filtriRicercaRecruiting", JSON.stringify(filtri));
  }, [filtri]);

  const handleFilterChange = (name) => (event) => {
    const newValue = event.target.value;

    setFiltri((currentFilters) => {
      const newFilters = { ...currentFilters, [name]: newValue };
      sessionStorage.setItem("filtriRicercaRecruiting", JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const resetState = () => {
  const empty = { ...EMPTY_FILTRI };
  setFiltri(empty);
  setAppliedFiltri(empty);
  setPagina(0);
};


const handleReset = () => {
  resetState();
  sessionStorage.removeItem("filtriRicercaRecruiting");
  sessionStorage.setItem("paginaRecruiting", "0");
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
      renderCell: (params) => {
        const isHotpool = params.row?.pool === 3;

        return (
          <div style={{ textAlign: "left" }}>
            <Link
              to={`/recruiting/modifica/${params.row.id}`}
              state={{ recruitingData: params.row }}
              style={{ color: isHotpool ? "#00B400" : "black" }}
            >
              {params.row.nome} {params.row.cognome}
            </Link>
          </div>
        );
      },
    },
    {
      field: "tipologiaId",
      headerName: t("Job Title"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {tipologieById[String(params.row.tipologiaId)] ?? "N/A"}
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
        onSearch={handleSearch}
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

            <TabellaCandidati
              data={recruitingByPoolView}
              columns={columns}
              title={t("Candidati")}
              getRowId={(row) => row.id}
              headerRight={
              <Tabs
                value={poolView}
                onChange={(e, v) => {
                  setPoolView(v);
                  sessionStorage.setItem("poolView", v);
                  setPagina(0);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 36,
                  "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontWeight: 700, color: '#6d6c6c' },
                  "& .MuiTab-root.Mui-selected": {
                    color: "#00B400",
                  },
                }}
              >
                <Tab value="ALL" label="Tutti" />
                <Tab value="POOL" label="Pool" />
                <Tab value="HOTPOOL" label="Hotpool" />
              </Tabs>
            }
              onPageChange={handlePageChange}
            />
          )}
        </Box>
      </motion.div>


                <DialogDelete
                    open={openDialog}
                    title={t("Sei sicuro di voler eliminare questo candidato?")}
                    description={t("Questa azione non potrà essere annullata.")}
                    onClick={() => setOpenDialog(false)}
                    onDelete={(event) => {
                        event?.stopPropagation?.();
                        handleDelete();
                    }}
                />


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
