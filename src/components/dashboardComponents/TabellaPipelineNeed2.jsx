// import React, { useState, useEffect } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TextField,
//     Button,
//     Typography,
//     Box,
// } from "@mui/material";
// import dayjs from "dayjs";
// import CustomDatePickerFilter from "../fields/CustomDatePickerFilter";
// const TabellaPipelineNeed2 = ({ data }) => {
//     const [filteredData, setFilteredData] = useState(data);
//     const [filtri, setFiltri] = useState({
//         id: "",
//         cliente: "",
//         data: "",
//         stato: "",
//         owner: "",
//     });
//     const [filtriAttivi, setFiltriAttivi] = useState(false);

//     useEffect(() => {
//         setFilteredData(data);
//     }, [data]);

//     const handleInputChange = (field, value) => {
//         setFiltri((prevFiltri) => ({
//             ...prevFiltri,
//             [field]: value,
//         }));
//     };

//     const applyFilters = () => {


//         const filteredRows = data.filter((row) => {
//             const matchId = !filtri.id || row.id?.toString().includes(filtri.id);
//             const matchCliente = !filtri.cliente || row.cliente?.denominazione?.toLowerCase().includes(filtri.cliente.toLowerCase());
//             const matchData = !filtri.data || dayjs(row.data).isSame(dayjs(filtri.data), "day");
//             const matchStato = !filtri.stato || row.stato?.toLowerCase().includes(filtri.stato.toLowerCase());
//             const matchOwner = !filtri.owner || row.owner?.descrizione?.toLowerCase().includes(filtri.owner.toLowerCase());

//             return matchId && matchCliente && matchData && matchStato && matchOwner;
//         });


//         setFilteredData(filteredRows);
//     };

//     const resetFilters = () => {
//         setFiltri({
//             id: "",
//             cliente: "",
//             data: "",
//             stato: "",
//             owner: "",
//         });
//         setFilteredData(data);
//     };

//     const toggleFiltri = () => {
//         setFiltriAttivi(!filtriAttivi);
//     };

//     return (
//         <Box>
//             <Button
//                 variant="contained"
//                 onClick={toggleFiltri}
//                 sx={{
//                     marginBottom: 2,
//                     backgroundColor: "#FDA03D",
//                     color: "white",
//                     fontWeight: "bold",
//                     "&:hover": {
//                         backgroundColor: "#FDA03D",
//                     },
//                 }}
//             >
//                 {filtriAttivi ? "Nascondi Filtri" : "Mostra Filtri"}
//             </Button>

//             <TableContainer
//                 sx={{
//                     borderRadius: "10px",
//                     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//                     overflowY: "auto",
//                     maxHeight: "60vh",
//                 }}
//             >
//                 <Table>
//                     <TableHead
//                         sx={{
//                             backgroundColor: "#f5f5f5",
//                             position: "sticky",
//                             top: 0,
//                             zIndex: 1,
//                         }}
//                     >
//                         <TableRow>
//                             <TableCell>
//                                 {filtriAttivi ? (
//                                     <TextField
//                                         label="ID"
//                                         size="small"
//                                         value={filtri.id}
//                                         onChange={(e) => handleInputChange("id", e.target.value)}
//                                     />
//                                 ) : (
//                                     <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                                         ID
//                                     </Typography>
//                                 )}
//                             </TableCell>
//                             <TableCell>
//                                 {filtriAttivi ? (
//                                     <TextField
//                                         label="Cliente"
//                                         size="small"
//                                         value={filtri.cliente}
//                                         onChange={(e) => handleInputChange("cliente", e.target.value)}
//                                     />
//                                 ) : (
//                                     <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                                         Cliente
//                                     </Typography>
//                                 )}
//                             </TableCell>
//                             <TableCell>
//                                 {filtriAttivi ? (
//                                     <CustomDatePickerFilter
//                                         name="data"
//                                         onDateChange={(value) => handleInputChange("data", value)}
//                                         values={filtri.data}
//                                         minDate="2020/01/01"
//                                     />
//                                 ) : (
//                                     <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                                         Data
//                                     </Typography>
//                                 )}
//                             </TableCell>
//                             <TableCell>
//                                 {filtriAttivi ? (
//                                     <TextField
//                                         label="Stato"
//                                         size="small"
//                                         value={filtri.stato}
//                                         onChange={(e) => handleInputChange("stato", e.target.value)}
//                                     />
//                                 ) : (
//                                     <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                                         Stato
//                                     </Typography>
//                                 )}
//                             </TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {filteredData.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={4} align="center">
//                                     <Typography variant="body2">Nessun dato disponibile</Typography>
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             filteredData.map((row) => (
//                                 <TableRow key={row.id}>
//                                     <TableCell>{row.id}</TableCell>
//                                     <TableCell>{row.cliente?.denominazione}</TableCell>
//                                     <TableCell>{row.data}</TableCell>
//                                     <TableCell>{row.stato}</TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {filtriAttivi && (
//                 <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
//                     <Button
//                         variant="contained"
//                         onClick={applyFilters}
//                         sx={{
//                             backgroundColor: "#FDA03D",
//                             color: "white",
//                             fontWeight: "bold",
//                         }}
//                     >
//                         Applica Filtri
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         onClick={resetFilters}
//                         sx={{
//                             borderColor: "#FDA03D",
//                             color: "#FDA03D",
//                             fontWeight: "bold",
//                         }}
//                     >
//                         Reset Filtri
//                     </Button>
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default TabellaPipelineNeed2;
