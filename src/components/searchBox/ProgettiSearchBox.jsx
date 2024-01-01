import React, { useState, useEffect }     from "react";
import Button                             from "@mui/material/Button";
import Select                             from "@mui/material/Select";
import axios                              from "axios";

import "../../styles/Progetti.css";




const ProgettiSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalProgetti}) => {

  const initialSearchTerm = {
    dipendente: '',
    cliente: '',
  };

  const [ searchTerm,                   setSearchTerm               ] = useState(initialSearchTerm);
  const [ clienteOptions,               setClienteOptions           ] = useState([]);
  const [ dipendentiOptions,            setDipendentiOptions        ] = useState([]);
  const [ filteredData,                 setFilteredData             ] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {

        const responseCliente    = await axios.get("http://localhost:8080/aziende/react");
        const responseDipendenti = await axios.get("http://localhost:8080/hr/react");

        if (Array.isArray(responseCliente.data)) {
          setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
        } 

        if (Array.isArray(responseDipendenti.data)) {
          console.log("Dati dipendenti:", responseDipendenti.data);
          setDipendentiOptions(responseDipendenti.data.map((dipendente) => ({
            label: dipendente.nome,
            value: dipendente.id
          })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseDipendenti.data);
          
        }
        
        
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        console.log("Errore nella richiesta axios:", error.response);
      }
    };

    fetchData();
  }, []);


  const handleSearch = () => {
    console.log("Valori di ricerca:", searchTerm);
    console.log("Contenuto di Originale:", OriginalProgetti);
    const filteredData = data.filter(item =>
      Object.keys(searchTerm).every(key =>
        (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
    <div className="row1-col3-container">
    {/* prima colonna */}
    <div className="col">
    <Select
                  className="dropdown-menu"
                  value={searchTerm.dipendente}
                  onChange={e => setSearchTerm({...searchTerm, dipendenti: e.target.value })}
                  sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
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
    </div>
    {/* seconda colonna */}
    <div className="col">
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
    {/* terza colonna */}
    <div className="col-4">
    <Button className="ripristina-link" onClick={handleReset}
        sx={{ 
          color: 'white', backgroundColor: 'black',
          width: "100%",
            maxWidth: "90px",
            height: "50px",
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
      <Button
        className="button-search"
        variant="contained"
        onClick={handleSearch}
        sx={{
          width: "90px",
          height: "50px",
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
  </div>
  );
};

export default ProgettiSearchBox;