import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, IconButton, CircularProgress, Container } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";
import { startOfWeek, endOfWeek, addWeeks, isWithinInterval, parseISO } from "date-fns";


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

    // useRef per gestire il focus automatico
    const ownerRef = useRef(null);
    const azioneRef = useRef(null);
    const clienteRef = useRef(null);
    const contattoRef = useRef(null);
    const completatoRef = useRef(null);
    const descrizioneRef = useRef(null);

    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // lunedì
    const weeks = [
        { label: "Settimana precedente", start: addWeeks(currentWeekStart, -1), end: endOfWeek(addWeeks(currentWeekStart, -1), { weekStartsOn: 1 }) },
        { label: "Settimana corrente", start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) },
        { label: "Settimana successiva", start: addWeeks(currentWeekStart, 1), end: endOfWeek(addWeeks(currentWeekStart, 1), { weekStartsOn: 1 }) }
    ];

    useEffect(() => {
        if (data) {
            console.log(data)
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

    const filteredRows = rows.filter(item => {
        return (
            (item.siglaOwner || "").toLowerCase().includes(filters.owner.toLowerCase()) &&
            (item.azione || "").toLowerCase().includes(filters.azione.toLowerCase()) &&
            getAziendaLabel(item.idCliente).toLowerCase().includes(filters.idCliente.toLowerCase()) &&
            (item.nomeContatto || "").toLowerCase().includes(filters.contatto.toLowerCase()) &&
            (filters.completato === "" || String(item.completato) === filters.completato) &&
            (item.descrizione || "").toLowerCase().includes(filters.descrizione.toLowerCase())
        );
    });

    const groupedRows = weeks.map(week => ({
        label: week.label,
        rows: filteredRows.filter(row => {
            const date = parseISO(row.formattedDate);
            return isWithinInterval(date, { start: week.start, end: week.end });
        })
    }));

    const columns = [
        {
  field: "formattedDate",
  headerName: "Data",
  flex: 1,
  valueGetter: (params) => {
    const date = params.value ? new Date(params.value) : null;
    return date instanceof Date && !isNaN(date) ? format(date, "dd-MM-yyyy") : "";
  }
},
        {
            field: "siglaOwner",
            headerName: "Owner",
            flex: 1,
            renderHeader: () =>
                editableColumns.owner ? (
                    <div style={{ display: "flex" }}>
                        <TextField
                            value={filters.owner}
                            onChange={(e) => handleFilterChange("owner", e.target.value)}
                            inputRef={ownerRef}
                        />
                        <IconButton onClick={() => handleColumnClose("owner")}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ) : (
                    <span onClick={() => handleColumnClick("owner")}>Owner</span>
                ),
        },
        {
            field: "azione",
            headerName: "Tipologia",
            flex: 1,
            renderHeader: () =>
                editableColumns.azione ? (
                    <div style={{ display: "flex" }}>
                        <TextField
                            value={filters.azione}
                            onChange={(e) => handleFilterChange("azione", e.target.value)}
                            inputRef={azioneRef}
                        />
                        <IconButton onClick={() => handleColumnClose("azione")}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ) : (
                    <span onClick={() => handleColumnClick("azione")}>Tipologia</span>
                ),
        },
        {
            field: "idCliente",
            headerName: "Azienda Cliente",
            flex: 1,
            renderHeader: () =>
                editableColumns.cliente ? (
                    <div style={{ display: "flex" }}>
                        <TextField
                            value={filters.cliente}
                            onChange={(e) => handleFilterChange("cliente", e.target.value)}
                            inputRef={clienteRef}
                        />
                        <IconButton onClick={() => handleColumnClose("cliente")}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ) : (
                    <span onClick={() => handleColumnClick("cliente")}>Azienda Cliente</span>
                ),
            valueGetter: (params) => getAziendaLabel(params.row.idCliente),
        },
        {
            field: "nomeContatto",
            headerName: "Contatto Azienda",
            flex: 1.4,
            renderHeader: () =>
                editableColumns.contatto ? (
                    <div style={{ display: "flex" }}>
                        <TextField
                            value={filters.contatto}
                            onChange={(e) => handleFilterChange("contatto", e.target.value)}
                            inputRef={contattoRef}
                        />
                        <IconButton onClick={() => handleColumnClose("contatto")}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                ) : (
                    <span onClick={() => handleColumnClick("contatto")}>Contatto Azienda</span>
                ),
        },
        { field: "descrizione", headerName: "Descrizione", flex: 2, valueGetter: (params) => params.row.descrizione || "Nessuna descrizione" },
        { field: "completato", headerName: "Completato", flex: 0.7, renderCell: (params) => params.value ? "✔️" : "╳" }
    ];

    return (
        <Container disableGutters maxWidth={false} sx={{ width: "100%" }}>
            {loading ? <CircularProgress /> :
                <div >
                    <DataGrid
                        autoHeight
                        rows={filteredRows}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 4, page: 0 } },
                        }}
                        pageSizeOptions={[4, 8, 12]}
                        disableSelectionOnClick
                        disableColumnMenu
                        sx={{ border: "none" }}
                        localeText={{
                            noRowsLabel: "Nessuna azione trovata.",
                        }}
                    />
                </div>

            }
        </Container>
    );
};

export default TabellaAzioni;