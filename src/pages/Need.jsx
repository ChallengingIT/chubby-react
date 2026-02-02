    import React, { useCallback, useEffect, useMemo, useState } from "react";
    import axios from "axios";
    import NeedCardFlip from "../components/card/NeedCardFlip";
    import SchemePage from "../components/SchemePage.jsx";
    import { useLocation } from "react-router-dom";
    import Tabella from "../components/Tabella";
    import { Box, CircularProgress, Grid, Skeleton, Tabs, Tab } from "@mui/material";
    import NuovaRicercaNeed from "../components/nuoveRicerche/NuovaRicercaNeed.jsx";
    import { useTranslation } from "react-i18next";

    const STORAGE_KEY_FILTRI = "filtriRicercaNeed";

    const EMPTY_FILTRI = {
    descrizione: null,
    cliente: null,
    tipologia: null,
    stato: null,
    owner: null,
    keypeople: null,
    skills: null,
    location: null,
    };

    const normalizeStr = (v) => (v ?? "").toString().trim().toUpperCase();
    const hasAnyFilter = (f) =>
    Object.values(f || {}).some((v) => v !== null && v !== "" && v !== undefined);

    const Need = () => {
    const { t } = useTranslation();
    const location = useLocation();

    const [originalNeed, setOriginalNeed] = useState([]);
    const [loading, setLoading] = useState(false);

    const [viewMode, setViewMode] = useState("cards");
    const [selectedNeed, setSelectedNeed] = useState(null);

    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [aziendaOptions, setAziendaOptions] = useState([]);
    const [skillsOptions, setSkillsOptions] = useState([]);

    const [filtri, setFiltri] = useState(() => {
        if (location.state?.fromDashboard) {
        return {
            ...EMPTY_FILTRI,
            descrizione: location.state.descrizione || null,
            cliente: location.state.clienteId || null,
        };
        }

        const salvati = sessionStorage.getItem(STORAGE_KEY_FILTRI);
        if (!salvati) return EMPTY_FILTRI;

        try {
        return { ...EMPTY_FILTRI, ...JSON.parse(salvati) };
        } catch {
        return EMPTY_FILTRI;
        }
    });

    const [isSearchActive, setIsSearchActive] = useState(() => {
        if (location.state?.fromDashboard) return true;

        try {
        const salvati = sessionStorage.getItem(STORAGE_KEY_FILTRI);
        return salvati ? hasAnyFilter(JSON.parse(salvati)) : false;
        } catch {
        return false;
        }
    });

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

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY_FILTRI, JSON.stringify(filtri));
    }, [filtri]);

    useEffect(() => {
        const fetchSkills = async () => {
        try {
            const responseAree = await axios.get(
            "http://80.211.138.142:8443/staffing/react/areas",
            { headers }
            );

            let groupedSkills = [];

            if (Array.isArray(responseAree.data)) {
            for (const area of responseAree.data) {
                groupedSkills.push({
                label: area.descrizione,
                value: `__header_${area.id}__`,
                isHeader: true,
                });

                try {
                const responseSkillByArea = await axios.get(
                    `http://80.211.138.142:8443/staffing/react/skill/${area.id}`,
                    { headers }
                );

                if (Array.isArray(responseSkillByArea.data)) {
                    const skills = responseSkillByArea.data.map((skill) => ({
                    label: skill.descrizione,
                    value: skill.id,
                    }));
                    groupedSkills = [...groupedSkills, ...skills];
                }
                } catch (err) {
                console.error(
                    `Errore skill area ${area.descrizione}:`,
                    err
                );
                }
            }
            }

            setSkillsOptions(groupedSkills);
        } catch (e) {
            console.error("Errore caricamento aree/skills:", e);
            setSkillsOptions([]);
        }
        };

        fetchSkills();
    }, [headers]);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
        const userString = sessionStorage.getItem("user");
        const u = userString ? JSON.parse(userString) : null;
        const username = u?.username;

        const baseUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/need/react/modificato"
            : "http://80.211.138.142:8443/need/react/modificato/personal";

        const params = {};
        if (!userHasRole("ADMIN") && username) params.username = username;

        const responseNeed = await axios.get(baseUrl, { headers, params });

        const needs = Array.isArray(responseNeed.data?.needs)
            ? responseNeed.data.needs
            : Array.isArray(responseNeed.data)
            ? responseNeed.data
            : [];

        setOriginalNeed(needs);

        const ownerUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/owner"
            : `http://80.211.138.142:8443/owner/${username}`;

        const ownerResponse = await axios.get(ownerUrl, { headers });
        setOwnerOptions(
            Array.isArray(ownerResponse.data)
            ? ownerResponse.data.map((o) => ({ label: o.descrizione, value: o.id }))
            : []
        );

        const aziendeUrl = userHasRole("ADMIN")
            ? "http://80.211.138.142:8443/aziende/react/select"
            : `http://80.211.138.142:8443/aziende/react/select/${username}`;

        const responseAzienda = await axios.get(aziendeUrl, { headers });
        setAziendaOptions(
            Array.isArray(responseAzienda.data)
            ? responseAzienda.data.map((a) => ({ label: a.denominazione, value: a.id }))
            : []
        );

        const responseTipologia = await axios.get(
            "http://80.211.138.142:8443/need/react/tipologia",
            { headers }
        );

        if (Array.isArray(responseTipologia.data)) {
            const allTipologie = responseTipologia.data.map((t) => ({
            label: t.descrizione,
            value: t.id,
            }));

            const consulting = allTipologie.slice(0, 2);
            const talent = allTipologie.slice(2, 5);
            const factory = allTipologie.slice(5);

            setTipologiaOptions([
            { label: "Consulting", value: "__header_consulting__", isHeader: true },
            ...consulting,
            { label: "Talent", value: "__header_talent__", isHeader: true },
            ...talent,
            { label: "Factory", value: "__header_factory__", isHeader: true },
            ...factory,
            ]);
        } else {
            setTipologiaOptions([]);
        }

        const responseStato = await axios.get(
            "http://80.211.138.142:8443/need/react/stato",
            { headers }
        );

        setStatoOptions(
            Array.isArray(responseStato.data)
            ? responseStato.data.map((s) => ({ label: s.descrizione, value: s.id }))
            : []
        );
        } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        setOriginalNeed([]);
        setOwnerOptions([]);
        setAziendaOptions([]);
        setTipologiaOptions([]);
        setStatoOptions([]);
        } finally {
        setLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredNeed = useMemo(() => {
        if (!isSearchActive) return originalNeed;

        const any = hasAnyFilter(filtri);
        if (!any) return originalNeed;

        const fDescrizione = normalizeStr(filtri.descrizione);
        const fClienteId = filtri.cliente != null ? String(filtri.cliente) : null;
        const fTipologiaId = filtri.tipologia != null ? String(filtri.tipologia) : null;
        const fStatoId = filtri.stato != null ? String(filtri.stato) : null;
        const fOwnerId = filtri.owner != null ? String(filtri.owner) : null;
        const fKeyPeopleId = filtri.keypeople != null ? String(filtri.keypeople) : null;
        const fLocation = normalizeStr(filtri.location);

        const fSkills = Array.isArray(filtri.skills)
        ? filtri.skills.map(String)
        : filtri.skills != null
            ? [String(filtri.skills)]
            : [];

        return originalNeed.filter((n) => {
        if (fDescrizione) {
            const d = normalizeStr(n.descrizione);
            if (!d.includes(fDescrizione)) return false;
        }

        if (fClienteId && String(n.cliente?.id) !== fClienteId) return false;
        if (fTipologiaId && String(n.tipologia?.id) !== fTipologiaId) return false;
        if (fStatoId && String(n.stato?.id) !== fStatoId) return false;

        if (fOwnerId) {
            const ob = n.ownerBusiness?.id != null ? String(n.ownerBusiness.id) : null;
            const or = n.ownerRecruiter?.id != null ? String(n.ownerRecruiter.id) : null;
            if (ob !== fOwnerId && or !== fOwnerId) return false;
        }

        if (fKeyPeopleId && String(n.keyPeople?.id) !== fKeyPeopleId) return false;

        if (fLocation) {
            const loc = normalizeStr(n.location);
            if (!loc.includes(fLocation)) return false;
        }

        if (fSkills.length) {
            const needSkillIds = Array.isArray(n.skills)
            ? n.skills
                .map((s) => (s?.id != null ? String(s.id) : null))
                .filter(Boolean)
            : [];

            const ok = fSkills.some((id) => needSkillIds.includes(id));
            if (!ok) return false;
        }

        return true;
        });
    }, [originalNeed, filtri, isSearchActive]);

    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri((curr) => ({ ...curr, [name]: newValue }));
    };

    const handleContactChange = (contattoId) => {
        setFiltri((prev) => ({ ...prev, keypeople: contattoId }));
    };

    const handleSearch = () => {
        setIsSearchActive(true);
    };

    const handleReset = () => {
        setFiltri(EMPTY_FILTRI);
        setIsSearchActive(false);
        sessionStorage.removeItem(STORAGE_KEY_FILTRI);
    };

    const handleDelete = async (id) => {
        try {
        await axios.delete(`http://80.211.138.142:8443/need/react/elimina/${id}`, { headers });
        await fetchData();
        } catch (error) {
        console.error("Errore durante la cancellazione: ", error);
        }
    };

    const handleRefresh = async () => {
        await fetchData();
    };

    const columns = [
        { field: "progressivo", headerName: t("Data Apertura"), flex: 0.8, sortable: false, filterable: false, disableColumnMenu: true },
        {
        field: "azienda",
        headerName: t("Azienda Cliente"),
        flex: 1,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div style={{ textAlign: "start" }}>{params.row?.cliente?.denominazione || "N/A"}</div>
        ),
        },
        { field: "descrizione", headerName: "Need", flex: 1.3, sortable: false, filterable: false, disableColumnMenu: true },
        {
        field: "tipologia",
        headerName: t("Tipologia"),
        flex: 0.6,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
            {params.row?.tipologia?.descrizione || "N/A"}
            </div>
        ),
        },
        { field: "priorita", headerName: t("Priorità"), flex: 0.6, sortable: false, filterable: false, disableColumnMenu: true },
        {
        field: "stato",
        headerName: t("Stato"),
        flex: 0.6,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
            {params.row?.stato?.descrizione || "N/A"}
            </div>
        ),
        },
        { field: "location", headerName: t("Location"), flex: 0.8, sortable: false, filterable: false, disableColumnMenu: true },
        {
        field: "ownerBusiness",
        headerName: t("Business Owner"),
        flex: 0.75,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
            {params.row?.ownerBusiness?.descrizione || "N/A"}
            </div>
        ),
        },
        {
        field: "ownerRecruiter",
        headerName: t("Owner Operativo"),
        flex: 0.75,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <div style={{ textAlign: "start" }}>
            {params.row?.ownerRecruiter?.descrizione || "N/A"}
            </div>
        ),
        },
    ];

    return (
        <SchemePage>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={viewMode} onChange={(e, newValue) => setViewMode(newValue)}>
            <Tab label="Card" value="cards" />
            <Tab label="Tabella" value="table" />
            </Tabs>
        </Box>

        <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
            <NuovaRicercaNeed
            filtri={filtri}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleSearch}
            tipologiaOptions={tipologiaOptions}
            statoOptions={statoOptions}
            ownerOptions={ownerOptions}
            aziendaOptions={aziendaOptions}
            skillsOptions={skillsOptions}
            onContactChange={handleContactChange}
            />
        </Box>

        {viewMode === "cards" ? (
            <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
            {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
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
                filteredNeed.map((need, index) => (
                <Grid item xs={12} md={6} key={need.id ?? index}>
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
        ) : viewMode === "table" ? (
            <Box sx={{ position: "relative" }}>
            <Tabella
                data={filteredNeed}
                columns={columns}
                title={t("Need")}
                getRowId={(row) => row.id}
                onRowClick={(row) => setSelectedNeed(row)}
                getRowClassName={(params) => {
                if (params.row.idNeedPadre !== null && params.row.compilato === false) {
                    return "riga-evidenziata";
                }
                return "";
                }}
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
        ) : null}
        </SchemePage>
    );
    };

    export default Need;
