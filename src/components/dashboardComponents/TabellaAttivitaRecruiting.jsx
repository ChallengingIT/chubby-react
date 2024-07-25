import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next"; 


const TabellaAttivitaRecruiting = ({ data = [] }) => {

    const { t } = useTranslation(); 

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    const cellStyle = {
        padding: '8px 8px', 
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Data')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Ora')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Azione')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Owner')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Candidato')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((item, index) => {
                        const formattedDate = format(new Date(item.data), 'dd-MM-yyyy');
                        const formattedTime = format(new Date(item.data), 'HH:mm');

                        return (
                            <TableRow key={item.idIntervista || index}>
                                <TableCell style={cellStyle}>{formattedDate}</TableCell>
                                <TableCell style={cellStyle}>{formattedTime}</TableCell>
                                <TableCell style={cellStyle}>{item.azione}</TableCell>
                                <TableCell style={cellStyle}>{item.siglaOwner}</TableCell>
                                <TableCell style={cellStyle}>{item.nomeCandidato} {item.cognomeCandidato}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TabellaAttivitaRecruiting;
