import React from 'react';
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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const TabellaHiring2 = ({ data, columns }) => {
  const [expandedRows, setExpandedRows] = React.useState({});

  const handleRowExpandClick = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("data: ", data);

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `2px solid #00B400`,
        borderRadius: "20px",
        height: "auto",
        maxHeight: "80vh",
        boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)",
        width: '100%'
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        disableSelectionOnClick
        components={{
          Row: CustomRow,
        }}
        componentsProps={{
          row: {
            expandedRows,
            handleRowExpandClick,
          },
        }}
      />
    </TableContainer>
  );
};

const CustomRow = (props) => {
  const { id, row, expandedRows, handleRowExpandClick } = props;

  return (
    <>
      <Box component="div" {...props}>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => handleRowExpandClick(id)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={expandedRows[id]} timeout="auto" unmountOnExit>
        <Box margin={1}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service Type</TableCell>
                  <TableCell align="right">Add</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['Temporary', 'Head Hunting', 'Recruiting', 'Staffing'].map(
                  (serviceType) => (
                    <React.Fragment key={serviceType}>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {serviceType}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <AddCircleIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <Collapse
                        in={expandedRows[id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="subtitle1" gutterBottom>
                            Candidati per {serviceType}:
                          </Typography>
                          {row.schedeCandidato.map((scheda) => (
                            <Typography key={scheda.id}>
                              {scheda.nomeCandidato} {scheda.cognomeCandidato} -{' '}
                              {scheda.descrizione}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </>
  );
};

export default TabellaHiring2;
