import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import NeedCardFlip from '../components/card/NeedCardFlip';
import SchemePage from '../components/SchemePage.jsx';
import { useLocation } from 'react-router-dom';
import Tabella from '../components/Tabella';

import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
    Tabs,
    Tab
} from '@mui/material';
import NuovaRicercaNeed from '../components/nuoveRicerche/NuovaRicercaNeed.jsx';
import { useTranslation }                   from "react-i18next"; 


const Need = () => {

    const { t } = useTranslation(); 
    
    const location = useLocation();
    const [originalNeed, setOriginalNeed] = useState([]);
    const [filteredNeed, setFilteredNeed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recordTot, setRecordTot] = useState(0);
    const [viewMode, setViewMode] = useState('cards');
    const [selectedNeed, setSelectedNeed] = useState(null);
    const [righeTot, setRigheTot] = useState(0);
    
    

    //stati per le ricerche
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [aziendaOptions, setAziendaOptions] = useState([]);
    const [skillsOptions,      setSkillsOptions        ] = useState([]);

    

    const getInitialFilters = () => {
        if (location.state?.fromDashboard) {
            return {
                descrizione: location.state.descrizione || null,
                cliente: location.state.clienteId || null,
                tipologia: null,
                stato: null,
                owner: null,
                keypeople: null,
                skills: null,
                location: null
            };
        } else {
            const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');
            return filtriSalvati ? JSON.parse(filtriSalvati) : {
                descrizione: null,
                cliente: null,
                tipologia: null,
                stato: null,
                owner: null,
                keypeople: null,
                skills: null,
                location: null
            };
        }
    };

    const [filtri, setFiltri] = useState(getInitialFilters);
    

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


    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const responseNeedSkills = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
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
    const fetchData = async (reset = false, paginaParam = 0) => {
        setLoading(true);

        const filtriDaInviare = {
            pagina: paginaParam,
            quantita: 10
        };
        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ADMIN') ? "http://localhost:8080/need/react/modificato" : "http://localhost:8080/need/react/modificato/personal";

        try {
            const responseNeed = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://localhost:8080/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://localhost:8080/owner", { headers: headers });
            const responseTipologia = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers });
            const responseStato = await axios.get("http://localhost:8080/need/react/stato", { headers: headers });


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

            if (Array.isArray(responseNeed.data?.needs)) {
                const needConId = responseNeed.data?.needs.map((need) => ({ ...need }));
                setOriginalNeed(needConId);
                setHasMore(needConId.length >= quantita);
                setRigheTot(responseNeed.data?.record || 0);
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
    const fetchMoreData = async ( paginaParam = 0) => {
        const paginaSuccessiva = pagina + 1;

        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtri.username = userObj.username;
            }
        }

const baseUrl = userHasRole('ADMIN') 
        ? (isSearchActive ? "http://localhost:8080/need/react/ricerca/modificato" : "http://localhost:8080/need/react/modificato")
        : (isSearchActive ? "http://localhost:8080/need/react/ricerca/modificato/personal" : "http://localhost:8080/need/react/modificato/personal");

        const filtriDaInviare = {
            descrizione: filtri.descrizione || null,
            azienda: filtri.cliente || null,
            tipologia: filtri.tipologia || null,
            stato: filtri.stato || null,
            owner: filtri.owner || null,
            keypeople: filtri.keypeople || null,
            // skills: filtri.skills ? JSON.stringify(filtri.skills) : null,  
            location: filtri.location || null,
            pagina: paginaParam || paginaSuccessiva,
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
                if (Array.isArray(responsePaginazione.data?.needs)) {
                    const needConId = responsePaginazione.data?.needs.map((need) => ({ ...need }));
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
    const handleRicerche = async (filtriParam,  paginaParam = 0) => {

        const isAnyFilterSet = Object.values(filtri).some((value) => value);
        if (!isAnyFilterSet) {
        return;
        }
        const filtriDaInviare = {
            descrizione:        filtri.descrizione          || null,
            azienda:            filtri.cliente          || null,
            tipologia:          filtri.tipologia || null,
            stato:              filtri.stato || null,
            owner:              filtri.owner || null,
            keypeople:          filtri.keypeople || null,
            // skills: filtri.skills ? JSON.stringify(filtri.skills) : null,  
            location:           filtri.location || null,
            pagina: paginaParam,
            quantita: quantita
        };

        
    
        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }
    
        const baseUrl = userHasRole('ADMIN') ? "http://localhost:8080/need/react/ricerca/modificato" : "http://localhost:8080/need/react/ricerca/modificato/personal";
        setLoading(true);
        try {
            const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseAzienda = await axios.get("http://localhost:8080/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://localhost:8080/owner", { headers: headers });
            const responseTipologia = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers });
            const responseStato = await axios.get("http://localhost:8080/need/react/stato", { headers: headers });
    
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
                setRigheTot(record);
                setHasMore(needs.length < record);
                setIsSearchActive(true);
                setPagina(paginaParam);
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
    


// useEffect(() => {
//     if (location.state?.fromDashboard) {
//         const nuoviFiltri = {
//             descrizione: location.state.descrizione || null,
//             cliente: location.state.clienteId || null,
//             tipologia: null,
//             stato: null,
//             owner: null,
//             keypeople: null,
//             skills: null,
//             location: null
//         };
//         setFiltri(nuoviFiltri);
//         sessionStorage.setItem('filtriRicercaNeed', JSON.stringify(nuoviFiltri));
        
//         handleRicerche(nuoviFiltri); 
//     } else {
//         const filtriSalvati = sessionStorage.getItem('filtriRicercaNeed');

//         if (filtriSalvati) {
//             const filtriParsed = JSON.parse(filtriSalvati);
//             const isAnyFilterSet = Object.values(filtriParsed).some((value) => value);

//             if (isAnyFilterSet) {
//                 setFiltri(filtriParsed);
//                 handleRicerche(filtriParsed);
//             } else {
//                 fetchData(true, 0);
//             }
//         } else {
//             fetchData(true, 0);
//         }
//     }
// }, []);


    // useEffect(() => {
    //     if (!location.state) {
    //         console.warn("Stato assente, caricamento dati standard.");
    //         fetchData();
    //     }
    // }, [location.state]);



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
            await axios.delete(`http://localhost:8080/need/react/elimina/${id}`, { headers: headers });
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


    // const handlePageChange = (newPage) => {
    //     setPagina(newPage);
    //     sessionStorage.setItem("paginaRecruiting", newPage);
    
    //     if (Object.values(filtri).some(value => value)) {
    //         handleRicerche(filtri, newPage);
    //     } else {
    //         fetchData(newPage);
    //     }
    // };

    const handlePageChange = (newPage) => {
        setPagina(newPage);
        sessionStorage.setItem("paginaNeed", newPage);
    
        if (Object.values(filtri).some(value => value)) {
            handleRicerche(filtri, newPage);
        } else {
            fetchData(false, newPage);       
        }
    };
    


    const columns = [
        {
            field: "descrizione",
            headerName: "Descrizione",
            flex: 1.3,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "progressivo",
            headerName: t("#Numero"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            },
        {
            field: "location",
            headerName: t("Location"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "tipologia",
            headerName: t("Tipologia"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.tipologia && params.row?.tipologia?.descrizione
                ? params.row?.tipologia?.descrizione
                : "N/A"}
            </div>
            ),
        },
        {
            field: "priorita",
            headerName: t("Priorità"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "stato",
            headerName: t("Stato"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.stato && params.row?.stato?.descrizione
                ? params.row?.stato?.descrizione
                : "N/A"}
            </div>
            ),
        },
        {
            field: "ownerBusiness",
            headerName: t("Owner business"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.ownerBusiness && params.row?.ownerBusiness?.descrizione
                ? params.row?.ownerBusiness?.descrizione
                : "N/A"}
            </div>
            ),
        },
        {
            field: "ownerRecruiter",
            headerName: t("Owner recruiter"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.ownerRecruiter && params.row?.ownerRecruiter?.descrizione
                ? params.row?.ownerRecruiter?.descrizione
                : "N/A"}
            </div>
            ),
        },
    ];


    // useEffect(() => {
    //     setPagina(0);
    //     setOriginalNeed([]);
    //     setFilteredNeed([]);
    //     setHasMore(true);
    //     fetchData(true, 0);
    // }, [viewMode]);
    
    
    

    return (
        <SchemePage>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
                <Tab label="Card" value="cards" />
                <Tab label="Tabella" value="table" />
            </Tabs>
            </Box>
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
                    skillsOptions={skillsOptions}
                    onContactChange={handleContactChange}
                />
            </Box>
            {viewMode === 'cards' ? (
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
                Array.from(new Array(quantita)).map((_, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ marginRight: 2, marginBottom: 2 }}>
                            <Skeleton variant="rectangular" width="100%" height={118} />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </Box>
                    </Grid>
                ))
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
) : viewMode === 'table' ? (
    <Box sx={{ height: '80vh', position: 'relative'}}>
    <Tabella
        data={isSearchActive ? filteredNeed : originalNeed}
        columns={columns}
        title={t("Need")}
        getRowId={(row) => row.id}
        pagina={pagina}
        quantita={quantita}
        righeTot={righeTot}
        loading={loading}
        onPageChange={handlePageChange}
        onRowClick={(row) => {
            setSelectedNeed(row);
            setViewMode("cardSingola");
        }}
    />
    {loading && (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress sx={{ color: '#00B400' }} />
        </Box>
    )}
    </Box>
) : viewMode === 'cardSingola' && selectedNeed ? (
    <Box sx={{ mt: 2, width: '50%' }}>
        <NeedCardFlip
            valori={selectedNeed?.row}
            statoOptions={statoOptions}
            onDelete={() => handleDelete(selectedNeed.id)}
            onRefresh={handleRefresh}
            isFirstCard={true}
        />
    </Box>
) : null}

        </SchemePage>
    );
};

export default Need;
