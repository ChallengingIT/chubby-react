import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

const IntervisteModal = ({ open, handleClose, intervista, candidato }) => {

    const skillsDescriptions = candidato?.skills?.map(skill => skill.descrizione).join(', ') || '';

    // Funzione per fare il mapping dei valori di teamSiNo
    const getTeamSiNoLabel = (value) => {
        switch (value) {
            case 1:
                return "SI";
            case 2:
                return "NO";
            case 3:
                return "KO";
            default:
                return "";
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px', display: 'flex', minWidth: '60vw', minHeight: '60vh', height: 'auto' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <DialogTitle variant='h5' sx={{ fontWeight: 'bold' }}>{"Dettagli Intervista"}</DialogTitle>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Informazioni di Base */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>Informazioni di Base</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Nome:</strong> {intervista?.candidato?.nome || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Cognome:</strong> {intervista?.candidato?.cognome || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Data Colloquio:</strong> {intervista?.dataColloquio || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Intervistatore:</strong> {intervista?.nextOwner?.nome || ''} {intervista?.nextOwner?.cognome || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Data di Nascita:</strong> {candidato?.dataNascita || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Cellulare:</strong> {candidato?.cellulare || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Job Title:</strong> {candidato?.tipologia?.descrizione || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Skills:</strong> {skillsDescriptions}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Competenze */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>Competenze</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Coerenza Percorso:</strong> {intervista?.coerenza || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Standing:</strong> {intervista?.standing || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Energia:</strong> {intervista?.energia || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Comunicazione:</strong> {intervista?.comunicazione || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Livello di Inglese:</strong> {intervista?.inglese || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Competenze vs Ruolo:</strong> {intervista?.competenze || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Valutazione:</strong> {intervista?.valutazione || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>One Word:</strong> {intervista?.descrizioneCandidatoUna || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Team SI NO:</strong> {getTeamSiNoLabel(intervista?.teamSiNo)}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Informazioni Contrattuali */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>Informazioni Contrattuali</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Disponibilità:</strong> {intervista?.disponibilita || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>RAL Attuale:</strong> {intervista?.attuale || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>RAL Desiderata:</strong> {intervista?.desiderata || ''}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1"><strong>Proposta Economica:</strong> {intervista?.proposta || ''}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Note */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>Note</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant='body1'>{candidato?.note}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1 }}>
            </DialogActions>
        </Dialog>
    );
};

export default IntervisteModal;
