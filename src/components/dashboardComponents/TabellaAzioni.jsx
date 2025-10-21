import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, IconButton, CircularProgress, Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, parseISO, getISOWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { toggleButtonClasses } from "@mui/material/ToggleButton";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.2rem',
    border: 'none',
    backgroundColor: 'transparent',
    [`& .${toggleButtonClasses.root}`]: {
        borderRadius: '24px',
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.95rem',
        padding: '8px 20px',
        border: '1px solid #ddd',
        color: '#333',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: '#fefefeff',
            fontWeight: 550,
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
    },
}));

const TabellaAzioni = ({ data = [], aziendeOptions = [] }) => {
    const { t } = useTranslation();

    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({
        owner: "",
        azione: "",
        idCliente: "",
        contatto: "",
        completato: "",
        descrizione: ""
    });
    const [editableColumns, setEditableColumns] = useState({
        owner: false,
        azione: false,
        idCliente: false,
        contatto: false,
        completato: false,
        descrizione: false
    });
    const [loading, setLoading] = useState(true);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(1); // default week corrente

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
        if (data) {
            const rowsWithDetails = Array.isArray(data) ? data.map((item, index) => ({
                id: item.idAzioneKeyPeople || index,
                formattedDate: item.data,
                ruolo: item.ruolo,
                siglaOwner: item.siglaOwner,
                azione: item.azione,
                idCliente: item.idCliente,
                nomeContatto: item.nomeContatto,
                completato: item.completed || false,
                descrizione: item.descrizione || "Nessuna descrizione"
            })) : [];
            setRows(rowsWithDetails);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (editableColumns.owner && ownerRef.current) ownerRef.current.focus();
        if (editableColumns.azione && azioneRef.current) azioneRef.current.focus();
        if (editableColumns.idCliente && clienteRef.current) clienteRef.current.focus();
        if (editableColumns.contatto && contattoRef.current) contattoRef.current.focus();
        if (editableColumns.completato && completatoRef.current) completatoRef.current.focus();
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
        return (
            (userHasRole("ADMIN") ? (item.siglaOwner || "").toLowerCase().includes(filters.owner.toLowerCase()) : true) &&
            (item.azione || "").toLowerCase().includes(filters.azione.toLowerCase()) &&
            getAziendaLabel(item.idCliente).toLowerCase().includes(filters.idCliente.toLowerCase()) &&
            (item.nomeContatto || "").toLowerCase().includes(filters.contatto.toLowerCase()) &&
            (filters.completato === "" || String(item.completato) === filters.completato) &&
            (item.descrizione || "").toLowerCase().includes(filters.descrizione.toLowerCase())
        );
    });

    const weeksWithRows = weeks.map((week) => {
        const weekRows = filteredRows.filter(row =>
            isWithinInterval(parseISO(row.formattedDate), { start: week.start, end: week.end })
        );
        return {
            label: week.label,
            rows: weekRows
        };
    });

    const columns = [
        {
            field: "formattedDate",
            headerName: "Data",
            flex: 1,
                        sortable: true,
            valueGetter: (params) => params.value ? new Date(params.value) : null,
            renderCell: (params) => {
                return params.value instanceof Date ? format(params.value, "dd-MM-yyyy") : "";
            },
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
            flex: 2.2,
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
            field: "completato",
            headerName: "Stato",
            flex: 0.5,
            renderCell: (params) => params.value ? (
                <span style={{ fontSize: "1.5rem" }}>✔️</span>
            ) : (
                <span style={{ fontSize: "1.8rem", opacity: "0.6" }}>⏱</span>
            )
        }
    ];

    // Imposta settimana corrente come default
    useEffect(() => {
        const currentWeekIndex = weeks.findIndex(week =>
            isWithinInterval(today, { start: week.start, end: week.end })
        );
        if (currentWeekIndex >= 0) setSelectedWeekIndex(currentWeekIndex);
    }, []);

    return (
        <Container disableGutters maxWidth={false} sx={{ width: "100%" }}>
            {loading ? <CircularProgress /> : (
                <>
                    {/* Segmented Controller */}
                    <StyledToggleButtonGroup
                        value={selectedWeekIndex}
                        exclusive
                        onChange={(event, newIndex) => newIndex !== null && setSelectedWeekIndex(newIndex)}
                        sx={{
                            textTransform: 'none',
                            mt: 0,
                            mb: 0.2,
                            display: 'flex',
                            justifyContent: 'center',
                            border: "none",
                            borderRadius: '16px',
                            px: 3,
                            py: 1,
                        }}
                    >
                        {weeksWithRows.map((week, index) => (
                            <ToggleButton key={index} value={index}>
                                {week.label}
                            </ToggleButton>
                        ))}
                    </StyledToggleButtonGroup>

                    {/* DataGrid della settimana selezionata */}
                    <DataGrid
                        autoHeight
                        rows={weeksWithRows[selectedWeekIndex].rows}
                        columns={columns}
                        pageSizeOptions={[3]}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 3, page: 0 } },
                        }}
                        disableRowSelectionOnClick
                        disableSelectionOnClick
                        disableColumnMenu
                        hideFooterSelectedRowCount
                        sx={{
                            border: "none",
                            "& .MuiDataGrid-columnHeaders": {
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "#808080",
                                backgroundColor: "#FFFFFF",
                                borderBottom: "2px solid #ccc",
                                textAlign: "left",
                                lineHeight: "1.5rem"
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "0.9rem",
                                color: "#333",
                            },
                        }}
                        localeText={{ noRowsLabel: "Nessuna azione trovata." }}
                    />
                </>
            )}
        </Container>
    );
};

export default TabellaAzioni;