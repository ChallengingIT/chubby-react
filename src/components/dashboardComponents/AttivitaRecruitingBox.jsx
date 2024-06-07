import React from 'react';
import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import TabellaAttivitaRecruiting from './TabellaAttivitaRecruiting';

const AttivitaRecruitingBox = ({data}) => {
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
       <Card className="cardTabellaBusiness" id="cardTabellaBusiness" style={{width: '100%', minHeight: '82%', maxHeight: '82%', display: 'flex', position: 'relative', borderRadius: '20px'}}>
            <CardContent style={{width: '100%',  display: 'flex', flexDirection: 'column', background: 'rgba(217, 217, 217, 0)', borderRadius: 20, border: '2px #00B400 solid'}}>
                {/* <Typography variant="h5" style={{marginBottom: 16, fontWeight: 'bold'}}>Attività ed Eventi</Typography> */}
                <Typography variant='h5' sx={{ display: 'flex',mt: 1, mb: 1, fontWeight: 'bold', justifyContent: 'flex-end', fontSize: '1.2em'}}>Attività ed Eventi Recruiting</Typography>
                <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: '100%', width: '100%', pt: 5, overflowY: 'auto' }}>
                    <TabellaAttivitaRecruiting data={data}/>
                </Container>
                <Box style={{ width: 130, height: 76, left: 0, top: 24, position: 'absolute', background: '#00B400', borderTopRightRadius: 20, borderBottomRightRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant="h6" style={{color: 'white', textAlign: 'center', padding: 8, fontWeight: 'bold'}}>
                        {dataOdierna}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AttivitaRecruitingBox;
