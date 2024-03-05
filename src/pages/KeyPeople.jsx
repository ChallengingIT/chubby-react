import React, { useState, useEffect }                   from 'react';
import { useNavigate  }                                 from 'react-router-dom';
import axios                                            from 'axios';
import SearchIcon                                       from '@mui/icons-material/Search';
// import BusinessCenterIcon                               from '@mui/icons-material/BusinessCenter'; //aziende
import CloseIcon                                        from '@mui/icons-material/Close';
import KeypeopleCard                                    from '../components/card/KeypeopleCard';
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
    IconButton
    } from '@mui/material';


const Keypeople = () => {

    const navigate = useNavigate();

    const [ originalKeypeople,   setOriginalKeypeople ] = useState([]);
    const [ openFiltri,          setOpenFiltri        ] = useState(false);
    const [ loading,             setLoading           ] = useState(false);


    //stati ricerche
    const [ clienteOptions,             setClienteOptions             ] = useState([]);
    const [ ownerOptions,               setOwnerOptions               ] = useState([]);
    const [ filtri,                     setFiltri                     ] = useState({
        nome: localStorage.getItem("RicercheKeypeople") || '',
        cognome: localStorage.getItem("RicercheKeypeople") || '',
        azienda: '',
        stato: '',
        owner:''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };



    const fetchData = async () => {
        setLoading(true);
        try {
    
        const response        = await axios.get("http://localhost:8080/keypeople/react/mod",             { headers: headers});
        const responseCliente = await axios.get("http://localhost:8080/aziende/react/select",            { headers: headers });
        const responseOwner   = await axios.get("http://localhost:8080/aziende/react/owner",             { headers: headers });

        if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
        } 


        if (Array.isArray(responseCliente.data)) {
            setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
        }
    
        if (Array.isArray(response.data)) {
            const keypeopleConId = response.data.map((keypeople) => ({ ...keypeople}));
            setOriginalKeypeople(keypeopleConId);
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
        setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
        }
    };
    
    useEffect(() => {
    fetchData();
    }, []);


    // const filterData = (data, searchTerm ) => {
    //     if (searchTerm.trim() === '') {
    //         setOriginalKeypeople(data);
    //     } else {
    //         const filterData = data.filter(aziende => 
    //             aziende.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //         setOriginalKeypeople(filterData);
    //     }
    // };


    // const handleSearchChange = (event) => {
    //     setSearchTerm(event.target.value);
    // };


    // // Funzione per l'animazione di scorrimento della barra dei filtri
    // const Transition = React.forwardRef(function Transition(props, ref) {
    //     return <Slide direction={openFiltri ? "left" : "right"} ref={ref} {...props} />;
    // });


    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri({ ...filtri, [name]: newValue });
        if( name === 'nome' && newValue === '') {
            fetchData();
        } else {
            handleRicerche();
        }
    };

    const handleRicerche = async () => {

        const filtriDaInviare = {
            azienda: filtri.azienda || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null
        };


        setLoading(true);
     
        try {
            const response = await axios.get("http://localhost:8080/aziende/react/ricerca/mod", { headers: headers, params: filtriDaInviare });

            if (Array.isArray(response.data)) {
                setOriginalKeypeople(response.data);
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
        const { nome, cognome, ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
    
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [filtri.azienda, filtri.stato, filtri.owner]);

    const handleReset = () => {
        setFiltri({
            nome: '',
            cognome: '',
            azienda: '',
            stato: '',
            owner: ''
        });
        localStorage.removeItem("RicercheKeypeople");
        fetchData();
    };


    const handleOpenFiltri = () => {
        setOpenFiltri(true);
    };

    const handleCloseFiltri = () => {
        setOpenFiltri(false);
    };

    const navigateToAggiungi = () => {
        navigate('/keypeople/aggiungi');
    };


    const statoOptions = [
        { label: 'Verde', value: '1' },
        { label: 'Giallo', value: '2' },
        { label: 'Rosso', value: '3' }
    ];


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
                    + Aggiungi Contatto
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Barra di ricerca */}
                        <TextField
                        id="search-bar"
                        variant="outlined"
                        placeholder="Cerca Contatto"
                        size="small"
                        value={filtri.nome}
                        onChange={handleFilterChange('nome')}
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
                    minWidth: '12em',
                    backgroundColor: '#00853C',
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
                            <CircularProgress /> 
                        </Box>
                    ) : (
                        originalKeypeople.map((keypeople, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <KeypeopleCard valori={keypeople}/>
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
                        justifyContent: 'space-between'
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
                        <InputLabel id="azienda-label">Azienda</InputLabel>
                        <Select
                            labelId="azienda-label"
                            displayEmpty
                            value={filtri.azienda || ''} 
                            onChange={handleFilterChange('azienda')}
                            renderValue={(selected) => {
                                if (selected === '') {
                                    return <em></em>;
                                }
                                const selectedLabel = clienteOptions.find(option => option.value === selected)?.label;
                                return selectedLabel || selected;
                            }}
                        >
                            
                            {clienteOptions.map((option) => (
                            <MenuItem key={option.value} value={option.label}>
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
                            <MenuItem key={option.value} value={option.label}>
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
                            <MenuItem key={option.value} value={option.label}>
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
export default Keypeople;