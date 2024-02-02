// import React, { useState, useEffect }                       from 'react';
// import axios                                                from 'axios';
// import { 
//     TextField, 
//     Button, 
//     Table, 
//     TableBody, 
//     TableCell, 
//     TableContainer, 
//     TableHead, 
//     TableRow, 
//     Paper, 
//     TablePagination, 
//     FormControl, 
//     InputLabel, 
//     Select, 
//     MenuItem, 
//     CircularProgress,
//     Box,
//     Grid,
//     Typography
//  } from '@mui/material';
// import { set } from 'date-fns';


// const ReportPage2 = () => {

// const [ showTable,              setShowTable                        ] = useState(false);
// const [ dipendenti,             setDipendenti                       ] = useState([]);
// const [ loading,                setLoading                          ] = useState(false);
// const [ annoSelezionato,        setAnnoSelezionato                  ] = useState('');
// const [ meseSelezionato,        setMeseSelezionato                  ] = useState('');
// const [ dal,                    setDal                              ] = useState('');
// const [ al,                     setAl                               ] = useState('');
// const [ page,                   setPage                             ] = useState(0);
// const [ rowsPerPage,            setRowsPerPage                      ] = useState(10);
// const [ dipendenteUnivoco,      setDipendenteUnivoco                ] = useState({});
// const [ giorniTotali,           setGiorniTotali                     ] = useState(0);
// const [ selectDisabled,         setSelectDisabled                   ] = useState(false);

// // Recupera l'accessToken da localStorage
// const user = JSON.parse(localStorage.getItem("user"));
// const accessToken = user?.accessToken;

// // Configura gli headers della richiesta con l'Authorization token
// const headers = {
//   Authorization: `Bearer ${accessToken}`
// };


// const mesi = [
//     { value: '01', label: 'Gennaio' },
//     { value: '02', label: 'Febbraio' },
//     { value: '03', label: 'Marzo' },
//     { value: '04', label: 'Aprile' },
//     { value: '05', label: 'Maggio' },
//     { value: '06', label: 'Giugno' },
//     { value: '07', label: 'Luglio' },
//     { value: '08', label: 'Agosto' },
//     { value: '09', label: 'Settembre' },
//     { value: '10', label: 'Ottobre' },
//     { value: '11', label: 'Novembre' },
//     { value: '12', label: 'Dicembre' },
// ];

// const anni = Array.from({ length: 2051 - 2021 + 1 }, (_, i) => i + 2021);

// const handleChangePage = (event, newPage) => {
//     setPage(newPage);
// };

// const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
// };

// const handleSearch = async () => {
//     if (!annoSelezionato || !meseSelezionato) {
//         alert("Per favore, selezionare sia l'anno che il mese");
//         return;
//     }

//     setLoading(true);
//     setShowTable(false);

//     const primoGiornoDelMese = new Date(annoSelezionato, meseSelezionato - 1, 1);
//     const ultimoGiornoDelMese = new Date(annoSelezionato, meseSelezionato, 0);

//     const dalVal = dal || primoGiornoDelMese.toISOString().split('T')[0];
//     const alVal = al || ultimoGiornoDelMese.toISOString().split('T')[0];

//     try {
//         const responseReport = await axios.get("https://localhost:8443/hr/report/estrai", {
//             params: { anno: annoSelezionato, mese: meseSelezionato, dal: dalVal, al: alVal },
//             headers: headers
//         });
//         setShowTable(true);
//         setLoading(false);
//         setDipendenti(responseReport.data);
//         console.log("dipendenti: ", dipendenti);
//         console.log("DATI DI ESTRAI REPORT: ", responseReport.data);
//     } catch(error) {
//         console.error("Errore nella chiamata per recuperare il report: ", error);
//     }
// };


// // Quando la tabella viene visualizzata, disabilito i select e li posso riabilitare solo dopo aver premuto reset
// useEffect(() => { 
//     if (showTable) {
//       setSelectDisabled(true);
//     }
//   }, [showTable]);





// const handleEstraiExcel = async () => {

//     const primoGiornoDelMese = new Date(annoSelezionato, meseSelezionato - 1, 1);
//     const ultimoGiornoDelMese = new Date(annoSelezionato, meseSelezionato, 0);

//     const giornoInizio = dal || primoGiornoDelMese.toISOString().split('T')[0];
//     const giornoFine = al || ultimoGiornoDelMese.toISOString().split('T')[0];
//     const url = `https://localhost:8443/hr/report/excel/${annoSelezionato}/${meseSelezionato}/${giornoInizio}/${giornoFine}`

//     try {
//         const responseEstraiExcel = await axios({
//             method: 'GET',
//             url: url,
//             responseType: 'blob',
//             headers: headers
//         });

//         const fileURL = window.URL.createObjectURL(new Blob([responseEstraiExcel.data], { type: 'application/xls' }));

//         const link = document.createElement('a');
//         link.href = fileURL;
//         link.setAttribute('download', `report-${annoSelezionato}-${meseSelezionato}.xls`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     } catch (error) {
//         console.error("Errore nella chiamata per estrarre il report in formato Excel: ", error);
//     }   
// };


// const handleReset = () => {
//     setAnnoSelezionato('');
//     setMeseSelezionato('');
//     setDal('');
//     setAl('');
//     setShowTable(false);
//     setSelectDisabled(false);
// }

// const getDaysInMonth = (annoSelezionato, meseSelezionato) => {
//     return new Date(annoSelezionato, meseSelezionato, 0).getDate();
// };


// const handleChangeMese = (e) => {
//     setMeseSelezionato(e.target.value);
//     const giorniTotaliNuovoMese = getDaysInMonth(annoSelezionato, e.target.value);
//     setGiorniTotali(giorniTotaliNuovoMese);
//   };




// const giorniFestivi = ['01-01', '01-06', '04-01', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];
// const lunediPasqua = [ "2025-04-21", "2026-04-06", "2027-03-29", "2028-04-17", "2029-04-02", "2030-04-22", "2031-04-14", "2032-03-29", "2033-04-18", "2034-04-10" ]; 


// const festivi = (giorno, mese) => {
//     const dataFormattata = `${mese.toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
//     return giorniFestivi.includes(dataFormattata);
// };

// const isLunediPasqua = (giorno, mese, anno) => {
//     const dataFormattata = `${anno}-${mese.toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
//     return lunediPasqua.includes(dataFormattata);
// };


// const renderDayBox = (dipendente, giorniTotali) => {
//     return (
//         <React.Fragment>
//             {Array.from({ length: giorniTotali }, (_, i) => {
//             const giorno = i + 1;
//             const giornoSettimana = new Date(annoSelezionato, meseSelezionato - 1, giorno).getDay();
//             const isSabatoODomenica = giornoSettimana === 0 || giornoSettimana === 6;
//             const isGiornoFestivo = festivi(giorno, meseSelezionato) || isLunediPasqua(giorno, meseSelezionato, annoSelezionato);
            
//             const oreTotaliGiorno = dipendente.giorni[i] && dipendente.giorni[i].oreTotali ? dipendente.giorni[i].oreTotali : "0";
            
//             let colore = 'black';
//             if (isSabatoODomenica || isGiornoFestivo) {
//                 colore = 'white';
//             } else if (dipendente.giorni[i] && dipendente.giorni[i].ferie) {
//                 colore = 'red';
//             } else if (dipendente.giorni[i] && dipendente.giorni[i].malattia) {
//                 colore = 'blue';
//             } else if (dipendente.giorni[i] && dipendente.giorni[i].permesso) {
//                 colore = 'green';
//             }
            
//             const giornoStyle = isSabatoODomenica || isGiornoFestivo
//                 ? { backgroundColor: '#14D928', color: 'white' }
//                 : { backgroundColor: 'grey.200', color: colore };
    
//             return (
//                 <TableCell key={i} style={giornoStyle}>
//                 <Typography variant="body2" style={{ fontWeight: 'bold' }}>
//                     {oreTotaliGiorno}
//                 </Typography>
//                 </TableCell>
//             );
//             })}
//         </React.Fragment>
//         );
//     };
    


















// return (
// <Box>

    
//     <Box sx={{ width: '40%', margin: '20px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.4)' }}>
//         <Grid container spacing={3} justifyContent="center" alignItems="center" padding={3}>
//         <Grid item xs={6}>
//             <FormControl fullWidth>
//             <InputLabel>Anno</InputLabel>
//             <Select
//                 label="Anno"
//                 value={annoSelezionato}
//                 onChange={(e) => setAnnoSelezionato(e.target.value)}
//                 disabled={selectDisabled}
//             >
//                 {anni.map((anno) => (
//                 <MenuItem key={anno} value={anno}>
//                     {anno}
//                 </MenuItem>
//                 ))}
//             </Select>
//             </FormControl>
//         </Grid>
//         <Grid item xs={6}>
//             <FormControl fullWidth>
//             <InputLabel>Mese</InputLabel>
//             <Select
//                 label="Mese"
//                 value={meseSelezionato}
//                 // onChange={(e) => setMeseSelezionato(e.target.value)}
//                 onChange={handleChangeMese}
//                 disabled={selectDisabled}
//             >
//                 {mesi.map((mese) => (
//                 <MenuItem key={mese.value} value={mese.value}>
//                     {mese.label}
//                 </MenuItem>
//                 ))}
//             </Select>
//             </FormControl>
//         </Grid>
//         <Grid item xs={6}>
//             <TextField
//             fullWidth
//             label="Dal"
//             type="number"
//             InputLabelProps={{ shrink: true }}
//             value={dal}
//             onChange={(e) => setDal(e.target.value)}
//             disabled={selectDisabled}

//             />
//         </Grid>
//         <Grid item xs={6}>
//             <TextField
//             fullWidth
//             label="Al"
//             type="number"
//             InputLabelProps={{ shrink: true }}
//             value={al}
//             onChange={(e) => setAl(e.target.value)}
//             disabled={selectDisabled}

//             />
//         </Grid>
//         <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
//             <Button variant="contained" color="primary" onClick={handleReset} sx={{
//             backgroundColor: 'black',
//             color: 'white',
//             borderRadius: '10px',
//             '&:hover': {
//                 backgroundColor: 'black',
//                 color: 'white',
//             },
//             }}>
//             Reset
//             </Button>
//             <Button variant="contained" color="primary" onClick={handleSearch} sx={{
//             backgroundColor: '#14D928',
//             color: 'black',
//             borderRadius: '10px',
//             '&:hover': {
//                 backgroundColor: '#14D928',
//                 color: 'black',
//             }
//             }}>
//             Cerca
//             </Button>
//         </Grid>
//         </Grid>
//     </Box>



//     {loading && (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//         <CircularProgress sx={{ color: 'white'}}/>
//       </Box>
//     )}


//         {!loading && showTable && (
            
//         <React.Fragment>
//             <TableContainer component={Paper} sx={{ 
//             margin: '20px',
//             width: 'auto', // La larghezza si adatta al contenuto
//             backgroundColor: 'white', 
//             borderRadius: '20px',
//             boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.4)'
//             }}>
//             <Table aria-label="customized table">
//                 <TableHead>
//                 <TableRow>
//                     <TableCell>Dipendente</TableCell>
//                     {[...Array(giorniTotali)].map((_, i) => (
//                     <TableCell key={i}>{i + 1}</TableCell>
//                     ))}
//                 </TableRow>
//                 </TableHead>
//                 <TableBody>
//                 {dipendenti
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((dipendente) => (
//                     <TableRow key={dipendente.nome}>
//                         <TableCell component="th" scope="row">
//                         {dipendente.nome}
//                         </TableCell>
//                         {renderDayBox(dipendente, giorniTotali)}
//                     </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '20px' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <Box sx={{ width: '15px', height: '15px', backgroundColor: 'blue' }} />
//             <Typography variant="body2">Malattia</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <Box sx={{ width: '15px', height: '15px', backgroundColor: 'green' }} />
//             <Typography variant="body2">Permesso</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//             <Box sx={{ width: '15px', height: '15px', backgroundColor: 'red' }} />
//             <Typography variant="body2">Ferie</Typography>
//             </Box>
//         </Box>
//         <TablePagination
//                 count={dipendenti.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 labelRowsPerPage="Dipendenti per pagina:"
//                 // Rimuovi qualsiasi stile personalizzato che possa influire sul posizionamento
//             />
//         </Box>
//             </TableContainer> 
//             <Button variant="contained" color="primary" onClick={handleEstraiExcel} sx={{
//             backgroundColor: 'black',
//             color: 'white',
//             borderRadius: '10px',
//             '&:hover': {
//                 backgroundColor: 'black',
//                 color: 'white',
//             },
//             }}>
//             Estrai Report
//             </Button>
//         </React.Fragment>
//         )}

        

//     </Box>
//     );
//     };

//     export default ReportPage2;