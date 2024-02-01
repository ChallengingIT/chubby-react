import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography 
} from '@mui/material';

const ComunicazioniCard = ({ fields, initialValues, tableTitle }) => {
  return (
    <Card style={{
      minWidth: "350px",
      minHeight: "250px",
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
          {tableTitle}
        </Typography>
        {fields.map((field) => (
          <div key={field.name} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginLeft: "20px" }}>
              {field.label}:
            </Typography>
            <Typography variant="body1">
              {initialValues[field.name]}
            </Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComunicazioniCard;
