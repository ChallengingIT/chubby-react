    import React, { useState } from "react";

    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import axios from "axios";
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

    function RicercheNeed({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    statoOptions,
    aziendaOptions,
    ownerOptions,
    onContactChange,
    }) {
    const navigate = useNavigate();

    const theme = useUserTheme();

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
        return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const isRecruiter = userHasRole("ROLE_RECRUITER");

    const [openFiltri, setOpenFiltri] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [contactOptions, setContactOptions] = useState([]);
    const [selectedContact, setSelectedContact] = useState("");
    const [localFiltri, setLocalFiltri] = useState({ ...filtri });

    const handleAziendaChange = async (event, newValue) => {
        onFilterChange("azienda")({ target: { value: newValue?.value || null } });
        const aziendaId = newValue?.value;
        if (aziendaId) {
        try {
            const response = await axios.get(
            `http://localhost:8080/keypeople/react/azienda/${aziendaId}`
            );
            setContactOptions(
            response.data.map((keyPeople) => ({
                label: keyPeople.nome,
                value: keyPeople.id,
            }))
            );
        } catch (error) {
            console.error("Errore durante il recupero dei contatti: ", error);
            setContactOptions([]);
        }
        } else {
        setContactOptions([]);
        }
    };

    const handleContactChange = (event, newValue) => {
        setSelectedContact(newValue?.value || "");
        const contactId = newValue?.value || null;
        onContactChange(contactId);
    };

    const handleClickSearch = () => {
        onFilterChange(localFiltri);
        onSearch();
    };

    const handleClickReset = () => {
        onReset();
        setLocalFiltri({ ...filtri });
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 500);
        setSelectedContact("");
        setContactOptions([]);
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);

    const navigateToAggiungi = () => {
        navigate("/need/aggiungi");
    };

    return (
        <Box
        sx={{
            backgroundColor: "#FEFCFD",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: isRecruiter ? "center" : "space-between",
            justifyContent: "space-between",
            borderRadius: "10px",
            marginBottom: "1rem",
            gap: 20,
        }}
        >
        {!isRecruiter && (
            <Button
            variant="contained"
            // color="primary"
            onClick={navigateToAggiungi}
            sx={{
                mt: 2,
                minWidth: "12em",
                bgcolor: theme.palette.button.main,
                color: theme.palette.textButton.main,
                borderRadius: "10px",
                textTransform: "none",
                "&:hover": {
                bgcolor: theme.palette.button.main,
                color: theme.palette.textButton.main,
                transform: "scale(1.05)",
                },
            }}
            >
            + Aggiungi Need
            </Button>
        )}
        {isRecruiter && <Box sx={{ width: "10%" }} />}

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            {/* Barra di ricerca */}
            <TextField
            id="search-bar"
            variant="outlined"
            placeholder="Cerca Need"
            size="small"
            value={filtri.descrizione}
            onChange={onFilterChange("descrizione")}
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
            mt: 2,
            minWidth: "12em",
            borderRadius: "10px",
            textTransform: "none",
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
                    onChange={handleAziendaChange}
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
                    id="keyPeople-combo-box"
                    options={contactOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                    contactOptions.find(
                        (option) => option.value === selectedContact
                    ) || null
                    }
                    onChange={handleContactChange}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Contatto"
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
                        "& .MuiFilledInput-root.Mui-disabled": {
                            bgcolor: 'transparent',
                            cursor: 'not-allowed',
                            borderBottom: 'none'
                        },
                        "& .Mui-disabled": {
                            cursor: 'not-allowed'
                        }
                        }}
                    />
                    )}
                    disabled={contactOptions.length === 0}
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

    export default RicercheNeed;
