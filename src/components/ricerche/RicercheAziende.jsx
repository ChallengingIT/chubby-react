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
    import CloseIcon  from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";

    function RicercheAziende({
    filtri,
    onFilterChange,
    onReset,
    tipologiaOptions,
    ownerOptions,
    onRicerche,
    idaOptions,
    }) {
    const navigate = useNavigate();

    const [openFiltri, setOpenFiltri] = useState(false);
    const [isRotated, setIsRotated] = useState(false);

    const handleClickReset = () => {
        onReset();
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 500);
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);

    const navigateToAggiungi = () => {
        navigate("/business/aggiungi");
    };

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
            justifyContent: "space-between",
            borderRadius: "10px",
            marginBottom: "4rem",
        }}
        >
        <Button
            variant="contained"
            color="primary"
            onClick={navigateToAggiungi}
            sx={{
            minWidth: "12em",
            backgroundColor: "#00B401",
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                backgroundColor: "#00B401",
                transform: "scale(1.05)",
            },
            }}
        >
            + Aggiungi Azienda
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
            id="search-bar"
            variant="outlined"
            placeholder="Cerca Azienda"
            size="small"
            value={filtri.denominazione}
            onChange={onFilterChange("denominazione")}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                event.preventDefault();
                onRicerche();
                }
            }}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#00B401" }} />
                </InputAdornment>
                ),
            }}
            sx={{
                width: "25em",
                mb: 0.5,
                "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
                "& fieldset": {
                    borderColor: "#00B401",
                    borderRadius: "4px 0 0 4px",
                },
                "&:hover fieldset": {
                    borderColor: "#00B401",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "#00B401",
                },
                },
            }}
            />
        </Box>
        <Button
            variant="contained"
            color="primary"
            onClick={handleOpenFiltri}
            sx={{
            backgroundColor: "#00B401",
            minWidth: "12em",
            borderRadius: "10px",
            textTransform: "none",
            mt: 2,
            "&:hover": {
                backgroundColor: "#00B401",
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
                            color: "#00B400",
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                    id="ida-combo-box"
                    options={idaOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    idaOptions.find((option) => option.value === filtri.ida) ||
                    null
                    }
                    onChange={(event, newValue) => {
                    onFilterChange("ida")({
                        target: { value: newValue?.value || null },
                    });
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="IDA"
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
                            color: "#00B400",
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                {isAdminRole() && (
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
                            color: "#00B400",
                            },
                        }}
                        />
                    )}
                    />
                </FormControl>
                )}

                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
