    import React, { useEffect, useState } from "react";
    import CloudUploadIcon                from "@mui/icons-material/CloudUpload";
    import { Box, Typography, Button }    from "@mui/material";

    function CustomImgFieldModifica({ label, onChange, initialValues }) {
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        if (initialValues.logo && initialValues.logo.startsWith("/9j")) {
        const base64Url = `data:image/jpeg;base64,${initialValues.logo}`;
        setImagePreview(base64Url);
        }
    }, [initialValues.logo]);

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        onChange(file);
        setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box sx={{ width: "25em", mr: 10 }}>
        <Box
            sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            m: 10,
            }}
        >
            <Typography variant="subtitle1" gutterBottom>
            {label}
            </Typography>
        </Box>
        <Box
            sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            m: 10,
            }}
        >
            {imagePreview ? (
            <img
                src={imagePreview}
                alt="Immagine Caricata"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            ) : (
            <Typography variant="body2">Nessun file selezionato</Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, mr: 0.5 }}>
            <Button
                variant="contained"
                sx={{
                backgroundColor: "black",
                marginLeft: "10px",
                marginBottom: "10px",
                marginTop: "10px",
                justifyContent: "flex-end",
                color: "white",
                ":hover": {
                    backgroundColor: "black",
                    transform: "scale(1.1)",
                },
                }}
                startIcon={<CloudUploadIcon />}
                component="label"
            >
                <input type="file" hidden onChange={handleChange} />
            </Button>
            </Box>
        </Box>
        </Box>
    );
    }

    export default CustomImgFieldModifica;
