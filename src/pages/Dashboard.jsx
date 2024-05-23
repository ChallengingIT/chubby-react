// Dashboard.js
import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
} from "@mui/material";
import AttivitaRecruitingBox from "../components/dashboardComponents/AttivitaRecruitingBox";
import AttivitaBusinessBox from "../components/dashboardComponents/AttivitaBusinessBox";
import TabellaPipelineNeed from "../components/dashboardComponents/TabellaPipelineNeed";
import axios from "axios";
import SchemePage from "../components/SchemePage";
import { useNotification } from "../components/NotificationContext.js";

function Dashboard() {
    const { showNotification } = useNotification();

    // Altri stati e variabili...
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const quantita = 10;

    const [originalPipeline, setOriginalPipeline] = useState([]);
    const [originalAttivitaBusiness, setOriginalAttivitaBusiness] = useState([]);
    const [originalAttivitaRecruiting, setOriginalAttivitaRecruiting] = useState([]);
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
            ? "http://localhost:8080/dashboard/pipeline/admin"
            : "http://localhost:8080/dashboard/pipeline";

        const baseUrlAttivitaRecruiting = userHasRole("ROLE_ADMIN")
            ? "http://localhost:8080/dashboard/attivita/recruting"
            : "http://localhost:8080/dashboard/attivita/recruting/personal";

        const baseUrlAttivitaBusiness = userHasRole("ROLE_ADMIN")
            ? "http://localhost:8080/dashboard/attivita/business"
            : "http://localhost:8080/dashboard/attivita/business/personal";

        try {
            const [
                responsePipeline,
                responseAttivitaRecruiting,
                responseAttivitaBusiness,
            ] = await Promise.all([
                axios.get(baseUrlPipeline, { headers, params: filtriDaInviare }),
                axios.get(baseUrlAttivitaRecruiting, {
                    headers,
                    params: filtriDaInviare,
                }),
                axios.get(baseUrlAttivitaBusiness, {
                    headers,
                    params: filtriDaInviare,
                }),
            ]);

            const responseAzienda = await axios.get(
                "http://localhost:8080/aziende/react/select",
                { headers: headers }
            );

            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(
                    responseAzienda.data.map((azienda) => ({
                        label: azienda.denominazione,
                        value: azienda.id,
                    }))
                );
            } else {
                console.error(
                    "I dati ottenuti dalla chiamata delle aziendenon sono nel formato Array:",
                    responseAzienda.data
                );
            }

            if (Array.isArray(responsePipeline.data)) {
                const pipelineConId = responsePipeline.data.map((pipeline) => ({
                    ...pipeline,
                }));
                setOriginalPipeline(pipelineConId);
            } else {
                console.error(
                    "I dati ottenuti non sono nel formato Array:",
                    responsePipeline.data
                );
            }

            if (Array.isArray(responseAttivitaRecruiting.data)) {
                setOriginalAttivitaRecruiting(responseAttivitaRecruiting.data);
                setHasMore(responseAttivitaRecruiting.data.length >= quantita);
                // Imposta notifiche per le attività di recruiting
                scheduleNotifications(responseAttivitaRecruiting.data);
            } else {
                console.error(
                    "I dati ottenuti da attività per recruiting non sono nel formato Array:",
                    responseAttivitaRecruiting.data
                );
            }

            if (Array.isArray(responseAttivitaBusiness.data)) {
                setOriginalAttivitaBusiness(responseAttivitaBusiness.data);
                setHasMore(responseAttivitaBusiness.data.length >= quantita);
                // Imposta notifiche per le attività di business
                scheduleNotifications(responseAttivitaBusiness.data);
            } else {
                console.error(
                    "I dati ottenuti da attività per business non sono nel formato Array:",
                    responseAttivitaBusiness.data
                );
            }

            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            setLoading(false);
        }
    };

    const scheduleNotifications = (activities) => {
        activities.forEach((activity) => {
            const activityTime = new Date(activity.orario).getTime();
            const currentTime = new Date().getTime();
            const tenMinutesBefore = activityTime - 10 * 60 * 1000;

            if (tenMinutesBefore > currentTime) {
                setTimeout(() => {
                    showNotification(`Hai un'attività alle ${new Date(activityTime).toLocaleTimeString()}`);
                }, tenMinutesBefore - currentTime);
            }
        });
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

    const columns = [
        {
            field: "owner",
            headerName: "Owner",
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const owner = params.value;
                return `${owner.nome} ${owner.cognome}`;
            },
        },
        {
            field: "cliente",
            headerName: "Cliente",
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const cliente = params.value;
                return `${cliente.denominazione}`;
            },
        },
        {
            field: "descrizione",
            headerName: "Descrizione",
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "priorita",
            headerName: "Priorità",
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "stato",
            headerName: "Stato",
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const stato = params.value;
                return `${stato.descrizione}`;
            },
        },
    ];

    const getRowId = (row) => row.id;

    return (
        <SchemePage>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: "20px",
                            maxWidth: "100%",
                            height: "50vh",
                            border: "2px solid #00B401",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
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
                                    mt: 2,
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
                <Grid item xs={6}>
                    <AttivitaRecruitingBox data={originalAttivitaRecruiting} />
                </Grid>
                <Grid item xs={6}>
                    <AttivitaBusinessBox
                        data={originalAttivitaBusiness}
                        aziendeOptions={aziendeOptions}
                    />
                </Grid>
            </Grid>
        </SchemePage>
    );
}

export default Dashboard;
