import React                                from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import LocalPhoneIcon                       from '@mui/icons-material/LocalPhone';
import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    } from '@mui/material';


const KeypeopleCard = ({valori}) => {

    const navigate = useNavigate();

    const navigateToAggiorna = (id, event) => {
        event.stopPropagation();
        navigate(`/keypeople/modifica/${valori.id}`, { state: { ...valori } });
    };


    return (
        <Card
        onClick={(event) => navigateToAggiorna(valori.id, event)}
        raised
        sx={{
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
        }}
    }
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
                {valori.nome} {valori.cognome}
            </Typography>
            </Box>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <BusinessCenterIcon sx={{ color: '#00853C', mr: 1 }} />
                {valori.ruolo}
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: '#00853C', mr: 1 }} />
                    {valori.email}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1}}>
                <LocalPhoneIcon sx={{ color: '#00853C', mr: 1}} />
                {valori.cellulare}
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
            {/* <Button 
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
                }}>Aggiorna</Button> */}
                    </Box>
                    <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '70%',
                    color: '#00853C',
                    }}
                >
                    {valori.cliente.denominazione}
                </Typography>
                    </Box>
        </CardActions>
    </Card>
    );
};

export default KeypeopleCard;