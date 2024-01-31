//timesheetComponent2, il primo che ho riscritto io ma che non funzionava perfettamente









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
// } from '@mui/material';
// import BackButton from './button/BackButton';
// import SaveButton from './button/SaveButton';
// import axios from 'axios';

// const TimesheetComponent2 = ({ timesheetData }) => {


// const [ meseCorrente,           setMeseCorrente               ] = useState(new Date()); //con new Date() me lo crea come anno/mese/giorno e l'ora per intero
// const [ annoCorrente,           setAnnoCorrente               ] = useState('');
// const [ meseNumero,             setMeseNumero                 ] = useState('');
// const [ annoNumero,             setAnnoNumero                 ] = useState('');
// const [ progettoUnivoco,        setProgettoUnivoco            ] = useState({});
// const [ filteredTimesheet,      setFilteredTimesheet          ] = useState([]);
// const [ modalOpen,              setModalOpen                  ] = useState(false);
// const [ giornoSelezionato,      setGiornoSelezionato          ] = useState(null);
// const [ meseAttuale,            setMeseAttuale                ] = useState('');
// const [ alert,                  setAlert                      ] = useState({ open: false, message: '' });
// const [ primoTimesheet,         setPrimoTimesheet             ] = useState([]);
// const [ progettoSelezionato,    setProgettoSelezionato        ] = useState(null);



// const id = 21;
// // const idProgettoFPM = 25;
// // const idProgettoAltro = 59;


// // const idProgetto = idProgettoFPM && idProgettoAltro;


// //dati da inviare
// const [ orePermesso,            setOrePermesso                ] = useState('');
// const [ date,                   setDate                       ] = useState('');
// const [ dataFinePeriodo,        setDataFinePeriodo            ] = useState('');
// const [ oreOrdinarie,           setOreOrdinarie               ] = useState('');
// const [ ferieChecked,           setFerieChecked               ] = useState(false);
// const [ malattiaChecked,        setMalattiaChecked            ] = useState(false);
// const [ permessoChecked,        setPermessoChecked            ] = useState(false);
// const [ oreStraordinario,       setOreStraordinario           ] = useState('');
// const [ oreNotturno,            setOreNotturno                ] = useState('');
// const [ ore,                    setOre                        ] = useState('');

//     useEffect(() => {
//         const date = new Date();
//         setMeseCorrente(date.getMonth() + 1); //+1 proprio perchè partono da 0
//         setAnnoCorrente(date.getFullYear());
//     }, []);




//     useEffect(() => {
//     // Se "ferie" o "malattia" sono selezionati, imposta "ore" a 8
//     if (ferieChecked || malattiaChecked) {
//         setOreOrdinarie('8');
//     }
//     // Se "permesso" è selezionato, imposta "ore" a 0
//     else if (permessoChecked) {
//         setOreOrdinarie('0');
//     }
//     // Se nessuno è selezionato, potresti voler resettare il campo "ore" o lasciarlo come sta
//     else {
//         setOreOrdinarie('0'); 
//     }
//     }, [ferieChecked, malattiaChecked, permessoChecked]); 


//     const fetchData = async () => {
//         const mese = meseCorrente;
//         const anno = annoCorrente;


//         try {
//             const response = await axios.get(`http://localhost:8080/timesheet/react/staff/${id}/${anno}/${mese}`);
//             if (response.data && response.data.mese && Array.isArray(response.data.mese.giornos)) {
//                 const timesheetConId = response.data.mese.giornos.map((timesheet) => ({...timesheet}));

//                 const progettoMap = timesheetConId.reduce((acc, current) => {
//                     const progettoID = current.progetto.id;
//                     if (!acc[progettoID]) {
//                         acc[progettoID] = {
//                             description: current.progetto.description,
//                             id: current.progetto.id,
//                             giorni: {}
//                         };
//                     }
//                     acc[progettoID].giorni[current.giorno] = current.oreOrdinarie || 0;
//                     return acc;
//                 }, {});

//                 setProgettoUnivoco(progettoMap);
//                 console.log("PROGETTO UNIVOCO: ", progettoUnivoco);
//                 setFilteredTimesheet(timesheetConId);
//                 console.log("DATI ARRIVATI DA TIMESHEET QUANDO VIENE MONTATO IL COMPONENTE: ", timesheetConId);
//             } else {
//                 console.error("I dati ottenuti non sono nel formato previsto: ", response.data);
//             }
//         } catch(error) {
//             console.error("Errore durante il recupero dei dati: ", error);
//         }
//     };

//     useEffect(() => {
//         if (annoCorrente && meseCorrente) {
//             fetchData();
//         }
//     }, [annoCorrente, meseCorrente]);

//     useEffect(() => {
//         const fetchPrimoTimesheet = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/timesheet/react/staff/primo/${id}`);
//                 const [mese, anno] = response.data.split('-').map(Number);
//                 setPrimoTimesheet(new Date(anno, mese -1, 1)); // -1 perchè i mesi in javascript iniziano da 0
//             } catch(error) {
//                 console.error("Errore durante il recupero dei dati: ", error);
//             }
//         };
//         fetchPrimoTimesheet();
//     }, [id]);



//     const handleFerieChange = (event) => {
//         setFerieChecked(event.target.checked);
//         if (event.target.checked) {
//             setMalattiaChecked(false);
//             setPermessoChecked(false);
//         }
//     };

//     const handlePermessoChange = (event) => {
//         setFerieChecked(event.target.checked);
//         if (event.target.checked) {
//             setMalattiaChecked(false);
//             setFerieChecked(false);
//         }
//     };

//     const handleMalattiaChange = (event) => {
//         setFerieChecked(event.target.checked);
//         if (event.target.checked) {
//             setFerieChecked(false);
//             setPermessoChecked(false);
//         }
//     };


//     const handleCloseAlert = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setAlert({ ...alert, open: false });
//     };


//     const giorniSettimana = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
//     const giorniFestivi = ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];

//     const festivi = (giorno, mese) => {
//         const dataFormattata = `${(mese + 1).toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
//         return giorniFestivi.includes(dataFormattata);
//     };

//     const giorniDelMese = (mese, anno) => {
//         return new Date(anno, mese + 1, 0).getDate();
//     };

//     const primoGiornoSettimana = ( mese, anno ) => {
//         return new Date(anno, mese, 1).getDay();
//     };



//     const handlePrevMese = async () => {
//         const nuovaData = new Date(meseCorrente.getFullYear(), meseCorrente.getMonth() - 1);
//         if (nuovaData.getFullYear() < primoTimesheet.getFullYear() || 
//         (nuovaData.getFullYear() === primoTimesheet.getFullYear() && 
//         nuovaData.getMonth() < primoTimesheet.getMonth())) {
//             setAlert({ open: true, message: "Non è possibile navigare ai mesi precedenti il primo timesheet disponibile" });
//             return;
//         }
//         const meseNumero = nuovaData.getMonth() + 1;
//         console.log("Mese precedente selezionato: ", meseNumero);
//         const annoNumero = nuovaData.getFullYear();
//         console.log("Anno precedente selezionato: ", annoNumero);
//         try {
//             const url = `http://localhost:8080/timesheet/react/staff/precedente/${id}/${annoNumero}/${meseNumero}`;
//             const response = await axios.get(url, { timesheetData });
//             console.log("Risposta dal server: ", response.data);
//             // setIsMonthSubmitted(response.data.meseInviato);
//         } catch (error) {
//             console.error("Errore durante l'invio dei dati del timesheet: ", error);
//         }
//         setMeseNumero(meseNumero);
//         setAnnoNumero(annoNumero);
//     };


//     const handleSuccMese = async () => {
//         const nuovaData = new Date(meseCorrente.getFullYear(), meseCorrente.getMonth() + 1);
//         const meseNumero = nuovaData.getMonth();
//         console.log("MESE SUCCESSIVO: ", meseNumero);
//         const annoNumero = nuovaData.getFullYear();
//         console.log("ANNO SUCCESSIVO :", annoNumero);
//         try {
//             const url = `http://localhost:8080/timesheet/react/staff/successivo/${id}/${annoNumero}/${meseNumero}`;
//             const response = await axios.get(url, { timesheetData });
//             console.log("Risposta dal server: ", response.data);
//                         // setIsMonthSubmitted(response.data.meseInviato);
//         } catch (error) {
//             console.error("Errore durante l'invio dei dati del timesheet: ", error);
//         }
//         setMeseCorrente(meseNumero);
//         setAnnoCorrente(annoNumero);
//     };

//     const handleSubmit = async () => {
//         try {
//             const url = `http://localhost:8080/timesheet/react/salva/${id}/${annoNumero}/${meseNumero}`;
//             const response = await axios.post(url, { timesheetData });
//             setAlert({ open: true, message: response.data });
//             console.log("RISPOSTA DAL SALVA: ", response.data);
//         } catch (error) {
//             console.error("Errore durante l'invio dei dati del timesheet: ", error);
//         }
//     };


//     const calcolaOreTotali = () => {
//         return filteredTimesheet.reduce((total, giorno) => {
//             return total + (giorno.oreTotali || 0);
//         }, 0); //inizia a stampare 0
//     };


//     const handleClickGiorno = (giorno, progetto) => {
//         const data = new Date(meseCorrente.getFullYear(), meseCorrente.getMonth(), giorno);
//         data.setDate(data.getDate());
//         const dataString = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}T00:00`;
//         setGiornoSelezionato(data);
//         setProgettoSelezionato(progetto);
//         setModalOpen(true);

//         //imposta ore a 8 se non è già definito per quel giorno
//         setOre((orePrecedenti) => ({
//             ...orePrecedenti,
//             [dataString]: orePrecedenti[dataString] || 8,
//         }));

//         //imposta il valore di ore nel modal a 8
//         setOreOrdinarie(orePrecedenti => orePrecedenti[dataString] || 8);
//     };

//     useEffect(() => {
//         if(giornoSelezionato) {
//             const nuovoGiornoSelezionatoString = giornoSelezionato.toISOString().split('T')[0];

//         }
//     }, [giornoSelezionato]);


//     const handleCloseModal = () => {
//         setModalOpen(false);
//         setOreOrdinarie('');
//     };

//     useEffect(() => {
//         if(!modalOpen) {
//             setGiornoSelezionato(null);
//         }
//     }, [modalOpen]);




//     //render per i rettangolini dei giorni del calendario
//     const rendergiornoSquares = () => {
//         const anno = meseCorrente.getFullYear();
//         const mese = meseCorrente.getMonth();
//         const giorniTotaliMese = giorniDelMese(mese, anno);
//         const primoGiorno = primoGiornoSettimana(mese, anno);
//         let GiornoDellaSettimana = primoGiorno;
//         const giorni = [];

//         for (let giorno = 1; giorno <= giorniTotaliMese; giorno++) {
//             const fineSettimana = GiornoDellaSettimana === 0 || GiornoDellaSettimana === 6;
//             const giorniFestivi = festivi(giorno, mese);
//             const giornoNonLavorativo = fineSettimana || giorniFestivi;
//             const giornoSquareStyle = giornoNonLavorativo ? { backgroundColor: '#fbb800', color: 'white' } : { backgroundColor: 'grey.200' };

//             giorni.push(
//                 <Box
//                 key= {giorno}
//                 sx={{
//                     height: "60px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "98%",
//                     ...giornoSquareStyle,
//                 }}
//                 >
//             <Typography>{giorno}</Typography>
//             <Typography>{giorniSettimana[giorniSettimana]}</Typography> 

//                 </Box>
//             );

//             GiornoDellaSettimana = (GiornoDellaSettimana + 1) % 7; // Ora puoi modificare questa variabile
//         }

//         return (
//             <Grid item xs>
//                 <Box
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     flexWrap: 'nowrap',
//                     overflowX: 'auto',
//                     minWidth: '30px',
//                     width: '98%',
//                 }}>
//                     {giorni}
//                 </Box>
//             </Grid>
//         );
//     };

        



// //render dei rettangolini dei progetti
// const rendergiornoBox = (progetto) => {
//     const giorniTotali = giorniDelMese(meseCorrente.getMonth(), meseCorrente.getFullYear());
//     return ( 
//         <Box
//         sx={{
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'nowrap',
//         overflowX: 'auto',
//         minWidth: "30px",
//         width: "98%",
//     }}
//     >
//         {Array.from({ lenght: giorniTotali }, (_, i) => i + 1).map(giorno => {
//             const oreOrdinarie = progetto.giorni[giorno] || 0;
//             const giorniSettimana = new Date(meseCorrente.getFullYear(), meseCorrente.getMonth(), giorno).getDay();
//             const fineSettimana = giorniSettimana === 0 || giorniSettimana === 6;
//             const giorniFestivi = festivi(giorno, meseCorrente.getMonth());
//             const giornoSquareStyle = fineSettimana || giorniFestivi ? { backgroundColor: '#fbb800', color: 'white' } : { backgroundColor: 'grey.200'};

//             return (
//                 <Box
//                 key={giorno}
//                 sx={{
//                     height: "45px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: "98%",
//                     margin: 0,
//                     paddingTop: 0,
//                     ...giornoSquareStyle,
//                     ':hover': {
//                     backgroundColor: "#fbb800",
//                     cursor: 'pointer',
//                     }
//                 }}
//                 onClick={() => handleClickGiorno(giorno, progetto)}
//                 >
//                 <Typography>{oreOrdinarie}</Typography>
//                 </Box>
//             );
//             })}
//         </Box>
//         );
//     };


//     const handleSubmitModal = async () => {
//         giornoSelezionato.setDate(giornoSelezionato.getDate() + 1);
//         const dataSelezionataString = giornoSelezionato.toISOString().split('T')[0];
//         const progettoID = progettoSelezionato ? progettoSelezionato.id : null;

//         const datiDaInviare = {
//             progetto: progettoID,
//             permesso: permessoChecked,
//             malattia: malattiaChecked,
//             ferie: ferieChecked,
//             data: dataSelezionataString + 'T00:00',
//             dataFinePeriodo: dataFinePeriodo || null,
//             orePermesso: orePermesso || null,
//             ore: oreOrdinarie
//         };
//         console.log("DATI DA INVIARE: ", datiDaInviare);
//         try{
//             const url = `http://localhost:8080/timesheet/react/staff/aggiorna/${id}/${annoCorrente}/${meseCorrente}`;
//             const response = await axios.post(url, datiDaInviare);
//             if (response.data === "OK" ) { 
//                  // Dopo che il server ha confermato il salvataggio dei dati
//     await fetchData(); // attendi il recupero dei dati aggiornati
//     // Potresti dover forzare un re-render del componente, per esempio:
//     setProgettoUnivoco({}); // resetta lo stato per forzare l'aggiornamento
//     await fetchData(); // poi richiama fetchData per aggiornare lo stato con i nuovi dati
//         // Aggiornamento dei dati del timesheet solo se la risposta è "OK"
//         fetchData(); 
//         console.log("SALVATAGGIO EFFETTUATO CON SUCCESSO");
//         handleCloseModal(); // Chiude il dialog
//             } else {
//                 setAlert({ open: true, message: response.data });
//             }
//             console.log("risposta dal salva modal: ", response.data);
//         } catch(error) {
//             console.error("Errore durante l'invio dei dati del timesheet: ", error);
//             setAlert({ open: true, message: "Errore durante il salvataggio del timesheet"});
//         }
//     };


//     return (
//         <Box
//         sx={{
//             width: '95%',
//             margin: 'auto',
//             borderRadius: '40px',
//             boxShadow: '10px 10px 10px rgba(0, 0, 0.5)',
//             overflow: 'hidden',
//         }}>
//             <Snackbar open= {alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//                 <Alert onClose={handleCloseAlert} severity="error" sc={{ width: '100%'}}>
//                     {alert.message}
//                 </Alert>
//             </Snackbar>
//             <Paper>
//                 <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid black', }} spacing={2}>
//                     <Grid item xs={2} sm={2}>
//                     <Typography variant="h6" align="left">

//                     </Typography>
//                     </Grid>

//                     {/* navigazione mesi e griglia dei giorni */}
//                     <Grid item xs={10} sm={10}>
//                         <Grid container justifyContent="flex-start" alignItems="center" >
//                         <Button sx={{ color:"#ffb800"}} onClick={handlePrevMese}>{"<"}</Button>
//                         <Typography variant="h6">
//                             {meseNumero.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
//                         </Typography>
//                         <Button sx={{ color:"#ffb800"}} onClick={handleSuccMese}>{">"}</Button>
//                         </Grid>
//                         {rendergiornoSquares()}
//                         </Grid>
//                     </Grid>

//                     <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" spacing={2}> 
//                     {Object.values(progettoUnivoco).map((progetto, index) => (
//                         <React.Fragment key={index}>
//                         <Grid item xs={2} sm={2} sx={{  borderBottom: '1px solid black',}}>
//                             <Typography variant="h6" align="left" fontSize="17px">
//                             {progetto.description}
//                             </Typography>
//                         </Grid>
//                         <Grid item xs={10} sm={10} sx={{ borderBottom: '1px solid black',  }}>
//                             {rendergiornoBox(progetto)}
//                         </Grid>
//                         </React.Fragment>
//                     ))}
//                     </Grid>

//                     <Grid>
//                     <Typography variant="h6" align="left" style={{ marginTop: '30px', marginLeft: '16px' }}>
//                             Totale: { calcolaOreTotali()}
//                     </Typography>

//                     </Grid>


//                     <Grid container marginTop={5} justifyContent="center" alignItems="center" gap={10} spacing={2}>
//                         <BackButton />
//                         <SaveButton onSubmit={handleSubmit} buttonText="Invia" />
//                     </Grid>
//             </Paper>

//             {progettoSelezionato && progettoSelezionato.description === 'Ferie, Permessi e Malattia' ? (
//                 <Dialog opne={modalOpen} onClose={handleCloseModal}>
//                     <DialogContent>
//                         <Typography sx={{ marginBottom: '20px'}}>
//                             Modifica Permesso per il Giorno:
//                             {giornoSelezionato 
//                                 ? ` ${giornoSelezionato.getDate().toString().padStart(2, '0')}/${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}/${giornoSelezionato.getFullYear()}`
//                                 : ''}
//                         </Typography>
//                         <Grid container spacing={2}>
//                         {/* Prima riga */}
//                             <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
//                             <TextField
//                                 fullWidth
//                                 value={progettoSelezionato ? progettoSelezionato.description : ""} 
//                                 InputLabelProps={{
//                                     shrink: true, 
//                                 }}
//                                 disabled 
//                                 />
//                                 </Grid>
//                                 <Grid item xs={3}>
//                                 <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                     checked={ferieChecked}
//                                     onChange={handleFerieChange}
//                                     name="ferie"
//                                     sx={{
//                                         '&.Mui-checked': {
//                                         color: '#ffb800',
//                                         },
//                                     }}
//                                     />
//                                 }
//                                 label="Ferie"
//                                 />
//                             </Grid>
//                             <Grid item xs={3}>
//                             <FormControlLabel
//                             control={
//                                 <Checkbox
//                                 checked={malattiaChecked}
//                                 onChange={handleMalattiaChange}
//                                 name="malattia"
//                                 sx={{
//                                     '&.Mui-checked': {
//                                     color: '#ffb800', 
//                                     },
//                                 }}
//                                 />
//                             }
//                             label="Malattia"
//                             />
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControlLabel
//                             control={
//                                 <Checkbox
//                                 checked={permessoChecked}
//                                 onChange={handlePermessoChange}
//                                 name="permesso"
//                                 sx={{
//                                     '&.Mui-checked': {
//                                     color: '#ffb800', 
//                                     },
//                                 }}
//                                 />
//                             }
//                             label="Permesso"
//                             />
//                         </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 label="Ore Permesso"
//                                 name="orePermesso"
//                                 value={orePermesso}
//                                 onChange={(e) => setOrePermesso(e.target.value)} 
//                                 />
//                             </Grid>
//                             {/* Seconda riga */}
//                             <Grid item xs={6}>
//                             <TextField
//                         fullWidth
//                         type="datetime-local"
//                         label="Data Inizio"
//                         name="data"
//                         disabled
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         value={giornoSelezionato 
//                             ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}T00:00`
//                             : ''}
//                             onChange={(e) => setDate(e.target.value)}
//                             />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 type="datetime-local"
//                                 label="Data Fine"
//                                 name="dataFinePeriodo"
//                                 onChange={(e) => setDataFinePeriodo(e.target.value)}
//                                 InputLabelProps={{
//                                     shrink: true,
//                                 }}
//                                 />
//                             </Grid>
//                              {/* Terza riga */}
//                             <Grid item xs={6}>
//                             <TextField
//                             fullWidth
//                             label="Ore"
//                             name="ore"
//                             type="number"
//                             value={oreOrdinarie}  
//                         onChange={(e) => setOreOrdinarie(e.target.value)}
//                         />
//                             </Grid>
//                             </Grid>
//                         </DialogContent>
//                         <DialogActions>
//                         <Button
//                                 color="primary"
//                                 onClick={handleCloseModal}
//                                 style={{
//                                 backgroundColor: "black",
//                                 color: "white",
//                                 "&:hover": {
//                                     backgroundColor: "black",
//                                     transform: "scale(1.05)",
//                                 },
//                                 }}
//                             >
//                                 Indietro
//                             </Button>
                        
//                                 <Button
//                                 color="primary"
//                                 variant="contained"
//                                 onClick={handleSubmitModal}

//                                 style={{
//                                     backgroundColor: "#fbb800",
//                                     color: "black",
//                                     fontWeight: "bold",
//                                     "&:hover": {
//                                     backgroundColor: "#fbb800",
//                                     color: "black",
//                                     transform: "scale(1.05)",
//                                     },
//                                 }}
//                                 >
//                                 Salva
//                                 </Button>
//                     </DialogActions>
//                     </Dialog>






//                         ) : (


//                             <Dialog open={modalOpen} onClose={handleCloseModal}>
//                             <DialogContent>
//                                 <Typography sx={{marginBottom: "20px"}}>
//                                 Modifica Permesso per il Giorno: 
//                                 {giornoSelezionato 
//                                     ? ` ${giornoSelezionato.getDate().toString().padStart(2, '0')}/${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}/${giornoSelezionato.getFullYear()}`
//                                     : ''}
//                                 </Typography>
//                                 <Grid container spacing={2}>
//                                 {/* Prima riga */}
//                                 <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
//                                 <TextField
//                                 fullWidth
//                                 value={progettoSelezionato ? progettoSelezionato.description : ""} 
//                                 InputLabelProps={{
//                                     shrink: true, 
//                                 }}
//                                 disabled 
//                                 />
//                                 </Grid>
//                                  {/* Seconda riga */}
//                                 <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 type="datetime-local"
//                                 label="Data Inizio"
//                                 name="data"
//                                 disabled
//                                 InputLabelProps={{
//                                     shrink: true,
//                                 }}
//                                 value={giornoSelezionato 
//                                     ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}T00:00`
//                                     : ''}
//                                 onChange={(e) => setDate(e.target.value)}
//                                 />
//                                 </Grid>
//                                 <Grid item xs={6}>
//                                     <TextField
//                                     fullWidth
//                                     type="datetime-local"
//                                     label="Data Fine"
//                                     name="dataFinePeriodo"
//                                     onChange={(e) => setDataFinePeriodo(e.target.value)}
//                                     InputLabelProps={{
//                                         shrink: true,
//                                     }}
//                                     />
//                                 </Grid>
//                                 {/* Terza riga */}

//                                 <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 label="Ore"
//                                 name="ore"
//                                 type="number"
//                                 value={oreOrdinarie}  
//                                 onChange={(e) => setOreOrdinarie(e.target.value)}
//                             />
//                                 </Grid>
//                                 <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 label="Straordinario (18:00 - 22:00)"
//                                 name="oreStraordinario"
//                                 value={oreStraordinario}
//                                 onChange={(e) => setOreStraordinario(e.target.value)} 
//                                 />
//                             </Grid>

//                             <Grid item xs={6}>
//                                 <TextField
//                                 fullWidth
//                                 label="Straord. Nott. (22:00 - 06:00)"
//                                 name="oreNotturno"
//                                 value={oreNotturno}
//                                 onChange={(e) => setOreNotturno(e.target.value)} 
//                                 />
//                             </Grid>
//                             </Grid>
//                             </DialogContent>
//                             <DialogActions>
//                             <Button
//                                 color="primary"
//                                 onClick={handleCloseModal}
//                                 style={{
//                                 backgroundColor: "black",
//                                 color: "white",
//                                 "&:hover": {
//                                     backgroundColor: "black",
//                                     transform: "scale(1.05)",
//                                 },
//                                 }}
//                             >
//                                 Indietro
//                             </Button>
                        
//                                 <Button
//                                 color="primary"
//                                 variant="contained"
//                                 onClick={handleSubmitModal}

//                                 style={{
//                                     backgroundColor: "#fbb800",
//                                     color: "black",
//                                     fontWeight: "bold",
//                                     "&:hover": {
//                                     backgroundColor: "#fbb800",
//                                     color: "black",
//                                     transform: "scale(1.05)",
//                                     },
//                                 }}
//                                 >
//                                 Salva
//                                 </Button>
//                     </DialogActions>
//                     </Dialog>
//             )}
//         </Box>
//     );
// };
// export default TimesheetComponent2;