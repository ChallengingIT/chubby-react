    // Dashboard.js
    import React, { useContext, useEffect, useState } from "react";
    import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
    Fab,
    Popover
    } from "@mui/material";
    import AttivitaRecruitingBox from "../components/dashboardComponents/AttivitaRecruitingBox";
    import AttivitaBusinessBox from "../components/dashboardComponents/AttivitaBusinessBox";
    import TabellaPipelineNeed from "../components/dashboardComponents/TabellaPipelineNeed";
    import axios from "axios";
    import SchemePage from "../components/SchemePage";
    import { useNotification } from "../components/NotificationContext.js";
import TabellaAntDesign from "../prove/TabellaAntDesign.jsx";
    import AddIcon                                          from '@mui/icons-material/Add'; //bottone per chatgpt
    import GptChat                                          from '../components/GptChat';



    function Dashboard() {
    const { showNotification } = useNotification();

    // Altri stati e variabili...
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const quantita = 10;

    const [originalPipeline, setOriginalPipeline] = useState([]);
    const [originalAttivitaBusiness, setOriginalAttivitaBusiness] = useState([]);
    const [originalAttivitaRecruiting, setOriginalAttivitaRecruiting] = useState(
        []
    );
    const [aziendeOptions, setAziendaOptions] = useState([]);
    const [loading, setLoading] = useState(false);


     //stato di AddIcon
    const [anchorEl, setAnchorEl] = useState(null);
    const [isRotated, setIsRotated] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const handleClick = (event) => {

    if (showChat) {
            handleClose();
        } else {
            setAnchorEl(event.currentTarget);
            setIsRotated(!isRotated);
            setShowChat(true);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsRotated(false);
        setShowChat(false);
    };

    const open = Boolean(anchorEl);

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

        const baseUrlAttivitaRecruiting = userHasRole("ROLE_ADMIN")
        ? "http://89.46.196.60:8443/dashboard/attivita/recruting"
        : "http://89.46.196.60:8443/dashboard/attivita/recruting/personal";

        const baseUrlAttivitaBusiness = userHasRole("ROLE_ADMIN")
        ? "http://89.46.196.60:8443/dashboard/attivita/business"
        : "http://89.46.196.60:8443/dashboard/attivita/business/personal";

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
            "http://89.46.196.60:8443/aziende/react/select",
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
            showNotification(
                `Hai un'attività alle ${new Date(
                activityTime
                ).toLocaleTimeString()}`
            );
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
        flex: 0.6,
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
        flex: 0.4,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        },
        {
        field: "stato",
        headerName: "Stato",
        flex: 0.4,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
            const stato = params.value;
            return `${stato.descrizione}`;
        },
        },
    ];





    //     const columns = [
    // {
    //     title: "Owner",
    //     dataIndex: 'owner',
    //     key: 'owner',
    //     render: (owner) => `${owner.nome} ${owner.cognome}`,
    //     width: 200,  

    // },
    // {
    //     title: "Cliente",
    //     dataIndex: 'cliente',
    //     key: 'cliente',
    //     render: (cliente) => `${cliente.denominazione}`,
    //     width: 250,  

    // },
    // {
    //     title: "Descrizione",
    //     dataIndex: 'descrizione',
    //     key: 'descrizione',
    //     width: 250,  

    // },
    // {
    //     title: "Priorità",
    //     dataIndex: 'priorita',
    //     key: 'priorita',
    //     width: 100,  

    // },
    // {
    //     title: "Stato",
    //     dataIndex: 'stato',
    //     key: 'stato',
    //     render: (stato) => `${stato.descrizione}`,
    //     width: 100,  

    // }
    // ];


    const getRowId = (row) => row.id;

    return (
        <Container
        maxWidth="false"
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            height: "auto",
            width: "100vw",
        }}
        >
        <Fab aria-label="add" sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    bgcolor: '#00B400',
                    transition: 'transform 0.3s ease, border-width 0.3s ease',
                    '&:hover': {
                        bgcolor: '#00B400',
                        transform: 'scale(1.2)'
                    }
                }} onClick={handleClick}>
                    <AddIcon sx={{
                        color: 'white',
                        transition: 'transform 0.3s ease',
                        transform: isRotated ? 'rotate(225deg)' : 'none'
                    }} />
                </Fab>
                <Popover
                open={Boolean(anchorEl) && showChat}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                PaperProps={{ 
                    style: { 
                        borderRadius: '20px',
                        overflow: 'hidden' 
                    },
                    }}
            >
                <GptChat />
            </Popover>
        <Container
            maxWidth="xl"
            sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            p: 3,
            marginLeft: "12.8em",
            // marginTop: "0.5em",
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
            <Grid item xs={6} sx={{ display: 'flex', height: '50vh'}}>
                <AttivitaRecruitingBox data={originalAttivitaRecruiting} />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', height: '50vh'}}>
                <AttivitaBusinessBox
                data={originalAttivitaBusiness}
                aziendeOptions={aziendeOptions}
                />
            </Grid>
            </Grid>
        </Container>
        </Container>
    );
    }

    export default Dashboard;
