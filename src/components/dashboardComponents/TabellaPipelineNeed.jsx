import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Dialog, DialogTitle, DialogContent, IconButton, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle'; //icona per spostare le righe


const TabellaPipelineNeed = ({ data, columns, getRowId }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ currentPipelineData, setCurrentPipelineData ] = useState({});


    const dialogData = [
        { header: "ITW", data: [{ title: "Pianificata", value: currentPipelineData.itwPianificate }, { title: "Fatte", value: currentPipelineData.itwFatte }] },
        { header: "CF", data: [{ title: "Disponibili", value: currentPipelineData.cfDisponibili }, { title: "Inviati", value: currentPipelineData.cfInviati }] },
        { header: "QM", data: [{ title: "Pianif.", value: currentPipelineData.qmPianificate }, { title: "Fatte", value: currentPipelineData.qmFatte }] },
        { header: "F/U", data: [{ title: "OK", value: currentPipelineData.followUpPositivi }, { title: "Pool", value: currentPipelineData.followUpPool }] }
    ];

    const handleOpenDialog = (pipelineData) => {
        setDialogOpen(true);
        setCurrentPipelineData(pipelineData)
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const renderActionCell = (params) => {
        return (
            <IconButton onClick={() => handleOpenDialog(params.row.pipeline)}>
                <MoreVertIcon />
            </IconButton>
        );
    };


    const modifiedColumns = [
        {
        field: 'drag',
        headerName: '',
        width: 50,
        sortable: false,
        disableColumnMenu: true,
        renderCell: () => <DragHandleIcon />,
    },
        ...columns,
        {
            field: 'actions',
            headerName: 'Azioni',
            renderCell: renderActionCell,
            width: 100
        }
    ];




    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={data}
                columns={modifiedColumns}
                getRowId={getRowId}
                components={{
                    NoRowsOverlay: () => <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '10%', fontWeight: 300}}>Nessun dato</h3>,
                    LoadingOverlay: CircularProgress,
                }}
                hideFooter
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
                    '&. MuiDataGrid-row:nth-of-type(even)': {
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
                            border: '2.5px solid #00B400'
                        }
                    }}>
                <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2em'}}>
                    Dettagli Azioni
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
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
                                            <div>{column.data[index].value}</div>
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
