import React, { useState, useEffect }       from "react";
import Button                               from "@mui/material/Button";
import Select                               from "@mui/material/Select";
import axios                                from "axios";

import "../../styles/FatturazionePassiva.css";


const FatturazionePassivaSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalFatturazionePassiva}) => {
  const initialSearchTerm = {
    fornitore: '',
    stato: '',
  };

  const [ searchTerm,           setSearchTerm           ] = useState(initialSearchTerm);
  const [ fornitoriOptions,     setFornitoriOptions     ] = useState([]);
  const [ statoOptions,         setStatoOptions         ] = useState([]);
  const [ filteredData,         setFilteredData         ] = useState([]);

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

        const responseFornitori = await axios.get("https://89.46.67.198:8443/fornitori/react", { headers: headers});
        const responseStato     = await axios.get("https://89.46.67.198:8443/fatturazionePassiva/react/stato", { headers: headers});
        
        if (Array.isArray(responseStato.data)) {
          setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 

        if (Array.isArray(responseFornitori.data)) {
          setFornitoriOptions(responseFornitori.data.map((fornitore) => ({ label: fornitore.denominazione, value: fornitore.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseFornitori.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredData = data.filter(item =>
      Object.keys(searchTerm).every(key =>
        (key === 'fornitori' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
                  value={searchTerm.fornitore}
                  onChange={e => setSearchTerm({...searchTerm, fornitori: e.target.value })}
                  sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                  onKeyDown={handleKeyDown}
                >
                  <option value="" disabled>
                    Fornitori
                  </option>
                  {fornitoriOptions.map((option) => (
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

export default FatturazionePassivaSearchBox;