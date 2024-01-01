import React, { useState, useEffect }         from "react";
import Button                                 from "@mui/material/Button";
import { Select, TextField}                   from "@mui/material";
import axios                                  from "axios";
import { DatePicker }                         from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider }               from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns }                     from '@mui/x-date-pickers/AdapterDateFns';

import "../../styles/HR.css";








const IntervisteSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalInterviste }) => {
  const initialSearchTerm = {
    stato: '',
    intervistatore: '',
    data: null,
  };

  const commonFieldStyles = {
    width: "100%", // Assicurati che sia la stessa per tutti i campi
    maxWidth: "200px", // o qualsiasi altra larghezza desideri
    height: "56px", // l'altezza di default per il TextField di MUI
    borderRadius: "40px",
    fontSize: "0.8rem",
    textAlign: "start",
    color: "#757575",
    "& .MuiInputBase-root": {
      borderRadius: "40px", // Arrotonda gli angoli della base dell'input
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#757575", // Colore del bordo
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#000", // Colore del bordo al passaggio del mouse
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#757575", // Colore del bordo quando è focalizzato
    },
  };

  const [ searchTerm,   setSearchTerm   ] = useState(initialSearchTerm);
  const [ ownerOptions, setOwnerOptions ] = useState([]);
  const [ statoOptions, setStatoOptions ] = useState([]);
  const [ filteredData, setFilteredData ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOwner = await axios.get("http://localhost:8080/aziende/react/owner");

        const responseStato = await axios.get("http://localhost:8080/staffing/react/stato/candidato");

                if (Array.isArray(responseStato.data)) {
                  setStatoOptions(responseStato.data.map((stato) => ({ label: stato.descrizione, value: stato.id })));
                } else {
                  console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
                } 

        if (Array.isArray(responseOwner.data)) {
          setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);


  const handleSearch = () => {
    console.log("Valori di ricerca:", searchTerm);
    console.log("Contenuto di Originale:", OriginalInterviste);
    const filteredData = OriginalInterviste.filter(item =>
      Object.keys(searchTerm).every(key =>
        searchTerm[key] === '' ||
        (key === 'candidato' && item[key]?.owner?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||

        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
      )
    );
    console.log("Dati filtrati:", filteredData);
    onSearch(filteredData);
    setFilteredData(filteredData);
  };
  

  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onSearchTextChange("");
    onReset();
    setFilteredData([]); 
  };

  return (
    <div className="row-container">
    {/* prima colonna */}
    <div className="colInterviste" style={{width: '90%',
  margin: '13px',
  display: 'flex',
  flexDirection: 'column',}}>
    <Select
                  className="dropdown-menu"
                  value={searchTerm.stato}
                  onChange={e => setSearchTerm({...searchTerm, stato: e.target.value })}
                  sx={commonFieldStyles
                    // borderRadius: "40px",
                    // fontSize: "0.8rem",
                    // textAlign: "start",
                    // color: "#757575",
                  }
                  native
                >
                  <option value="" disabled>
                    Stato
                  </option>
                  {statoOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
    </div>
    {/* seconda colonna */}
    <div className="colInterviste" style={{width: '90%',
  margin: '13px',
  display: 'flex',
  flexDirection: 'column',}}>
    <Select
                  className="dropdown-menu"
                  value={searchTerm.intervistatore}
                  onChange={e => setSearchTerm({...searchTerm, intervistatore: e.target.value })}
                  sx={commonFieldStyles
                    // borderRadius: "40px",
                    // fontSize: "0.8rem",
                    // textAlign: "start",
                    // color: "#757575",
                  }
                  native
                >
                  <option value="" disabled>
                    Intervistatore
                  </option>
                  {ownerOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
    </div>
    {/* terza colonna */}
    <div className="colInterviste" style={{width: '90%',
  margin: '13px',
  display: 'flex',
  flexDirection: 'column',}}>

    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="data"
            value={searchTerm.data}
            onChange={(newValue) => {
              setSearchTerm({ ...searchTerm, data: newValue });
            }}
            sx={{ border: 'solid 1px #black',
          borderRadius: '40px',
          fontSize: "0.8rem",
          textAlign: "start",
          color: "black",
          '& .MuiInputBase-root': { borderRadius: '50px' } }}
 
          
          />
        </LocalizationProvider>



        {/* <input style={{border: 'solid 1px #c4c4c4'}}
                  type="date"
                  placeholder="Data"
                  className="text-form"
                  value={searchTerm.data}
                  onChange={(newValue) => {
                    setSearchTerm({ ...searchTerm, data: newValue });
                  }}
                /> */}
  



    </div>
    {/* quarta colonna */}
    <div className="col-4">
    <Button className="ripristina-link" onClick={handleReset}
                sx={{ 
                  color: 'white', backgroundColor: 'black',
                  width: "100%",
                    maxWidth: "90px",
                    height: "50px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: "bolder",
                    marginLeft: "20px",
                    marginTop: "5px",
                    padding: "0.5rem 1rem",
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}>
                  Reset
                </Button>
              <Button
                className="button-search"
                variant="contained"
                onClick={handleSearch}
                sx={{
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#ffb800",
                  color: "black",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  fontWeight: "bolder",
                  marginLeft: "20px",
                  marginTop: "5px",
                  padding: "0.5rem 1rem",
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
  </div>
  );
};

export default IntervisteSearchBox;
