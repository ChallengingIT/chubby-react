// import React, { useState, useEffect }     from "react";
// import Button                             from "@mui/material/Button";
// import Select                             from "@mui/material/Select";
// import axios                              from "axios";

// import "../../styles/KeyPeople.css";


// const KeyPeopleSearchBox2 = ({ data, onSearch, onReset, onSearchTextChange, OriginalKeypeople }) => {

//   const initialSearchTerm = {
//     owner: '',
//     cliente: '',
//     status: '',
//   };

//   const [statoOptions, setStatoOptions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
//   const [clienteOptions, setClienteOptions] = useState([]);
//   const [ownerOptions, setOwnerOptions] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   const convertStatus = (data) => {
//     // console.log("Dati per la conversione dello status:", data);
  
//     if (data && data.status) {
//       const numericalStatus = data.status;
//       // console.log("Valore numerico dello status:", numericalStatus);
  
//       switch (numericalStatus) {
//         case 1:
//           return 'Verde';
//         case 2:
//           return 'Giallo';
//         case 3:
//           return 'Rosso';
//         default:
//           return 'Sconosciuto';
//       }
//     }
  
//     return 'Sconosciuto';
//   };



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
// // Recupera l'accessToken da localStorage
// const user = JSON.parse(localStorage.getItem("user"));
// const accessToken = user?.accessToken;

// // Configura gli headers della richiesta con l'Authorization token
// const headers = {
//   Authorization: `Bearer ${accessToken}`
// };
//         const responseCliente = await axios.get("http://localhost:8080/aziende/react", { headers });
//         const responseOwner = await axios.get("http://localhost:8080/aziende/react/owner", { headers });
//         const responseStato = await axios.get("http://localhost:8080/aziende/react", { headers });
//     if (Array.isArray(responseStato.data)) {
//       const statoOptionsData = responseStato.data.map((status, index) => ({
//         label: convertStatus(status),
//         value: status,
//       }));
  
//       setStatoOptions(statoOptionsData);
//       if (!searchTerm.status && searchTerm.status !== "") {
//         setSearchTerm({ ...searchTerm, status: "" });
//       }
//     } else {
//       console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
//     }
        
//         if (Array.isArray(responseOwner.data)) {
//           setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
//         } 

//         if (Array.isArray(responseCliente.data)) {
//           setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", responseCliente.data);
//         } 
//       } catch (error) {
//         console.error("Errore durante il recupero dei dati:", error);
//       }
//     };

//     fetchData();
//   }, []);


//   const handleSearch = () => {
//     console.log("Valori di ricerca:", searchTerm);
//     console.log("Contenuto originale: ", OriginalKeypeople);
//     const filteredData = OriginalKeypeople.filter(item =>
//       Object.keys(searchTerm).every(key =>
//         searchTerm[key] === '' ||
//         (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
//         (key === 'stato' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
//         (key === 'cliente' && item[key]?.denominazione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
//     <div className="row-container">
//     {/* prima colonna */}
//     <div className="col">
//     <Select
//                   className="dropdown-menu"
//                   value={searchTerm.owner}
//                   onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
//                   sx={{
//                     borderRadius: "40px",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                   }}
//                   native
//                 >
//                   <option value="" disabled>
//                     Owner
//                   </option>
//                   {ownerOptions.map((option) => (
//                     <option key={option.value} value={option.label}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//     </div>
//     {/* seconda colonna */}
//     <div className="col">
//     <Select
//                   className="dropdown-menu"
//                   value={searchTerm.cliente}
//                   onChange={e => setSearchTerm({...searchTerm, cliente: e.target.value })}
//                   sx={{
//                     borderRadius: "40px",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                   }}
//                   native
//                 >
//                   <option value="" disabled>
//                     Azienda
//                   </option>
//                   {clienteOptions.map((option) => (
//                     <option key={option.value} value={option.label}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//     </div>
//     {/* terza colonna */}
//     <div className="col">
//     <Select
//   className="dropdown-menu"
//   value={searchTerm.status}
//   onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
//   sx={{
//     borderRadius: "40px",
//     fontSize: "0.8rem",
//     textAlign: "start",
//     color: "#757575",
//   }}
//   native
// >
//   <option value="" disabled>
//     Stato
//   </option>
//   <option value={1}>Verde</option>
//   <option value={2}>Giallo</option>
//   <option value={3}>Rosso</option>
// </Select>

//     </div>
//     {/* quarta colonna */}
//     <div className="col-4">
//     <Button className="ripristina-link" onClick={handleReset}
//         sx={{ 
//           color: 'white', backgroundColor: 'black',
//           width: "100%",
//             maxWidth: "90px",
//             height: "50px",
//             borderRadius: "10px",
//             fontSize: "0.8rem",
//             fontWeight: "bolder",
//             marginLeft: "20px",
//             marginTop: "5px",
//             padding: "0.5rem 1rem",
//             "&:hover": {
//               backgroundColor: "black",
//               color: "white",
//               transform: "scale(1.05)",
//             },
//           }}>
//           Reset
//         </Button>
//       <Button
//         // className="button-search"
//         variant="contained"
//         onClick={handleSearch}
//         sx={{
//           width: "100%",
//           height: "50px",
//           backgroundColor: "#ffb800",
//           color: "black",
//           borderRadius: "10px",
//           fontSize: "0.7rem",
//           fontWeight: "bolder",
//           marginLeft: "20px",
//           marginTop: "5px",
//           padding: "0.5rem 1rem",
//           "&:hover": {
//             backgroundColor: "#ffb800",
//             color: "black",
//             transform: "scale(1.05)",
//           },
//         }}
//       >
//         Cerca
//       </Button>
//     </div>
//   </div>
//   );
// };


// export default KeyPeopleSearchBox2;