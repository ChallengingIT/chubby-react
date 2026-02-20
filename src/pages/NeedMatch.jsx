import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Tabs, Tab } from "@mui/material";
import { useLocation } from "react-router-dom";
import Tabella from "../components/Tabella.jsx";
import ModalBox from "../components/ModalBox.jsx";
import CloseIconButton from "../components/button/CloseIconButton.jsx";
import IntervistaButton from "../components/button/IntervistaButton.jsx";
import ClipButton from "../components/button/ClipButton.jsx";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SchemePage from "../components/SchemePage.jsx";
import NuovaRicercaNeedMatch from "../components/nuoveRicerche/NuovaRicercaNeedMatch.jsx";
import CheckListButton from "../components/button/CheckListButton.jsx";
import { useTranslation } from "react-i18next";
import IntervisteModalButton from "../components/button/IntervisteModalButton.jsx";
import IntervisteModal from "../components/modal/IntervisteModal.jsx";
import { motion } from "framer-motion";
import TabellaCandidati from "../components/Tabelle/TabellaCandidati.jsx";
import BASE_URL from '../api/apiConfig';


const NeedMatch = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const location = useLocation();
    const valori = location.state;
    const descrizione = valori.descrizione;
    const nomeAzienda = valori.cliente?.denominazione;

    const [originalCandidati, setOriginalCandidati] = useState([]);
    const [originalStorico, setOriginalStorico] = useState([]);
    const [originalAssociati, setOriginalAssociati] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialValuesAggiorna, setInitialValuesAggiorna] = useState([]);
    const [openModalIntervista, setOpenModalIntervista] = useState(false);
    const [selectedIntervista, setSelectedIntervista] = useState(null);



    //stati per il dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);



    const handleCloseDialog = () => {
        setSelectedRow(null);
        setOpenDialog(false);
    };




    //stati per le ricerche
    const [tipoOptions, setTipoOptions] = useState([]);
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaNeedMatch");
        return filtriSalvati
            ? JSON.parse(filtriSalvati)
            : {
                nome: null,
                cognome: null,
                tipologia: null,
                tipo: null,
                seniority: null,
            };
    });
    const seniority = [
        { label: "Neo", value: "0", min: 0, max: 1 },
        { label: "Junior", value: "1", min: 1, max: 2 },
        { label: "Middle", value: "2", min: 2, max: 3 },
        { label: "Senior", value: "3", min: 3 },
    ];

    //stati per la paginazione
    const [paginaCandidati, setPaginaCandidati] = useState(0);
    const [righeTotCandidati, setRigheTotCandidati] = useState(0);

    const [paginaStorico, setPaginaStorico] = useState(0);
    const [righeTotStorico, setRigheTotStorico] = useState(0);

    const [paginaAssociati, setPaginaAssociati] = useState(0);
    const [righeTotAssociati, setRigheTotAssociati] = useState(0);

    const DEFAULT_POOL_VIEW = "ALL";

    const [poolView, setPoolView] = useState(() => {
      return sessionStorage.getItem("poolViewNeedMatch") || DEFAULT_POOL_VIEW;
    });

    const poolToParam = (view) => {
      if (view === "POOL") return 1;
      if (view === "HOTPOOL") return 2;
      return null;
    };

    const hasActiveFilters = (f) =>
      Object.values(f).some(
        (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
      );

    const quantita = 10;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    //controllo del ruolo dell'utente loggato
    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };
    
    const navigateToCercaCandidato = (params) => {
        navigate("/recruiting", { state: { params } });
    };

    // Varianti di animazione per far apparire la tabella
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 }, // Parte dal basso
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Appare al centro
    };



    const fetchData = async () => {
        const filtriCandidati = {
            nome: filtri.nome || null,
            cognome: filtri.cognome || null,
            tipologia: filtri.tipologia || null,
            tipo: filtri.tipo || null,
            seniority: filtri.seniority || null,
            pool: poolToParam(poolView),
            pagina: 0,
            quantita: 10,
        };


        const paginazione = {
            pagina: 0,
            quantita: 10,
        };
        try {
            const candidatiResponse = await axios.get(
                `${BASE_URL}need/react/match/associabili/mod/${id}`,
                { headers: headers, params: filtriCandidati }
            );
            const storicoResponse = await axios.get(
                `${BASE_URL}need/react/storico/${id}`,
                { headers: headers, params: paginazione }
            );
            const associatiResponse = await axios.get(
                `${BASE_URL}need/react/match/associati/mod/${id}`,
                { headers: headers, params: paginazione }
            );
            const responseTipologia = await axios.get(
                `${BASE_URL}aziende/react/tipologia`,
                { headers: headers }
            );
            const responseTipo = await axios.get(
                `${BASE_URL}staffing/react/tipo`,
                { headers: headers }
            );
            /* const ownerResponse = await axios.get(
                `${BASE_URL}owner`,
                { headers: headers }
            ); */
            const statoResponse = await axios.get(
                `${BASE_URL}associazioni/react/stati`,
                { headers: headers }
            );

            const userString = sessionStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            const username = user?.username;

            const ownerUrl = userHasRole('ADMIN')
                    ? `${BASE_URL}owner`
                    : `${BASE_URL}owner/${username}`;

            const ownerResponse = await axios.get(ownerUrl, { headers });

            if (Array.isArray(ownerResponse.data)) {
                const ownerOptions = ownerResponse.data.map(owner => ({
                    label: owner.descrizione,
                    value: owner.id,
                }));
                setOwnerOptions(ownerOptions);
            } else {
                console.error("Errore nella lettura degli owner");
            }

            if (Array.isArray(statoResponse.data)) {
                const statoOptions = statoResponse.data.map((stato) => ({
                    label: stato.descrizione,
                    value: stato.id,
                }));
                setStatoOptions(statoOptions);
            } else {
                console.error("Errore nella lettura degli stati");
            }

            if (Array.isArray(responseTipologia.data)) {
                const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
                    label: tipologia.descrizione,
                    value: tipologia.id,
                }));
                setTipologiaOptions(tipologiaOptions);
            } else {
                console.error("Errore nella lettura delle tipologie");
            }

            if (Array.isArray(responseTipo.data)) {
                const tipoOptions = responseTipo.data.map((tipo) => ({
                    label: tipo.descrizione,
                    value: tipo.id,
                }));
                setTipoOptions(tipoOptions);
            } else {
                console.error("Errore nella lettura dei tipi");
            }

            const { data: candidatiData } = candidatiResponse;
            const { data: storicoData } = storicoResponse;
            const { data: associatiData } = associatiResponse;

            const recordCandidati = candidatiData.record;
            const candidati = candidatiData.candidati;

            const recordStorico = storicoData.record;
            const associazioni = storicoData.associazioni;

            const recordAssociati = associatiData.record;
            const associati = associatiData.candidati;

            setRigheTotCandidati(recordCandidati);
            setOriginalCandidati(candidati);

            if (!setOriginalCandidati) {
                console.log("errore nel recupero dei candidati");
            }

            setRigheTotStorico(recordStorico);
            setOriginalStorico(associazioni);

            setRigheTotAssociati(recordAssociati);
            setOriginalAssociati(associati);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };



    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaNeedMatch");
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

      const fetchMoreDataCandidati = async (page, view = poolView, filters = filtri) => {
        const filtriAttivi = hasActiveFilters(filters);
        const poolAttivo = view !== "ALL";

        const url =
          filtriAttivi || poolAttivo
            ? `${BASE_URL}need/react/match/associabili/ricerca/mod/${id}`
            : `${BASE_URL}need/react/match/associabili/mod/${id}`;

        const filtriCandidati = {
            nome: filtri.nome || null,
            cognome: filtri.cognome || null,
            tipologia: filtri.tipologia || null,
            tipo: filtri.tipo || null,
            seniority: filtri.seniority || null,
            pool: poolToParam(view),
            pagina: paginaCandidati,
            quantita: 10,
        };

        try {
            const candidatiResponse = await axios.get(url, {
                headers: headers,
                params: filtriCandidati,
            });
            const { data: candidatiData } = candidatiResponse;
            const recordCandidati = candidatiData.record;
            const candidati = candidatiData.candidati;

            setRigheTotCandidati(recordCandidati);
            setOriginalCandidati(candidati);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    const fetchMoreDataStorico = async (paginaStorico) => {
        const paginazione = {
            pagina: paginaStorico,
            quantita: 10,
        };

        try {
            const storicoResponse = await axios.get(
                `${BASE_URL}need/react/storico/${id}`,
                { headers: headers, params: paginazione }
            );
            // const { recordStorico, storico } = storicoResponse.data;

            // if (storico && Array.isArray(storico)) {
            //     setOriginalStorico(storico);
            //     if (typeof storicoResponse === "number") {
            //     setRigheTotAssociati(recordStorico);
            //     } else {
            //     console.error(
            //         "Il numero di record di storico ottenuto non è un numero: ",
            //         recordStorico
            //     );
            //     }
            // } else {
            //     console.error(
            //     "I dati ottenuti di storico non sono nel formato Array:",
            //     storicoResponse.data
            //     );
            // }
            // } catch (error) {
            // console.error("Errore durante il recupero dei dati: ", error);
            // }
            const { data: storicoData } = storicoResponse;
            const recordStorico = storicoData.record;
            const storico = storicoData.associazioni;

            setRigheTotStorico(recordStorico);
            setOriginalStorico(storico);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    const fetchMoreDataAssociati = async (paginaAssociati) => {
        const paginazione = {
            pagina: paginaAssociati,
            quantita: 10,
        };
        try {
            const associatiResponse = await axios.get(
                `${BASE_URL}need/react/match/associati/mod/${id}`,
                { headers: headers, params: paginazione }
            );
            // const { recordAssociati, associati } = associatiResponse.data;

            // if (associati && Array.isArray(associati)) {
            //     setOriginalAssociati(associati);
            //     if (typeof recordAssociati === "number") {
            //     setRigheTotAssociati(recordAssociati);
            //     } else {
            //     console.error(
            //         "Il numero di record ottenuto non è un numero: ",
            //         recordAssociati
            //     );
            //     }
            // } else {
            //     console.error(
            //     "I dati ottenuti non sono nel formato Array:",
            //     associatiResponse.data
            //     );
            // }
            // } catch (error) {
            // console.error("Errore durante il recupero dei dati: ", error);
            // }
            const { data: associatiData } = associatiResponse;
            const recordAssociati = associatiData.record;
            const associati = associatiData.candidati;

            setRigheTotAssociati(recordAssociati);
            setOriginalAssociati(associati);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }

    };

    //funzione per il cambio pagina

    const handlePageChangeCandidati = async (newPage) => {
      setPaginaCandidati(newPage);
      await fetchMoreDataCandidati(newPage, poolView, filtri);
    };


    const handlePageChangeStorico = (newPageStorico) => {
        setPaginaStorico(newPageStorico);
        fetchMoreDataStorico(newPageStorico);
    };

    const handlePageChangeAssociati = (newPageAssociati) => {
        setPaginaAssociati(newPageAssociati);
        fetchMoreDataAssociati(newPageAssociati);
    };

    // //funzione per il cambio stato dei select
    // const handleFilterChange = (name) => (event) => {
    //     const newValue = event.target.value;

    //     if (name === "seniority") {
    //     const selectedOption = seniority.find(
    //         (option) => option.value === newValue
    //     );

    //     const min = selectedOption.min ?? parseInt(newValue);
    //     const max = selectedOption.max ?? Infinity;

    //     setFiltri({ ...filtri, [name]: newValue, minimo: min, massimo: max });
    //     } else {
    //     setFiltri({ ...filtri, [name]: newValue });
    //     }

    //     // Esegui la ricerca
    //     handleRicerche();
    // };

    useEffect(() => {
        sessionStorage.setItem("filtriRicercaNeedMatch", JSON.stringify(filtri));
    }, [filtri]);

    //funzione per le ricerche
    const handleRicerche = async (minimo, massimo) => {
        const isAnyFilterSet = Object.values(filtri).some((value) => value);
        if (!isAnyFilterSet) {
            return;
        }

        const paginazione = {
            pagina: 0,
            quantita: 10,
        };
        const filtriCandidati = {
            nome: filtri.nome || null,
            cognome: filtri.cognome || null,
            tipologia: filtri.tipologia || null,
            tipo: filtri.tipo || null,
            minimo: filtri.minimo || null,
            massimo: filtri.massimo || null,
            pool: poolToParam(poolView),
            pagina: 0,
            quantita: 10,
        };

        try {
            const candidatiResponse = await axios.get(
                `${BASE_URL}need/react/match/associabili/ricerca/mod/${id}`,
                { headers: headers, params: filtriCandidati }
            );
            const storicoResponse = await axios.get(
                `${BASE_URL}need/react/storico/${id}`,
                { headers: headers, params: paginazione }
            );
            const associatiResponse = await axios.get(
                `${BASE_URL}need/react/match/associati/mod/${id}`,
                { headers: headers, params: paginazione }
            );
            const responseTipologia = await axios.get(
                `${BASE_URL}aziende/react/tipologia`,
                { headers: headers }
            );
            const responseTipo = await axios.get(
                `${BASE_URL}staffing/react/tipo`,
                { headers: headers }
            );
            /* const ownerResponse = await axios.get(
                `${BASE_URL}owner`,
                { headers: headers }
            ); */
            const statoResponse = await axios.get(
                `${BASE_URL}associazioni/react/stati`,
                { headers: headers }
            );

            const userString = sessionStorage.getItem("user");
                const user = userString ? JSON.parse(userString) : null;
                const username = user?.username;

                const ownerResponse = await axios.get(
                `${BASE_URL}owner/${username}`,
                { headers: headers }
                );

                if (Array.isArray(ownerResponse.data)) {
                const ownerOptions = ownerResponse.data.map(owner => ({
                    label: owner.descrizione,
                    value: owner.id,
                }));
                setOwnerOptions(ownerOptions);
                }


            if (Array.isArray(statoResponse.data)) {
                const statoOptions = statoResponse.data.map((stato) => ({
                    label: stato.descrizione,
                    value: stato.id,
                }));
                setStatoOptions(statoOptions);
            }

            if (Array.isArray(responseTipologia.data)) {
                const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
                    label: tipologia.descrizione,
                    value: tipologia.id,
                }));
                setTipologiaOptions(tipologiaOptions);
            }

            if (Array.isArray(responseTipo.data)) {
                const tipoOptions = responseTipo.data.map((tipo) => ({
                    label: tipo.descrizione,
                    value: tipo.id,
                }));
                setTipoOptions(tipoOptions);
            }

            const { data: candidatiData } = candidatiResponse;
            const { data: storicoData } = storicoResponse;
            const { data: associatiData } = associatiResponse;

            const recordCandidati = candidatiData.record;
            const candidati = candidatiData.candidati;

            const recordStorico = storicoData.record;
            const associazioni = storicoData.associazioni;

            const recordAssociati = associatiData.record;
            const associati = associatiData.candidati;

            setRigheTotCandidati(recordCandidati);
            setOriginalCandidati(candidati);

            setRigheTotStorico(recordStorico);
            setOriginalStorico(associazioni);

            setRigheTotAssociati(recordAssociati);
            setOriginalAssociati(associati);
        } catch (error) {
            console.error("Errore durante il recupero dei dati filtrati: ", error);
        }
    };

    // useEffect(() => {
    //     const { nome, cognome, ...otherFilters } = filtri;
    //     const filtriHasValues = Object.values(otherFilters).some(
    //     (x) => x !== "" && x != null
    //     );

    //     if (filtriHasValues) {
    //     handleRicerche();
    //     }
    // }, [filtri.tipo, filtri.tipologia, filtri.seniority]);

    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri(currentFilters => {
            const newFilters = { ...currentFilters, [name]: newValue };
            setPaginaCandidati(0);
            return newFilters;
        });
    };

    const handleReset = async () => {
      const empty = {
        nome: "",
        cognome: "",
        tipo: null,
        tipologia: null,
        seniority: null,
        minimo: null,
        massimo: null,
      };

      setFiltri(empty);
      setPaginaCandidati(0);
      setOriginalCandidati([]);
      await fetchMoreDataCandidati(0, poolView, empty);
    };


    const handleGoBack = () => {
        window.history.back();
    };

    const handleDeleteAssociati = async (row) => {
        try {
            const idNeed = parseInt(id);
            const idCandidato = row;
            const url = `${BASE_URL}associazioni/react/rimuovi/candidato/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
            const responseDeleteAssociati = await axios.delete(url, {
                headers,
            });
            fetchData();
        } catch (error) {
            console.error("Errore durante l'eliminazione: ", error);
        }
    };

    const handleDeleteStorico = async (row) => {
        try {
            const idAssociazione = row;
            const url = `${BASE_URL}associazioni/react/rimuovi/associa/${idAssociazione}`;
            const responseDeleteStorico = await axios.delete(url, {
                headers,
            });
            fetchData();
        } catch (error) {
            console.error("Errore durante l'eliminazioneì: ", error);
        }
    };

    const handleAssocia = async (row) => {
        try {
            const idNeed = parseInt(id);
            const idCandidato = row.id;
            const url = `${BASE_URL}associazioni/react/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
            const responseAssocia = await axios.post(url, null, { headers });
            fetchData();
        } catch (error) {
            console.error("Errore durante il recuper dei dati: ", error);
        }
    };

    // const handleOpenModal = (selectedRow) => {
    //     const initialValuesWithDefaults = {
    //     cliente: nomeAzienda || "",
    //     idNeed: descrizione || "",
    //     candidato: `${selectedRow.nome || ""} ${
    //         selectedRow.cognome || ""
    //     }`.trim(),
    //     idCandidato: selectedRow.id || "",
    //     };
    //     fieldsAggiorna.forEach((field) => {
    //     if (field.type === "select" && !initialValuesWithDefaults[field.name]) {
    //         initialValuesWithDefaults[field.name] = field.options?.[0]?.value || "";
    //     }
    //     });

    //     setInitialValuesAggiorna(initialValuesWithDefaults);
    //     setIsModalOpen(true);
    // };


    const handleOpenModal = (selectedRow) => {
        const initialValuesWithDefaults = {
            cliente: nomeAzienda || "",
            idNeed: descrizione || "",
            candidato: `${selectedRow.nome || ""} ${selectedRow.cognome || ""}`.trim(),
            idCandidato: selectedRow.id || "",
            stato: null,
            idOwner: null
        };

        setInitialValuesAggiorna(initialValuesWithDefaults);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveModal = async (selectedRow) => {
        try {
            const idNeedNum = parseInt(id);
            const idCandidatoNum = parseInt(selectedRow.idCandidato);

            const updateValues = {
                ...selectedRow,
                idNeed: idNeedNum,
                idCandidato: idCandidatoNum,
            };

            delete updateValues.candidato;
            delete updateValues.cliente;

            const response = await axios.post(
                `${BASE_URL}associazioni/salva`,
                updateValues,
                { headers: headers }
            );
            fetchData();
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
        handleCloseModal();
    };


    const handleDownloadCV = async (idFile, fileDescrizione) => {
        const url = `${BASE_URL}files/react/download/file/${idFile}`;
        try {
            const responseDownloadCV = await axios({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: headers
            });
            const fileURL = window.URL.createObjectURL(new Blob([responseDownloadCV.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `${fileDescrizione}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Si è verificato un errore durante il download del file: ", error);
        }
    };

    const handleModalIntervista = async (idCandidato) => {
        try {
            const responseIntervista = await axios.get(`${BASE_URL}intervista/ultima/${idCandidato}`, {
                headers: headers
            });
            setSelectedIntervista(responseIntervista.data);
            setOpenModalIntervista(true);
        } catch (error) {
            console.error("Errore durante il recupero dell'intervista: ", error);
        }
    };


    const fieldsAggiorna = [
        { label: t("Cliente"), name: "cliente", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
        { label: t("Need"), name: "idNeed", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
        { label: t("Candidato"), name: "candidato", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
        {
            label: t("Stato"),
            name: "stato",
            type: "select", sortable: false, filterable: false, disableColumnMenu: true,
            options: statoOptions || [],
        },
        { label: t("Data Aggiornamento"), name: "dataModifica", type: "date", sortable: false, filterable: false, disableColumnMenu: true },
        {
            label: t("Owner"),
            name: "idOwner",
            type: "select", sortable: false, filterable: false, disableColumnMenu: true,
            options: ownerOptions || [],
        },
    ];

    const disableFields = {
        cliente: true,
        idNeed: true,
        candidato: true,
    };

    const tabellaCandidati = [
        {
            field: "nome",
            headerName: t("Nome"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const isHotpool = params.row?.pool === 2;

                return (
                <div style={{ textAlign: "left" }}>
                    <div
                    onClick={() => navigateToCercaCandidato(params.row)}
                    style={{
                        cursor: "pointer",
                        color: isHotpool ? "#00B400" : "black",
                    }}
                    >
                    {params.row.nome} {params.row.cognome}
                    </div>
                </div>
                );
            },
            },
        {
            field: "tipologia",
            headerName: t("Job Title"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.tipologia && params.row.tipologia.descrizione
                        ? params.row.tipologia.descrizione
                        : "N/A"}
                </div>
            ),
        },
        { field: "email", headerName: "E-Mail", flex: 1.4, sortable: false, filterable: false, disableColumnMenu: true },

        {
            field: "rating", headerName: t("Rating"), flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.rating ? params.row.rating.toFixed(2) : ""}
                </div>
            ),
        },
        {
            field: "stato",
            headerName: t("Stato"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.stato && params.row.stato.descrizione
                        ? params.row.stato.descrizione
                        : "N/A"}
                </div>
            ),
        },
        { field: "dataUltimoContatto", headerName: t("Contatto"), flex: 1, sortable: false, filterable: false, disableColumnMenu: true },
        {
            field: "azioni",
            headerName: "",
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div>
                    <Tooltip title="Visualizza intervista">
                        <span>
                            <IntervisteModalButton
                                hasIntervista={!!params.row?.hasInterviste}
                                onClick={() => handleModalIntervista(params.row?.id)}
                            />
                        </span>
                    </Tooltip>

                    <Tooltip title="Visualizza CV">
                        <span>
                            <ClipButton
                                hasFile={!!params.row?.file}
                                idFile={params.row.file ? params.row.file.id : null}
                                fileDescrizione={params.row.file ? params.row.file.descrizione : null}
                                onClick={() => handleDownloadCV(
                                    params.row.file ? params.row.file.id : null,
                                    params.row.file ? params.row.file.descrizione : null
                                )}
                            />
                        </span>
                    </Tooltip>

                    <Tooltip title="Associa">
                        <IconButton onClick={() => handleAssocia(params.row)}>
                            <AddCircleIcon sx={{ color: '#00B400' }} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const tabellaStorico = [
        { field: "dataModifica", headerName: t("Data"), flex: 1, sortable: false, filterable: false, disableColumnMenu: true },
        {
            field: "candidato",
            headerName: t("Nome"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "left" }}>
                    <div onClick={() => navigateToCercaCandidato(params.row)}>
                        {params.row.candidato
                            ? `${params.row.candidato.nome} ${params.row.candidato.cognome}`
                            : ""}
                    </div>
                </div>
            ),
        },
        {
            field: "tipologia",
            headerName: t("Job Title"),
            flex: 1.5, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.candidato && params.row.candidato.tipologia.descrizione}
                </div>
            ),
        },
        {
            field: "rating",
            headerName: t("Rating"),
            flex: 0.7, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row?.candidato && params.row?.candidato?.rating}
                </div>
            ),
        },

        {
            field: "stato",
            headerName: t("Stato"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.stato && params.row.stato.descrizione}
                </div>
            ),
        },
        {
            field: "tipo",
            headerName: t("Tipologia"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.candidato && params.row.candidato.tipo
                        ? params.row.candidato.tipo.descrizione
                        : "N/A"}
                </div>
            ),
        },
        {
            field: "owner",
            headerName: t("Owner"),
            flex: 0.5, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.owner && params.row.owner.descrizione}
                </div>
            ),
        },
        {
            field: "azioni",
            headerName: "",
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div>
                    <Tooltip title="Elimina da storico">
                        <span>
                            <CloseIconButton onClick={handleDeleteStorico} id={params.row.id} />
                        </span>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const tabellaAssociati = [
        {
            field: "nome",
            headerName: t("Nome"),
            flex: 1.3, sortable: false, filterable: false, disableColumnMenu: true,
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
        {
            field: "tipologia",
            headerName: t("Job Title"),
            flex: 1.4, sortable: false, filterable: false, disableColumnMenu: true,
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
            flex: 0.5, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.rating ? params.row.rating.toFixed(2) : ""}
                </div>
            ),
        },
        {
            field: "stato",
            headerName: t("Stato Candidato"),
            flex: 1, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row.stato && params.row.stato.descrizione
                        ? params.row.stato.descrizione
                        : "N/A"}
                </div>
            ),
        },
        { field: "dataUltimoContatto", headerName: t("Contatto"), flex: 0.8, sortable: false, filterable: false, disableColumnMenu: true },
        {
            field: "azioni",
            headerName: "",
            flex: 1.5, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                    {/* <Button
                onClick={() => handleOpenModal(params.row)}
                sx={{
                backgroundColor: "transparent",
                fontWeight: "bold",
                color: "black",
                "&:hover": {
                    backgroundColor: "transparent",
                    transform: "scale(1.05)",
                    color: "black",
                },
                }}
                startIcon={<ChecklistIcon sx={{ backgroundColor: "transparent" }} />}
            >
            </Button> */}
                    <Tooltip title="Vai ad intervista">
                        <span>
                            <Link
                                to={`/recruiting/intervista/${params.row.id}`}
                                state={{ recruitingData: params.row }}
                            >
                                <IntervistaButton />
                            </Link>
                        </span>
                    </Tooltip>
                    <Tooltip title="Visualizza CV">
                        <span>
                            <ClipButton
                                hasFile={!!params.row?.file}
                                idFile={params.row.file ? params.row.file.id : null}
                                fileDescrizione={params.row.file ? params.row.file.descrizione : null}
                                onClick={() => handleDownloadCV(
                                    params.row.file ? params.row.file.id : null,
                                    params.row.file ? params.row.file.descrizione : null
                                )}
                            />
                        </span>
                    </Tooltip>
                    <Tooltip title="Modifica associazione">
                        <span>
                            <CheckListButton onClick={() => handleOpenModal(params.row)} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Elimina da associati">
                        <span>
                            <CloseIconButton onClick={handleDeleteAssociati} id={params.row.id} />
                        </span>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <SchemePage>
            <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                    }}
                >
                    <NuovaRicercaNeedMatch
                        filtri={filtri}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        onSearch={handleRicerche}
                        tipoOptions={tipoOptions}
                        tipologiaOptions={tipologiaOptions}
                        seniorityOptions={seniority}
                        onGoBack={handleGoBack}
                    />
                </Box>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            ml: 5,
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                            color: "#00B401",
                        }}
                    >
                        {descrizione} {nomeAzienda}
                    </Typography>
                </Box>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 10,
                    }}
                >
                    <ModalBox
                        fields={fieldsAggiorna}
                        initialValues={initialValuesAggiorna}
                        disableFields={disableFields}
                        onSubmit={handleSaveModal}
                        title={t("Modifica Stato Associazioni")}
                        showBackButton={true}
                        onClose={handleCloseModal}
                    />
                </Modal>
                <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
                    <TabellaCandidati
                        data={originalCandidati}
                        columns={tabellaCandidati}
                        title="Candidati"
                        getRowId={(row) => row.id}
                        pagina={paginaCandidati}
                        quantita={quantita}
                        righeTot={righeTotCandidati}
                        onPageChange={handlePageChangeCandidati}
                        headerRight={
                                  <Tabs
                                    value={poolView}
                                    onChange={async (e, v) => {
                                      setPoolView(v);
                                      sessionStorage.setItem("poolViewNeedMatch", v);
                                      setPaginaCandidati(0);
                                      setOriginalCandidati([]);
                                      await fetchMoreDataCandidati(0, v, filtri);
                                    }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    sx={{
                                      minHeight: 36,
                                      "& .MuiTab-root": {
                                        minHeight: 36,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        color: "#6d6c6c",
                                      },
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
                    />
                </Box>

                <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
                    <Tabella
                        data={originalStorico}
                        columns={tabellaStorico}
                        title="Storico"
                        getRowId={(row) => row.id}
                        pagina={paginaStorico}
                        quantita={quantita}
                        righeTot={righeTotStorico}
                        onPageChange={handlePageChangeStorico}
                    />
                </Box>

                <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
                    <Tabella
                        data={originalAssociati}
                        columns={tabellaAssociati}
                        title="Candidati Associati"
                        getRowId={(row) => row.id}
                        pagina={paginaAssociati}
                        quantita={quantita}
                        righeTot={righeTotAssociati}
                        onPageChange={handlePageChangeAssociati}
                    />
                </Box>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle id="form-dialog-title">
                        {t('Modifica Azienda')}
                    </DialogTitle>
                    <DialogContent>
                    </DialogContent>
                </Dialog>
                <IntervisteModal
                    open={openModalIntervista}
                    handleClose={() => setOpenModalIntervista(false)}
                    intervista={selectedIntervista}
                />
            </motion.div>
        </SchemePage>
    );
};

export default NeedMatch;