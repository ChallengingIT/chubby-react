import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import axios from "axios";
import { useUserTheme } from "../TorchyThemeProvider";
import {
    Box,
    FormControl,
    IconButton,
    TextField,
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
    const theme = useUserTheme();
    const [isRotated, setIsRotated] = useState(false);
    const [contactOptions, setContactOptions] = useState([]);
    const [selectedContact, setSelectedContact] = useState("");

    const handleAziendaChange = async (event, newValue) => {
        onFilterChange({
            ...filtri,
            azienda: newValue?.value || null,
        });
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

    return (
        <Container maxWidth='false' sx={{ maxWidth: '75vw', display: 'flex', justifyContent: 'space-around'}}>
            <Box
                sx={{
                    width: '100%',
                    backgroundColor: "#FEFCFD",
                    border: 'solid 2px',
                    borderColor: theme.palette.border.main,
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
                        label="Cerca Need"
                        value={filtri.descrizione || ""}
                        onChange={handleInputChange("descrizione")}
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
                        onChange={handleAutocompleteChange("stato")}
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
                        onChange={handleAutocompleteChange("owner")}
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
                    onClick={() => onSearch(filtri)}
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

export default NuovaRicercaNeed;
