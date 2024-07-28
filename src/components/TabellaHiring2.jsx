import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Collapse,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  Button,
  Modal
} from '@mui/material';
import { AddCircle, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useUserTheme } from "./TorchyThemeProvider";
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useTranslation } from "react-i18next"; 

const serviceColumns = {
  "Head Hunting": ["RAL"],
  "Recruiting": ["RAL", "Importo Fatturato"],
  "Temporary": ["Canone", "Importo Fatturato", "Rate"],
  "Staffing": ["Inizio Attività", "Fine Attività", "Importo Fatturato", "Rate"]
};

const columnMappings = {
  "RAL": "ral",
  "Importo Fatturato": "fatturato",
  "Canone": "canoneMensile",
  "Rate": "rate",
  "Inizio Attività": "inizioAttivita",
  "Fine Attività": "fineAttivita"
};

const TabellaHiring2 = ({ data, columns, getRowId }) => {
  const [expanded, setExpanded] = useState(null);
  const [innerExpanded, setInnerExpanded] = useState({});
  const [opendDeleteDialog, setOpenDeleteDialog ] = useState(false);
  const [idScheda, setIdScheda] = useState([]);
  const theme = useUserTheme();
  const navigate = useNavigate();
  const { t } = useTranslation(); 


  const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

  const handleExpandClick = (rowId) => {
    setExpanded(expanded === rowId ? null : rowId);
  };

  const handleInnerExpandClick = (parentId, service) => {
    setInnerExpanded((prev) => ({
      ...prev,
      [parentId]: prev[parentId] === service ? null : service,
    }));
  };

  const normalizeServiceType = (serviceType) => {
    return serviceType.replace(/\s+/g, '_'); 
  };

  const handleAddClick = (rowId, service) => {
    const normalizedServiceType = normalizeServiceType(service);
    navigate(`aggiungi/${normalizedServiceType}/${rowId}`); 
  };

  const handleEditClick = (rowId, tipoServizio, candidatoId) => {
    const normalizedServiceType = normalizeServiceType(tipoServizio);
    if (!normalizedServiceType || rowId === undefined || candidatoId === undefined) {
      console.error("Missing data for navigation");
      return;
    }

    const editUrl = `/hiring/modifica/${normalizedServiceType}/${rowId}/${candidatoId}`;
    navigate(editUrl);
  };

  const handleDeleteClick = (event, idScheda) => {
    console.log("idSchedaprimo: ", idScheda);
    setOpenDeleteDialog(true);
    setIdScheda(idScheda);
  };

  const handleCloseModalDelete = (event) => {
    setOpenDeleteDialog(false);
};

  const handleDeleteScheda = async(idScheda) => {
    console.log("idScheda: ", idScheda);
    try {
      const responseDelete = await axios.post("http://localhost:8080/hiring/elimina/scheda", {
        headers: headers,
        params: { idScheda: idScheda }
      })
    } catch(error) {
      console.error("Errore durante l'eliminazione della scheda candidato: ", error);
    }

  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `2px solid ${theme.palette.border.main}`,
        borderRadius: "20px",
        height: "auto",
        minHeight: '80vh',
        maxHeight: "80vh",
        boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)",
        width: '100%'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ width: '100%', fontWeight: "bold", borderBottom: '2px solid #aaaaaa', fontSize: 20 }}>
                {column.headerName}
              </TableCell>
            ))}
            <TableCell sx={{ width: '100%', borderBottom: '2px solid #aaaaaa' }}/>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            const rowId = getRowId(row);
            return (
              <React.Fragment key={rowId}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: 500}}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                  <TableCell >
                    <IconButton onClick={() => handleExpandClick(rowId)} sx={{ '&:hover': { bgcolor: 'transparent', transform: 'scale(1.1)'}}}>
                      {expanded === rowId ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={columns.length + 1} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: '2px solid #ccc7c7' }}>
                    <Collapse in={expanded === rowId} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        {/* le 4 righe dei 4 servizi per ogni azienda */}
                        <Table>
                          <TableBody>
                            {row.tipiServizio.map((service) => (
                              <React.Fragment key={service.id}>
                                <TableRow>
                                  <TableCell sx={{ width: '100%', fontWeight: 'bold'}}>{service.descrizione}</TableCell>
                                  <TableCell >
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2}}>
                                      <IconButton
                                        onClick={() => handleAddClick(getRowId(row), service.descrizione)}
                                      >
                                        <AddCircle sx={{ color: theme.palette.icon.main }} />
                                      </IconButton>
                                      <IconButton onClick={() => handleInnerExpandClick(rowId, service.descrizione)} sx={{ '&:hover': { bgcolor: 'transparent', transform: 'scale(1.1)'}}}>
                                        {innerExpanded[rowId] === service.descrizione ? <ExpandLess /> : <ExpandMore />}
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell colSpan={2} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                    <Collapse in={innerExpanded[rowId] === service.descrizione} timeout="auto" unmountOnExit>
                                      <Box margin={1}>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell>Nome</TableCell>
                                              <TableCell>Cognome</TableCell>
                                              <TableCell>Ruolo</TableCell>
                                              {serviceColumns[service.descrizione].map((col) => (
                                                <TableCell key={col}>{col}</TableCell>
                                              ))}
                                              <TableCell></TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {row.schedeCandidato.filter(scheda => scheda.tipoServizio && scheda.tipoServizio.descrizione === service.descrizione).map((scheda) => (
                                              <TableRow key={scheda.id}>
                                                <TableCell>{scheda.nomeCandidato}</TableCell>
                                                <TableCell>{scheda.cognomeCandidato}</TableCell>
                                                <TableCell>{scheda.descrizione}</TableCell>
                                                {serviceColumns[service.descrizione].map((col) => (
                                                  <TableCell key={col}>{scheda[columnMappings[col]]}</TableCell>
                                                ))}
                                                <TableCell>
                                                <IconButton
                                                  onClick={() => handleEditClick(getRowId(row), scheda.tipoServizio.descrizione, scheda.id)}
                                                  sx={{ '&:hover': { bgcolor: 'transparent'}}}
                                                >
                                                  <EditIcon sx={{ color: theme.palette.icon.black, '&:hover': { color: 'black'} }} />
                                                </IconButton>
                                                <IconButton
                                                    onClick={(event) => handleDeleteClick(event, scheda.id)}
                                                    sx={{ '&:hover': { bgcolor: 'transparent'}}}
                                                >
                                                  <DeleteIcon sx={{ color: theme.palette.icon.black, '&:hover': { color: 'black'} }} />
                                                </IconButton>
                                                  
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      <Modal
                open={opendDeleteDialog}
                onClose={handleCloseModalDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClick={(event) => event.stopPropagation()}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                        width: "40vw",
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('Sei sicuro di voler eliminare la scheda candidato?')}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 3,
                        }}
                    >
                        <Button
                            onClick={handleCloseModalDelete}
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                borderRadius: "5px",
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            {t('Indietro')}
                        </Button>
                        <Button
                            onClick={() => handleDeleteScheda(idScheda)}
                            sx={{
                                backgroundColor: "#00B401",
                                color: "white",
                                borderRadius: "5px",
                                "&:hover": {
                                    backgroundColor: "#019301",
                                    color: "white",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            {t('Conferma')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
    </TableContainer>
  );
};

export default TabellaHiring2;
