import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography, Paper, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
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

    // Stato per il controllo delle colonne cliccate
    const [editableColumns, setEditableColumns] = useState({
        owner: false,
        azione: false,
        cliente: false,
        contatto: false
    });

    // useRef per gestire il focus automatico
    const ownerInputRef = useRef(null);
    const azioneInputRef = useRef(null);
    const clienteInputRef = useRef(null);
    const contattoInputRef = useRef(null);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]);

    // Funzione per gestire il focus automatico
    useEffect(() => {
        if (editableColumns.owner && ownerInputRef.current) {
            ownerInputRef.current.focus();
        }
        if (editableColumns.azione && azioneInputRef.current) {
            azioneInputRef.current.focus();
        }
        if (editableColumns.cliente && clienteInputRef.current) {
            clienteInputRef.current.focus();
        }
        if (editableColumns.contatto && contattoInputRef.current) {
            contattoInputRef.current.focus();
        }
    }, [editableColumns]);

    const handleToggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
    };

    const handleColumnClick = (field) => {
        setEditableColumns(prevState => ({
            ...prevState,
            [field]: true // Attiva la modalità input per la colonna cliccata
        }));
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: '' 
        }));
    };

    const handleColumnClose = (field) => {
        setEditableColumns(prevState => ({
            ...prevState,
            [field]: false // Disattiva la modalità input per la colonna
        }));
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
                                        inputRef={ownerInputRef}  // Aggiunto useRef per focus
                                    />
                                    <IconButton onClick={() => handleColumnClose('owner')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('owner')} style={{ cursor: 'pointer' }}>{t('Owner')}</span>
                            )}
                        </TableCell>

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
                                        inputRef={azioneInputRef}  // Aggiunto useRef per focus
                                    />
                                    <IconButton onClick={() => handleColumnClose('azione')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('azione')} style={{ cursor: 'pointer' }}>{t('Azione')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Cliente */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>
                            {editableColumns.cliente ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.cliente}
                                        onChange={(e) => handleFilterChange('cliente', e.target.value)}
                                        placeholder={t('Filtra per cliente')}
                                        fullWidth
                                        inputRef={clienteInputRef}  // Aggiunto useRef per focus
                                    />
                                    <IconButton onClick={() => handleColumnClose('cliente')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('cliente')} style={{ cursor: 'pointer' }}>{t('Cliente')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Contatto */}
                        <TableCell style={cellStyle} sx={{ color: '#808080', fontWeight: 'bold' }}>
                            {editableColumns.contatto ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.contatto}
                                        onChange={(e) => handleFilterChange('contatto', e.target.value)}
                                        placeholder={t('Filtra per contatto')}
                                        fullWidth
                                        inputRef={contattoInputRef}  // Aggiunto useRef per focus
                                    />
                                    <IconButton onClick={() => handleColumnClose('contatto')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('contatto')} style={{ cursor: 'pointer' }}>{t('Contatto')}</span>
                            )}
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
