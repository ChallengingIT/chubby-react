import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DashboardImg from '../images/dashboard.png';
import axios from 'axios';

function Dashboard() {
  const [companyLogo, setCompanyLogo] = useState('');
  const [imageSrc, setImageSrc] = useState(DashboardImg);

  const fetchLogo = async () => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const userObj = JSON.parse(userString);
      if (userObj.roles.includes("ROLE_BUSINESS")) {
        const idAziende = userObj.idAzienda;
        const parametroDaInviare = { idAzienda: idAziende };

        try {
          const response = await axios.get(`http://localhost:8080/aziende/react/logo`, {
            params: parametroDaInviare
          });
          if (response.data) {
            setCompanyLogo(response.data);
            setImageSrc(`data:image/png;base64,${response.data}`);
          }
        } catch (error) {
          console.error("Errore nel fetch del logo aziendale:", error);
        }
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
          // overflow: 'auto'
        }}
      >
        <img src={imageSrc} alt="Dashboard" style={{ width: '100%', height: '100%' }} />
      </Box>
    </Box>
  );
}

export default Dashboard;
