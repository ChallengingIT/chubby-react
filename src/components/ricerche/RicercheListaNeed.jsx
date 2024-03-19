import React, { useState } from 'react';
import { Button, Box, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Drawer, Typography, TextField, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon                                       from '@mui/icons-material/Search';



function RicercheNeed({ filtri, onFilterChange, onReset, tipologiaOptions, statoOptions, ownerOptions, onRicerche, onNavigate }) {


    const [ openFiltri,                setOpenFiltri            ] = useState(false);

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);





    return (
        <Box
        sx={{
            backgroundColor: '#FEFCFD', 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderRadius: '10px',  
            marginBottom: '4rem',
            
        }}
        >
            <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={onNavigate} 
                        sx={{
                            mt: 2,
                            minWidth: '12em',
                            backgroundColor: '#00853C',
                            borderRadius: '10px',
                            textTransform: 'none',
                            '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>
                        + Aggiungi Need
                        </Button>
    
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            {/* Barra di ricerca */}
                            <TextField
                                id="search-bar"
                                variant="outlined"
                                placeholder="Cerca Need"
                                size="small"
                                value={filtri.descrizione}
                                onChange={onFilterChange('descrizione')}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        onRicerche();
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#00853C' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '25em',
                                    mb: 0.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0px', 
                                        '& fieldset': {
                                            borderColor: '#00853C', 
                                            borderRadius: '4px 0 0 4px', 
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#00853C', 
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#00853C', 
                                        },
                                    },
                                }}
                            />
    
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleOpenFiltri} sx={{
                        backgroundColor: '#00853C',
                        mt:2,
                        minWidth: '12em',
                        borderRadius: '10px',
                        textTransform: 'none',
                        '&:hover': {
                        backgroundColor: '#00853C',
                        transform: 'scale(1.05)',
                        },
                    }}>
                        Filtra per: 
                    </Button>  


        
    <Drawer
    anchor='right'
    open={openFiltri}
    onClose={handleCloseFiltri}
    sx={{ '& .MuiDrawer-paper': { width: '250px' } }}
    >
    <Box 
        sx={{ width: 250, p: 2 }}
        role="presentation"
        >
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
            >
                <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
                            Filtri
                        </Typography>
                        <IconButton
                            onClick={handleCloseFiltri}
                            sx={{  mb: 2 }}
                        >
                            <CloseIcon />
                        </IconButton>
            </Box>
        </Box>
        <Grid container spacing={2} direction="column" sx={{ p: 2}}>
            <Grid item>
            {/* <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="azienda-label">Azienda</InputLabel>
                            <Select
                                labelId="azienda-label"
                                displayEmpty
                                value={filtri.azienda || ''} 
                                onChange={onFilterChange('azienda')}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em></em>;
                                    }
                                    const selectedLabel = aziendaOptions.find(option => option.value === selected)?.label;
                                    return selectedLabel || selected;
                                }}
                            >
                                
                                {aziendaOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl> */}

            <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="tipologia-label">Tipologia</InputLabel>
                            <Select
                                labelId="tipologia-label"
                                displayEmpty
                                value={filtri.tipologia || ''} 
                                onChange={onFilterChange('tipologia')}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em></em>;
                                    }
                                    const selectedLabel = tipologiaOptions.find(option => option.value === selected)?.label;
                                    return selectedLabel || selected;
                                }}
                            >
                                
                                {tipologiaOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
    
                            <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="stato-label">Stato</InputLabel>
                            <Select
                                labelId="stato-label"
                                displayEmpty
                                value={filtri.stato || ''} 
                                onChange={onFilterChange('stato')}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em></em>;
                                    }
                                    const selectedLabel = statoOptions.find(option => option.value === selected)?.label;
                                    return selectedLabel || selected;
                                }}
                            >
                                
                                {statoOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
    
                            <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="owner-label">Owner</InputLabel>
                            <Select
                                labelId="owner-label"
                                displayEmpty
                                value={filtri.owner || ''} 
                                onChange={onFilterChange('owner')}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em></em>;
                                    }
                                    const selectedLabel = ownerOptions.find(option => option.value === selected)?.label;
                                    return selectedLabel || selected;
                                }}
                            >
                                
                                {ownerOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
    
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Button 
                            onClick={onReset}
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textTransform: 'lowercase',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                    trasform: '1.05'
                                },
                            }}>
                                Reset
                            </Button>
                            </Box>
            </Grid>
        </Grid>

    </Drawer>
    </Box>


    );
};

export default RicercheNeed;