import React from 'react'
import Sidebar from '../../components/Sidebar';
import ReportSearchBox from '../../components/searchBox/ReportSearchBox';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';




    


function EstraiReport() {

    const navigate                = useNavigate();
    
    const handleGoBack = () => {
        navigate("/hr");
          };






  return (
    <div className="container">
    <div className="content">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="container">
        <div className="page-name">Report</div>
       <ReportSearchBox/>
        </div>
        
        <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'fixed', 
    bottom: 0,         
    width: '100%',     
    marginBottom: '20px' 
}}>
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
        </div>
        </div>
        </div>
        
  )
};

export default EstraiReport;