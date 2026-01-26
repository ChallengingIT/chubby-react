    import React, { useState } from "react";

    import SearchIcon from "@mui/icons-material/Search";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";
    import { useTranslation } from 'react-i18next';
    import { motion } from "framer-motion";
    import {
    Box,
    FormControl,
    IconButton,
    TextField,
    Autocomplete,
    Container
    } from "@mui/material";

    function NuovaRicercaListaNeed({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    statoOptions,
    keyPeopleOptions,
    ownerOptions,
    onRicerche,
    onNavigate,
    }) {
    const theme = useUserTheme();
    const { t } = useTranslation();


    const [isRotated, setIsRotated] = useState(false);

    const handleClickReset = () => {
        onReset();
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 500);
    };

    const handleInputChange = (name) => (event) => {
        onFilterChange({
            ...filtri,
            [name]: event.target.value,
        });
    };

    const handleAutocompleteChange = (name) => (event, newValue) => {
        onFilterChange({
            ...filtri,
            [name]: newValue?.value || null,
        });
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
        <Container maxWidth='false' sx={{ maxWidth: '75vw', display: 'flex', justifyContent: 'space-around'}}>

        <Box
        sx={{
            width: '100%',
            bgcolor: '#FEFCFD',
            // border: 'solid 2px',
            // borderColor: theme.palette.border.main,
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
            <FormControl fullWidth sx={{ mb: 0.2 }}>

            <TextField
            id="search-bar"
            variant="filled"
            label={t("Cerca Need")}
            value={filtri.descrizione || ""}
            onChange={handleInputChange("denominazione")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onRicerche();
                }
            }}

            sx={{
                        textAlign: "start",
                        borderRadius: "20px",
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
                    id="tipologia-combo-box"
                    options={tipologiaOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    tipologiaOptions.find(
                        (option) => option.value === filtri.tipologia
                    ) || null
                    }
                    onChange={handleAutocompleteChange("tipologia")}

                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("Tipologia")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
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
                    onChange={handleAutocompleteChange("stato")}

                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("Stato")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
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
                    id="owner-combo-box"
                    options={ownerOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    ownerOptions.find(
                        (option) => option.value === filtri.owner
                    ) || null
                    }
                    onChange={handleAutocompleteChange("owner")}

                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("Owner")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
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
                    id="keyPeople-combo-box"
                    options={keyPeopleOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    keyPeopleOptions.find(
                        (option) => option.value === filtri.keyPeople
                    ) || null
                    }
                    onChange={handleAutocompleteChange("keyPeople")}

                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("Contacts")}
                        variant="filled"
                        sx={{
                        textAlign: "left",
                        borderRadius: "20px",
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
                        boxShadow: "9px 9px 9px rgba(0, 0, 0, 0.1)",
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
                        boxShadow: "9px 9px 9px rgba(0, 0, 0, 0.1)",
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
        </Container>
        </motion.div>
    );
    }

    export default NuovaRicercaListaNeed;
