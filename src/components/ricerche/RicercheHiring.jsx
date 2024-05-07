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
Popover,
List,
ListItem,
ListItemText,
ListItemIcon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; //recruiting
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'; //head hunting
import PunchClockIcon from '@mui/icons-material/PunchClock'; //temporary
import GroupsIcon from '@mui/icons-material/Groups'; //staffing


function RicercheHiring({
    filtri,
    onFilterChange,
    onReset,
    onRicerche,
}) {
    const navigate = useNavigate();
    //stati per le ricerche
    const [openFiltri, setOpenFiltri] = useState(false);
    const [isRotated, setIsRotated] = useState(false);

    //stati per il popover
    const [anchorEl, setAnchorEl] = useState(null); 
    const openPopover = Boolean(anchorEl);



    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAdditionalDrawerClose = () => {
        setAnchorEl(null);
    };

    const navigateToAggiungiRecruiting = () => {
        // navigate("/aggiungi/recruiting");

    };

    const navigateToAggiungiHeadHunting = () => {
        // navigate("/aggiungi/headhunting");
    };

    const navigateToAggiungiTemporary = () => {
        navigate("");
    };

    const navigateToAggiungiStaffing = () => {
        navigate("");
    };



    const additionalDrawerContent = (
        <List>

        <ListItem button onClick={navigateToAggiungiRecruiting}>
        <PersonSearchIcon sx={{ color: "#00B401", mr: 2 }} />
            <ListItemText primary="Recruiting" />
            <ListItemIcon>
            </ListItemIcon>
        </ListItem>

        <ListItem button onClick={navigateToAggiungiHeadHunting}>
        <LocationSearchingIcon sx={{ color: "#00B401", mr: 2 }} />
            <ListItemText primary="Head hunting" />
            <ListItemIcon>
            </ListItemIcon>
        </ListItem>
        
        <ListItem button onClick={navigateToAggiungiTemporary}>
        <PunchClockIcon sx={{ color: "#00B401", mr: 2 }} />
            <ListItemText primary="Temporary" />
            <ListItemIcon>
            </ListItemIcon>
        </ListItem>

        <ListItem button onClick={navigateToAggiungiStaffing}>
        <GroupsIcon sx={{ color: "#00B401", mr: 2 }} />
            <ListItemText primary="Staffing" />
            <ListItemIcon>
            </ListItemIcon>
        </ListItem>
        </List>
    );







    const handleClickReset = () => {
        onReset();
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
            marginBottom: "2rem",
            width: "100%",
            overflow: "hidden",
            p: 2
        }}
        >
        <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            sx={{
            minWidth: "12em",
            backgroundColor: "#00B401",
            borderRadius: "10px",
            textTransform: "none",
            ml: 2,
            "&:hover": {
                backgroundColor: "#00B401",
                transform: "scale(1.05)",
            },
            }}
        >
            + Aggiungi Servizio
        </Button>
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleAdditionalDrawerClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box sx={{ width: 250 }}>{additionalDrawerContent}</Box>
        </Popover>

        <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Barra di ricerca */}
            {/* <TextField
            id="search-bar"
            variant="outlined"
            placeholder="Nome"
            size="small"
            value={filtri.nome}
            onChange={onFilterChange("nome")}
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
                width: "20em",
                minWidth: "10em",
                mb: 0.5,
                "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
                "& fieldset": {
                    borderColor: "#00B401",
                    borderRadius: "4px 0 0 4px",
                    // borderRight: 'none',
                },
                "&:hover fieldset": {
                    borderColor: "#00B401",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "#00B401",
                },
                },
            }}
            /> */}
            <Box />

        </Box>
        <Button
            variant="contained"
            color="primary"
            onClick={handleOpenFiltri}
            sx={{
            minWidth: "12em",
            backgroundColor: "#00B401",
            borderRadius: "10px",
            textTransform: "none",
            mr: 2,
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
                <IconButton
                onClick={handleCloseFiltri}
                sx={{ color: "black", mb: 2 }}
                >
                <CloseIcon />
                </IconButton>
            </Box>
            </Box>

            <Grid container spacing={2} direction="column" sx={{ p: 2 }}>
            <Grid item>
                {/* <FormControl fullWidth sx={{ mb: 2 }}>
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
                            color: "#00B400",
                        },
                        }}
                    />
                    )}
                />
                </FormControl>

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
                        label="Tipo"
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
                </FormControl> */}
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
                        transition: "transform 0.4s ease-in-out",
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

export default RicercheHiring