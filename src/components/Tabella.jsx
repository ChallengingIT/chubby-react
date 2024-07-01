import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import { useUserTheme } from "./TorchyThemeProvider";

const Tabella = ({
    data = [],
    columns,
    title,
    getRowId,
    pagina,
    quantita,
    onPageChange,
    righeTot,
}) => {

    const theme = useUserTheme();

    const [loading, setLoading] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [rowHeight, setRowHeight] = useState(52); // altezza predefinita
    const dataGridRef = useRef(null);

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
                const minRowHeight = 35; // altezza minima delle righe
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
                borderColor: theme.palette.primary.main,
                // borderColor: theme.palette.primary,
                flexDirection: "column",
                fontSize: "1.4em",
            }}
        >
            {title && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        color: "black",
                        mt: 2,
                        mb: 1,
                        ml: 3,
                        fontWeight: "bold",
                    }}
                >
                    {title}
                </Box>
            )}

            <DataGrid
                rows={data}
                columns={columns}
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

export default Tabella;
