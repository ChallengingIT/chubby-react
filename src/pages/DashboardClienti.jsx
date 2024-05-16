import React, { useEffect, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import axios from 'axios';

function DashboardClienti() {
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLogo = async () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const userObj = JSON.parse(userString);
            const parametroDaInviare = { idAzienda: userObj.idAzienda };

            try {
                const response = await axios.get(`http://localhost:8080/aziende/react/logo`, {
                    params: parametroDaInviare
                });
                if (response.data) {
                    setImageSrc(`data:image/png;base64,${response.data}`);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Errore nel fetch del logo aziendale:", error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchLogo();
    }, []);

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: '12.8em',
                    marginTop: '0.5em',
                    marginBottom: '0.8em',
                    marginRight: '0.8em',
                    backgroundColor: '#FEFCFD',
                    borderRadius: '20px',
                    minHeight: '98vh',
                    mt: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : <img src={imageSrc} alt="Dashboard" style={{ width: '100%', height: '100%' }} />}
            </Box>
        </Box>
    );
}

export default DashboardClienti;
