    import React, { useCallback, useEffect, useMemo, useState } from "react";
    import axios from "axios";
    import InfiniteScroll from "react-infinite-scroll-component";
    import { Box, CircularProgress, Grid, Skeleton, Tab, Tabs } from "@mui/material";
    import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
    import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
    import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
    import { useTranslation } from "react-i18next";

    import SchemePage from "../components/SchemePage.jsx";
    import Tabella from "../components/Tabella";
    import AziendeCardFlip from "../components/card/AziendeCardFlip";
    import NuovaRicercaAziende from "../components/nuoveRicerche/NuovaRicercaAziende.jsx";

    const STORAGE_KEY_FILTRI = "filtriRicercaAziende";
    const CARDS_BATCH = 10;

    const EMPTY_FILTRI = {
    azienda: null,
    tipologia: null,
    stato: null,
    owner: null,
    ida: null,       
    };

    const normalizeStr = (v) => (v ?? "").toString().trim().toUpperCase();
    const hasAnyFilter = (f) =>
    Object.values(f || {}).some((v) => v !== null && v !== "" && v !== undefined);

    const Aziende = () => {
    const { t } = useTranslation();

    // dati
    const [originalAziende, setOriginalAziende] = useState([]);
    const [loading, setLoading] = useState(false);

    // options select
    const [clienteOptions, setClienteOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);

    // UI
    const [viewMode, setViewMode] = useState("table");
    const [selectedAziende, setSelectedAziende] = useState(null);

    // cards infinite scroll
    const [visibleCount, setVisibleCount] = useState(CARDS_BATCH);

    // filtri
    const [filtri, setFiltri] = useState(() => {
        const salvati = sessionStorage.getItem(STORAGE_KEY_FILTRI);
        if (!salvati) return EMPTY_FILTRI;
        try {
        return { ...EMPTY_FILTRI, ...JSON.parse(salvati) };
        } catch {
        return EMPTY_FILTRI;
        }
    });

    const [isSearchActive, setIsSearchActive] = useState(() => hasAnyFilter(
        (() => {
        try {
            const salvati = sessionStorage.getItem(STORAGE_KEY_FILTRI);
            return salvati ? JSON.parse(salvati) : null;
        } catch {
            return null;
        }
        })()
    ));

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = useMemo(
        () => ({ Authorization: `Bearer ${token}` }),
        [token]
    );

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) return false;
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
        const userString = sessionStorage.getItem("user");
        const userObj = userString ? JSON.parse(userString) : null;
        const username = userObj?.username;

        const baseUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/aziende/react/mod"
            : "http://80.211.138.142:8443/aziende/react/mod/personal";

        const params = {};
        if (!userHasRole("ADMIN") && username) params.username = username;

        const responseAziende = await axios.get(baseUrl, { headers, params });

        const clienti = responseAziende.data?.clienti;
        setOriginalAziende(Array.isArray(clienti) ? clienti : []);

        const responseAziendeUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/aziende/react/select"
            : `http://80.211.138.142:8443/aziende/react/select/${username}`;

        const responseCliente = await axios.get(responseAziendeUrl, { headers });
        setClienteOptions(
            Array.isArray(responseCliente.data)
            ? responseCliente.data.map((c) => ({ label: c.denominazione, value: c.id }))
            : []
        );

        // province
        const provinceResponse = await axios.get("http://80.211.138.142:8443/aziende/react/province", {
            headers,
        });
        setProvinceOptions(
            Array.isArray(provinceResponse.data)
            ? provinceResponse.data.map((p) => ({ label: p.nomeProvince, value: p.nomeProvince }))
            : []
        );

        // owner
        const ownerUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/owner"
            : `http://80.211.138.142:8443/owner/${username}`;

        const responseOwner = await axios.get(ownerUrl, { headers });
        setOwnerOptions(
            Array.isArray(responseOwner.data)
            ? responseOwner.data.map((o) => ({ label: o.descrizione, value: o.id }))
            : []
        );
        } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        setOriginalAziende([]);
        setClienteOptions([]);
        setOwnerOptions([]);
        setProvinceOptions([]);
        } finally {
        setLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY_FILTRI, JSON.stringify(filtri));
    }, [filtri]);

    useEffect(() => {
        setVisibleCount(CARDS_BATCH);

        if (viewMode !== "cardSingola") {
            setSelectedAziende(null);
        }
    }, [viewMode]);


    useEffect(() => {
        if (isSearchActive) setVisibleCount(CARDS_BATCH);
    }, [filtri, isSearchActive]);

    const tipologiaOptions = [
        { label: "Cliente", value: "CLIENTE" },
        { label: "Prospect", value: "PROSPECT" },
        { label: "Ex cliente", value: "EXCLIENTE" },
        { label: "Fornitore", value: "FORNITORE" },
        { label: "Partner", value: "PARTNER" },
        { label: "Consulenza", value: "CONSULENZA" },
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

    const idaIcon = (idaValue) => {
        const v = Number(idaValue);
        if (!Number.isFinite(v)) return "N/A";
        if (v <= 1) return <ArrowDownwardIcon sx={{ color: "black" }} />;
        if (v > 1 && v <= 2) return <ArrowForwardIcon sx={{ color: "#00B400" }} />;
        return <ArrowUpwardIcon sx={{ color: "orange" }} />;
    };

    const filteredAziende = useMemo(() => {
        if (!isSearchActive) return originalAziende;

        const any = hasAnyFilter(filtri);
        if (!any) return originalAziende;

        const fAziendaId = filtri.azienda != null ? String(filtri.azienda) : null;
        const fOwnerId = filtri.owner != null ? String(filtri.owner) : null;
        const fStatus = filtri.stato != null ? String(filtri.stato) : null;
        const fTipologia = filtri.tipologia != null ? normalizeStr(filtri.tipologia) : null;
        const fIda = filtri.ida;

        return originalAziende.filter((c) => {
        if (fAziendaId && String(c.id) !== fAziendaId) return false;

        if (fOwnerId && String(c.owner?.id) !== fOwnerId) return false;

        if (fStatus && String(c.status) !== fStatus) return false;

        if (fTipologia) {
            const tip = normalizeStr(c.tipologia);
            if (tip !== fTipologia) return false;
        }

        if (fIda) {
            const v = Number(c.ida);
            if (!Number.isFinite(v)) return false;
            if (fIda === "basso" && !(v <= 1)) return false;
            if (fIda === "medio" && !(v > 1 && v <= 2)) return false;
            if (fIda === "alto" && !(v > 2)) return false;
        }

        return true;
        });
    }, [originalAziende, filtri, isSearchActive]);

    const cardsToRender = useMemo(
        () => filteredAziende.slice(0, visibleCount),
        [filteredAziende, visibleCount]
    );

    const hasMoreCards = visibleCount < filteredAziende.length;

    const fetchMoreCards = () => {
        setVisibleCount((c) => Math.min(c + CARDS_BATCH, filteredAziende.length));
    };

    const handleFilterChange = (newFilters) => {
        setFiltri({ ...EMPTY_FILTRI, ...newFilters });
    };

    const handleSearch = () => {
        setIsSearchActive(true);
        setVisibleCount(CARDS_BATCH);
    };

    const handleReset = () => {
        setFiltri(EMPTY_FILTRI);
        setIsSearchActive(false);
        setVisibleCount(CARDS_BATCH);
        sessionStorage.removeItem(STORAGE_KEY_FILTRI);
    };

    const handleDelete = async (id) => {
        try {
        await axios.delete(`http://80.211.138.142:8443/aziende/react/elimina/${id}`, { headers });
        await fetchData();
        } catch (error) {
        console.error("Errore durante la cancellazione: ", error);
        }
    };

    const handleRefresh = async () => {
        await fetchData();
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
                setSelectedAziende(params.row);
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
                setSelectedAziende(params.row);
                setViewMode("cardSingola");
            }}
            >
            {params.value}
            </span>
        ),
        },
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
        renderCell: (params) => <div style={{ textAlign: "start" }}>{idaIcon(params.row?.ida)}</div>,
        },
    ];

    return (
        <SchemePage>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
            <Tab label="Tabella" value="table" />
            <Tab label="Card" value="cards" />
            </Tabs>
        </Box>

        <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <NuovaRicercaAziende
            filtri={filtri}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleSearch}
            tipologiaOptions={tipologiaOptions}
            statoOptions={statoOptions}
            ownerOptions={ownerOptions}
            idaOptions={idaOptions}
            aziendaOptions={clienteOptions}
            />
        </Box>

        {viewMode === "cards" ? (
            <InfiniteScroll
            dataLength={cardsToRender.length}
            hasMore={hasMoreCards}
            next={fetchMoreCards}
            loader={
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, overflow: "hidden" }}>
                <CircularProgress sx={{ color: "#00B400" }} />
                </Box>
            }
            >
            <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
                {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <Grid item xs={12} md={6} key={i}>
                    <Box sx={{ mr: 2, mb: 2 }}>
                        <Skeleton variant="rectangular" width="100%" height={118} />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                    </Box>
                    </Grid>
                ))
                ) : (
                cardsToRender.map((cliente, index) => (
                    <Grid item xs={12} md={6} key={cliente.id ?? index}>
                    <AziendeCardFlip
                        valori={cliente}
                        onDelete={() => handleDelete(cliente.id)}
                        onRefresh={handleRefresh}
                        isFirstCard={index === 0}
                    />
                    </Grid>
                ))
                )}
            </Grid>
            </InfiniteScroll>
        ) : viewMode === "table" ? (
            <Box sx={{ position: "relative" }}>
            <Tabella
                data={filteredAziende}
                columns={columns}
                title={t("Aziende")}
                getRowId={(row) => row.id}
            />

            {loading && (
                <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255, 255, 255, 0.5)",
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                <CircularProgress sx={{ color: "#00B400" }} />
                </Box>
            )}
            </Box>
        ) : viewMode === "cardSingola" && selectedAziende ? (
            <Box sx={{ mt: 2, width: "50%" }}>
            <AziendeCardFlip
                valori={selectedAziende}
                onDelete={() => handleDelete(selectedAziende?.id)}
                onRefresh={handleRefresh}
                isFirstCard
            />
            </Box>
        ) : null}
        </SchemePage>
    );
    };

    export default Aziende;
