import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import { AddCircle, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUserTheme } from "./TorchyThemeProvider";
import EditIcon from '@mui/icons-material/Edit';

const TabellaHiring = ({ data, columns, getRowId }) => {
  const theme = useUserTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const handleExpandClick = (rowId) => {
    setExpanded(expanded === rowId ? null : rowId);
  };

  const handleAddClick = (rowId, tipoServizio) => {
    const normalizedServiceType = normalizeServiceType(tipoServizio);
    navigate(`aggiungi/${normalizedServiceType}/${rowId}`);
  };

  const normalizeServiceType = (serviceType) => {
    return serviceType.replace(/\s+/g, '_'); 
  };

  const columnsByServiceType = {
    "Head Hunting": ["RAL", "Rate"],
    "Recruiting": ["Fine Attività", "RAL", "Importo Fatturato"],
    "Temporary": ["Canone", "Importo Fatturato"],
    "Staffing": ["Inizio Attività", "Fine Attività", "Importo Fatturato"]
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

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `2px solid ${theme.palette.border.main}`,
        borderRadius: "20px",
        height: "auto",
        maxHeight: "80vh",
        boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)",
        width: '100%'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Nome Azienda</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tipo di Servizio</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            const columnsToShow = columnsByServiceType[row.tipoServizio.descrizione] || [];

            return (
              <React.Fragment key={getRowId(row)}>
                <TableRow>
                  <TableCell>{row.denominazioneCliente}</TableCell>
                  <TableCell>{row.tipoServizio.descrizione}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleExpandClick(getRowId(row))}>
                      {expanded === getRowId(row) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleAddClick(getRowId(row), row.tipoServizio.descrizione)}
                    >
                      <AddCircle sx={{ color: theme.palette.icon.main }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <Collapse in={expanded === getRowId(row)} timeout="auto" unmountOnExit>
                  <Paper
                    sx={{
                      margin: 1,
                      border: `2px solid ${theme.palette.border.main}`,
                      borderRadius: "20px",
                      padding: 2,
                      width: '132%'
                    }}
                  >
                    {row.schedeCandidato && row.schedeCandidato.length > 0 ? (
                      <Table>
                        <TableHead>
                          <TableRow>
                            {["Nome", "Cognome", "Ruolo"].concat(columnsToShow).map((colName) => (
                              <TableCell sx={{ fontWeight: "bold" }} key={colName}>{colName}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.schedeCandidato.map((candidato, index) => (
                            <TableRow key={index}>
                              <TableCell>{candidato.nomeCandidato}</TableCell>
                              <TableCell>{candidato.cognomeCandidato}</TableCell>
                              <TableCell>{candidato.descrizione}</TableCell>
                              {columnsToShow.includes("Inizio Attività") && <TableCell>{candidato.inizioAttivita}</TableCell>}
                              {columnsToShow.includes("Fine Attività") && <TableCell>{candidato.fineAttivita}</TableCell>}
                              {columnsToShow.includes("RAL") && <TableCell>{candidato.economics}</TableCell>}
                              {columnsToShow.includes("Rate") && <TableCell>{candidato.economics}</TableCell>}
                              {columnsToShow.includes("Canone") && <TableCell>{candidato.canoneMensile}</TableCell>}
                              {columnsToShow.includes("Importo Fatturato") && <TableCell>{candidato.fatturato}</TableCell>}
                              <TableCell>
                                <IconButton
                                  onClick={() => handleEditClick(getRowId(row), row.tipoServizio.descrizione, candidato.id)}
                                >
                                  <EditIcon sx={{ color: theme.palette.icon.black }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div>Nessun dato di candidato disponibile.</div>
                    )}
                  </Paper>
                </Collapse>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TabellaHiring;