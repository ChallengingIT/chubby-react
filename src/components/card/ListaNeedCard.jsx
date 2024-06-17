import React, {useState, useEffect}                 from 'react';
import { useNavigate }                              from 'react-router-dom';
import BusinessCenterIcon                           from '@mui/icons-material/BusinessCenter';
import axios                                        from 'axios';
import ChangeCircleIcon                             from '@mui/icons-material/ChangeCircle'; //cambia stato
import DeleteIcon                                   from '@mui/icons-material/Delete'; //cancella
import { Edit }                                     from '@mui/icons-material';
import AutoModeIcon                                 from '@mui/icons-material/AutoMode'; //stato
import TagIcon                                      from '@mui/icons-material/Tag'; //numero progressivo
import PlaceIcon                                    from '@mui/icons-material/Place';
import CloseIcon                                    from '@mui/icons-material/Close';
import TrendingDownIcon                             from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon                             from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon                               from '@mui/icons-material/TrendingUp';
import CallMadeIcon                                 from '@mui/icons-material/CallMade'; //priorità massima

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
    ListItemText,
    ListItemIcon,
    FormControl,
    TextField,
    Autocomplete,
    Snackbar,
    Alert,
    Slide

    } from '@mui/material';
import { useUserTheme } from '../TorchyThemeProvider';

const NeedCardFlip = ({valori, statoOptions, onDelete, onRefresh, isFirstCard }) => {

    const navigate = useNavigate();
    const theme = useUserTheme();
    const [ modalStato,        setModalStato      ] = useState(false);
    const [ modalDelete,       setModalDelete     ] = useState(false);
    const [ newStato,          setNewStato        ] = useState(valori.stato?.id); 
    const [ idNeed,            setIdNeed          ] = useState(null);
    const [ values,            setValues          ] = useState({
        stato: ''
    });
    const [isFlipped, setIsFlipped] = useState(false);
    const [mezzoFlip, setMezzoFlip] = useState(false);
    const [activeLink,            ] = useState(null);
    const [alert,     setAlert    ] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);


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


    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };




    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };
    


    useEffect(() => {
        setNewStato(valori.stato?.id);
    }, [valori.stato?.id]);
    
    const toggleFlip = () => {
        if ( modalStato) {
            return;
        }
        setIsFlipped(!isFlipped);
    };

    const navigateToAssocia = (id, event) => {
        // event.stopPropagation();
        navigate(`/need/match/${valori.id}`, { state: {...valori}});
    };

    const navigateToAggiorna = (id, event) => {
        // event.stopPropagation();
        navigate(`/need/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalStato = (id, event) => {
        event.stopPropagation();
        setModalStato(true);
        setIdNeed(id);
        setValues(prevValues => ({
            ...prevValues,
            stato: valori.stato?.id
        }));
    };
    

    const handleUpdateStato = async () => {
        const idStato = values.stato;  
        const params = new URLSearchParams({ stato: idStato });
        try {
            const responseUpdateStato = await axios.post(`http://localhost:8080/need/react/salva/stato/${idNeed}?${params.toString()}`, {}, { headers: headers });
            setModalStato(false);
            onRefresh();
            if (responseUpdateStato.data === "ERRORE") {
                setAlert({ open: true, message: "errore durante il salvataggio dell'azienda!" });
                console.error("L'azienda non è stata salvata.");
                return;
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello stato: ", error);
        }
    };
    
    const handleOpenModalDelete = () => setModalDelete(true);
    const handleCloseModalDelete = () => setModalDelete(false);

    const confirmDelete = () => {
        onDelete();
        handleCloseModalDelete(true);
    };


    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        border: 'solid 2px',
        borderColor: theme.palette.border.main,
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
        minHeight: '18em',        
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


    const mediaPriorita = (priorita) => {
        if (priorita >= 0 && priorita <= 1) {
            return { icon: <CallMadeIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Massima" };
        } else if (priorita > 1 && priorita <= 2) {
            return { icon: <TrendingUpIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Alta" };
        } else if (priorita > 2 && priorita <= 3) {
            return { icon: <TrendingFlatIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Media" };
        } else if (priorita > 3) {
            return { icon: <TrendingDownIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Bassa" };
        } else {
            return { icon: null, text: "" }; 
        }
    };

    const { icon, text } = mediaPriorita(valori.priorita);

    const menuData = [
        {
            title: 'Aggiorna Need',
            icon: <Edit />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            }
        },
        // {
        //     title: 'Match',
        //     icon: <JoinInnerIcon />,
        //     onClick: (event) => {
        //         navigateToAssocia(valori.id, event);
        //     }
        // },
        {
            title: 'Cambia Stato',
            icon: <ChangeCircleIcon />,
            onClick: (event) => {
                handleOpenModalStato(valori.id, event);
            }
        },
        {
            title: 'Elimina Need',
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            },
            isVisible: userHasRole('ROLE_ADMIN' && 'ROLE_BUSINESS'),
        }
    ];


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
                width: '100%',
                ml: 1
                }}
            >
                {valori.descrizione}
            </Typography>


            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <TagIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    {valori.progressivo}
            </Typography>



            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <PlaceIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    {valori.location}
            </Typography>


            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    {icon}
                    Priorità: {text}
            </Typography>


            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <BusinessCenterIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    {valori.tipologia && valori.tipologia.descrizione
                    ? valori.tipologia.descrizione
                    : "N/A"}
                    </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <AutoModeIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    {valori.stato && valori.stato.descrizione
                    ? valori.stato.descrizione
                    : "N/A"}
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
            {/* <Typography variant="h6" color="text.primary" sx={{ color: 'black', fontWeight: 'bold', display: 'flex', mr: 1, mt: 2 }}>{valori.cliente.denominazione}</Typography> */}
            <img src={`data:image/png;base64,${valori.cliente.logo}`} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />

        </Box>
                </Box>
        </CardContent>
        </div>



        <div style={cardBackStyle}>
        <CardContent sx={{ backfaceVisibility: 'hidden'}}>
            {/* Contenuto della Card */}
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
                width: '100%',
                
                }}
            >
                Menu
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 1 }}>
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
                                    backgroundColor: theme.palette.hover.main,
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: 'white',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeLink === `/${item.title.toLowerCase()}` ? theme.palette.icon.main : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? theme.palette.icon.main : theme.palette.icon.main,
                                    minWidth: '2.2em',
                                },
                                '& .MuiListItemText-primary': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? theme.palette.icon.main : 'black',
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

        <Modal
                open={modalDelete}
                onClose={handleCloseModalDelete}
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Sei sicuro di voler eliminare il need?
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
                                backgroundColor: theme.palette.button.black,
                                color: 'white',
                                borderRadius: '5px',
                                '&:hover': {
                                    backgroundColor: "#019301",
                                    color: 'white',
                                    transform: 'scale(1.01)'
                                },
                            }}>
                                Conferma
                            </Button>
                            </Box>
                            </Box>
                </Modal>

                { /* MODAL PER IL CAMBIO STATO */ }
                <Modal
                    open={modalStato}
                    onClose={() => setModalStato(false)}
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
                            <IconButton sx={{ mr: 2, backgroundColor: 'transparent', border: 'none' }} onClick={() => setModalStato(false)}>
                                <CloseIcon sx={{ backgroundColor: 'transparent' }}/>
                            </IconButton>
                        </Box>
                        
                        <FormControl fullWidth >
                        <Autocomplete
                                id="stato-combo-box"
                                options={statoOptions}
                                getOptionLabel={(option) => option.label}
                                value={statoOptions.find(option => option.value === values.stato) || null}
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
                                            },
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: theme.palette.border.main,
                                            }, 
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
                                backgroundColor: theme.palette.button.main,
                                color: 'white',
                                borderRadius: '10px',
                                '&:hover': {
                                    backgroundColor: theme.palette.button.main,
                                    transform: 'scale(1.02)',
                                },
                            }}
                            >
                                Cambia
                            </Button>
                            </Box>
                            </Modal>

            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
    </Card>
    );
};

export default NeedCardFlip;