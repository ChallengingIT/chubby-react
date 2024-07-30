import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import NeedCardFlip from '../components/card/NeedCardFlip';
import SchemePage from '../components/SchemePage.jsx';
import { useLocation } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
} from '@mui/material';
import NuovaRicercaNeed from '../components/nuoveRicerche/NuovaRicercaNeed.jsx';

const Need = () => {
    const location = useLocation();
    const [originalNeed, setOriginalNeed] = useState([]);
    const [filteredNeed, setFilteredNeed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recordTot, setRecordTot] = useState(0);

    //stati per le ricerche
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [aziendaOptions, setAziendaOptions] = useState([]);
    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
        return filtriSalvati ? JSON.parse(filtriSalvati) : {
            descrizione: null,
            tipologia: null,
            stato: null,
            owner: null,
            keypeople: null
        };
    });

    const quantita = 10;

    //stati per la paginazione
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const getValueLabel = (value) => {
        const option = ownerOptions.find((option) => option.value === value);
        return option ? option.label : null;
    };

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
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

        const baseUrl = userHasRole('ADMIN') ? "http://89.46.196.60:8443/need/react/modificato" : "http://89.46.196.60:8443/need/react/modificato/personal";

        try {
            const responseNeed = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://89.46.196.60:8443/owner", { headers: headers });
            const responseTipologia = await axios.get("http://89.46.196.60:8443/need/react/tipologia", { headers: headers });
            const responseStato = await axios.get("http://89.46.196.60:8443/need/react/stato", { headers: headers });

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

const baseUrl = userHasRole('ADMIN') 
        ? (isSearchActive ? "http://89.46.196.60:8443/need/react/ricerca/modificato" : "http://89.46.196.60:8443/need/react/modificato")
        : (isSearchActive ? "http://89.46.196.60:8443/need/react/ricerca/modificato/personal" : "http://89.46.196.60:8443/need/react/modificato/personal");

        const filtriDaInviare = {
            ...filtri,
            pagina: paginaSuccessiva,
            quantita: quantita
        };
        try {
            const responsePaginazione = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
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
    const handleRicerche = async (filters) => {
        const filtriDaInviare = filters ? {
            ...filters,
            pagina: 0,
            quantita: quantita
        } : {
            ...filtri,
            pagina: 0,
            quantita: quantita
        };


        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ADMIN') ? "http://89.46.196.60:8443/need/react/ricerca/modificato" : "http://89.46.196.60:8443/need/react/ricerca/modificato/personal";
        setLoading(true);
        try {
            const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://89.46.196.60:8443/owner", { headers: headers });
            const responseTipologia = await axios.get("http://89.46.196.60:8443/need/react/tipologia", { headers: headers });
            const responseStato = await axios.get("http://89.46.196.60:8443/need/react/stato", { headers: headers });

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

    // const handleFilterChange = (name) => (event) => {
    //     const newValue = event.target.value;
    //     setFiltri(currentFilters => {
    //         const newFilters = { ...currentFilters, [name]: newValue };

    //         // Controllo se tutti i filtri sono vuoti
    //         const areFiltersEmpty = Object.values(newFilters).every(value => value === null);
    //         if (areFiltersEmpty) {
    //             fetchData();
    //         } else {
    //             setPagina(0);
    //             setFilteredNeed([]);
    //             setHasMore(true);
    //             handleRicerche();
    //         }

    //         return newFilters;
    //     });
    // };



    const handleFilterChange = (newFilters) => {
        setFiltri(newFilters);
    };


    useEffect(() => {
        if (location.state?.descrizione || location.state?.clienteId) {
            const newFiltri = {
                ...filtri,
                descrizione: location.state.descrizione || filtri.descrizione,
                azienda: location.state.clienteId || filtri.azienda
            };
            setFiltri(newFiltri);
            handleRicerche(newFiltri);
        } else {
            const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
            if (filtriSalvati) {
                const filtriParsed = JSON.parse(filtriSalvati);
                setFiltri(filtriParsed);

                const isAnyFilterSet = Object.values(filtriParsed).some(value => value);
                if (isAnyFilterSet) {
                    handleRicerche(filtriParsed);
                } else {
                    fetchData();
                }
            } else {
                fetchData();
            }
        }
        // eslint-disable-next-line
    }, [location.state]);


    useEffect(() => {
        sessionStorage.setItem('filtriRicercaNeed', JSON.stringify(filtri));
    }, [filtri]);

    //funzione di reset dei campi di ricerca
    const handleReset = async () => {
        setFiltri({
            descrizione: '',
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
        await fetchData(true);
    };

    //funzione per cancellare il need
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://89.46.196.60:8443/need/react/elimina/${id}`, { headers: headers });
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
                <NuovaRicercaNeed
                    filtri={filtri}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    onSearch={handleRicerche}
                    tipologiaOptions={tipologiaOptions}
                    statoOptions={statoOptions}
                    ownerOptions={ownerOptions}
                    aziendaOptions={aziendaOptions}
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

export default Need;
