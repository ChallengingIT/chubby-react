//funzionante al 19 dicembre 2023 16:15

import React, { useState, useEffect }             from "react";
import Button                                     from "@mui/material/Button";
import Select                                     from "@mui/material/Select";
import CustomCalendar2                            from "../CustomCalendar2.jsx";
import axios                                      from "axios";
import Need                                       from "../../pages/Need.jsx";
import TextField                                  from '@mui/material/TextField';
import { format, getWeek }                        from 'date-fns';
import itLocale                                   from 'date-fns/locale/it';

import "../../styles/Need.css";

const NeedSearchBox2 = ({ data, onSearch, onReset, onSearchTextChange, OriginalNeed}) => {

  const initialSearchTerm = {
    cliente: '',
    priorita: '',
    owner: '',
    tipologia: '',
    stato: '',
    week: '',
  };

  const [ searchTerm,                 setSearchTerm                 ] = useState(initialSearchTerm);
  const [ clienteOptions,             setClienteOptions             ] = useState([]);
  const [ ownerOptions,               setOwnerOptions               ] = useState([]);
  const [ tipologiaOptions,           setTipologiaOptions           ] = useState([]);
  const [ statoOptions,               setStatoOptions               ] = useState([]);
  const [ filteredData,               setFilteredData               ] = useState([]);
  const [ selectedWeek,               setSelectedWeek               ] = useState('');

  const handleWeekChange = (event) => {
    const newWeek = event.target.value;
    setSelectedWeek(newWeek);
    setSearchTerm({ ...searchTerm, week: newWeek });
  };

  const formatWeekSelectLabel = (date) => {
    let weekNumber = getWeek(date, { locale: itLocale });
    let year = format(date, 'yyyy');
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
        const responseCliente       = await axios.get("http://89.46.67.198/aziende/react", { headers });
        const responseOwner         = await axios.get("http://89.46.67.198/aziende/react/owner", { headers });
        const responseTipologia     = await axios.get("http://89.46.67.198/need/react/tipologia", { headers });
        const responseStato         = await axios.get("http://89.46.67.198/need/react/stato", { headers });

        if (Array.isArray(responseCliente.data)) {
          setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
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

    const filteredData = OriginalNeed.filter((item) =>
      Object.keys(searchTerm).every((key) =>
        searchTerm[key] === '' ||
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
      
  return (
        <div className="row2-container">
            {/* Prima colonna */}
            <div className="col">
              <div className="row">
              <Select
                  className="dropdown-menu"
                  value={searchTerm.cliente}
                  onChange={e => setSearchTerm({...searchTerm, cliente: e.target.value })}
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
                  {clienteOptions.map((option) => (
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
              <TextField
  type="week"
//   label="week"
  value={selectedWeek}
  onChange={handleWeekChange}
  InputLabelProps={{ shrink: true}}
  variant="outlined"
  InputProps={{
    style: {
        marginBottom: "15px",
      borderRadius: "40px", 
      fontSize: "0.8rem",
      textAlign: "start",
      color: "#757575",
    }
  }}
/>
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

export default NeedSearchBox2;