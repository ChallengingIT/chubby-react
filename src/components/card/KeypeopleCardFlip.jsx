import React, {useState, useEffect}         from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import LocalPhoneIcon                       from '@mui/icons-material/LocalPhone';
import BusinessIcon                         from '@mui/icons-material/Business'; //azienda
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ExploreIcon from '@mui/icons-material/Explore'; //need
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'; //azioni
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'; //cambia stato
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'; //tipo
import PersonIcon from '@mui/icons-material/Person'; //stato
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Alert, MenuItem } from '@mui/material';




import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    Modal,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Autocomplete,
    FormControl,
    Snackbar
    
    } from '@mui/material';
import { Select } from 'antd';


const KeypeopleCardFlip = ({valori, statiOptions, onDelete, onRefresh}) => {


    //stati per la paginazione
    const [ pagina,             setPagina        ] = useState(0);
    const [righePerPagina,      setRighePerPagina] = useState(10);
    const quantita = 10;

    const [ modalStorico,        setModalStorico      ] = useState(false);
    const [ modalAzioni,         setModalAzioni       ] = useState(false);
    const [ modalDelete,         setModalDelete       ] = useState(false);
    const [ modalNeed,           setModalNeed         ] = useState(false);
    const [ modalCambiaStato,    setModalCambiaStato  ] = useState(false);
    const [ isFlipped,           setIsFlipped         ] = useState(false);
    const [ activeLink,          setActiveLink        ] = useState(null);
    const [ idKeypeople,         setIdKeypeople       ] = useState(null);
    const [ needAssociati,       setNeedAssociati     ] = useState([]);
    const [ tipologieOptions,    setTipologieOptions  ] = useState([]);
    const [ azioni, setAzioni            ] = useState([]);
    const [values, setValues] = useState({
        tipologie: '',
        data: '',
        note: ''
    });

    //stato per lo snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); 


    //funzioni per gestire lo snackbar
    const handleOpenSnackbar = (message, type) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    };
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    

    //funzione per bloccare il flip quando i modal sono aperti
    const toggleFlip = () => {
        if (modalStorico || modalAzioni || modalDelete || modalNeed || modalCambiaStato) {
            return; 
        }
        setIsFlipped(!isFlipped); 
    };
    


    const navigateToAggiorna = (id, event) => {
        event.stopPropagation();
        navigate(`/contacts/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalStorico = (event) => {
        setModalStorico(true);
        azioniKeypeople(valori.id, event)
    };
    const handleCloseModalStorico = () => setModalStorico(false);

    const handleOpenModalAzioni = (event) => {
        event.stopPropagation();
        setModalAzioni(true);
        azioniData();
    };
    const handleCloseModalAzioni = () => setModalAzioni(false);


    const handleOpenModalDelete = (event) => {
        event.stopPropagation();
        setModalDelete(true);
    };

    const handleCloseModalDelete = (event) => {
        setModalDelete(false);
    };
    
    const confirmDelete = (id, event) => {
        onDelete();
        handleCloseModalDelete(true);
    };

    const handleOpenModalCambiaStato = (id, event) => {
        event.stopPropagation();
        setIdKeypeople(id);
        setModalCambiaStato(true);
        setValues(prevValues => ({
            ...prevValues,
            stato: valori.stato?.id  
        }));
    };
    
    const handleCloseModalCambiaStato = () => setModalCambiaStato(false);


    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };


    const azioniKeypeople = async(id, event) => {
        try{
            const responseAzioni = await axios.get(`http://89.46.196.60:8443/azioni/react/${id}`, { header: headers });
            if (Array.isArray(responseAzioni.data)) {
                const azioni = responseAzioni.data.map((azione) => ({ ...azione}));
                setAzioni(azioni);
            } else {
                console.error("I dati per le azioni ottenuti non sono nel formato Array:", responseAzioni.data);
            }
        } catch(error) {
            console.error("Errore durante il recupero delle azioni:", error);
        }
    };


    const needKeypeople = async(id, event) => {
        const datiDaInviare = {
            pagina: 0,
            quantita: 10
        };
        try {
            const responseNeed = await axios.get(`http://89.46.196.60:8443/need/react/keypeople/modificato/${id}`, { headers: headers, params: datiDaInviare });
            if (Array.isArray(responseNeed.data)) {
                const needDaAssociare = responseNeed.data.map((keypeople) => ({ ...keypeople}));
                setNeedAssociati(needDaAssociare);
            } else {
                console.error("I dati per i need ottenuti non sono nel formato Array:", responseNeed.data);
            }


        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };


        //funzione per il cambio pagina
        const handlePageChange = (newPage) => {
            setPagina(newPage);
            handleChangePagina(newPage);
        };


        const handleChangePagina = async(newPage, id) => {
            const datiDaInviare = {
                pagina: newPage,
                quantita: 10
            };
            try {
                const responseNeed = await axios.get(`http://89.46.196.60:8443/need/react/keypeople/modificato/${id}`, { headers: headers, params: datiDaInviare });
                if (Array.isArray(responseNeed.data)) {
                    const needDaAssociare = responseNeed.data.map((keypeople) => ({ ...keypeople }));
                    setNeedAssociati(needDaAssociare);
                } else {
                    console.error("I dati per i need ottenuti non sono nel formato Array:", responseNeed.data);
                }
            } catch(error) {
                console.error("Errore durante il recupero dei dati: ", error);
            }
            setPagina(newPage); 
        };
        
    

    
    
    const handleOpenModalNeed = (event) => {
        event.stopPropagation();
        setModalNeed(true);
        needKeypeople(valori.id, event);
    };
    const handleCloseModalNeed = (event) => {
        setModalNeed(false);
    };


    const azioniData = async(id, event) => {
        try{
            const responseAzioni = await axios.get(`http://89.46.196.60:8443/azioni/react/tipologie`, { headers: headers });
            if (Array.isArray(responseAzioni.data)) {
                setTipologieOptions(responseAzioni.data.map((tipologie) => ({ label: tipologie.descrizione, value: tipologie.id })));
            } else {
                console.error("I dati degli stati ottenuti non sono nel formato Array:", responseAzioni.data);
            }
        } catch(error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    const tipoConverter = (tipoId) => {
        const tipoMap = {
            1: "Keypeople",
            2: "Hook",
            3: "Link"
        };
        return tipoMap[tipoId] || ""; 
    };


    //funzione per il cambio stato
    const handleUpdateStato = async () => {
        const idStato = values.stato;  
        const params = new URLSearchParams({ stato: idStato });
        try {
            const responseUpdateStato = await axios.post(`http://89.46.196.60:8443/keypeople/react/salva/stato/${idKeypeople}?${params.toString()}`, {}, { headers: headers });
            setModalCambiaStato(false);
            onRefresh();
            handleOpenSnackbar('Stato aggiornato con successo!', 'success');
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello stato: ", error);
            handleOpenSnackbar('Errore durante l aggiornamento dello stato.', 'error');
        }
    };
    


    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        border: 'solid 2px #00B400',
            '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.01)',
        }
    };

    const cardStyle = {
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: isFlipped ? 'rotateY(180deg)' : 'none',
        width: '100%',
        perspective: '1000px',
        borderRadius: '20px',
        display: 'flex',

        minHeight: '16em',
        // border: 'solid 2px #00B401',
        
    };

    const cardFrontStyle = {
        backfaceVisibility: 'hidden',
    };

    const cardBackStyle = {
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // overflowY: 'auto',
    };


    const navigate = useNavigate();




    // const cardStyle = {
    //     borderRadius: '20px',
    //     maxWidth: '80%',
    //     justifyContent: 'center',
    //     margin: 'auto',
    //     cursor: 'pointer',
    //     height: 'auto',
    //     border: '2px solid', 
    //     transition: 'transform 0.3s ease, border-width 0.3s ease',
    //     ...getCardStyle(valori.tipologia) 
    // };


    const userHasRole = (roleToCheck) => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };


    const menuData = [
        {
            title: 'Azione',
            icon: <DoubleArrowIcon />,
            onClick: (event) => {
                handleOpenModalAzioni(event);
            }
        },
        {
            title: 'Cambia Stato',
            icon: <ChangeCircleIcon />,
            onClick: (event) => {
                handleOpenModalCambiaStato(valori.id, event);
            }
        },
        {
            title: 'Need',
            icon : <ExploreIcon />,
            onClick: (event) => {
                handleOpenModalNeed(event);
            }
        },
        
        {
            title: 'Storico',
            icon: <AutoStoriesIcon />,
            onClick: (event) => {
                handleOpenModalStorico(event);
            }
        },
        {
            title: 'Aggiorna Contatto',
            icon: <SettingsIcon />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            }
        },
        {
            title: 'Elimina Contatto',
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            },
            isVisible: !userHasRole('ROLE_USER'),

        }
    ];


    // const azioniOptions = [
    //     { value: 1, label: 'Cold Call'},
    //     { value: 2, label: 'Call'},
    //     { value: 3, label: 'Messaggio'},
    //     { value: 4, label: 'Prospection '},
    //     { value: 5, label: 'Follow up'},
    // ];

    const handleAzioniSubmit = async (id) => {
        const valoriDaInviare = {
            data: values.data,
            idTipologia: values.tipologie,
            note: values.note,
        };
        try {
            const responseSubmitAzione = await axios.post(`http://89.46.196.60:8443/azioni/react/salva/${id}`, valoriDaInviare, { headers: headers });
            if (responseSubmitAzione.status === 200 || responseSubmitAzione.status === 201) {
                setValues({
                    data: '',
                    tipologie: '',
                    note: ''
                });
                handleOpenSnackbar('Azione salvata con successo!', 'success');
            } else {
                handleOpenSnackbar('Qualcosa è andato storto, riprova!', 'error');
            }
            handleCloseModalAzioni();
        } catch (error) {
            console.error("Errore durante l'invio dei dati: ", error);
            handleOpenSnackbar('Errore durante l invio dei dati.', 'error');
        }
    };
    

    const handleValueChange = (name, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };


    // const handleChangeRighePerPagina = (event) => {
    //     setRighePerPagina(+event.target.value);
    //     setPagina(0); 
    // };
    

    

    return (
        <Card
            raised 
            sx={cardContainerStyle}
            onClick={toggleFlip}
            >
            <div style={cardStyle}>
            <div style={cardFrontStyle}>


        <CardContent sx={{ backfaceVisibility: 'hidden'}}>
            {/* Contenuto della Card */}
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'column', mb: 1 }}>

            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 1 }}>
            <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                color: 'black',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%' 
                }}
            >
                {valori.nome} {valori.cognome}
            </Typography>
            

            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black' }}>
                {valori.citta}
            </Typography> */}


            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <BusinessIcon sx={{ color: '#00B401', mr: 1 }} />
                {valori.cliente.denominazione}
            </Typography>


            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <BusinessCenterIcon sx={{ color: '#00B401', mr: 1 }} />
                {valori.ruolo}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <PermContactCalendarIcon sx={{ color: '#00B401', mr: 1 }} />
                {tipoConverter(valori.tipo)}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <PersonIcon sx={{ color: '#00B401', mr: 1 }} />
                {valori.stato?.descrizione}
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: '#00B401', mr: 1 }} />
                    {valori.email}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1}}>
                <LocalPhoneIcon sx={{ color: '#00B401', mr: 1}} />
                {valori.cellulare}
            </Typography>
                </Box>
                <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'end', 
            paddingRight: '16px', 
            paddingBottom: '16px' 
        }}>
                <img src={`data:image/png;base64,${valori.cliente.logo}`} alt="Logo" style={{width: '80px', height: '80px', borderRadius: '50%'}} />
        </Box>
                </Box>
        </CardContent>
        </div>



        <div style={cardBackStyle}>
        <CardContent sx={{ backfaceVisibility: 'hidden'}}>
            {/* Contenuto della Card */}
            {/* <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                color: 'black',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                
                }}
            >
                Menu
            </Typography> */}

            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 0.2 }}>
            <List>
                    {menuData
                    .filter(item => item.isVisible !== false)
                    .map((item, index) => (
                        <ListItem
                            key={item.title}
                            selected={activeLink === `/${item.title.toLowerCase()}`}
                            onClick={item.onClick}  
                            sx={{
                                gap: 0,
                                '&:hover, &.Mui-selected': {
                                    backgroundColor: '#00B401',
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: 'white',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeLink === `/${item.title.toLowerCase()}` ? '#00B401' : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? '#00B400' : '#00B401',
                                },
                                '& .MuiListItemText-primary': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? '#00B400' : 'black',
                                },
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
        </Box>
        </CardContent>
        </div>
        </div>

        
        { /* MODAL PER IL CANCELLA */ }
        <Modal
                open={modalDelete}
                onClose={handleCloseModalDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClick={(event) => event.stopPropagation()}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Box
                            sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Sei sicuro di voler eliminare l'azienda?
                            </Typography>
                            <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 3
                            }}>
                                <Button
                                onClick={handleCloseModalDelete}
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                        transform: 'scale(1.01)'
                                    },
                                }}>
                                Indietro
                            </Button>
                            <Button
                            onClick={confirmDelete}
                            sx={{
                                backgroundColor: '#00B401',
                                color: 'white',
                                borderRadius: '5px',
                                '&:hover': {
                                    backgroundColor: '#00B401',
                                    color: 'white',
                                    transform: 'scale(1.01)'
                                },
                            }}>
                                Conferma
                            </Button>
                            </Box>
                            </Box>
                </Modal>


                { /* MODAL PER LO STORICO */ }
                <Modal
                open={modalStorico}
                onClose={() => setModalStorico(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Box sx={{ display:'flex', justifyContent: 'center', width: '60%', height: 'auto', flexDirection: 'column', backgroundColor: '#EDEDED', overflow: 'auto'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5}}>Storico delle azioni</Typography>
                            <IconButton sx={{ mr: 2, backgroundColor: 'transparent', border: 'none' }} onClick={() => setModalStorico(false)}>
                                <CloseIcon sx={{ backgroundColor: 'transparent' }}/>
                            </IconButton>
                        </Box>
                        <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>Data</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>Tipologia</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>Note</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {azioni.slice(pagina * righePerPagina, pagina * righePerPagina + righePerPagina).map((azioni) => (
                                    <TableRow key={azioni.id}>
                                        <TableCell>{azioni.dataModifica}</TableCell>
                                        <TableCell>{azioni.tipologia && azioni.tipologia?.descrizione}</TableCell>
                                        <TableCell>{azioni.note}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        // rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={azioni.length}
                        rowsPerPage={righePerPagina}
                        page={pagina}
                        onPageChange={(event, newPage) => handleChangePagina(newPage, valori.id)}
                        // onRowsPerPageChange={handleChangeRighePerPagina}
                    /> */}
                    </Box>
                </Modal>


                { /* MODAL DELLE AZIONI */ }
                <Modal
                    open={modalAzioni}
                    onClose={() => setModalAzioni(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            position: 'relative', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            height: 'auto',
                            
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5}}>Azioni</Typography>
                            <IconButton sx={{ mr: 2, backgroundColor: 'transparent', border: 'none' }} onClick={() => setModalAzioni(false)}>
                                <CloseIcon sx={{ backgroundColor: 'transparent' }}/>
                            </IconButton>
                        </Box>
                        {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <IconButton
                        
                        onClick={(event) => {
                            event.stopPropagation(); 
                            setModalAzioni(false);
                        }}                            
                            sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8, 
                                color: 'gray', 
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        </Box> */}


                        <FormControl fullWidth >
                            
                                <Autocomplete
                                    id="stato-combo-box"
                                    options={statiOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={statiOptions.find(option => option.value === values.stato) || null}
                                    onChange={(event, newValue) => {
                                        handleValueChange('stato', newValue ? newValue.value : null);
                                    }}
                                    renderInput={(params) => 
                                    <TextField 
                                    {...params} 
                                    label="Stato"
                                    variant='filled' 
                                    sx={{
                                        height: '4em',
                                        
                                        p: 1,
                                        borderRadius: '20px', 
                                        backgroundColor: '#EDEDED', 
                                        '& .MuiFilledInput-root': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiFilledInput-underline:after': {
                                            borderBottomColor: 'transparent',
                                        },
                                        '& .MuiFilledInput-root::before': {
                                            borderBottom: 'none', 
                                        },
                                        '&:hover .MuiFilledInput-root::before': {
                                            borderBottom: 'none', 
                                        } 
                                    }}  
                                    />}
                                />
                            </FormControl>



                        <TextField
                            fullWidth
                            label="Seleziona Data"
                            type="date"
                            defaultValue={""} 
                            variant="filled"
                            sx={{
                                height: '4em',
                                p: 1,
                                borderRadius: '20px', 
                                backgroundColor: '#EDEDED', 
                                '& .MuiFilledInput-root': {
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiFilledInput-underline:after': {
                                    borderBottomColor: 'transparent',
                                },
                                '& .MuiFilledInput-root::before': {
                                    borderBottom: 'none', 
                                },
                                '&:hover .MuiFilledInput-root::before': {
                                    borderBottom: 'none', 
                                } 
                                }} 
                            InputLabelProps={{
                                shrink: true, 
                            }}
                            onChange={(event) => handleValueChange('data', event.target.value)}
                            />

                        <TextField
                            fullWidth
                            label="Note"
                            multiline
                            variant="filled"

                            rows={4}
                            sx={{
                                height: '8em',
                                p: 1,
                                borderRadius: '20px', 
                                backgroundColor: '#EDEDED', 
                                '& .MuiFilledInput-root': {
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiFilledInput-underline:after': {
                                    borderBottomColor: 'transparent',
                                },
                                '& .MuiFilledInput-root::before': {
                                    borderBottom: 'none', 
                                },
                                '&:hover .MuiFilledInput-root::before': {
                                    borderBottom: 'none', 
                                } 
                                }} 
                            onChange={(event) => handleValueChange('note', event.target.value)}
                            />


                        <Button sx={{
                            width: '60%',
                            height: '40px',
                            backgroundColor: '#00B400',
                            color: 'white',
                            mt: 2,
                            borderRadius: '5px',
                            '&:hover': {
                                backgroundColor: '#00B400',
                                transform: 'scale(1.01)'
                            },
                        }}
                        onClick={() => handleAzioniSubmit(valori.id)}
                        >
                            Invia
                        </Button>
                    </Box>
                </Modal>


                { /* MODAL PERLA LISTA DEI NEED */}
                <Modal
                open={modalNeed}
                onClose={() => setModalNeed(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Box sx={{ display:'flex', justifyContent: 'center', width: '60%', height: 'auto', flexDirection: 'column', backgroundColor: '#EDEDED'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5}}>Lista dei Need</Typography>
                            <IconButton sx={{ mr: 2, backgroundColor: 'transparent', border: 'none' }} onClick={() => setModalNeed(false)}>
                                <CloseIcon sx={{ backgroundColor: 'transparent' }}/>
                            </IconButton>
                        </Box>
                        <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>Descrizione</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {needAssociati.slice(pagina * righePerPagina, pagina * righePerPagina + righePerPagina).map((need) => (
                                    <TableRow key={need.id}>
                                        <TableCell>{need.progressivo}</TableCell>
                                        <TableCell>{need.descrizione}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        // rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={needAssociati.length}
                        rowsPerPage={righePerPagina}
                        page={pagina}
                        onPageChange={(event, newPage) => handleChangePagina(newPage, valori.id)}
                        // onRowsPerPageChange={handleChangeRighePerPagina}
                    />
                    </Box>
                </Modal>


                { /* MODAL PER IL CAMBIO STATO */ }
                <Modal
                    open={modalCambiaStato}
                    onClose={() => setModalCambiaStato(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            position: 'relative', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            height: 'auto',
                            
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5}}>Cambia Stato al Need</Typography>
                            <IconButton sx={{ mr: 2, backgroundColor: 'transparent', border: 'none' }} onClick={() => setModalCambiaStato(false)}>
                                <CloseIcon sx={{ backgroundColor: 'transparent' }}/>
                            </IconButton>
                        </Box>
                        
                        <FormControl fullWidth >
                        <Autocomplete
                                id="stato-combo-box"
                                options={statiOptions}
                                getOptionLabel={(option) => option.label}
                                value={statiOptions.find(option => option.value === values.stato) || null}
                                onChange={(event, newValue) => {
                                    setValues(prevValues => ({
                                        ...prevValues,
                                        stato: newValue ? newValue.value : null
                                    }));
                                }}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params} 
                                        label="Stato"
                                        variant="filled" 
                                        sx={{
                                            height: '4em',
                                            p: 1,
                                            borderRadius: '20px', 
                                            backgroundColor: '#EDEDED',
                                            '& .MuiFilledInput-root': {
                                                backgroundColor: 'transparent',
                                            },
                                            '& .MuiFilledInput-underline:after': {
                                                borderBottomColor: 'transparent',
                                            },
                                            '& .MuiFilledInput-root::before': {
                                                borderBottom: 'none', 
                                            },
                                            '&:hover .MuiFilledInput-root::before': {
                                                borderBottom: 'none', 
                                            } 
                                        }}  
                                    />
                            }
                            />
                            </FormControl>
                            <Button
                            onClick={handleUpdateStato}
                            sx={{
                                mt: 2,
                                width: '60%',
                                backgroundColor: '#00B400',
                                color: 'white',
                                borderRadius: '10px',
                                '&:hover': {
                                    backgroundColor: '#00B400',
                                    transform: 'scale(1.02)',
                                },
                            }}
                            >
                                Cambia
                            </Button>
                            </Box>
                            </Modal>

                

                { /* SNACKBAR  */}

                <Snackbar open={snackbarOpen} autoHideDuration={8000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>



    </Card>
    );
};

export default KeypeopleCardFlip;