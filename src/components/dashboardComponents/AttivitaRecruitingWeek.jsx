import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Container, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TabellaAttivitaRecruiting from './TabellaAttivitaRecruiting';

const AttivitaRecruitingBox = ({data}) => {
 const [currentDate, setCurrentDate] = useState(new Date());


    const getWeekStart = (date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay() + 1);
        return start;
    };

    const getWeekEnd = (date) => {
        const end = new Date(date);
        end.setDate(end.getDate() - end.getDay() + 7);
        return end;
    };

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ];
        return monthNames[monthIndex];
    };

    const formatDate = (date, includeYear = true) => {
        const day = date.getDate();
        const month = getMonthName(date.getMonth());
        const year = date.getFullYear();
        return includeYear ? `${day} ${month} ${year}` : `${day}`;
    };

    const weekStart = getWeekStart(currentDate);
    const weekEnd = getWeekEnd(currentDate);
    const weekRange = `${formatDate(weekStart, false)} - ${formatDate(weekEnd)}`;

    const handlePreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    return (
        <Card className="cardTabellaBusiness" id="cardTabellaBusiness" style={{width: '100%', minHeight: '82%', maxHeight: '100%', display: 'flex', position: 'relative', borderRadius: '20px'}}>
            <CardContent style={{width: '100%',  display: 'flex', flexDirection: 'column', background: 'rgba(217, 217, 217, 0)', borderRadius: 20, border: '2px #00B400 solid'}}>
                {/* <Typography variant="h5" style={{marginBottom: 16, fontWeight: 'bold'}}>Attività ed Eventi</Typography> */}
                <Typography variant='h5' sx={{ display: 'flex',mt: 1, mb: 1, fontWeight: 'bold', justifyContent: 'flex-end', fontSize: '1.2em'}}>Attività ed Eventi Recruiting</Typography>
                <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: '100%', width: '100%', pt: 5, overflowY: 'auto' }}>
                    <TabellaAttivitaRecruiting data={data}/>
                </Container>
                <Box style={{ width: 250, height: 76, left: 0, top: 24, position: 'absolute', background: '#00B400', borderTopRightRadius: 20, borderBottomRightRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton onClick={handlePreviousWeek} style={{ color: 'white' }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ color: 'white', textAlign: 'center', padding: 8, fontWeight: 'bold' }}>
                        {weekRange}
                    </Typography>
                    <IconButton onClick={handleNextWeek} style={{ color: 'white' }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AttivitaRecruitingBox;
