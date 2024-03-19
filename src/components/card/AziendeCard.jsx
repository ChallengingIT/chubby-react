import React                 from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import FactoryIcon                          from '@mui/icons-material/Factory';
import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    } from '@mui/material';


const AziendeCard = ({valori}) => {

    const navigate = useNavigate();

    const getCardStyle = (tipologia) => {
        switch (tipologia) {
            // case 'CLIENTE':
            //     return {
            //         borderRadius: '20px', 
            //         maxWidth: '80%', 
            //         justifyContent: 'center', 
            //         margin: 'auto', 
            //         cursor: 'pointer', 
            //         height: 'auto',
            //         borderColor: '2px solid #00853C', // Verde
            //         transition: 'transform 0.3s ease, border-width 0.3s ease', 

            //         '&:hover': {
            //             transform: 'scale(1.05)', 
            //             border: '4px solid #00853C'
            //         }
            //     };
            case 'PROSPECT':
                return {
                    borderRadius: '20px', 
                    maxWidth: '80%', 
                    justifyContent: 'center', 
                    margin: 'auto', 
                    cursor: 'pointer', 
                    height: 'auto',
                    borde: '2px solid #ffae44', // Blu navy
                    transition: 'transform 0.3s ease, border-width 0.3s ease', 

                    '&:hover': {
                        transform: 'scale(1.05)', 
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
                    border: '2px solid #ffae44', // Blu navy
                    transition: 'transform 0.3s ease, border-width 0.3s ease', 

                    '&:hover': {
                        transform: 'scale(1.05)', 
                        border: '4px solid #ffae44'
                    }
                };
                
            case 'CONSULENZA':
                return {
                    backgroundColor: '#f0f0f0', // Grigio Chiaro
                    borderColor: '#f0f0f0'
                    // pointerEvents: 'none', // Disabilita interazioni
                    // opacity: 0.5 
                };
                case 'Consulenza':
                return {
                    backgroundColor: '#f0f0f0', // Grigio Chiaro
                    borderColor: '#f0f0f0'
                    // pointerEvents: 'none', // Disabilita interazioni
                    // opacity: 0.5 
                };
            default:
                return { 
                borderRadius: '20px', 
                maxWidth: '80%', 
                justifyContent: 'center', 
                margin: 'auto', 
                cursor: 'pointer', 
                height: 'auto', 
                border: '2px solid #00853C', 
                transition: 'transform 0.3s ease, border-width 0.3s ease', 
                '&:hover': {
                transform: 'scale(1.05)', 
                border: '4px solid #00853C'
                }};
        }
    };

    const cardStyle = {
        borderRadius: '20px',
        maxWidth: '80%',
        justifyContent: 'center',
        margin: 'auto',
        cursor: 'pointer',
        height: 'auto',
        border: '2px solid', 
        transition: 'transform 0.3s ease, border-width 0.3s ease',
        ...getCardStyle(valori.tipologia) 
    };




    // const handleCardClick = (id) => {
    //     navigate(`/need/dettaglio/${valori.id}`, { state: { ...valori } });
    // };


    const navigateToAssocia = (id) => {
        navigate(`/need/${valori.id}`, { state: {...valori}});
    };
    

    const navigateToAggiorna = (id, event) => {
        event.stopPropagation();
        navigate(`/aziende/modifica/${valori.id}`, { state: { ...valori } });
    };

    // const handleOpenStato = (event) => {
    //     event.stopPropagation();
    //     setOpenStato(true);
    // };

    // const handleCloseStato = (event) => {
    //     event.stopPropagation();
    //     setOpenStato(false);
    // };

    return (
        <Card
            raised 
            sx={cardStyle}
            onClick={() => navigateToAssocia(valori.id)}
            >
        <CardContent>
            {/* Contenuto della Card */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    {/* <Button
                    onClick={handleOpenStato}
                    size='small'
                    sx={{
                        color: '#000000',
                        minWidth: 'auto',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        },
                    }}
                    >
                        <InfoButton />
                    </Button> */}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black' }}>
                {valori.citta}
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: '#00853C', mr: 1 }} />
                    {valori.email}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <FactoryIcon sx={{ color: '#00853C', mr: 1 }} />
                {valori.tipologia}
            </Typography>

        </CardContent>
        <CardActions>
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                mr:2
            }} >
                <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    mr:3
                    
                }}>
            <Button 
            size="small"
            onClick={(event) => navigateToAggiorna(valori.id, event)}
            sx={{
                backgroundColor: 'black',
                color: 'white',
                ml: 1,
                mb: 1,
                textTransform: 'lowercase',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: 'black',
                    transform: 'scale(1.05)',
                    },
                }}>Aggiorna</Button>
                {/* <Button
                    size="small"
                    onClick={(event) => navigateToAssocia(valori.id, event)}
                    sx={{
                    backgroundColor: '#000000',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#000000',
                        transform: 'scale(1.05)',
                    },
                    }}>List</Button> */}
                    </Box>
                    </Box>
        </CardActions>
    </Card>
    );
};

export default AziendeCard;