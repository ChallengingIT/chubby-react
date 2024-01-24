import React, { useState } from "react";
import Button              from "@mui/material/Button";

import "../../styles/Fornitori.css";

const FornitoriSearchBox = ({ data, onSearch, onReset, onSearchTextChange, OriginalFornitori}) => {
  const initialSearchTerm = {
    ragioneSociale: '',
    referente: '',
    email: '',
  };

  const [ searchTerm,    setSearchTerm    ] = useState(initialSearchTerm);
  const [ filteredData,  setFilteredData  ] = useState([]);

  

  const handleSearch = () => {
    console.log("Valori di ricerca:", searchTerm);
    console.log("Contenuto di OriginalAziende:", OriginalFornitori);
    const filteredData = OriginalFornitori.filter(item =>
      Object.keys(searchTerm).every(key =>
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
    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>

    {/* prima colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="ragione"
        className="text-form"
        placeholder="Ragione Sociale"
        maxlength="90"
        value={searchTerm.denominazione}
        onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
      />

    {/* seconda colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="referente"
        className="text-form"
        placeholder="Referente"
        maxlength="45"
        value={searchTerm.referente}
        onChange={(e) => setSearchTerm({ ...searchTerm, referente: e.target.value })}
      />

    {/* terza colonna */}
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="email"
        id="email"
        className="text-form"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        maxlength="45"
        placeholder="Email Fornitore"
        value={searchTerm.email}
        onChange={(e) => setSearchTerm({ ...searchTerm, email: e.target.value })}
      />
    {/* quarta colonna */}
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

export default FornitoriSearchBox;