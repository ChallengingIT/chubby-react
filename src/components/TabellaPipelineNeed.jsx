import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";

const TabellaPipelineNeed = ({ columns, getRowId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10); // PageSize non è più necessario, ma lo teniamo per eventuali usi futuri
    const [rowCount, setRowCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (page) => {
        setLoading(true);
        try {
            // Simulate an API call
            const newRows = Array.from({ length: pageSize }, (_, index) => ({
                id: page * pageSize + index + 1,
                owner: `Owner ${page * pageSize + index + 1}`,
                cliente: `Cliente ${page * pageSize + index + 1}`,
                descrizione: `Descrizione ${page * pageSize + index + 1}`,
                priorita: `Priorità ${page * pageSize + index + 1}`,
                stato: `Stato ${page * pageSize + index + 1}`,
                azione: `Azione ${page * pageSize + index + 1}`,
            }));
            setData((prevRows) => [...prevRows, ...newRows]);
            setRowCount((prevCount) => prevCount + newRows.length);
            setHasMore(newRows.length === pageSize); // Stop if fewer than pageSize rows are returned
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                getRowId={getRowId}
                paginationMode="server"
                rowCount={rowCount}
                autoHeight={false}
                loading={loading}
                onRowsScrollEnd={() => {
                    if (hasMore) {
                        setPage((prevPage) => prevPage + 1);
                    }
                }}
                components={{
                    NoRowsOverlay: () => (
                        <h1>Nessun dato</h1>
                    ),
                    LoadingOverlay: CircularProgress,
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                }
                pagination={false}
                hideFooter
                sx={{
                    borderStyle: 'none',
                    height: '100%', // Ensure the DataGrid takes full height
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
                }}
            />
        </Box>
    );
};

export default TabellaPipelineNeed;
