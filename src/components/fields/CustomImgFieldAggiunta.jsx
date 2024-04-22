import React                       from 'react';
import CloudUploadIcon             from "@mui/icons-material/CloudUpload";
import { Box, Typography, Button } from '@mui/material';

function CustomImgFieldAggiunta({ label, imagePreviewUrl, onChange, initialValues }) {
    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <Box sx={{ width: '25em', mr: 10 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', m: 10 }}>
                <Typography variant='subtitle1' gutterBottom>{label}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', m: 10 }}>
                <Typography variant='body2'>
                    {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt="Immagine Caricata" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    ) : (
                        'Nessun file selezionato'
                    )}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mr: 0.5 }}>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: 'black',
                            marginLeft: '10px',
                            marginBottom: "10px",
                            marginTop: "10px",
                            justifyContent: "flex-end",
                            color: 'white',
                            ':hover': {
                                backgroundColor: 'black',
                                transform: 'scale(1.1)'
                            }
                        }}
                        startIcon={<CloudUploadIcon />}
                        component='label'
                    >
                        <input
                            type='file'
                            hidden
                            onChange={handleChange}
                        />
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default CustomImgFieldAggiunta;
