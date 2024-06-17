import React, { useState, useEffect }                   from 'react';
import axios                                            from 'axios';
import InfiniteScroll                                   from 'react-infinite-scroll-component';
import RicercheNeed                                     from '../components/ricerche/RicercheNeed';
import NeedCardFlip                                     from '../components/card/NeedCardFlip';
import SchemePage                                       from '../components/SchemePage.jsx';
    import AddIcon                                          from '@mui/icons-material/Add'; //bottone per chatgpt
    import GptChat                                          from '../components/GptChat';

import { 
    Box,
    CircularProgress,
    Grid,
    Skeleton,
        Fab,
    Popover,
    } from '@mui/material';

    const Need = () => {

        const [ originalNeed,              setOriginalNeed          ] = useState([]);
        const [ loading,                   setLoading               ] = useState(false);
        const [                            setAlert                 ] = useState(false);

        
        //stati per le ricerche
        const [ tipologiaOptions,               setTipologiaOptions         ] = useState([]);
        const [ ownerOptions,                   setOwnerOptions             ] = useState([]);
        const [ statoOptions,                   setStatoOptions             ] = useState([]);
        const [ aziendaOptions,                 setAziendaOptions           ] = useState([]);
        const [ filtri,                         setFiltri                   ] = useState(() => {
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
        const [ pagina,                 setPagina           ] = useState(0);
        const [ hasMore,                setHasMore          ] = useState(true);


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
    const id = open ? 'simple-popover' : undefined;

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
        const fetchData = async ()  => {
            setLoading(true);

            const filtriDaInviare = {
                pagina: 0,
                quantita: 10
            };
            if (!userHasRole('ROLE_ADMIN')) {
                const userString = sessionStorage.getItem('user');
                if (userString) {
                    const userObj = JSON.parse(userString);
                    filtriDaInviare.username = userObj.username;
                }
            }
    
            const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/need/react/modificato" : "http://localhost:8080/need/react/modificato/personal";

            try {
            const responseNeed          = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseAzienda       = await axios.get("http://localhost:8080/aziende/react/select",          { headers: headers });
            const responseOwner         = await axios.get("http://localhost:8080/owner",                         { headers: headers });
            const responseTipologia     = await axios.get("http://localhost:8080/need/react/tipologia",          { headers: headers });
            const responseStato         = await axios.get("http://localhost:8080/need/react/stato",              { headers: headers });


            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id})));
            } else {
                console.error("I dati ottenuti dalla chiamata degli owner non sono nel formato Array; ", responseOwner.data);
            }

            if (Array.isArray(responseAzienda.data)) {
                setAziendaOptions(responseAzienda.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
            } else {
                console.error("I dati ottenuti dalla chiamata delle aziendenon sono nel formato Array:", responseAzienda.data);
            }

            if (Array.isArray(responseTipologia.data)) {
                setTipologiaOptions(responseTipologia.data.map((tipologia) => ({ label: tipologia.descrizione, value: tipologia.id})));
            } else {
                console.error("I dati ottenuti dalla chiamata delle tipologie non sono nel formato Array; ", responseTipologia.data);
            }

            if (Array.isArray(responseStato.data)) {
                setStatoOptions(responseStato.data.map((stato) => ({ label: stato.descrizione, value: stato.id})));
            } else {
                console.error("I dati ottenuti dalla chiamata degli stati non sono nel formato Array; ", responseStato.data);
            }
            if (Array.isArray(responseNeed.data)) {
                const needConId = responseNeed.data.map((need) => ({...need}));
                // const sortedNeed = needConId.sort((a, b) => b.id - a.id);

                setOriginalNeed(needConId);
                setHasMore(needConId.length >= quantita);

            } else {
                console.error("I dati ottenuti dalla chiamata dei need non sono nel formato Array; ", responseNeed.data);
            }
            setLoading(false);
            } catch(error) {
                console.error("Errore durante il recupero dei dati: ", error);
            }
        };


            useEffect(() => {
                const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
                if (filtriSalvati) {
                const filtriParsed = JSON.parse(filtriSalvati);
                setFiltri(filtriParsed);
                
                const isAnyFilterSet = Object.values(filtriParsed).some(value => value);
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

            if (!userHasRole('ROLE_ADMIN')) {
                const userString = sessionStorage.getItem('user');
                if (userString) {
                    const userObj = JSON.parse(userString);
                    filtri.username = userObj.username;
                }
            }
    
            const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/need/react/modificato" : "http://localhost:8080/need/react/modificato/personal";

            const filtriDaInviare = {
                ...filtri,
                pagina: paginaSuccessiva,
                quantita: quantita
            };
            try {
                const responsePaginazione = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
                if (Array.isArray(responsePaginazione.data)) {
                    const needConId = responsePaginazione.data.map((need) => ({...need }));
                    setOriginalNeed((prev) => [...prev, ...needConId]);
                    setHasMore(needConId.length >= quantita);
                } else {
                    console.error("I dati ottenuti non sono nel formato array: ", responsePaginazione.data);
                }
                setLoading(false);
            } catch(error) {
                console.error("Errore durante il recupero dei dati: ", error);
            }
            setPagina((prevPagina) => prevPagina + 1);
        };


        //funzione di ricerca
        const handleRicerche = async () => {
            const isAnyFilterSet = Object.values(filtri).some(value => value);
                if (!isAnyFilterSet) {
                    return; 
                }
            
                const filtriDaInviare = {
                    ...filtri,
                    pagina: 0,
                    quantita: quantita
                };
            
                if (!userHasRole('ROLE_ADMIN')) {
                    const userString = sessionStorage.getItem('user');
                    if (userString) {
                        const userObj = JSON.parse(userString);
                        filtriDaInviare.username = userObj.username;
                    }
                }
            
                const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/need/react/ricerca/modificato" : "http://localhost:8080/need/react/ricerca/modificato/personal";
            setLoading(true);
            try {
                const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
                const responseAzienda       = await axios.get("http://localhost:8080/aziende/react/select",          { headers: headers });
                const responseOwner         = await axios.get("http://localhost:8080/owner",           { headers: headers });
                const responseTipologia     = await axios.get("http://localhost:8080/need/react/tipologia",          { headers: headers });
                const responseStato         = await axios.get("http://localhost:8080/need/react/stato",              { headers: headers });


                if (Array.isArray(responseOwner.data)) {
                    setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id})));
                } else {
                    console.error("I dati ottenuti non sono nel formato Array; ", responseOwner.data);
                }

                if (Array.isArray(responseAzienda.data)) {
                    setAziendaOptions(responseAzienda.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
                } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responseAzienda.data);
                }

                if (Array.isArray(responseTipologia.data)) {
                    setTipologiaOptions(responseTipologia.data.map((tipologia) => ({ label: tipologia.descrizione, value: tipologia.id})));
                } else {
                    console.error("I dati ottenuti non sono nel formato Array; ", responseTipologia.data);
                }

                if (Array.isArray(responseStato.data)) {
                    setStatoOptions(responseStato.data.map((stato) => ({ label: stato.descrizione, value: stato.id})));
                } else {
                    console.error("I dati ottenuti non sono nel formato Array; ", responseStato.data);
                }

                if (Array.isArray(response.data)) {
                    setOriginalNeed(response.data);
                    setHasMore(response.data.length >= quantita);
                } else {
                    console.error("I dati ottenuti non sono nel formato Array: ", response.data);
                }
            } catch(error) {
                console.error("Errore durante il recupero dei dati filtrati: ", error);
            } finally {
                setLoading(false);
            }
        };

const handleFilterChange = (name) => (event) => {
    const newValue = event.target.value;
    setFiltri(currentFilters => {
        const newFilters = { ...currentFilters, [name]: newValue };
        
        // Controllo se tutti i filtri sono vuoti 
        const areFiltersEmpty = Object.values(newFilters).every(value => value === null);
        if (areFiltersEmpty) {
            fetchData();
        } else {
            setPagina(0);
            setOriginalNeed([]);
            setHasMore(true);
            // handleRicerche();
        }
        
        return newFilters;
    });
};

        useEffect(() => {
            const { ...otherFilters } = filtri;
            const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x !== null);
            if (filtriHasValues) {
                handleRicerche();
            } else {
                fetchData();
            }
        }, [filtri.descrizione]);


            // const handleFilterChange = (name) => (event) => {
            //     const newValue = event.target.value;
            //     setFiltri(currentFilters => {
            //         const newFilters = { ...currentFilters, [name]: newValue };
            //         setPagina(0);
            //         return newFilters;
            //     });
            // };
            
            
            // useEffect(() => {
            //     // Controllo se tutti i filtri sono vuoti 
            //     const areFiltersEmpty = Object.values(filtri).every(value => value === null || value === '');
            //     if (areFiltersEmpty) {
            //         fetchData();
            //     } else {
            //         handleRicerche();
            //     }
            // }, [filtri, pagina]);

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
            setOriginalNeed([]);
            setHasMore(true);
            await fetchData(0);
        };

        //funzione per cancellare il need
        const handleDelete = async (id) => {
            try{
                const responseDelete = await axios.delete(`http://localhost:8080/need/react/elimina/${id}`, {headers: headers});
                await fetchData(0);
            } catch(error) {
                console.error("Errore durante la cancellazione: ", error);
            }
        };


        //funzione per il refresh
        const handleRefresh = async () => {
            await fetchData(0);
        };

        //funzione per avere il contatto da usare per le ricerche
        const handleContactChange = (contattoId) => {
            setFiltri(prev => ({ ...prev, keypeople: contattoId }));
        };

        return(
            <SchemePage>
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
                <Box sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1000, 
                }}>
                    <RicercheNeed 
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
                    dataLength={originalNeed.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em', overflow: 'hidden' }}>
                        <CircularProgress sx={{ color: '#00B400' }} />
                        </Box>
                    }
                    >
                                {/* Main Content Area */}
                    <Grid container spacing={2} sx={{ mt: 1, mb: 4}}>

                        { loading ? (
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
                            originalNeed.map((need, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <NeedCardFlip valori={need}
                                    statoOptions={statoOptions}
                                    onDelete={() => handleDelete(need.id)}
                                    onRefresh={handleRefresh}
                                    isFirstCard={index === 0}

                                    />
                                </Grid>
                            ))
                        )
                        }
                        </Grid>
                        </InfiniteScroll>
                        </SchemePage>
        );
    };
    export default Need;