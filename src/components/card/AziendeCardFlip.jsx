import React, {useState}                    from 'react';
import { useNavigate }                      from 'react-router-dom';
import FactoryIcon                          from '@mui/icons-material/Factory';
import PlaceIcon                            from '@mui/icons-material/Place';
import TrendingDownIcon                     from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon                     from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon                       from '@mui/icons-material/TrendingUp';
import JoinInnerIcon                        from '@mui/icons-material/JoinInner';
import SettingsIcon                         from '@mui/icons-material/Settings';
import DeleteIcon                           from '@mui/icons-material/Delete';

import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    Modal,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    } from '@mui/material';
import { useUserTheme } from '../TorchyThemeProvider';

const AziendeCardFlip = ({valori, onDelete}) => {
    const theme = useUserTheme();

    const [ modalDelete,       setModalDelete     ] = useState(false);
    const [ isFlipped,         setIsFlipped       ] = useState(false);
    const [ activeLink,                           ] = useState(null);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };


    const getCardStyle = (tipologia) => {
        switch (tipologia) {

            case 'PROSPECT':
                return {
                    borderRadius: '20px', 
                    maxWidth: '80%', 
                    justifyContent: 'center', 
                    margin: 'auto', 
                    cursor: 'pointer', 
                    height: 'auto',
                    transition: 'transform 0.3s ease, border-width 0.3s ease', 
                    '&:hover': {
                        transform: 'scale(1.02)', 
                        border: '4px solid #ffae44'
                    }
                };

                case 'Prospect':
                return {
                    borderRadius: '20px', 
                    maxWidth: '80%', 
                    justifyContent: 'center', 
                    margin: 'auto', 
                    cursor: 'pointer', 
                    height: 'auto',
                    transition: 'transform 0.3s ease, border-width 0.3s ease', 
                    '&:hover': {
                        transform: 'scale(1.02)', 
                        border: '4px solid #ffae44'
                    }
                };
                
            case 'EXCLIENTE':
                return {
                    backgroundColor: '#f0f0f0', // Grigio Chiaro
                    borderColor: '#f0f0f0',
                    margin: 'auto', 
                };
                case 'Ex cliente':
                return {
                    backgroundColor: '#f0f0f0', // Grigio Chiaro
                    borderColor: '#f0f0f0',
                    margin: 'auto', 
                };

            default:
                return { 
                borderRadius: '20px', 
                maxWidth: '80%', 
                justifyContent: 'center', 
                margin: 'auto', 
                cursor: 'pointer', 
                height: 'auto', 
                border: '2px solid',
                borderColor: theme.palette.border.main,
                transition: 'transform 0.3s ease, border-width 0.3s ease', 
                '&:hover': {
                transform: 'scale(1.02)', 
                border: '4px solid',
                borderColor: theme.palette.border.main
                }};
        }
    };


    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        ...getCardStyle(valori.tipologia),
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

    const mediaIda = (ida) => {
        if (ida >= 0 && ida <= 1) {
            return { icon: <TrendingDownIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Basso" };
        } else if (ida > 1 && ida <= 2) {
            return { icon: <TrendingFlatIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Medio" };
        } else if (ida > 2) {
            return { icon: <TrendingUpIcon sx={{ color: theme.palette.icon.main, mr: 1}}/>, text: "Alto" };
        } else {
            return { icon: null, text: "" }; 
        }
    };

    const { icon, text } = mediaIda(valori.ida);

    const navigateToAssocia = (id) => {
        navigate(`/need/${valori.id}`, { state: {...valori}});
    };
    
    const navigateToAggiorna = (id, event) => {
        // event.stopPropagation();
        navigate(`/business/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalDelete = (event) => {
        // event.stopPropagation();
        setModalDelete(true);
    };

    const handleCloseModalDelete = (event) => {
        setModalDelete(false);
    };
    
    const confirmDelete = (id, event) => {
        onDelete();
        handleCloseModalDelete(true);
    };

    //controllo del ruolo dell'utente loggato
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
            title: 'Need Associati',
            icon: <JoinInnerIcon />,
            onClick: () => {
                navigateToAssocia(valori.id);
            }
        },
        {
            title: 'Aggiorna Azienda',
            icon: <SettingsIcon />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            }
        },
        {
            title: 'Elimina Azienda',
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            },
            isVisible: userHasRole('ROLE_ADMIN'),
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
                width: '100%' 
                }}
            >
                {valori.denominazione}
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                    <PlaceIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                    {valori.citta} - {valori.sedeOperativa}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <FactoryIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                {valori.settoreMercato}
            </Typography>


            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'black', mt: 1 }}>
                {icon}
                IDA: {text}
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
            <img src={`data:image/png;base64,${valori.logo}`} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
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
                {valori.denominazione}
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
    </Card>
    );
};

export default AziendeCardFlip;