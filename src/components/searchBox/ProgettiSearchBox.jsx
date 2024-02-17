import React, { useState, useEffect }     from "react";
import { Box, Button, Select } from "@mui/material";
import axios                              from "axios";





const ProgettiSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalProgetti}) => {

  const savedSearchTerms = JSON.parse(localStorage.getItem("ricercaProgetti")) || {
    dipendente: '',
    cliente: '',
  };

  const accessToken = localStorage.getItem("accessToken"); 


const headers = {
  Authorization: `Bearer ${accessToken}`,
};


  const [ searchTerm,                   setSearchTerm               ] = useState(savedSearchTerms);
  const [ clienteOptions,               setClienteOptions           ] = useState([]);
  const [ dipendentiOptions,            setDipendentiOptions        ] = useState([]);
  const [ filteredData,                 setFilteredData             ] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const responseCliente    = await axios.get("http://89.46.67.198:8443/aziende/react/select", { headers: headers});
        const responseDipendenti = await axios.get("http://89.46.67.198:8443/hr/react"     , { headers: headers});

        if (Array.isArray(responseCliente.data)) {
          setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
        } 

        if (Array.isArray(responseDipendenti.data)) {
     
          setDipendentiOptions(responseDipendenti.data.map((dipendente) => ({
            label: `${dipendente.nome} ${dipendente.cognome}`,
            value: dipendente.id
          })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseDipendenti.data);
          
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
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
        
      )
    );
    localStorage.setItem("ricercaProgetti", JSON.stringify(searchTerm));

    onSearch(filteredData);
    setFilteredData(filteredData);
  };
  
  const handleReset = () => {
    setSearchTerm({
      dipendente: '',
      cliente: '',
    });
    onSearchTextChange("");
    onReset();
    setFilteredData([]);
    localStorage.removeItem("ricercaProgetti");

  };


  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
      handleSearch();     
    }
  };


  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '0.5%', alignItems: 'center', margin: '0.4%', borderBottom: '2px solid #dbd9d9'}}>

    {/* prima colonna */}
    <Select
                  className="dropdown-menu"
                  value={searchTerm.dipendente}
                  onChange={e => setSearchTerm({...searchTerm, dipendenti: e.target.value })}
                  sx={{
                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                  onKeyDown={handleKeyDown}
                >
                  <option value="" disabled>
                    Dipendenti
                  </option>
                  {dipendentiOptions.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
    {/* seconda colonna */}
    <Select
                  className="dropdown-menu"
                  value={searchTerm.cliente}
                  onChange={e => setSearchTerm({...searchTerm, cliente: e.target.value })}
                  sx={{
                    marginTop: '1%',
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
    {/* terza colonna */}
    <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '5%', marginLeft: '10px', marginTop: '-1%' }}>
        <Button
          className="button-search"
          variant="contained"
          onClick={handleSearch}
          sx={{
            width: '2rem',
            height: "40px",
            backgroundColor: "#ffb700",
            color: "black",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            "&:hover": {
              backgroundColor: "#ffb700",
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
            width: '2rem',
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
      </Box>
    </Box>
  );
};

export default ProgettiSearchBox;