import React, { useState } from "react";
import {
    Box,
    FormControl,
    IconButton,
    TextField,
    Autocomplete,
    Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useTranslation } from 'react-i18next';
import { useUserTheme } from "../TorchyThemeProvider";
import { motion } from "framer-motion";

function NuovaRicercaAziende({
    filtri,
    onFilterChange,
    onReset,
    onSearch,
    tipologiaOptions,
    ownerOptions,
    idaOptions,
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

    const isAdminRole = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObj = JSON.parse(userString);
            return userObj.roles.includes("ADMIN");
        }
        return false;
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
        <Container maxWidth='false' sx={{ maxWidth: '75vw', maxHeight: '20vh', display: 'flex', justifyContent: 'space-around'}}>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: "#FEFCFD",
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
                        label={t('Cerca Azienda')} 
                        value={filtri.denominazione || ""}
                        onChange={handleInputChange("denominazione")}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                onSearch();
                            }
                        }}
                        sx={{
                            textAlign: "left",
                            borderRadius: "20px",
                            border: 'solid 1px #00B400',
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
                                label={t('Tipologia')} 
                                variant="filled"
                                sx={{
                                    textAlign: "left",
                                    borderRadius: "20px",
                                    border: 'solid 1px #00B400',
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
                        id="ida-combo-box"
                        options={idaOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                            idaOptions.find((option) => option.value === filtri.ida) ||
                            null
                        }
                        onChange={handleAutocompleteChange("ida")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('IDA')} 
                                variant="filled"
                                sx={{
                                    textAlign: "left",
                                    borderRadius: "20px",
                                    border: 'solid 1px #00B400',
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

                {isAdminRole() && (
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
                                    label={t('Owner')} 
                                    variant="filled"
                                    sx={{
                                        textAlign: "left",
                                        borderRadius: "20px",
                                        border: 'solid 1px #00B400',
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
                )}

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

export default NuovaRicercaAziende;
