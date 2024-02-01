import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Link 
} from '@mui/material';

const ContattiCard = ({ fields, initialValues, tableTitle }) => {
  const renderContactField = (field, value) => {
    switch (field.name) {
      case 'email':
        return <Link href={`mailto:${value}`} color="blue" underline="hover">{value}</Link>;
      case 'cellulare':
        return <Link href={`tel:${value}`} color="blue" underline="hover">{value}</Link>;
      default:
        return value;
    }
  };

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
          {tableTitle}
        </Typography>

        {initialValues.length === 0 ? (
          <Typography variant="subtitle1" sx={{ marginLeft: "20px" }}>
            Il cliente non ha contatti.
          </Typography>
        ) : (
          initialValues.map((contact, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              {fields.map((field) => (
                <Typography key={field.name} variant="subtitle1" sx={{ display: 'block', fontSize: '1.2rem', fontWeight: field.name === 'label' ? 'bold' : 'normal', marginLeft: '20px' }}>
                  {field.label}: {renderContactField(field, contact[field.name])}
                </Typography>
              ))}
              {index < initialValues.length - 1 && <hr style={{ margin: "8px 0" }} />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ContattiCard;
