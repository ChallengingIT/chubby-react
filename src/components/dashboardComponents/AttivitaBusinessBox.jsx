import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import TabellaAttivitaBusiness from './TabellaAttivitaBusiness';

const AttivitaBusinessBox = ({data, aziendeOptions}) => {

    return (
        <Card style={{width: '100%', height: '95%', display: 'flex', position: 'relative', borderRadius: '20px'}}>
            <CardContent style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(217, 217, 217, 0)', borderRadius: 20, border: '2px #00B400 solid'}}>
                {/* <Typography variant="h5" style={{marginBottom: 16, fontWeight: 'bold'}}>Attività ed Eventi</Typography> */}
                <Typography variant='h5' sx={{ display: 'flex',mt:1 , mb: 1, fontWeight: 'bold', justifyContent: 'flex-end'}}>Attività ed Eventi Business</Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', height: '100%', width: '100%', pt: 5 }}>
                    <TabellaAttivitaBusiness 
                    data={data}
                    aziendeOptions={aziendeOptions}/>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AttivitaBusinessBox;
