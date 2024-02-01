import React, { useState, useEffect }     from "react";
import Button                             from "@mui/material/Button";
import Select                             from "@mui/material/Select";
import axios                              from "axios";

import "../../styles/Recruiting.css";


const RecruitingSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalRecruiting, initialEmail}) => {
  const initialSearchTerm = {
    nome: '',
    cognome: '',
    email: '',
    tipo:'',
    tipologia:'',
    stato:'',
  };

  const [ searchTerm,                 setSearchTerm                   ] = useState(initialSearchTerm);
  const [ tipoOptions,                setTipoOptions                  ] = useState([]);
  const [ statoOptions,               setStatoOptions                 ] = useState([]);
  const [ tipologiaOptions,           setTipologiaOptions             ] = useState([]);
  const [ filteredData,               setFilteredData                 ] = useState([]);


  useEffect(() => {
    if (initialEmail) {
      setSearchTerm((prev) => ({ ...prev, email: initialEmail }));
      handleSearchWithInitialEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSearchWithInitialEmail = (email) => {
    const newSearchTerm = { ...initialSearchTerm, email };
    setSearchTerm(newSearchTerm);
    handleSearch(); 
  };


  useEffect(() => {
    const fetchData = async () => {
      try {

     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
   
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };

        const responseTipologia = await axios.get("http://89.46.67.198/aziende/react/tipologia", { headers });
        const responseTipo      = await axios.get("http://89.46.67.198/staffing/react/tipo", { headers });
        const responseStato     = await axios.get("http://89.46.67.198/staffing/react/stato/candidato", { headers });


        if (Array.isArray(responseStato.data)) {
          setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 


        if (Array.isArray(responseTipologia.data)) {
          setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
  
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
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

    const filteredData = OriginalRecruiting.filter((item) =>
      Object.keys(searchTerm).every((key) =>
        searchTerm[key] === '' ||
        (key === 'tipo' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'tipologia' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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


  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
      handleSearch();     
    }
  };

  
  return (
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

    {/* Prima colonna */}
        <input style={{border: 'solid 1px #c4c4c4', marginTop: '10px'}}
          type="text"
          placeholder="Nome Candidato"
          id="ricercaNome"
          className="text-form"
          maxLength="45"
          value={searchTerm.nome}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
          />
        <input style={{border: 'solid 1px #c4c4c4', marginTop: '10px'}}
          type="text"
          placeholder="Cognome Candidato"
          id="ricercaCognome"
          className="text-form"
          maxLength="45"
          value={searchTerm.cognome}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm({ ...searchTerm, cognome: e.target.value })}
          />
    {/* Seconda colonna */}
        <input style={{border: 'solid 1px #c4c4c4', marginTop: '10px'}}
          type="text"
          placeholder="Email Candidato"
          id="ricercaCognome"
          className="text-form"
          maxLength="45"
          value={searchTerm.email}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm({ ...searchTerm, email: e.target.value })}
        />
      <Select
                  className="dropdown-menu"
                  value={searchTerm.tipologia}
                  onChange={e => setSearchTerm({...searchTerm, tipologia: e.target.value })}
                  sx={{
                    marginTop: '10px',
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
                  {tipologiaOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
    {/* Terza colonna */}
      <Select
  className="dropdown-menu"
  value={searchTerm.tipo}
  onChange={(e) => setSearchTerm({ ...searchTerm, tipo: e.target.value })}
  sx={{
    marginTop: '10px',
    borderRadius: "40px",
    fontSize: "0.8rem",
    textAlign: "start",
    color: "#757575",
  }}
  native
  onKeyDown={handleKeyDown}
>
  <option value="" disabled>
    Tipo
  </option>
  {tipoOptions.map((option) => (
    <option key={option.label} value={option.label}>
      {option.label}
    </option>
  ))}
</Select>

      <Select
  className="dropdown-menu"
  value={searchTerm.stato}
  onChange={(e) => setSearchTerm({ ...searchTerm, stato: e.target.value })}
  sx={{
    marginTop: '10px',
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
    <option key={option.label} value={option.label}>
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

export default RecruitingSearchBox;