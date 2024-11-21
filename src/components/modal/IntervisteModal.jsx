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
    Chip,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const IntervisteModal = ({ open, handleClose, intervista, candidato }) => {
    const { t } = useTranslation(); 

    const skillsDescriptions = candidato?.skills?.map(skill => skill.descrizione).join(', ') || '';

    // Funzione per fare il mapping dei valori di teamSiNo
    const getTeamSiNoLabel = (value) => {
        switch (value) {
            case 1:
                return t("SI");
            case 2:
                return t("NO");
            case 3:
                return t("KO");
            default:
                return "";
        }
    };

    // Funzione per rendere condizionalmente il Chip solo se il valore esiste
    const renderChip = (label, value) => {
        return (
            <Grid item xs={6}>
                <Typography variant="body1"><strong>{t(label)}:</strong></Typography>
                {value && <Chip label={value} />}
            </Grid>
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '20px', display: 'flex', minWidth: '60vw', minHeight: '60vh', height: 'auto' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <DialogTitle variant='h5' sx={{ fontWeight: 'bold' }}>{t("Dettagli Intervista")}</DialogTitle>
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
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>{t("Informazioni Di Base")}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderChip("Nome", intervista?.candidato?.nome)}
                                {renderChip("Cognome", intervista?.candidato?.cognome)}
                                {renderChip("Data Colloquio", intervista?.dataColloquio)}
                                {renderChip("Intervistatore", `${intervista?.nextOwner?.nome || ''} ${intervista?.nextOwner?.cognome || ''}`.trim())}
                                {renderChip("Data Di Nascita", candidato?.dataNascita)}
                                {renderChip("Cellulare", candidato?.cellulare)}
                                {renderChip("Job Title", candidato?.tipologia?.descrizione)}
                                {renderChip("Skills", skillsDescriptions)}
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Competenze */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>{t("Competenze")}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderChip("Coerenza Percorso", intervista?.coerenza)}
                                {renderChip("Standing", intervista?.standing)}
                                {renderChip("Energia", intervista?.energia)}
                                {renderChip("Comunicazione", intervista?.comunicazione)}
                                {renderChip("Livello Di Inglese", intervista?.inglese)}
                                {renderChip("Competenze vs Ruolo", intervista?.competenze)}
                                {renderChip("Valutazione", intervista?.valutazione)}
                                {renderChip("One Word", intervista?.descrizioneCandidatoUna)}
                                {renderChip("Team SI NO", getTeamSiNoLabel(intervista?.teamSiNo))}
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Informazioni Contrattuali */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>{t("Informazioni Contrattuali")}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {renderChip("Disponibilità", intervista?.disponibilita)}
                                {renderChip("RAL Attuale", intervista?.attuale)}
                                {renderChip("RAL Desiderata", intervista?.desiderata)}
                                {renderChip("Proposta Economica", intervista?.proposta)}
                            </Grid>
                        </CardContent>
                    </Card>
                    {/* Note */}
                    <Card sx={{ borderRadius: '15px', border: '1px solid #00B400' }}>
                        <CardContent>
                            <Typography variant='h6' sx={{ fontWeight: 'bold', textAlign: 'flex-start' }}>{t("Note")}</Typography>
                            <Divider sx={{ mb: 2 }} />
                            {candidato?.note && candidato.note.split('\n').map((line, index) => (
                                <Typography key={index} variant='body1'>{line}</Typography>
                            ))}
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
