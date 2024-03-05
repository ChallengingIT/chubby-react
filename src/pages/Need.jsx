import React, { useState, useEffect }                   from 'react';
import { useNavigate  }                                 from 'react-router-dom';
import axios                                            from 'axios';
import SearchIcon                                       from '@mui/icons-material/Search';
import BusinessCenterIcon                               from '@mui/icons-material/BusinessCenter'; //aziende
import NeedCard                                         from '../components/card/NeedCard';
import CloseIcon                                        from '@mui/icons-material/Close';

import { 
    Button,
    Box,
    Grid,
    TextField,
    InputAdornment,
    Select,
    // Dialog,
    Typography,
    MenuItem,
    CircularProgress,
    // Slide,
    FormControl,
    InputLabel,
    IconButton,
    Drawer
    } from '@mui/material';


const Need = () => {

    const navigate = useNavigate();

    const [ originalNeed,   setOriginalNeed ] = useState([]);
    const [ openFiltri,     setOpenFiltri   ] = useState(false);
    const [ searchTerm,     setSearchTerm   ] = useState(localStorage.getItem("searchTerm") || '' );
    const [ orderDate,      setOrderDate    ] = useState('');
    const [ loading,        setLoading      ] = useState(false);
    


    //stati ricerche
    const [ clienteOptions,             setClienteOptions             ] = useState([]);
    const [ ownerOptions,               setOwnerOptions               ] = useState([]);
    const [ tipologiaOptions,           setTipologiaOptions           ] = useState([]);
    const [ statoOptions,               setStatoOptions               ] = useState([]);
    const [ filtri,                     setFiltri                     ] = useState({
        descrizione: localStorage.getItem("RicercheNeed") || '',
        tipologia: '',
        stato: '',
        owner: '',
        // azienda: '',
        priorita: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };




    const fetchData = async () => {
        setLoading(true);
        try {
            const responseNeed          = await axios.get("http://localhost:8080/need/react/modificato",         { headers: headers });
            const responseCliente       = await axios.get("http://localhost:8080/aziende/react/select",          { headers: headers });
            const responseOwner         = await axios.get("http://localhost:8080/aziende/react/owner",           { headers: headers });
            const responseTipologia     = await axios.get("http://localhost:8080/need/react/tipologia",          { headers: headers });
            const responseStato         = await axios.get("http://localhost:8080/need/react/stato",              { headers: headers });

            if (Array.isArray(responseCliente.data)) {
            setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
            } 

            if (Array.isArray(responseTipologia.data)) {
            setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
            } 

            if (Array.isArray(responseStato.data)) {
            setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
            } 

            if (Array.isArray(responseOwner.data)) {
            setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
            } 

            if (Array.isArray(responseNeed.data)) {
                const searchTerm = localStorage.getItem("searchTerm") || '';
                filterData(responseNeed.data, searchTerm);
                let data = responseNeed.data;
                if (searchTerm.length > 0) {
                    data = responseNeed.data.filter(need =>
                        need.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                data.sort((a, b) => b.week.localeCompare(a.week));
                setOriginalNeed(data) ;
                setLoading(true);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseNeed.data);
            }
        } catch(error) {
            console.error("Errore durante il recupero dei dati:", error);
        } finally {
            setLoading(false);
        }
};

    useEffect(() => {
        fetchData();
    }, []);


    

    const filterData = (data, searchTerm ) => {
        if (searchTerm.trim() === '') {
            setOriginalNeed(data);
        } else {
            const filterData = data.filter(need => 
                need.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setOriginalNeed(filterData);
        }
    };


    // useEffect(() => {
    //     filterData(originalNeed, searchTerm);
    //     localStorage.setItem('searchTerm', searchTerm);
    // }, [searchTerm, originalNeed]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    // // Funzione per l'animazione di scorrimento della barra dei filtri
    // const Transition = React.forwardRef(function Transition(props, ref) {
    //     return <Slide direction={openFiltri ? "left" : "right"} ref={ref} {...props} />;
    // });

    // const handleOpenFiltri = () => {
    //     setOpenFiltri(true);
    // };

    // const handleCloseFiltri = () => {
    //     setOpenFiltri(false);
    // };

    const handleOpenFiltri = () => setOpenFiltri(true);
    const handleCloseFiltri = () => setOpenFiltri(false);



    const navigateToAggiungi = () => {
        navigate('/need/aggiungi');
    };

    // useEffect(() => {
    //     const results = originalNeed.filter(need => 
    //         need.descrizione.toLowerCase().includes(searchTerm.toLowerCase()));
    //         setOriginalNeed(results);
    // }, [ searchTerm, originalNeed ]);


    // useEffect(() => {
    //     const sortNeeds = () => {
    //         let sortedNeeds = [...originalNeed];
    //         if (orderDate === "Meno recente") {
    //             sortedNeeds.sort((a, b) => a.week.localeCompare(b.week));
    //         } else if (orderDate === 'Più recente') {
    //             sortedNeeds.sort((a, b) => b.week.localeCompare(a.week));
    //         }
    //         setOriginalNeed(sortedNeeds);
    //     };
    //     sortNeeds();
    // }, [orderDate, originalNeed]);

    const handleFilterChange = (name) => (event) => {
        const newValue = event.target.value;
        setFiltri({ ...filtri, [name]: newValue });
        if (name === 'descrizione' && newValue === '') {
            fetchData();
        } else {
            handleRicerche();
        }
    };





    const handleRicerche = async () => {
        console.log("sto chiamando le ricerche con: ", filtri);

        const filtriDaInviare = {
            // azienda: filtri.cliente.denominazione || null,
            tipologia: filtri.tipologia || null,
            owner: filtri.owner || null,
            stato: filtri.stato || null,
            priorita: filtri.priorita || null,
            week: null,
            descrizione: filtri.descrizione || null
        };
        console.log("tipologia filtro: ", filtri.tipologia);

        console.log('filtri da inviare: ', filtriDaInviare);

        setLoading(true);
     
        try {
            const response = await axios.get("http://localhost:8080/need/react/ricerca/modificato", { headers: headers, params: filtriDaInviare });

            if (Array.isArray(response.data)) {
                setOriginalNeed(response.data);
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
        const { descrizione, aziende,  ...otherFilters } = filtri;
        const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);
    
        if (filtriHasValues) {
            handleRicerche();
        }
    }, [filtri.tipologia, filtri.stato, filtri.owner, filtri.priorita]);


    const handleReset = () => {
        setFiltri({
            descrizione: '',
            stato: '',
            owner:'',
            tipologia:'',
            priorita: '',
            aziende: ''
        });
        localStorage.removeItem("RicercheNeed");

        fetchData();
    };





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
                    + Aggiungi Need
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Barra di ricerca */}
                        <TextField
                        id="search-bar"
                        variant="outlined"
                        placeholder="Cerca Need"
                        size="small"
                        value={filtri.descrizione}
                        onChange={(event) => setFiltri({ ...filtri, descrizione: event.target.value })}
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

                    {/* <TextField
                    id="search-location"
                    variant="outlined"
                    placeholder="Azienda"
                    size="small"
                    value={filtri.azienda}
                    onChange={(event) => setFiltri({ ...filtri, azienda: event.target.value })}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleRicerche();
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <BusinessCenterIcon sx={{ color: '#00853C' }} />
                            </InputAdornment>
                        ),
                    }}
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
                    /> */}
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
                        originalNeed.map((need, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <NeedCard valori={need}/>
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
export default Need;