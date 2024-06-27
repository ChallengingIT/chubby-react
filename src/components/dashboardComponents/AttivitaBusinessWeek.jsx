import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Container, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TabellaAttivitaBusiness from './TabellaAttivitaBusiness';
import axios from 'axios';

const AttivitaBusinessBox = ({ data, aziendeOptions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekData, setWeekData ] = useState(data);

    //stati per cambiare settimana
    const [interval, setInterval ] = useState(0);
    const pagina = 0;
    const quantita = 10;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

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
        setInterval(prevInterval => prevInterval - 1);
    };

    const handleNextWeek = () => {
        setInterval(prevInterval => prevInterval + 1);
    };

    useEffect(() => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + (interval * 7));
        setCurrentDate(newDate);
    }, [interval]);

    useEffect(() => {
        const fetchWeekData = async () => {
            const filtriDaInviare = {
                username: user.username || null,
                interval: interval,
                quantita: quantita || null,
                pagina: 0,
            };

            try {
                const response = await axios.get('http://89.46.196.60:8443/dashboard/attivita/business/personal/interval', {
                    headers: headers,
                    params: filtriDaInviare
                });
                setWeekData(response.data);
            } catch (error) {
                console.error("Error fetching week data:", error);
            }
        };

        fetchWeekData();
    }, [interval]);


    return (
        <Card className="cardTabellaBusiness" id="cardTabellaBusiness" style={{ width: '100%', minHeight: '82%', maxHeight: '100%', display: 'flex', position: 'relative', borderRadius: '20px' }}>
            <CardContent style={{ width: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(217, 217, 217, 0)', borderRadius: 20, border: '2px #00B400 solid' }}>
                <Typography variant='h5' sx={{ display: 'flex', mt: 1, mb: 1, fontWeight: 'bold', justifyContent: 'flex-end', fontSize: '1.2em' }}>Attività ed Eventi Business</Typography>
                <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: 'calc(100% - 76px)', width: '100%', pt: 5, overflowY: 'auto' }}>
                    <TabellaAttivitaBusiness 
                        data={weekData}
                        aziendeOptions={aziendeOptions} />
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

export default AttivitaBusinessBox;
