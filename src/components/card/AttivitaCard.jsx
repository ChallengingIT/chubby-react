import React from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead, 
  TableRow, 
  Paper, 
  TableContainer 
} from '@mui/material';

const AttivitaCard = ({ columns, initialValues }) => {
  return (
    <Card style={{
      minWidth: "450px",
      minHeight: "450px",
      backgroundColor: "white",
      borderRadius: "40px",
      margin: "20px",
      boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)"
    }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{
            fontWeight: 'bold',
            color: "#808080",
            fontSize: "2.0rem",
            marginBottom: "20px",
            marginLeft: "20px",
          }}>
          Attività
        </Typography>

        {initialValues.length === 0 ? (
          <Typography variant="subtitle1" sx={{ marginLeft: "20px" }}>
            Non sono presenti Attività.
          </Typography>
        ) : (
        <TableContainer component={Paper} style={{ boxShadow: "none", borderRadius: "20px", maxHeight: "300px", overflowY: 'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell 
                    key={column.name} 
                    style={{ fontWeight: 'bold', padding: "6px 16px" }} // Removed borderBottom: "none"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {initialValues.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" style={{ padding: "6px 16px" }}> {/* Removed borderBottom: "none" */}
                    {row.owner}
                  </TableCell>
                  <TableCell style={{ padding: "6px 16px" }}>{row.data}</TableCell>
                  <TableCell style={{ padding: "6px 16px" }}>{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AttivitaCard;
