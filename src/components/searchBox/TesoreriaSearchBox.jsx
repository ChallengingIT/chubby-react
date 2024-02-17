import React, { useState } from "react";
import Button              from "@mui/material/Button";
import Select              from "@mui/material/Select";

import "../../styles/Tesoreria.css";


function TesoreriaSearchBox() {
    const [ selectedValue, setSelectedValue ] = useState("");
    const [ initialState,  setInitialState  ]   = useState({
      annoRiferimento: "",
      SelezionaMese: "seleziona",
    });
  
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    const resetInputs = () => {
      setSelectedValue("");
      setInitialState({
        annoRiferimento: "",
        selezionaMese: "seleziona",
      });
    };
  return (
    <div className="row1-col3-container">
    {/* prima colonna */}
    <div className="col">
      <Select
        className="dropdown-menu"
        value={selectedValue}
        onChange={handleChange}
        sx={{
          borderRadius: "40px",
          fontSize: "0.8rem",
          textAlign: "start",
          color: "#757575",
        }}
        native
      >
        <option value="" disabled>
          Seleziona un Mese
        </option>
        <option value="Gennaio"       >Gennaio      </option>
        <option value="Febbraio"      >Febbraio     </option>
        <option value="Marzo"         >Marzo        </option>
        <option value="Aprile"        >Aprile       </option>
        <option value="Maggio"        >Maggio       </option>
        <option value="Giugno"        >Giugno       </option>
        <option value="Luglio"        >Luglio       </option>
        <option value="Agosto"        >Agosto       </option>
        <option value="Settembre"     >Settembre    </option>
        <option value="Ottobre"       >Ottobre      </option>
        <option value="Novembre"      >Novembre     </option>
        <option value="Dicembre"      >Dicembre     </option>
      </Select>
    </div>
    {/* seconda colonna */}
    <div className="col">
      <input style={{border: 'solid 1px #c4c4c4'}}
        type="number"
        class="text-form"
        placeholder="Anno di Riferimento"
        id="anno"
        maxLength="10"
        value={initialState.annoRiferimento}
          onChange={(e) => setInitialState({ ...initialState, annoRiferimento: e.target.value })}
      />
    </div>
    {/* terza colonna */}
    <div className="col-4">
    <Button className="ripristina-link" onClick={resetInputs}
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
        sx={{
          width: "90px",
          height: "50px",
          backgroundColor: "#ffb700",
          color: "black",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "bolder",
          marginLeft: "20px",
          marginTop: "5px",
          padding: "0.5rem 1rem",
          "&:hover": {
            backgroundColor: "#ffb700",
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

export default TesoreriaSearchBox;