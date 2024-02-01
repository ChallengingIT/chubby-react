import React, { useState, useEffect }     from "react";
import Button                             from "@mui/material/Button";
import Select                             from "@mui/material/Select";
import axios                              from "axios";

import "../../styles/KeyPeople.css";


const KeyPeopleSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalKeypeople }) => {

  const initialSearchTerm = {
    owner: '',
    cliente: '',
    status: '',
  };

  const [statoOptions, setStatoOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [clienteOptions, setClienteOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
// Recupera l'accessToken da localStorage
const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

// Configura gli headers della richiesta con l'Authorization token
const headers = {
  Authorization: `Bearer ${accessToken}`
};
        const responseCliente = await axios.get("https://89.46.67.198:8443/aziende/react",            { headers: headers });
        const responseOwner   = await axios.get("https://89.46.67.198:8443/aziende/react/owner",      { headers: headers });
        const responseStato   = await axios.get("https://89.46.67.198:8443/aziende/react",            { headers: headers });
    if (Array.isArray(responseStato.data)) {
      const statoOptionsData = responseStato.data.map((status, index) => ({
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

        if (Array.isArray(responseCliente.data)) {
          setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);


  const handleSearch = () => {
    const filteredData = OriginalKeypeople.filter(item =>
      Object.keys(searchTerm).every(key =>
        searchTerm[key] === '' ||
        (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
  value={searchTerm.status}
  onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
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
  <option value={1}>Verde</option>
  <option value={2}>Giallo</option>
  <option value={3}>Rosso</option>
</Select>

   
    {/* seconda colonna */}

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
    
    {/* terza colonna */}
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
                  onKeyDown={handleKeyDown}
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


export default KeyPeopleSearchBox;