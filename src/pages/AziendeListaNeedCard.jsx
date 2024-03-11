import React, { useState, useEffect }                   from 'react';
import axios                                            from 'axios';
// import BusinessCenterIcon                               from '@mui/icons-material/BusinessCenter'; //aziende
import InfiniteScroll                                   from 'react-infinite-scroll-component';
import RicercheNeed from '../components/ricerche/RicercheNeed';
import ListaNeedCard from '../components/card/ListaNeedCard';
import { useLocation, useParams } from 'react-router-dom';

import { 
    Box,
    Grid,
    CircularProgress,
    Button,
    } from '@mui/material';

const AziendeListaNeedCard = () => {

    const location = useLocation();
    const params = useParams();

    const { id } = params;


    const [ originalListaNeed,      setOriginalListaNeed    ] = useState([]);
    const [ loading,                setLoading              ] = useState(false);



    //stati per le ricerche
    const [ filtri,                     setFiltri                     ] = useState({
        owner: '',
        tipologia: '',
        stato: '',
        priorita: '',
        week: ''
    });


    //stati per la paginazione
    const [ pagina,     setPagina   ] = useState(0);
    const [ hasMore,    setHasMore  ] = useState(true);
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
            const response = await axios.get(`http://localhost:8080/need/react/cliente/modificato/${id}`, { headers: headers, params: filtriDaInviare });;
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
        fetchData();
        // eslint-disable-next-line
    }, []);



    //caricamento dati con paginazione

    const fetchMoreData = async () => {
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
            const response = await axios.get(`http://localhost:8080/need/react/cliente/modificato/${id}`, { headers: headers, params: filtriDaInviare });;
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


    const handleGoBack = () => {
        window.history.back();
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
                                <CircularProgress sx={{ color: '#00853C'}}/>
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