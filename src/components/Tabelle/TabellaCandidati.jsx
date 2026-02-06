    import React, { useEffect, useState, useRef } from "react";
    import { Box, Typography } from "@mui/material";
    import CircularProgress from "@mui/material/CircularProgress";
    import { DataGrid } from "@mui/x-data-grid";
    import { useUserTheme } from "../TorchyThemeProvider";

    const TabellaCandidati = ({
    data = [],
    columns = [],
    title,
    pagina,
    quantita,
    getRowId,
    onRowClick,
    onPageChange,
    righeTot,
    getRowClassName,
    headerRight,
    }) => {
    const theme = useUserTheme();

    const [loading, setLoading] = useState(false);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [rowHeight] = useState(42);
    const dataGridRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0) {
        setLoading(true);
        setShowNoDataMessage(false);

        const timer = setTimeout(() => {
            setLoading(false);
            setShowNoDataMessage(true);
        }, 500);

        return () => clearTimeout(timer);
        }

        setLoading(false);
        setShowNoDataMessage(false);
    }, [data]);

    return (
        <Box
        ref={dataGridRef}
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
        {(title || headerRight) && (
            <Box
            sx={{
                px: 2,
                pt: 2,
                pb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
            }}
            >
            {title && (
                <Typography
                variant="h6"
                sx={{
                    color: "black",
                    fontWeight: "bold",
                    fontFamily: "Roboto, sans-serif",
                    m: 0,
                    lineHeight: 1.2,
                }}
                >
                {title}
                </Typography>
            )}

            {headerRight && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                {headerRight}
                </Box>
            )}
            </Box>
        )}

        <DataGrid
            rows={data}
            columns={columns}
            getRowId={getRowId}
            paginationMode="server"
            pageSizeOptions={[10]}
            rowCount={righeTot}
            paginationModel={{ page: pagina, pageSize: quantita }}
            onPaginationModelChange={(model) => {
                onPageChange?.(model.page, model.pageSize);
            }}
            onRowClick={(params) => onRowClick?.(params)}
            loading={loading}
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
            rowHeight={rowHeight}
            sx={{
            borderStyle: "none",
            "& .MuiDataGrid-columnHeader": {
                borderBottom: "2px solid #c4c4c4",
            },
            "& .even-row": { backgroundColor: "#ffffff" },
            "& .odd-row": { backgroundColor: "#eaeaea" },
            "& .MuiDataGrid-row:hover": {
                backgroundColor: "#eef6ff",
            },
            "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid #dbd9d9",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
                color: "#808080",
                fontWeight: "bolder",
            },
            }}
        />
        </Box>
    );
    };

    export default TabellaCandidati;
