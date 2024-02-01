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

const NeedMatchSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalAssociabili}) => {

  const initialSearchTerm = {
    nome: '',
    cognome: '',
    jobtitle: '',
    tipologia: '',
    seniority: '',

  };


  

  const accessToken = localStorage.getItem("accessToken"); 

const headers = {
  Authorization: `Bearer ${accessToken}`,
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
        const responseJobTitle = await axios.get("https://89.46.67.198:8443/aziende/react/tipologia", { headers: headers});
        const responseTipo     = await axios.get("https://89.46.67.198:8443/staffing/react/tipo"    , { headers: headers}); 

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


  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
      handleSearch();     
    }
  };
      
  return (
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

        {/* Prima colonna */}
          <input style={{border: 'solid 1px #c4c4c4'}}
                  type="text"
                  placeholder="Nome"
                  className="text-form"
                  id="nome"
                  max="4"
                  value={searchTerm.nome}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
                />
          <input style={{border: 'solid 1px #c4c4c4'}}
                  type="text"
                  placeholder="Cognome"
                  className="text-form"
                  id="cognome"
                  max="4"
                  value={searchTerm.cognome}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearchTerm({ ...searchTerm, cognome: e.target.value })}
                />

        {/* Seconda colonna */}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
        {/* Terza colonna */}
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
              onKeyDown={handleKeyDown}
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
          
        {/* Quarta colonna */}
            
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

export default NeedMatchSearchBox;