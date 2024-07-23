    import React, { useState, useEffect } from 'react';
    import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    } from '@mui/material';
    import CloseIcon from "@mui/icons-material/Close";

    const CFModal = ({ open, handleClose, idCandidato, descrizione, handleDownloadCF, nomeCandidato, cognomeCandidato }) => {
    const [values, setValues] = useState({ descrizione: '' });

    useEffect(() => {
        if (descrizione) {
        setValues({ descrizione });
        }
    }, [descrizione]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({
        ...prevValues,
        [name]: value
        }));
    };

    const handleSubmit = () => {
        handleDownloadCF(idCandidato, values.descrizione, nomeCandidato, cognomeCandidato);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px',  display: 'flex', minWidth: '60vw', minHeight: '60vh', height: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <DialogTitle variant='h5' sx={{ fontWeight: 'bold'}}>{`Descrizione CF di ${nomeCandidato} ${cognomeCandidato} ` }</DialogTitle>
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
        <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TextField
                name='descrizione'
                label='Descrizione'
                variant="filled"
                fullWidth
                inputProps={{
                maxLength: 4000,
                }}
                multiline
                rows={15}
                value={values.descrizione}
                onChange={handleChange}
                sx={{
                width: "100%",
                textAlign: "left",
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
                "& .MuiFilledInput-root": {
                    backgroundColor: "transparent",
                },
                "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "transparent",
                },
                "& .MuiFilledInput-root::before": {
                    borderBottom: "none",
                },
                "&:hover .MuiFilledInput-root::before": {
                    borderBottom: "none",
                },
                }}
            />
            </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button onClick={handleSubmit}
            sx={{ 
                bgcolor: '#00B400', 
                color: 'white', 
                fontWeight: 'bold', 
                minWidth: '10em',
                borderRadius: '10px',
                '&:hover': {
                bgcolor: '#00B400',
                transform: 'scale(1.02)'
                }
            }}>
            Invia
            </Button>
        </DialogActions>
        </Dialog>
    );
    };

    export default CFModal;
