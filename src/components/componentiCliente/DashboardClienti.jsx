// Dashboard.js

import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
    Link
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TabellaPipelineNeed from "../dashboardComponents/TabellaPipelineNeed.jsx";
import BoxAttivitaWeek from "../dashboardComponents/BoxAttivitaWeek.jsx";
import { useUserTheme } from "../TorchyThemeProvider.jsx";

function DashboardClienti() {
    const navigate = useNavigate();
    const theme = useUserTheme();


    const [originalPipeline, setOriginalPipeline] = useState([]);
    const [aziendeOptions, setAziendaOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaPipeline");
        return filtriSalvati
            ? JSON.parse(filtriSalvati)
            : {
                descrizione: null,
                azienda: null,
                stato: null,
                owner: null,
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

    const fetchData = async () => {
        setLoading(true);
        const filtriDaInviare = {
            pagina: 0,
            quantita: 10,
        };
        if (!userHasRole("ROLE_ADMIN")) {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrlPipeline = userHasRole("ROLE_ADMIN")
            ? "http://89.46.196.60:8443/dashboard/pipeline/admin"
            : "http://89.46.196.60:8443/dashboard/pipeline";

        try {
            const responsePipeline = await axios.get(baseUrlPipeline, { headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers });

            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(responseAzienda.data.map((azienda) => ({
                    label: azienda.denominazione,
                    value: azienda.id,
                })));
            } else {
                console.error("I dati ottenuti dalla chiamata delle aziende non sono nel formato Array:", responseAzienda.data);
            }

            if (Array.isArray(responsePipeline.data)) {
                const pipelineConId = responsePipeline.data.map((pipeline) => ({
                    id: pipeline.id,
                    descrizione: pipeline.descrizione || "N/A",
                    cliente: pipeline.cliente || { denominazione: "Cliente non disponibile", id: null },
                    owner: pipeline.owner ? `${pipeline.owner?.nome} ${pipeline.owner?.cognome}` : "Owner non disponibile",
                    priorita: pipeline.priorita || "Priorità non disponibile",
                    stato: pipeline.stato ? pipeline.stato.descrizione : "Stato non disponibile",
                    pipelineData: pipeline.pipeline || "Dati non disponibili"
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

    const handleDescrizioneClick = (descrizione) => {
        navigate('/need', { state: { descrizione } });
    };

    const columns = [
        {
            field: "owner",
            headerName: "Owner",
            flex: 0.6,
            sortable: true,
            filterable: true,
        },
        {
            field: "cliente",
            headerName: "Cliente",
            flex: 1,
            sortable: true,
            filterable: true,
            renderCell: (params) => {
                return params.value ? params.value.denominazione : "Cliente non disponibile";
            }
        },
        {
            field: "descrizione",
            headerName: "Descrizione",
            flex: 1,
            sortable: true,
            filterable: true,
            renderCell: (params) => {
                const descrizione = params.value || "Descrizione non disponibile";
                const clienteId = params.row.cliente?.id || null;
                return (
                    <Link
                        component="button"
                        onClick={() => handleDescrizioneClick(descrizione, clienteId)}
                        sx={{
                            textDecoration: "none",
                            color: "black",
                            borderBottom: "solid 1px black",
                        }}
                    >
                        {descrizione}
                    </Link>
                );
            },
        },
        {
            field: "priorita",
            headerName: "Priorità",
            flex: 0.4,
            sortable: true,
            filterable: true,
        },
        {
            field: "stato",
            headerName: "Stato",
            flex: 0.4,
            sortable: true,
            filterable: true,
        },
    ];

    const getRowId = (row) => row.id;

    return (
        <Container
            maxWidth="false"
            sx={{
                display: "flex",
                backgroundColor: "#EEEDEE",
                height: "auto",
                width: "auto",
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    p: 3,
                    marginLeft: "12.8em",
                    marginBottom: "0.8em",
                    marginRight: "0.8em",
                    backgroundColor: "#FEFCFD",
                    borderRadius: "20px",
                    minHeight: "97vh",
                    maxHeight: "97vh",
                    mt: 1.5,
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                borderRadius: "20px",
                                maxWidth: "100%",
                                height: "50vh",
                                border: "2px solid",
                                borderColor: theme.palette.border.main,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        fontWeight: "bold",
                                        fontSize: '1.2em'
                                    }}
                                >
                                    Pipeline Need
                                </Typography>
                                <Box sx={{ flexGrow: 1, height: "90%", width: "100%" }}>
                                    <TabellaPipelineNeed
                                        data={originalPipeline}
                                        columns={columns}
                                        getRowId={getRowId}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    mt: 2,
                                    ml: 2,
                                    borderRadius: "20px",
                                    maxWidth: "100%",
                                    height: "40vh",
                                    border: "2px solid",
                                    borderColor: theme.palette.border.main,
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        width: "100%",
                                    }}
                                >
                                    <BoxAttivitaWeek
                                        aziendeOptions={aziendeOptions}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
}


export default DashboardClienti;
