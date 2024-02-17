// import React, { useEffect, useState}            from 'react'
// import MyDataGrid                               from '../../components/MyDataGrid';
// import Sidebar                                  from '../../components/Sidebar';
// import { Button }                               from '@mui/material';
// import { useParams }                            from 'react-router-dom';
// import { useNavigate}                           from "react-router-dom";
// import { Link }                                 from "react-router-dom";
// import axios                                    from 'axios';
// import AssociazioniSearchBox                    from '../../components/searchBox/AssociazioniSearchBox.jsx';

// function Associazioni() {
//   const navigate = useNavigate();
//   const params   = useParams();
//   const { id, nome, nomeAzienda } = params;


//   const [searchText,                setSearchText              ] = useState("");
//   const [filteredAssociabili,       setFilteredAssociabili     ] = useState([]);
//   const [originalAssociabili,       setOriginalAssociabili     ] = useState([]);
//   const [associatiOptions,          setAssociatiOptions        ] = useState([]);


//     const user = JSON.parse(localStorage.getItem("user"));
//     const accessToken = user?.accessToken;

//     const headers = {
//       Authorization: `Bearer ${accessToken}`
//     };

//   const navigateToDettaglioKeyPeople = (nome) => {
//     navigate(`/keyPeople/dettaglio/${nome}`);
//   };
  
//   const fetchData = async () => {
//     try {
//       const associabiliResponse = await axios.get(`http://89.46.196.60:8443/associazioni/react/match/associabili/${id}`, { headers });
//       const associatiResponse   = await axios.get(`http://89.46.196.60:8443/need/react/match/associati/${id}`, { headers });

//       if (Array.isArray(associatiResponse.data)) {
//         const associatiConId = associatiResponse.data.map((associati) => ({ ...associati }));
//         setAssociatiOptions(associatiConId);
//       } else {
//         console.error("I dati ottenuti non sono nel formato Array:", associatiResponse.data);
//       }
//       if (Array.isArray(associabiliResponse.data)) {
//         const associabiliConId = associabiliResponse.data.map((associabili) => ({ ...associabili }));
//         setFilteredAssociabili(associabiliConId);
//         setOriginalAssociabili(associabiliConId);
//       } else {
//         console.error("I dati ottenuti non sono nel formato Array:", associabiliResponse.data);
//       }
//     } catch (error) {
//       console.error("Errore durante il recupero dei dati:", error);
//     }
//   };
  

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleGoBack = () => {
//     window.history.back(); 
//   };


//   const handleAssocia = async (row) => {
//     try {
//       const idNeed = parseInt(id); 
//       const idCandidato = row.id;
//       const url = `http://89.46.196.60:8443/associazioni/react/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
//       const response = await axios.post(url, { headers });
//       fetchData();
//     } catch (error) {
//       console.error("Errore durante il recupero dei dati:", error);
//     }
//   };



//   const tableAssociabili = [
//     { field: "cliente",             headerName: "Cliente",                            flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "left"  }}>
//           <Link
//         to={`/staffing/ricerca/${params.row.email}`}
//         onClick={() => navigateToDettaglioKeyPeople(params.row.nome)}
//       >
//         {params.row.nome} {params.row.cognome}
//       </Link>
//     </div>
//       ),},
//     { field: "email",                 headerName: "Descrizione",                        flex: 1},
//     { field: "tipologia",             headerName: "Priorità",                           flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.tipologia && params.row.tipologia.descrizione
//           ? params.row.tipologia.descrizione
//           : "N/A"}
//       </div>
//     ),},
//     { field: "rating",                headerName: "Stato",                              flex: 1},
//     { field: "stato",                 headerName: "Week",                              flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.stato && params.row.stato.descrizione
//           ? params.row.stato.descrizione
//           : "N/A"}
//       </div>
//     ),},
//     { field: "azioni",                headerName: "Azioni",                             flex: 1, renderCell: (params) => (
//       <div>
//         <Button
//           onClick={() => handleAssocia(params.row)}
//           sx={{ 
//             backgroundColor: '#FFB800',
//             color: 'white',
//             "&:hover": {
//               backgroundColor: "#ffb800",
//               transform: "scale(1.05)",
//               color: 'white',
//             },
//       }}>Associa</Button>
//       </div>
//     )},
//   ];



//   const tableAssociati = [
//     { field: "nome",                   headerName: "Cliente",                             flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "left"  }}>
//           <Link
//         to={`/staffing/ricerca/${params.row.email}`}
//         onClick={() => navigateToDettaglioKeyPeople(params.row.nome)}
//       >
//         {params.row.nome} {params.row.cognome}
//       </Link>
    
//     </div>
//       ),},
//     { field: "email",                   headerName: "Need",                                flex: 1},
//     { field: "tipologia",               headerName: "Priorità",                            flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.tipologia && params.row.tipologia.descrizione
//           ? params.row.tipologia.descrizione
//           : "N/A"}
//       </div>
//     ),},
//     { field: "stato",                   headerName: "Stato",                               flex: 1, renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.stato && params.row.stato.descrizione
//           ? params.row.stato.descrizione
//           : "N/A"}
//       </div>
//     ),},
//     { field: "dataUltimoContatto",      headerName: "Week",                                 flex: 1},
//   ];

//   return (
//     <div className="container">
//       <div className="content">
//         <div className="sidebar-container">
//           <Sidebar />
//         </div>
//         <div className="container">
//         <div className="containerTitle">
//                     <h1>{`Lista match per ${nome} `}</h1>
//                 </div>
//                 <AssociazioniSearchBox/>
//                 <MyDataGrid data={filteredAssociabili} columns={tableAssociabili} title="Need Associabili" getRowId={(row) => row.id} />
//                 <MyDataGrid data={associatiOptions}    columns={tableAssociati}   title="Need Associati"   getRowId={(row) => row.id} />
//             <Button
//           color="primary"
//           onClick={handleGoBack}
//           sx={{
//             backgroundColor: "black",
//             borderRadius: '40px',
//             color: "white",
//             width: '250px',
//             height: '30px', 
//             margin: 'auto',
//             marginBottom: '20px',
//             marginTop: 'auto',
//             "&:hover": {
//               backgroundColor: "black",
//               transform: "scale(1.05)",
//             },
//           }}
//         >
//           Indietro
//         </Button>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Associazioni;