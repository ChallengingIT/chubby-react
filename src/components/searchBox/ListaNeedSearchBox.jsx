//funzionante al 19 dicembre 2023 16:15

import React, { useState, useEffect }       from "react";
import Button                               from "@mui/material/Button";
import Select                               from "@mui/material/Select";
import axios                                from "axios";
import Need                                 from "../../pages/Need.jsx";
import TextField                            from '@mui/material/TextField';
import { format, getWeek }                  from 'date-fns';
import itLocale                             from 'date-fns/locale/it';

import "../../styles/Need.css";



const ListaNeedSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalListaNeed}) => {

  const initialSearchTerm = {
    owner: '',
    priorita: '',
    week: '',
    tipologia: '',
    stato: '',

  };

  const [selectedWeek, setSelectedWeek] = useState('');

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

  const [ searchTerm,               setSearchTerm               ] = useState(initialSearchTerm);
  const [ ownerOptions,             setOwnerOptions             ] = useState([]);
  const [ tipologiaOptions,         setTipologiaOptions         ] = useState([]);
  const [ statoOptions,             setStatoOptions             ] = useState([]);
  const [ filteredData,             setFilteredData             ] = useState([]);


  const accessToken = localStorage.getItem("accessToken"); 

const headers = {
  Authorization: `Bearer ${accessToken}`,
};


const handleKeyDown = (e) => {
  if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
    handleSearch();     
  }
};





  useEffect(() => {
    const fetchData = async () => {
      try {

        const responseOwner             = await axios.get("http://localhost:8080/aziende/react/owner", { headers: headers});
        const responseTipologia         = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers});
        const responseStato             = await axios.get("http://localhost:8080/need/react/stato", { headers: headers});

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
    if (Array.isArray(OriginalListaNeed)) {
    const filteredData = OriginalListaNeed.filter((item) =>
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
    console.error("OriginalListaNeed non è definito o non è un array");
  }
  };
  
  
  
  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onSearchTextChange("");
    onReset();
    setFilteredData([]);
  };


  const uniformStyle = {
    height: '40px',
    borderRadius: '40px',
    fontSize: '0.8rem',
    textAlign: 'start',
    color: '#757575',
    width: '100%', 
  };
  
      
  return (
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

            {/* Prima colonna */}
              <Select
                  className="dropdown-menu"
                  value={searchTerm.owner}
                  onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
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
                    Owner
                  </option>
                  {ownerOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
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

            {/* Seconda colonna */}
                <input style={{border: 'solid 1px #c4c4c4',  marginTop: '10px'}}
                  type="number"
                  placeholder="Priorità"
                  className="text-form"
                  id="ricercaPriorita"
                  max="4"
                  value={searchTerm.priorita}
                  onChange={(e) => setSearchTerm({ ...searchTerm, priorita: e.target.value })}
                />
              <Select
                  className="dropdown-menu"
                  value={searchTerm.stato}
                  onChange={e => setSearchTerm({...searchTerm, stato: e.target.value })}
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
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
            {/* Terza colonna */}
        
            <TextField
              style={uniformStyle}
  type="week"
//   label="week"
  value={selectedWeek}
  onChange={handleWeekChange}
  InputLabelProps={{ shrink: true}}
  variant="outlined"
  onKeyDown={handleKeyDown}
  InputProps={{
    style: {
        height: "40px",
      borderRadius: "40px", 
      textAlign: "start",
      color: "#757575",
    }
  }}
/>

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

export default ListaNeedSearchBox;