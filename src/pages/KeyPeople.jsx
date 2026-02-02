    import React, { useCallback, useEffect, useMemo, useState } from "react";
    import axios from "axios";
    import InfiniteScroll from "react-infinite-scroll-component";
    import KeypeopleCardFlip from "../components/card/KeypeopleCardFlip";
    import Tabella from "../components/Tabella";
    import SchemePage from "../components/SchemePage";
    import NuovaRicercaKeypeople from "../components/nuoveRicerche/NuovaRicercaKeypeople";
    import { useTranslation } from "react-i18next";
    import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
    import CircleIcon from "@mui/icons-material/Circle";
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
    DialogContent,
    Typography
    } from "@mui/material";
    import { useLocation } from "react-router-dom";

    const STORAGE_KEY_FILTRI = "filtriRicercaKeypeople";
    const CARDS_BATCH = 10;

    const EMPTY_FILTRI = {
    nome: null,
    azienda: null,
    stato: null,
    owner: null,
    tipo: null,
    };

    const normalizeStr = (v) => (v ?? "").toString().trim().toLowerCase();
    const hasAnyFilter = (f) =>
    Object.values(f || {}).some((v) => v !== null && v !== "" && v !== undefined);

    const KeyPeople = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const [originalKeypeople, setOriginalKeypeople] = useState([]);
    const [loading, setLoading] = useState(false);

    const [viewMode, setViewMode] = useState("table");

    const [clienteOptions, setClienteOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statiOptions, setStatiOptions] = useState([]);

    const [openModalStato, setOpenModalStato] = useState(false);
    const handleOpenModalStato = () => setOpenModalStato(true);
    const handleCloseModalStato = () => setOpenModalStato(false);

    const [openModalStoricoFromDashboard, setOpenModalStoricoFromDashboard] = useState(false);

    const [visibleCount, setVisibleCount] = useState(CARDS_BATCH);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) return false;
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const getInitialFilters = () => {
        if (location.state?.fromDashboard) {
        return {
            ...EMPTY_FILTRI,
            nome: location.state.nomeContatto || null,
            azienda: location.state.idCliente || null,
        };
        }

        const salvati = sessionStorage.getItem(STORAGE_KEY_FILTRI);
        if (!salvati) return EMPTY_FILTRI;

        try {
        return { ...EMPTY_FILTRI, ...JSON.parse(salvati) };
        } catch {
        return EMPTY_FILTRI;
        }
    };

    const [filtri, setFiltri] = useState(getInitialFilters);

    const [isSearchActive, setIsSearchActive] = useState(() => hasAnyFilter(getInitialFilters()));

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY_FILTRI, JSON.stringify(filtri));
    }, [filtri]);

    useEffect(() => {
        setVisibleCount(CARDS_BATCH);
    }, [viewMode]);

    useEffect(() => {
        if (isSearchActive) setVisibleCount(CARDS_BATCH);
    }, [filtri, isSearchActive]);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
        const userString = sessionStorage.getItem("user");
        const userObj = userString ? JSON.parse(userString) : null;
        const username = userObj?.username;

        const baseUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/keypeople/react/mod"
            : "http://80.211.138.142:8443/keypeople/react/mod/personal";

        const params = {};
        if (!userHasRole("ADMIN") && username) params.username = username;

        const ownerUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/owner"
            : `http://80.211.138.142:8443/owner/${username}`;

        const aziendeSelectUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/aziende/react/select"
            : `http://80.211.138.142:8443/aziende/react/select/${username}`;

        const [respKP, respAziende, respOwner, respStati] = await Promise.all([
            axios.get(baseUrl, { headers: headers, params }),
            axios.get(aziendeSelectUrl, { headers: headers }),
            axios.get(ownerUrl, { headers: headers }),
            axios.get("http://80.211.138.142:8443/keypeople/react/stati", { headers: headers }),
        ]);

        const kps = respKP.data?.keyPeoples;
        setOriginalKeypeople(Array.isArray(kps) ? kps.map((k) => ({ ...k })) : []);

        setClienteOptions(
            Array.isArray(respAziende.data)
            ? respAziende.data.map((c) => ({ label: c.denominazione, value: c.id }))
            : []
        );

        setOwnerOptions(
            Array.isArray(respOwner.data)
            ? respOwner.data.map((o) => ({ label: o.descrizione, value: o.id }))
            : []
        );

        setStatiOptions(
            Array.isArray(respStati.data)
            ? respStati.data.map((s) => ({ label: s.descrizione, value: s.id }))
            : []
        );

        if (location.state?.fromDashboard) {
            setOpenModalStoricoFromDashboard(true);
        }
        } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        setOriginalKeypeople([]);
        setClienteOptions([]);
        setOwnerOptions([]);
        setStatiOptions([]);
        } finally {
        setLoading(false);
        }
    }, [headers, location.state]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredKeypeople = useMemo(() => {
        if (!isSearchActive) return originalKeypeople;

        if (!hasAnyFilter(filtri)) return originalKeypeople;

        const fNome = filtri.nome ? normalizeStr(filtri.nome) : null;
        const fAziendaId = filtri.azienda != null ? String(filtri.azienda) : null;
        const fStatoId = filtri.stato != null ? String(filtri.stato) : null;
        const fOwnerId = filtri.owner != null ? String(filtri.owner) : null;
        const fTipo = filtri.tipo != null ? String(filtri.tipo) : null;

        return originalKeypeople.filter((kp) => {
        if (fAziendaId && String(kp.cliente?.id) !== fAziendaId) return false;
        if (fStatoId && String(kp.stato?.id) !== fStatoId) return false;
        if (fTipo && String(kp.tipo) !== fTipo) return false;
        if (fOwnerId) {
            const ownerId = kp.cliente?.owner?.id ?? kp.owner?.id;
            if (String(ownerId) !== fOwnerId) return false;
        }
        if (fNome) {
            const full = normalizeStr(`${kp.nome ?? ""} ${kp.cognome ?? ""}`);
            if (!full.includes(fNome)) return false;
        }

        return true;
        });
    }, [originalKeypeople, filtri, isSearchActive]);

    const cardsToRender = useMemo(
        () => filteredKeypeople.slice(0, visibleCount),
        [filteredKeypeople, visibleCount]
    );

    const hasMoreCards = visibleCount < filteredKeypeople.length;
    const fetchMoreCards = () => setVisibleCount((c) => Math.min(c + CARDS_BATCH, filteredKeypeople.length));

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
        await axios.delete(`http://80.211.138.142:8443/keypeople/react/elimina/${id}`, { headers });
        await fetchData();
        } catch (error) {
        console.error("Errore durante la cancellazione:", error);
        }
    };

    const handleRefresh = async () => {
        await fetchData();
    };

    const tipoConverter = (tipoId) => {
        const tipoMap = { 1: "Keypeople", 2: "Hook", 3: "Link" };
        return tipoMap[tipoId] || "";
    };

    const tipoOptions = [
        { label: "Keypeople", value: 1 },
        { label: "Hook", value: 2 },
        { label: "Link", value: 3 },
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
            {params.row?.cliente?.tipologia
                ? params.row.cliente.tipologia.charAt(0).toUpperCase() +
                params.row.cliente.tipologia.slice(1).toLowerCase()
                : ""}
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
        renderCell: (params) => <div style={{ textAlign: "start" }}>{params.row?.cliente?.settoreMercato}</div>,
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
            {params.row?.cliente?.denominazione ? params.row.cliente.denominazione : "N/A"}
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
            <div style={{ textAlign: "start" }}>
            {params.row?.nome} {params.row?.cognome}
            </div>
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
        renderCell: (params) => <div style={{ textAlign: "start" }}>{params.row?.ruolo}</div>,
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
        renderCell: (params) => <div style={{ textAlign: "start" }}>{tipoConverter(params.row?.tipo)}</div>,
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
                <Typography
                sx={{
                    color: "#808080",
                    fontWeight: "bolder",
                    fontSize: "1em"
                }}
                >
                    {t("Stato")}
                </Typography>
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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <CircleIcon sx={{ color, fontSize: "1rem" }} />
            </Box>
            );
        },
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
            <NuovaRicercaKeypeople
            filtri={filtri}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleSearch}
            aziendaOptions={clienteOptions}
            statiOptions={statiOptions}
            ownerOptions={ownerOptions}
            tipoOptions={tipoOptions}
            />
        </Box>

        {viewMode === "cards" ? (
            <InfiniteScroll
            dataLength={cardsToRender.length}
            hasMore={hasMoreCards}
            next={fetchMoreCards}
            loader={
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, overflow: "hidden" }}>
                <CircularProgress sx={{ color: "#00B400" }} />
                </Box>
            }
            >
            <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
                {loading ? (
                Array.from({ length: CARDS_BATCH }).map((_, index) => (
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
                cardsToRender.map((kp, index) => (
                    <Grid item xs={12} md={6} key={kp.id ?? index}>
                    <KeypeopleCardFlip
                        valori={kp}
                        statiOptions={statiOptions}
                        onDelete={() => handleDelete(kp.id)}
                        onRefresh={handleRefresh}
                        isFirstCard={index === 0}
                        openModalStoricoFromDashboard={openModalStoricoFromDashboard}
                    />
                    </Grid>
                ))
                )}
            </Grid>
            </InfiniteScroll>
        ) : (
            <Box sx={{ position: "relative" }}>
            <Tabella
                data={filteredKeypeople}
                columns={columns}
                title={t("Contatti")}
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
        )}

        <Dialog open={openModalStato} onClose={handleCloseModalStato}>
            <DialogTitle>Leggenda degli stati</DialogTitle>
            <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ color: "#FFD700" }} /> <span> Gold: ho ricevuto un’esigenza di business</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ color: "#C0C0C0" }} /> <span>Silver: ho fissato una prospection</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ color: "#b08d57" }} /> <span>Bronze: sono entrato in contatto</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ color: "#5b3a29" }} /> <span>Wood: ho effettuato un’azione senza esito</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon sx={{ color: "black" }} /> <span>Start: non ho ancora effettuato azioni commerciali</span>
                </Box>
            </Box>
            </DialogContent>
        </Dialog>
        </SchemePage>
    );
    };

    export default KeyPeople;
