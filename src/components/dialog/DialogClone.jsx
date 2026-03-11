import React from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Stack,
    Box
} from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";

const DialogClone = ({
    open,
    title,
    description,
    onConfirm,
    onClose
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2,
                },
            }}
        >
            <DialogContent>
                <Stack spacing={3} alignItems="center" textAlign="center">
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: "#00B400",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            boxShadow: "0 10px 25px rgba(0,180,0,0.35)",
                        }}
                    >
                        <ControlPointDuplicateIcon fontSize="large" />
                    </Box>

                    <Typography variant="h6" fontWeight={700}>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Stack direction="row" spacing={2} width="100%">
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            bgcolor: "#ECECEC",
                            color: "black",
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 600,
                            "&:hover": {
                                bgcolor: "#a8a8a8",
                            },
                        }}
                    >
                        Annulla
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onConfirm}
                        sx={{
                            bgcolor: "#00B400",
                            color: "white",
                            borderRadius: 2,
                            py: 1.2,
                            fontWeight: 600,
                            boxShadow: "0 8px 20px rgba(0,180,0,0.35)",
                            "&:hover": {
                                bgcolor: "#009700",
                            },
                        }}
                    >
                        Duplica
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default DialogClone;