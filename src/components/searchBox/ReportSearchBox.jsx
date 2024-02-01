import React, { useState, useEffect }         from "react";
import axios                                  from "axios";
import Button                                 from "@mui/material/Button";
import Select                                 from "@mui/material/Select";

import "../../styles/Aziende.css";

const ReportSearchBox = ({ data, onSearch, onReset, OriginalAziende }) => {
const initialSearchTerm = {
    anno: '',
    dal: '',
    mese: '',
    al:'',
};

const [ searchTerm,          setSearchTerm        ] = useState(initialSearchTerm);
const [ filteredData,        setFilteredData      ] = useState([]);


const handleSearch = () => {
    const filteredData = OriginalAziende.filter((item) =>
    Object.keys(searchTerm).every((key) =>
        searchTerm[key] === '' ||
        (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
        String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
    )
    );
    onSearch(filteredData);
    setFilteredData(filteredData);
};

const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onReset();
    setFilteredData([]);
};


const annoOptions = Array.from({ length: 31 }, (_, index) => 2021 + index);


return (
    <div className="row2-col3-container">
            {/* prima colonna */}
            <div className="col">
            <div className="row">
            <Select
            className="dropdown-menu"
            value={searchTerm.anno}
            onChange={e => setSearchTerm({...searchTerm, anno: e.target.value })}
            sx={{
                borderRadius: "40px",
                fontSize: "0.8rem",
                textAlign: "start",
                color: "#757575",
            }}
            native
        >
            <option value="" disabled>Anno</option>
            {annoOptions.map((anno) => (
            <option key={anno} value={anno}>{anno}</option>
            ))}
        </Select>
                
            
            </div>
            <div className="row">
            <Select
                className="dropdown-menu"
                value={searchTerm.status || ""} 
                onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
                sx={{
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                }}
                native
                >
                <option value="" disabled>
                    Mese
                </option>
                <option value={1}>Gennaio</option>
                <option value={2}>Febbraio</option>
                <option value={3}>Marzo</option>
                <option value={4}>Aprile</option>
                <option value={5}>Maggio</option>
                <option value={6}>Giugno</option>
                <option value={7}>Luglio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Settembre</option>
                <option value={10}>Ottobre</option>
                <option value={11}>Novembre</option>
                <option value={12}>Dicembre</option>
                </Select>

            </div>
            </div>
            {/* seconda colonna */}
            <div className="col">
            <div className="row">
            <input style={{border: 'solid 1px #c4c4c4'}}
                type="number"
                placeholder="Dal"
                className="text-form"
                value={searchTerm.dal}
                onChange={(e) => setSearchTerm({ ...searchTerm, dal: e.target.value })}
                />


            </div>
            <div className="row">
            <input style={{border: 'solid 1px #c4c4c4'}}
                type="number"
                placeholder="Al"
                className="text-form"
                value={searchTerm.al}
                onChange={(e) => setSearchTerm({ ...searchTerm, al: e.target.value })}
                />
            </div>
            </div>
            {/* terza colonna */}
            <div className="col-button" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',

            }}>
            <div className="row-button" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Button
                className="button-search"
                variant="contained"
                onClick={handleSearch}
                sx={{
                    width: '90px',
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
            </div>
            <div className="row">
                <Button className="ripristina-link" onClick={handleReset}
            sx={{ 
                color: 'white', backgroundColor: 'black',
                
                width: "90px",
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
        </div>
);
};

export default ReportSearchBox;
