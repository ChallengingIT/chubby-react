import React, { useState, useEffect }                   from 'react';
import { useNavigate  }                                 from 'react-router-dom';
import axios                                            from 'axios';
import SearchIcon                                       from '@mui/icons-material/Search';
import CloseIcon                                        from '@mui/icons-material/Close';
import AziendeCard                                      from '../components/card/AziendeCard';

import { 
    Button,
    Box,
    Grid,
    TextField,
    InputAdornment,
    Select,
    Drawer,
    Typography,
    MenuItem,
    CircularProgress,
    // Slide,
    FormControl,
    InputLabel,
    IconButton,
    Modal
    } from '@mui/material';


const Aziende = () => {

    const navigate = useNavigate();

    const [ originalAziende,   setOriginalAziende ] = useState([]);
    const [ openFiltri,        setOpenFiltri      ] = useState(false);
    const [ loading,           setLoading         ] = useState(false);
    const [ openModal, setOpenModal ] = useState(false);


    //stati ricerche
    // const [ clienteOptions,             setClienteOptions             ] = useState([]);
    const [ ownerOptions,               setOwnerOptions               ] = useState([]);
    const [ filtri,                     setFiltri                     ] = useState({
        denominazione: localStorage.getItem("RicercheAzienda") || '',
        tipologia: '',
        stato: '',
        owner: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };



    const fetchData = async () => {
        setLoading(true);
            try {
        
            const responseAziende   = await axios.get("http://localhost:8080/aziende/react/mod",     { headers: headers });
            // const responseCliente   = await axios.get("http://localhost:8080/aziende/react/select",  { headers });
            const responseOwner     = await axios.get("http://localhost:8080/aziende/react/owner",   { headers });
        

            // if (Array.isArray(responseCliente.data)) {
            // setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            // } else {
            // console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
            // } 


            if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
            } 
        
            if (Array.isArray(responseAziende.data)) {
                const aziendeConId = responseAziende.data
                .map((aziende) => ({ ...aziende }))
                .sort((a, b) => a.denominazione.localeCompare(b.denominazione));
                setOriginalAziende(aziendeConId);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
            }
            setLoading(false);
            } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            }
        };

        useEffect(() => {
            fetchData();
            // eslint-disable-next-line
        }, []); 


        const tipologiaOptions = [
            { label: "Cliente", value: "CLIENTE" },
            { label: "Prospect", value: "PROSPECT" },
            { label: "Consulenza", value: "CONSULENZA" }
        ];

        const statoOptions = [
            { label: 'Verde', value: '1' },
            { label: 'Giallo', value:'2'},
            { label: 'Rosso', value: '3' }
        ];

    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri({ ...filtri, [name]: newValue });
        if (name === 'denominazione' && newValue === '') {
            fetchData();
        } else {
            handleRicerche();
        }
    };


    


    const handleRicerche = async () => {

        const filtriDaInviare = {
            ragione: filtri.denominazione || null,
            tipologia: filtri.tipologia || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null
        };


        setLoading(true);
     
        try {
            const response = await axios.get("http://localhost:8080/aziende/react/ricerca/mod", { headers: headers, params: filtriDaInviare });

            if (Array.isArray(response.data)) {
                setOriginalAziende(response.data);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", response.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero dei dati filtrati:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { denominazione, ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
    
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [filtri.tipologia, filtri.stato, filtri.owner]);
    


    const handleReset = () => {
        setFiltri({
            denominazione: '',
            stato: '',
            owner:'',
            tipologia:''
        });
        localStorage.removeItem("RicercheAzienda");

        fetchData();
    };

    const navigateToAggiungi = () => {
        navigate('/aziende/aggiungi');
    };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);


    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);



    return(
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
            <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                marginLeft: '13.2em', 
                marginTop: '0.5em', 
                marginBottom: '0.8em', 
                marginRight: '0.8em', 
                backgroundColor: '#FEFCFD', 
                borderRadius: '10px', 
                minHeight: '98vh',
                mt: 1.5 
            }}>
                <Box sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1000, 
                    backgroundColor: '#FEFCFD', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    borderRadius: '10px',  
                    marginBottom: '4rem'
                }}>
                    <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={navigateToAggiungi} 
                    sx={{
                        minWidth: '12em',
                        backgroundColor: '#00853C',
                        borderRadius: '10px',
                        textTransform: 'none',
                        '&:hover': {
                        backgroundColor: '#00853C',
                        transform: 'scale(1.05)',
                    },
                }}>
                    + Aggiungi Azienda
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Barra di ricerca */}
                        <TextField
                            id="search-bar"
                            variant="outlined"
                            placeholder="Cerca Azienda"
                            size="small"
                            value={filtri.denominazione}
                            onChange={(event) => setFiltri({ ...filtri, denominazione: event.target.value })}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleRicerche();
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
                
                </Box>
                            {/* Main Content Area */}
                <Grid container spacing={2}>
                    { loading ? (
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <CircularProgress sx={{ color: '#00853C'}}/> 
                        </Box>
                    ) : (
                        originalAziende.map((aziende, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <AziendeCard valori={aziende}/>
                            </Grid>
                        ))
                    )
                    }
                    </Grid>
                    </Box>


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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        
                    }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
                        Filtri
                    </Typography>
                    <IconButton
                        onClick={handleCloseFiltri}
                        sx={{ color: 'black', mb: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    </Box>
                </Box>

                <Grid container spacing={2} direction="column" sx={{ p: 2}}>
                    <Grid item>


                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="tipologia-label">Tipologia</InputLabel>
                        <Select
                            labelId="tipologia-label"
                            displayEmpty
                            value={filtri.tipologia || ''} 
                            onChange={handleFilterChange('tipologia')}
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
                            onChange={handleFilterChange('stato')}
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
                            onChange={handleFilterChange('owner')}
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
                        onClick={handleReset}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
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


                <Modal  
    open={openModal}
    onClose={handleCloseModal}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: 'white', 
        width: '40vw', 
        height: '70vh', 
        borderRadius: '20px', 
        overflow: 'hidden',
    }}>
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            m: 2 
        }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00853C'}}>
                Aggiungi need
            </Typography>
            <IconButton onClick={handleCloseModal}>
                <CloseIcon />
            </IconButton>
        </Box>
        {/* Contenuto scrollabile */}
        <Box sx={{ overflowY: 'auto' }}>
            <Grid container direction="column" spacing={2} sx={{ p: 1 }}>
                <Grid item>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: 'center',
                            borderBottom: '1px solid #000',
                            paddingBottom: '5px',
                            marginTop: '20px',
                            marginBottom: '20px',
                            fontWeight: 'bold'
                        }}
                    >
                        Informazioni Generali
                    </Typography>

                    {/* {fields.map((field) => (
                        <Grid item key={field.name}>
                            {field.type === "text" ? (
                            <TextField
                                label={field.label}
                                variant="outlined"
                                fullWidth
                                value={formValues[field.name]}
                                onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                            />
                            ) : field.type === "select" ? (
                            <FormControl fullWidth>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                value={formValues[field.name]}
                                onChange={(e) => setFormValues({ ...formValues, [field.name]: e.target.value })}
                                label={field.label}
                                >
                                {field.options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            ) : null}
                        </Grid>
                        ))} */}










                    

                </Grid>
            </Grid>
        </Box>
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            m:1
        }}>
            <Button 
            sx={{
                backgroundColor: '#00853C',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: '#00853C',
                    color: 'white',
                },
            }}>
                Salva
            </Button>
        </Box>
    </Box>
</Modal>

                    </Box>
    );
};
export default Aziende;