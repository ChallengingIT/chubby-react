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
    const theme = useUserTheme();

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
            return userObj.roles.includes("ROLE_ADMIN");
        }
        return false;
    };

    return (
        <Container maxWidth='false' sx={{ maxWidth: '75vw', maxHeight: '20vh', display: 'flex', justifyContent: 'space-around'}}>
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
                )}

                <IconButton
                    onClick={onSearch}
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
