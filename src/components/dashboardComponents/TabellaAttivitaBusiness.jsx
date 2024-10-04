import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography, Paper, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next"; 

const TabellaAttivitaBusiness = ({ data = [], aziendeOptions = [] }) => {
    const { t } = useTranslation(); 
    const [activities, setActivities] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    // Stato per i filtri
    const [filters, setFilters] = useState({
        owner: '',
        azione: '',
        cliente: '',
        contatto: ''
    });

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    const handleToggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
    };

    const getAziendaLabel = (idCliente) => {
        const azienda = aziendeOptions.find(option => option.value === idCliente);
        return azienda ? azienda.label : 'Azienda Sconosciuta';
    };

    const cellStyle = {
        padding: '8px 8px', 
    };

    // Filtrare i dati in base ai filtri
    const filteredActivities = activities.filter(item => {
        return (
            item.siglaOwner.toLowerCase().includes(filters.owner.toLowerCase()) &&
            item.azione.toLowerCase().includes(filters.azione.toLowerCase()) &&
            getAziendaLabel(item.idCliente).toLowerCase().includes(filters.cliente.toLowerCase()) &&
            item.nomeContatto.toLowerCase().includes(filters.contatto.toLowerCase())
        );
    });

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Data')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Ora')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Owner')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Azione')}</TableCell>
                        {/* <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Esito azione')}</TableCell> */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Cliente')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold'}}>{t('Contatto')}</TableCell>
                        <TableCell style={cellStyle} />
                    </TableRow>
                    <TableRow>
                        {/* Rimosso il TextField per la colonna Data */}
                        <TableCell style={cellStyle} />
                        {/* Rimosso il TextField per la colonna Ora */}
                        <TableCell style={cellStyle} />
                        <TableCell style={cellStyle}>
                            <TextField
                                variant="standard"
                                value={filters.owner}
                                onChange={(e) => handleFilterChange('owner', e.target.value)}
                                placeholder={t('Filtra per owner')}
                                fullWidth
                            />
                        </TableCell>
                        <TableCell style={cellStyle}>
                            <TextField
                                variant="standard"
                                value={filters.azione}
                                onChange={(e) => handleFilterChange('azione', e.target.value)}
                                placeholder={t('Filtra per azione')}
                                fullWidth
                            />
                        </TableCell>
                        {/* <TableCell style={cellStyle}></TableCell>  */}
                        <TableCell style={cellStyle}>
                            <TextField
                                variant="standard"
                                value={filters.cliente}
                                onChange={(e) => handleFilterChange('cliente', e.target.value)}
                                placeholder={t('Filtra per cliente')}
                                fullWidth
                            />
                        </TableCell>
                        <TableCell style={cellStyle}>
                            <TextField
                                variant="standard"
                                value={filters.contatto}
                                onChange={(e) => handleFilterChange('contatto', e.target.value)}
                                placeholder={t('Filtra per contatto')}
                                fullWidth
                            />
                        </TableCell>
                        <TableCell style={cellStyle} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredActivities.map((item, index) => {
                        const formattedDate = format(new Date(item.data), 'dd-MM-yyyy');
                        const formattedTime = format(new Date(item.data), 'HH:mm');

                        return (
                            <React.Fragment key={item.idAzioneKeyPeople || index}>
                                <TableRow>
                                    <TableCell style={cellStyle}>{formattedDate}</TableCell>
                                    <TableCell style={cellStyle}>{formattedTime}</TableCell>
                                    <TableCell style={cellStyle}>{item.siglaOwner}</TableCell>
                                    <TableCell style={cellStyle}>{item.azione}</TableCell>
                                    {/* <TableCell style={cellStyle}></TableCell>    */}
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
                                                <strong>{t('Note')}:</strong> {item.note || t('Nessuna nota')}
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
