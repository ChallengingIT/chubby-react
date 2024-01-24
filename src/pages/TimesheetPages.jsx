import React, { useEffect, useState }               from 'react';
import Sidebar                                      from '../components/Sidebar';
import TimeSheetComponent                           from '../components/TimesheetComponent';
import { useLocation, useParams }                   from "react-router-dom";
import axios                                        from 'axios';


function TimesheetPages() {


  const params                  = useParams();
  const location                = useLocation();
  const { dipendentiData = {} } = location.state || {};

console.log("DATI ARRIVATI TIMESHEET PAGES: ", dipendentiData);

const idProgetti = dipendentiData.progetti?.map(progetto => progetto.id);
// console.log("IDPROGETTI: ", idProgetti);


  const [ anno,          setAnno         ] = useState(new Date().getFullYear()); 
  const [ mese,          setMese         ] = useState(new Date().getMonth() + 1); 
  const [ timesheetData, setTimesheetData] = useState({}); 


  

  // useEffect(() => {
  //   const loadTimesheetData = async () => {
  
  //     try {
  
  //       const url = `http://localhost:8080/react/user${dipendentiData.id}/${anno}/${mese}`;
    
  
  //       const response = await axios.get(url);
    
  //       console.log('Dati del timesheet caricati:', response.data);
    
  
  //       setTimesheetData(response.data);
  //     } catch (error) {
  //       console.error('Errore durante il caricamento dei dati del timesheet:', error);
  //     }
  //   };
  //   loadTimesheetData();
  // }, []);




  // const handleSubmitTot = async (timesheetData) => {
  //   try {

  //     const url = `http://localhost:8080/react/user/precedente/${dipendenteID}/${timesheetData.anno}/${timesheetData.mese}`;


  //     const response = await axios.get(url, { timesheetData });
      

  //     console.log('Risposta dal server:', response.data);
  //   } catch (error) {
  //     console.error('Errore durante l\'invio dei dati del timesheet:', error);
  //   }
  // };



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
                <TimeSheetComponent
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