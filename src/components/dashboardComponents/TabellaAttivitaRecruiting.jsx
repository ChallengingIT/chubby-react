import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';

const TabellaAttivitaBusiness = ({ data = [] }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#191919', fontWeight: 'bold' }}>Data</TableCell>
                        <TableCell sx={{ color: '#191919', fontWeight: 'bold' }}>Ora</TableCell>
                        <TableCell sx={{ color: '#191919', fontWeight: 'bold' }}>Azione</TableCell>
                        <TableCell sx={{ color: '#191919', fontWeight: 'bold' }}>Owner</TableCell>
                        <TableCell sx={{ color: '#191919', fontWeight: 'bold' }}>Candidato</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((item, index) => {
                        const formattedDate = format(new Date(item.data), 'dd-MM-yyyy');
                        const formattedTime = format(new Date(item.data), 'HH:mm');

                        return (
                            <TableRow key={item.idIntervista || index}>
                                <TableCell>{formattedDate}</TableCell>
                                <TableCell>{formattedTime}</TableCell>
                                <TableCell>{item.azione}</TableCell>
                                <TableCell>{item.siglaOwner}</TableCell>
                                <TableCell>{item.nomeCandidato} {item.cognomeCandidato}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TabellaAttivitaBusiness;
