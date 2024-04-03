import React from 'react';
import { Box } from '@mui/material';
import DashboardImg from '../images/dashboard.png';
import AttivitaBox from '../components/dashboardComponents/AttivitaBox';

function DashboardProva() {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                marginLeft: '13.2em', 
                marginTop: '0.5em', 
                marginBottom: '0.8em', 
                marginRight: '0.8em', 
                backgroundColor: '#FEFCFD', 
                borderRadius: '20px', 
                minHeight: '98vh',
                mt: 1.5,
                // overflow: 'auto'
                
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                <AttivitaBox />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, border: 'solid 1px #00853C', borderRadius: '10px', width: '100%', height: '100%', p: 2 }}>
                </Box>
                </Box>
        </Box>
    </Box>
  );
}

export default DashboardProva;
