import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Divider } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TabellaAttivitaBusiness from './TabellaAttivitaBusiness';
import TabellaAttivitaRecruiting from './TabellaAttivitaRecruiting.jsx';
import axios from 'axios';
import { useUserTheme } from '../TorchyThemeProvider.jsx';
import { useTranslation } from "react-i18next";

const BoxAttivitaWeek = ({ aziendeOptions }) => {
    const theme = useUserTheme();
    const { t } = useTranslation();

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
            t("Gennaio"), t("Febbraio"), t("Marzo"), t("Aprile"), t("Maggio"), t("Giugno"),
            t("Luglio"), t("Agosto"), t("Settembre"), t("Ottobre"), t("Novembre"), t("Dicembre")
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
            const isAdmin = userHasRole("ADMIN");
            const filtriDaInviare = {
                interval: interval,
                quantita: quantita || null,
                pagina: 0,
                ...(isAdmin ? {} : { username: user.username || null })
            };

            const baseUrl = isAdmin
                ? `http://89.46.196.60:8443/dashboard/attivita/${type}`
                : `http://89.46.196.60:8443/dashboard/attivita/${type}/personal`;

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

    const isAdmin = userHasRole("ADMIN");
    const isBM = userHasRole("BM");

    return (
        <Box className="cardTabellaBusiness" id="cardTabellaBusiness" sx={{ width: '100%', height: '100%', position: 'relative', }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                    <Typography variant='h5' sx={{ mt: 1, mb: 1, ml: 2, fontWeight: 'bold', fontSize: '1.2em' }}>
                        {t("Actions")}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                        <IconButton onClick={handlePreviousWeek} sx={{ color: '#00B400' }}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography variant="h8" style={{ color: 'black', textAlign: 'center', padding: 8, fontWeight: 'bold', fontSize: '0.9em' }}>
                            {weekRange}
                        </Typography>
                        <IconButton onClick={handleNextWeek} style={{ color: '#00B400' }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f0f0f0",
                        borderRadius: "20px",
                        padding: "4px",
                        width: "fit-content",
                        position: "relative",
                        gap: 2,
                        
                    }}
                >
                    <Box
                    sx={{
                        position: "absolute",
                        top: "4px",
                        bottom: "4px",
                        left: currentData === "business" ? "4px" : "50%",
                        width: "50%",
                        borderRadius: "16px",
                        backgroundColor: "#00B400",
                        transition: "all 0.3s ease",
                        
                    }}
                />
                {(isAdmin || isBM) && (
                    <Button
                        onClick={() => setCurrentData("business")}
                        sx={{
                            flex: 1,
                            borderRadius: "20px",
                            backgroundColor: currentData === "business" ? "#00B400" : "transparent",
                            color: currentData === "business" ? "white" : "black",
                            fontWeight: currentData === "business" ? "bold" : "normal",
                            textTransform: "none",
                            padding: "8px 16px",
                            "&:hover": {
                                // backgroundColor: currentData === "business" ? "#009e00" : "#e0e0e0",
                                bgcolor: 'transparent'
                            },
                        }}
                    >
                        {t("Business")}
                    </Button>
                    )}
                    <Button
                        onClick={() => setCurrentData("recruiting")}
                        sx={{
                            flex: 1,
                            borderRadius: "20px",
                            backgroundColor: currentData === "recruiting" ? "#00B400" : "transparent",
                            color: currentData === "recruiting" ? "white" : "black",
                            fontWeight: currentData === "recruiting" ? "bold" : "normal",
                            textTransform: "none",
                            padding: "8px 16px",
                            "&:hover": {
                                // backgroundColor: currentData === "recruiting" ? "#009e00" : "#e0e0e0",
                                bgcolor: 'transparent'
                            },
                        }}
                    >
                        {t("Recruiting")}
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ bgcolor: 'lightgray', height: 2 }} />
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: 'calc(100% - 76px)', width: '100%', overflowY: 'auto' }}>
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
        </Box>
    );
};

export default BoxAttivitaWeek;
