
//timesheetComponet il primo che ho fatto




// import React, { useEffect, useState } from 'react';
// import { 
//   Dialog, 
//   Paper, 
//   Grid, 
//   Button, 
//   Typography, 
//   Box, 
//   DialogContent, 
//   TextField, 
//   DialogActions, 
//   FormControlLabel, 
//   Checkbox, 
//   Alert,
//   Snackbar,
//   Select, 
//   MenuItem, 
//   InputLabel, 
//   FormControl 
// } from '@mui/material';
// import BackButton from './button/BackButton';
// import SaveButton from './button/SaveButton';
// import axios from 'axios';


// const TimeSheetComponent = ({ anno, setAnno, mese, setMese, timesheetData, setTimesheetData, id, idProgetti }) => {


//   useEffect(() => {
//     const today = new Date();
//     const currentYear = today.getFullYear();
//     const currentMonthIndex = today.getMonth(); // Gennaio è 0, Dicembre è 11

//     setMeseCorrente(currentMonthIndex + 1); // Imposta il mese corrente (i mesi partono da 1)
//     setAnnoCorrente(currentYear); // Imposta l'anno corrente

//     // ... [eventuali altre operazioni che vuoi effettuare quando il componente viene montato]
//   }, []); // L'array vuoto come secondo argomento fa sì che l'effetto venga eseguito solo una volta, quando il componente viene montato


// const [ currentMonth,           setCurrentMonth               ] = useState(new Date());
// const [ modalOpen,              setModalOpen                  ] = useState(false);
// const [ selectedDay,            setSelectedDay                ] = useState(null);
// const [ hours,                  setHours                      ] = useState({});
// const [ totHours,               setTotHours                   ] = useState(0);
// const [ modalCloseAction,       setModalCloseAction           ] = useState('');
// const [ meseCorrente,           setMeseCorrente               ] = useState('');
// const [ annoCorrente,           setAnnoCorrente               ] = useState('');
// const [ isMonthSubmitted,       setIsMonthSubmitted           ] = useState(false);
// const [ alert,                  setAlert                      ] = useState({ open: false, message: '' });
// const [ originalTimesheet,      setOriginalTimesheet          ] = useState([]);
// const [ filteredTimesheet,      setFilteredTimesheet          ] = useState([]);
// const [ primoTimesheet,         setPrimoTimesheet             ] = useState([]);
// const [ uniqueProjects,         setUniqueProjects             ] = useState({});
// const [ selectedProject,        setSelectedProject            ] = useState(null);

// const idStaff = 29;




// //dati da inviare
// const [ orePermesso,            setOrePermesso                ] = useState('');
// const [ data,                   setData                       ] = useState('');
// const [ dataFinePeriodo,        setDataFinePeriodo            ] = useState('');
// const [ oreOrdinarie,           setOreOrdinarie               ] = useState('');
// const [ ferieChecked,           setFerieChecked               ] = useState(false);
// const [ malattiaChecked,        setMalattiaChecked            ] = useState(false);
// const [ permessoChecked,        setPermessoChecked            ] = useState(false);
// const [ oreStraordinario,       setOreStraordinario           ] = useState('0');
// const [ oreNotturno,            setOreNotturno                ] = useState('0');


// const idProgetto = idProgetti && idProgetti.length > 0 ? idProgetti[0] : null;




// useEffect(() => {
//   // Se "ferie" o "malattia" sono selezionati, imposta "ore" a 8
//   if (ferieChecked || malattiaChecked) {
//     setOreOrdinarie('8');
//   }
//   // Se "permesso" è selezionato, imposta "ore" a 0
//   else if (permessoChecked) {
//     setOreOrdinarie('0');
//   }
//   // Se nessuno è selezionato, potresti voler resettare il campo "ore" o lasciarlo come sta
//   else {
//     setOreOrdinarie('0'); 
//   }
// }, [ferieChecked, malattiaChecked, permessoChecked]); 





// const fetchData = async () => {
//   const mese = meseCorrente;
//   const anno = annoCorrente;

  
//   try {
//     const response = await axios.get(`http://localhost:8080/timesheet/react/staff/${idStaff}/${anno}/${mese}`);
    
//     if (response.data && response.data.mese && Array.isArray(response.data.mese.days)) {
//       const timesheetConId = response.data.mese.days.map((timesheet) => ({...timesheet}));

//       // Crea un oggetto che raggruppa le ore per progetto e giorno
//       const projectsMap = timesheetConId.reduce((acc, current) => {
//         const projectId = current.progetto.id;
//         if (!acc[projectId]) {
//           acc[projectId] = {
//             description: current.progetto.description,
//             id: current.progetto.id,
//             giorni: {}
//           };
//         }
//         acc[projectId].giorni[current.giorno] = current.oreOrdinarie || 0;
//         return acc;
//       }, {});

//       setUniqueProjects(projectsMap);
//       console.log("PROGETTO UNICO: ", uniqueProjects);
//       setOriginalTimesheet(timesheetConId);
//       setFilteredTimesheet(timesheetConId);
//       console.log("DATI ARRIVATI DA TIMESHEET COMPONENT: ", timesheetConId);
//     } else {
//       console.error("I dati ottenuti non sono nel formato previsto:", response.data);
//     } 
//   } catch (error) {
//     console.error("Errore durante il recupero dei dati: ", error);
//   }
// };



// useEffect(() => {
//   // Assicurati che sia annoCorrente che meseCorrente non siano vuoti o nulli
//   if (annoCorrente && meseCorrente) {
//     fetchData();
//   }
// }, [annoCorrente, meseCorrente]); // Dipendenze: esegui fetchData ogni volta che annoCorrente o meseCorrente cambiano



// useEffect(() => {
//   const fetchDataPrimoTimesheet = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/timesheet/react/staff/primo/${id}`);
//       // Assumendo che la risposta contenga i dati desiderati nel formato "MM-YYYY"
//       const [month, year] = response.data.split('-').map(Number);
//       setPrimoTimesheet(new Date(year, month - 1, 1)); // Month - 1 perché i mesi in JavaScript partono da 0
//       console.log("Primo timesheet: ", response.data);
//     } catch (error) {
//       console.error('Errore durante il recupero dei dati:', error);
//     }
//   };
//   fetchDataPrimoTimesheet();
// }, [id]);



// const renderProjects = () => {
//   return Object.values(uniqueProjects).map(project => (
//     <Grid container key={project.description} spacing={2}>
//       <Grid item xs={12} sm={6}>
//         <Typography variant="h6">{project.description}</Typography>
//       </Grid>
//       <Grid item xs={12} sm={6}>
//         {renderDayBox(project)}
//       </Grid>
//     </Grid>
//   ));
// };



// const handleFerieChange = (event) => {
//   setFerieChecked(event.target.checked);
//   if (event.target.checked) {
//     setMalattiaChecked(false);
//     setPermessoChecked(false);
//   }
// };

// const handleMalattiaChange = (event) => {
//   setMalattiaChecked(event.target.checked);
//   if (event.target.checked) {
//     setFerieChecked(false);
//     setPermessoChecked(false);
//   }
// };

// const handlePermessoChange = (event) => {
//   setPermessoChecked(event.target.checked);
//   if (event.target.checked) {
//     setFerieChecked(false);
//     setMalattiaChecked(false);
//   }
// };


// const handleCloseAlert = (event, reason) => {
//   if (reason === 'clickaway') {
//     return;
//   }
//   setAlert({ ...alert, open: false });
// };




//   const daysOfWeek = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];

//   //salvataggio giorni festivi
//   const publicHolidays = ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];

//   // Funzione per verificare se un giorno è festivo
//   const isPublicHoliday = (day, month) => {
//     const formattedDate = `${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//     return publicHolidays.includes(formattedDate);
//   };

//   const daysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const firstDayOfWeek = (month, year) => {
//     return new Date(year, month, 1).getDay();
//   };



  

//   const handlePrevMonth = async () => {
//     // console.log("MESE CORRENTE: ", currentMonth);





//     const newMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);

//   // Controlla se il nuovo mese è prima del mese in primoTimesheet
//   if (newMonthDate.getFullYear() < primoTimesheet.getFullYear() || 
//     (newMonthDate.getFullYear() === primoTimesheet.getFullYear() && newMonthDate.getMonth() < primoTimesheet.getMonth())) {
//     setAlert({ open: true, message: "Non è possibile navigare ai mesi precedenti il primo timesheet disponibile" });
//     return; // Esci dalla funzione se la nuova data è antecedente al primo timesheet
//   }




  

//     const prevMonth = newMonthDate.getMonth() + 1; 
//     // console.log("Prev MESE: ",prevMonth);
//     const prevYear = newMonthDate.getFullYear();
//     // console.log("PREV ANNO:", prevYear);
//     try {

//       const url = `http://localhost:8080/timesheet/react/staff/precedente/${id}/${prevYear}/${prevMonth}`;


//       const response = await axios.get(url, { timesheetData });
      

//       // console.log('Risposta dal server:', response.data);
//       setIsMonthSubmitted(response.data.meseInviato);
//     } catch (error) {
//       console.error('Errore durante l\'invio dei dati del timesheet:', error);
//     }
//     setCurrentMonth(newMonthDate);
//     setMeseCorrente(prevMonth);
//     // console.log("NUOVO MESE: ", newMonthDate);
//   };
  

//   const handleNextMonth = async () => {
//     // console.log("MESE CORRENTE: ", currentMonth);

//     const newMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);


//     const nextMonth = newMonthDate.getMonth() + 1; 
//     console.log("NEXTMONTH: ",nextMonth);
//     const nextYear = newMonthDate.getFullYear();
//     console.log("NEXT ANNO:", nextYear);
//     try {

//       const url = `http://localhost:8080/timesheet/react/staff/successivo/${id}/${nextYear}/${nextMonth - 1}`;


//       const response = await axios.get(url, { timesheetData });
      

//       console.log('Risposta dal server:', response.data);
//       setIsMonthSubmitted(response.data.meseInviato);
      
//     } catch (error) {
//       console.error('Errore durante l\'invio dei dati del timesheet:', error);
//     }
//     setCurrentMonth(newMonthDate);
//     setMeseCorrente(nextMonth);
//     setAnnoCorrente(nextYear);
//     // console.log("NUOVO MESE: ", newMonthDate);

//   };

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const handleSubmit = async () => {
//     try {

//       // console.log("DATI PRIMA DELL'INVIO: ", timesheetData);


//       const url = `http://localhost:8080/timesheet/react/staff/salva/${id}/${annoCorrente}/${meseCorrente}`;


//       const response = await axios.post(url, { timesheetData });
      
//       setAlert({ open: true, message: response.data });
//       console.log('Risposta dal server:', response.data);
//       // console.log("DATI INVIATI: ", timesheetData );
//     } catch (error) {
//       console.error('Errore durante l\'invio dei dati del timesheet:', error);
//     }


//   };


  



  


//   const handleHoursChange = (date, value) => {
//     const dateString = date.toISOString().split('T')[0];
//     setHours((prevHours) => ({ ...prevHours, [dateString]: Number(value) || 0 }));
//   };



//   const calculateTotalOrdinaryHours = () => {
//     return filteredTimesheet.reduce((total, day) => {
//       return total + (day.oreOrdinarie || 0); 
//     }, 0); // Inizia da 0
//   };
  

//   // const calculateTotalHours = () => {
//   //   const total = Object.values(hours).reduce((sum, current) => sum + current, 0);
//   //   setTotHours(total);
//   // };

//   // const handleDayClick = (day) => {
//   //   const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//   //   setSelectedDay(date);
//   //   setModalOpen(true);
//   // };



// // const handleDayClick = (day) => {
// //   const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
// //   const dateString = date.toISOString().split('T')[0];

// //   setSelectedDay(date);
// //   setModalOpen(true);


// //   setHours((prevHours) => ({
// //     ...prevHours,
// //     [dateString]: prevHours[dateString] || 8,
// //   }));
// // };

// const handleDayClick = (day, project) => {
//   const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//   console.log("DATA DEL MODAL: ", date);
//   date.setDate(date.getDate() ); // Aggiungi un giorno qui
//   const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00`;

//   setSelectedDay(date);
//   setSelectedProject(project);
//   setModalOpen(true);
//   console.log("ID del progetto selezionato:", project.id);

//   // Imposta ore a 8 se non è già definito per quel giorno
//   setHours((prevHours) => ({
//     ...prevHours,
//     [dateString]: prevHours[dateString] || 8,
//   }));

//   // Imposta il valore di 'ore' nel modal
//   setOreOrdinarie(prevHours => prevHours[dateString] || 8);
// };

// useEffect(() => {
//   if (selectedDay) {
//     const newSelectedDateString = selectedDay.toISOString().split('T')[0];
//     console.log("Nuovo valore di selectedDateString:", newSelectedDateString);
//     // Qui puoi eseguire altre logiche dipendenti da selectedDay
//   }
// }, [selectedDay]); // Dipendenze: selectedDay






//   const handleCloseModal = () => {
//     // calculateTotalHours();
//     setModalOpen(false);
//     // setSelectedDay(null);
//     setOreOrdinarie(''); 
//   };

//   useEffect(() => {
//     // Se il modal è chiuso, resetta selectedDay
//     if (!modalOpen) {
//       setSelectedDay(null);
//     }
//   }, [modalOpen]);
  

//   // const handleSaveChanges = () => {
//   //   const selectedDateString = selectedDay.toISOString().split('T')[0];
//   //   setHours((prevHours) => ({ ...prevHours, [selectedDateString]: Number(hours[selectedDateString] || 0) }));
//   //   handleCloseModal();

//   // };

//   // Renderizza i quadrati per i giorni
//   const renderDaySquares = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const totalDays = daysInMonth(month, year);
//     const firstDay = firstDayOfWeek(month, year);
//     let dayOfWeek = firstDay;
  
//     const days = [];
  
//     // Giorni del mese
//     for (let day = 1; day <= totalDays; day++) {
//       // Controlla se è sabato o domenica
//       const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
//       const isHoliday = isPublicHoliday(day, month);
//       // const daySquareBgColor = isWeekend ? '#FF4D4D' : (isHoliday ? '#FF4D4D' : 'grey.200');
//       const isNonWorkingDay = isWeekend || isHoliday;
//     const daySquareStyle = isNonWorkingDay ? { backgroundColor: '#fbb800', color: 'white' } : { backgroundColor: 'grey.200' };

  
//       days.push(
//         <Box
//           key={day}
//           // onClick={() => handleDayClick(day)}
//           sx={{
//             height: "60px",
//             // backgroundColor: daySquareBgColor,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "98%",
           
//             ...daySquareStyle,
//             // minWidth: "30px",
//             // flexGrow: 1,
//           }}
//         >
//           <Typography>{day}</Typography>
//           <Typography>{daysOfWeek[dayOfWeek]}</Typography>
//         </Box>
//       );
      
//       // Aggiorna il giorno della settimana
//       dayOfWeek = (dayOfWeek + 1) % 7;
//       }
      
//       return (
//         <Grid item xs>
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'row',
//               flexWrap: 'nowrap', // Impedisce il passaggio a capo
//               overflowX: 'auto', // Permette lo scorrimento orizzontale se necessario
//               minWidth: "30px",
//               width: "98%",
//             }}
//           >
//             {days}
//           </Box>
//         </Grid>
//       );
// };



// // const renderDayBox = (project) => {
// //   const year = currentMonth.getFullYear();
// //   const month = currentMonth.getMonth();
// //   const totalDays = daysInMonth(month, year);
  

// //   return (
// //     <Grid item xs>
// //       <Box
// //         sx={{
// //           display: 'flex',
// //           flexDirection: 'row',
// //           flexWrap: 'nowrap', // Impedisce il passaggio a capo
// //           overflowX: 'auto', // Permette lo scorrimento orizzontale se necessario
// //           minWidth: "30px",
// //           width: "98%",
// //         }}
// //       >
// //         {filteredTimesheet.map((dayData) => {
// //           const isWeekend = dayData.iniziale === 'S' || dayData.iniziale === 'D'; // Adattalo secondo la logica corretta
// //           const isHoliday = dayData.festivo;
// //           // const daySquareBgColor = isWeekend ? '#FF4D4D' : (isHoliday ? '#FF4D4D' : 'grey.200');
// //           const isNonWorkingDay = isWeekend || isHoliday;
// //           const daySquareStyle = isNonWorkingDay ? { backgroundColor: '#fbb800', color: 'white' } : { backgroundColor: 'grey.200' };

// //           return (
// //             <Box
// //               key={dayData.id}
// //               sx={{
// //                 height: "45px",
// //                 // backgroundColor: daySquareBgColor,
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 width: "98%",
// //                 ...daySquareStyle,
// //                 ':hover': {
// //                   backgroundColor: "#fbb800",
// //                   cursor: 'pointer',
// //                 }
// //               }}
// //               onClick={() => handleDayClick(dayData.giorno)} // Assicurati che handleDayClick possa gestire questo parametro correttamente
// //             >
// //               <Typography>{dayData.oreOrdinarie || 0}</Typography>
// //             </Box>
// //           );
// //         })}
// //       </Box>
// //     </Grid>
// //   );
// // };



// const renderDayBox = (project) => {
//   const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'nowrap',
//         overflowX: 'auto',
//         minWidth: "30px",
//         width: "98%",
//       }}
//     >
//       {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
//         const oreOrdinarie = project.giorni[day] || 0;
//         const dayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay();
//         const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
//         const isHoliday = isPublicHoliday(day, currentMonth.getMonth());
//         const daySquareStyle = isWeekend || isHoliday ? { backgroundColor: '#fbb800', color: 'white' } : { backgroundColor: 'grey.200' };

//         return (
//           <Box
//             key={day}
//             sx={{
//               height: "45px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               width: "98%",
//               margin: 0,
//               paddingTop: 0,
//               ...daySquareStyle,
//               ':hover': {
//                 backgroundColor: "#fbb800",
//                 cursor: 'pointer',
//               }
//             }}
//             onClick={() => handleDayClick(day, project)}
//           >
//             <Typography>{oreOrdinarie}</Typography>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };




// const handleSubmitModal = async () => {
//   selectedDay.setDate(selectedDay.getDate() + 1);
//   const selectedDateString = selectedDay.toISOString().split('T')[0];
//   console.log("SELECTEDATESTRING: ", selectedDateString);

//   const projectId = selectedProject ? selectedProject.id : null;

//   console.log("ID DEL PROGETTO SELEZIONATO :", projectId);

//     // setHours((prevHours) => ({ ...prevHours, [selectedDateString]: Number(hours[selectedDateString] || 0) }));
//     const datiDaInviare = {
//       progetto: projectId,
//       permesso: permessoChecked,
//       malattia: malattiaChecked,
//       ferie: ferieChecked,
//       data: selectedDateString + 'T00:00',
//       dataFinePeriodo: dataFinePeriodo || null,
//       orePermesso: orePermesso || null, 
//       ore: oreOrdinarie
//     };




//     console.log("DATI DA INVITARE :", datiDaInviare );
//     try {
//       const url = `http://localhost:8080/timesheet/react/staff/aggiorna/${id}/${annoCorrente}/${meseCorrente}`;
//       const response = await axios.post(url, datiDaInviare );
//       if (response.data === "OK") {
//         // Dopo che il server ha confermato il salvataggio dei dati
//     await fetchData(); // attendi il recupero dei dati aggiornati
//     // Potresti dover forzare un re-render del componente, per esempio:
//     setUniqueProjects({}); // resetta lo stato per forzare l'aggiornamento
//     await fetchData(); // poi richiama fetchData per aggiornare lo stato con i nuovi dati
//         // Aggiornamento dei dati del timesheet solo se la risposta è "OK"
//         fetchData(); 
//         console.log("SALVATAGGIO EFFETTUATO CON SUCCESSO");
//         handleCloseModal(); // Chiude il dialog

       
//       } else {
//         setAlert({ open: true, message: response.data });
        
//       }
//       console.log('Risposta dal server:', response.data);
//     } catch (error) {
//       console.error('Errore durante l\'invio dei dati del timesheet:', error);
//       setAlert({ open: true, message: 'Errore durante il salvataggio.' });
//     }
//   };






// return (

  
//     <Box 
//     sx={{ width:"95%",
//     margin: "auto",
//     borderRadius: "40px",
//     boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
//     overflow: 'hidden' ,
// }}>
//   <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//         <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
//           {alert.message}
//         </Alert>
//       </Snackbar>
//       <Paper>
//       <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid black', }} spacing={2}>

//       <Grid item xs={2} sm={2} >
//         <Typography variant="h6" align="left">
          
//         </Typography>
        
//       </Grid>

//       {/* Navigazione Mesi e Griglia dei giorni */}
//       <Grid item xs={10} sm={10}>
//         <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 5, mb: 5 }}>
//           <Button sx={{ color:"#ffb800"}} onClick={handlePrevMonth}>{"<"}</Button>
//           <Typography variant="h6">
//             {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
//           </Typography>
//           <Button sx={{ color:"#ffb800"}} onClick={handleNextMonth}>{">"}</Button>
//         </Grid>
//         {renderDaySquares()}
//       </Grid>
//     </Grid>


//     {/* <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid black', }} spacing={2}>
//     <Grid item xs={2} sm={2} >
//         <Typography variant="h6" align="left" fontSize="17px"  >
//         {filteredTimesheet.map((timesheet) => timesheet.progetto.description).join(', ')}
// </Typography>
//         </Grid>
//         <Grid item xs={10} sm={10}>
//         {renderDayBox()}
//       </Grid>
//       </Grid> */}


// {/* <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid black', }} spacing={2}>
//   {Object.values(uniqueProjects).map((project, index) => (
//     <React.Fragment key={index} >
//       <Grid item xs={2} sm={2}>
//         <Typography variant="h6" align="left" fontSize="17px">
//           {project.description}
//         </Typography>
//       </Grid>
//       <Grid item xs={10} sm={10}>
//         {renderDayBox(project)}
//       </Grid>
//     </React.Fragment>
//   ))}
// </Grid> */}


// <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" spacing={2}>
//   {Object.values(uniqueProjects).map((project, index) => (
//     <React.Fragment key={index}>
//       <Grid item xs={2} sm={2} sx={{  borderBottom: '1px solid black', pb: 1, mb: 1 }}>
//         <Typography variant="h6" align="left" fontSize="17px">
//           {project.description}
//         </Typography>
//       </Grid>
//       <Grid item xs={10} sm={10} sx={{ borderBottom: '1px solid black', pb: 1, mb: 1 }}>
//         {renderDayBox(project)}
//       </Grid>
//     </React.Fragment>
//   ))}
// </Grid>




//         <Grid >
//         <Typography variant="h6" align="left" style={{ marginTop: '30px', marginLeft: '16px' }}>
//   Totale: {calculateTotalOrdinaryHours()}
// </Typography>

//             </Grid>
//             <Grid container marginTop={5} justifyContent="center" alignItems="center" gap={10} spacing={2}>
//               <BackButton />
//               <SaveButton onSubmit={handleSubmit} buttonText="Invia" />

//             </Grid>
//       </Paper>


//       {selectedProject && selectedProject.description === "Ferie, Permessi e Malattia" ? (
//       <Dialog open={modalOpen} onClose={handleCloseModal}>
//   <DialogContent>
//     <Typography sx={{marginBottom: "20px"}}>
//       Modifica Permesso per il Giorno: 
//       {selectedDay 
//         ? ` ${selectedDay.getDate().toString().padStart(2, '0')}/${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}/${selectedDay.getFullYear()}`
//         : ''}
//     </Typography>

//     <Grid container spacing={2}>
//       {/* Prima riga */}
//       <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
//       <TextField
//   fullWidth
//   // label={selectedProject ? selectedProject.description : "Progetto"}
//   value={selectedProject ? selectedProject.description : ""} 
//   InputLabelProps={{
//     shrink: true, 
//   }}
//   disabled 
// />
//   </Grid>
//       <Grid item xs={3}>
//     <FormControlLabel
//       control={
//         <Checkbox
//           checked={ferieChecked}
//           onChange={handleFerieChange}
//           name="ferie"
//           sx={{
//             '&.Mui-checked': {
//               color: '#ffb800',
//             },
//           }}
//         />
//       }
//       label="Ferie"
//     />
//   </Grid>
//   <Grid item xs={3}>
//     <FormControlLabel
//       control={
//         <Checkbox
//           checked={malattiaChecked}
//           onChange={handleMalattiaChange}
//           name="malattia"
//           sx={{
//             '&.Mui-checked': {
//               color: '#ffb800', 
//             },
//           }}
//         />
//       }
//       label="Malattia"
//     />
//   </Grid>
//   <Grid item xs={3}>
//     <FormControlLabel
//       control={
//         <Checkbox
//           checked={permessoChecked}
//           onChange={handlePermessoChange}
//           name="permesso"
//           sx={{
//             '&.Mui-checked': {
//               color: '#ffb800', 
//             },
//           }}
//         />
//       }
//       label="Permesso"
//     />
//   </Grid>
//       <Grid item xs={6}>
//         <TextField
//           fullWidth
//           label="Ore Permesso"
//           name="orePermesso"
//           value={orePermesso}
//           onChange={(e) => setOrePermesso(e.target.value)} 
//         />
//       </Grid>

//       {/* Seconda riga */}
//       <Grid item xs={6}>
//       <TextField
//   fullWidth
//   type="datetime-local"
//   label="Data Inizio"
//   name="data"
//   disabled
//   InputLabelProps={{
//     shrink: true,
//   }}
//   value={selectedDay 
//     ? `${selectedDay.getFullYear()}-${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.getDate().toString().padStart(2, '0')}T00:00`
//     : ''}
//   onChange={(e) => setData(e.target.value)}
// />

//       </Grid>
//       <Grid item xs={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Data Fine"
//           name="dataFinePeriodo"
//           onChange={(e) => setDataFinePeriodo(e.target.value)}
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       </Grid>

//       {/* Terza riga */}
//       <Grid item xs={6}>
//       <TextField
//     fullWidth
//     label="Ore"
//     name="ore"
//     type="number"
//     // value={selectedDay ? hours[selectedDay.toISOString().split('T')[0]] : ''} 
//     // onChange={(e) => handleHoursChange(selectedDay, e.target.value)}
//     value={oreOrdinarie}  
//   onChange={(e) => setOreOrdinarie(e.target.value)}
//   />
//       </Grid>
//     </Grid>
//   </DialogContent>
//   <DialogActions>
//   <Button
//             color="primary"
//             onClick={handleCloseModal}
//             style={{
//               backgroundColor: "black",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "black",
//                 transform: "scale(1.05)",
//               },
//             }}
//           >
//             Indietro
//           </Button>
      
//             <Button
//               color="primary"
//               variant="contained"
//               onClick={handleSubmitModal}

//               style={{
//                 backgroundColor: "#fbb800",
//                 color: "black",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   backgroundColor: "#fbb800",
//                   color: "black",
//                   transform: "scale(1.05)",
//                 },
//               }}
//             >
//               Salva
//             </Button>
//   </DialogActions>
// </Dialog>






// ) : (






//   <Dialog open={modalOpen} onClose={handleCloseModal}>
//   <DialogContent>
//     <Typography sx={{marginBottom: "20px"}}>
//       Modifica Permesso per il Giorno: 
//       {selectedDay 
//         ? ` ${selectedDay.getDate().toString().padStart(2, '0')}/${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}/${selectedDay.getFullYear()}`
//         : ''}
//     </Typography>

//     <Grid container spacing={2}>
//       {/* Prima riga */}
//       <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
//       <TextField
//   fullWidth
//   // label={selectedProject ? selectedProject.description : "Progetto"}
//   value={selectedProject ? selectedProject.description : ""} 
//   InputLabelProps={{
//     shrink: true, 
//   }}
//   disabled 
// />
//   </Grid>


//       {/* Seconda riga */}
//       <Grid item xs={6}>
//       <TextField
//   fullWidth
//   type="datetime-local"
//   label="Data Inizio"
//   name="data"
//   disabled
//   InputLabelProps={{
//     shrink: true,
//   }}
//   value={selectedDay 
//     ? `${selectedDay.getFullYear()}-${(selectedDay.getMonth() + 1).toString().padStart(2, '0')}-${selectedDay.getDate().toString().padStart(2, '0')}T00:00`
//     : ''}
//   onChange={(e) => setData(e.target.value)}
// />

//       </Grid>
//       <Grid item xs={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Data Fine"
//           name="dataFinePeriodo"
//           onChange={(e) => setDataFinePeriodo(e.target.value)}
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       </Grid>

//       {/* Terza riga */}

//       <Grid item xs={6}>
//       <TextField
//     fullWidth
//     label="Ore"
//     name="ore"
//     type="number"
//     // value={selectedDay ? hours[selectedDay.toISOString().split('T')[0]] : ''} 
//     // onChange={(e) => handleHoursChange(selectedDay, e.target.value)}
//     value={oreOrdinarie}  
//   onChange={(e) => setOreOrdinarie(e.target.value)}
//   />
//       </Grid>


//       <Grid item xs={6}>
//         <TextField
//           fullWidth
//           label="Straordinario (18:00 - 22:00)"
//           name="oreStraordinario"
//           value={oreStraordinario}
//           onChange={(e) => setOreStraordinario(e.target.value)} 
//         />
//       </Grid>

//       <Grid item xs={6}>
//         <TextField
//           fullWidth
//           label="Straord. Nott. (22:00 - 06:00)"
//           name="oreNotturno"
//           value={oreNotturno}
//           onChange={(e) => setOreNotturno(e.target.value)} 
//         />
//       </Grid>


//     </Grid>
//   </DialogContent>
//   <DialogActions>
//   <Button
//             color="primary"
//             onClick={handleCloseModal}
//             style={{
//               backgroundColor: "black",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "black",
//                 transform: "scale(1.05)",
//               },
//             }}
//           >
//             Indietro
//           </Button>
      
//             <Button
//               color="primary"
//               variant="contained"
//               onClick={handleSubmitModal}

//               style={{
//                 backgroundColor: "#fbb800",
//                 color: "black",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   backgroundColor: "#fbb800",
//                   color: "black",
//                   transform: "scale(1.05)",
//                 },
//               }}
//             >
//               Salva
//             </Button>
//   </DialogActions>
// </Dialog>
// )}
//     </Box>

//   );
// };

// export default TimeSheetComponent;