import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import { useUserTheme } from "../TorchyThemeProvider";

const DataGridClienti = ({
    data = [],
    columns,
    getRowId,
    pagina,
    quantita,
    onPageChange,
    righeTot,
    onFilterChange
}) => {
    const theme = useUserTheme();

    const [loading, setLoading] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [rowHeight, setRowHeight] = useState(52); // altezza predefinita
    const dataGridRef = useRef(null);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (data.length === 0) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
                setShowNoDataMessage(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setLoading(false);
            setShowNoDataMessage(false);
        }
    }, [data]);

    useEffect(() => {
        const calculateRowHeight = () => {
            if (dataGridRef.current) {
                const availableHeight = dataGridRef.current.clientHeight;
                const minRowHeight = 35;
                const calculatedRowHeight = Math.max(minRowHeight);
                setRowHeight(calculatedRowHeight);
            }
        };

        calculateRowHeight();
        window.addEventListener('resize', calculateRowHeight);

        return () => {
            window.removeEventListener('resize', calculateRowHeight);
        };
    }, [data.length]);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    // Funzione per filtrare i dati in base ai filtri locali
    const getFilteredData = () => {
        return data.filter(row => {
            return Object.keys(filters).every(key => {
                return row[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase());
            });
        });
    };

    const filteredData = getFilteredData();

    const renderHeaderWithFilter = (params) => {
        if (params.colDef.field === 'azioni') {
            return null;
        }
        return (
            <Box>
                <div>{params.colDef.headerName}</div>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder={`Filtra ${params.colDef.field}`}
                    onChange={(e) => handleFilterChange(params.colDef.field, e.target.value)}
                    sx={{
                        mt: 1,
                        borderRadius: '20px',
                        bgcolor: '#EDEDED',
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "transparent",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                        },
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: 'transparent',
                        },
                    }}
                />
            </Box>
        );
    };

    const columnsWithFilter = columns.map((col) => ({
        ...col,
        renderHeader: (params) => renderHeaderWithFilter(params),
    }));

    return (
        <Box
            ref={dataGridRef}
            sx={{
                backgroundColor: "white",
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)",
                borderRadius: "20px",
                height: "100%",
                display: "flex",
                mt: 2,
                border: "2px solid",
                borderColor: theme.palette.primary,
                flexDirection: "column",
                fontSize: "1.4em",
            }}
        >
            <DataGrid
                rows={filteredData}
                columns={columnsWithFilter}
                paginationMode="server"
                pageSizeOptions={[10]}
                rowCount={righeTot}
                autoHeight
                paginationModel={{ page: pagina, pageSize: quantita }}
                onPaginationModelChange={({ page }) => {
                    onPageChange(page);
                }}
                loading={data.length === 0 && loading}
                noRowsOverlay={
                    showNoDataMessage ? (
                        <h1>Nessun dato</h1>
                    ) : (
                        <CircularProgress sx={{ color: "#00B400" }} />
                    )
                }
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
                }
                rowHeight={rowHeight}
                sx={{
                    borderStyle: "none",
                    "& .MuiDataGrid-columnHeader": {
                        borderBottom: "2px solid #c4c4c4",
                    },
                    "& .even-row": {
                        backgroundColor: "#ffffff",
                    },
                    "& .odd-row": {
                        backgroundColor: "#ECECEC",
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: "#ececec",
                    },
                    "& .MuiDataGrid-row": {
                        border: "hidden",
                        width: "100%",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "2px solid #dbd9d9",
                        width: "100%",
                    },
                    "& .MuiDataGrid-cell": {
                        fontSize: "1em",
                        fontFamily: "Roboto",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#808080",
                        fontWeight: "bolder",
                        fontSize: "1em",
                    },
                }}
            />
        </Box>
    );
};

export default DataGridClienti;
