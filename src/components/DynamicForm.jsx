import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
} from '@mui/material';

const DynamicForm = ({ fields }) => {
  const [formData,       setFormData] = useState({});
  const [errors,         setErrors  ] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const { name, campoObbligatorio } = field;
      const value = formData[name];

      if (campoObbligatorio && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[name] = 'Campo Obbligatorio';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log('Dati salvati:', formData);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Grid
      container
      spacing={3}
      style={{
        width: '80%',
        margin: 'auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      {fields.map((field) => (
        <Grid
          item
          xs={field.type === 'note' ? 12 : 4}
          key={field.name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gridColumn: field.type === 'note' ? 'span 3' : 'auto',
          }}
        >
          {field.type === 'select' && (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                label="Filled"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {field.type === 'text' && (
            <TextField
              {...(field.type === 'date' && { type: 'date' })}
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              style={{ width: '100%' }}
            />
          )}
          {field.type === 'multipleSelect' && (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name] || []}
                onChange={(e) => handleChange(field.name, e.target.value)}
                multiple
                disabled={field.disabled}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {(field.options ?? []).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {field.type === 'selectValue' && (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {field.type === 'note' && (
            <TextField
              multiline
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              style={{ width: '100%' }}
            />
          )}
        </Grid>
      ))}
      <Grid
        container
        justifyContent="center"
        style={{ marginTop: '20px' }}
        gap="60px"
      >
        <Button
          color="primary"
          onClick={handleGoBack}
          style={{
            backgroundColor: '#6C757D',
            color: 'white',
            '&:hover': {
              backgroundColor: '#6C757D',
              transform: 'scale(1.05)',
            },
          }}
        >
          Indietro
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSave}
          style={{
            backgroundColor: 'black',
            '&:hover': {
              backgroundColor: 'black',
              transform: 'scale(1.05)',
            },
          }}
        >
          Salva
        </Button>
      </Grid>
    </Grid>
  );
};

export default DynamicForm;
