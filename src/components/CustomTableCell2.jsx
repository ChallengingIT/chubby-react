import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    Tooltip,
    Modal,
    FormControl,
    Autocomplete,
    Snackbar,
    Alert,
    Slide
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CustomTableCell2 = ({ columns, rows, onRefresh, title }) => {
    const [filtersEnabled, setFiltersEnabled] = useState(true);
    const [filters, setFilters] = useState({});
    const [modalStato, setModalStato] = useState(false);
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [values, setValues] = useState({ stato: null, priorita: null });
    const [alert, setAlert] = useState(false);
    const [statoOptions, setStatoOptions] = useState([]);
    const [orderBy, setOrderBy] = useState('');
    const [orderDirection, setOrderDirection] = useState('asc');


    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };


    const fetchStati = async () => {
        try {
            const responseStato = await axios.get("http://89.46.196.60:8443/need/react/stato", { headers });

            if (Array.isArray(responseStato.data)) {
                const filteredStati = responseStato.data
                    .filter(stato => [1, 6, 7].includes(stato.id))
                    .map(stato => ({ label: stato.descrizione, value: stato.id }));

                setStatoOptions(filteredStati);
            } else {
                console.error("I dati ottenuti dalla chiamata degli stati non sono nel formato Array: ", responseStato.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero degli stati: ", error);
        }
    };





    useEffect(() => {
        fetchStati();
    }, [])

    // Funzione per resettare i filtri
    const resetFilters = () => {
        setFilters({});
    };

    // Funzione per gestire il cambiamento dei filtri
    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const toggleFilters = () => {
        setFiltersEnabled((prev) => {
            if (prev) {
                resetFilters();
            }
            return !prev;
        });
    };


    const filteredRows = rows.filter((row) => {
        return columns.every((column) => {
            const cellValue = column.field.includes('.')
                ? column.field.split('.').reduce((obj, key) => obj?.[key], row)
                : row[column.field];
            const normalizedCellValue = column.field === 'cliente'
                ? (cellValue?.denominazione || '').toLowerCase()
                : String(cellValue || '').toLowerCase();

            const normalizedFilterValue = filters[column.field]
                ? filters[column.field].toLowerCase()
                : "";

            return !normalizedFilterValue || normalizedCellValue.includes(normalizedFilterValue);
        });
    });

    const handleSort = (col) => {
        if (orderBy === col) {
            setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(col);
            setOrderDirection('asc');
        }
    };

    const sortExtractors = {
        aziendaInterna: row => row.aziendaInterna?.toLowerCase() || "",
        cliente: row => row.cliente?.denominazione?.toLowerCase() || "",
        tipologia: row => row.tipologia?.toLowerCase() || "",
        ownerBusiness: row => row.ownerBusiness?.toLowerCase() || "",
        ownerRecruiter: row => row.ownerRecruiter?.toLowerCase() || "",
        descrizione: row => row.descrizione?.toLowerCase() || "",
        priorita: row => parseInt(row.priorita) || 0,
        stato: row => row.stato?.toLowerCase?.() || String(row.stato || ""),
    };

    const sortedRows = [...filteredRows].sort((a, b) => {
        if (!orderBy || !sortExtractors[orderBy]) return 0;

        const aValue = sortExtractors[orderBy](a);
        const bValue = sortExtractors[orderBy](b);

        if (aValue < bValue) return orderDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDirection === "asc" ? 1 : -1;
        return 0;
    });

    const handleOpenModal = (row) => {
        setSelectedPipeline(row);
        setValues({
            stato: row.stato || null,
            priorita: row.priorita || null
        });
        setModalStato(true);
    };


    const handleUpdateStato = async () => {
        if (!selectedPipeline) {
            console.error("Errore: Nessuna riga selezionata");
            return;
        }

        const idStato = values.stato;
        const priorita = values.priorita;
        const params = new URLSearchParams({ stato: idStato, priorita: priorita });
        const idNeed = selectedPipeline.id;

        // recupero lo user dal sessionStorage
    const userString = sessionStorage.getItem("user");
    if (!userString) {
        console.error("Nessun utente trovato in sessionStorage");
        return;
    }
    const userObj = JSON.parse(userString);

    // preparo il body da mandare
    const body = {
        stato: idStato,
    };

        try {
            const responseUpdateStato = await axios.post(
                `http://89.46.196.60:8443/need/react/salva/stato/${idNeed}?${params.toString()}`,
                {}, 
                { headers: headers }
            );

            if (responseUpdateStato.data === "ERRORE") {
                setAlert({ open: true, message: "Errore durante il salvataggio dell'azienda!" });
                console.error("L'azienda non è stata salvata.");
                return;
            }

            console.log("Update successo!");
            setModalStato(false);
            onRefresh();
        } catch (error) {
            console.error("Errore durante l'aggiornamento dello stato: ", error);
        }
    };


    const prioritaOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' }
    ];

    //funzione per la chiusura dell'alert
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    return (
        <Box sx={{ borderRadius: '20px', }}>
            {/* Tabella */}
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: filteredRows.length > 10 ? 370 : 'auto',
                    overflowY: filteredRows.length > 10 ? 'auto' : 'visible',
                    borderRadius: "20px",
                    border: filteredRows.length > 0 ? '2px solid #00B400' : '1px dashed #ccc',
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >

                {/* Titolo */}
                {title && (
                    <Box sx={{ display: 'flex', bgcolor: '#FFFFF', width: '100%', height: '100%', justifyContent: 'flex-start', justifyItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ textAlign: "left", fontWeight: "bold", color: "#333", ml: 2, mt: 1 }}>
                            {title}
                        </Typography>
                    </Box>
                )}
                <Table stickyHeader>
                    {/* Header */}
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell
                                    key={index}
                                    align={column.align || "left"}
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: "#FFFFF",
                                        color: "#808080",
                                        borderBottom: "2px solid #ccc",
                                        fontSize: '14px',
                                        textAlign: column.align || "left",
                                        padding: "6px 14px",
                                    }}
                                >
                                    {filtersEnabled && (
                                        <Box display="flex" alignItems="center" gap={0}>
                                            <TextField
                                                variant="standard"
                                                size="small"
                                                placeholder={column.headerName}
                                                value={filters[column.field] || ""}
                                                onChange={(e) => handleFilterChange(column.field, e.target.value)}
                                                fullWidth
                                                inputProps={{ style: { textAlign: column.align || "left" } }}
                                            />
                                            <IconButton onClick={() => handleSort(column.field)} size="small">
                                                {orderBy === column.field ? (
                                                    orderDirection === "asc" ? (
                                                        <ArrowDropUpIcon fontSize="small" />
                                                    ) : (
                                                        <ArrowDropDownIcon fontSize="small" />
                                                    )
                                                ) : (
                                                    <ArrowDropDownIcon fontSize="small" sx={{ color: "gray" }} />
                                                )}
                                            </IconButton>
                                        </Box>
                                    )}
                                </TableCell>
                            ))}
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#FFFFF",
                                    color: "#808080",
                                    borderBottom: "2px solid #ccc",
                                    fontSize: '14px',
                                    padding: "6px 14px",
                                }}
                            >
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Body */}
                    <TableBody>
                        {sortedRows.map((row, rowIndex) => (
                            <TableRow key={rowIndex} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9", }, "&:nth-of-type(even)": { backgroundColor: "#fff", }, "&:hover": { backgroundColor: "#f1f1f1", }, height: "36px", }}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} align={column.align || "center"} sx={{ borderBottom: "1px solid #e0e0e0", color: "black", fontSize: "14px", padding: "6px 14px", }}>
                                        {column.render ? column.render(row) : row[column.field]}
                                    </TableCell>
                                ))}
                                {/* Colonna delle icone */}
                                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0", padding: "0.5px 0.5px", }}>
                                    <Tooltip title="Modifica">
                                        <IconButton onClick={(event) => handleOpenModal(row)}>
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Tooltip>

                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    Nessun risultato trovato.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={modalStato}
                onClose={() => setModalStato(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'white',
                        p: 4,
                        borderRadius: '20px',
                        display: 'flex',
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        width: '40vw',
                        height: 'auto',
                    }}
                >
                    {/* Header con Titolo e Pulsante di chiusura */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Typography sx={{ fontWeight: '600', fontSize: '1.5em', textAlign: 'center', ml: 2, mt: 0.5, mb: 0.5 }}>
                            {selectedPipeline?.descrizione || "Dettagli Pipeline"}
                        </Typography>
                        <IconButton
                            sx={{
                                mr: 2,
                                backgroundColor: 'transparent',
                                border: 'none',
                                '&:hover': {
                                    bgcolor: 'transparent'
                                }
                            }}
                            onClick={() => setModalStato(false)}
                        >
                            <CloseIcon
                                sx={{
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        color: 'red',
                                        backgroundColor: 'transparent',
                                    }
                                }}
                            />
                        </IconButton>
                    </Box>

                    {/* Selezione Stato */}
                    <FormControl fullWidth>
                        <Autocomplete
                            id="stato-combo-box"
                            options={statoOptions}
                            getOptionLabel={(option) => option.label}
                            value={statoOptions.find(option => option.value === values.stato) || null}
                            onChange={(event, newValue) => {
                                setValues(prevValues => ({
                                    ...prevValues,
                                    stato: newValue ? newValue.value : null
                                }));
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Stato"
                                    variant="filled"
                                    sx={{
                                        height: '4em',
                                        p: 1,
                                        borderRadius: '20px',
                                        backgroundColor: '#EDEDED',
                                        '& .MuiFilledInput-root': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiFilledInput-underline:after': {
                                            borderBottomColor: 'transparent',
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: '#00B400',
                                        },
                                    }}
                                />
                            }
                        />
                    </FormControl>

                    {/* Selezione Priorità */}
                    <FormControl fullWidth>
                        <Autocomplete
                            id="priorita-combo-box"
                            options={prioritaOptions}
                            getOptionLabel={(option) => option.label}
                            value={prioritaOptions.find(option => option.value === values.priorita) || null}
                            onChange={(event, newValue) => {
                                setValues(prevValues => ({
                                    ...prevValues,
                                    priorita: newValue ? newValue.value : null
                                }));
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Priorità"
                                    variant="filled"
                                    sx={{
                                        height: '4em',
                                        p: 1,
                                        borderRadius: '20px',
                                        backgroundColor: '#EDEDED',
                                        '& .MuiFilledInput-root': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiFilledInput-underline:after': {
                                            borderBottomColor: 'transparent',
                                        },
                                        '& .MuiFormLabel-root.Mui-focused': {
                                            color: '#00B400',
                                        },
                                    }}
                                />
                            }
                        />
                    </FormControl>

                    {/* Pulsante Cambia */}
                    <Button
                        onClick={handleUpdateStato}
                        sx={{
                            mt: 2,
                            width: '60%',
                            backgroundColor: '#00B400',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#019301',
                                transform: 'scale(1.02)',
                            },
                        }}
                    >
                        Cambia
                    </Button>
                </Box>
            </Modal>



            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>




        </Box>
    );
};

export default CustomTableCell2;
