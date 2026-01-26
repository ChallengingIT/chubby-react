import React, { useState, useEffect }       from 'react';
import InfiniteScroll                       from 'react-infinite-scroll-component';
import NeedCardFlip                         from '../components/card/NeedCardFlip';
import SchemePage                           from '../components/SchemePage.jsx';
import { useLocation }                      from 'react-router-dom';
import ApiService                           from '../services/ApiService';
import RicercaNeed                          from '../components/ricerche/RicercaNeed.jsx';


import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
} from '@mui/material';

const NeedPage = () => {
    const location = useLocation();


    const [originalNeed,        setOriginalNeed     ] = useState([]);
    const [filteredNeed,        setFilteredNeed     ] = useState([]);
    const [loading,             setLoading          ] = useState(false);
    const [recordTot,           setRecordTot        ] = useState(0);

    //stati per le ricerche
    const [tipologiaOptions,    setTipologiaOptions ] = useState([]);
    const [ownerOptions,        setOwnerOptions     ] = useState([]);
    const [statoOptions,        setStatoOptions     ] = useState([]);
    const [aziendaOptions,      setAziendaOptions   ] = useState([]);
    const [skillsOptions,       setSkillsOptions    ] = useState([]);

    const [filtri,              setFiltri           ] = useState(() => {
        if (location.state?.fromDashboard) {
            return {
                descrizione:    location.state.descrizione || null,
                cliente:        location.state.clienteId || null,
                tipologia:      null,
                stato:          null,
                owner:          null,
                keypeople:      null,
                skills:         null,
                location:       null
            };
        } else {
            const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
            return filtriSalvati ? JSON.parse(filtriSalvati) : {
                descrizione:        null,
                cliente:            null,
                tipologia:          null,
                stato:              null,
                owner:              null,
                keypeople:          null,
                skills:             null,
                location:           null
            };
        }
    });
    
    //stati per la paginazione
    const [pagina,              setPagina           ] = useState(0);
    const [hasMore,             setHasMore          ] = useState(true);
    const [isSearchActive,      setIsSearchActive   ] = useState(false);
    const quantita = 10;


    //controllo del ruolo dell'utente loggato
    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };


    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const responseNeedSkills = await ApiService.request("skillSelect");
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
    

    //caricamento dati al montaggio
    const fetchData = async (reset = false) => {
        setLoading(true);

        const filtriDaInviare = {
            pagina: 0,
            quantita: 10
        };
        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }


        try {
            const responseNeed = await ApiService.request(
                            userHasRole("ADMIN") ? "getAllNeedAdmin" : "getAllNeedPersonal",
                            {},
                            {},
                            {},
                            filtriDaInviare
                        );
            const responseAzienda   = await ApiService.request("getAziendeSelect");
            const responseOwner     = await ApiService.request("getAllOwnerSelect");
            const responseTipologia = await ApiService.request("tipologiaSelect");
            const responseStato     = await ApiService.request("statoSelect");

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id })));
            } else {
                console.error("I dati ottenuti dalla chiamata degli owner non sono nel formato Array; ", responseOwner.data);
            }

            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(responseAzienda.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
            } else {
                console.error("I dati ottenuti dalla chiamata delle aziende non sono nel formato Array:", responseAzienda.data);
            }

            if (Array.isArray(responseTipologia.data)) {
                setTipologiaOptions(responseTipologia.data.map((tipologia) => ({ label: tipologia.descrizione, value: tipologia.id })));
            } else {
                console.error("I dati ottenuti dalla chiamata delle tipologie non sono nel formato Array; ", responseTipologia.data);
            }

            if (Array.isArray(responseStato.data)) {
                setStatoOptions(responseStato.data.map((stato) => ({ label: stato.descrizione, value: stato.id })));
            } else {
                console.error("I dati ottenuti dalla chiamata degli stati non sono nel formato Array; ", responseStato.data);
            }

            if (Array.isArray(responseNeed.data)) {
                const needConId = responseNeed.data.map((need) => ({ ...need }));
                setOriginalNeed(needConId);
                setHasMore(needConId.length >= quantita);
                if (reset) {
                    setFilteredNeed([]);
                    setIsSearchActive(false);
                }
            } else {
                console.error("I dati ottenuti dalla chiamata dei need non sono nel formato Array; ", responseNeed.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
            setLoading(false);
        }
    };


    

    //caricamento dati con paginazione
    const fetchMoreData = async () => {
        const paginaSuccessiva = pagina + 1;

        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtri.username = userObj.username;
            }
        }

        const filtriDaInviare = Object.fromEntries(
            Object.entries({
                ...filtri,
                pagina: paginaSuccessiva,
                quantita: quantita,
            }).filter(([_, value]) => value !== null && value !== undefined && value !== "")
        );


        try {
        const responsePaginazione = await ApiService.request(
                userHasRole("ADMIN")
                    ? (isSearchActive ? "ricercaNeedAdmin" : "getAllNeedAdmin")
                    : (isSearchActive ? "ricercaNeedPersonal" : "getAllNeedPersonal"),
                {},
                {},
                {},
                filtriDaInviare
            );            
            if (isSearchActive) {
                const { record, needs } = responsePaginazione.data;
                if (Array.isArray(needs)) {
                    const needConId = needs.map((needs) => ({ ...needs }));
                    setFilteredNeed((prev) => [...prev, ...needConId]);
                    setHasMore(filteredNeed.length + needConId.length < recordTot);
                } else {
                    console.error("I dati ottenuti non sono nel formato Array: ", responsePaginazione.data);
                }
            } else {
                if (Array.isArray(responsePaginazione.data)) {
                    const needConId = responsePaginazione.data.map((need) => ({ ...need }));
                    setOriginalNeed((prev) => [...prev, ...needConId]);
                    setHasMore(needConId.length >= quantita);
                } else {
                    console.error("I dati ottenuti non sono nel formato array: ", responsePaginazione.data);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
            setLoading(false);
        }
        setPagina((prevPagina) => prevPagina + 1);
    };

    

    //funzione di ricerca
    const handleRicerche = async () => {

        const isAnyFilterSet = Object.values(filtri).some((value) => value);
        if (!isAnyFilterSet) {
        return;
        }

        const filtriDaInviare = Object.fromEntries(
            Object.entries({
                ...filtri,
                pagina: 0,
                quantita: quantita,
            }).filter(([_, value]) => value !== null && value !== undefined && value !== "")
        );

        
    
        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }
    
        setLoading(true);
        try {
            const response = await ApiService.request(
                userHasRole("ADMIN") ? "ricercaNeedAdmin" : "getAllBusinessRicricercaNeedPersonalercaPersonal",
                {},
                {},
                {},
                filtriDaInviare
            );            
            const responseAzienda   = await ApiService.request("getAziendeSelect");
            const responseOwner     = await ApiService.request("getAllOwnerSelect");
            const responseTipologia = await ApiService.request("tipologiaSelect");
            const responseStato     = await ApiService.request("statoSelect");

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array; ", responseOwner.data);
            }
    
            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(responseAzienda.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseAzienda.data);
            }
    
            if (Array.isArray(responseTipologia.data)) {
                setTipologiaOptions(responseTipologia.data.map((tipologia) => ({ label: tipologia.descrizione, value: tipologia.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array; ", responseTipologia.data);
            }
    
            if (Array.isArray(responseStato.data)) {
                setStatoOptions(responseStato.data.map((stato) => ({ label: stato.descrizione, value: stato.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array; ", responseStato.data);
            }
    
            const { record, needs } = response.data;
    
            if (needs && Array.isArray(needs)) {
                setFilteredNeed(needs);
                setRecordTot(record);
                setHasMore(needs.length < record);
                setIsSearchActive(true);
                setPagina(0);
            } else {
                console.error("I dati ottenuti non contengono 'needs' come array: ", response.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero dei dati filtrati: ", error);
        } finally {
            setLoading(false);
        }
    };
    


    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri((currentFilters) => {
            const newFilters = { ...currentFilters, [name]: newValue };
            setPagina(0);
            return newFilters;
        });
    };
    


    useEffect(() => {
        const fetchDataBasedOnState = async () => {
            if (location.state?.fromDashboard) {
                sessionStorage.setItem('filtriRicercaNeed', JSON.stringify(filtri));
                await handleRicerche(filtri);
            } else {
                const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
                if (filtriSalvati) {
                    const filtriParsed = JSON.parse(filtriSalvati);
                    const isAnyFilterSet = Object.values(filtriParsed).some((value) => value);
                    
                    if (isAnyFilterSet) {
                        setFiltri(filtriParsed);
                        await handleRicerche(filtriParsed);
                    } else {
                        await fetchData();
                    }
                } else {
                    await fetchData();
                }
            }
        };
    
        fetchDataBasedOnState();
        // eslint-disable-next-line
    }, []);
    

    useEffect(() => {
        if (!location.state) {
            console.warn("Stato assente, caricamento dati standard.");
            fetchData();
        }
    }, [location.state]);



    useEffect(() => {
        sessionStorage.setItem('filtriRicercaNeed', JSON.stringify(filtri));
    }, [filtri, location.state]);

    //funzione di reset dei campi di ricerca
    const handleReset = async () => {
        setFiltri({
            descrizione: '',
            cliente: null,
            stato: null,
            tipologia: null,
            owner: null,
            azienda: null,
            keypeople: null,
        });
        setPagina(0);
        setFilteredNeed([]);
        setOriginalNeed([]);
        setHasMore(true);
        sessionStorage.removeItem('filtriRicercaNeed');
        await fetchData(true);
    };

    //funzione per cancellare il need
    const handleDelete = async (id) => {
        try {
            await ApiService.request("deleteNeed", { idNeed: id });
            await fetchData();
        } catch (error) {
            console.error("Errore durante la cancellazione: ", error);
        }
    };

    //funzione per il refresh
    const handleRefresh = async () => {
        await fetchData();
    };

    //funzione per avere il contatto da usare per le ricerche
    const handleContactChange = (contattoId) => {
        setFiltri(prev => ({ ...prev, keypeople: contattoId }));
    };

    return (
        <SchemePage>
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                <RicercaNeed
                    filtri={filtri}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    onSearch={handleRicerche}
                    tipologiaOptions={tipologiaOptions}
                    statoOptions={statoOptions}
                    ownerOptions={ownerOptions}
                    aziendaOptions={aziendaOptions}
                    skillsOptions={skillsOptions}
                    onContactChange={handleContactChange}
                />
            </Box>
            <InfiniteScroll
                dataLength={isSearchActive ? filteredNeed.length : originalNeed.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em', overflow: 'hidden' }}>
                        <CircularProgress sx={{ color: '#00B400' }} />
                    </Box>
                }
            >
                <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
                    {loading ? (
                        <>
                            {Array.from(new Array(quantita)).map((_, index) => (
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
                        (isSearchActive ? filteredNeed : originalNeed).map((need, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <NeedCardFlip
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
        </SchemePage>
    );
};

export default NeedPage;
