import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography, Paper, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";

const TabellaAttivita = ({ data = [], aziendeOptions = [] }) => {
    const { t } = useTranslation();
    const [activities, setActivities] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    // Stato per i filtri
    const [filters, setFilters] = useState({
        owner: '',
        azione: '',
        cliente: '',
        contatto: '',
        completato: ''
    });

    // Stato per il controllo delle colonne cliccate
    const [editableColumns, setEditableColumns] = useState({
        owner: false,
        azione: false,
        cliente: false,
        contatto: false,
        completato: false
    });

    // useRef per gestire il focus automatico
    const ownerInputRef = useRef(null);
    const azioneInputRef = useRef(null);
    const clienteInputRef = useRef(null);
    const contattoInputRef = useRef(null);
    const completatoInputRef = useRef(null);

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const isAdmin = userHasRole("ADMIN");

    useEffect(() => {
        if (data) {
            // Trasforma in array se non lo è già
            const arrayData = Array.isArray(data) ? data : [data];

            const initializedData = arrayData.map(item => ({
                ...item,
                completed: item.completed || false
            }));

            setActivities(initializedData);
        } else {
            setActivities([]);
        }
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
        if (editableColumns.completato && completatoInputRef.current) {
            completatoInputRef.current.focus();
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
            (item.siglaOwner || "").toLowerCase().includes(filters.owner.toLowerCase()) &&
            (item.azione || "").toLowerCase().includes(filters.azione.toLowerCase()) &&
            getAziendaLabel(item.idCliente).toLowerCase().includes(filters.cliente.toLowerCase()) &&
            (item.nomeContatto || "").toLowerCase().includes(filters.contatto.toLowerCase()) &&
            (item.completato !== undefined && item.completato !== null
                ? item.completato.toString().toLowerCase()
                : ""
            ).includes(filters.completato.toLowerCase())
        );
    });

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="collapsible table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'white', borderBottom: '2px solid #ccc' }}>
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
                            {t('Data')}
                        </TableCell>

                        {/* Colonna Owner */}
                        {/*{isAdmin ? ( */}
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
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
                        {/* ) : null} */}

                        {/* Colonna Tipologia */}
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
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
                                <span onClick={() => handleColumnClick('azione')} style={{ cursor: 'pointer' }}>{t('Tipologia')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Cliente */}
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
                            {editableColumns.cliente ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.cliente}
                                        onChange={(e) => handleFilterChange('cliente', e.target.value)}
                                        placeholder={t('Filtra per cliente')}
                                        fullWidth
                                        inputRef={clienteInputRef}
                                    />
                                    <IconButton onClick={() => handleColumnClose('cliente')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('cliente')} style={{ cursor: 'pointer' }}>{t('Azienda Cliente')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Contatto */}
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
                            {editableColumns.contatto ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.contatto}
                                        onChange={(e) => handleFilterChange('contatto', e.target.value)}
                                        placeholder={t('Filtra per contatto')}
                                        fullWidth
                                        inputRef={contattoInputRef}
                                    />
                                    <IconButton onClick={() => handleColumnClose('contatto')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span onClick={() => handleColumnClick('contatto')} style={{ cursor: 'pointer' }}>{t('Contatto Azienda')}</span>
                            )}
                        </TableCell>

                        {/* Colonna Completamento */}
                        <TableCell sx={{ color: '#808080', fontWeight: 'bold', padding: '6px 14px', borderBottom: '2px solid #ccc' }}>
                            {editableColumns.completato ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        variant="standard"
                                        value={filters.completato}
                                        onChange={(e) => handleFilterChange('completato', e.target.value)}
                                        placeholder={t('Filtra per completamento')}
                                        fullWidth
                                        inputRef={completatoInputRef}
                                    />
                                    <IconButton onClick={() => handleColumnClose('completato')}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <span
                                    onClick={() => handleColumnClick('completato')}
                                    style={{ cursor: 'pointer' }}>{t('Completato')}
                                </span>
                            )}
                        </TableCell>

                        <TableCell sx={{ padding: '6px 14px', borderBottom: '2px solid #ccc' }} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredActivities.map((item, index) => {
                        const formattedDate = format(new Date(item.data), 'dd-MM-yyyy');
                        // const formattedTime = format(new Date(item.data), 'HH:mm');

                        return (
                            <React.Fragment key={item.idAzioneKeyPeople || index}>
                                <TableRow>
                                    <TableCell style={cellStyle}>{formattedDate}</TableCell>
                                    {/* <TableCell style={cellStyle}>{formattedTime}</TableCell> */}
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

export default TabellaAttivita;
