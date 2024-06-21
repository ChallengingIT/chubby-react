    import React, { useState } from "react";

    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";
    import {
    Button,
    Box,
    Grid,
    FormControl,
    IconButton,
    Drawer,
    Typography,
    TextField,
    InputAdornment,
    Autocomplete,
    Container
    } from "@mui/material";

    function NuovaRicercaRecruiting({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    statoOptions,
    tipoOptions,
    }) {
    const navigate = useNavigate();
    const theme = useUserTheme();

    const [openFiltri, setOpenFiltri] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [localFiltri, setLocalFiltri] = useState({ ...filtri });

    const handleClickReset = () => {
        onReset();
        setLocalFiltri({ ...filtri });
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 500);
    };

    const handleClickSearch = () => {
        onFilterChange(localFiltri);
        onSearch();
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);

    const navigateToAggiungi = () => {
        navigate("/recruiting/aggiungi");
    };

    return (
        <Box sx={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-around', p: 0, m: 0}}>

        <Box
        sx={{
            width: '100%',
            backgroundColor: "#FEFCFD",
            border: 'solid 2px #00B400',
            borderRadius: '20px',
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            p: 3,
            gap: 3
        }}
        >
        
            <FormControl fullWidth sx={{ mb: 0.2 }}>

            <TextField
            id="search-bar"
            variant="filled"
            placeholder="Nome"
            value={filtri.nome || ""}
            onChange={onFilterChange("nome")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
                }
            }}
            sx={{
                        textAlign: "start",
                        borderRadius: "20px",
                        backgroundColor: "#EDEDED",
                        "& .MuiFilledInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiFilledInput-underline:after": {
                            borderBottomColor: "transparent",
                        },
                        "& .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "&:hover .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: theme.palette.border.main,
                        },
                        }}
            />
            </FormControl>

                        
                        
            <FormControl fullWidth sx={{ mb: 0.2 }}>
            <TextField
            id="search-location"
            variant="filled"
            placeholder="Cognome"
            value={filtri.cognome || ""}
            onChange={onFilterChange("cognome")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
                }
            }}
            sx={{
                        textAlign: "start",
                        borderRadius: "20px",
                        backgroundColor: "#EDEDED",
                        "& .MuiFilledInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiFilledInput-underline:after": {
                            borderBottomColor: "transparent",
                        },
                        "& .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "&:hover .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: theme.palette.border.main,
                        },
                        }}
            />

            </FormControl>
                <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                    id="jobTitle-combo-box"
                    options={tipologiaOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    tipologiaOptions.find(
                        (option) => option.value === filtri.tipologia
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("tipologia")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Job Title"
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        backgroundColor: "#EDEDED",
                        "& .MuiFilledInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiFilledInput-underline:after": {
                            borderBottomColor: "transparent",
                        },
                        "& .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "&:hover .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: theme.palette.border.main,
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                    id="stato-combo-box"
                    options={statoOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    statoOptions.find(
                        (option) => option.value === filtri.stato
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("stato")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Stato"
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        backgroundColor: "#EDEDED",
                        "& .MuiFilledInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiFilledInput-underline:after": {
                            borderBottomColor: "transparent",
                        },
                        "& .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "&:hover .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: theme.palette.border.main,
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                    id="tipologia-combo-box"
                    options={tipoOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    tipoOptions.find((option) => option.value === filtri.tipo) ||
                    null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("tipo")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Tipologia"
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        backgroundColor: "#EDEDED",
                        "& .MuiFilledInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiFilledInput-underline:after": {
                            borderBottomColor: "transparent",
                        },
                        "& .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "&:hover .MuiFilledInput-root::before": {
                            borderBottom: "none",
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                            color: theme.palette.border.main,
                        },
                        }}
                    />
                    )}
                />
                </FormControl>
                <IconButton
                    onClick={handleClickSearch}
                    disableRipple={true}
                    disableFocusRipple={true}
                    sx={{
                    backgroundColor: theme.palette.button.main,
                    color: "white",
                    textTransform: "lowercase",
                    fontWeight: "bold",
                    "&:hover": {
                        backgroundColor: theme.palette.button.mainHover,
                        color: "white",
                        trasform: "scale(1.1)",
                    },
                    }}
                >
                    <SearchIcon />
                </IconButton>{" "}
                <IconButton
                    onClick={handleClickReset}
                    disableRipple={true}
                    disableFocusRipple={true}
                    sx={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "lowercase",
                    fontWeight: "bold",
                    "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        trasform: "scale(1.1)",
                    },
                    }}
                >
                    <RestartAltIcon
                    sx={{
                        transition: "transform 0.4s ease-in-out",
                        transform: isRotated ? "rotate(720deg)" : "none",
                    }}
                    />
                </IconButton>
                </Box>
        </Box>
    );
    }
    export default NuovaRicercaRecruiting;
