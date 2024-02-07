import React, { useState, useEffect }         from "react";
import axios                                  from "axios";
import Button                                 from "@mui/material/Button";
import Select                                 from "@mui/material/Select";



import "../../styles/Aziende.css";
import userService from "../../services/user.service.js";

const AziendeSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalAziende }) => {
  const initialSearchTerm = {
    denominazione: '',
    tipologia: '',
    status: '',
    owner:'',
  };


  const accessToken = localStorage.getItem("accessToken"); 

const headers = {
  Authorization: `Bearer ${accessToken}`,
};

  const [ searchTerm,          setSearchTerm        ] = useState(initialSearchTerm);
  const [ ownerOptions,        setOwnerOptions      ] = useState([]);
  const [ tipologiaOptions,    setTipologiaOptions  ] = useState([]);
  const [ statoOptions,        setStatoOptions      ] = useState([]);
  const [ filteredData,        setFilteredData      ] = useState([]);

  const convertStatus = (data) => {
  if (data && data.status) {
    const numericalStatus = data.status;
    switch (numericalStatus) {
      case 1:
        return 'Verde';
      case 2:
        return 'Giallo';
      case 3:
        return 'Rosso';
      default:
        return 'Sconosciuto';
    }
  }

  return 'Sconosciuto';
};


const handleKeyDown = (e) => {
  if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
    handleSearch();     
  }
};


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOwner = await axios.get("http://89.46.196.60:8443/aziende/react/owner", {
          headers: headers,
        });
        const responseStato = await axios.get("http://89.46.196.60:8443/aziende/react/mod", {
          headers: headers,
        });

    if (Array.isArray(responseStato.data)) {
      const statoOptionsData = responseStato.data.map((status) => ({
        label: convertStatus(status),
        value: status,
      }));
  
      setStatoOptions(statoOptionsData);
      if (!searchTerm.status && searchTerm.status !== "") {
        setSearchTerm({ ...searchTerm, status: "" });
      }
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
    const filteredData = OriginalAziende.filter((item) =>
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
  };

  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onSearchTextChange("");
    onReset();
    setFilteredData([]);
  };
  

  return (
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>
      {/* Prima colonna */}
      <Select
  className="dropdown-menu"
  value={searchTerm.status}
  onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
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
  <option value={1}>Verde</option>
  <option value={2}>Giallo</option>
  <option value={3}>Rosso</option>
</Select>
     
  
      {/* Seconda colonna */}
      <input 
        style={{border: 'solid 1px #c4c4c4', width: '100%', marginTop: '10px'}}
        type="text"
        placeholder="Ragione Sociale"
        className="text-form"
        value={searchTerm.denominazione}
        onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
        onKeyDown={handleKeyDown}
      />
      
  
      {/* Terza colonna */}
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
      
  
      {/* Quarta colonna */}
      <Select
                  className="dropdown-menu"
                  value={searchTerm.tipologia}
                  onChange={(e) => setSearchTerm({...searchTerm, tipologia: e.target.value })}
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
                  <option value="Cliente">Cliente</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Consulenza">Consulenza</option>
                
                </Select>
  
      {/* Colonna dei pulsanti */}
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

export default AziendeSearchBox;
