import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useUserTheme } from '../TorchyThemeProvider.jsx';
import { useTranslation } from "react-i18next";
import TabellaAzioni from './TabellaAzioni.jsx';

const BoxAttivitaWeek = ({ aziendeOptions, expanded, setExpanded, height, pageSize }) => {

    const theme = useUserTheme();
    const { t } = useTranslation();

    const [weekDataKeyPeople, setWeekDataKeyPeople] = useState([]);
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

    // Fetch data for multiple weeks, for example current week and previous/next weeks
    // Here we fetch data for -1, 0, 1 intervals to show multiple weeks together
    const intervalsToFetch = [-1, 0, 1];

    useEffect(() => {
        const fetchAllWeeksData = async () => {
            const isAdmin = userHasRole("ADMIN");
            let allData = [];

            for (const interval of intervalsToFetch) {
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
                    // Add interval info to each data item
                    const dataWithInterval = (Array.isArray(response.data) ? response.data : []).map(item => ({
                        ...item,
                        interval
                    }));
                    allData = allData.concat(dataWithInterval);
                } catch (error) {
                    console.error(`Error fetching week data for interval ${interval}:`, error);
                }
            }
            setWeekDataKeyPeople(allData);
        };

        fetchAllWeeksData();
    }, []);

    // Helper to get week range string from interval
    const getWeekRangeFromInterval = (interval) => {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + (interval * 7));
        const weekStart = getWeekStart(baseDate);
        const weekEnd = getWeekEnd(baseDate);
        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    };

    // Prepare data grouped by week range for the table component to render merged cells
    // This grouping will be done inside TabellaAzioni based on 'interval' property

    return (
        <Box className="cardTabellaBusiness" sx={{ width: '100%', height: height, position: 'relative', display: 'flex', flexDirection: 'column', p: 0 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={0} ml={2} mt={0} sx={{ paddingBottom: 0 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '1.2em', color: "#333" }}>
                    {t("Piano Incontri")}
                </Typography>
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    style={{
                        color: "#333",
                        border: "thin solid #ccc",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        paddingRight: "12px",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        marginRight: "6px",
                        marginTop: "0px"
                    }}
                >
                    {expanded ? "Comprimi ▲" : "Estendi ▼"}
                </button>
            </Box>
            <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'auto', alignItems: "center", p: 0 }}>
                <TabellaAzioni
                    data={weekDataKeyPeople}
                    aziendeOptions={aziendeOptions}
                    getWeekRangeFromInterval={getWeekRangeFromInterval} // pass helper for week range formatting
                    showWeekColumn={true} // flag to show the new week column with merged cells
                    pageSize={pageSize}
                    expanded={expanded}
                />
            </Box>
        </Box>
    );
};

export default BoxAttivitaWeek;
