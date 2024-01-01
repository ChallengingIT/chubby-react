import React, { useState } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';

function FormComponent({ fields, campiObbligatori, onSubmit }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
    // Rimuove l'errore quando l'utente inizia a digitare.
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    campiObbligatori.forEach(field => {
      if (!values[field]) {

        tempErrors[field] = 'Campo obbligatorio';
      }
    });
    setErrors(tempErrors);
    console.log('Validating: ', tempErrors);
    return !Object.keys(tempErrors).length;
  };

  const handleSave = () => {
    console.log("non tutti i campi sono compilati");
    if (validate()) {
      
      console.log('Dati inviati:', values);
      // Qui puoi gestire l'invio dei dati al server.
    }
  };

  return (
    <form noValidate autoComplete="off">
      {fields.map((field, index) => (
        <div key={index}>
          {field.type === 'text' && (
            <TextField
              label={field.label}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
            />
          )}
          {field.type === 'select' && (
            <Select
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={!!errors[field.name]}
            >
              {/* Aggiungi qui le opzioni del menu. */}
              <MenuItem value="">None</MenuItem>
              {/* Altre MenuItem... */}
            </Select>
          )}
        </div>
      ))}
      <Button onClick={handleSave}>Salva</Button>
    </form>
  );
}

export default FormComponent;
