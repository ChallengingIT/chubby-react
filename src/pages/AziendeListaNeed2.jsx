import React, { useState, useEffect }                   from 'react';
import { useNavigate, useParams, useLocation  }         from 'react-router-dom';
import axios                                            from 'axios';
import SearchIcon                                       from '@mui/icons-material/Search';
import CloseIcon                                        from '@mui/icons-material/Close';
import InfiniteScroll                                   from "react-infinite-scroll-component";
import AggiungiBox                                      from '../components/AggiungiBox';   
import NeedCard                                         from '../components/card/NeedCard'; 
import RicercheNeed                                     from '../components/ricerche/RicercheNeed';   
import { 
    Box,
    Grid,
    CircularProgress,
    } from '@mui/material';

    const AziendeListaNeed2 = () => {

        const navigate              = useNavigate();
        const params                = useParams();
        const location              = useLocation();
        const { id }                = params;
        const valori                = location.state;
        

        const [ need,                   setNeed             ] = useState([]);
        const [ originalListaNeed,      setOriginalListaNeed] = useState([]);
        const [ openDialog,             setOpenDialog       ] = useState(false);
        const [ deleteId,               setDeleteId         ] = useState(null);
        const [                         setLoading          ] = useState(false);

        //stati per le ricerche
        const [ ownerOptions,               setOwnerOptions               ] = useState([]);
        const [ tipologiaOptions,           setTipologiaOptions           ] = useState([]);
        const [ statoOptions,               setStatoOptions               ] = useState([]);
        const [ filtri,                     setFiltri                     ] = useState({
            owner: '',
            tipologia: '',
            stato: '',
            priorita: '',
            week: ''
        });


        //stato per la paginazione
        const [ pagina,                 setPagina       ] = useState(0);
        const [ hasMore,                setHasMore      ] = useState(true);
    
        const quantita = 10;

        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user?.accessToken;
    
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };


        const fetchData = async () => {
            setLoading(true);
            const filtriDaInviare = {
                owner: filtri.owner || null,
                tipologia: filtri.tipologia || null,
                stato: filtri.stato || null,
                priorita: filtri.priorita || null,
                week: filtri.week || null,
                pagina: 0,
                quantita: 10
            };

            try {
                const response                  = await axios.get(`http://localhost:8080/need/react/cliente/modificato/${id}`, { headers: headers, params: filtriDaInviare });;
                const responseOwner             = await axios.get("http://localhost:8080/aziende/react/owner",                 { headers: headers});
                const responseTipologia         = await axios.get("http://localhost:8080/need/react/tipologia",                { headers: headers});
                const responseStato             = await axios.get("http://localhost:8080/need/react/stato",                    { headers: headers});
        
                    if (Array.isArray(responseStato.data)) {
                        setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
                    } else {
                        console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
                    } 
            
                    if (Array.isArray(responseTipologia.data)) {
                        setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
                    } else {
                        console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
                    } 
            
                    if (Array.isArray(responseOwner.data)) {
                        setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
                    } else {
                        console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
                    } 

                    if (Array.isArray(response.data)) {
                        const listaNeedConId = response.data.map((need) => ({...need}));
                        setOriginalListaNeed(listaNeedConId);
                        setHasMore(listaNeedConId.length >= quantita);
                    } else {
                        console.error("I dati ottenuti non sono nel formato array: ", response.data);
                    }
                    setLoading(false);
            } catch(error) {
                console.error("Errore durante il recupero dei dati: ", error);
            }
        };


        useEffect(() => {
            fetchData();
            // eslint-disable-next-line
        }, []);


        //funzione per la paginazione
        const fetchMoreData = async() => {
            const paginaSuccessiva = pagina + 1;
            const filtriDaInviare = {
                owner: filtri.owner || null,
                tipologia: filtri.tipologia || null,
                stato: filtri.stato || null,
                priorita: filtri.priorita || null,
                week: filtri.week || null,
                pagina: paginaSuccessiva,
                quantita: 10
            };

            try {
                const response                  = await axios.get(`http://localhost:8080/need/react/cliente/modificato/${id}`, { headers: headers, params: filtriDaInviare });;
                if (Array.isArray(response.data)) {
                    const listaNeedConId = response.data.map((need) => ({...need}));
                    setOriginalListaNeed((prev) => [...prev, ...listaNeedConId]);
                    setHasMore(listaNeedConId.length >= quantita);
                } else {
                    console.error("I dati ottenuti non sono nel formato array: ", response.data);
                }
                setLoading(false);
        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }   
        setPagina((prevPagina) => prevPagina + 1);
    };


    //funzione di ricerca
    const handleRicerche = async () => {
        const filtriDaInviare = {
            owner: filtri.owner || null,
            tipologia: filtri.tipologia || null,
            stato: filtri.stato || null,
            priorita: filtri.priorita || null,
            week: filtri.week || null,
            pagina: 0,
            quantita: 10
        };
        setLoading(true);
        try {
            const response = await axios.get("", { headers: headers, params: filtriDaInviare});
            if (Array.isArray(response.data)) {
                const listaNeedConId = response.data.map((need) => ({...need}));
                setOriginalListaNeed(listaNeedConId);
                setHasMore(listaNeedConId.length >= quantita);
            } else {
                console.error("I dati ottenuti non sono nel formato array: ", response.data);
            }
            setLoading(false);
    } catch(error) {
        console.error("Errore durante il recupero dei dati: ", error);
    }
    };

    //funzione cambio stato select
    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri({ ...filtri, [name]: newValue });
        if (name === 'denominazione' && newValue === '') {
            fetchData();
        } else {
            handleRicerche();
        }
    };


    useEffect(() => {
        const { descrizione, ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [filtri.tipologia, filtri.stato, filtri.owner]);


    //funzione di reset dei campi di ricerca
    const handleReset = async() => {
        setFiltri({
            descrizione: '',
            stato: ''
            owner: '',
            tipologia: '',
            priorita: '',
            week: ''
        });
        setPagina(0);
        setOriginalListaNeed([]);
        setHasMore(true);
        await fetchData(0);
    };


    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
        <Box sx={{ 
            flexGrow: 1, 
            p: 3, 
            marginLeft: '13.2em', 
            marginTop: '0.5em', 
            marginBottom: '0.8em', 
            marginRight: '0.8em', 
            backgroundColor: '#FEFCFD', 
            borderRadius: '10px', 
            minHeight: '98vh',
            mt: 1.5 
        }}>
            <Box sx={{ 
                position: 'sticky', 
                top: 0, 
                zIndex: 1000
            }}>
                <RicercheNeed
                filtri={filtri}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                tipologiaOptions={tipologiaOptions}
                statoOptions={statoOptions}
                ownerOptions={ownerOptions}
                onRicerche={handleRicerche}
                />
                </Box>
                    <InfiniteScroll
                    dataLength={originalListaNeed.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={'Caricamento in corso...'}
                    >

                        {/* Main Content Area */}
            <Grid container spacing={2} sx={{ mt: 1, mb: 4}}>
                { loading ? (
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <CircularProgress sx={{ color: '#00853C'}}/> 
                    </Box>
                ) : (
                    originalListaNeed.map((aziende, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <NeedCard
                            valori={aziende}
                            />
                        </Grid>
                    ))
                )
                }
                </Grid>
                </InfiniteScroll>
                </Box>
                </Box>
    );
    };
    export default AziendeListaNeed2;