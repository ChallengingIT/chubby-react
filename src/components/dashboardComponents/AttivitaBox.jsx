    import React from 'react';
    import { Box, Card, CardContent, Typography } from '@mui/material';

    const AttivitaBox = () => {
        const currentDate = new Date();
    
        const day = currentDate.getDate();
        const month = getMonthName(currentDate.getMonth()); 
        const year = currentDate.getFullYear();
    
        function getMonthName(monthIndex) {
            const monthNames = [
                "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
            ];
            return monthNames[monthIndex];
        }
    
        const dataOdierna = `${day} ${month} ${year}`;

        
    return (
        <Card style={{width: '100%', height: '100%', position: 'relative', borderRadius: '20px'}}>
            <CardContent style={{width: '100%', height: '100%', left: 0, top: 0, position: 'absolute', background: 'rgba(217, 217, 217, 0)', borderRadius: 20, border: '2px #00B400 solid', }}>
                <Typography variant="h5" style={{ display: 'flex', justifyContent: 'flex-start', p: 3, fontWeight: 'bold'}}>Attività ed Eventi</Typography>
            <Box style={{width: 110, height: 56, right: 0, top: 24, position: 'absolute', background: '#00B400', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="h6" style={{color: 'white', textAlign: 'center', p: 2, fontWeight: 'bold'}}>
                {dataOdierna}
                </Typography>
            </Box>
            </CardContent>
        </Card>
    );
    };

    export default AttivitaBox;
