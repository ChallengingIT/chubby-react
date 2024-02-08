import React, { useEffect, useState } from 'react';
import { 
Dialog, 
Paper, 
Grid, 
Button, 
Typography, 
Box, 
DialogContent, 
TextField, 
DialogActions, 
FormControlLabel, 
Checkbox, 
Alert,
Snackbar,
} from '@mui/material';
import BackButton from '../../components/button/BackButton';
import SaveButton from '../../components/button/SaveButton';
import axios      from 'axios';

const UserTimesheetComponent2 = ({ timesheetData }) => {

    const [ meseCorrente,           setMeseCorrente               ] = useState(new Date()); //con new Date() me lo crea come anno/mese/giorno e l'ora per intero
    const [ annoCorrente,           setAnnoCorrente               ] = useState('');
    const [ meseNumero,             setMeseNumero                 ] = useState('');
    const [ annoNumero,             setAnnoNumero                 ] = useState('');
    const [ progettoUnivoco,        setProgettoUnivoco            ] = useState({});
    const [ datiTimesheet,          setDatiTimesheet              ] = useState([]);
    const [ primoTimesheet,         setPrimoTimesheet             ] = useState([]);
    const [ alert,                  setAlert                      ] = useState({ open: false, message: '' });
    const [ modalOpen,              setModalOpen                  ] = useState(false);
    const [ giornoSelezionato,      setGiornoSelezionato          ] = useState(null);
    const [ datiProgetti,           setDatiProgetti               ] = useState({ progetti: [] });
    const [ progettoSelezionato,    setProgettoSelezionato        ] = useState(null);
    const [ meseInviato,            setMeseInviato                ] = useState(false);


    //dati da inviare
    const [ orePermesso,            setOrePermesso                ] = useState('');
    const [ date,                   setDate                       ] = useState('');
    const [ dataFinePeriodo,        setDataFinePeriodo            ] = useState('');
    const [ oreOrdinarie,           setOreOrdinarie               ] = useState('');
    const [ ferieChecked,           setFerieChecked               ] = useState(false);
    const [ malattiaChecked,        setMalattiaChecked            ] = useState(false);
    const [ permessoChecked,        setPermessoChecked            ] = useState(false);
    const [ oreStraordinario,       setOreStraordinario           ] = useState('');
    const [ oreNotturno,            setOreNotturno                ] = useState('');
    const [ ore,                    setOre                        ] = useState('');


     // Recupera l'accessToken da localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;
    const username = user?.username;


    const headers = {
    Authorization: `Bearer ${accessToken}`
    };

    const requestParams = {
        username: username
    };





// solo quando il componente viene montato prende il mese e l'anno corrente di sistema e lo setta in meseCorrente e annoCorrente
    useEffect(() => {
        const date = new Date();
        setMeseCorrente(date.getMonth() + 1); //+1 proprio perchè partono da 0
        setAnnoCorrente(date.getFullYear());
    }, [meseNumero, annoNumero]);

//solo quando il componente viene montato effettua la chiamata per prendere i dati del mese e dell'anno corrente
    useEffect(() => {
        const date = new Date();
        const mese = date.getMonth() + 1; // Gennaio è 0, quindi aggiungiamo 1
        const anno = date.getFullYear();

        setMeseCorrente(mese);
        setAnnoCorrente(anno);
        setMeseNumero(mese.toString());
        setAnnoNumero(anno.toString());

        axios.get(`http://89.46.196.60:8443/timesheet/react/user/${anno}/${mese}`, {
            headers: headers,
            params: requestParams
        })
            .then(response => {
            const timesheetConId = response.data.mese.days.map((timesheet) => ({...timesheet}));
                // Crea un oggetto che raggruppa le ore per progetto e giorno
                const projectsMap = timesheetConId.reduce((acc, current) => {
                    const idProgetto = current.progetto.id;
                    if (!acc[idProgetto]) {
                        acc[idProgetto] = {
                            description: current.progetto.description,
                            id: current.progetto.id,
                            giorni: {}
                        };
                    }
                    acc[idProgetto].giorni[current.giorno] = {
                        data: current.data,
                        oreOrdinarie: current.oreOrdinarie || 0,
                        orePermesso: current.orePermesso || 0,
                        oreStraordinarie: current.oreStraordinarie || 0,
                        oreStraordinarieNotturne: current.oreStraordinarieNotturne || 0,
                        ferie: current.ferie,
                        malattia: current.malattia,
                        permesso: current.permesso,
                        festivo: current.festivo,
                        id: current.id,
                        oreTotali: current.oreTotali || 0,
                    };
                    return acc;
                }, {});
                setProgettoUnivoco(projectsMap);
                
                setDatiTimesheet(response.data);
            })
            .catch(error => {
                console.error('Errore durante la richiesta Axios:', error);
            });
    }, []);

    useEffect(() => {
    }, [datiTimesheet, progettoUnivoco]);



    //chiamata per avere il primo timesheet dell'utente
    useEffect(() => {
        const fetchPrimoTimesheet = async () => {
            try {
                const response = await axios.get(`http://89.46.196.60:8443/timesheet/react/user/primo`, {
                    headers: headers,
                    params: requestParams
                });
                const [mese, anno] = response.data.split('-').map(Number);
                setPrimoTimesheet(new Date(anno, mese -1, 1)); // -1 perchè i mesi in javascript iniziano da 0
            } catch(error) {
                console.error("Errore durante il recupero dei dati: ", error);
            }
        };
        fetchPrimoTimesheet();
    });



     // Funzione per controllare se una data è precedente a un'altra
     const mesePrimoTimesheet = (anno, mese, targetDate) => {
        const dataDaControllare = new Date(anno, mese - 1, 1); // -1 perché i mesi in JS partono da 0
        return dataDaControllare < targetDate;
    };


//chiamata per passare al mese o anno precedente
    const handlePrevMese = () => {
        let nuovoAnno = parseInt(annoNumero, 10);
        let nuovoMese = parseInt(meseNumero, 10) - 1;
    
        if (nuovoMese === 0) {
            nuovoMese = 12;
            nuovoAnno -= 1;
        }


        const primoTimesheetDate = new Date(primoTimesheet);
        if (mesePrimoTimesheet(nuovoAnno, nuovoMese, primoTimesheetDate)) {
            setAlert({ open: true, message: "Non è possibile navigare ai mesi precedenti il primo timesheet disponibile" });
            return;
        }
    
        axios.get(`http://89.46.196.60:8443/timesheet/react/user/precedente/${annoNumero}/${meseNumero}`, {
            headers: headers,
            params: requestParams
        })
            .then(response => {
                const timesheetConId = response.data.mese.days.map((timesheet) => ({...timesheet}));
                // Crea un oggetto che raggruppa le ore per progetto e giorno
                const projectsMap = timesheetConId.reduce((acc, current) => {
                    if (!current.progetto) {
                        return acc;
                    }
                    const idProgetto = current.progetto.id;
                    if (!acc[idProgetto]) {
                        acc[idProgetto] = {
                            description: current.progetto.description,
                            id: current.progetto.id,
                            giorni: {}
                        };
                    }
                    acc[idProgetto].giorni[current.giorno] = {
                        data: current.data,
                        oreOrdinarie: current.oreOrdinarie || 0,
                        orePermesso: current.orePermesso || 0,
                        oreStraordinarie: current.oreStraordinarie || 0,
                        oreStraordinarieNotturne: current.oreStraordinarieNotturne || 0,
                        ferie: current.ferie,
                        malattia: current.malattia,
                        permesso: current.permesso,
                        festivo: current.festivo,
                        id: current.id,
                        oreTotali: current.oreTotali || 0,
                    };
                    return acc;
                }, {});
                setProgettoUnivoco(projectsMap);
                
                setDatiTimesheet(response.data);
                setAnnoNumero(nuovoAnno.toString());
                setMeseNumero(nuovoMese.toString());
                if (response.data.meseInviato) {
                    setMeseInviato(true);
                } else {
                    setMeseInviato(false);
                }
            })
            .catch(error => {
                console.error('Errore durante la richiesta Axios:', error);
            });
    };

//chiamata per passare al mese o all'anno successivo
    const handleSuccMese = () => {
        let nuovoAnno = parseInt(annoNumero, 10);
        let nuovoMese = parseInt(meseNumero, 10) + 1;
    
        if (nuovoMese === 13) {
            nuovoMese = 1;
            nuovoAnno += 1;
        }
    
        axios.get(`http://89.46.196.60:8443/timesheet/react/user/successivo/${annoNumero}/${meseNumero}`, {
            headers: headers,
            params: requestParams
        })
            .then(response => {
                const timesheetConId = response.data.mese.days.map((timesheet) => ({...timesheet}));
                // Crea un oggetto che raggruppa le ore per progetto e giorno
                const projectsMap = timesheetConId.reduce((acc, current) => {
                    if (!current.progetto) {
                        return acc;
                    }
                    const idProgetto = current.progetto.id;
                    if (!acc[idProgetto]) {
                        acc[idProgetto] = {
                            description: current.progetto.description,
                            id: current.progetto.id,
                            giorni: {}
                        };
                    }
                    acc[idProgetto].giorni[current.giorno] = {
                        data: current.data,
                        oreOrdinarie: current.oreOrdinarie || 0,
                        orePermesso: current.orePermesso || 0,
                        oreStraordinarie: current.oreStraordinarie || 0,
                        oreStraordinarieNotturne: current.oreStraordinarieNotturne || 0,
                        ferie: current.ferie,
                        malattia: current.malattia,
                        permesso: current.permesso,
                        festivo: current.festivo,
                        id: current.id,
                        oreTotali: current.oreTotali || 0,
                    };
                    return acc;
                }, {});
                setProgettoUnivoco(projectsMap);
                setDatiTimesheet(response.data);    
                setAnnoNumero(nuovoAnno.toString());
                setMeseNumero(nuovoMese.toString());
                if (response.data.meseInviato) {
                    setMeseInviato(true);
                } else {
                    setMeseInviato(false);
                }
            })
            .catch(error => {
                console.error('Errore durante la richiesta Axios:', error);
            });
    };





    useEffect(() => {
        if (ferieChecked || malattiaChecked) {
            setOreOrdinarie('8');
        }
        else if (permessoChecked) {
            setOreOrdinarie('0');
        }
        else {
            setOreOrdinarie('0'); 
        }
        }, [ferieChecked, malattiaChecked, permessoChecked]); 
    

        const handleFerieChange = (event) => {
            setFerieChecked(event.target.checked);
            if (event.target.checked) {
                setMalattiaChecked(false);
                setPermessoChecked(false);
            }
        };
        
        const handlePermessoChange = (event) => {
            setPermessoChecked(event.target.checked);
            if (event.target.checked) {
                setMalattiaChecked(false);
                setFerieChecked(false);
            }
        };
        
        const handleMalattiaChange = (event) => {
            setMalattiaChecked(event.target.checked);
            if (event.target.checked) {
                setFerieChecked(false);
                setPermessoChecked(false);
            }
        };
        

        const handleCloseAlert = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({ ...alert, open: false });
        };


        //per aprire il modal per ogni giorno
        const handleDayClick = (giorno, progetto) => {
            setGiornoSelezionato(new Date(annoNumero, meseNumero - 1, giorno)); 
            setProgettoSelezionato(progetto); 
            setModalOpen(true); 
        const datiGiorno = progetto.giorni[giorno];
        if (datiGiorno) {
            setOrePermesso(datiGiorno.orePermesso || '');
            setOreOrdinarie(datiGiorno.oreOrdinarie || '');
            setOreStraordinario(datiGiorno.oreStraordinarie || '');
            setOreNotturno(datiGiorno.oreStraordinarieNotturne || '');
            setFerieChecked(datiGiorno.ferie || false);
            setMalattiaChecked(datiGiorno.malattia || false);
            setPermessoChecked(datiGiorno.permesso || false);
        } else {
            setOrePermesso('');
            setOreOrdinarie('');
            setOreStraordinario('');
            setOreNotturno('');
            setFerieChecked(false);
            setMalattiaChecked(false);
            setPermessoChecked(false);
        }
        };

        const handleCloseModal = () => {
            setModalOpen(false);
            setOreOrdinarie(''); 
            setFerieChecked(false);
            setMalattiaChecked(false);
            setPermessoChecked(false);
        };
        
        useEffect(() => {
            if (!modalOpen) {
                setGiornoSelezionato(null);
            }
        }, [modalOpen]);


          //invio dei dati del modal, non di tutto il timesheet
        const handleSubmitModal = async () => {
            const idProgetto = progettoSelezionato ? progettoSelezionato.id : null;
            const selectedDateString = giornoSelezionato
            ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}`
            : '';

            const datiDaInviare = {
            progetto: idProgetto,
            permesso: permessoChecked,
            malattia: malattiaChecked,
            ferie: ferieChecked,
            data: selectedDateString + 'T00:00',
            dataFinePeriodo: dataFinePeriodo || null,
            orePermesso: orePermesso || null, 
            ore: oreOrdinarie
            };

            try {
            const response = await axios.post(`http://89.46.196.60:8443/timesheet/react/user/aggiorna/${annoNumero}/${meseNumero}`, datiDaInviare, {
                headers: headers,
                params: requestParams
            });
            if (response.data === "OK") {
            setModalOpen(false); 
            // setDatiTimesheet(response.data);
            // Aggiorna i dati del timesheet
            fetchTimesheetData();
            } else {
                setAlert({ open: true, message: response.data });
            }
            } catch (error) {
            console.error("Errore durante l'invio dei dati: ", error);
            setAlert({ open: true, message: 'Errore durante il salvataggio.' });
            }
        };


        // Funzione per richiedere i dati aggiornati del timesheet
        const fetchTimesheetData = async () => {
            try {
                const response = await axios.get(`http://89.46.196.60:8443/timesheet/react/user/${annoNumero}/${meseNumero}`, {
                    headers: headers,
                    params: requestParams
                });
                const timesheetConId = response.data.mese.days.map((timesheet) => ({...timesheet}));
                const projectsMap = timesheetConId.reduce((acc, current) => {
                    const idProgetto = current.progetto.id;
                    if (!acc[idProgetto]) {
                        acc[idProgetto] = {
                            description: current.progetto.description,
                            id: current.progetto.id,
                            giorni: {}
                        };
                    }
                    acc[idProgetto].giorni[current.giorno] = {
                        data: current.data,
                        oreOrdinarie: current.oreOrdinarie || 0,
                        orePermesso: current.orePermesso || 0,
                        oreStraordinarie: current.oreStraordinarie || 0,
                        oreStraordinarieNotturne: current.oreStraordinarieNotturne || 0,
                        ferie: current.ferie,
                        malattia: current.malattia,
                        permesso: current.permesso,
                        festivo: current.festivo,
                        id: current.id,
                        oreTotali: current.oreTotali || 0,
                    };
                    return acc;
                }, {});
                setProgettoUnivoco(projectsMap);
                setDatiTimesheet(response.data);
            } catch (error) {
                console.error('Errore durante il fetch dei dati aggiornati:', error);
            }
        };


         //resetta il modal di ferie permessi e malattie
        const handleResetModalFPM = async () => {

            const idProgetto = progettoSelezionato ? progettoSelezionato.id : null;
            const selectedDateString = giornoSelezionato
            ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}`
            : '';

                const datiDaInviare = {
                    progetto: idProgetto,
                    permesso: false,
                    malattia: false,
                    ferie: false,
                    data: selectedDateString + 'T00:00',
                    dataFinePeriodo: dataFinePeriodo || null,
                    orePermesso: 0,
                    ore: 0
                    };
            
        
            try {
                const response = await axios.post(`http://89.46.196.60:8443/timesheet/react/user/cancella/${annoNumero}/${meseNumero}`, datiDaInviare, {
                    headers: headers,
                    params: requestParams
                });
                setModalOpen(false); 
                setDatiTimesheet(response.data);
                fetchTimesheetData();
            } catch (error) {
                console.error("Errore durante l'invio dei dati: ", error);
            }
        };


        const giorniSettimana = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
        const giorniFestivi =   ['01-01', '01-06', '04-01', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];
        const lunediPasqua =    [ "2025-04-21", "2026-04-06", "2027-03-29", "2028-04-17", "2029-04-02", "2030-04-22", "2031-04-14", "2032-03-29", "2033-04-18", "2034-04-10" ]; 
        const nomiMesi =        ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];


        const isLunediPasqua = (giorno, mese, anno) => {
            const dataFormattata = `${anno}-${mese.toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
            return lunediPasqua.includes(dataFormattata);
        };
        


        const festivi = (giorno, mese) => {
            const dataFormattata = `${mese.toString().padStart(2, '0')}-${giorno.toString().padStart(2, '0')}`;
            return giorniFestivi.includes(dataFormattata);
        };

        const giorniDelMese = (mese, anno) => {
        return new Date(anno, mese + 1, 0).getDate();
        };

        const primoGiornoSettimana = ( mese, anno ) => {
        return new Date(anno, mese, 1).getDay();
        };

        //chiamata per inviare tutto il timesheet
        const handleSubmit = async () => {
            try {
                const url = `http://89.46.196.60:8443/timesheet/react/user/salva/${annoNumero}/${meseNumero}`;
                const response = await axios.post(url, { timesheetData });
                setAlert({ open: true, message: response.data });
            } catch (error) {
                console.error("Errore durante l'invio dei dati del timesheet: ", error);
            }
        };

        




const renderDaySquares = () => {
    // Calcola il numero di giorni nel mese corrente
    const giorniTotali = new Date(annoNumero, meseNumero, 0).getDate();

    // Crea un array di elementi JSX per ogni giorno del mese
    const giorni = Array.from({ length: giorniTotali }, (_, i) => {
        // Calcola il giorno della settimana per ogni giorno del mese
        const giornoSettimana = new Date(annoNumero, meseNumero - 1, i + 1).getDay();
        const inizialeGiornoSettimana = giorniSettimana[giornoSettimana];
        const isSabatoODomenica = giornoSettimana === 0 || giornoSettimana === 6;
        const isGiornoFestivo = festivi(i + 1, meseNumero) || isLunediPasqua(i + 1, meseNumero, annoNumero);
        

        const giornoStyle = isSabatoODomenica || isGiornoFestivo
            ? { backgroundColor: '#14D928', color: 'white' }
            : { backgroundColor: 'grey.200', color: 'black' };

        return (
            <Grid item key={i} sx={{ padding: 0, margin: 0,  width: '35px', height: '45px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        borderBottom: '0.8px solid black',
                        ...giornoStyle
                    }}
                >
                    <Typography variant="body1">{i + 1}</Typography>
                    <Typography variant="caption">{inizialeGiornoSettimana}</Typography>
                </Box>
            </Grid>
        );
    });

    return <Grid container spacing={0} alignItems="center" justify="center">{giorni}</Grid>;
};



//render per i rettangoli dei progetti
const renderDayBox = (progetto) => {
    // Calcola il numero di giorni nel mese corrente
    const giorniTotali = new Date(annoNumero, meseNumero, 0).getDate();

    // Crea un array di elementi JSX per ogni giorno del mese
    const giorni = Array.from({ length: giorniTotali }, (_, i) => {
        // Calcola il giorno della settimana per ogni giorno del mese
        const giorno = i + 1;
        const giornoSettimana = new Date(annoNumero, meseNumero - 1, i + 1).getDay();
        const isSabatoODomenica = giornoSettimana === 0 || giornoSettimana === 6;
        const isGiornoFestivo = festivi(i + 1, meseNumero) || isLunediPasqua(i + 1, meseNumero, annoNumero);
        
        const oreTotaliGiorno = progetto.giorni[giorno] ? progetto.giorni[giorno].oreTotali : 0;
        const datiGiorno = progetto.giorni[giorno];
        // Determina il colore in base allo stato del giorno
        let colore;
        if (isSabatoODomenica || isGiornoFestivo) {
            colore = 'white';
        } else {
        if (datiGiorno && datiGiorno.ferie) {
            colore = 'red';
        } else if (datiGiorno && datiGiorno.malattia) {
            colore = 'blue';
        } else if (datiGiorno && datiGiorno.permesso) {
            colore = 'green';
        } else {
            colore = 'black';
        }
    }
        


        const giornoStyle = isSabatoODomenica || isGiornoFestivo
            ? { backgroundColor: '#14D928', color: 'white' }
            : { backgroundColor: 'grey.200', color: 'black' };
            

        return (
            <Grid item key={i} sx={{ padding: 0, margin: 0,  width: '35px', height: '45px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        borderBottom: '0.1px solid black',
                        ...giornoStyle,
                        ':hover': {
                            backgroundColor: "#14D928",
                            cursor: 'pointer',
                        }
                    }}
                    onClick={() => handleDayClick(giorno, progetto)}
                >
                    <Typography variant="body2" style={{ color: colore, fontWeight: 'bold' }}>{oreTotaliGiorno}</Typography>
                </Box>
            </Grid>
        );
    });

    return <Grid container spacing={0} alignItems="center" justify="center">{giorni}</Grid>;
};


const progettiArray = Object.values(progettoUnivoco);


    return (
        <Box
        sx={{
            width: '94%',
            margin: 'auto',
            borderRadius: '40px',
            boxShadow: '10px 10px 10px rgba(0, 0, 0.5)',
            overflow: 'hidden',
            
        }}>

            {/* Snackbar per visualizzare l'alert */}
            <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>

             {/* Componente per selezionare i mesi */}

            <Paper>
            <Grid container display="flex" justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" borderBottom="1px solid black" minWidth="90%" spacing={2}>
            <Grid item xs={2} sm={2} >
            <Typography variant="h6" align="left">
            </Typography>
            </Grid>

      {/* Navigazione Mesi e Griglia dei giorni */}
            <Grid item xs={10} sm={10}>
                <Grid container justifyContent="flex-start" alignItems="center" marginBottom="20px" marginTop="20px" >
                <Button sx={{ color:"#14D928"}} onClick={handlePrevMese}>{"<"}</Button>
                <Typography variant="h6">{`${nomiMesi[parseInt(meseNumero, 10) - 1]}  ${annoNumero}`}</Typography>

                <Button sx={{ color:"#14D928"}} onClick={handleSuccMese}>{">"}</Button>
                </Grid>
                {renderDaySquares()}
            </Grid>
            


            {progettiArray.map((progetto, index) => (
                <Grid container key={index} justifyContent="flex-start" alignItems="center" >
                    <Grid item xs={2} sm={2}>
                        <Typography variant="body1">
                            {progetto.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={10} sm={10}>
                        <Grid container justifyContent="flex-start" alignItems="center" marginLeft="16px" >
                        {renderDayBox(progetto)}      
                        </Grid>
                    </Grid>
                </Grid>
            ))}
<Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '30px', marginLeft: '66px', marginBottom: '30px' }}>
    <Grid item>
        <Typography variant="h6">Totale: {datiTimesheet.totaleOre || 0}</Typography>
    </Grid>
    <Grid item>
        <Grid container alignItems="center" sx={{marginRight: "20px"}}>
            <Box sx={{ width: '20px', height: '20px', backgroundColor: 'red', marginRight: '10px', display: 'inline-block' }} />
            <Typography variant="body2" style={{ display: 'inline' }}>Ferie</Typography>
            <Box sx={{ width: '20px', height: '20px', backgroundColor: 'blue', marginRight: '10px', marginLeft: '20px', display: 'inline-block' }} />
            <Typography variant="body2" style={{ display: 'inline' }}>Malattia</Typography>
            <Box sx={{ width: '20px', height: '20px', backgroundColor: 'green', marginRight: '10px', marginLeft: '20px', display: 'inline-block' }} />
            <Typography variant="body2" style={{ display: 'inline' }}>Permesso</Typography>
        </Grid>
    </Grid>
</Grid>


            <Grid container  justifyContent="center" alignItems="center" gap={10} spacing={2}>
                <BackButton />
                {
                !meseInviato && (
                <SaveButton onSubmit={handleSubmit} buttonText="Invia" />
                )
                }
            </Grid>
        </Grid>
        </Paper>





        {/* modal apertura popup per i giorni */}
        {progettoSelezionato && progettoSelezionato.description === "Ferie, Permessi e Malattia" ? (
    <Dialog open={modalOpen} onClose={handleCloseModal}>
<DialogContent>
    <Typography sx={{marginBottom: "20px"}}>
    Modifica Permesso per il Giorno: 
    {giornoSelezionato 
        ? ` ${giornoSelezionato.getDate().toString().padStart(2, '0')}/${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}/${giornoSelezionato.getFullYear()}`
        : ''}
    </Typography>

    <Grid container spacing={2}>
      {/* Prima riga */}
      <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
    <TextField
fullWidth
  // label={selectedProject ? selectedProject.description : "Progetto"}
value={progettoSelezionato ? progettoSelezionato.description : ""} 
InputLabelProps={{
    shrink: true, 
}}
disabled 
/>
</Grid>
    <Grid item xs={3}>
    <FormControlLabel
    control={
        <Checkbox
        checked={ferieChecked}
        onChange={handleFerieChange}
        name="ferie"
        sx={{
            '&.Mui-checked': {
            color: '#14D928',
            },
        }}
        />
    }
    label="Ferie"
    />
</Grid>
<Grid item xs={3}>
    <FormControlLabel
    control={
        <Checkbox
        checked={malattiaChecked}
        onChange={handleMalattiaChange}
        name="malattia"
        sx={{
            '&.Mui-checked': {
            color: '#14D928', 
            },
        }}
        />
    }
    label="Malattia"
    />
</Grid>
<Grid item xs={3}>
    <FormControlLabel
    control={
        <Checkbox
        checked={permessoChecked}
        onChange={handlePermessoChange}
        name="permesso"
        sx={{
            '&.Mui-checked': {
            color: '#14D928', 
            },
        }}
        />
    }
    label="Permesso"
    />
</Grid>
    <Grid item xs={6}>
        <TextField
        fullWidth
        label="Ore Permesso"
        name="orePermesso"
        value={orePermesso}
        onChange={(e) => setOrePermesso(e.target.value)} 
        />
    </Grid>

      {/* Seconda riga */}
    <Grid item xs={6}>
    <TextField
        fullWidth
        type="datetime-local"
        label="Data Inizio"
        name="data"
        disabled
        InputLabelProps={{
    shrink: true,
}}
    value={giornoSelezionato 
    ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}T00:00`
    : ''}
    onChange={(e) => setDate(e.target.value)}
/>

    </Grid>
    <Grid item xs={6}>
        <TextField
        fullWidth
        type="datetime-local"
        label="Data Fine"
        name="dataFinePeriodo"
        onChange={(e) => setDataFinePeriodo(e.target.value)}
        InputLabelProps={{
            shrink: true,
        }}
        />
    </Grid>

      {/* Terza riga */}
    <Grid item xs={6}>
    <TextField
    fullWidth
    label="Ore"
    name="ore"
    type="number"
    value={oreOrdinarie}  
onChange={(e) => setOreOrdinarie(e.target.value)}
/>
    </Grid>
    </Grid>
</DialogContent>
<DialogActions>
<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>

<Button
            color="primary"
            onClick={handleResetModalFPM}
            sx={{
                fontWeight: "bold",
                backgroundColor: "black",
                marginLeft: '20px',
                color: "white",
                "&:hover": {
                    backgroundColor: "red",
                    color: 'black',
                    transform: "scale(1.05)",
                },
            }}
        >
            Cancella
        </Button>
        </Box>
<Button
            color="primary"
            onClick={handleCloseModal}
            sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
            },
            }}
        >
            Indietro
        </Button>
        {
                !meseInviato && (
            <Button
            color="primary"
            variant="contained"
            onClick={handleSubmitModal}

            sx={{
                backgroundColor: "#14D928",
                color: "black",
                fontWeight: "bold",
                "&:hover": {
                backgroundColor: "#14D928",
                color: "black",
                transform: "scale(1.05)",
                },
            }}
            >
            Salva
            </Button>
                )}
</DialogActions>
</Dialog>






) : (






<Dialog open={modalOpen} onClose={handleCloseModal}>
<DialogContent>
    <Typography sx={{marginBottom: "20px"}}>
    Modifica Permesso per il Giorno: 
    {giornoSelezionato 
        ? ` ${giornoSelezionato.getDate().toString().padStart(2, '0')}/${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}/${giornoSelezionato.getFullYear()}`
        : ''}
    </Typography>

    <Grid container spacing={2}>
      {/* Prima riga */}
      <Grid item xs={12}> {/* xs={12} significa che occuperà l'intera larghezza */}
    <TextField
fullWidth
  // label={selectedProject ? selectedProject.description : "Progetto"}
value={progettoSelezionato ? progettoSelezionato.description : ""} 
InputLabelProps={{
    shrink: true, 
}}
disabled 
/>
</Grid>


      {/* Seconda riga */}
    <Grid item xs={6}>
    <TextField
fullWidth
type="datetime-local"
label="Data Inizio"
name="data"
disabled
InputLabelProps={{
    shrink: true,}}
    value={giornoSelezionato 
    ? `${giornoSelezionato.getFullYear()}-${(giornoSelezionato.getMonth() + 1).toString().padStart(2, '0')}-${giornoSelezionato.getDate().toString().padStart(2, '0')}T00:00`
    : ''}
    onChange={(e) => setDate(e.target.value)}
/>

    </Grid>
    <Grid item xs={6}>
        <TextField
        fullWidth
        type="datetime-local"
        label="Data Fine"
        name="dataFinePeriodo"
        onChange={(e) => setDataFinePeriodo(e.target.value)}
        InputLabelProps={{
            shrink: true,
        }}
        />
    </Grid>

      {/* Terza riga */}

    <Grid item xs={6}>
    <TextField
    fullWidth
    label="Ore"
    name="ore"
    type="number"
    value={oreOrdinarie}  
    onChange={(e) => setOreOrdinarie(e.target.value)}
    />
    </Grid>


    <Grid item xs={6}>
        <TextField
        fullWidth
        label="Straordinario (18:00 - 22:00)"
        name="oreStraordinario"
        value={oreStraordinario}
        onChange={(e) => setOreStraordinario(e.target.value)} 
        />
    </Grid>

    <Grid item xs={6}>
        <TextField
        fullWidth
        label="Straord. Nott. (22:00 - 06:00)"
        name="oreNotturno"
        value={oreNotturno}
        onChange={(e) => setOreNotturno(e.target.value)} 
        />
    </Grid>


    </Grid>
</DialogContent>
<DialogActions>
<Button
            color="primary"
            onClick={handleCloseModal}
            style={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
        },
            }}
        >
            Indietro
        </Button>
            <Button
            color="primary"
            variant="contained"
            onClick={handleSubmitModal}

            style={{
                backgroundColor: "#14D928",
                color: "black",
                fontWeight: "bold",
                "&:hover": {
                backgroundColor: "#14D928",
                color: "black",
                transform: "scale(1.05)",
                },
            }}
            >
            Salva
            </Button>
</DialogActions>
</Dialog>
)}

        </Box>
    );
};


export default UserTimesheetComponent2;