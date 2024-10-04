import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next"; 

const TabellaAttivitaRecruiting = ({ data = [] }) => {
    const { t } = useTranslation(); 

    const [activities, setActivities] = useState([]);

    // Stato per i filtri
    const [filters, setFilters] = useState({
        azione: '',
        owner: '',
        candidato: ''
    });

    // Stato per il controllo delle colonne cliccate
    const [editableColumns, setEditableColumns] = useState({
        azione: false,
        owner: false,
        candidato: false
    });

    const azioneInputRef = useRef(null);
    const ownerInputRef = useRef(null);
    const candidatoInputRef = useRef(null);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    useEffect(() => {
        if (editableColumns.azione && azioneInputRef.current) {
            azioneInputRef.current.focus();
        }
        if (editableColumns.owner && ownerInputRef.current) {
            ownerInputRef.current.focus();
        }
        if (editableColumns.candidato && candidatoInputRef.current) {
            candidatoInputRef.current.focus();
        }
    }, [editableColumns]);

    const handleFilterChange = (field, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
    };

    const handleColumnClick = (field) => {
        setEditableColumns(prevState => ({
            ...prevState,
            [field]: true // Attiva la modalità input per la colonna cliccata
        }));
    };

    const handleColumnClose = (field) => {
        setEditableColumns(prevState => ({
            ...prevState,
            [field]: false // Disattiva la modalità input per la colonna
        }));
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: '' 
        }));
    };

    const cellStyle = {
        padding: '8px 8px', 
    };

    const filteredActivities = activities.filter(item => {
        const fullName = `${item.nomeCandidato || ''} ${item.cognomeCandidato || ''}`.toLowerCase();

        return (
            (item.azione || '').toLowerCase().includes(filters.azione.toLowerCase()) &&
            (item.siglaOwner || '').toLowerCase().includes(filters.owner.toLowerCase()) &&
            fullName.includes(filters.candidato.toLowerCase())
        );
    });

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Data')}</TableCell>
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>{t('Ora')}</TableCell>

                        {/* Colonna Azione */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>
                            {editableColumns.azione ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.azione}
                                        onChange={(e) => handleFilterChange('azione', e.target.value)}
                                        placeholder={t('Filtra per azione')}
                                        fullWidth
                                        inputRef={azioneInputRef} 
                                    />
                                    <IconButton onClick={() => handleColumnClose('azione')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('azione')} style={{ cursor: 'pointer' }}>{t('Azione')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Owner */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>
                            {editableColumns.owner ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.owner}
                                        onChange={(e) => handleFilterChange('owner', e.target.value)}
                                        placeholder={t('Filtra per owner')}
                                        fullWidth
                                        inputRef={ownerInputRef}
                                    />
                                    <IconButton onClick={() => handleColumnClose('owner')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('owner')} style={{ cursor: 'pointer' }}>{t('Owner')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Candidato */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>
                            {editableColumns.candidato ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.candidato}
                                        onChange={(e) => handleFilterChange('candidato', e.target.value)}
                                        placeholder={t('Filtra per candidato')}
                                        fullWidth
                                        inputRef={candidatoInputRef} 
                                    />
                                    <IconButton onClick={() => handleColumnClose('candidato')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('candidato')} style={{ cursor: 'pointer' }}>{t('Candidato')}</span>
                            )}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredActivities.map((item, index) => {
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
