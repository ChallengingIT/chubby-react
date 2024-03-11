import React from 'react';
import GIF from '../images/zeb-zeb89.gif';
import { Box, Typography } from '@mui/material';

function Dashboard() {
  return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', ml: 10 }}>

       <Typography>EH! VOLEVI!!</Typography>
      <img src={GIF} alt="Loading..." />
      <Typography sx={{ml: 17, mt: 8}}>Mi dispiace, ancora questa pagina non è disponibile, cioè, ancora dobbiamo
        definire cosa verrà visualizzato qui, poi decidere pure in quale forma, i colori, la disposizione,
        poi lo devo programmare, è ancora lunga car* mi*, però vabbè... per il resto tutto bene? che mi racconti?
       
        
      </Typography>
     
      
    </Box>
  );
}

export default Dashboard;
