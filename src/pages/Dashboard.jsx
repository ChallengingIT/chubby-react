// Dashboard.js

import React, { useEffect, useState } from "react";
import {
    Grid,
    Container,
    Link,
    Box
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BoxAttivitaWeek from "../components/dashboardComponents/BoxAttivitaWeek.jsx";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from '@mui/material';
import { motion } from "framer-motion";
import CustomTableCell2 from '../components/CustomTableCell2.jsx';



function Dashboard() {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');


    const navigate = useNavigate();

    const [originalPipeline, setOriginalPipeline] = useState([]);
    const [aziendeOptions, setAziendaOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialState, setInitialState] = useState(0.5);
    const espandiPrimo = () => setInitialState(prev => (prev === 0.7 ? 0.5 : 0.7));
    const espandiSecondo = () => setInitialState(prev => (prev === 0.3 ? 0.5 : 0.3));


    const [pipelineExpanded, setPipelineExpanded] = useState(false);
    const [pianoIncontriExpanded, setPianoIncontriExpanded] = useState(false);

    const [pageSizeAzioni, setPageSizeAzioni] = useState(3);
    const [pageSizePipeline, setPageSizePipeline] = useState(4);

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaPipeline");
        return filtriSalvati
            ? JSON.parse(filtriSalvati)
            : {
                descrizione: null,
                azienda: null,
                stato: null,
                ownerBusiness: null,
                ownerRecruiter: null,
                priorita: null,
            };
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    // Varianti di animazione per far apparire la tabella
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 }, // Parte dal basso
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Appare al centro
    };

    const fetchData = async () => {
        setLoading(true);
        const filtriDaInviare = {
            pagina: 0,
            quantita: 10,
        };
        if (!userHasRole("ADMIN")) {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrlPipeline = userHasRole("ADMIN")
            ? "http://89.46.196.60:8443/dashboard/pipeline/admin"
            : "http://89.46.196.60:8443/dashboard/pipeline";

        try {
            const responsePipeline = await axios.get(baseUrlPipeline, { headers: headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });

            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(responseAzienda.data.map((azienda) => ({
                    label: azienda?.denominazione,
                    value: azienda?.id,
                })));
            } else {
                console.error("I dati ottenuti dalla chiamata delle aziende non sono nel formato Array:", responseAzienda.data);
            }

            if (Array.isArray(responsePipeline?.data)) {
                const pipelineConId = responsePipeline.data.map((pipeline) => ({
                    id: pipeline?.id,
                    descrizione: pipeline?.descrizione || "N/A",
                    cliente: pipeline?.cliente || { denominazione: "Cliente non disponibile", id: null },
                    tipologia: pipeline?.tipologia || "N/A",
                    ownerBusiness: pipeline?.ownerBusiness ? `${pipeline?.ownerBusiness?.descrizione}` : "Owner non disponibile",
                    ownerRecruiter: pipeline?.ownerRecruiter ? `${pipeline?.ownerRecruiter?.descrizione}` : "Owner non disponibile",

                    priorita: pipeline?.priorita || "Priorità non disponibile",
                    stato: pipeline?.stato ? pipeline?.stato?.descrizione : "Stato non disponibile",
                    statoId: pipeline?.stato ? pipeline?.stato?.id : "Stato non disponibile",
                    pipelineData: pipeline?.pipeline || "Dati non disponibili",
                    aziendaInterna: pipeline?.aziendaInterna ? `${pipeline?.aziendaInterna?.descrizione}` : "Azienda non disponibile"
                }));
                setOriginalPipeline(pipelineConId);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responsePipeline.data);
            }

            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaPipeline");
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

    const handleRicerche = () => {
        console.log("handleRicerche");
    };

    const handleDescrizioneClick = (descrizione, clienteId) => {
        navigate('/need', { state: { descrizione, clienteId, fromDashboard: true } });
    };

    const handleRefresh = () => {
        fetchData();
    }

    const expandedTogglePianoIncontri = () => {
        if (pianoIncontriExpanded) {            
            setPianoIncontriExpanded(false);
            setPipelineExpanded(false);
            pageSizeAzioni === 7 ? setPageSizeAzioni(3) : setPageSizeAzioni(7);
        } else {
            setPipelineExpanded(false);
            setPianoIncontriExpanded(true);
            setPageSizeAzioni(7);
        }
    }

    const expandedTogglePipeline = () => {
        if (pipelineExpanded) {
            setPipelineExpanded(false);
            setPianoIncontriExpanded(false);
            pageSizePipeline === 8 ? setPageSizePipeline(4) : setPageSizePipeline(8);
            return;
        } else {
            setPianoIncontriExpanded(false);
            setPipelineExpanded(true);
            setPageSizePipeline(8);
        }
    }


    const columns = [
        {
            field: 'aziendaInterna',
            headerName: "Società Owner",
            align: 'center',
            render: (row) => row?.aziendaInterna || "Azienda non disponibile",
        },
        {
            field: "cliente",
            headerName: "Azienda Cliente",
            align: 'center',
            render: (row) => row.cliente?.denominazione || "Cliente non disponibile",
        },
        {
            field: "tipologia",
            headerName: "Tipologia",
            align: 'center',
            render: (row) => row?.tipologia || "Tipologia non disponibile",
        },
        {
            field: "ownerBusiness",
            headerName: "Business Owner",
            align: 'center',
            render: (row) => row?.ownerBusiness || "Owner non disponibile",

        },
        {
            field: "ownerRecruiter",
            headerName: "Owner Operativo",
            align: 'center',
            render: (row) => row?.ownerRecruiter || "Owner non disponibile",

        },
        {
            field: "descrizione",
            headerName: "Need",
            align: 'center',
            render: (row) => (
                <Link
                    component="button"
                    onClick={() => handleDescrizioneClick(row?.descrizione, row?.cliente?.id || null)}
                    sx={{
                        textDecoration: "none",
                        color: "black",
                        borderBottom: "solid 1px black",
                    }}
                >
                    {row?.descrizione}
                </Link>
            ),
        },
        {
            field: "priorita",
            align: 'center',
            headerName: "Priorità",
        },
        {
            field: "stato",
            align: 'center',
            headerName: "Stato",
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
        >
            <Container
                maxWidth="auto"
                sx={{
                    height: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#EEEDEE",
                    width: "auto",
                    overflow: "hidden",
                    padding: 0,
                    margin: 0,
                }}
            >
                <Box
                container
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "97%",
                        p: 3,
                        marginLeft: isSmallScreen ? "3.5em" : "11em",
                        marginBottom: "0.8em",
                        backgroundColor: "#FEFCFD",
                        borderRadius: "20px",
                        mt: 1.5,
                        transition: 'margin-left 0.3s ease',
                        overflow: "hidden",
                        position: "relative",

                    }}
                >
                    <Grid
                        container
                        direction="column"
                        spacing={0}
                        sx={{ flex: 1, minHeight: 0 , gap: 4}}>
                        <Grid
                            size={12}
                            sx={{ flex: initialState, minHeight: 0, display: 'flex', transition: 'flex 250ms ease', overflow: 'hidden' }}
                        >
                            {/* PIPELINE TABLE */}
                            <CustomTableCell2
                                columns={columns}
                                rows={originalPipeline}
                                title={t("Pipeline")}
                                pianoIncontriExpanded={pianoIncontriExpanded}
                                expanded={pipelineExpanded}
                                setExpanded={expandedTogglePipeline}
                                onRefresh={handleRefresh}
                                pageSize={pageSizePipeline}
                                onClickButton={espandiPrimo}
                                initialState={initialState}
                            />
                        </Grid>
                        <Grid
                            size={12}
                            sx={{ flex: 1 - initialState, minHeight: 0, display: 'flex', transition: 'flex 250ms ease', overflow: 'hidden' }}
                        >
                            {/* ACTIONS TABLE */}
                            <BoxAttivitaWeek
                                aziendeOptions={aziendeOptions}
                                expanded={pianoIncontriExpanded}
                                pipelineExpanded={pipelineExpanded}
                                setExpanded={expandedTogglePianoIncontri}
                                pageSize={pageSizeAzioni}
                                onClickButton={espandiSecondo}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </motion.div>
    );
}

export default Dashboard;
