import React, { useEffect, useState }               from 'react';
import { useLocation, useParams }                   from "react-router-dom";
import UserSidebar                                  from './UserSidebar';
import UserTimesheetComponent2                      from './UserTimesheetComponent2';


function UserTimesheet() {


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
              <UserSidebar />
            </div>
            <div className="container">
              {/* <div className="page-name">Timesheet </div> */}
              <div className='page-name' style={{ marginBottom: "20px", marginTop: "30px"}}>{`Timesheet`}</div>
              <div style={{ borderRadius: '40px'}}>
                <UserTimesheetComponent2
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

export default UserTimesheet;