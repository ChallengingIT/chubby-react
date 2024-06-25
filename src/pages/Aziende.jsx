    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import InfiniteScroll from "react-infinite-scroll-component";
    import RicercheAziende from "../components/ricerche/RicercheAziende";
    import AziendeCardFlip from "../components/card/AziendeCardFlip";

    import SchemePage from '../components/SchemePage.jsx';

    import {
    Box,
    CircularProgress,
    Grid,
    Skeleton,
    } from "@mui/material";
import NuovaRicercaAziende from "../components/nuoveRicerche/NuovaRicercaAziende.jsx";

    const Aziende = () => {
    const [originalAziende, setOriginalAziende] = useState([]);
    const [loading, setLoading] = useState(false);

    //stati ricerche
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);

    //stato paginazione
    const [pagina, setPagina] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const quantita = 10;
    const [isSearchActive, setIsSearchActive] = useState(false);


  

    const getValueLabel = (value) => {
        const option = ownerOptions.find((option) => option.value === value);
        return option ? option.label : null;
    };

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaAziende");
        if (filtriSalvati) {
        const filtriParsed = JSON.parse(filtriSalvati);
        if (filtriParsed.owner) {
            filtriParsed.ownerLabel = getValueLabel(filtriParsed.owner);
        }
        return filtriParsed;
        }
        return {
        denominazione: null,
        tipologia: null,
        stato: null,
        owner: null,
        ida: null,
        ownerLabel: null,
        };
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    //controllo del ruolo dell'utente loggato
    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
        return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const fetchData = async () => {
        setLoading(true);
        const filtriDaInviare = {
        ragione: filtri.denominazione || null,
        tipologia: filtri.tipologia || null,
        owner: filtri.owner || null,
        stato: filtri.stato || null,
        pagina: 0,
        quantita: 10,
        };
        if (!userHasRole("ROLE_ADMIN")) {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObj = JSON.parse(userString);
            filtriDaInviare.username = userObj.username;
        }
        }

        const baseUrl = userHasRole("ROLE_ADMIN")
        ? "http://89.46.196.60:8443/aziende/react/mod"
        : "http://89.46.196.60:8443/aziende/react/mod/personal";

        try {
        const responseAziende = await axios.get(baseUrl, {
            headers: headers,
            params: filtriDaInviare,
        });

        // const responseAziende   = await axios.get("http://89.46.196.60:8443/aziende/react/mod",     { headers: headers , params: filtriDaInviare });
        // const responseCliente   = await axios.get("http://89.46.196.60:8443/aziende/react/select",  { headers });
        const responseOwner = await axios.get(
            "http://89.46.196.60:8443/owner",
            { headers: headers }
        );
        const provinceResponse = await axios.get(
            "http://89.46.196.60:8443/aziende/react/province",
            { headers: headers }
        );

        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(
            responseOwner.data.map((owner, index) => ({
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

        if (Array.isArray(responseAziende.data)) {
            const aziendeConId = responseAziende.data.map((aziende) => ({
            ...aziende,
            }));
            setOriginalAziende(aziendeConId);
            setHasMore(aziendeConId.length >= quantita);
            // setPagina(pagina + 1);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array:",
            responseAziende.data
            );
        }
        setLoading(false);
        } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
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

    //funzione per la paginazione
    // const fetchMoreData = async () => {
    //     const paginaSuccessiva = pagina + 1;

    //     if (!userHasRole("ROLE_ADMIN")) {
    //     const userString = sessionStorage.getItem("user");
    //     if (userString) {
    //         const userObj = JSON.parse(userString);
    //         filtri.username = userObj.username;
    //     }
    //     }

    //     const baseUrl = userHasRole("ROLE_ADMIN")
    //     ? "http://89.46.196.60:8443/aziende/react/mod"
    //     : "http://89.46.196.60:8443/aziende/react/mod/personal";

    //     const filtriDaInviare = {
    //     ...filtri,
    //     pagina: paginaSuccessiva,
    //     quantita: quantita,
    //     };
    //     try {
    //     const responsePaginazione = await axios.get(baseUrl, {
    //         headers: headers,
    //         params: filtriDaInviare,
    //     });
    //     if (Array.isArray(responsePaginazione.data)) {
    //         const aziendeConId = responsePaginazione.data.map((aziende) => ({
    //         ...aziende,
    //         }));
    //         setOriginalAziende((prev) => [...prev, ...aziendeConId]);
    //         setHasMore(responsePaginazione.data.length >= quantita);
    //     } else {
    //         console.error(
    //         "I dati ottenuti non sono nel formato Array:",
    //         responsePaginazione.data
    //         );
    //     }
    //     setLoading(false);
    //     } catch (error) {
    //     console.error("Errore durante il recupero dei dati:", error);
    //     }
    //     setPagina((prevPagina) => prevPagina + 1);
    // };


    const fetchMoreData = async () => {
    const paginaSuccessiva = pagina + 1;

    if (!userHasRole("ROLE_ADMIN")) {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObj = JSON.parse(userString);
            filtri.username = userObj.username;
        }
    }

    const baseUrl = userHasRole("ROLE_ADMIN")
        ? "http://89.46.196.60:8443/aziende/react/mod"
        : "http://89.46.196.60:8443/aziende/react/mod/personal";

    const filtriDaInviare = {
        ...filtri,
        pagina: paginaSuccessiva,
        quantita: quantita,
    };

    try {
        const responsePaginazione = await axios.get(baseUrl, {
            headers: headers,
            params: filtriDaInviare,
        });
        if (Array.isArray(responsePaginazione.data)) {
            const aziendeConId = responsePaginazione.data.map((aziende) => ({
                ...aziende,
            }));
            setOriginalAziende((prev) => [...prev, ...aziendeConId]);
            setHasMore(responsePaginazione.data.length >= quantita);
        } else {
            console.error(
                "I dati ottenuti non sono nel formato Array:",
                responsePaginazione.data
            );
        }
        setLoading(false);
    } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
    }
    setPagina((prevPagina) => prevPagina + 1);
};


    //funzione di ricerca
    const handleRicerche = async () => {
    const isAnyFilterSet = Object.values(filtri).some((value) => value);
    if (!isAnyFilterSet) {
        setIsSearchActive(false);
        return;
    }

    const filtriDaInviare = {
        ...filtri,
        pagina: 0,
        quantita: quantita,
    };

    if (!userHasRole("ROLE_ADMIN")) {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObj = JSON.parse(userString);
            filtriDaInviare.username = userObj.username;
        }
    }

    const baseUrl = userHasRole("ROLE_ADMIN")
        ? "http://89.46.196.60:8443/aziende/react/ricerca/mod"
        : "http://89.46.196.60:8443/aziende/react/ricerca/mod/personal";

    setLoading(true);
    try {
        const response = await axios.get(baseUrl, {
            headers: headers,
            params: filtriDaInviare,
        });
        const responseOwner = await axios.get(
            "http://89.46.196.60:8443/owner",
            { headers }
        );

        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(
                responseOwner.data.map((owner, index) => ({
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

        if (Array.isArray(response.data)) {
            setOriginalAziende(response.data);
            setHasMore(response.data.length >= quantita);
            setIsSearchActive(true);
            setPagina(0);
        } else {
            console.error(
                "I dati ottenuti non sono nel formato Array:",
                response.data
            );
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
        setFiltri((currentFilters) => {
        const newFilters = { ...currentFilters, [name]: newValue };

        // Controllo se tutti i filtri sono vuoti
        const areFiltersEmpty = Object.values(newFilters).every(
            (value) => value === null
        );
        if (areFiltersEmpty) {
            fetchData();
        } else {
            setPagina(0);
            setOriginalAziende([]);
            setHasMore(true);
            // handleRicerche();
        }

        return newFilters;
        });
    };

    // useEffect(() => {
    //     const { ...otherFilters } = filtri;
    //     const filtriHasValues = Object.values(otherFilters).some(
    //     (x) => x !== "" && x != null
    //     );

    //     if (filtriHasValues) {
    //     handleRicerche();
    //     }
    // }, [filtri.denominazione]);

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
        sessionStorage.setItem("filtriRicercaAziende", JSON.stringify(filtri));
    }, [filtri]);

    //funzione di reset dei campi di ricerca
    const handleReset = async () => {
        setFiltri({
        denominazione: "",
        stato: null,
        owner: null,
        tipologia: null,
        ida: null,
        });
        setPagina(0);
        setOriginalAziende([]);
        setHasMore(true);

        await fetchData(0);
    };

    //funzione per cancellare l'azienda
    const handleDelete = async (id) => {
        try {
        const responseDelete = await axios.delete(
            `http://89.46.196.60:8443/aziende/react/elimina/${id}`,
            { headers: headers }
        );
        await fetchData(0);
        } catch (error) {
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
        { label: "Ex cliente", value: "EXCLIENTE" },
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

    return (
        <SchemePage>

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
            />
            </Box>
            <InfiniteScroll
            dataLength={originalAziende.length}
            next={fetchMoreData}
            hasMore={isSearchActive && hasMore}
            // loader={'Caricamento in corso...'}
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
            {/* Main Content Area */}
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
                originalAziende.map((aziende, index) => (
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
            </SchemePage>

    );
    };
    export default Aziende;
