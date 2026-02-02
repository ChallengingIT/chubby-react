    import React, { useState } from "react";
    import SearchIcon from "@mui/icons-material/Search";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";
    import { useTranslation } from "react-i18next";
    import { motion } from "framer-motion";
    import { Box, FormControl, IconButton, TextField, Autocomplete } from "@mui/material";
    import FilterMultipleAutocomplete from "../fields/FilterMultipleAutocomplete";

    function NuovaRicercaRecruiting({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    statoOptions,
    tipoOptions,
    skillsOptions,
    }) {
    const theme = useUserTheme();
    const { t } = useTranslation();

    const [isRotated, setIsRotated] = useState(false);

    const handleClickReset = () => {
    onReset();
    setIsRotated(true);
    setTimeout(() => setIsRotated(false), 500);
    };


    const handleEnter = (event) => {
        if (event.key === "Enter") {
        event.preventDefault();
        onSearch?.(); 
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
        <Box sx={{ maxWidth: "100%", display: "flex", justifyContent: "space-between", p: 0, m: 0 }}>
            <Box
            sx={{
                width: "100%",
                bgcolor: "#FEFCFD",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                p: 1.2,
                gap: 3,
            }}
            >
            {/* NOME */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <TextField
                variant="filled"
                label={t("Nome")}
                value={filtri.nome || ""}
                onChange={onFilterChange("nome")}
                onKeyDown={handleEnter}
                sx={getFieldSx(theme)}
                />
            </FormControl>

            {/* COGNOME */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <TextField
                variant="filled"
                label={t("Cognome")}
                value={filtri.cognome || ""}
                onChange={onFilterChange("cognome")}
                onKeyDown={handleEnter}
                sx={getFieldSx(theme)}
                />
            </FormControl>

            {/* JOB TITLE / TIPOLOGIA */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                options={tipologiaOptions}
                getOptionLabel={(option) => option.label}
                value={tipologiaOptions.find((o) => o.value === filtri.tipologia) || null}
                onChange={(event, newValue) => {
                    onFilterChange("tipologia")({
                    target: { value: newValue?.value || null },
                    });
                }}
                renderInput={(params) => (
                    <TextField {...params} label={t("Job Title")} variant="filled" sx={getFieldSx(theme)} />
                )}
                />
            </FormControl>

            {/* STATO */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                options={statoOptions}
                getOptionLabel={(option) => option.label}
                value={statoOptions.find((o) => o.value === filtri.stato) || null}
                onChange={(event, newValue) => {
                    onFilterChange("stato")({
                    target: { value: newValue?.value || null },
                    });
                }}
                renderInput={(params) => (
                    <TextField {...params} label={t("Stato")} variant="filled" sx={getFieldSx(theme)} />
                )}
                />
            </FormControl>

            {/* TIPO */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                options={tipoOptions}
                getOptionLabel={(option) => option.label}
                value={tipoOptions.find((o) => o.value === filtri.tipo) || null}
                onChange={(event, newValue) => {
                    onFilterChange("tipo")({
                    target: { value: newValue?.value || null },
                    });
                }}
                renderInput={(params) => (
                    <TextField {...params} label={t("Tipologia")} variant="filled" sx={getFieldSx(theme)} />
                )}
                />
            </FormControl>

            {/* CITTA */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <TextField
                variant="filled"
                label={t("Location")}
                value={filtri.citta || ""}
                onChange={onFilterChange("citta")}
                onKeyDown={handleEnter}
                sx={getFieldSx(theme)}
                />
            </FormControl>

            {/* SKILLS MULTIPLE */}
            <FormControl fullWidth sx={{ mb: 0.2 }}>
                <FilterMultipleAutocomplete
                name="skills"
                label={t("Skills")}
                skillsOptions={skillsOptions}
                value={filtri.skills || []}
                onChange={(newValue) => {
                    onFilterChange("skills")({
                    target: { value: newValue.skills || [] },
                    });
                }}
                />
            </FormControl>

            {/* CERCA */}
            <IconButton
                onClick={onSearch}
                disableRipple
                disableFocusRipple
                sx={{
                backgroundColor: "#00B400",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#116d0e", color: "white", transform: "scale(1.1)" },
                }}
            >
                <SearchIcon />
            </IconButton>

            {/* RESET */}
            <IconButton
                onClick={handleClickReset}
                disableRipple
                disableFocusRipple
                sx={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#282828", color: "white", transform: "scale(1.1)" },
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

    function getFieldSx(theme) {
    return {
        textAlign: "start",
        borderRadius: "20px",
        border: "solid 1px #00B400",
        bgcolor: "white",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
        "& .MuiFilledInput-root": { backgroundColor: "transparent" },
        "& .MuiFilledInput-underline:after": { borderBottomColor: "transparent" },
        "& .MuiFilledInput-root::before": { borderBottom: "none" },
        "&:hover .MuiFilledInput-root::before": { borderBottom: "none" },
        "& .MuiFormLabel-root.Mui-focused": { color: theme.palette.border.main },
    };
    }

    export default NuovaRicercaRecruiting;
