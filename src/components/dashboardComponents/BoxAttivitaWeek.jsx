import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TabellaAttivitaBusiness from './TabellaAttivitaBusiness';
import axios from 'axios';
import { useUserTheme } from '../TorchyThemeProvider.jsx';
import { useTranslation } from "react-i18next";
import TabellaAzioni from './TabellaAzioni.jsx';

const BoxAttivitaWeek = ({ aziendeOptions }) => {

    const theme = useUserTheme();
    const { t } = useTranslation();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDataKeyPeople, setWeekDataKeyPeople] = useState([]);
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
                ? `http://localhost:8080/dashboard/attivita/business`
                : `http://localhost:8080/dashboard/attivita/business/personal`;

            try {
                const response = await axios.get(`${baseUrl}/interval`, {
                    headers: headers,
                    params: filtriDaInviare
                });
                setWeekDataKeyPeople(Array.isArray(response.data) ? response.data : []);
                console.log(response.data)
                console.log("Interval:", interval);
                console.log("User:", user.username);
                console.log("Admin?", userHasRole("ADMIN"));
                console.log("URL chiamata:", `${baseUrl}/interval`);
                console.log("Params:", filtriDaInviare);
            } catch (error) {
                console.error(`Error fetching ${type} week data:`, error);
            }
        };

        fetchWeekData();
    }, [interval]);

    return (
        <Box className="cardTabellaBusiness" sx={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', paddingTop: 1, paddingBottom: 0}}>
            <Box display="flex" alignItems="center" mb={0} ml={2} sx={{ paddingBottom: 0}}>
                <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                    {t("Piano Incontri")}
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'auto', alignItems: "center", paddingBottom: 0}}>
                <TabellaAzioni
                    data={weekDataKeyPeople}
                    aziendeOptions={aziendeOptions} />
            </Box>
        </Box>
    );
};

export default BoxAttivitaWeek;
