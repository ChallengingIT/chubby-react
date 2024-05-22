    import React, { useState } from "react";
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
    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";

    function RicercheAziende({
    filtri,
    onFilterChange,
    onReset,
    clienteOptions,
    serviziOptions,
    onRicerche
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
        onRicerche();
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);

    const isAdminRole = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        return userObj.roles.includes("ROLE_ADMIN");
        }
        return false;
    };

    return (
        <Box
        sx={{
            backgroundColor: "#FEFCFD",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            borderRadius: "10px",
            marginBottom: "4rem",
        }}
        >
        <Button
            variant="contained"
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
                    id="cliente-combo-box"
                    options={clienteOptions}
                    getOptionLabel={(option) => option.label}
                    // value={
                    // tipologiaOptions.find(
                    //     (option) => option.value === filtri.tipologia
                    // ) || null
                    // }
                    // onChange={(event, newValue) => {
                    // onFilterChange("tipologia")({
                    //     target: { value: newValue?.value || null },
                    // });
                    // }}
                    value={
                    clienteOptions.find(
                        (option) => option.value === filtri.cliente
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("cliente")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Cliente"
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
                    options={serviziOptions}
                    getOptionLabel={(option) => option.label}
                    // value={
                    // tipologiaOptions.find(
                    //     (option) => option.value === filtri.tipologia
                    // ) || null
                    // }
                    // onChange={(event, newValue) => {
                    // onFilterChange("tipologia")({
                    //     target: { value: newValue?.value || null },
                    // });
                    // }}
                    value={
                    serviziOptions.find(
                        (option) => option.value === filtri.servizi
                    ) || null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("servizi")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Tipo servizio"
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

    export default RicercheAziende;
