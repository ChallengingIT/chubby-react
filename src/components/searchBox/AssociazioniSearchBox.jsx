import React, { useState, useEffect }         from "react";
import Button                                 from "@mui/material/Button";
import { Select }                             from "@mui/material";
import CustomCalendar2                        from "../CustomCalendar2";
import axios                                  from "axios";

import "../../styles/HR.css";


const AssociazioniSearchBox = ({ data, onSearch, onReset, onSearchTextChange }) => {
  const initialSearchTerm = {
    azienda: '',
    stato: '',
    data: '',
  };

  const [ statoOptions,         setStatoOptions         ] = useState([]);
  const [ aziendeOptions,       setAziendeOptions       ] = useState([]);
  const [ searchTerm,           setSearchTerm           ] = useState(initialSearchTerm);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const responseAziende  = await axios.get("https://localhost:8443/aziende/react");
        const responseStato    = await axios.get("https://localhost:8443/fatturazionePassiva/react/stato");


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
    const filteredData = data.filter(item =>
      Object.keys(searchTerm).every(key =>
        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
      )
    );
    onSearch(filteredData);
  };
  

  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onSearchTextChange("");
    onReset();
  };

  return (
    <div className="row-container">
    {/* prima colonna */}
    <div className="col">
    <Select
                  className="dropdown-menu"
                  value={searchTerm.aziende}
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
    </div>
    {/* seconda colonna */}
    <div className="col">
    <Select
        className="dropdown-menu"
        value={searchTerm.stato}
        onChange={e => setSearchTerm({ ...searchTerm, stato: e.target.value })}
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
        <option value="1">Verde</option>
        <option value="2">Giallo</option>
        <option value="3">Rosso</option>
    </Select>
    </div>
    {/* terza colonna */}
    <div className="col">
    <CustomCalendar2
                value={searchTerm.calendario}
                onChange={(e) => setSearchTerm({ ...searchTerm, calendario: e.target.value })}/>
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
                  backgroundColor: "#14D928",
                  color: "black",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  fontWeight: "bolder",
                  marginLeft: "20px",
                  marginTop: "5px",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor: "#14D928",
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

export default AssociazioniSearchBox;
