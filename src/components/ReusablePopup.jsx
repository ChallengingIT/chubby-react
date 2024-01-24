import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const ReusablePopup = ({ open, title, onClose, onSave, fields = [], idTipoAttivita, idAzienda, idOwner, idKeyPeople }) => {
  const [popupData, setPopupData] = React.useState({});


  const handleChange = (e) => {
    setPopupData({ ...popupData, [e.target.name]: e.target.value });
  };
  const handleSaveClick = () => {
    const tipoAttivitaMap = {
      1: 'feed',
      2: 'email',
      3: 'phone'
    };
    const tipoAttivita = tipoAttivitaMap[idTipoAttivita] || 'non riconosciuto';
    onSave(popupData, tipoAttivita);
    onClose();
  };
  

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              style={{ width: "100%", textAlign: "left" }}
              name={field.name}
              value={popupData[field.name] || ''}
              onChange={handleChange}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'note':
        return (
          <TextField
            name={field.name}
            label={field.label}
            value={popupData[field.name] || ''}
            onChange={handleChange}
            margin="dense"
            fullWidth
            multiline
          />
        );
      default:
        return null;
    }
  };



  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={field.type === 'note' ? 12 : 6} key={index}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} 
        sx={{ 
          backgroundColor: 'black', 
        color: 'white',
        "&:hover": {
          backgroundColor: "black",
          transform: "scale(1.05)",
        },
      }}>Annulla</Button>
        <Button onClick={handleSaveClick} 
        sx={{ 

        backgroundColor: '#fbb800', 
        color: 'black', 
        fontWeight: 'bold',
        "&:hover": {
          backgroundColor: "#fbb800",
          color: "black",
          transform: "scale(1.05)",
        },
      }}>Salva</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusablePopup;
