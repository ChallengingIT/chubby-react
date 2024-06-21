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
    Container,
    } from "@mui/material";
    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import { useUserTheme } from "../TorchyThemeProvider";

    function NuovaRicercaAziende({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    ownerOptions,
    idaOptions,
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
        <Container maxWidth='false' sx={{ maxWidth: '75vw', display: 'flex', justifyContent: 'space-around'}}>
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
            label="Cerca Azienda"
            // size="small"
            value={filtri.denominazione || ""}
            onChange={onFilterChange("denominazione")}
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
                    id="tipologia-combo-box"
                    options={tipologiaOptions}
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
                            color: theme.palette.border.main,
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 0.2 }}>
                <Autocomplete
                    id="ida-combo-box"
                    options={idaOptions}
                    getOptionLabel={(option) => option.label}
                    // value={
                    // idaOptions.find((option) => option.value === filtri.ida) ||
                    // null
                    // }
                    // onChange={(event, newValue) => {
                    // onFilterChange("ida")({
                    //     target: { value: newValue?.value || null },
                    // });
                    // }}
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
                            color: theme.palette.border.main,
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

                {isAdminRole() && (
                <FormControl fullWidth sx={{ mb: 0.2 }}>
                    <Autocomplete
                    id="owner-combo-box"
                    options={ownerOptions}
                    getOptionLabel={(option) => option.label}
                    // value={
                    //     ownerOptions.find(
                    //     (option) => option.value === filtri.owner
                    //     ) || null
                    // }
                    // onChange={(event, newValue) => {
                    //     onFilterChange("owner")({
                    //     target: { value: newValue?.value || null },
                    //     });
                    // }}
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
                )}

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
        </Container>
    );
    }

    export default NuovaRicercaAziende;
