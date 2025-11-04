import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TableContainer, Paper, TextField, IconButton, ToggleButton, ToggleButtonGroup, TableCell, TableRow, TableHead, Table, TableBody, Tooltip, TablePagination, Button } from '@mui/material';
import axios from 'axios';
import { useUserTheme } from '../TorchyThemeProvider.jsx';
import { useTranslation } from "react-i18next";
import { format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, parseISO, getISOWeek } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useSmartRowsPerPage from '../useSmartRowsPerPage.jsx';
import { styled } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonClasses.root}`]: {
        color: "#333",
        border: "1px solid #ccc",
        borderRadius: "20px",
        textTransform: "none",
        padding: "4px 12px",
        margin: "0 4px",
        "&.Mui-selected": {
            backgroundColor: "#029191ff",
            color: "#fff",
            borderColor: "#029191ff",
            "&:hover": { backgroundColor: "#008080ff" }
        },
        "&:hover": { backgroundColor: "#f1f1f1" }
    }
}));


const BoxAttivitaWeek = ({ aziendeOptions, expanded, setExpanded, pipelineExpanded, pageSize, initialState, onClickButton }) => {

    const { t } = useTranslation();

    const [filtersEnabled, setFiltersEnabled] = useState(true);
    const [modalStato, setModalStato] = useState(false);
    const [selectedPipeline, setSelectedPipeline] = useState(null);
    const [values, setValues] = useState({ stato: null, priorita: null });
    const [orderBy, setOrderBy] = useState('formattedDate');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [weekDataKeyPeople, setWeekDataKeyPeople] = useState([]);
    const quantita = 10;
    const contRef = useRef(null);
    const headRef = useRef(null);
    const theadRef = useRef(null);
    const footRef = useRef(null);
    const rowRef = useRef(null);

    const rowsPerPageSmart = useSmartRowsPerPage({
        containerRef: contRef,
        headerRef: headRef,
        theadRef,
        footerRef: footRef,
        rowProbeRef: rowRef,
        fallbackRowHeight: 48
    });

    const [page, setPage] = useState(0);
    useEffect(() => setPage(0), [rowsPerPageSmart, expanded, pipelineExpanded, initialState]);



    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({
        formattedDate: "",
        siglaOwner: "",
        azione: "",
        descrizione: "",
        idCliente: "",
        nomeContatto: "",
        completata: ""
    });
    const [editableColumns, setEditableColumns] = useState({
        owner: false,
        azione: false,
        idCliente: false,
        contatto: false,
        completata: false,
        descrizione: false
    });
    const [loading, setLoading] = useState(true);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(1);

    const ownerRef = useRef(null);
    const azioneRef = useRef(null);
    const clienteRef = useRef(null);
    const contattoRef = useRef(null);
    const completatoRef = useRef(null);
    const descrizioneRef = useRef(null);

    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weeks = [
        { label: `Week ${getISOWeek(addWeeks(currentWeekStart, -1))}`, start: addWeeks(currentWeekStart, -1), end: endOfWeek(addWeeks(currentWeekStart, -1), { weekStartsOn: 1 }) },
        { label: `Week ${getISOWeek(currentWeekStart)}`, start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) },
        { label: `Week ${getISOWeek(addWeeks(currentWeekStart, 1))}`, start: addWeeks(currentWeekStart, 1), end: endOfWeek(addWeeks(currentWeekStart, 1), { weekStartsOn: 1 }) }
    ];

    useEffect(() => {
        if (weekDataKeyPeople) {
            const rowsWithDetails = Array.isArray(weekDataKeyPeople)
                ? weekDataKeyPeople.map((item, index) => ({
                    id: item.idAzioneKeyPeople ?? index,
                    dateISO: item.data || null,
                    formattedDate: item.data ? format(parseISO(item.data), "dd-MM-yyyy") : "",
                    ruolo: item.ruolo,
                    siglaOwner: item.siglaOwner,
                    azione: item.azione,
                    idCliente: item.idCliente,
                    nomeContatto: item.nomeContatto,
                    completata: item.completata ?? false,
                    descrizione: item.descrizione ?? "Nessuna descrizione"
                }))
                : [];
            setRows(rowsWithDetails);
            setLoading(false);
        }
    }, [weekDataKeyPeople]);


    useEffect(() => {
        if (editableColumns.owner && ownerRef.current) ownerRef.current.focus();
        if (editableColumns.azione && azioneRef.current) azioneRef.current.focus();
        if (editableColumns.idCliente && clienteRef.current) clienteRef.current.focus();
        if (editableColumns.contatto && contattoRef.current) contattoRef.current.focus();
        if (editableColumns.completata && completatoRef.current) completatoRef.current.focus();
        if (editableColumns.descrizione && descrizioneRef.current) descrizioneRef.current.focus();
    }, [editableColumns]);

    const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
    const handleColumnClick = (field) => setEditableColumns(prev => ({ ...prev, [field]: true }));
    const handleColumnClose = (field) => setEditableColumns(prev => ({ ...prev, [field]: false }));

    const getAziendaLabel = (idCliente) => {
        const azienda = aziendeOptions.find(opt => opt.value === idCliente);
        return azienda ? azienda.label : "Azienda Sconosciuta";
    };

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) return false;
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const filteredRows = rows.filter(item => {
        const matchDate =
            (filters.formattedDate === "") ||
            ((item.formattedDate || "").toLowerCase().includes(filters.formattedDate.toLowerCase()));

        const matchOwner =
            !userHasRole("ADMIN") ||
            ((item.siglaOwner || "").toLowerCase().includes((filters.siglaOwner || "").toLowerCase()));

        const matchAzione =
            (item.azione || "").toLowerCase().includes((filters.azione || "").toLowerCase());

        const matchCliente =
            getAziendaLabel(item.idCliente).toLowerCase().includes((filters.idCliente || "").toLowerCase());

        const matchContatto =
            (item.nomeContatto || "").toLowerCase().includes((filters.nomeContatto || "").toLowerCase());

        const normalizeBool = (v) => {
            if (v == null || v === "") return null;
            const s = String(v).trim().toLowerCase();
            if (["true", "1", "si", "sì", "yes", "y"].includes(s)) return true;
            if (["false", "0", "no", "n"].includes(s)) return false;
            return null;
        };
        const filterCompletata = normalizeBool(filters.completata);
        const matchCompletata =
            filterCompletata === null ? true : item.completata === filterCompletata;

        const matchDescrizione =
            (item.descrizione || "").toLowerCase().includes((filters.descrizione || "").toLowerCase());

        return (
            matchDate &&
            matchOwner &&
            matchAzione &&
            matchCliente &&
            matchContatto &&
            matchCompletata &&
            matchDescrizione
        );
    });


    const weeksWithRows = weeks.map((week) => {
        const weekRows = filteredRows.filter(row =>
            row.dateISO
                ? isWithinInterval(parseISO(row.dateISO), { start: week.start, end: week.end })
                : false
        );
        return { label: week.label, rows: weekRows };
    });


    const handleSort = (col) => {
        if (orderBy === col) {
            setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(col);
            setOrderDirection('asc');
        }
    };

    const columns = [
        {
            field: "formattedDate",
            headerName: "Data",
            flex: 1,
            sortable: true,
            renderCell: ({ row }) => row.formattedDate || "",
            renderHeader: () => <span style={{ fontWeight: "normal" }}>Data</span>
        },
        ...(userHasRole("ADMIN") ? [{
            field: "siglaOwner",
            headerName: "Owner",
            flex: 0.75,
            renderHeader: () =>
                editableColumns.owner ? (
                    <div style={{ display: "flex" }}>
                        <TextField value={filters.owner} onChange={(e) => handleFilterChange("owner", e.target.value)} inputRef={ownerRef} />
                        <IconButton onClick={() => handleColumnClose("owner")}><CloseIcon /></IconButton>
                    </div>
                ) : (
                    <span style={{ fontWeight: "normal" }} onClick={() => handleColumnClick("owner")}>Owner</span>
                ),
            renderCell: (params) => params.value
        }] : []),
        {
            field: "azione",
            headerName: "Tipologia",
            flex: 1,
            sorting: true,
            renderHeader: () =>
                editableColumns.azione ? (
                    <div style={{ display: "flex" }}>
                        <TextField value={filters.azione} onChange={(e) => handleFilterChange("azione", e.target.value)} inputRef={azioneRef} />
                        <IconButton onClick={() => handleColumnClose("azione")}><CloseIcon /></IconButton>
                    </div>
                ) : (
                    <span style={{ fontWeight: "normal" }} onClick={() => handleColumnClick("azione")}>Tipologia</span>
                ),
            renderCell: (params) => params.value
        },
        {
            field: "descrizione",
            headerName: "Descrizione",
            flex: 1.8,
            valueGetter: (params) => params.row.descrizione || "Nessuna descrizione"
        },
        {
            field: "idCliente",
            headerName: "Azienda Cliente",
            flex: 1,
            renderCell: (params) => getAziendaLabel(params.row.idCliente)
        },
        {
            field: "nomeContatto",
            headerName: "Contatto Azienda",
            flex: 1.4,
            renderCell: (params) => params.row.nomeContatto
        },
        {
            field: "completata",
            headerName: "Stato",
            flex: 0.5,
            renderCell: ({ value }) =>
                value ? (
                    <CheckCircleIcon
                        sx={{ color: "#00B400", fontSize: "1.5rem" }}
                    />
                ) : (
                    <AccessAlarmIcon
                        sx={{ color: "#507050ff", opacity: 0.7, fontSize: "1.7rem" }}
                    />
                ),
        }
    ];

    useEffect(() => {
        const currentWeekIndex = weeks.findIndex(week =>
            isWithinInterval(today, { start: week.start, end: week.end })
        );
        if (currentWeekIndex >= 0) setSelectedWeekIndex(currentWeekIndex);
    }, []);

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: expanded ? pageSize : 3,
        page: 0,
    });

    useEffect(() => {
        setPaginationModel((prev) => ({
            ...prev,
            pageSize: expanded ? pageSize : 3,
            page: 0,
        }));
    }, [expanded]);

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
                    ? `http://89.46.196.60:8443/dashboard/attivita/business`
                    : `http://89.46.196.60:8443/dashboard/attivita/business/personal`;

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

    const getWeekRangeFromInterval = (interval) => {
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + (interval * 7));
        const weekStart = getWeekStart(baseDate);
        const weekEnd = getWeekEnd(baseDate);
        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    };

    const sortExtractors = {
        formattedDate: (row) => row.dateISO ? parseISO(row.dateISO).getTime() : 0,
        siglaOwner: (row) => (row.siglaOwner || "").toLowerCase(),
        azione: (row) => (row.azione || "").toLowerCase(),
        descrizione: (row) => (row.descrizione || "").toLowerCase(),
        idCliente: (row) => getAziendaLabel(row.idCliente).toLowerCase(),
        nomeContatto: (row) => (row.nomeContatto || "").toLowerCase(),
        completata: (row) => row.completata ? 1 : 0,
    };


    const sortedRows = [...filteredRows].sort((a, b) => {
        // Se non è impostato un ordine, ordina per data discendente (più recenti prima)
        if (!orderBy) {
            const dateA = a.dateISO ? parseISO(a.dateISO) : new Date(0);
            const dateB = b.dateISO ? parseISO(b.dateISO) : new Date(0);
            return dateB - dateA;
        }

        // Se c'è un ordine scelto dall’utente, lo applica normalmente
        const aValue = sortExtractors[orderBy]?.(a) ?? 0;
        const bValue = sortExtractors[orderBy]?.(b) ?? 0;

        if (aValue < bValue) return orderDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDirection === "asc" ? 1 : -1;
        return 0;
    });

    const getCellContent = (column, row) => {
        const raw = row[column.field];
        const value = column.valueGetter ? column.valueGetter({ value: raw, row }) : raw;
        return column.renderCell ? column.renderCell({ value, row }) : value;
    };


    return (
        <Box sx={{ borderRadius: '20px', width: '100%' }}>
            <TableContainer
                component={Paper}
                ref={contRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    border: '2px solid #029191ff',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    transition: 'height 0.3s ease-in-out',
                    willChange: 'height'
                }}
            >
                <Box
                    ref={headRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        bgcolor: '#FFFFFF',
                        px: 2,
                        pt: 1,
                        pb: 0.5
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                            Piano Incontri
                        </Typography>
                        <StyledToggleButtonGroup
                            value={selectedWeekIndex}
                            exclusive
                            onChange={(event, newIndex) => newIndex !== null && setSelectedWeekIndex(newIndex)}
                            sx={{
                                textTransform: 'none',
                                display: 'flex',
                                justifyContent: 'center',
                                border: 'none',
                                borderRadius: '16px',
                                px: 1,
                                py: 0.5
                            }}
                        >
                            {weeksWithRows.map((week, index) => (
                                <ToggleButton key={index} value={index}>
                                    {week.label}
                                </ToggleButton>
                            ))}
                        </StyledToggleButtonGroup>
                        <Button
                            onClick={() => {
                                setExpanded();
                                onClickButton?.();
                            }}
                            sx={{
                                bgcolor: '#029191ff',
                                color: 'white',
                                border: 'thin solid #ccc',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                '&:hover': {
                                    bgcolor: '#006868ff'
                                }
                            }}
                        >
                            {expanded ? 'Comprimi ▲' : 'Estendi ▼'}
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <Table stickyHeader size="small">
                        <TableHead ref={theadRef}>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align || 'left'}
                                        sx={{
                                            fontWeight: 'bold',
                                            backgroundColor: '#FFFFFF',
                                            color: '#808080',
                                            borderBottom: '2px solid #ccc',
                                            fontSize: '14px',
                                            textAlign: column.align || 'left',
                                            padding: '6px 14px'
                                        }}
                                    >
                                        {filtersEnabled && (
                                            <Box display="flex" alignItems="center" gap={0}>
                                                <TextField
                                                    variant="standard"
                                                    size="small"
                                                    placeholder={column.headerName}
                                                    value={filters[column.field] || ''}
                                                    onChange={(e) => handleFilterChange(column.field, e.target.value)}
                                                    fullWidth
                                                    inputProps={{ style: { textAlign: column.align || 'left' } }}
                                                />
                                                <IconButton onClick={() => handleSort(column.field)} size="small">
                                                    {orderBy === column.field ? (
                                                        orderDirection === 'asc' ? (
                                                            <ArrowDropUpIcon fontSize="small" />
                                                        ) : (
                                                            <ArrowDropDownIcon fontSize="small" />
                                                        )
                                                    ) : (
                                                        <ArrowDropDownIcon fontSize="small" sx={{ color: 'gray' }} />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRows
                                .filter(row => {
                                    const week = weeks[selectedWeekIndex];
                                    return row.dateISO ? isWithinInterval(parseISO(row.dateISO), { start: week.start, end: week.end }) : false;
                                })
                                .slice(page * rowsPerPageSmart, page * rowsPerPageSmart + rowsPerPageSmart)
                                .map((row, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                            '&:nth-of-type(even)': { backgroundColor: '#fff' },
                                            '&:hover': { backgroundColor: '#f1f1f1' },
                                            height: 48
                                        }}
                                    >
                                        {columns.map((column, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                align={column.align || 'center'}
                                                sx={{
                                                    borderBottom: '1px solid #e0e0e0',
                                                    color: 'black',
                                                    fontSize: '14px',
                                                    padding: '6px 14px'
                                                }}
                                            >
                                                {getCellContent(column, row)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}

                            {weeksWithRows[selectedWeekIndex].rows.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        align="center"
                                        sx={{
                                            color: '#808080',
                                            fontSize: '0.9rem',
                                            padding: 2
                                        }}
                                    >
                                        Nessuna azione trovata.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Table
                        size="small"
                        sx={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
                    >
                        <TableBody>
                            <TableRow
                                ref={rowRef}
                                sx={{
                                    height: 48,
                                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                                    '&:nth-of-type(even)': { backgroundColor: '#fff' },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        borderBottom: '1px solid #e0e0e0',
                                        color: 'black',
                                        fontSize: '14px',
                                        padding: '6px 14px',
                                    }}
                                >
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>

                <Box ref={footRef}>
                    <TablePagination
                        component="div"
                        count={weeksWithRows[selectedWeekIndex].rows.length}
                        rowsPerPage={rowsPerPageSmart}
                        rowsPerPageOptions={[rowsPerPageSmart]}
                        page={page}
                        onPageChange={handleChangePage}
                        sx={{
                            '& .MuiTablePagination-selectLabel': { display: 'none' },
                            '& .MuiTablePagination-select': { display: 'none' },
                            '& .MuiTablePagination-displayedRows': { marginLeft: 0 },
                            '& .MuiInputBase-root': { display: 'none' }
                        }}
                    />
                </Box>
            </TableContainer>
        </Box>
    );

};

export default BoxAttivitaWeek;
