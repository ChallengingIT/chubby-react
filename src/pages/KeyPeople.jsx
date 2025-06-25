import React, { useState, useEffect }       from 'react';
import axios                                from 'axios';
import InfiniteScroll                       from 'react-infinite-scroll-component';
import KeypeopleCardFlip                    from '../components/card/KeypeopleCardFlip';
import Tabella                              from '../components/Tabella';
import SchemePage                           from '../components/SchemePage';
import NuovaRicercaKeypeople                from '../components/nuoveRicerche/NuovaRicercaKeypeople';
import { useTranslation }                   from "react-i18next"; 
import InfoOutlinedIcon                     from "@mui/icons-material/InfoOutlined";
import CircleIcon                           from '@mui/icons-material/Circle';
import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
    Tabs,
    Tab,
    Tooltip,
    IconButton,
    Dialog, 
    DialogTitle, 
    DialogContent
} from '@mui/material';



const Keypeople = () => {

    const { t } = useTranslation(); 
    
    
    const [originalKeypeople, setOriginalKeypeople] = useState([]);
    const [filteredKeypeople, setFilteredKeypeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [selectedKeypeople, setSelectedKeypeople] = useState(null);

    //stati ricerche
    const [clienteOptions, setClienteOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statiOptions, setStatiOptions] = useState([]);
    const [recordTot, setRecordTot] = useState(0);

    //stati per la tabella
    const [righeTot, setRigheTot] = useState(0);
    

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem('filtriRicercaKeypeople');
        return filtriSalvati ? JSON.parse(filtriSalvati) : {
            nome: null,
            azienda: null,
            stato: null,
            owner: null
        };
    });

    //stati per la paginazione
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const quantita = 10;
    const [isSearchActive, setIsSearchActive] = useState(false);

    //stati per la modale dell'icona info
    const [openModalStato, setOpenModalStato] = useState(false);
    const handleOpenModalStato = () => setOpenModalStato(true);
    const handleCloseModalStato = () => setOpenModalStato(false);



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

    const fetchData = async (reset = false, paginaParam = 0) => {
        setLoading(true);
        const filtriDaInviare = {
            nome: filtri.nome || null,
            azienda: filtri.azienda || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
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

        const baseUrl = userHasRole('ADMIN') ? "http://89.46.196.60:8443/keypeople/react/mod" : "http://89.46.196.60:8443/keypeople/react/mod/personal";
        try {
            const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseCliente = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://89.46.196.60:8443/owner", { headers: headers });
            const responseStati = await axios.get("http://89.46.196.60:8443/keypeople/react/stati", { headers: headers });

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id })));
            } else {
                console.error("I dati dell'owner ottenuti non sono nel formato Array:", responseOwner.data);
            }

            if (Array.isArray(responseStati.data)) {
                setStatiOptions(responseStati.data.map((stati) => ({ label: stati.descrizione, value: stati.id })));
            } else {
                console.error("I dati degli stati in ricerca ottenuti non sono nel formato Array:", responseStati.data);
            }

            if (Array.isArray(responseCliente.data)) {
                setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
                console.error("I dati degli stati ottenuti non sono nel formato Array:", responseCliente.data);
            }

            if (Array.isArray(response.data?.keyPeoples)) {
                const keypeopleConId = response.data?.keyPeoples.map((keypeople) => ({ ...keypeople }));
                setOriginalKeypeople(keypeopleConId);
                setHasMore(keypeopleConId.length >= quantita);
                setRigheTot(response.data?.record || 0);
                if (reset) {
                    setFilteredKeypeople([]);
                    setIsSearchActive(false);
                }
            } else {
                console.error("I dati per i keypeople ottenuti non sono nel formato Array:", response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            setLoading(false);
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

    const fetchMoreData = async ( paginaParam = 0) => {
        const paginaSuccessiva = pagina + 1;

        const filtriDaInviare = {
            ...filtri,
            pagina: paginaParam || paginaSuccessiva,
            quantita: quantita,
        };

        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ADMIN')
            ? (isSearchActive ? "http://89.46.196.60:8443/keypeople/react/ricerca/mod" : "http://89.46.196.60:8443/keypeople/react/mod")
            : (isSearchActive ? "http://89.46.196.60:8443/keypeople/react/ricerca/mod/personal" : "http://89.46.196.60:8443/keypeople/react/mod/personal");

        try {
            const responsePaginazione = await axios.get(baseUrl, {
                headers: headers,
                params: filtriDaInviare,
            });

            if (isSearchActive) {
                const { record, keyPeoples } = responsePaginazione.data;

                if (Array.isArray(keyPeoples)) {
                    const keypeopleConId = keyPeoples.map((keypeople) => ({ ...keypeople }));
                    setFilteredKeypeople((prev) => [...prev, ...keypeopleConId]);
                    setHasMore(filteredKeypeople.length + keypeopleConId.length < recordTot);
                } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responsePaginazione.data);
                }
            } else {
                if (Array.isArray(responsePaginazione.data?.keyPeoples)) {
                    const keypeopleConId = responsePaginazione.data?.keyPeoples.map((keypeople) => ({ ...keypeople }));
                    setOriginalKeypeople((prev) => [...prev, ...keypeopleConId]);
                    setHasMore(keypeopleConId.length >= quantita);
                } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responsePaginazione.data);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            setLoading(false);
        }
        setPagina((prevPagina) => prevPagina + 1);
    };

    //funzione per la ricerca
    const handleRicerche = async (filtriParam, paginaParam = 0) => {
        const isAnyFilterSet = Object.values(filtri).some(value => value);
        if (!isAnyFilterSet) {
            setIsSearchActive(false);
            return;
        }

        const filtriDaInviare = {
            ...filtri,
            pagina: paginaParam,
            quantita: quantita,
        };

        if (!userHasRole('ADMIN')) {
            const userString = sessionStorage.getItem('user');
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole('ADMIN')
            ? "http://89.46.196.60:8443/keypeople/react/ricerca/mod"
            : "http://89.46.196.60:8443/keypeople/react/ricerca/mod/personal";

        setLoading(true);
        try {
            const response = await axios.get(baseUrl, { headers: headers, params: filtriDaInviare });
            const responseCliente = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });
            const responseOwner = await axios.get("http://89.46.196.60:8443/owner", { headers: headers });
            const responseStati = await axios.get("http://89.46.196.60:8443/keypeople/react/stati", { headers: headers });

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner) => ({ label: owner.descrizione, value: owner.id })));
            } else {
                console.error("I dati di owner ricerca ottenuti non sono nel formato Array:", responseOwner.data);
            }

            if (Array.isArray(responseStati.data)) {
                setStatiOptions(responseStati.data.map((stati) => ({ label: stati.descrizione, value: stati.id })));
            } else {
                console.error("I dati degli stati in ricerca ottenuti non sono nel formato Array:", responseStati.data);
            }

            if (Array.isArray(responseCliente.data)) {
                setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
                console.error("I dati dei clienti in ricerca ottenuti non sono nel formato Array:", responseCliente.data);
            }

            const { record, keyPeoples } = response.data;

            if (keyPeoples && Array.isArray(keyPeoples)) {
                setFilteredKeypeople(keyPeoples);
                setRecordTot(record);
                setRigheTot(record);
                setHasMore(keyPeoples.length < record);
                setIsSearchActive(true);
                setPagina(paginaParam);
            } else {
                console.error("I dati ottenuti non contengono 'keyPeoples' come array:", response.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero dei dati filtrati:", error);
        } finally {
            setLoading(false);
        }
    };


        const handleFilterChange = (newFilters) => {
        setFiltri(newFilters);
    };

    useEffect(() => {
        sessionStorage.setItem('filtriRicercaKeypeople', JSON.stringify(filtri));
    }, [filtri]);

    const handleReset = async () => {
        setFiltri({
            nome: '',
            azienda: null,
            stato: null,
            owner: null
        });
        setPagina(0);
        setFilteredKeypeople([]);
        setOriginalKeypeople([]);
        setHasMore(true);

        await fetchData(true); // passiamo true per indicare il reset
    };

    //funzione per cancellare l'azienda
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://89.46.196.60:8443/keypeople/react/elimina/${id}`, { headers: headers });
            await fetchData();
        } catch (error) {
            console.error("Errore durante la cancellazione:", error);
        }
    };

    //funzione per il refresh
    const handleRefresh = async () => {
        await fetchData();
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
        sessionStorage.setItem("paginaKeypeople", newPage);
    
        if (Object.values(filtri).some(value => value)) {
            handleRicerche(filtri, newPage);
        } else {
            fetchData(false, newPage);       
        }
    };

    const tipoConverter = (tipoId) => {
        const tipoMap = {
            1: "Keypeople",
            2: "Hook",
            3: "Link"
        };
        return tipoMap[tipoId] || ""; 
    };

    const tipoOptions = [
        { label: "Keypeople", value: 1 },
        { label: "Hook", value: 2 },
        { label: "Link", value: 3 }
    ];

    


    const columns = [
        {
            field: "tipologia",
            headerName: t("Tipo Azienda"),
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center",      
            flex: 0.6,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
            {params.row?.cliente?.tipologia &&
                params.row.cliente.tipologia.charAt(0).toUpperCase() +
                params.row.cliente.tipologia.slice(1).toLowerCase()
            }
            </div>
        ),
        }, 
        {
            field: "settore",
            headerName: t("Settore Azienda"),
            headerAlign: "center",
            align: "center", 
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 1,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.cliente?.settoreMercato}
            </div>
        ),
        }, 
        {
            field: "cliente",
            headerName: t("Azienda"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center", 
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row?.cliente && params.row?.cliente?.denominazione
                    ? params.row?.cliente?.denominazione
                    : "N/A"}
                </div>
            ),
        },
        {
            field: "nome",
            headerName: "Nome Cognome",
            flex: 1.3,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center", 
            renderCell: (params) => (
                <span
                style={{ textDecoration: "underline", color: "black", cursor: "pointer" }}
                onClick={() => {
                    setSelectedKeypeople({ row: params.row });
                    setViewMode("cardSingola");
                }}
                >
                {params.value}
                </span>
                ),
        },
        {
            field: "ruolo",
            headerName: t("Job Title"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerAlign: "center",
            align: "center", 
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.ruolo}
            </div>
            ),
        },
        {
            field: "tipo",
            headerName: t("Tipo"),
            headerAlign: "center",
            align: "center", 
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            flex: 0.6,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {tipoConverter(params.row?.tipo)}
            </div>
        ),
        }, 
        {
            field: "stato",
            headerName: t("Stato"),
            headerAlign: "center",
            align: "center", 
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderHeader: () => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {t("Stato")}
                <Tooltip title={t("Visualizza significato stati")}>
                <IconButton size="small" onClick={handleOpenModalStato}>
                    <InfoOutlinedIcon fontSize="small" />
                </IconButton>
                </Tooltip>
            </Box>
            ),
            renderCell: (params) => {
                const stato = params.row?.stato?.descrizione?.toLowerCase();
                const colorMap = {
                    gold: "#FFD700",
                    silver: "#C0C0C0",
                    bronze: "#b08d57",
                    wood: "#5b3a29",
                    start: "black",
                };
                const color = colorMap[stato] || "#ccc"; 
                return (
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <CircleIcon sx={{ color, fontSize: "1rem" }} />
                    </Box>
                );
            },
        },
    ];


        useEffect(() => {
            setPagina(0);
            setOriginalKeypeople([]);
            setFilteredKeypeople([]);
            setHasMore(true);
            fetchData(true, 0);
        }, [viewMode]);

    return (
        <SchemePage>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2}}>
            <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
                <Tab label="Tabella" value="table" />
                <Tab label="Card" value="cards" />
            </Tabs>
            </Box>
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}>
                <NuovaRicercaKeypeople
                    filtri={filtri}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    onSearch={handleRicerche}
                    aziendaOptions={clienteOptions}
                    statiOptions={statiOptions}
                    ownerOptions={ownerOptions}
                    tipoOptions={tipoOptions}
                    onRicerche={handleRicerche}
                />
            </Box>
            {viewMode === 'cards' ? (
                <InfiniteScroll
                    dataLength={isSearchActive ? filteredKeypeople.length : originalKeypeople.length}
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
                        (isSearchActive ? filteredKeypeople : originalKeypeople).map((keypeople, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <KeypeopleCardFlip
                                    valori={keypeople}
                                    statiOptions={statiOptions}
                                    onDelete={() => handleDelete(keypeople.id)}
                                    onRefresh={handleRefresh}
                                    isFirstCard={index === 0}
                                    />
                            </Grid>
                        ))
                    )}
                </Grid>
                </InfiniteScroll>
                ) : viewMode === 'table' ? (
                <Box sx={{position: 'relative'}}>
                <Tabella
                data={isSearchActive ? filteredKeypeople : originalKeypeople}
                columns={columns}
                title={t("Contatti")}
                getRowId={(row) => row.id}
                pagina={pagina}
                quantita={quantita}
                righeTot={righeTot}
                onPageChange={handlePageChange}
                // onRowClick={(row) => {
                //     setSelectedKeypeople(row);
                //     setViewMode("cardSingola");
                // }}
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
            ): viewMode === 'cardSingola' && selectedKeypeople ? (
                <Box sx={{ mt: 2, width: '50%'}}>
                    <KeypeopleCardFlip
                        valori={selectedKeypeople?.row}
                        statiOptions={statiOptions}
                        onDelete={() => handleDelete(selectedKeypeople.id)}
                        onRefresh={handleRefresh}
                        isFirstCard={true}
                        />
                    <Box sx={{ mt: 2 }}>
                    </Box>
                    </Box>
                ) : null}
                <Dialog open={openModalStato} onClose={handleCloseModalStato}>
                    <DialogTitle>Leggenda degli stati</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircleIcon sx={{ color: '#FFD700'}}/> <span> Gold: ho ricevuto un’esigenza di business</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircleIcon sx={{ color: '#C0C0C0'}}/> <span>Silver: ho fissato una prospection</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircleIcon sx={{ color: '#b08d57'}} /> <span>Bronze: sono entrato in contatto</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircleIcon sx={{ color: '#5b3a29'}} /> <span>Wood: ho effettuato un’azione senza esito</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircleIcon sx={{ color: 'black'}} /> <span>Start: non ho ancora effettuato azioni commerciali</span>
                        </Box>
                        </Box>
                    </DialogContent>
                </Dialog>


        </SchemePage>        
    );

};

export default Keypeople;
