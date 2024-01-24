// import React, { useState, useEffect }       from "react";
// import Button                               from "@mui/material/Button";
// import Select                               from "@mui/material/Select";
// import axios                                from "axios";

// import "../../styles/FatturazionePassiva.css";


// const FatturazionePassivaSearchBox2 = ({ data, onSearch, onReset, onSearchTextChange, OriginalFatturazionePassiva}) => {
//   const initialSearchTerm = {
//     fornitore: '',
//     stato: '',
//   };

//   const [ searchTerm,           setSearchTerm           ] = useState(initialSearchTerm);
//   const [ fornitoriOptions,     setFornitoriOptions     ] = useState([]);
//   const [ statoOptions,         setStatoOptions         ] = useState([]);
//   const [ filteredData,         setFilteredData         ] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {

//         const responseFornitori = await axios.get("http://localhost:8080/fornitori/react");
//         const responseStato     = await axios.get("http://localhost:8080/fatturazionePassiva/react/stato");
        
//         if (Array.isArray(responseStato.data)) {
//           setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
//         } 

//         if (Array.isArray(responseFornitori.data)) {
//           setFornitoriOptions(responseFornitori.data.map((fornitore) => ({ label: fornitore.denominazione, value: fornitore.id })));
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", responseFornitori.data);
//         } 
//       } catch (error) {
//         console.error("Errore durante il recupero dei dati:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     console.log("Valori di ricerca:", searchTerm);
//     console.log("Contenuto di Originale:", OriginalFatturazionePassiva);
//     const filteredData = data.filter(item =>
//       Object.keys(searchTerm).every(key =>
//         (key === 'fornitori' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
//         (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
//         String(item[key]).toLowerCase().includes(String(searchTerm[key]).toLowerCase())
//       )
//     );
//     console.log("Dati filtrati:", filteredData);
//     onSearch(filteredData);
//     setFilteredData(filteredData);
//   };
  

//   const handleReset = () => {
//     setSearchTerm(initialSearchTerm);
//     onSearchTextChange("");
//     onReset();
//     setFilteredData([]); 
//   };


//   return (
//     <div className="row1-col3-container">
//             {/* prima colonna */}
//             <div className="col">
//             <Select
//                   className="dropdown-menu"
//                   value={searchTerm.fornitore}
//                   onChange={e => setSearchTerm({...searchTerm, fornitori: e.target.value })}
//                   sx={{
//                     borderRadius: "40px",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                   }}
//                   native
//                 >
//                   <option value="" disabled>
//                     Fornitori
//                   </option>
//                   {fornitoriOptions.map((option) => (
//                     <option key={option.value} value={option.label}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//             </div>
//             {/* seconda colonna */}
//             <div className="col">
//             <Select
//                   className="dropdown-menu"
//                   value={searchTerm.stato}
//                   onChange={e => setSearchTerm({...searchTerm, stato: e.target.value })}
//                   sx={{
//                     borderRadius: "40px",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                   }}
//                   native
//                 >
//                   <option value="" disabled>
//                     Stato
//                   </option>
//                   {statoOptions.map((option) => (
//                     <option key={option.value} value={option.label}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//             </div>
//             {/* terza colonna */}
//             <div className="col-4">
//             <Button className="ripristina-link" onClick={handleReset}
//                 sx={{ 
//                   color: 'white', backgroundColor: 'black',
//                   width: "100%",
//                     maxWidth: "90px",
//                     height: "50px",
//                     borderRadius: "10px",
//                     fontSize: "0.8rem",
//                     fontWeight: "bolder",
//                     marginLeft: "20px",
//                     marginTop: "5px",
//                     padding: "0.5rem 1rem",
//                     "&:hover": {
//                       backgroundColor: "black",
//                       color: "white",
//                       transform: "scale(1.05)",
//                     },
//                   }}>
//                   Reset
//                 </Button>
//               <Button
//                 className="button-search"
//                 variant="contained"
//                 onClick={handleSearch}
//                 sx={{
//                   width: "90px",
//                   height: "50px",
//                   backgroundColor: "#ffb800",
//                   color: "black",
//                   borderRadius: "10px",
//                   fontSize: "0.8rem",
//                   fontWeight: "bolder",
//                   marginLeft: "20px",
//                   marginTop: "5px",
//                   padding: "0.5rem 1rem",
//                   "&:hover": {
//                     backgroundColor: "#ffb800",
//                     color: "black",
//                     transform: "scale(1.05)",
//                   },
//                 }}
//               >
//                 Cerca
//               </Button>
//             </div>
//           </div>
//   );
// };

// export default FatturazionePassivaSearchBox2;