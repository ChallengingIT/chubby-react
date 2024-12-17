import React, { useState } from "react";
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
    Link,
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CustomTableCell2 = ({ columns, rows, onIconClick, title }) => {
    const [filtersEnabled, setFiltersEnabled] = useState(false);
    const [filters, setFilters] = useState({});

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

    // Modifica il pulsante per abilitare/disabilitare i filtri
    const toggleFilters = () => {
        setFiltersEnabled((prev) => {
            if (prev) {
                resetFilters(); // Resetta i filtri quando vengono disabilitati
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

    return (
        <Box sx={{borderRadius: '20px', }}>
            {/* Tabella */}
            <TableContainer component={Paper} sx={{ maxHeight: 370, minHeight: 370, borderRadius: "20px", border: '2px solid #00B400', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", '&::-webkit-scrollbar': { display: 'none', }, scrollbarWidth: 'none', msOverflowStyle: 'none', }}>
                {/* Titolo */}
                {title && (
                    <Box sx={{ display: 'flex', bgcolor: '#FFFFF', width: '100%', height: '100%', justifyContent: 'flex-start', justifyItems: 'center'}}>
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
                                <TableCell key={index} align="left" sx={{ fontWeight: "bold", backgroundColor: "#FFFFF", color: "#808080", borderBottom: "2px solid #ccc", fontSize: '14px', textAlign: 'left', padding: "6px 14px", }}>
                                    {filtersEnabled ? (
                                        <TextField variant="standard" size="small" placeholder={`Filtra ${column.headerName}`} value={filters[column.field] || ""} onChange={(e) => handleFilterChange(column.field, e.target.value)} fullWidth />
                                    ) : (
                                        column.headerName
                                    )}
                                </TableCell>
                            ))}
                            {/* Colonna per le icone */}
                            <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#FFFFF", color: "#808080", borderBottom: "2px solid #ccc", fontSize: '14px', padding: "6px 14px", }}>
                                <Button variant="contained" size="small" onClick={toggleFilters} sx={{ bgcolor: '#00b400', p: '4px 18px', color: 'white', fontWeight: 'bold', borderRadius: '20px'}}>
                                    {filtersEnabled ? "Filtri" : "Filtri"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Body */}
                    <TableBody>
                        {filteredRows.map((row, rowIndex) => (
                            <TableRow key={rowIndex} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9", }, "&:nth-of-type(even)": { backgroundColor: "#fff", }, "&:hover": { backgroundColor: "#f1f1f1", }, height: "36px", }}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} align={column.align || "left"} sx={{ borderBottom: "1px solid #e0e0e0", color: "black", fontSize: "14px", padding: "6px 14px", }}>
                                        {column.render ? column.render(row) : row[column.field]}
                                    </TableCell>
                                ))}
                                {/* Colonna delle icone */}
                                <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0", padding: "0.5px 0.5px", }}>
                                    <IconButton onClick={() => onIconClick(row)}>
                                        <MoreHorizIcon />
                                    </IconButton>
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
        </Box>
    );
};

export default CustomTableCell2;
