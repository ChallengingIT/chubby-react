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
    width: "100%", 
    maxWidth: "200px", 
    height: "56px", 
    borderRadius: "40px",
    fontSize: "0.8rem",
    textAlign: "start",
    color: "#757575",
    "& .MuiInputBase-root": {
      borderRadius: "40px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#757575", 
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#000", 
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#757575", 
    },
  };

  const [ searchTerm,   setSearchTerm   ] = useState(initialSearchTerm);
  const [ ownerOptions, setOwnerOptions ] = useState([]);
  const [ statoOptions, setStatoOptions ] = useState([]);
  const [ filteredData, setFilteredData ] = useState([]);


  const accessToken = localStorage.getItem("accessToken"); 

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { 
      handleSearch();     
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOwner = await axios.get("https://localhost:8443/aziende/react/owner", { headers: headers});

        const responseStato = await axios.get("https://localhost:8443/staffing/react/stato/candidato", { headers: headers});

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

    const filteredData = OriginalInterviste.filter(item =>
      Object.keys(searchTerm).every(key =>
        searchTerm[key] === '' ||
        (key === 'candidato' && item[key]?.owner?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||

        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
      )
    );
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
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

    {/* prima colonna */}
    
    <Select
                  className="dropdown-menu"
                  value={searchTerm.stato}
                  onChange={e => setSearchTerm({...searchTerm, stato: e.target.value })}
                  sx={commonFieldStyles
                  }
                  native
                  onKeyDown={handleKeyDown}
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
    {/* seconda colonna */}
    
    <Select
                  className="dropdown-menu"
                  value={searchTerm.intervistatore}
                  onChange={e => setSearchTerm({...searchTerm, intervistatore: e.target.value })}
                  sx={commonFieldStyles
                  }
                  native
                  onKeyDown={handleKeyDown}
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
    {/* terza colonna */}
    

    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="data"
            value={searchTerm.data}
            onKeyDown={handleKeyDown}
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


    {/* quarta colonna */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
    <Button
      className="button-search"
      variant="contained"
      onClick={handleSearch}
      sx={{
        width: '100px',
        height: "40px",
        backgroundColor: "#14D928",
        color: "black",
        borderRadius: "10px",
        fontSize: "0.8rem",
        fontWeight: "bolder",
        "&:hover": {
          backgroundColor: "#14D928",
          color: "black",
          transform: "scale(1.05)",
        },
      }}
    >
      Cerca
    </Button>
    <Button
      className="ripristina-link"
      onClick={handleReset}
      sx={{
        width: '100px', 
        color: 'white', 
        backgroundColor: 'black',
        height: "40px",
        borderRadius: "10px",
        fontSize: "0.8rem",
        fontWeight: "bolder",
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
  );
};

export default IntervisteSearchBox;
