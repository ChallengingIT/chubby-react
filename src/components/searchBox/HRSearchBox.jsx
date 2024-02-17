import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const HRSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalHr}) => {
  const savedSearchTerms = JSON.parse(localStorage.getItem("ricercaHR")) || {
    nome: '',
    cognome: '',
    email: '',
  };

  const [ searchTerm,    setSearchTerm    ] = useState(savedSearchTerms);
  const [ filteredData,  setFilteredData  ] = useState([]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { 
      handleSearch();     
    }
  };

  const handleSearch = () => {

    const filteredData = OriginalHr.filter(item =>
      Object.keys(searchTerm).every(key =>
        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
      )
    );
    localStorage.setItem("ricercaHR", JSON.stringify(searchTerm));

    onSearch(filteredData);
    setFilteredData(filteredData);
  };
  

  const handleReset = () => {
    setSearchTerm({
      nome: '',
      cognome: '',
      email: '',
    });
    onSearchTextChange("");
    onReset();
    setFilteredData([]); 
    localStorage.removeItem("ricercaHR");

  };
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '0.5%', alignItems: 'center', margin: '0.4%', borderBottom: '2px solid #dbd9d9'}}>

    {/* prima colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="nome"
        className="text-form"
        placeholder="Nome"
        maxLength="90"
        value={searchTerm.nome}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
      />

    {/* seconda colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="cognome"
        className="text-form"
        placeholder="Cognome"
        maxLength="45"
        value={searchTerm.cognome}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchTerm({ ...searchTerm, cognome: e.target.value })}
      />

    {/* terza colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="email"
        id="email"
        className="text-form"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        maxLength="45"
        placeholder="Email"
        value={searchTerm.email}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchTerm({ ...searchTerm, email: e.target.value })}
      />
    {/* quarta colonna */}
    <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '5%', marginLeft: '10px', marginTop: '-2%' }}>
        <Button
          className="button-search"
          variant="contained"
          onClick={handleSearch}
          sx={{
            width: '2rem',
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

export default HRSearchBox;