    import React, { useState } from "react";

    import CloseIcon from "@mui/icons-material/Close";
    import SearchIcon from "@mui/icons-material/Search";
    import { Form, useNavigate } from "react-router-dom";
    import RestartAltIcon from "@mui/icons-material/RestartAlt";
    import axios from "axios";
    import { useUserTheme } from "../TorchyThemeProvider";
    import { useLocation } from 'react-router-dom';

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

    function NuovaRicercaNeed({
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
            placeholder="Cerca Need"
            value={filtri.descrizione || ""}
            onChange={onFilterChange("descrizione")}
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

                {/* <FormControl fullWidth sx={{ mb: 0.2 }}>
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
                </FormControl> */}

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
                        transition: "transform 0.5s ease-in-out",
                        transform: isRotated ? "rotate(720deg)" : "none",
                    }}
                    />
                </IconButton>
                
        </Box>
        </Container>
    );
    }

    export default NuovaRicercaNeed;
