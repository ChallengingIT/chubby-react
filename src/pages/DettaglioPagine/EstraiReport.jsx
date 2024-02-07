import React from 'react'
import Sidebar from '../../components/Sidebar';
import ReportSearchBox from '../../components/searchBox/ReportSearchBox';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportPage from '../ReportPage';

function EstraiReport() {

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/hr");
          };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
        <Sidebar />
        <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto', justifyContent: 'center',}}>
        <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Report</Typography>
          <ReportPage/>
        <Button
          color="primary"
          onClick={handleGoBack}
          sx={{
            backgroundColor: "black",
            borderRadius: '40px',
            color: "white",
            width: '250px',
            height: '30px', 
            margin: 'auto',
            marginBottom: '20px',
            marginTop: 'auto',
            "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Indietro
        </Button>
        </Box>
        </Box>
  )
};

export default EstraiReport;