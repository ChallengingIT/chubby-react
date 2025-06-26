import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import AziendeCardFlip from "../components/card/AziendeCardFlip";
import SchemePage from '../components/SchemePage.jsx';
import Tabella from '../components/Tabella';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
    Tab,
    Tabs
} from "@mui/material";
import NuovaRicercaAziende from "../components/nuoveRicerche/NuovaRicercaAziende.jsx";
import { useTranslation }                   from "react-i18next"; 


const Aziende = () => {
    const { t } = useTranslation(); 


    const [originalAziende, setOriginalAziende] = useState([]);
    const [filteredAziende, setFilteredAziende] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clienteOptions, setClienteOptions] = useState([]);
    const [selectedAziende, setSelectedAziende] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    
    
    

    //stati ricerche
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);

    //stato paginazione
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const quantita = 10;
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [recordTot, setRecordTot] = useState(0);
    const [righeTot, setRigheTot] = useState(0);
    

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaAziende");
        if (filtriSalvati) {
            const filtriParsed = JSON.parse(filtriSalvati);
            return filtriParsed;
        }
        return {
            azienda: null,
            tipologia: null,
            stato: null,
            owner: null,
            ida: null,
        };
    });



    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const fetchData = async (reset = false, paginaParam = 0) => {
        setLoading(true);
        const filtriDaInviare = {
            azienda: filtri.azienda || null,
            tipologia: filtri.tipologia || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
            pagina: paginaParam,
            quantita: 10,
        };
        if (!userHasRole("ADMIN")) {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole("ADMIN")
            ? "http://localhost:8080/aziende/react/mod"
            : "http://localhost:8080/aziende/react/mod/personal";

        try {
            const responseAziende = await axios.get(baseUrl, {
                headers: headers,
                params: filtriDaInviare,
            });

            const responseCliente = await axios.get("http://localhost:8080/aziende/react/select", { headers: headers });


            if (Array.isArray(responseCliente.data)) {
                setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
                console.error("I dati degli stati ottenuti non sono nel formato Array:", responseCliente.data);
            }


            const responseOwner = await axios.get(
                "http://localhost:8080/owner",
                { headers: headers }
            );
            const provinceResponse = await axios.get(
                "http://localhost:8080/aziende/react/province",
                { headers: headers }
            );

            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(
                    responseOwner.data.map((owner) => ({
                        label: owner.descrizione,
                        value: owner.id,
                    }))
                );
            } else {
                console.error(
                    "I dati ottenuti non sono nel formato Array:",
                    responseOwner.data
                );
            }
            if (Array.isArray(provinceResponse.data)) {
                const provinceOptions = provinceResponse.data.map((province) => ({
                    label: province.nomeProvince,
                    value: province.nomeProvince,
                }));
                setProvinceOptions(provinceOptions);
            } else {
                console.error(
                    "I dati ottenuti non sono nel formato Array:",
                    provinceResponse.data
                );
            }

            if (Array.isArray(responseAziende.data?.clienti)) {
                const aziendeConId = responseAziende.data?.clienti.map((aziende) => ({
                    ...aziende,
                }));
                setOriginalAziende(aziendeConId);
                setHasMore(aziendeConId.length >= quantita);
                setRigheTot(responseAziende.data?.record || 0);
                if (reset) {
                    setFilteredAziende([]);
                    setIsSearchActive(false);
                }
            } else {
                console.error(
                    "I dati ottenuti non sono nel formato Array:",
                    responseAziende.data
                );
            }
            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaAziende");
        if (filtriSalvati) {
            const filtriParsed = JSON.parse(filtriSalvati);
            setFiltri(filtriParsed);

            const isAnyFilterSet = Object.values(filtriParsed).some((value) => value);
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

        if (!userHasRole("ADMIN")) {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole("ADMIN")
            ? (isSearchActive ? "http://localhost:8080/aziende/react/ricerca/mod" : "http://localhost:8080/aziende/react/mod")
            : (isSearchActive ? "http://localhost:8080/aziende/react/ricerca/mod/personal" : "http://localhost:8080/aziende/react/mod/personal");

        try {
            const responsePaginazione = await axios.get(baseUrl, {
                headers: headers,
                params: filtriDaInviare,
            });

            if (isSearchActive) {
                const { record, clienti } = responsePaginazione.data;

                if (Array.isArray(clienti)) {
                    const aziendeConId = clienti.map((aziende) => ({
                        ...aziende,
                    }));
                    setFilteredAziende((prev) => [...prev, ...aziendeConId]);
                    setHasMore(filteredAziende.length + aziendeConId.length < recordTot);
                } else {
                    console.error("I dati ottenuti non sono nel formato Array:", responsePaginazione.data);
                }
            } else {
                if (Array.isArray(responsePaginazione.data?.clienti)) {
                    const aziendeConId = responsePaginazione.data?.clienti.map((aziende) => ({
                        ...aziende,
                    }));
                    setOriginalAziende((prev) => [...prev, ...aziendeConId]);
                    setHasMore(aziendeConId.length >= quantita);
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

    const handleRicerche = async (filtriParam, paginaParam = 0) => {
        const isAnyFilterSet = Object.values(filtri).some((value) => value);
        if (!isAnyFilterSet) {
            setIsSearchActive(false);
            return;
        }

        const filtriDaInviare = {
            ...filtri,
            pagina: paginaParam,
            quantita: quantita,
        };

        if (!userHasRole("ADMIN")) {
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                filtriDaInviare.username = userObj.username;
            }
        }

        const baseUrl = userHasRole("ADMIN")
            ? "http://localhost:8080/aziende/react/ricerca/mod"
            : "http://localhost:8080/aziende/react/ricerca/mod/personal";

        setLoading(true);
        try {
            const response = await axios.get(baseUrl, {
                headers: headers,
                params: filtriDaInviare,
            });
            const responseOwner = await axios.get(
                "http://localhost:8080/owner",
                { headers }
            );

            const responseCliente = await axios.get("http://localhost:8080/aziende/react/select", { headers: headers });

            if (Array.isArray(responseCliente.data)) {
                setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
                console.error("I dati dei clienti in ricerca ottenuti non sono nel formato Array:", responseCliente.data);
            }


            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(
                    responseOwner.data.map((owner) => ({
                        label: owner.descrizione,
                        value: owner.id,
                    }))
                );
            } else {
                console.error(
                    "I dati ottenuti non sono nel formato Array:",
                    responseOwner.data
                );
            }

            const { record, clienti } = response.data;

            if (clienti && Array.isArray(clienti)) {
                setFilteredAziende(clienti);
                setRecordTot(record);
                setHasMore(clienti.length < record);
                setIsSearchActive(true);
                setPagina(paginaParam);
                setRigheTot(record);
            } else {
                console.error(
                    "I dati ottenuti non contengono 'aziende' come array: ",
                    response.data
                );
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
        sessionStorage.setItem("filtriRicercaAziende", JSON.stringify(filtri));
    }, [filtri]);

    const handleReset = async () => {
        setFiltri({
            azienda: "",
            stato: null,
            owner: null,
            tipologia: null,
            ida: null,
        });
        setPagina(0);
        setFilteredAziende([]);
        setOriginalAziende([]);
        setHasMore(true);

        await fetchData(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:8080/aziende/react/elimina/${id}`,
                { headers: headers }
            );
            const isAnyFilterSet = Object.values(filtri).some((value) => value);
            if (!isAnyFilterSet) {
            await fetchData();
            } else {
            await handleRicerche();
            }
        } catch (error) {
            console.error("Errore durante la cancellazione: ", error);
        }
    };

    const handleRefresh = async () => {
        await fetchData();
    };

    const tipologiaOptions = [
        { label: "Cliente",         value: "CLIENTE"    },
        { label: "Prospect",        value: "PROSPECT"   },
        { label: "Ex cliente",      value: "EXCLIENTE"  },
        { label: "Fornitore",       value: "FORNITORE"  },
        { label: "Partner",         value: "PARTNER"    },
    ];

    const statoOptions = [
        { label: "Caldo", value: "1" },
        { label: "Tiepido", value: "2" },
        { label: "Freddo", value: "3" },
    ];

    const idaOptions = [
        { label: "Basso", value: "basso" },
        { label: "Medio", value: "medio" },
        { label: "Alto", value: "alto" },
    ];


    const idaConverter = (value) => {
        if (value <= 1) return <ArrowDownwardIcon sx={{ color: "black"}}/>;
        if (value > 1 && value <= 2) return <ArrowForwardIcon sx={{ color: "#00B400" }}/>;
        if (value > 2) return <ArrowUpwardIcon sx={{ color: "orange" }}/>;
        return "N/A";
    };
    


    const columns = [
        {
            field: "tipologia",
            headerName: "Tipologia",
            flex: 1.0,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <span
                style={{ textDecoration: "underline", color: "black", cursor: "pointer" }}
                onClick={() => {
                    setSelectedAziende({ row: params.row });
                    setViewMode("cardSingola");
                }}
                >
                {params.value}
                </span>
            ),
        },
        {
            field: "settoreMercato",
            headerName: t("Settore"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "denominazione",
            headerName: "Nome",
            flex: 1.3,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <span
                style={{ textDecoration: "underline", color: "black", cursor: "pointer" }}
                onClick={() => {
                    setSelectedAziende({ row: params.row });
                    setViewMode("cardSingola");
                }}
                >
                {params.value}
                </span>
            ),
        },
        // {
        //     field: "citta",
        //     headerName: t("Città"),
        //     flex: 1,
        //     sortable: false,
        //     filterable: false,
        //     disableColumnMenu: true,
        //     },
        {
            field: "sedeOperativa",
            headerName: t("Sede operativa"),
            flex: 1,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
        },
        {
            field: "ida",
            headerName: t("IDA"),
            flex: 0.6,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "start" }}>
                    {idaConverter(params.row?.ida)}
                </div>
            ),
        }
    ];



    const handlePageChange = (newPage) => {
        setPagina(newPage);
        sessionStorage.setItem("paginaAziende", newPage);
    
        if (Object.values(filtri).some(value => value)) {
            handleRicerche(filtri, newPage);
        } else {
            fetchData(false, newPage);       
        }
    };

        useEffect(() => {
            setPagina(0);
            setOriginalAziende([]);
            setFilteredAziende([]);
            setHasMore(true);
            fetchData(true, 0);
        }, [viewMode]);
        
        


    return (
        <SchemePage>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
                <Tab label="Tabella" value="table" />
                <Tab label="Card" value="cards" />
            </Tabs>
            </Box>
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <NuovaRicercaAziende
                    filtri={filtri}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    onSearch={handleRicerche}
                    tipologiaOptions={tipologiaOptions}
                    statoOptions={statoOptions}
                    ownerOptions={ownerOptions}
                    idaOptions={idaOptions}
                    aziendaOptions={clienteOptions}

                />
            </Box>
            {viewMode === 'cards' ? (
            <InfiniteScroll
                dataLength={isSearchActive ? filteredAziende.length : originalAziende.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1em",
                        overflow: "hidden",
                    }}
                    >
                        <CircularProgress sx={{ color: "#00B400" }} />
                    </Box>
                }
                >
                <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
                    {loading ? (
                        <>
                            {Array.from(new Array(quantita)).map((_, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Box sx={{ marginRight: 2, marginBottom: 2 }}>
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height={118}
                                        />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" width="60%" />
                                    </Box>
                                </Grid>
                            ))}
                        </>
                    ) : (
                        (isSearchActive ? filteredAziende : originalAziende).map((aziende, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <AziendeCardFlip
                                    valori={aziende}
                                    onDelete={() => handleDelete(aziende.id)}
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
                        data={isSearchActive ? filteredAziende : originalAziende}
                        columns={columns}
                            title={t("Aziende")}
                            getRowId={(row) => row.id}
                            pagina={pagina}
                            quantita={quantita}
                            righeTot={righeTot}
                            onPageChange={handlePageChange}
                            // onRowClick={(row) => {
                            //     setSelectedAziende(row);
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
                    ) : viewMode === 'cardSingola' && selectedAziende ? (
                        <Box sx={{ mt: 2, width: '50%'}}>
                            <AziendeCardFlip
                                valori={selectedAziende?.row}
                                onDelete={() => handleDelete(selectedAziende.id)}
                                onRefresh={handleRefresh}
                                isFirstCard={true}
                            />
                            <Box sx={{ mt: 2 }}>
                            </Box>
                            </Box>
                        ) : null}
        </SchemePage>
    );
};

export default Aziende;
