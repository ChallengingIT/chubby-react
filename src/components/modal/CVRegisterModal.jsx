    import React, { useState } from 'react';
    import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography,
    Input
    } from '@mui/material';
    import CloseIcon from "@mui/icons-material/Close";
    import { useTranslation } from "react-i18next"; 

    const CVRegisterModal = ({ open, handleClose, handleFileUpload }) => {
    const { t } = useTranslation(); 
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = () => {
        if (selectedFile) {
        handleFileUpload(selectedFile); // Passa il file al componente genitore
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px', display: 'flex', minWidth: '60vw', height: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <DialogTitle variant='h5' sx={{ fontWeight: 'bold' }}>Inserisci il tuo CV</DialogTitle>
            <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
                mt: 1,
                backgroundColor: "transparent",
                border: "none",
                color: "#898989",
                "&:hover": {
                border: "none",
                color: "red",
                transform: "scale(1.1)",
                },
            }}
            startIcon={<CloseIcon sx={{ backgroundColor: "transparent" }} />}
            />
        </Box>
        <DialogActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
            <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            sx={{ display: 'none' }}
            id="cv-upload"
            />
            <label htmlFor="cv-upload">
            <Button
                variant="outlined"
                component="span"
                sx={{
                mt: 2,
                color: "#00B401",
                borderColor: "#00B401",
                "&:hover": {
                    backgroundColor: "#00B401",
                    color: "white",
                },
                }}
            >
                Carica CV
            </Button>
            </label>
            {selectedFile && (
            <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedFile.name}
            </Typography>
            )}
            <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
                mt: 2,
                backgroundColor: "#00B401",
                color: "white",
                "&:hover": {
                backgroundColor: "#007B01",
                color: "white",
                },
            }}
            >
            Invia
            </Button>
        </DialogActions>
        </Dialog>
    );
    };

    export default CVRegisterModal;
