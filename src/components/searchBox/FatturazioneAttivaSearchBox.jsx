import React, { useState, useEffect }           from "react";
import { Box, Select, Button } from "@mui/material";
import axios                                    from "axios";


const FatturazioneAttivaSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalFatturazioneAttiva}) => {
  const savedSearchTerms = JSON.parse(localStorage.getItem("ricercaFatturazioneAttiva")) || {
    azienda: '',
    stato: '',
  };

  const [ statoOptions,       setStatoOptions       ] = useState([]);
  const [ searchTerm,         setSearchTerm         ] = useState(savedSearchTerms);
  const [ aziendeOptions,     setAziendeOptions     ] = useState([]);
  const [ filteredData,       setFilteredData       ] = useState([]);

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

        const responseAziende    = await axios.get("http://89.46.67.198:8443/aziende/react/select"                    , { headers: headers });
        const responseStato      = await axios.get("http://89.46.67.198:8443/fatturazione/attiva/react/stato"  , { headers: headers });
        if (Array.isArray(responseStato.data)) {
          setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 

        if (Array.isArray(responseAziende.data)) {
          setAziendeOptions(responseAziende.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredData = OriginalFatturazioneAttiva.filter(item =>
      Object.keys(searchTerm).every(key =>
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
      )
    );
    localStorage.setItem("ricercaFatturazioneAttiva", JSON.stringify(searchTerm));

    onSearch(filteredData);
    setFilteredData(filteredData);
  };
  

  const handleReset = () => {
    setSearchTerm({
      azienda: '',
      stato: '',
    });
    onSearchTextChange("");
    onReset();
    setFilteredData([]);
    localStorage.removeItem("ricercaFatturazioneAttiva");

  };


  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '0.5%', alignItems: 'center', margin: '0.4%', borderBottom: '2px solid #dbd9d9'}}>

    {/* prima colonna */}
    <Select
                  className="dropdown-menu"
                  value={searchTerm.azienda}
                  onChange={e => setSearchTerm({...searchTerm, aziende: e.target.value })}
                  sx={{
                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                  onKeyDown={handleKeyDown}
                >
                  <option value="" disabled>
                    Azienda
                  </option>
                  {aziendeOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
    {/* seconda colonna */}
    <Select
                  className="dropdown-menu"
                  value={searchTerm.stato}
                  onChange={e => setSearchTerm({...searchTerm, stato: e.target.value })}
                  sx={{
                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
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
    {/* terza colonna */}
    <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '5%', marginLeft: '10px', marginTop: '-1%' }}>
        <Button
          className="button-search"
          variant="contained"
          onClick={handleSearch}
          sx={{
            width: '2rem',
            height: "40px",
            backgroundColor: "#ffb700",
            color: "black",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            "&:hover": {
              backgroundColor: "#ffb700",
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
            width: '2rem',
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
      </Box>
    </Box>
  );
};

export default FatturazioneAttivaSearchBox;