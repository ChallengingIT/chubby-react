import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TabellaAttivitaBusiness from './TabellaAttivitaBusiness';
import TabellaAttivitaRecruiting from './TabellaAttivitaRecruiting.jsx';
import axios from 'axios';
import { useUserTheme } from '../TorchyThemeProvider.jsx';

const BoxAttivitaWeek = ({ aziendeOptions }) => {
    const theme = useUserTheme();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDataBusiness, setWeekDataBusiness] = useState([]);
    const [weekDataRecruiting, setWeekDataRecruiting] = useState([]);
    const [currentData, setCurrentData] = useState('recruiting');
    const [interval, setInterval] = useState(0);
    const quantita = 10;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
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
        const fetchWeekData = async (type) => {
            const isAdmin = userHasRole("ROLE_ADMIN");
            const filtriDaInviare = {
                interval: interval,
                quantita: quantita || null,
                pagina: 0,
                ...(isAdmin ? {} : { username: user.username || null })
            };

            const baseUrl = isAdmin
                ? `http://localhost:8080/dashboard/attivita/${type}`
                : `http://localhost:8080/dashboard/attivita/${type}/personal`;

            try {
                const response = await axios.get(`${baseUrl}/interval`, {
                    headers: headers,
                    params: filtriDaInviare
                });
                if (type === 'business') {
                    setWeekDataBusiness(response.data);
                } else {
                    setWeekDataRecruiting(response.data);
                }
            } catch (error) {
                console.error(`Error fetching ${type} week data:`, error);
            }
        };

        fetchWeekData('business');
        fetchWeekData('recruiting');
    }, [interval]);

    const isAdmin = userHasRole("ROLE_ADMIN");
    const isBM = userHasRole("ROLE_BM");

    return (
        <Box className="cardTabellaBusiness" id="cardTabellaBusiness" sx={{ width: '100%', height: '100%', position: 'relative', }}>
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                <Typography variant='h5' sx={{ mt: 1, mb: 1, mr: 2, fontWeight: 'bold', fontSize: '1.2em' }}>
                    To do list
                </Typography>
                <Box>
                    {(isAdmin || isBM) && (
                        <Button
                            variant="contained"
                            onClick={() => setCurrentData('business')}
                            sx={{
                                mr: 2,
                                bgcolor: currentData === 'business' ? '#00B400' : '#191919',
                                borderRadius: '10px',
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        >
                            Business
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        onClick={() => setCurrentData('recruiting')}
                        sx={{
                            bgcolor: currentData === 'recruiting' ? '#00B400' : '#191919',
                            borderRadius: '10px',
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        Recruiting
                    </Button>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: 'calc(100% - 76px)', width: '100%', pt: 5, overflowY: 'auto' }}>
                {currentData === 'business' ? (
                    <TabellaAttivitaBusiness
                        data={weekDataBusiness}
                        aziendeOptions={aziendeOptions} />
                ) : (
                    <TabellaAttivitaRecruiting
                        data={weekDataRecruiting}
                        aziendeOptions={aziendeOptions} />
                )}
            </Box>
            <Box style={{ width: 250, height: 76, left: -16, top: 1, position: 'absolute', background: theme.palette.button.main, borderTopRightRadius: 20, borderBottomRightRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </Box>
    );
};

export default BoxAttivitaWeek;
