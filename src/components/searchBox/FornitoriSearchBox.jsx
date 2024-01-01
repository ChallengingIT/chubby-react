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
    <div className="row-container">
    {/* prima colonna */}
    <div className="col">
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="ragione"
        className="text-form"
        placeholder="Ragione Sociale"
        maxlength="90"
        value={searchTerm.denominazione}
        onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
      />
    </div>

    {/* seconda colonna */}
    <div className="col">
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="text"
        id="referente"
        className="text-form"
        placeholder="Referente"
        maxlength="45"
        value={searchTerm.referente}
        onChange={(e) => setSearchTerm({ ...searchTerm, referente: e.target.value })}
      />
    </div>

    {/* terza colonna */}
    <div className="col">
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
    </div>
    {/* quarta colonna */}
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
          width: "100%",
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

export default FornitoriSearchBox;