import React, { useEffect, useState }               from 'react';
import Sidebar                                      from '../components/Sidebar';
import { useLocation, useParams }                   from "react-router-dom";
import TimesheetComponent                           from '../components/TimesheetComponent';
import { Box, Typography } from '@mui/material';
import Sidebar2 from '../components/componentiBackup/Sidebar2';


function TimesheetPages() {


  const params                  = useParams();
  const location                = useLocation();
  const { dipendentiData = {} } = location.state || {};



const idProgetti = dipendentiData.progetti?.map(progetto => progetto.id);


  const [ anno,          setAnno         ] = useState(new Date().getFullYear()); 
  const [ mese,          setMese         ] = useState(new Date().getMonth() + 1); 
  const [ timesheetData, setTimesheetData] = useState({}); 




    return (
      <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100%', width: '100%', overflow: 'hidden'}}>
              <Sidebar2 />
              <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',}}>
              <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Timesheet di {dipendentiData.nome} {dipendentiData.cognome}</Typography>
              <Box sx={{ height: '90%', marginTop: '40px', width: '100%'}}>
                <TimesheetComponent
                anno={anno}
                setAnno={setAnno}
                mese={mese}
                setMese={setMese}
                timesheetData={timesheetData}
                setTimesheetData={setTimesheetData}
                id={dipendentiData.id}
                idProgetti={idProgetti}
                />
            </Box>
    </Box>
    </Box>


      );
}

export default TimesheetPages;