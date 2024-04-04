import React, { useState }                                                                                                         from 'react';
import { Button, Box, Grid, Select, MenuItem, FormControl, InputLabel, IconButton, Drawer, Typography, TextField, InputAdornment, Autocomplete } from '@mui/material';
import CloseIcon                                                                                                                   from '@mui/icons-material/Close';
import SearchIcon                                                                                                                  from '@mui/icons-material/Search';



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
                            backgroundColor: '#00B401',
                            borderRadius: '10px',
                            textTransform: 'none',
                            '&:hover': {
                            backgroundColor: '#00B401',
                            transform: 'scale(1.05)',
                        },
                    }}>
                        + Aggiungi Need
                        </Button>
    
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
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
                                            <SearchIcon sx={{ color: '#00B401' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '25em',
                                    mb: 0.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0px', 
                                        '& fieldset': {
                                            borderColor: '#00B401', 
                                            borderRadius: '4px 0 0 4px', 
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#00B401', 
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#00B401', 
                                        },
                                    },
                                }}
                            />
    
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleOpenFiltri} sx={{
                        backgroundColor: '#00B401',
                        mt:2,
                        minWidth: '12em',
                        borderRadius: '10px',
                        textTransform: 'none',
                        '&:hover': {
                        backgroundColor: '#00B401',
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

            <FormControl fullWidth sx={{ mb: 2 }}>
            <Autocomplete
                                id="tipologia-combo-box"
                                options={tipologiaOptions}
                                getOptionLabel={(option) => option.label}
                                value={tipologiaOptions.find(option => option.value === filtri.tipologia) || null}
                                onChange={(event, newValue) => {
                                    onFilterChange('tipologia')({ target: { value: newValue?.value || null } });
                                }}
                                renderInput={(params) => <TextField {...params} label="Tipologia" />}
                            />
                            {/* <InputLabel id="tipologia-label">Tipologia</InputLabel>
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
                            </Select> */}
                            </FormControl>
    
                            <FormControl fullWidth sx={{ mb: 2 }}>
                            <Autocomplete
                                id="stato-combo-box"
                                options={statoOptions}
                                getOptionLabel={(option) => option.label}
                                value={statoOptions.find(option => option.value === filtri.stato) || null}
                                onChange={(event, newValue) => {
                                    onFilterChange('stato')({ target: { value: newValue?.value || null } });
                                }}
                                renderInput={(params) => <TextField {...params} label="Stato" />}
                            />
                            {/* <InputLabel id="stato-label">Stato</InputLabel>
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
                            </Select> */}
                            </FormControl>
    
                            <FormControl fullWidth sx={{ mb: 2 }}>
                            <Autocomplete
                                id="owner-combo-box"
                                options={ownerOptions}
                                getOptionLabel={(option) => option.label}
                                value={ownerOptions.find(option => option.value === filtri.owner) || null}
                                onChange={(event, newValue) => {
                                    onFilterChange('owner')({ target: { value: newValue?.value || null } });
                                }}
                                renderInput={(params) => <TextField {...params} label="Owner" />}
                            />
                            {/* <InputLabel id="owner-label">Owner</InputLabel>
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
                            </Select> */}
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