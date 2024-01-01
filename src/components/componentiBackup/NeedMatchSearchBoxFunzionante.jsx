//la struttura è corretta, però non cerca e non resetta un cazzo!



import React, { useState, useEffect } from "react";
import "../../styles/Recruiting.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import axios from "axios";


const NeedMatchSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalNeedMatch}) => {
  const initialSearchTerm = {
    nome: '',
    cognome: '',
    jobTitle: '',
    tipologia:'',
    seniority:'',
  };

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [statoOptions, setStatoOptions] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseJobTitle = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseTipo = await axios.get("http://localhost:8080/staffing/react/tipo"); 
        const responseStato = await axios.get("http://localhost:8080/staffing/react/stato/candidato");
        //seniority in locale codice: neo=0 ,junior=1 ,middle=2 , senior=3

        if (Array.isArray(responseStato.data)) {
          setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 
        if (Array.isArray(responseJobTitle.data)) {
          setJobTitleOptions(responseJobTitle.data.map((jobTitle, index) => ({ label: jobTitle.descrizione, value: jobTitle.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseJobTitle.data);
        } 


        if (Array.isArray(responseTipo.data)) {
          setTipoOptions(responseTipo.data.map((tipo, index) => ({ label: tipo.descrizione, value: tipo.id })));
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
    console.log("Contenuto di Originale:", OriginalNeedMatch);

    const filteredData = data.filter(item =>
      Object.keys(searchTerm).every(key =>
        searchTerm[key] === '' ||
        (key === 'jobTitle' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'tipologia' && item[key]?.tipologia?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'seniority' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
    // setFilteredData([]);
  };

  
  return (
    <div className="row2-container">
    {/* Prima colonna */}
    <div className="col">
      <div className="row">
        <input style={{border: 'solid 1px #c4c4c4'}}
          type="text"
          placeholder="Nome Candidato"
          id="ricercaNome"
          className="text-form"
          maxlength="45"
          value={searchTerm.nome}
          onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
          />
      </div>
      <div className="row">
        <input style={{border: 'solid 1px #c4c4c4'}}
          type="text"
          placeholder="Cognome Candidato"
          id="ricercaCognome"
          class="text-form"
          maxlength="45"
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
                  value={searchTerm.jobTitle}
                  onChange={e => setSearchTerm({...searchTerm, jobTitle: e.target.value })}
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
            value={searchTerm.tipologia}
            onChange={e => setSearchTerm({ ...searchTerm, tipologia: e.target.value })}
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
              <option key={option.value} value={option.value}>
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
            onChange={e => setSearchTerm({ ...searchTerm, seniority: e.target.value })}
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
            {tipoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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

export default NeedMatchSearchBox;