import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ReportSearchBox from './searchBox/ReportSearchBox';

function ReportComponent() {



  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth(); // Gennaio è 0, Dicembre è 11

    setMeseCorrente(currentMonthIndex + 1); // Imposta il mese corrente (i mesi partono da 1)
    setAnnoCorrente(currentYear); 

  }, []); 


    const [ dipendenti, setDipendenti ] = useState([]);

    const [daysOff, setDaysOff] = useState([]); 
    const [ filteredTimesheet,      setFilteredTimesheet          ] = useState([]);
    const [ meseCorrente,           setMeseCorrente               ] = useState('');
    const [ annoCorrente,           setAnnoCorrente               ] = useState('');
    const [ currentMonth,           setCurrentMonth               ] = useState(new Date());




  useEffect(() => {
    axios.get('http://89.46.67.198/hr/react')
      .then(response => {
        setDipendenti(response.data);
      })
      .catch(error => {
        console.error('errore durante il recupero dei dipendenti!', error);
      });
  }, []);

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  //salvataggio giorni festivi
  const publicHolidays = ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];
  // Funzione per verificare se un giorno è festivo
  const isPublicHoliday = (day, month) => {
    const formattedDate = `${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return publicHolidays.includes(formattedDate);
  };


  const firstDayOfWeek = (month, year) => {
    return new Date(year, month, 1).getDay();
  };


  // Renderizza i quadrati per i giorni
  const renderDaySquares = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfWeek(month, year);
    let dayOfWeek = firstDay;
  
    const days = [];
  
    // Giorni del mese
    for (let day = 1; day <= totalDays; day++) {
      // Controlla se è sabato o domenica
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = isPublicHoliday(day, month);
      const daySquareBgColor = isWeekend || isHoliday ? '#b7b5b5' : 'grey.200';
  
      days.push(
        <Box
          key={day}
          // onClick={() => handleDayClick(day)}
          sx={{
            height: "60px",
            backgroundColor: daySquareBgColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "98%",
            // minWidth: "30px",
            // flexGrow: 1,
          }}
        >
          <Typography>{day}</Typography>
        </Box>
      );
      
      // Aggiorna il giorno della settimana
      dayOfWeek = (dayOfWeek + 1) % 7;
      }
      
      return (
        <Grid item xs>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              overflowX: 'auto', 
              minWidth: "30px",
              width: "98%",
            }}
          >
            {days}
          </Box>
        </Grid>
      );
};




  const renderDayBox = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(month, year);
  
    return (
      <Grid item xs>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap', // Impedisce il passaggio a capo
            overflowX: 'auto', // Permette lo scorrimento orizzontale se necessario
            minWidth: "30px",
            width: "98%",
          }}
        >
          {filteredTimesheet.map((dayData) => {
            const isWeekend = dayData.iniziale === 'S' || dayData.iniziale === 'D'; 
            const isHoliday = dayData.festivo;
            const daySquareBgColor = isWeekend || isHoliday ? '#b7b5b5' : 'grey.200';
  
            return (
              <Box
                key={dayData.id}
                sx={{
                  height: "45px",
                  backgroundColor: daySquareBgColor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "98%",
                  ':hover': {
                    backgroundColor: "#fbb800",
                    cursor: 'pointer',
                  }
                }}
              >
                <Typography>{dayData.oreOrdinarie || 0}</Typography>
              </Box>
            );
          })}
        </Box>
      </Grid>
    );
  };






  return (
    <Box 
        sx={{ width:"95%", margin: "auto", borderRadius: "40px", boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)", overflow: 'hidden' }}>
        <Paper>
            <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid white', backgroundColor: 'black', color: 'white' }} spacing={2}>
                <Grid item xs={2} sm={2} >
                    <Typography variant="h6" align="left">
                    </Typography>
                </Grid>
                </Grid>

                

            <Grid container justifyContent="space-between" alignItems="flex-end" paddingLeft="20px" sx={{ borderBottom: '1px solid black', }} spacing={2}>
            {dipendenti.map((dipendente, index) => (
                    <React.Fragment key={dipendenti.id}>
                        <Grid item xs={2} sm={2} >
                        <Typography variant="h6" align="left" fontSize="14px" sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#F2F2F2' }}>
                                {dipendenti.nome}
                            </Typography>
                        </Grid>
                        <Grid item xs={10} sm={10}>
                            {renderDayBox(dipendenti)}
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Paper>
        

       
    </Box>
);
                            }

export default ReportComponent