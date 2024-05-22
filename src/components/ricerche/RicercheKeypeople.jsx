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
    } from "@mui/material";

    function RicercheKeypeople({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    aziendaOptions,
    statiOptions,
    ownerOptions,
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
        navigate("/contacts/aggiungi");
    };

    return (
        <Box
        sx={{
            backgroundColor: "#FEFCFD",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "10px",
            marginBottom: "4rem",
        }}
        >
        <Button
            variant="contained"
            // color="primary"
            onClick={navigateToAggiungi}
            sx={{
            minWidth: "12em",
            bgcolor: theme.palette.button.main,
            color: theme.palette.textButton.main,
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                bgcolor: theme.palette.button.main,
                color: theme.palette.textButton.main,
                transform: "scale(1.05)",
            },
            }}
        >
            + Aggiungi Contatto
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
            id="search-bar"
            variant="outlined"
            placeholder="Cerca Contatto"
            size="small"
            value={filtri.nome}
            onChange={onFilterChange("nome")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
                }
            }}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon
                    sx={{
                        color: theme.palette.icon.main,
                    }}
                    />
                </InputAdornment>
                ),
            }}
            sx={{
                width: "25em",
                mb: 0.5,
                "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
                "& fieldset": {
                    borderColor: theme.palette.border.main,
                    borderRadius: "4px 0 0 4px",
                },
                "&:hover fieldset": {
                    borderColor: theme.palette.border.main,
                },
                "&.Mui-focused fieldset": {
                    borderColor: theme.palette.border.main,
                },
                },
            }}
            />
        </Box>
        <Button
            variant="contained"
            // color="primary"
            onClick={handleOpenFiltri}
            sx={{
            bgcolor: theme.palette.button.main,
            color: theme.palette.textButton.main,
            minWidth: "12em",
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                bgcolor: theme.palette.button.main,
                color: theme.palette.textButton.main,
                transform: "scale(1.05)",
            },
            }}
        >
            Filtra per:
        </Button>

        <Drawer
            anchor="right"
            open={openFiltri}
            onClose={handleCloseFiltri}
            sx={{ "& .MuiDrawer-paper": { width: "250px" } }}
        >
            <Box sx={{ width: 250, p: 2 }} role="presentation">
            <Box
                sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                }}
            >
                <Typography
                variant="h6"
                sx={{ mb: 2, color: "black", fontWeight: "bold" }}
                >
                Filtri
                </Typography>
                <IconButton onClick={handleCloseFiltri} sx={{ mb: 2 }}>
                <CloseIcon />
                </IconButton>
            </Box>
            </Box>
            <Grid container spacing={2} direction="column" sx={{ p: 2 }}>
            <Grid item>
                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="azienda-combo-box"
                    options={aziendaOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    aziendaOptions.find(
                        (option) => option.value === filtri.azienda
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("azienda")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Azienda"
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

                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="stato-combo-box"
                    options={statiOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    statiOptions.find(
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

                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="owner-combo-box"
                    options={ownerOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    ownerOptions.find(
                        (option) => option.value === filtri.owner
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("owner")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Owner"
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

                <Box sx={{ display: "flex", justifyContent: "space-around" }}>
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
                        backgroundColor: theme.palette.button.main,
                        color: "white",
                        trasform: "scale(1.1)",
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
                        backgroundColor: "black",
                        color: "white",
                        trasform: "scale(1.1)",
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
            </Grid>
            </Grid>
        </Drawer>
        </Box>
    );
    }

    export default RicercheKeypeople;
