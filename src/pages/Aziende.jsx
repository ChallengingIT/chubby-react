import React, { useState, useEffect }                   from 'react';
import axios                                            from 'axios';
import AziendeCard                                      from '../components/card/AziendeCard';
import InfiniteScroll                                   from "react-infinite-scroll-component";
import RicercheAziende                                  from '../components/ricerche/RicercheAziende';    

import { 
    Box,
    Grid,
    Skeleton
    } from '@mui/material';
import ProvaCardFlip from '../components/card/ProvaCardFlip';


const Aziende = () => {

    const [ originalAziende,   setOriginalAziende ] = useState([]);
    const [ loading,           setLoading         ] = useState(false);


    //stati ricerche
    // const [ clienteOptions,             setClienteOptions             ] = useState([]);
    const [ ownerOptions,               setOwnerOptions               ] = useState([]);
    const [ provinceOptions,            setProvinceOptions            ] = useState([]);


    const getValueLabel = (value) => {
        const option = ownerOptions.find((option) => option.value === value);
        return option ? option.label : null;
      };
      

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = localStorage.getItem('filtriRicercaAziende');
        if (filtriSalvati) {
          const filtriParsed = JSON.parse(filtriSalvati);
          if (filtriParsed.owner) {
            filtriParsed.ownerLabel = getValueLabel(filtriParsed.owner);
          }
          return filtriParsed;
        }
        return {
          denominazione: '',
          tipologia: '',
          stato: '',
          owner: '',
          ownerLabel: '', 
        };
      });
      
    

    //stato paginazione
    const [ pagina,                 setPagina       ] = useState(0);
    const [ hasMore,                setHasMore      ] = useState(true);

    const quantita = 10;


    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };



    const fetchData = async() => {
        setLoading(true);
        const filtriDaInviare = {
            ragione: filtri.denominazione || null,
            tipologia: filtri.tipologia || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
            pagina: 0,
            quantita: 10,
        };
            try {
            const responseAziende   = await axios.get("http://localhost:8080/aziende/react/mod",     { headers: headers , params: filtriDaInviare });
            // const responseCliente   = await axios.get("http://localhost:8080/aziende/react/select",  { headers });
            const responseOwner     = await axios.get("http://localhost:8080/aziende/react/owner",   { headers: headers });
            const provinceResponse = await axios.get("http://localhost:8080/aziende/react/province", { headers: headers });

            if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
            } 
            if (Array.isArray(provinceResponse.data)) {
                const provinceOptions = provinceResponse.data.map((province) => ({
                    label: province.nomeProvince,
                    value: province.nomeProvince,
                }));
                setProvinceOptions(provinceOptions);
    
    
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", provinceResponse.data);
            }
        
            if (Array.isArray(responseAziende.data)) {
                const aziendeConId = responseAziende.data
                .map((aziende) => ({ ...aziende }));
                setOriginalAziende(aziendeConId);
                setHasMore(aziendeConId.length >= quantita); 
                // setPagina(pagina + 1);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
            }
            setLoading(false);
            } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            }
        };


        useEffect(() => {
            const filtriSalvati = localStorage.getItem('filtriRicercaAziende');
            if (filtriSalvati) {
                setFiltri(JSON.parse(filtriSalvati));
                handleRicerche();
            } else {
            fetchData();
            }
            // eslint-disable-next-line
        }, []); 

        //funzione per la paginazione
        const fetchMoreData = async () => {
            const paginaSuccessiva = pagina + 1;

            const filtriAttivi = Object.values(filtri).some(value => value !== null && value !== '');

            const url = filtriAttivi ?
            "http://localhost:8080/aziende/react/ricerca/mod" :
            "http://localhost:8080/aziende/react/mod";

            const filtriDaInviare = {
                ragione: filtri.denominazione || null,
                tipologia: filtri.tipologia || null,
                owner: filtri.owner || null,
                stato: filtri.stato || null,
                pagina: paginaSuccessiva,
                quantita: quantita
            };
            try {
                const responsePaginazione   = await axios.get(url,     { headers: headers , params: filtriDaInviare });
                if (Array.isArray(responsePaginazione.data)) {
                    const aziendeConId = responsePaginazione.data
                    .map((aziende) => ({ ...aziende }));
                    setOriginalAziende((prev) => [...prev, ...aziendeConId]);
                    setHasMore(responsePaginazione.data.length >= quantita);  
                    } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responsePaginazione.data);
                }
                setLoading(false);
                } catch (error) {
                console.error("Errore durante il recupero dei dati:", error);
                }
                setPagina((prevPagina) => prevPagina + 1);
            };

            //funzione di ricerca
            const handleRicerche = async () => {
        
                const filtriDaInviare = {
                    ragione: filtri.denominazione || null,
                    tipologia: filtri.tipologia || null,
                    owner: filtri.owner || null,
                    stato: filtri.stato || null,
                    pagina: 0,
                    quantita: quantita
                };
                setLoading(true);     
                try {
                    const response          = await axios.get("http://localhost:8080/aziende/react/ricerca/mod", { headers: headers, params: filtriDaInviare });
                    const responseOwner     = await axios.get("http://localhost:8080/aziende/react/owner",   { headers });

                    if (Array.isArray(responseOwner.data)) {
                    setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
                    } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
                    } 
        
                    if (Array.isArray(response.data)) {
                        setOriginalAziende(response.data);
                        setHasMore(response.data.length >= quantita); 
                        } else {
                        console.error("I dati ottenuti non sono nel formato Array:", response.data);
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
                setFiltri({ ...filtri, [name]: newValue });
                
                if (name === 'denominazione' && newValue === '') {
                    fetchData();
                } else {
                    handleRicerche();
                }
            };

            useEffect(() => {
                const { denominazione, ...otherFilters } = filtri;
                const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
            
                if (filtriHasValues) {
                    handleRicerche();
                }
            }, [filtri.tipologia, filtri.stato, filtri.owner]);


            useEffect(() => {
                localStorage.setItem('filtriRicercaAziende', JSON.stringify(filtri));
            }, [filtri]);


            

            //funzione di reset dei campi di ricerca
            const handleReset = async() => {
                setFiltri({
                    denominazione: '',
                    stato: '',
                    owner:'',
                    tipologia:''
                });
                setPagina(0);
                setOriginalAziende([]);
                setHasMore(true);
        
                await fetchData(0);
                };



        //funzione per cancellare l'azienda
        const handleDelete = async (id) => {
            try{
                const responseDelete = await axios.delete(`http://localhost:8080/aziende/react/elimina/${id}`, {headers: headers});
                await fetchData(0);
            } catch(error) {
                console.error("Errore durante la cancellazione: ", error);
            }
        };


        //funzione per il refresh
        const handleRefresh = async () => {
        await fetchData(0);
        };



        const tipologiaOptions = [
            { label: "Cliente", value: "CLIENTE" },
            { label: "Prospect", value: "PROSPECT" },
            { label: "Ex cliente", value: "EXCLIENTE" }
        ];

        const statoOptions = [
            { label: 'Caldo', value: '1' },
            { label: 'Tiepido', value:'2'},
            { label: 'Freddo', value: '3' }
        ];


    return(
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
                    <RicercheAziende
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
                        dataLength={originalAziende.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={'Caricamento in corso...'}
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
                        originalAziende.map((aziende, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <AziendeCard
                                valori={aziende}
                                onDelete={() => handleDelete(aziende.id)}
                                onRefresh={handleRefresh}


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
export default Aziende;