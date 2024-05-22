import React, { useState, useEffect }                   from 'react';
import { useNavigate  }                                 from 'react-router-dom';
import axios                                            from 'axios';
import InfiniteScroll                                   from 'react-infinite-scroll-component';
import RicercheKeypeople                                from '../components/ricerche/RicercheKeypeople';
import KeypeopleCardFlip                                from '../components/card/KeypeopleCardFlip';

import { 
    Box,
    CircularProgress,
    Grid,
    Skeleton
    } from '@mui/material';
import SchemePage from '../components/SchemePage';


const Keypeople = () => {

    const [ originalKeypeople,   setOriginalKeypeople ] = useState([]);
    const [ loading,             setLoading           ] = useState(false);


    //stati ricerche
    const [ clienteOptions,             setClienteOptions             ] = useState([]);
    const [ ownerOptions,               setOwnerOptions               ] = useState([]);
    const [ statiOptions,               setStatiOptions               ] = useState([]);
    const [ filtri,                     setFiltri                     ] = useState(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaKeypeople');
        return filtriSalvati ? JSON.parse(filtriSalvati) : {
        nome:  null,
        azienda: null,
        stato: null,
        owner:null
        };
    });

    
    //stati per la paginazione
    const [ pagina,             setPagina       ] = useState(0);
    const [ hasMore,            setHasMore      ] = useState(false);
    const quantita = 10;


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
    
    const fetchData = async () => {

        const filtriDaInviare = {
            nome: filtri.nome || null,
            azienda: filtri.azienda || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
            pagina: 0,
            quantita: 10
        };


        setLoading(true);

        if (!userHasRole('ROLE_ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/keypeople/react/mod" : "http://localhost:8080/keypeople/react/mod/personal";
        try {
    
        const response        = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
        const responseCliente = await axios.get("http://localhost:8080/aziende/react/select",            { headers: headers });
        const responseOwner   = await axios.get("http://localhost:8080/owner",             { headers: headers });
        const responseStati   = await axios.get("http://localhost:8080/keypeople/react/stati",            { headers: headers });


        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
        } else {
            console.error("I dati dell'owner ottenuti non sono nel formato Array:", responseOwner.data);
        } 

        if (Array.isArray(responseStati.data)) {
            setStatiOptions(responseStati.data.map((stati, index) => ({ label: stati.descrizione, value: stati.id })));
        } else {
            console.error("I dati degli stati in ricerca ottenuti non sono nel formato Array:", responseStati.data);
        } 


        if (Array.isArray(responseCliente.data)) {
            setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
            console.error("I dati degli stati ottenuti non sono nel formato Array:", responseCliente.data);
        }
    
        if (Array.isArray(response.data)) {
            const keypeopleConId = response.data.map((keypeople) => ({ ...keypeople}));
            setOriginalKeypeople(keypeopleConId);
            setHasMore(keypeopleConId.length >= quantita);
        } else {
            console.error("I dati per i keypeople ottenuti non sono nel formato Array:", response.data);
        }
        setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
        }
    };
    

    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaKeypeople');
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


    //funzione per la paginazione
    const fetchMoreData = async () => {
        const paginaSuccessiva = pagina + 1;

        if (!userHasRole('ROLE_ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtri.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/keypeople/react/mod" : "http://localhost:8080/keypeople/react/mod/personal";



        const filtriDaInviare = {
            ...filtri,
            pagina: paginaSuccessiva,
            quantita: quantita
        };
        try {
            const responsePaginazione = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            if (Array.isArray(responsePaginazione.data)) {
                const keypeopleConId = responsePaginazione.data.map((keypeople) => ({...keypeople}));
                setOriginalKeypeople((prev) => [...prev, ...keypeopleConId]);
                setHasMore(responsePaginazione.data.length >= quantita);
            } else {
                console.error("I dati dei keypeople nel more ottenuti non sono nel formato Array: ", responsePaginazione.data);
            }
        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
        setPagina((prevPagina) => prevPagina + 1);
    };

    //funzione per la ricerca

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
            
                const baseUrl = userHasRole('ROLE_ADMIN') ? "http://localhost:8080/keypeople/react/ricerca/mod" : "http://localhost:8080/keypeople/react/ricerca/modpersonal";
        setLoading(true);
        try {
            const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseCliente = await axios.get("http://localhost:8080/aziende/react/select",            { headers: headers });
            const responseOwner   = await axios.get("http://localhost:8080/owner",             { headers: headers });
            const responseStati   = await axios.get("http://localhost:8080/keypeople/react/stati",            { headers: headers });

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
            } else {
                console.error("I dati di owner ricerca ottenuti non sono nel formato Array:", responseOwner.data);
            } 


            if (Array.isArray(responseStati.data)) {
                setStatiOptions(responseStati.data.map((stati, index) => ({ label: stati.descrizione, value: stati.id })));
            } else {
                console.error("I dati degli stati in ricerca ottenuti non sono nel formato Array:", responseStati.data);
            } 



            if (Array.isArray(responseCliente.data)) {
                setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
                console.error("I dati dei clienti in ricerca ottenuti non sono nel formato Array:", responseCliente.data);
            }

            if (Array.isArray(response.data)) {
                setOriginalKeypeople(response.data);
                setHasMore(response.data.length >= quantita);
            } else {
                console.error("I dati dei keypeople in ricerca ottenuti non sono nel formato Array:", response.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero dei dati filtrati:", error);
        } finally {
            setLoading(false);
        }
    };

    //funzione cambio stato select
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
                setOriginalKeypeople([]);
                setHasMore(true);
                // handleRicerche();
            }
            
            return newFilters;
        });
    };


    useEffect(() => {
        const { ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
    
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [ filtri.nome]);


    // const handleFilterChange = (name) => (event) => {
    //     const newValue = event.target.value;
    //     setFiltri(currentFilters => {
    //         const newFilters = { ...currentFilters, [name]: newValue };
    //         setPagina(0);
    //         setHasMore(true);
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
        sessionStorage.setItem('filtriRicercaKeypeople', JSON.stringify(filtri));
    }, [filtri]);
    

    //funzione di reset dei campi di ricerca

    const handleReset = async () => {
        setPagina(0);
        setOriginalKeypeople([]);
        setHasMore(true);
        await fetchData(0);
        setFiltri({
            nome: '',
            azienda: null,
            stato: null,
            owner: null
        });
    };


     //funzione per cancellare l'azienda
    const handleDelete = async (id) => {
        try{
            const responseDelete = await axios.delete(`http://localhost:8080/keypeople/react/elimina/${id}`, {headers: headers});
            await fetchData(0);
        } catch(error) {
            console.error("Errore durante la cancellazione: ", error);
        }
    };

    //funzione per il refresh
    const handleRefresh = async () => {
        await fetchData(0);
    };


    return(
       <SchemePage>
                <Box sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1000, 
                }}>
                    <RicercheKeypeople
                        filtri={filtri}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        onSearch={handleRicerche}
                        aziendaOptions={clienteOptions}
                        statiOptions={statiOptions}
                        ownerOptions={ownerOptions}
                        onRicerche={handleRicerche}
                        />
                </Box>
                <InfiniteScroll
                dataLength={originalKeypeople.length}
                next={fetchMoreData}
                hasMore={hasMore}
                // loader={'Caricamento in corso...'}
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
                        originalKeypeople.map((keypeople, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <KeypeopleCardFlip 
                                valori={keypeople}
                                statiOptions={statiOptions}
                                onDelete={() => handleDelete(keypeople.id)}
                                onRefresh={handleRefresh}
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
export default Keypeople;