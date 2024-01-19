import React from 'react'
import Sidebar from '../../components/Sidebar';
import ReportSearchBox from '../../components/searchBox/ReportSearchBox';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportPage from '../ReportPage';




    


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
        {/* <div className="page-name">Report</div> */}
        <h1 style={{ display: 'flex', justifyContent:'flex-start', marginTop: '35px', marginLeft: '35px' }}>Report</h1>
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
        </div>
        </div>
        </div>
        
  )
};

export default EstraiReport;