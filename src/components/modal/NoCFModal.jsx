    import React from 'react';
    import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography
    } from '@mui/material';
    import CloseIcon from "@mui/icons-material/Close";
    import { useTranslation } from "react-i18next"; 


    const NoCFModal = ({ open, handleClose, idCandidato, handleDownloadCF, nomeCandidato, cognomeCandidato }) => {

    const descrizione = null;
    const { t } = useTranslation(); 


    const handleSubmit = () => {
        handleDownloadCF(idCandidato, descrizione, nomeCandidato, cognomeCandidato);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px',  display: 'flex', minWidth: '40vw', minHeight: '20vh', height: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <DialogTitle variant='h5' sx={{ fontWeight: 'bold'}}>{t(`Attenzione `) }</DialogTitle>
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
            <Typography variant="body1">{t(`Non è presente il CV di ${nomeCandidato} ${cognomeCandidato}, non si può procedere con la creazione del CF.`)}</Typography>
            </Box>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button onClick={handleClose}
            sx={{ 
                bgcolor: 'black', 
                color: 'white', 
                fontWeight: 'bold', 
                minWidth: '10em',
                borderRadius: '10px',
                '&:hover': {
                bgcolor: 'black',
                transform: 'scale(1.02)'
                }
            }}>
            {t('No')}
            </Button>
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
            {t('Si')}
            </Button>        
        </DialogActions>
        </Dialog>
    );
    };

    export default NoCFModal;
