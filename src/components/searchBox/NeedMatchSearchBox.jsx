import React, { useState, useEffect } from "react";
import axios                          from "axios";
import Need                           from "../../pages/Need.jsx";
import { 
  TextField, 
  Button, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl 
} from '@mui/material';

import "../../styles/Need.css";

const NeedSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalAssociabili}) => {

  const initialSearchTerm = {
    nome: '',
    cognome: '',
    jobtitle: '',
    tipologia: '',
    seniority: '',

  };

  const [ searchTerm,                     setSearchTerm                 ] = useState(initialSearchTerm);
  const [ tipoOptions,                    setTipoOptions                ] = useState([]);
  const [ jobTitleOptions,                setJobTitleOptions            ] = useState([]);
  const [ tipologiaOptions,               setTipologiaOptions           ] = useState([]);
  const [ filteredData,                   setFilteredData               ] = useState([]);
  const seniorities = [
    { label: 'Neo', value: '0' },
    { label: 'Junior', value: '1' },
    { label: 'Middle', value: '2' },
    { label: 'Senior', value: '3' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseJobTitle = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseTipo     = await axios.get("http://localhost:8080/staffing/react/tipo"); 

        if (Array.isArray(responseJobTitle.data)) {
          setJobTitleOptions(responseJobTitle.data.map((jobTitle) => ({ label: jobTitle.descrizione, value: jobTitle.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseJobTitle.data);
        } 


        if (Array.isArray(responseTipo.data)) {
          setTipoOptions(responseTipo.data.map((tipo) => ({ label: tipo.descrizione, value: tipo.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseTipo.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  
  const handleSearch = () => {
    console.log("Valori di ricerca:", searchTerm);
    console.log("Contenuto originale: ", OriginalAssociabili);
    if (Array.isArray(OriginalAssociabili)) {
    const filteredData = OriginalAssociabili.filter((item) =>
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
  } else {
    console.error("OriginalAssociabili non è definito o non è un array");
  }
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
          <input style={{border: 'solid 1px #c4c4c4'}}
                  type="text"
                  placeholder="Nome"
                  className="text-form"
                  id="nome"
                  max="4"
                  value={searchTerm.nome}
                  onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
                />
          </div>
          <div className="row">
          <input style={{border: 'solid 1px #c4c4c4'}}
                  type="text"
                  placeholder="Cognome"
                  className="text-form"
                  id="cognome"
                  max="4"
                  value={searchTerm.cognome}
                  onChange={(e) => setSearchTerm({ ...searchTerm, cognome: e.target.value })}
                />

          </div>
        </div>
        {/* Seconda colonna */}
        <div className="col">
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
                 Job Title
              </option>
              {jobTitleOptions.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="row">
          <Select
              className="dropdown-menu"
              value={searchTerm.tipo}
              onChange={e => setSearchTerm({...searchTerm, sttipoato: e.target.value })}
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
              {tipoOptions.map((option) => (
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
              value={searchTerm.seniority}
              onChange={e => setSearchTerm({...searchTerm, seniority: e.target.value })}
              sx={{
                borderRadius: "40px",
                fontSize: "0.8rem",
                textAlign: "start",
                color: "#757575",
              }}
              native
            >
              <option value="" disabled>
                Seniority
              </option>
              {seniorities.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="row-calendar">
          
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