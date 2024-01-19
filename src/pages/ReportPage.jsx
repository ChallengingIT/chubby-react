import React, { useState, useEffect }                       from 'react';
import axios                                                from 'axios';
import { getDaysInMonth, isWeekend, format }                from 'date-fns';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { styled }                                           from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: 'black',
    color: 'white',
    borderRight: '1px solid white',
  }));
  
  const FirstRowTableCell = styled(StyledTableCell)({
    backgroundColor: 'black',
    color: 'white',
  });
  
  const OddRow = styled(TableRow)({
    backgroundColor: 'white',
  });
  
  const EvenRow = styled(TableRow)({
    backgroundColor: '#e2e0e0',
  });
  
  const WeekendCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#fc6464', // o qualsiasi altro colore desiderato per i fine settimana
    borderRight: `1px solid ${theme.palette.divider}`,
  }));


const ReportPage = () => {
//   const [year, setYear] = useState(format(new Date(), 'yyyy'));
//   const [month, setMonth] = useState(format(new Date(), 'MM'));

const [ showTable,              setShowTable                        ] = useState(false);
const [ dipendenti,             setDipendenti                       ] = useState([]);
const [ loading,                setLoading                          ] = useState(false);
const [ year,                   setYear                             ] = useState('');
const [ month,                  setMonth                            ] = useState('');
const [ dal,                    setDal                              ] = useState('');
const [ al,                     setAl                               ] = useState('');
const [ page,                   setPage                             ] = useState(0);
const [ rowsPerPage,            setRowsPerPage                      ] = useState(10);


const months = [
    { value: '01', label: 'Gennaio' },
    { value: '02', label: 'Febbraio' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Aprile' },
    { value: '05', label: 'Maggio' },
    { value: '06', label: 'Giugno' },
    { value: '07', label: 'Luglio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Settembre' },
    { value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Dicembre' },
];

const years = Array.from({ length: 2051 - 2021 + 1 }, (_, i) => i + 2021);


const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};


useEffect(() => {
    const fetchEmployees = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:8080/hr/react');
        if (Array.isArray(response.data)) {
            const dipendentiData = response.data.map((dipendenti) => ({
            label: `${dipendenti.nome} ${dipendenti.cognome}`,
            id:dipendenti.id,
            }));
            setDipendenti(dipendentiData);
        }
        console.log("DIPENDENTI CARICATI: ", response.data);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
    setLoading(false);
    };

    fetchEmployees();
}, []);

const handleSearch = async () => {
    if (!year || !month) {
      alert("Per favore, selezionare sia l'anno che il mese.");
      return;
    }
  
    setLoading(true);
    setShowTable(false);
  
    const dalVal = dal || format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
    const alVal = al || format(new Date(year, month - 1, daysInMonth), 'yyyy-MM-dd');
  
    try {
      const response = await axios.get('http://localhost:8080/hr/report/estrai', {
        params: { anno: year, mese: month, dal: dalVal, al: alVal }
      });
      // Gestisci la risposta e aggiorna lo stato dei dipendenti
      setShowTable(true);
      console.log("RISPOSTA DAL SERVER PER: ", response.data);
    } catch (error) {
      console.error('Errore nella chiamata axios:', error);
    } finally {
      setLoading(false);
    }
};

const handleEstraiExcel = async () => {
  const giornoInizio = dal || format(new Date(year, month - 1, 1), 'dd');
  const giornoFine = al || format(new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))), 'dd');
  const url = `http://localhost:8080/hr/report/excel/${year}/${month}/${giornoInizio}/${giornoFine}`

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'blob', 
    });

    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/xls' }));

    const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', "report.xls"); 
      document.body.appendChild(link);
  
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Si è verificato un errore durante il download del file:', error);

    }
  };







const handleReset = () => {
    setYear('');
    setMonth('');
    setDal('');
    setAl('');
    setShowTable(false);
};





const daysInMonth = getDaysInMonth(new Date(parseInt(year), parseInt(month) - 1));
const publicHolidays = ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'];

const isPublicHoliday = (date) => {
    const formattedDate = format(date, 'MM-dd');
    return publicHolidays.includes(formattedDate);
};


return (
    <div>
        <div style={{margin: '20px', backgroundColor: 'white', borderRadius: '20px', width: '50%',   boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)'}}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gap: '20px', alignItems: 'center' }}>
        {/* Search Box */}
        <FormControl variant="outlined" margin="normal" style={{ width: '45%' }}>
  <InputLabel id="year-select-label">Anno</InputLabel>
  <Select
    labelId="year-select-label"
    id="year-select"
    value={year}
    onChange={(e) => setYear(e.target.value)}
    label="Anno"
    displayEmpty
  >
    {/* <MenuItem value="" disabled>Anno</MenuItem> */}
    {years.map((yearOption) => (
      <MenuItem key={yearOption} value={yearOption}>
        {yearOption}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl variant="outlined" margin="normal" style={{ width: '45%' }}>
  <InputLabel id="month-select-label">Mese</InputLabel>
  <Select
    labelId="month-select-label"
    id="month-select"
    value={month}
    onChange={(e) => setMonth(e.target.value)}
    label="Mese"
    displayEmpty
  >
    {/* <MenuItem value="" disabled>Mese</MenuItem> */}
    {months.map((monthOption) => (
      <MenuItem key={monthOption.value} value={monthOption.value}>
        {monthOption.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<Button
            className="button-search"
            variant="contained"
            onClick={handleSearch}
            sx={{
            width: '90px',
            height: "40px",
            backgroundColor: "#ffb800",
            color: "black",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
                    // marginLeft: "20px",
                    // padding: "0.5rem 1rem",
                    // marginBottom: '10px',
            "&:hover": {
                backgroundColor: "#ffb800",
                color: "black",
                transform: "scale(1.05)",
            },
            }}
        >
            Cerca
        </Button>

        

        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', gap: '20px', alignItems: 'center' }}>
        {/* Search Box */}
        <TextField
            label="Dal"
            type="number"
            value={dal}
            onChange={(e) => setDal(e.target.value)}
            variant="outlined"
            margin="normal"
            style={{ width: '45%' }}
            />
            <TextField
            label="Al"
            type="number"
            value={al}
            onChange={(e) => setAl(e.target.value)}
            variant="outlined"
            margin="normal"
            style={{ width: '45%' }}
            />
            <Button className="ripristina-link"
            onClick={handleReset}
                sx={{ 
                    color: 'white', backgroundColor: 'black',
                    width: "90px",
                    height: "40px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: "bolder",
                    // marginLeft: "20px",
                    // marginTop: "5px",
                    // padding: "0.5rem 1rem",
                    "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        transform: "scale(1.05)",
                    },
                    }}>
                    Reset
                </Button>
        
        </div>
      </div>

      {loading && (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
    <CircularProgress style={{ color: 'black' }} />

      </div>
    )}

{!loading && showTable && (
      <TableContainer component={Paper} sx={{padding: '20px', backgroundColor: '#fbb800', boxShadow:'none'}}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <FirstRowTableCell>Dipendenti</FirstRowTableCell>
            {[...Array(daysInMonth).keys()].map(day => (
              <FirstRowTableCell key={day}>
                {day + 1}
              </FirstRowTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
  {dipendenti
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((dipendente, index) => (
      <TableRow key={dipendente.id} component={index % 2 === 0 ? OddRow : EvenRow}>
        <StyledTableCell component="th" scope="row">
          {dipendente.label}
        </StyledTableCell>
        {[...Array(daysInMonth).keys()].map(day => {
          const date = new Date(year, month - 1, day + 1);
          const isWeekendDay = isWeekend(date);
          const isHoliday = isPublicHoliday(date);
          const isSpecialDay = isWeekendDay || isHoliday;

          // Trova il record corrispondente per questo giorno
          const dayRecord = dipendente.giorni && Array.isArray(dipendente.giorni)
            ? dipendente.giorni.find(g => g.giorno === day + 1)
            : null;

          return (
            <TableCell
              key={day}
              component={isSpecialDay ? WeekendCell : TableCell}
            >
              {dayRecord ? dayRecord.oreTotali : ""}
            </TableCell>
          );
        })}
      </TableRow>
    ))}
</TableBody>


      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={dipendenti.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div style={{display: 'flex', justifyContent:'center', alignItems:'center', marginTop: '20px'}}>
    <Button
            color="primary"
            onClick={handleEstraiExcel}
            style={{
              // backgroundColor: "#6C757D",
              marginBottom: '20px',
              backgroundColor: "black",
              color: "white",
              fontWeight:"bold",
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Esporta in Excel
          </Button>
         
  </div>
      
    </TableContainer>
    
     )}

  
    </div>
  );
};

export default ReportPage;
