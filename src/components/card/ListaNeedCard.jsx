import React                 from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    } from '@mui/material';


    const calculateDataDifference = (weekString) => {
        const [ year, week ] = weekString.split('-W');
        const firstDayOfYear = new Date(year, 0, 1);
        const weekDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + (week - 1) * 7));
        weekDate.setDate(weekDate.getDate() - weekDate.getDay());
        const currentDate = new Date();
        const diffInMs = currentDate - weekDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays < 7) {
            return `${Math.round(diffInDays)} giorno${Math.round(diffInDays) !== 1 ? 'i' : ''} fa`;
        } else {
            const diffInWeeks = diffInDays / 7;
            return `${Math.round(diffInWeeks)} settiman${Math.round(diffInWeeks) !== 1 ? 'e' : ''} fa`;
        }
    };

    const ListaNeedCard = ({valori}) => {

        const navigate = useNavigate();

        const timeDifference = calculateDataDifference(valori.week);


        return (
            <Card raised sx={{
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
            }>
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
                    {valori.descrizione}
                </Typography>
                </Box>


                <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, color: 'black' }}>
                {timeDifference}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black' }}>
                {valori.stato && valori.stato.descrizione}
                </Typography>

            </CardContent>
            </Card>
        );
    };

    export default ListaNeedCard;