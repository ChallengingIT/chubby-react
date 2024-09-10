import React, {useEffect, useState}                    from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import LocalPhoneIcon                       from '@mui/icons-material/LocalPhone';
import BusinessIcon                         from '@mui/icons-material/Business'; //azienda
import SettingsIcon                         from '@mui/icons-material/Settings';
import DeleteIcon                           from '@mui/icons-material/Delete';
import ExploreIcon                          from '@mui/icons-material/Explore'; //need
import DoubleArrowIcon                      from '@mui/icons-material/DoubleArrow'; //azioni
import ChangeCircleIcon                     from '@mui/icons-material/ChangeCircle'; //cambia stato
import PermContactCalendarIcon              from '@mui/icons-material/PermContactCalendar'; //tipo
import PersonIcon                           from '@mui/icons-material/Person'; //stato
import CloseIcon                            from '@mui/icons-material/Close';
import axios                                from 'axios';
import InfoIcon                             from '@mui/icons-material/Info';
import AddCircleIcon                        from '@mui/icons-material/AddCircle';
import { useTranslation }                   from "react-i18next"; 


import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Stack, Pagination, Popover, Slide } from '@mui/material';
import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
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
    


const KeypeopleCardFlip = ({valori, statiOptions, onDelete, onRefresh, isFirstCard}) => {

    const { t } = useTranslation(); 



    //stati per la paginazione
    const [ pagina,             setPagina        ] = useState(0);
    const [righePerPagina,                       ] = useState(10);

    const [ modalStorico,        setModalStorico      ] = useState(false);
    const [ modalAzioni,                              ] = useState(false);
    const [ modalDelete,         setModalDelete       ] = useState(false);
    const [ modalNeed,           setModalNeed         ] = useState(false);
    const [ modalCambiaStato,    setModalCambiaStato  ] = useState(false);
    const [ isFlipped,           setIsFlipped         ] = useState(false);
    const [ mezzoFlip,           setMezzoFlip         ] = useState(false);
    const [ activeLink,                               ] = useState(null);
    const [ idKeypeople,         setIdKeypeople       ] = useState(null);
    const [ needAssociati,       setNeedAssociati     ] = useState([]);
    const [ tipologieOptions,    setTipologieOptions  ] = useState([]);
    const [ azioni,              setAzioni            ] = useState([]);
    const [ anchorElStato,       setAnchorElStato     ] = useState(null);
    const [ alert,               setAlert             ] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);


    const [values,               setValues            ] = useState({
        tipologie: '',
        data: '',
        note: ''
    });

    //stato per lo snackbar
    const [ snackbarOpen,        setSnackbarOpen        ] = useState(false);
    const [ snackbarMessage,     setSnackbarMessage     ] = useState('');
    const [ snackbarType,        setSnackbarType        ] = useState('success'); 


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

    useEffect(() => {
        if (isFirstCard && !hasAnimated) {
            setTimeout(() => {
                setMezzoFlip(true);
                setTimeout(() => {
                    setMezzoFlip(false);
                    setHasAnimated(true);
                }, 500); // Durata della rotazione (mezzo secondo)
            }, 500); // Attendere mezzo secondo prima di iniziare l'animazione
        }
    }, [isFirstCard, hasAnimated]);
    
    

    //funzione per bloccare il flip quando i modal sono aperti
    const toggleFlip = () => {
        if (modalStorico || modalAzioni || modalDelete || modalNeed || modalCambiaStato) {
            return; 
        }
        setIsFlipped(!isFlipped); 
    };

    const handlePopoverStatoOpen = (event) => {
        setAnchorElStato(event.currentTarget);
    };

    const handlePopoverStatoClose = () => {
        setAnchorElStato(null);
    };

    const openStato = Boolean(anchorElStato);

    


    const navigateToAggiorna = (id, event) => {
        event.stopPropagation();
        navigate(`/contacts/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalStorico = (event) => {
        setModalStorico(true);
        azioniData();
        azioniKeypeople(valori.id, event)
    };

    // const handleOpenModalAzioni = (event) => {
    //     event.stopPropagation();
    //     setModalAzioni(true);
    //     azioniData();
    // };
    // const handleCloseModalAzioni = () => setModalAzioni(false);


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


     //funzione per la chiusura dell'alert
     const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({...alert, open: false});
    };

    //funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }
    
    const user = JSON.parse(sessionStorage.getItem('user'));
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
            if (responseAzioni.data === "ERRORE") {
                setAlert({ open: true, message: "errore durante il salvataggio dell'azione!" });
                console.error("L'azienda non è stata salvata.");
                return;
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
            handleOpenSnackbar(t('Stato aggiornato con successo!'), 'success');
            if (responseUpdateStato.data === "ERRORE") {
                setAlert({ open: true, message: "errore durante il salvataggio dell'azienda!" });
                console.error("L'azienda non è stata salvata.");
                return;
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello stato: ", error);
            handleOpenSnackbar(t('Errore durante l aggiornamento dello stato.'), 'error');
        }
    };
    
    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        border: 'solid 2px #00B400',
        transition: 'transform 0.3s ease, border-width 0.3s ease', 
            '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.02)',
        }
    };

    const cardStyle = {
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: isFlipped ? "rotateY(180deg)" : mezzoFlip ? "rotateY(40deg)" : "none",
        width: '100%',
        perspective: '1000px',
        borderRadius: '20px',
        display: 'flex',
        minHeight: '16em',        
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
    };

    const navigate = useNavigate();

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };


    const menuData = [
        {
            title: t('Azioni Commerciali'),
            icon: <DoubleArrowIcon />,
            onClick: (event) => {
                handleOpenModalStorico(event);
            }
        },
        {
            title: t('Cambia Stato Contatto'),
            icon: <ChangeCircleIcon />,
            onClick: (event) => {
                handleOpenModalCambiaStato(valori.id, event);
            }
        },
        {
            title: t('Need Correlati'),
            icon : <ExploreIcon />,
            onClick: (event) => {
                handleOpenModalNeed(event);
            }
        },
        // {
        //     title: 'Storico',
        //     icon: <AutoStoriesIcon />,
        //     onClick: (event) => {
        //         handleOpenModalStorico(event);
        //     }
        // },
        {
            title: t('Aggiorna Contatto'),
            icon: <SettingsIcon />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            }
        },
        {
            title: t('Elimina Contatto'),
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            },
            isVisible: userHasRole('ADMIN'),
        }
    ];

    const handleAzioniSubmit = async (id) => {
        const valoriDaInviare = {
            data: values.data,
            idTipologia: values.tipologie,
            note: values.note,
        };
        try {
            const responseSubmitAzione = await axios.post(`http://89.46.196.60:8443/azioni/react/salva/${id}`, valoriDaInviare, { headers: headers });
            if (responseSubmitAzione.data === "OK") {
                setValues({
                    data: '',
                    tipologie: '',
                    note: ''
                });
                handleOpenSnackbar(t('Azione salvata con successo!'), 'success');
                await azioniKeypeople(valori.id);
            } else {
                handleOpenSnackbar(t('Qualcosa è andato storto, riprova!'), 'error');
            }
            // handleCloseModalAzioni();
        } catch (error) {
            console.error("Errore durante l'invio dei dati: ", error);
            handleOpenSnackbar(t('Errore durante l invio dei dati.'), 'error');
        }
    };
    

    const handleValueChange = (name, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };


    function TransitionLeft(props) {
        return <Slide {...props} direction="up" />;
    }

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
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('Sei sicuro di voler eliminare il contatto?')}
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
                                    borderRadius: '10px',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                        transform: 'scale(1.01)'
                                    },
                                }}>
                                {t('Indietro')}
                            </Button>
                            <Button
                            onClick={confirmDelete}
                            sx={{
                                backgroundColor: '#00B401',
                                color: 'white',
                                borderRadius: '10px',
                                '&:hover': {
                                    backgroundColor: "#019301",
                                    color: 'white',
                                    transform: 'scale(1.01)'
                                },
                            }}>
                                {t('Conferma')}
                            </Button>
                            </Box>
                            </Box>
                </Modal>



                { /* MODAL PER LO STORICO */ }
                {/* <Modal
                open={modalStorico}
                onClose={() => setModalStorico(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    
                }}>
                    <Box sx={{ display:'flex', justifyContent: 'center', width: '60%', height: 'auto', flexDirection: 'column', backgroundColor: 'white', borderRadius: '20px', overflow: 'auto', border: 'solid 2.2px #00B400'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', p: 3,}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', mt: 0.5, mb: 0.5}}>Storico delle azioni</Typography>
                            <IconButton sx={{ 
                                mr: 2, 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }}} onClick={() => setModalStorico(false)}>
                                <CloseIcon sx={{ 
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        color: 'red',
                                        backgroundColor: 'transparent',

                                    }
                                    }}/>
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
                    </Box>
                </Modal> */}


            { /* MODAL PER LE AZIONI COMMERCIALI */ }
                <Modal
                    open={modalStorico}
                    onClose={() => setModalStorico(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh'
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '60%', height: 'auto', flexDirection: 'column', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: 'solid 2.2px #00B400' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', p: 3, }}>
                        <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', mt: 0.5, mb: 0.5 }}>{t('Storico Delle Azioni')}</Typography>
                        <IconButton sx={{
                        mr: 2,
                        backgroundColor: 'transparent',
                        border: 'none',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                        }} onClick={() => setModalStorico(false)}>
                        <CloseIcon sx={{
                            backgroundColor: 'transparent',
                            '&:hover': {
                            color: 'red',
                            backgroundColor: 'transparent',
                            }
                        }} />
                        </IconButton>
                    </Box>
                    <TableContainer component={Paper} sx={{ maxHeight: '300px', overflow: 'auto' }}>
                        <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 'large' }}>{t('Data')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 'large' }}>{t('Tipologia')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 'large' }}>{t('Note')}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: 'large' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {azioni.slice(pagina * righePerPagina, pagina * righePerPagina + righePerPagina).map((azione) => (
                            <TableRow key={azione.id}>
                                <TableCell>{azione.dataModifica}</TableCell>
                                <TableCell>{azione.tipologia && azione.tipologia?.descrizione}</TableCell>
                                <TableCell>{azione.note}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'white', borderTop: 'solid 1px #E0E0E0' }}>
                        <TextField
                        label={t("Seleziona Data")}
                        type="datetime-local"
                        value={values.data || ""}
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
                            },
                            '& .MuiFormLabel-root.Mui-focused': {
                            color: '#00B400',
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => handleValueChange('data', event.target.value)}
                        />
                        {/* <FormControl fullWidth sx={{ ml: 2, mr: 2 }}> */}
                        <Autocomplete
                            id="stato-combo-box"
                            options={tipologieOptions}
                            getOptionLabel={(option) => option.label}
                            value={tipologieOptions.find(option => option.value === values.tipologie) || null}
                            onChange={(event, newValue) => {
                            handleValueChange('tipologie', newValue ? newValue.value : null);
                            }}
                            sx={{ width: '15em'}}
                            renderInput={(params) =>
                            <TextField
                                {...params}
                                label={t("Azione")}
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
                                },
                                '& .MuiFormLabel-root.Mui-focused': {
                                    color: '#00B400',
                                },
                                }}
                            />}
                        />
                        {/* </FormControl> */}
                        <TextField
                        label={t("Note")}
                        variant="filled"
                        value={values.note || ""}
                        inputProps={{
                            maxLength: 4000
                        }}
                        rows={4}
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
                            },
                            '& .MuiFormLabel-root.Mui-focused': {
                            color: '#00B400',
                            },
                        }}
                        onChange={(event) => handleValueChange('note', event.target.value)}
                        />
                        <IconButton
                        onClick={() => handleAzioniSubmit(valori.id)}
                        >
                        <AddCircleIcon sx={{ color: '#00B400'}} />
                        </IconButton>
                    </Box>
                    </Box>
                </Modal>

                { /* MODAL DELLE AZIONI */ }
                {/* <Modal
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
                            borderRadius: '20px',
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
                            <IconButton sx={{ 
                                mr: 2, 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                '&:hover': {
                                    bgcolor: 'transparent'
                                }
                                
                                }} onClick={() => setModalAzioni(false)}>
                                <CloseIcon sx={{ 
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        color: 'red',
                                        backgroundColor: 'transparent',

                                    }
                                    }}/>
                            </IconButton>
                        </Box>
                        <FormControl fullWidth >
                            
                                <Autocomplete
                                    id="stato-combo-box"
                                    options={tipologieOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={tipologieOptions.find(option => option.value === values.tipologie) || null}
                                    onChange={(event, newValue) => {
                                        handleValueChange('tipologie', newValue ? newValue.value : null);
                                    }}
                                    renderInput={(params) => 
                                    <TextField 
                                    {...params} 
                                    label="Azione"
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
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: '#00B400',
                                        }, 
                                    }}  
                                    />}
                                />
                            </FormControl>



                        <TextField
                            fullWidth
                            label="Seleziona Data"
                            type="datetime-local"
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
                                },
                                '& .MuiFormLabel-root.Mui-focused': {
                                    color: '#00B400',
                                },
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
                            inputProps={{
                                maxLength: 4000
                            }}
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
                                },
                                '& .MuiFormLabel-root.Mui-focused': {
                                    color: '#00B400',
                                }, 
                                }} 
                            onChange={(event) => handleValueChange('note', event.target.value)}
                            />


                        <Button sx={{
                            width: '60%',
                            height: '40px',
                            backgroundColor: '#00B400',
                            color: 'white',
                            mt: 2,
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#019301',
                                transform: 'scale(1.01)'
                            },
                        }}
                        onClick={() => handleAzioniSubmit(valori.id)}
                        >
                            Invia
                        </Button>
                    </Box>
                </Modal> */}


                { /* MODAL PER LA LISTA DEI NEED */}
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
                    <Box sx={{ display:'flex', justifyContent: 'center', width: '60%', height: 'auto', flexDirection: 'column', backgroundColor: 'white', borderRadius: '20px', border: 'solid 2.2px #00B400'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', p: 3, borderBottom: '2.5 solid #e0e0e0', borderTop: '2.5 solid #e0e0e0'}}>
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', mt: 0.5, mb: 0.5}}>{t('Lista Dei Need')}</Typography>
                            <IconButton sx={{ 
                                mr: 2, 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                '&:hover': {
                                    bgcolor: 'transparent'
                                }

                                }} onClick={() => setModalNeed(false)}>
                                    <CloseIcon sx={{ 
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        color: 'red',
                                        backgroundColor: 'transparent',

                                    }
                                    }}/> 
                                    </IconButton>
                        </Box>
                        <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>{t("Descrizione")}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: 'large'}}>{t("Stato")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {needAssociati.slice(pagina * righePerPagina, pagina * righePerPagina + righePerPagina).map((need) => (
                                    <TableRow key={need.id}>
                                        <TableCell>{need.progressivo}</TableCell>
                                        <TableCell>{need.descrizione}</TableCell>
                                        <TableCell>{need.stato?.descrizione}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                        <Stack spacing={2} sx={{ m: 2}} >
                        <Pagination 
                        count={needAssociati.length}
                        rowsPerPage={righePerPagina}
                        page={pagina}
                        onPageChange={(event, newPage) => handleChangePagina(newPage, valori.id)}
                        sx={{ display: 'flex', justifyContent: 'flex-end', mt: 10}} />
                        </Stack>
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
                            borderRadius: '20px',
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
                            <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5}}>{t('Cambia Stato Del Contatto')}</Typography>
                            <IconButton sx={{ 
                                mr: 2, 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }}} onClick={() => setModalCambiaStato(false)}>
                                <CloseIcon sx={{ 
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        color: 'red',
                                        backgroundColor: 'transparent',

                                    }
                                    }}/>
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <FormControl fullWidth sx={{ width: '90%'}} >
                        <Autocomplete
                                fullWidth
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
                                        label={t("Stato")}
                                        variant="filled" 
                                        fullWidth
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
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: '#00B400',
                                            },
                                        }}  
                                    />
                            }
                            />
                            </FormControl>
                            <IconButton onClick={handlePopoverStatoOpen} sx={{ mr: -3, ml: 2 }}>
                                <InfoIcon />
                            </IconButton>
                            </Box>

                            <Button
                            onClick={handleUpdateStato}
                            sx={{
                                mt: 2,
                                width: '60%',
                                backgroundColor: '#00B400',
                                color: 'white',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#019301',
                                    transform: 'scale(1.02)',
                                },
                            }}
                            >
                                {t("Cambia")}
                            </Button>
                            </Box>
                            </Modal>

                            { /* POPOVER PER LE INFO DEL CAMBIO STATO */ }
                            <Popover
                                            open={openStato}
                                            anchorEl={anchorElStato}
                                            onClose={handlePopoverStatoClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            >
                                            <List dense>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Gold:</Typography>
                                                        {" ho ricevuto un’esigenza di business"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Silver:</Typography>
                                                        {" ho fissato una prospection"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Bronze:</Typography>
                                                        {" sono entrato in contatto"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Wood:</Typography>
                                                        {" ho effettuato un’azione senza esito"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Start:</Typography>
                                                        {" non ho ancora effettuato azioni commerciali"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                            </List>
                                            </Popover>

                { /* SNACKBAR  */}
                <Snackbar open={snackbarOpen} autoHideDuration={7000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} TransitionComponent={TransitionLeft}>
                    <Alert variant='filled' onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
    </Card>
    );
};

export default KeypeopleCardFlip;