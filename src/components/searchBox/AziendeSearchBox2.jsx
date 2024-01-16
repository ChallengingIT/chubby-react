import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import Grid from '@mui/material/Grid';

function AziendeSearchBox2({ data, onSearch, onReset, onSearchTextChange, OriginalAziende }) {

  const initialSearchTerm = {
    denominazione: '',
    tipologia: '',
    status: '',
    owner:'',
  };

  const [ searchTerm,          setSearchTerm        ] = useState(initialSearchTerm);
  const [ ownerOptions,        setOwnerOptions      ] = useState([]);
  const [ tipologiaOptions,    setTipologiaOptions  ] = useState([]);
  const [ statoOptions,        setStatoOptions      ] = useState([]);
  const [ filteredData,        setFilteredData      ] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOwner = await axios.get("http://localhost:8080/aziende/react/owner");
        const responseStato = await axios.get("http://localhost:8080/aziende/react");

    if (Array.isArray(responseStato.data)) {
      const statoOptionsData = responseStato.data.map((status) => ({
        label: convertStatus(status),
        value: status,
      }));
  
      setStatoOptions(statoOptionsData);
      if (!searchTerm.status && searchTerm.status !== "") {
        setSearchTerm({ ...searchTerm, status: "" });
      }
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

  const convertStatus = (data) => {
    if (data && data.status) {
      const numericalStatus = data.status;
      switch (numericalStatus) {
        case 1:
          return 'Verde';
        case 2:
          return 'Giallo';
        case 3:
          return 'Rosso';
        default:
          return 'Sconosciuto';
      }
    }
  
    return 'Sconosciuto';
  };

  // Funzione per gestire la ricerca (da implementare)
  const handleSearch = () => {
    console.log("Ricerca in corso...");
    // Logica per la ricerca
  };

  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onSearchTextChange("");
    onReset();
    setFilteredData([]);
  };

  return (
    <Box
        sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: "white",
        borderRadius: "40px",
        margin: "20px",
        width: "95%",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)",
        }}
    >
     <TextField
     fullWidth
  label="Ragione Sociale"
  variant="outlined"
  value={searchTerm.denominazione}
  onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '40px', // Bordo arrotondato per il TextField
      '& input': {
        padding: '10px',
        height: '20px'
      },
    },
    '& .MuiInputLabel-root': {
      background: 'white',
      padding: '-5px 10px',
      borderRadius: '40px',
    },
  }}
/>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ background: 'white', padding: '0 10px' }}>Stato</InputLabel>
        <Select
  className="dropdown-menu"
  value={searchTerm.status}
  onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
  sx={{
    borderRadius: '40px', 
    '& .MuiSelect-select': {
      borderRadius: '40px', 
    },
  }}
  native
>
  <option value="" disabled>

  </option>
  <option value={1}>Verde</option>
  <option value={2}>Giallo</option>
  <option value={3}>Rosso</option>
</Select>
      </FormControl>
   

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ background: 'white', padding: '0 10px' }}>Owner</InputLabel>
        <Select
                  className="dropdown-menu"
                  value={searchTerm.owner}
                  onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
                  sx={{
                    borderRadius: '40px', 
                    '& .MuiSelect-select': {
                      borderRadius: '40px', 
                      height: '20px',
                    },
                    '& .MuiFormControl-root': {
                        padding: "5px"
                    }
                  }}
                  native
                >
                  <option value="" disabled>
                  
                  </option>
                  {ownerOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ background: 'white', padding: '0 10px' }}>Tipologia</InputLabel>
        <Select
                  className="dropdown-menu"
                  value={searchTerm.tipologia}
                  onChange={(e) => setSearchTerm({...searchTerm, tipologia: e.target.value })}
                  sx={{
                    borderRadius: '40px',
                    '& .MuiSelect-select': {
                      borderRadius: '40px', 
                    },
                  }}
                  native
                >
                  <option value="" disabled>
                    
                  </option>
                  <option value="Cliente">Cliente</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Consulenza">Consulenza</option>
                
                </Select>
      </FormControl>

      <Button 
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
      "&:hover": {
        backgroundColor: "#ffb800",
        color: "black",
        transform: "scale(1.05)",
      },
    }}
      >Cerca</Button>
      <Button 
      variant="outlined" 
      onClick={handleReset}
      sx={{ 
        marginRight: '20px',
        color: 'white', 
        backgroundColor: 'black',
        width: "90px",
        height: "40px",
        borderRadius: "10px",
        fontSize: "0.8rem",
        fontWeight: "bolder",
        "&:hover": {
        backgroundColor: "black",
        color: "white",
        transform: "scale(1.05)",
          },
        }}
      >Reset</Button>
    </Box>
  );
}

export default AziendeSearchBox2;
