import React, { useState, useEffect }                   from 'react';
import axios                                            from 'axios';
import InfiniteScroll                                   from 'react-infinite-scroll-component';
import ListaNeedCard                                    from '../components/card/ListaNeedCard';
import { useLocation, useParams, useNavigate }          from 'react-router-dom';
import RicercheListaNeed                                from '../components/ricerche/RicercheListaNeed.jsx';

import { 
    Box,
    Grid,
    CircularProgress,
    Button,
    Typography,
    } from '@mui/material';

const AziendeListaNeedCard = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const { id } = params;
    const valori = location;

    const [ originalListaNeed,      setOriginalListaNeed    ] = useState([]);
    const [ loading,                setLoading              ] = useState(false);

    //stati per le ricerche
    const [ tipologiaOptions,               setTipologiaOptions         ] = useState([]);
    const [ ownerOptions,                   setOwnerOptions             ] = useState([]);
    const [ statoOptions,                   setStatoOptions             ] = useState([]);
    const [ keyPeopleOptions,               setKeyPeopleOptions         ] = useState([]);
    const [ filtri,                         setFiltri                   ] = useState(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaListaNeed');
        return filtriSalvati ? JSON.parse(filtriSalvati) : {
        owner: '',
        tipologia: '',
        stato: '',
        priorita: '',
        week: '',
        keyPeople: ''
        };
    });


    //stati per la paginazione
    const [ pagina,     setPagina   ] = useState(0);
    const [ hasMore,    setHasMore  ] = useState(true);
    const quantita = 10;


    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
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
            quantita: 10
        };
        try {
            const response              = await axios.get(`http://localhost:8080/need/react/cliente/modificato/${id}`, { headers: headers, params: filtriDaInviare });
            const responseOwner         = await axios.get("http://localhost:8080/aziende/react/owner",                 { headers: headers });
            const responseTipologia     = await axios.get("http://localhost:8080/need/react/tipologia",                { headers: headers });
            const responseStato         = await axios.get("http://localhost:8080/need/react/stato",                    { headers: headers });
            const responseKeyPeople     = await axios.get(`http://localhost:8080/keypeople/react/azienda/${id}`,       { headers: headers });

            if (Array.isArray(responseKeyPeople.data)) {
                setKeyPeopleOptions(responseKeyPeople.data.map((keyPeople) => ({ label: keyPeople.nome, value: keyPeople.id})));
            } else {
                console.error("I dati del keypeople ottenuti non sono nel formato Array; ", responseKeyPeople.data);
            }

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id})));
            } else {
                console.error("I dati ottenuti non sono nel formato Array; ", responseOwner.data);
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
                const listaNeedConId = response.data.map((need) => ({...need}));
                setOriginalListaNeed(listaNeedConId);
                setHasMore(listaNeedConId.length >= quantita);
            } else {
                console.error("I dati ottenuti non sono nel formato Array: ", response.data);
            }
            setLoading(false);
        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaListaNeed');
        if(filtriSalvati) {
            setFiltri(JSON.parse(filtriSalvati));
            handleRicerche();
        } else {
        fetchData();
        }
        // eslint-disable-next-line
    }, []);


    //caricamento dati con paginazione

    const fetchMoreData = async () => {
        const paginaSuccessiva = pagina + 1;
        const filtriAttivi = Object.values(filtri).some(value => value !== null && value !== '');

        const url = filtriAttivi ?
        "http://localhost:8080/need/react/ricerca/modificato" :
        `http://localhost:8080/need/react/cliente/modificato/${id}`;

        const filtriDaInviare = {
            owner:      filtri.owner            || null,
            tipologia:  filtri.tipologia        || null,
            stato:      filtri.stato            || null,
            priorita:   filtri.priorita         || null,
            week:       filtri.week             || null,
            keyPeople:  filtri.keyPeople        || null,
            pagina: paginaSuccessiva,
            quantita: 10
        };
        try {
            const response = await axios.get(url, { headers: headers, params: filtriDaInviare });;
            if (Array.isArray(response.data)) {
                const listaNeedConId = response.data.map((need) => ({...need}));
                setOriginalListaNeed(listaNeedConId);
                setHasMore(listaNeedConId.length >= quantita);
            } else {
                console.error("I dati ottenuti non sono nel formato Array: ", response.data);
            }
            setLoading(false);
        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };


      //funzione di ricerca
      const handleRicerche = async () => {
        const filtriDaInviare = {
            descrizione:        filtri.descrizione  || null,
            tipologia:          filtri.tipologia    || null,
            owner:              filtri.owner        || null,
            stato:              filtri.stato        || null,
            keyPeople:          filtri.keyPeople    || null,
            azienda:            id,
            pagina: 0,
            quantita: 10
        };
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/need/react/ricerca/modificato", { headers: headers, params: filtriDaInviare });

            if (Array.isArray(response.data)) {
                setOriginalListaNeed(response.data);
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

    //funzione cambiamento stato select
    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri({...filtri, [name]:newValue});
        if(name === 'descrizione' && newValue === '') {
            fetchData();
        } else {
            handleRicerche();
        }
    };

    useEffect(() => {
        const { descrizione, ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x !== null);
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [filtri.tipologia, filtri.stato, filtri.owner, filtri.keyPeople]);

    useEffect(() => {
        sessionStorage.setItem('filtriRicercaListaNeed', JSON.stringify(filtri));
      }, [filtri]);



    //funzione di reset dei campi di ricerca
    const handleReset = async () => {
        setFiltri({
            descrizione: '',
            stato: '',
            tipologia: '',
            owner: '',
            keyPeople: ''
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
        navigate(`/need/aggiungi/${id}`, { state: { denominazione: valori.state.denominazione }});
    };

    

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
            <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                marginLeft: '12.8em', 
                marginTop: '0.5em', 
                marginBottom: '0.8em', 
                marginRight: '0.8em', 
                backgroundColor: '#FEFCFD', 
                borderRadius: '20px', 
                minHeight: '98vh',
                mt: 1.5 
            }}>
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000
                }}>
                    <RicercheListaNeed
                    filtri={filtri}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    tipologiaOptions={tipologiaOptions}
                    statoOptions={statoOptions}
                    keyPeopleOptions={keyPeopleOptions}
                    ownerOptions={ownerOptions}
                    onRicerche={handleRicerche}
                    onNavigate={navigateToAggiungi}
                    />
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#00B401', display: 'flex', justifyContent: 'center', fontSize: '2em'}}>Need di {valori.state.denominazione}</Typography>
                <InfiniteScroll
                dataLength={originalListaNeed.length}
                next={fetchMoreData}
                hasMore={hasMore}
                >
                    <Grid container spacing={2} sx={{ mt: 1, mb: 4}}>
                        { loading ? (
                            <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <CircularProgress sx={{ color: '#00B401'}}/>
                            </Box>
                        ) : (
                            originalListaNeed.map((need, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <ListaNeedCard valori={need} />
                                    </Grid>
                            ))
                        )}
                    </Grid>
                </InfiniteScroll>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                >
                <Button
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
            </Button>
            </Box>

            </Box>
            
        </Box>

        
    );
};

export default AziendeListaNeedCard