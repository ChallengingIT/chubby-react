import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const ReusablePopup = ({ 
  open, 
  title, 
  onClose, 
  onSave, 
  inizialValues = {},
  fields = [], 
  idTipoAttivita, 
  idAzienda, 
  idOwner, 
  idKeyPeople
 }) => {
  const [ values, setValues ] = useState(inizialValues || {});

  const handleChangePopup = (name) => (event) => {
    const { value } = event.target;
    setValues({ ...values, [name]: value });

  }


  const handleSaveClick = () => {
    const tipoAttivitaMap = {
      1: 'feed',
      2: 'email',
      3: 'phone'
    };
    const tipoAttivita = tipoAttivitaMap[idTipoAttivita] || 'non riconosciuto';
    onSave(values, tipoAttivita);
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
              value={values[field.name] || ''}
              onChange={handleChangePopup(field.name)}
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
          value={values[field.name] || null }
          onChange={handleChangePopup(field.name)}
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

        backgroundColor: '#14D928', 
        color: 'black', 
        fontWeight: 'bold',
        "&:hover": {
          backgroundColor: "#14D928",
          color: "black",
          transform: "scale(1.05)",
        },
      }}>Salva</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusablePopup;
