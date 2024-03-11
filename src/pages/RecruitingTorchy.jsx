import React, { useState, useEffect }                   from 'react';
import { useNavigate  }                                 from 'react-router-dom';
import axios                                            from 'axios';
import SearchIcon                                       from '@mui/icons-material/Search';
import CloseIcon                                        from '@mui/icons-material/Close';
import RecruitingCard                                   from '../components/card/RecruitingCard';
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

const RecruitingTorchy = () => {

    const navigate = useNavigate();

    const [ originalRecruiting,         setOriginalRecruiting   ] = useState([]);
    const [ openFiltri,                 setOpenFiltri           ] = useState(false);
    const [ loading,                    setLoading              ] = useState(false);
    // const [ openModal,                  setOpenModal            ] = useState(false);

    const [ tipologiaOptions,           setTipologiaOptions     ] = useState([]);
    const [ tipoOptions,                setTipoOptions          ] = useState([]);
    const [ statoOptions,               setStatoOptions         ] = useState([]);
    const [ filtri,                     setFiltri               ] = useState({
        nome: '',
        cognome: '',
        tipologia: '',
        stato: '',
        tipo:''
    });


    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };


    const fetchData = async () => {
        setLoading(true);
        try {
            const response          = await axios.get("http://89.46.67.198:8443/staffing/react/mod",          { headers: headers });
            const responseTipologia = await axios.get("http://89.46.196.60:8443/aziende/react/tipologia",        { headers });
            const responseTipo      = await axios.get("http://89.46.196.60:8443/staffing/react/tipo",            { headers });
            const responseStato     = await axios.get("http://89.46.196.60:8443/staffing/react/stato/candidato", { headers });
    
    
            if (Array.isArray(responseStato.data)) {
                setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
            } 
    
    
            if (Array.isArray(responseTipologia.data)) {
                setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
        
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
            } 
    
            if (Array.isArray(responseTipo.data)) {
                setTipoOptions(responseTipo.data.map((tipo, index) => ({ label: tipo.descrizione, value: tipo.id })));
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseTipo.data);
            } 
            if (Array.isArray(response.data)) {
                const recruitingConId = response.data.map((recruiting) => ({...recruiting}));
                setOriginalRecruiting(recruitingConId);
            } else {
                console.error("I dati ottenuti non sono nel formato Array: ", response.data);
            }
            setLoading(false);
            } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
            }
        };
        
        
        useEffect(() => {
            fetchData();
            // eslint-disable-next-line
        }, []);

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
                nome: filtri.nome || null,
                cognome: filtri.cognome || null,
                email: null,
                tipologia: filtri.tipologia || null,
                tipo: filtri.tipo || null,
                stato: filtri.stato || null
            };
    
    
            setLoading(true);
         
            try {
                const response = await axios.get("http://89.46.196.60:8443/staffing/react/mod/ricerca", { headers: headers, params: filtriDaInviare });
    
                if (Array.isArray(response.data)) {
                    setOriginalRecruiting(response.data);
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
        }, [filtri.tipologia, filtri.stato, filtri.tipo]);
        
    
    
        const handleReset = () => {
            setFiltri({
                nome: '',
                cognome: '',
                tipo:'',
                tipologia:'',
                stato: ''
            });
            localStorage.removeItem("RicercheRecruiting");
    
            fetchData();
        };
    
        const navigateToAggiungi = () => {
            navigate('/recruiting/aggiungi');
        };
    
        const handleOpenFiltri = () => setOpenFiltri(true);
        const handleCloseFiltri = () => setOpenFiltri(false);
    
    
        // const handleOpenModal = () => setOpenModal(true);
        // const handleCloseModal = () => setOpenModal(false);

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
                        + Aggiungi Recruiting
                        </Button>
    
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {/* Barra di ricerca */}
                            <TextField
                            id="search-bar"
                            variant="outlined"
                            placeholder="Cerca Need"
                            size="small"
                            value={filtri.nome}
                            onChange={(event) => setFiltri({ ...filtri, nome: event.target.value })}
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
                                        // borderRight: 'none',
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
    
                        <TextField
                        id="search-location"
                        variant="outlined"
                        placeholder="Azienda"
                        size="small"
                        value={filtri.cognome}
                        onChange={(event) => setFiltri({ ...filtri, cognome: event.target.value })}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleRicerche();
                            }
                        }}
                        // InputProps={{
                        //     startAdornment: (
                        //         <InputAdornment position="start">
                        //         <BusinessCenterIcon sx={{ color: '#00853C' }} />
                        //         </InputAdornment>
                        //     ),
                        // }}
                        sx={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            mb: 0.5,
    
                            '& .MuiOutlinedInput-root': {
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: 0,
                            borderColor: '#00853C',
                            '&:hover fieldset': {
                                borderColor: '#00853C', 
                            },
                            '&.Mui-focused': {
                                borderColor: '#00853C',
                            },
                            },
                            '& .MuiInputLabel-root': {
                            color: 'black', 
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00853C',
                            },
                            '& .MuiOutlinedInput-input': {
                            color: 'black', 
                            },
                            '& .MuiPlaceholder-root': {
                            color: 'black', 
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00853C', 
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
                                <CircularProgress sx={{ color: '#00853C'}} /> 
                            </Box>
                        ) : (
                            originalRecruiting.map((recruiting, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <RecruitingCard valori={recruiting}/>
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
                            <InputLabel id="tipo-label">Tipo</InputLabel>
                            <Select
                                labelId="tipo-label"
                                displayEmpty
                                value={filtri.tipo || ''} 
                                onChange={handleFilterChange('tipo')}
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em></em>;
                                    }
                                    const selectedLabel = tipoOptions.find(option => option.value === selected)?.label;
                                    return selectedLabel || selected;
                                }}
                            >
                                
                                {tipoOptions.map((option) => (
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

export default RecruitingTorchy;