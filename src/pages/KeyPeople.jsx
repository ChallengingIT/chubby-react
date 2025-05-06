import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import KeypeopleCardFlip from '../components/card/KeypeopleCardFlip';
import Tabella from '../components/Tabella';
import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
    Tabs,
    Tab
} from '@mui/material';
import SchemePage from '../components/SchemePage';
import NuovaRicercaKeypeople from '../components/nuoveRicerche/NuovaRicercaKeypeople';
import { useTranslation }                   from "react-i18next"; 


const Keypeople = () => {

    const { t } = useTranslation(); 
    
    
    const [originalKeypeople, setOriginalKeypeople] = useState([]);
    const [filteredKeypeople, setFilteredKeypeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards');
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

    const fetchData = async (reset = false) => {
        setLoading(true);
        const filtriDaInviare = {
            nome: filtri.nome || null,
            azienda: filtri.azienda || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
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

            if (Array.isArray(response.data)) {
                const keypeopleConId = response.data.map((keypeople) => ({ ...keypeople }));
                setOriginalKeypeople(keypeopleConId);
                setHasMore(keypeopleConId.length >= quantita);
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

    const fetchMoreData = async () => {
        const paginaSuccessiva = pagina + 1;

        const filtriDaInviare = {
            ...filtri,
            pagina: paginaSuccessiva,
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
                if (Array.isArray(responsePaginazione.data)) {
                    const keypeopleConId = responsePaginazione.data.map((keypeople) => ({ ...keypeople }));
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
    const handleRicerche = async () => {
        const isAnyFilterSet = Object.values(filtri).some(value => value);
        if (!isAnyFilterSet) {
            setIsSearchActive(false);
            return;
        }

        const filtriDaInviare = {
            ...filtri,
            pagina: 0,
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
                setHasMore(keyPeoples.length < record);
                setIsSearchActive(true);
                setPagina(0);
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


    const handlePageChange = (newPage) => {
        setPagina(newPage);
        sessionStorage.setItem("paginaRecruiting", newPage);
    
        if (Object.values(filtri).some(value => value)) {
            handleRicerche(filtri, newPage);
        } else {
            fetchData(newPage);
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


    const columns = [
        {
            field: "nome",
            headerName: "Nome Cognome",
            flex: 1.3,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row?.nome }
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
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {params.row?.cliente && params.row?.cliente?.denominazione
                    ? params.row?.cliente?.denominazione
                    : "N/A"}
                </div>
            ),
            },
        {
            field: "tipologia",
            headerName: t("Job Title"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
                {params.row?.ruolo}
            </div>
            ),
        },
        {
            field: "tipo",
            headerName: t("Tipo"),
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
            field: "email",
            headerName: t("Email"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "cellulare",
            headerName: t("Telefono"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        }
    ];

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
                <NuovaRicercaKeypeople
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
                dataLength={isSearchActive ? filteredKeypeople.length : originalKeypeople.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1em', overflow: 'hidden' }}>
                        <CircularProgress sx={{ color: '#00B400' }} />
                    </Box>
                }
            >
                {viewMode === 'cards' ? (
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
                ) : viewMode === 'table' ? (
                <Tabella
                data={isSearchActive ? filteredKeypeople : originalKeypeople}
                columns={columns}
                    title={t("Keypeople")}
                    getRowId={(row) => row.id}
                    pagina={pagina}
                    quantita={quantita}
                    righeTot={righeTot}
                    onPageChange={handlePageChange}
                    onRowClick={(row) => {
                        setSelectedKeypeople(row);
                        setViewMode("cardSingola");
                    }}
                />
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
            </InfiniteScroll>
        </SchemePage>
    );
};

export default Keypeople;
