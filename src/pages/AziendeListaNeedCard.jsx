    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import InfiniteScroll from "react-infinite-scroll-component";
    import { useLocation, useParams, useNavigate } from "react-router-dom";

    import { Box, Grid, CircularProgress, Button, Typography } from "@mui/material";
    import { useUserTheme } from "../components/TorchyThemeProvider.jsx";
import SchemePage from "../components/SchemePage.jsx";
import NuovaRicercaListaNeed from "../components/nuoveRicerche/NuovaRicercaListaNeed.jsx";
import ListaNeedCardV2 from "../components/card/ListaNeedCardV2.jsx";

    const AziendeListaNeedCard = () => {
    const theme = useUserTheme();

    const params = useParams();
    const navigate = useNavigate();

    const { id } = params;

    const [originalListaNeed, setOriginalListaNeed] = useState([]);
    const [loading, setLoading] = useState(false);

    //stati per le ricerche
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [keyPeopleOptions, setKeyPeopleOptions] = useState([]);
    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaListaNeed");
        return filtriSalvati
        ? JSON.parse(filtriSalvati)
        : {
            owner: "",
            tipologia: "",
            stato: "",
            priorita: "",
            week: "",
            keyPeople: "",
            };
    });

    //stati per la paginazione
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const quantita = 10;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };


    const fetchData = async () => {
        setLoading(true);
        const filtriDaInviare = {
        owner: filtri.owner || null,
        tipologia: filtri.tipologia || null,
        stato: filtri.stato || null,
        priorita: filtri.priorita || null,
        week: filtri.week || null,
        keypeople: filtri.keypeople || null,
        pagina: 0,
        quantita: 10,
        };
        try {
        const response = await axios.get(
            `http://localhost:8080/need/react/cliente/modificato/${id}`,
            { headers: headers, params: filtriDaInviare }
        );
        const responseOwner = await axios.get(
            "http://localhost:8080/owner",
            { headers: headers }
        );
        const responseTipologia = await axios.get(
            "http://localhost:8080/need/react/tipologia",
            { headers: headers }
        );
        const responseStato = await axios.get(
            "http://localhost:8080/need/react/stato",
            { headers: headers }
        );
        const responseKeyPeople = await axios.get(
            `http://localhost:8080/keypeople/react/azienda/${id}`,
            { headers: headers }
        );

        if (Array.isArray(responseKeyPeople.data)) {
            setKeyPeopleOptions(
            responseKeyPeople.data.map((keyPeople) => ({
                label: keyPeople.nome,
                value: keyPeople.id,
            }))
            );
        } else {
            console.error(
            "I dati del keypeople ottenuti non sono nel formato Array; ",
            responseKeyPeople.data
            );
        }

        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(
            responseOwner.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseOwner.data
            );
        }

        if (Array.isArray(responseTipologia.data)) {
            setTipologiaOptions(
            responseTipologia.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseTipologia.data
            );
        }

        if (Array.isArray(responseStato.data)) {
            setStatoOptions(
            responseStato.data.map((stato) => ({
                label: stato.descrizione,
                value: stato.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseStato.data
            );
        }

        if (Array.isArray(response.data)) {
            const listaNeedConId = response.data.map((need) => ({ ...need }));
            setOriginalListaNeed(listaNeedConId);
            setHasMore(listaNeedConId.length >= quantita);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array: ",
            response.data
            );
        }
        setLoading(false);
        } catch (error) {
        console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaListaNeed");
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

    //caricamento dati con paginazione

    const fetchMoreData = async () => {
        const paginaSuccessiva = pagina + 1;
        const filtriAttivi = Object.values(filtri).some(
        (value) => value !== null && value !== ""
        );

        const url = filtriAttivi
        ? "http://localhost:8080/need/react/ricerca/modificato"
        : `http://localhost:8080/need/react/cliente/modificato/${id}`;

        const filtriDaInviare = {
        owner: filtri.owner || null,
        tipologia: filtri.tipologia || null,
        stato: filtri.stato || null,
        priorita: filtri.priorita || null,
        week: filtri.week || null,
        keyPeople: filtri.keyPeople || null,
        pagina: paginaSuccessiva,
        quantita: 10,
        };
        try {
        const response = await axios.get(url, {
            headers: headers,
            params: filtriDaInviare,
        });
        if (Array.isArray(response.data)) {
            const listaNeedConId = response.data.map((need) => ({ ...need }));
            setOriginalListaNeed(listaNeedConId);
            setHasMore(listaNeedConId.length >= quantita);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array: ",
            response.data
            );
        }
        setLoading(false);
        } catch (error) {
        console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    //funzione di ricerca
    const handleRicerche = async () => {
        const isAnyFilterSet = Object.values(filtri).some((value) => value);
        if (!isAnyFilterSet) {
        return;
        }
        const filtriDaInviare = {
        descrizione: filtri.descrizione || null,
        tipologia: filtri.tipologia || null,
        owner: filtri.owner || null,
        stato: filtri.stato || null,
        keyPeople: filtri.keyPeople || null,
        azienda: id,
        pagina: 0,
        quantita: 10,
        };
        setLoading(true);
        try {
        const response = await axios.get(
            "http://localhost:8080/need/react/ricerca/modificato",
            { headers: headers, params: filtriDaInviare }
        );
        const responseOwner = await axios.get(
            "http://localhost:8080/owner",
            { headers: headers }
        );
        const responseTipologia = await axios.get(
            "http://localhost:8080/need/react/tipologia",
            { headers: headers }
        );
        const responseStato = await axios.get(
            "http://localhost:8080/need/react/stato",
            { headers: headers }
        );

        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(
            responseOwner.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseOwner.data
            );
        }

        if (Array.isArray(responseTipologia.data)) {
            setTipologiaOptions(
            responseTipologia.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseTipologia.data
            );
        }

        if (Array.isArray(responseStato.data)) {
            setStatoOptions(
            responseStato.data.map((stato) => ({
                label: stato.descrizione,
                value: stato.id,
            }))
            );
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array; ",
            responseStato.data
            );
        }

        if (Array.isArray(response.data)) {
            setOriginalListaNeed(response.data);
            setHasMore(response.data.length >= quantita);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array: ",
            response.data
            );
        }
        } catch (error) {
        console.error("Errore durante il recupero dei dati filtrati: ", error);
        } finally {
        setLoading(false);
        }
    };

    //funzione cambiamento stato select
    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri((currentFilters) => {
        const newFilters = { ...currentFilters, [name]: newValue };

        // Controllo se tutti i filtri sono vuoti
        const areFiltersEmpty = Object.values(newFilters).every(
            (value) => value === null
        );
        if (areFiltersEmpty) {
            fetchData();
        } else {
            setPagina(0);
            setOriginalListaNeed([]);
            setHasMore(true);
            // handleRicerche();
        }

        return newFilters;
        });
    };

    useEffect(() => {
        const { ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(
        (x) => x !== "" && x !== null
        );
        if (filtriHasValues) {
        handleRicerche();
        } else {
        fetchData();
        }
    }, [filtri.descrizione]);

    useEffect(() => {
        sessionStorage.setItem("filtriRicercaListaNeed", JSON.stringify(filtri));
    }, [filtri]);

    //funzione di reset dei campi di ricerca
    const handleReset = async () => {
        setFiltri({
        descrizione: "",
        stato: "",
        tipologia: "",
        owner: "",
        keyPeople: "",
        });
        setPagina(0);
        setOriginalListaNeed([]);
        setHasMore(true);

        await fetchData(0);
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const navigateToAggiungi = () => {
        navigate(
        `/need/aggiungi/${id}`
        // { state: { denominazione: valori.state.denominazione }}
        );
    };

    //funzione per cancellare il need
    const handleDelete = async (id) => {
        try {
        const responseDelete = await axios.delete(
            `http://localhost:8080/need/react/elimina/${id}`,
            { headers: headers }
        );
        await fetchData(0);
        } catch (error) {
        console.error("Errore durante la cancellazione: ", error);
        }
    };

    //funzione per il refresh
    const handleRefresh = async () => {
        await fetchData(0);
    };

    //funzione per avere il contatto da usare per le ricerche
    const handleContactChange = (contattoId) => {
        setFiltri((prev) => ({ ...prev, keypeople: contattoId }));
    };

    return (
        <SchemePage>
        <Box
            sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            }}
        >
            <NuovaRicercaListaNeed
            filtri={filtri}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleRicerche}
            tipologiaOptions={tipologiaOptions}
            statoOptions={statoOptions}
            keyPeopleOptions={keyPeopleOptions}
            ownerOptions={ownerOptions}
            onRicerche={handleRicerche}
            onNavigate={navigateToAggiungi}
            />
        </Box>
        {/* <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#00B401', display: 'flex', justifyContent: 'center', fontSize: '2em'}}>Need di {valori.state.denominazione}</Typography> */}
        <InfiniteScroll
            dataLength={originalListaNeed.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1em",
                overflow: "hidden",
                }}
            >
                <CircularProgress sx={{ color: theme.palette.border.main }} />
            </Box>
            }
        >
            <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
            {loading ? (
                <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
                ></Box>
            ) : (
                originalListaNeed.map((need, index) => (
                <Grid item xs={12} md={6} key={index}>
                    <ListaNeedCardV2
                    valori={need}
                    statoOptions={statoOptions}
                    onDelete={() => handleDelete(need.id)}
                    onRefresh={handleRefresh}
                    isFirstCard={index === 0}

                    />
                </Grid>
                ))
            )}
            </Grid>
        </InfiniteScroll>
        <Box
            sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            }}
        >
            {/* <Button
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '5px',
                    '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                        transform: 'scale(1.05)'
                    },
                }}
                onClick={handleGoBack}
                >
                    Indietro
                </Button> */}
        </Box>
        </SchemePage>
    );
    };

    export default AziendeListaNeedCard;
