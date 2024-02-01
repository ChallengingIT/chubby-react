import React, { useEffect, useState }               from 'react';
import Sidebar                                      from '../components/Sidebar';
import { useLocation, useParams }                   from "react-router-dom";
import TimesheetComponent                           from '../components/TimesheetComponent';


function TimesheetPages() {


  const params                  = useParams();
  const location                = useLocation();
  const { dipendentiData = {} } = location.state || {};



const idProgetti = dipendentiData.progetti?.map(progetto => progetto.id);


  const [ anno,          setAnno         ] = useState(new Date().getFullYear()); 
  const [ mese,          setMese         ] = useState(new Date().getMonth() + 1); 
  const [ timesheetData, setTimesheetData] = useState({}); 




    return (
        <div className="container">
          <div className="content">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <div className="container">
              {/* <div className="page-name">Timesheet </div> */}
              <div className='page-name' style={{ marginBottom: "20px", marginTop: "30px"}}>{`Timesheet di ${dipendentiData.nome} ${dipendentiData.cognome}`}</div>
              <div style={{ borderRadius: '40px'}}>
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
              </div>
            </div>
          </div>
        </div>
      );
}

export default TimesheetPages;