//funzionante al 19 dicembre 2023 16:15

import React, { useState, useEffect } from "react";
import "../../styles/Need.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import CustomCalendar2 from "../CustomCalendar2.jsx";
import axios from "axios";
import Need from "../../pages/Need.jsx";

const NeedSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalNeed}) => {

  const initialSearchTerm = {
    azienda: '',
    priorita: '',
    owner: '',
    tipologia: '',
    stato: '',
    calendario: '',
  };

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [aziendeOptions, setAziendeOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [tipologiaOptions, setTipologiaOptions] = useState([]);
  const [statoOptions, setStatoOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAziende = await axios.get("http://localhost:8080/aziende/react");
        const responseOwner = await axios.get("http://localhost:8080/aziende/react/owner");
        const responseTipologia = await axios.get("http://localhost:8080/need/react/tipologia");
        const responseStato = await axios.get("http://localhost:8080/need/react/stato");

        if (Array.isArray(responseAziende.data)) {
          setAziendeOptions(responseAziende.data.map((azienda) => ({ label: azienda.denominazione, value: azienda.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
        } 

        if (Array.isArray(responseTipologia.data)) {
          setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
        } 

        if (Array.isArray(responseStato.data)) {
          setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
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
    console.log("Contenuto originale: ", OriginalNeed);
    const filteredData = OriginalNeed.filter((item) =>
      Object.keys(searchTerm).every((key) =>
        searchTerm[key] === '' ||
        (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'tipologia' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
        <div className="row2-container">
            {/* Prima colonna */}
            <div className="col">
              <div className="row">
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
              </div>
              <div className="row">
              <Select
                  className="dropdown-menu"
                  value={searchTerm.tipologia}
                  onChange={e => setSearchTerm({...searchTerm, tipologia: e.target.value })}
                  sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                >
                  <option value="" disabled>
                     Tipologia
                  </option>
                  {tipologiaOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>

              </div>
            </div>
            {/* Seconda colonna */}
            <div className="col">
              <div className="row">
                <input style={{border: 'solid 1px #c4c4c4'}}
                  type="number"
                  placeholder="Priorità"
                  className="text-form"
                  id="ricercaPriorita"
                  max="4"
                  value={searchTerm.priorita}
                  onChange={(e) => setSearchTerm({ ...searchTerm, priorita: e.target.value })}
                />
              </div>
              <div className="row">
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
              </div>
            </div>
            {/* Terza colonna */}
            <div className="col">
              <div className="row">
              <Select
                  className="dropdown-menu"
                  value={searchTerm.owner}
                  onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
                  sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                >
                  <option value="" disabled>
                    Owner
                  </option>
                  {ownerOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="row-calendar">
                <CustomCalendar2
                value={searchTerm.calendario}
                onChange={(e) => setSearchTerm({ ...searchTerm, calendario: e.target.value })}/>
              </div>
            </div>
            {/* Quarta colonna */}
            <div className="col">
              <div className="row">
                
                <Button
                  className="button-search"
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    width: "100%",
                    maxWidth: "90px",
                    height: "40px",
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
              <div className="row">
              <Button className="ripristina-link" onClick={handleReset}
                sx={{ 
                  color: 'white', backgroundColor: 'black',
                  width: "100%",
                    maxWidth: "90px",
                    height: "40px",
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
              </div>
            </div>
          </div>
  );
};

export default NeedSearchBox;