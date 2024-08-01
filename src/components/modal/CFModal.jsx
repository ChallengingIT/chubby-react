    import React, { useState } from 'react';
    import {
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Box,
    IconButton,
    Typography
    } from '@mui/material';
    import CloseIcon from "@mui/icons-material/Close";
    import { useTranslation } from "react-i18next"; 
    import InnotekLogo from '../../images/innotek.svg';
    import ChallengingLogo from '../../images/challengingLogoPiccolo.svg';

    const CFModal = ({ open, handleClose, idCandidato, handleDownloadCF, nomeCandidato, cognomeCandidato }) => {
    const { t } = useTranslation(); 


    const handleSubmit = (tipo) => {
        handleDownloadCF(idCandidato, nomeCandidato, cognomeCandidato, tipo);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px',  display: 'flex', minWidth: '60vw', height: 'auto' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <DialogTitle variant='h5' sx={{ fontWeight: 'bold'}}>{t(`Creazione CF di ${nomeCandidato} ${cognomeCandidato} `) }</DialogTitle>
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
            <Typography variant='body1' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>Vuoi creare il CF per Innotek o per Challenging?</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <IconButton onClick={() => handleSubmit(1)}
                sx={{ 
                bgcolor: '#191919', 
                color: 'white', 
                fontWeight: 'bold', 
                minWidth: '10em',
                borderRadius: '10px',
                '&:hover': {
                    bgcolor: '#191919',
                    transform: 'scale(1.02)'
                }
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={InnotekLogo} alt="Innotek" style={{ width: '4em', height: '54px' }} />
                </Box>
            </IconButton>
            <IconButton onClick={() => handleSubmit(2)}
                sx={{ 
                bgcolor: '#EDEDED', 
                color: 'white', 
                fontWeight: 'bold', 
                minWidth: '10em',
                borderRadius: '10px',
                '&:hover': {
                    bgcolor: '#EDEDED',
                    transform: 'scale(1.02)'
                }
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={ChallengingLogo} alt="Challenging" style={{ width: '4em', height: '54px' }} />
                </Box>
            </IconButton>
            </Box>
        </DialogActions>
        </Dialog>
    );
    };

    export default CFModal;
