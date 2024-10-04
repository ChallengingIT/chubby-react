    import React, { useState } from "react";

    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";
    import { useTranslation } from 'react-i18next';
    import { motion } from "framer-motion";

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
    const { t } = useTranslation();

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

        // Varianti di animazione per far spuntare il box
        const boxVariants = {
            hidden: { opacity: 0, y: 50 }, // Parte dal basso con opacità 0
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Appare al centro
        };

    return (
        <motion.div
                initial="hidden" 
                animate="visible" 
                variants={boxVariants} 
            >
        <Box sx={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-around', p: 0, m: 0}}>

        <Box
        sx={{
            width: '100%',
            bgcolor: "#FEFCFD",
            // border: 'solid 2px #00B400',
            borderRadius: '20px',
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            p: 1.2,
            gap: 3
        }}
        >
        
            <FormControl fullWidth sx={{ mb: 0.2}}>

            <TextField
            id="search-bar"
            variant="filled"
            label={t("Nome")}
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
                        border: 'solid 1px #00B400',
                        bgcolor: 'white',
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
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
            label={t("Cognome")}
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
                        border: 'solid 1px #00B400',
                        bgcolor: 'white',
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
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
                        label={t("Job Title")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        border: 'solid 1px #00B400',
                        bgcolor: 'white',
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
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
                        label={t("Stato")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        border: 'solid 1px #00B400',
                        bgcolor: 'white',
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
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
                        label={t("Tipologia")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
                        border: 'solid 1px #00B400',
                        bgcolor: 'white',
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
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
                    onClick={onSearch}
                    disableRipple={true}
                    disableFocusRipple={true}
                    sx={{
                        backgroundColor: "#00B400",
                        color: "white",
                        textTransform: "lowercase",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: '#116d0e',
                            color: "white",
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <SearchIcon />
                </IconButton>
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
                            backgroundColor: "#282828",
                            color: "white",
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <RestartAltIcon
                        sx={{
                            transition: "transform 0.5s ease-in-out",
                            transform: isRotated ? "rotate(720deg)" : "none",
                        }}
                    />
                </IconButton>
                </Box>
        </Box>
    </motion.div>

    );
    }
    export default NuovaRicercaRecruiting;
