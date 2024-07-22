import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format } from 'date-fns';

const TabellaAttivitaBusiness = ({ data = [], aziendeOptions = [] }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    const [expandedId, setExpandedId] = useState(null);

    const handleToggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleToggleCompleted = (id) => {
        const updatedActivities = activities.map(item =>
            item.idAzione === id ? { ...item, completed: !item.completed } : item
        );
        setActivities(updatedActivities);
    };

    const getAziendaLabel = (idCliente) => {
        const azienda = aziendeOptions.find(option => option.value === idCliente);
        return azienda ? azienda.label : 'Azienda Sconosciuta';
    };

    const cellStyle = {
        padding: '8px 8px', 
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Data</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Ora</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Azione</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Owner</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Cliente</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>Contatto</TableCell>
                        <TableCell style={cellStyle} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((item, index) => {
                        const formattedDate = format(new Date(item.data), 'dd-MM-yyyy');
                        const formattedTime = format(new Date(item.data), 'HH:mm');

                        return (
                            <React.Fragment key={item.idAzioneKeyPeople || index}>
                                <TableRow>
                                    <TableCell style={cellStyle}>{formattedDate}</TableCell>
                                    <TableCell style={cellStyle}>{formattedTime}</TableCell>
                                    <TableCell style={cellStyle}>{item.azione}</TableCell>
                                    <TableCell style={cellStyle}>{item.siglaOwner}</TableCell>
                                    <TableCell style={cellStyle}>{getAziendaLabel(item.idCliente)}</TableCell>
                                    <TableCell style={cellStyle}>{item.nomeContatto}</TableCell>
                                    <TableCell style={cellStyle}>
                                        <IconButton
                                            onClick={() => handleToggleExpanded(item.idAzioneKeyPeople)}
                                            aria-label="expand row"
                                            size="small"
                                        >
                                            {expandedId === item.idAzioneKeyPeople ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                        <Collapse in={expandedId === item.idAzioneKeyPeople} timeout="auto" unmountOnExit>
                                            <Typography variant="body2" style={{ padding: '10px' }}>
                                                <strong>Note:</strong> {item.note || 'Nessuna nota'}
                                            </Typography>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TabellaAttivitaBusiness;
