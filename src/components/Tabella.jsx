    import React, { useEffect, useState } from "react";
    import { Box, Typography } from "@mui/material";
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
    onRowClick,
    getRowClassName,
    }) => {
    const theme = useUserTheme();

    const [loading, setLoading] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);

    const rowHeight = 42;

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

    return (
        <Box
        sx={{
            backgroundColor: "white",
            borderRadius: "20px",
            height: "100%",
            display: "flex",
            mt: 2,
            border: "2px solid",
            borderColor: theme.palette.primary.main,
            flexDirection: "column",
            fontSize: "1.4em",
            overflow: "hidden",
        }}
        >
        {title && (
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography
                variant="h6"
                sx={{
                color: "black",
                fontWeight: "bold",
                fontFamily: "Roboto, sans-serif",
                lineHeight: 1.2,
                m: 0,
                }}
            >
                {title}
            </Typography>
            </Box>
        )}

        <DataGrid
                rows={data}
                columns={columns}
                paginationMode="server"
                pageSizeOptions={[10]}
                rowCount={righeTot}
                onRowClick={(params) => onRowClick && onRowClick(params)}
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
                rowHeight={rowHeight}
            slots={{
            noRowsOverlay: () =>
                showNoDataMessage ? (
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: "bold" }}>Nessun dato</Typography>
                </Box>
                ) : (
                <Box sx={{ p: 2 }}>
                    <CircularProgress sx={{ color: "#00B400" }} />
                </Box>
                ),
            }}
            getRowClassName={(params) => {
            const customClass = getRowClassName?.(params);
            if (customClass) return customClass;

            return params.indexRelativeToCurrentPage % 2 === 0
                ? "even-row"
                : "odd-row";
            }}
            sx={{
            border: "none",

            "& .MuiDataGrid-columnHeaders": {
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
                color: "#808080",
                fontWeight: "bolder",
                fontSize: "1em",
            },

            "& .even-row": { backgroundColor: "#ffffff" },
            "& .odd-row": { backgroundColor: "#ECECEC" },

            "& .MuiDataGrid-row:hover": {
                backgroundColor: "#eef6ff",
            },

            "& .MuiDataGrid-cell": {
                fontSize: "1em",
                display: "flex",
                alignItems: "center",
            },

            "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
            },

            "& .riga-evidenziata": {
                backgroundColor: "#0080801f",
            },

            "& .MuiDataGrid-row": {
                borderBottom: "1px solid #f0f0f0",
            },
            }}
        />
        </Box>
    );
    };

    export default Tabella;
