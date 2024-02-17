// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   setOriginalInterviste,
//   setFilteredInterviste,
//   deleteIntervista,
// } from '../../store/slices/intervisteSlice';
// import MyDataGrid from '../../components/MyDataGrid';
// import { Button } from '@mui/material';
// import Sidebar from '../../components/Sidebar';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import DeleteButton from '../../components/button/DeleteButton';
// import axios from 'axios';
// import EditButton from '../../components/button/EditButton.jsx';
// import VisibilityButton from '../../components/button/VisibilityButton.jsx';
// import IntervisteSearchBox from '../../components/searchBox/IntervisteSearchBox.jsx';
// import MyButton from '../../components/MyButton.jsx';

// function Interviste() {
//   const dispatch = useDispatch();
//   const { interviste, originalInterviste, filteredInterviste } = useSelector((state) => state.interviste);
//   const { recruiting, originalRecruiting, filteredRecruiting } = useSelector((state) => state.recruiting);
//   const [specificRecruitingData, setSpecificRecruitingData] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     if (originalRecruiting && originalRecruiting.length > 0) {
//       const numericId = parseInt(id, 10);
//       const foundRecruitingData = originalRecruiting.find((c) => c.id === numericId);
//       setSpecificRecruitingData(foundRecruitingData);
//     }
//   }, [recruiting, id]);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://89.46.196.60:8443/intervista/react/mod/${id}`);
//         if (Array.isArray(response.data)) {
//           const intervisteConId = response.data.map((intervista) => ({ ...intervista }));
//           dispatch(setOriginalInterviste(intervisteConId));
//           dispatch(setFilteredInterviste(intervisteConId));
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", response.data);
//         }
//       } catch (error) {
//         console.error("Errore durante il recupero dei dati:", error);
//       }
//     };

//     fetchData();
//   }, [dispatch, id]);

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const navigateToAggiungiIntervista = () => {
//     navigate("/intervista/aggiungi", { state: { specificRecruitingData, id } });
//   };

//   const handleSearch = (filteredData) => {
//     setFilteredInterviste(filteredData);
//   };

//   const handleReset = () => {
//     setSearchText("");
//     setFilteredInterviste(originalInterviste);
//   };

//   const handleDelete = async (idToDelete) => {
//     try {
//       const response = await axios.delete(`http://89.46.196.60:8443/intervista/react/elimina/${idToDelete}`);
//       dispatch(deleteIntervista(idToDelete));
//     } catch (error) {
//       console.error("Errore durante l'eliminazione dell'intervista:", error);
//     }
//   };
  
// const table1 = [
//   // { field: "id", headerName: "Id", width: 70},
//   {
//     field: "stato",
//     headerName: "Stato",
//     width: 70,
//     renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.stato && params.row.stato.descrizione
//           ? params.row.stato.descrizione
//           : "N/A"}
//       </div>
//     ),
//   },
//   { field: "dataColloquio", headerName: "Data Colloquio", width: 150},
//   { field: "owner", headerName: "Intervistatore", width: 150,
// renderCell: (params) => (
//   <div style={{ textAlign: "start" }}>
//         {params.row.owner?.descrizione || "N/A"}
//       </div>
//     ),
// },
//   {
//     field: "dataAggiornamento",
//     headerName: (
//       <div style={{ lineHeight: '1' }}>
//         Follow Up <br /> Data Aggiornamento
//       </div>
//     ),
//     width: 150,
//     renderCell: (params) => (
//       <div style={{ textAlign: "start" }}>
//         {params.row.tipo?.descrizione || "N/A"}
//       </div>
//     ),
//   },
  
//    //dataAggiornamento e follo up si chiama intervista.tipo.descrizione
//   { field: "azioni",         headerName: "Azioni",          width: 800, renderCell: (params) => (
//     <div>
//       <Link
//       to={`/intervista/visualizza/${params.row.id}`}
     
// >
// <VisibilityButton  />
// </Link>
// <Link
// to={`/intervista/modifica/${params.row.id}`}

// >
// <EditButton />
// </Link>
      
//       <DeleteButton onClick={handleDelete} id={params.row.id}/>
//     </div>
//   ), },
// ];


// // const data1 = [
// //   { id: 1, stato: "Q.M.", dataColloquio: "2022-04-12", intervistatore: "RM", followUpDataAggiornamento: "Feedback"},

// // ];


//   return (
//     <div className="container">
//       <div className="content">
//         <div className="sidebar-container">
//           <Sidebar />
//         </div>
//         <div className="container">
//         <div className="containerTitle">
//                     <h1>{`Lista ITW di ${specificRecruitingData?.nome || ''} ${specificRecruitingData?.cognome || ''}`}</h1>
//                 </div>
//                 <MyButton onClick={navigateToAggiungiIntervista}>Aggiungi Intervista</MyButton>
//                 <IntervisteSearchBox data={interviste}
//           onSearch={handleSearch}
//           onReset={handleReset}
//           searchText={searchText}
//           onSearchTextChange={(text) => setSearchText(text)}
//           OriginalInterviste={originalInterviste}/>
//                 <MyDataGrid data={filteredInterviste} columns={table1} title="Interviste" getRowId={(row) => row.id} />
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

// export default Interviste;