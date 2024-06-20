    import React, { useState } from "react";

    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
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

    function RicercheNeedMatch({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    tipoOptions,
    seniorityOptions,
    onGoBack,
    }) {
    const theme = useUserTheme();
    const [openFiltri, setOpenFiltri] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [localFiltri, setLocalFiltri] = useState({ ...filtri });

    const handleClickSearch = () => {
        onFilterChange(localFiltri);
        onSearch();
    };

    const handleClickReset = () => {
        onReset();
        setLocalFiltri({ ...filtri });
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 500);
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);

    return (
        <Box
        sx={{
            backgroundColor: "#FEFCFD",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "10px",
            marginBottom: "1rem",
        }}
        >
        <Button
            onClick={onGoBack}
            variant="contained"
            sx={{
            minWidth: "12em",
            // backgroundColor: "#00B401",
            bgcolor: theme.palette.button.main,
            color: theme.palette.textButton.main,
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                bgcolor: theme.palette.button.mainHover,
                color: theme.palette.textButton.main,
                transform: "scale(1.05)",
            },
            }}
        >
            <span style={{ marginRight: "0.5rem" }}>{"<"}</span>
            Indietro
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            {/* Barra di ricerca */}
            <TextField
            id="search-bar"
            variant="outlined"
            placeholder="Nome"
            size="small"
            value={filtri.nome || ""}
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
                width: "20em",
                minWidth: "10em",
                mb: 0.5,
                "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
                "& fieldset": {
                    borderColor: theme.palette.border.main,
                    borderRadius: "4px 0 0 4px",
                    // borderRight: 'none',
                },
                "&:hover fieldset": {
                    borderColor: theme.palette.border.mainHover,
                },
                "&.Mui-focused fieldset": {
                    borderColor: theme.palette.border.mainHover,
                },
                },
            }}
            />

            <TextField
            id="search-location"
            variant="outlined"
            placeholder="Cognome"
            size="small"
            value={filtri.cognome || ""}
            onChange={onFilterChange("cognome")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
                }
            }}
            sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                mb: 0.5,
                width: "20em",
                minWidth: "10em",

                "& .MuiOutlinedInput-root": {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeft: 0,
                borderColor: theme.palette.border.main,
                "&:hover fieldset": {
                    borderColor: theme.palette.border.mainHover,
                },
                "&.Mui-focused": {
                    borderColor: theme.palette.border.main,
                },
                },
                "& .MuiInputLabel-root": {
                color: "black",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.border.main,
                },
                "& .MuiOutlinedInput-input": {
                color: "black",
                },
                "& .MuiPlaceholder-root": {
                color: "black",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.border.main,
                },
            }}
            />
        </Box>

        <Button
            variant="contained"
            color="primary"
            onClick={handleOpenFiltri}
            sx={{
            bgcolor: theme.palette.button.main,
            color: theme.palette.textButton.main,
            minWidth: "12em",
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                bgcolor: theme.palette.button.mainHover,
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
                <IconButton onClick={handleCloseFiltri} sx={{ 
                    mb: 2,
                    bgcolor: 'transparent',
                    '&:hover': {
                        bgcolor: 'transparent'
                    }
                    }}>
                <CloseIcon sx={{ 
                    backgroundColor: 'transparent',
                    '&:hover': {
                        color: 'red',
                        backgroundColor: 'transparent'
                    }
                    }}/>                 
                    </IconButton>
            </Box>
            </Box>

            <Grid container spacing={2} direction="column" sx={{ p: 2 }}>
            <Grid item>
                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="tipo-combo-box"
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

                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="tipologia-combo-box"
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
                        label="Jobtitle"
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
                    id="seniority-combo-box"
                    options={seniorityOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    seniorityOptions.find(
                        (option) => option.value === filtri.seniority
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("seniority")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Seniority"
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
                        backgroundColor: theme.palette.button.mainHover,
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
    export default RicercheNeedMatch;
