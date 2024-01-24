// import React, { useState, useEffect }         from "react";
// import axios                                  from "axios";
// import Button                                 from "@mui/material/Button";
// import Select                                 from "@mui/material/Select";

// import "../../styles/Aziende.css";
// import userService from "../../services/user.service.js";

// const AziendeSearchBox2 = ({ data, onSearch, onReset, onSearchTextChange, OriginalAziende }) => {
//   const initialSearchTerm = {
//     denominazione: '',
//     tipologia: '',
//     status: '',
//     owner:'',
//   };


//   const accessToken = localStorage.getItem("accessToken"); // Ottieni l'accessToken dal localStorage
// // console.log("accessToken: ", accessToken);
// // Configura l'header "Authorization" con l'accessToken
// const headers = {
//   Authorization: `Bearer ${accessToken}`,
// };

//   const [ searchTerm,          setSearchTerm        ] = useState(initialSearchTerm);
//   const [ ownerOptions,        setOwnerOptions      ] = useState([]);
//   const [ tipologiaOptions,    setTipologiaOptions  ] = useState([]);
//   const [ statoOptions,        setStatoOptions      ] = useState([]);
//   const [ filteredData,        setFilteredData      ] = useState([]);

//   const convertStatus = (data) => {
//   if (data && data.status) {
//     const numericalStatus = data.status;
//     switch (numericalStatus) {
//       case 1:
//         return 'Verde';
//       case 2:
//         return 'Giallo';
//       case 3:
//         return 'Rosso';
//       default:
//         return 'Sconosciuto';
//     }
//   }

//   return 'Sconosciuto';
// };

  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const responseOwner = await userService.get("aziende/react/owner", {
//           headers: headers,
//         });
//         const responseStato = await userService.get("aziende/react", { 
//           headers: headers,
//         });

//     if (Array.isArray(responseStato.data)) {
//       const statoOptionsData = responseStato.data.map((status) => ({
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
//       } catch (error) {
//         console.error("Errore durante il recupero dei dati:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSearch = () => {
//     console.log("Valori di ricerca:", searchTerm);
//     const filteredData = OriginalAziende.filter((item) =>
//       Object.keys(searchTerm).every((key) =>
//         searchTerm[key] === '' ||
//         (key === 'owner' && item[key]?.descrizione?.toLowerCase().includes(String(searchTerm[key]).toLowerCase())) ||
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
//     <div className="row2-col3-container">
//             {/* prima colonna */}
//             <div className="col">
//               <div className="row">
//                 <input style={{border: 'solid 1px #c4c4c4'}}
//                   type="text"
//                   placeholder="Ragione Sociale"
//                   className="text-form"
//                   value={searchTerm.denominazione}
//                   onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
//                 />
//               </div>
//               <div className="row">
//               <Select
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
//                   Owner
//                   </option>
//                   {ownerOptions.map((option) => (
//                     <option key={option.value} value={option.label}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//               </div>
//             </div>
//             {/* seconda colonna */}
//             <div className="col">
//               <div className="row">
//               <Select
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


//               </div>
//               <div className="row">
//               <Select
//                   className="dropdown-menu"
//                   value={searchTerm.tipologia}
//                   onChange={(e) => setSearchTerm({...searchTerm, tipologia: e.target.value })}
//                   sx={{
//                     borderRadius: "40px",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                   }}
//                   native
//                 >
//                   <option value="" disabled>
//                     Tipologia
//                   </option>
//                   <option value="Cliente">Cliente</option>
//                   <option value="Prospect">Prospect</option>
//                   <option value="Consulenza">Consulenza</option>
                
//                 </Select>
//               </div>
//             </div>
//             {/* terza colonna */}
//             <div className="col-button" style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexDirection: 'column',
//               gap: '20px',

//               }}>
//               <div className="row-button" style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//                 <Button
//                   className="button-search"
//                   variant="contained"
//                   onClick={handleSearch}
//                   sx={{
//                     width: '90px',
//                     height: "40px",
//                     backgroundColor: "#ffb800",
//                     color: "black",
//                     borderRadius: "10px",
//                     fontSize: "0.8rem",
//                     fontWeight: "bolder",
//                     // marginLeft: "20px",
//                     // padding: "0.5rem 1rem",
//                     // marginBottom: '10px',
//                     "&:hover": {
//                       backgroundColor: "#ffb800",
//                       color: "black",
//                       transform: "scale(1.05)",
//                     },
//                   }}
//                 >
//                   Cerca
//                 </Button>
//               </div>
//               <div className="row">
//                 <Button className="ripristina-link" onClick={handleReset}
//               sx={{ 
//                   color: 'white', backgroundColor: 'black',
//                   width: "100%",
//                     width: "90px",
//                     height: "40px",
//                     borderRadius: "10px",
//                     fontSize: "0.8rem",
//                     fontWeight: "bolder",
//                     // marginLeft: "20px",
//                     // marginTop: "5px",
//                     // padding: "0.5rem 1rem",
//                     "&:hover": {
//                       backgroundColor: "black",
//                       color: "white",
//                       transform: "scale(1.05)",
//                     },
//                   }}>
//                   Reset
//                 </Button>
//               </div>
//             </div>
//           </div>
//   );
// };

// export default AziendeSearchBox2;
