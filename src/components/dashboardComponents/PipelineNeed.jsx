    // import React, { useState, useEffect } from "react";
    // import axios from "axios";
    // import MoreHorizIcon from "@mui/icons-material/MoreHoriz"; //bottone per azioni

    // import {
    // Box,
    // Grid,
    // Skeleton,
    // } from "@mui/material";
    // import TabellaPipelineNeed from "./TabellaPipelineNeed";

    // const PipelineNeed = () => {
    // const [loading, setLoading] = useState(true);

    // //stati per il dialog
    // const [moreDialog, setMoreDialog] = useState(false);
    // const [selectedRow, setSelectedRow] = useState("");

    // const userHasRole = (role) => {
    //     const userString = sessionStorage.getItem("user");
    //     if (!userString) {
    //     return false;
    //     }
    //     const userObj = JSON.parse(userString);
    //     return userObj.roles.includes(role);
    // };

    // const user = JSON.parse(sessionStorage.getItem("user"));
    // const token = user?.token;

    // const headers = {
    //     Authorization: `Bearer ${token}`,
    // };

    // const pipelineData = [
    //     { id: 1, owner: 'Admin1', cliente: 'Cliente A', descrizione: 'Descrizione 1', priorita: '3', stato: 'Attivo' },
    //     { id: 2, owner: 'Admin2', cliente: 'Cliente B', descrizione: 'Descrizione 1', priorita: '3', stato: 'Attivo' },
    //     { id: 3, owner: 'Admin3', cliente: 'Cliente C', descrizione: 'Descrizione 1', priorita: '3', stato: 'Attivo' },
    //     { id: 4, owner: 'Admin4', cliente: 'Cliente D', descrizione: 'Descrizione 1', priorita: '3', stato: 'Attivo' },
    // ];

    // const columns = [
    //     { field: "owner", headerName: "Owner", flex: 0.6 },
    //     { field: "cliente", headerName: "Cliente", flex: 1 },
    //     { field: "descrizione", headerName: "Descrizione", flex: 1 },
    //     { field: "priorita", headerName: "Priorità", flex: 0.8 },
    //     { field: "stato", headerName: "Stato", flex: 0.8 },

    //     {
    //     field: "azione",
    //     headerName: "Azione",
    //     flex: 0.5,
    //     renderCell: (params) => (
    //         <Box>
    //         <MoreHorizIcon
    //             onClick={() => {
    //             setMoreDialog(true);
    //             setSelectedRow(params.row);
    //             }}
    //         />
    //         </Box>
    //     ),
    //     },
    // ];

    // useEffect(() => {
    //     // Simula il caricamento dei dati
    //     setTimeout(() => {
    //     setLoading(false);
    //     }, 1000);
    // }, []);

    // return (
    //     <Box sx={{ mr: 0.2 }}>
    //     {loading ? (
    //         <>
    //         {Array.from(new Array(1)).map((_, index) => (
    //             <Grid item xs={12} md={6} key={index}>
    //             <Box sx={{ marginRight: 2, marginBottom: 2 }}>
    //                 <Skeleton variant="rectangular" width="100%" height={118} />
    //                 <Skeleton variant="text" />
    //                 <Skeleton variant="text" />
    //                 <Skeleton variant="text" width="60%" />
    //             </Box>
    //             </Grid>
    //         ))}
    //         </>
    //     ) : (
    //         <TabellaPipelineNeed
    //         data={pipelineData}
    //         columns={columns}
    //         getRowId={(row) => row.id}
    //         />
    //     )}
    //     </Box>
    // );
    // };

    // export default PipelineNeed;
