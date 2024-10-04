import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import TagIcon from '@mui/icons-material/Tag';
import PlaceIcon from '@mui/icons-material/Place';
import CloseIcon from '@mui/icons-material/Close';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CallMadeIcon from '@mui/icons-material/CallMade';
import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    Slide,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { useUserTheme } from '../TorchyThemeProvider';
import DialogNeed from '../componentiCliente/DialogNeed';
import { motion }                     from "framer-motion"; 


const ListaNeedCardV2 = ({ valori, statoOptions, onDelete, onRefresh, isFirstCard }) => {

    const navigate = useNavigate();
    const theme = useUserTheme();
    const [idNeed, setIdNeed] = useState(null);
    const [alert, setAlert] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);


     //animazione fade delle card
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 }, // L'elemento parte invisibile e spostato
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Fade-in con durata
    };


    // funzione per la chiusura dell'alert
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    // funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const handleOpenDialog = (id, event) => {
        event.stopPropagation();
        setDialogOpen(true);
        setIdNeed(id);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        border: 'solid 2px',
        borderColor: theme.palette.border.main,
        transition: 'transform 0.3s ease, border-width 0.3s ease',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.02)',
        }
    };

    const cardStyle = {
        width: '100%',
        minHeight: '18em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    };

    const mediaPriorita = (priorita) => {
        if (priorita >= 0 && priorita <= 1) {
            return { icon: <CallMadeIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />, text: "1" };
        } else if (priorita > 1 && priorita <= 2) {
            return { icon: <TrendingUpIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />, text: "2" };
        } else if (priorita > 2 && priorita <= 3) {
            return { icon: <TrendingFlatIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />, text: "3" };
        } else if (priorita > 3) {
            return { icon: <TrendingDownIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />, text: "4" };
        } else {
            return { icon: null, text: "" };
        }
    };

    const { icon, text } = mediaPriorita(valori.priorita);

    return (
        <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
    >
        <Card
            raised
            sx={cardContainerStyle}
            onClick={(event) => handleOpenDialog(valori.id, event)}
        >
            <div style={cardStyle}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'column', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 1 }}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    width: '100%',
                                    ml: 1
                                }}
                            >
                                {valori.descrizione}
                            </Typography>

                            <Typography variant="body2" color="text.primary" sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                                <TagIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                {valori.progressivo}
                            </Typography>

                            <Typography variant="body2" color="text.primary" sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                                <PlaceIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                {valori.location}
                            </Typography>

                            <Typography variant="body2" color="text.primary" sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                                {icon}
                                Priorità: {text}
                            </Typography>

                            <Typography variant="body2" color="text.primary" sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                                <BusinessCenterIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                {valori.tipologia && valori.tipologia.descrizione
                                    ? valori.tipologia.descrizione
                                    : "N/A"}
                            </Typography>

                            <Typography variant="body2" color="text.primary" sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                                <AutoModeIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                {valori.stato && valori.stato.descrizione
                                    ? valori.stato.descrizione
                                    : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </div>

            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                sx={{ '& .MuiDialog-paper': { minWidth: '90vw', minHeight: '80vh', borderRadius: '20px' } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Dettagli Need</DialogTitle>
                    <IconButton
                        sx={{
                            mr: 2,
                            backgroundColor: 'transparent',
                            border: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent'
                            }
                        }}
                        onClick={handleCloseDialog}
                    >
                        <CloseIcon
                            sx={{
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    color: 'red',
                                    backgroundColor: 'transparent',
                                }
                            }}
                        />
                    </IconButton>
                </Box>
                <DialogContent>
                    <DialogNeed
                    idNeed={idNeed}
                    />
                </DialogContent>
            </Dialog>
        </Card>
        </motion.div>
    );
};

export default ListaNeedCardV2;
