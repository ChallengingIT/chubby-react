import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import AttivitaBox from '../components/dashboardComponents/AttivitaBox';
import TabellaPipelineNeed from '../components/TabellaPipelineNeed';

function ProvaDashboard() {
    const columns = [
        { field: "owner", headerName: "Owner", flex: 1 },
        { field: "cliente", headerName: "Cliente", flex: 1 },
        { field: "descrizione", headerName: "Descrizione", flex: 1 },
        { field: "priorita", headerName: "Priorità", flex: 1 },
        { field: "stato", headerName: "Stato", flex: 1 },
        { field: "azione", headerName: "Azione", flex: 1 },
    ];

    const getRowId = (row) => row.id;

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Box sx={{
                flexGrow: 1, 
                p: 3, 
                marginLeft: '12.8em', 
                marginTop: '0.5em', 
                marginBottom: '0.8em', 
                marginRight: '0.8em', 
                backgroundColor: '#FEFCFD', 
                borderRadius: '20px', 
                minHeight: '97vh',
                mt: 1.5
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card
                            fullWidth
                            sx={{
                                borderRadius: '20px', 
                                maxWidth: '100%', 
                                height: '50vh',
                                border: '2px solid #00B401', 
                                p: 2,
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold' }}>Pipeline Need</Typography>
                                <Box sx={{ flexGrow: 1, height: '100%', width: '99%' }}>
                                    <TabellaPipelineNeed columns={columns} getRowId={getRowId} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card
                            sx={{
                                borderRadius: '20px', 
                                maxWidth: '100%', 
                                justifyContent: 'center', 
                                height: '40vh', 
                                border: '2px solid #00B401', 
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold' }}>KPI Settimanali</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', mt: 3 }}>
                                    <Gauge width={140} height={120} value={30} startAngle={-90} endAngle={90} text={({ value }) => `${value}%`} sx={{ [`& .${gaugeClasses.valueArc}`]: { fill: '#00B400' } }} />
                                    <Gauge width={140} height={120} value={60} startAngle={-90} endAngle={90} text={({ value }) => `${value}%`} sx={{ [`& .${gaugeClasses.valueArc}`]: { fill: '#00B400' } }} />
                                    <Gauge width={140} height={120} value={90} startAngle={-90} endAngle={90} text={({ value }) => `${value}%`} sx={{ [`& .${gaugeClasses.valueArc}`]: { fill: '#00B400' } }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <AttivitaBox />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ProvaDashboard;
