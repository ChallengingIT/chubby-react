import React, { useState, useEffect }           from "react";
import Button                                   from "@mui/material/Button";
import Select                                   from "@mui/material/Select";
import axios                                    from "axios";

import "../../styles/FatturazioneAttiva.css";

const FatturazioneAttivaSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalFatturazioneAttiva}) => {
  const initialSearchTerm = {
    azienda: '',
    stato: '',
  };

  const [ statoOptions,       setStatoOptions       ] = useState([]);
  const [ searchTerm,         setSearchTerm         ] = useState(initialSearchTerm);
  const [ aziendeOptions,     setAziendeOptions     ] = useState([]);
  const [ filteredData,       setFilteredData       ] = useState([]);

  const accessToken = localStorage.getItem("accessToken"); // Ottieni l'accessToken dal localStorage
  // console.log("accessToken: ", accessToken);
  // Configura l'header "Authorization" con l'accessToken
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };



  useEffect(() => {
    const fetchData = async () => {
      try {

        const responseAziende    = await axios.get("http://localhost:8080/aziende/react"                    , { headers: headers });
        const responseStato      = await axios.get("http://localhost:8080/fatturazione/attiva/react/stato"  , { headers: headers });
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
    console.log("Valori di ricerca:", searchTerm);
    const filteredData = OriginalFatturazioneAttiva.filter(item =>
      Object.keys(searchTerm).every(key =>
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

    {/* prima colonna */}
    <Select
                  className="dropdown-menu"
                  value={searchTerm.azienda}
                  onChange={e => setSearchTerm({...searchTerm, aziende: e.target.value })}
                  sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
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
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
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
    {/* terza colonna */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
    <Button
      className="button-search"
      variant="contained"
      onClick={handleSearch}
      sx={{
        width: '100px',
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

export default FatturazioneAttivaSearchBox;