import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AttivitaTable = ({ activities }) => {
  return (
    <TableContainer component={Paper} style={{ borderRadius: "40px", boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Attività</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                Nota di {activity.owner}
                <div style={{ fontWeight: 'normal' }}>{activity.commento}</div>
              </TableCell>
              <TableCell align="right">{new Date(activity.data).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttivitaTable;
