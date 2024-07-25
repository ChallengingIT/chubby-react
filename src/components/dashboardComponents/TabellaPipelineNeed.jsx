import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Dialog, DialogTitle, DialogContent, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { useUserTheme } from "../TorchyThemeProvider";

const TabellaPipelineNeed = ({ data, columns, getRowId }) => {
    const theme = useUserTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentPipelineData, setCurrentPipelineData] = useState({});
    const [rowHeight, setRowHeight] = useState(40); // altezza predefinita
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const dataGridRef = useRef(null);

    const dialogData = [
        { header: "ITW", data: [{ title: "Pianificata", value: currentPipelineData.itwPianificate }, { title: "Fatte", value: currentPipelineData.itwFatte }] },
        { header: "CF", data: [{ title: "Disponibili", value: currentPipelineData.cfDisponibili }, { title: "Inviati", value: currentPipelineData.cfInviati }] },
        { header: "QM", data: [{ title: "OK", value: currentPipelineData.qmPianificate }, { title: "KO", value: currentPipelineData.qmFatte }] },
        { header: "Follow Up", data: [{ title: "OK", value: currentPipelineData.followUpPositivi }, { title: "Pool", value: currentPipelineData.followUpPool }] }
    ];

    const handleOpenDialog = (pipelineData) => {
        setDialogOpen(true);
        setCurrentPipelineData(pipelineData);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const renderActionCell = (params) => (
        <IconButton onClick={() => handleOpenDialog(params.row.pipelineData)}>
            <MoreVertIcon />
        </IconButton>
    );

    const modifiedColumns = [
        ...columns,
        {
            field: 'actions',
            headerName: 'Azioni',
            renderCell: renderActionCell,
            width: 100
        }
    ];

    const handleFilterChange = (filterModel) => {
        
        const filteredRows = data.filter((row) => {
            return filterModel.items.every((filter) => {
                if (!filter.value) {
                    return true;
                }
                const column = columns.find((col) => col.field === filter.columnField);
                if (!column) {
                    return true;
                }
                const value = row[filter.columnField];

                if (typeof value === 'object') {
                    if (filter.columnField === 'owner') {
                        return value.nome.toLowerCase().includes(filter.value.toLowerCase()) || 
                                value.cognome.toLowerCase().includes(filter.value.toLowerCase());
                    } else if (filter.columnField === 'cliente') {
                        return value.denominazione.toLowerCase().includes(filter.value.toLowerCase());
                    }
                }

                if (typeof value === 'string') {
                    return value.toLowerCase().includes(filter.value.toLowerCase());
                }
                return value === filter.value;
            });
        });

        setFilteredData(filteredRows);
    };

    useEffect(() => {
        const calculateRowHeight = () => {
            if (dataGridRef.current) {
                const availableHeight = dataGridRef.current.clientHeight;
                const calculatedRowHeight = Math.floor(availableHeight / data.length);
                setRowHeight(calculatedRowHeight);
            }
        };

        calculateRowHeight();
        window.addEventListener('resize', calculateRowHeight);

        return () => {
            window.removeEventListener('resize', calculateRowHeight);
        };
    }, [dataGridRef, data.length]);

    return (
        <Box ref={dataGridRef} sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={filteredData}
                columns={modifiedColumns}
                getRowId={getRowId}
                filterMode="client"
                onFilterModelChange={handleFilterChange}
                components={{
                    NoRowsOverlay: () => <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '10%', fontWeight: 300 }}>Nessun dato</h3>,
                    LoadingOverlay: CircularProgress,
                }}
                hideFooter
                rowHeight={rowHeight}
                sx={{
                    borderStyle: 'none',
                    height: '100%',
                    '& .MuiDataGrid-columnHeader': {
                        borderBottom: '2px solid #c4c4c4',
                    },
                    '& .even-row': {
                        backgroundColor: '#ffffff',
                    },
                    '& .odd-row': {
                        backgroundColor: '#ECECEC',
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#ececec',
                    },
                    '& .MuiDataGrid-row': {
                        border: 'hidden',
                        width: '100%',
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: '2px solid #dbd9d9',
                        width: '100%',
                    },
                    '& .MuiDataGrid-cell': {
                        fontSize: '1em',
                        fontFamily: 'Roboto',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: '#808080',
                        fontWeight: 'bolder',
                        fontSize: '1em',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        '&::-webkit-scrollbar': {
                            display: 'none', // per Chrome, Safari, e Opera
                        },
                        scrollbarWidth: 'none', // per Firefox
                        msOverflowStyle: 'none', // per Internet Explorer 10+
                    },
                }}
            />

            <Dialog open={dialogOpen} onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '50%',
                        maxWidth: 'none',
                        height: 'auto',
                        borderRadius: '20px',
                        border: '2.5px solid',
                        borderColor: theme.palette.border.main
                    }
                }}>
                <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2em' }}>
                    Dettagli Azioni
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                            '&:hover': {
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        <CloseIcon sx={{ '&:hover': { color: 'red' } }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {dialogData.map((column) => (
                                    <TableCell key={column.header} align="center" style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc7c7' }}>
                                        {column.header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dialogData[0].data.map((_, index) => (
                                <TableRow key={index} sx={{ borderBottom: '2px solid #ccc7c7' }}>
                                    {dialogData.map((column) => (
                                        <TableCell key={column.header} align="center">
                                            <div style={{ fontWeight: 500 }}>{column.data[index].title}</div>
                                            <Chip label={column.data[index].value} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TabellaPipelineNeed;
