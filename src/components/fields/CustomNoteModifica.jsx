import React from 'react';
import TextField from '@mui/material/TextField';

function CustomNoteModifica({ name, label, type, onChange, values, initialValues }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };



  return (
    <TextField
      name={name}
      label={label}
      type={type}
      variant="filled"
      fullWidth
      multiline
      rows={4}
      value={values[name] || initialValues[name] || ''}
      onChange={handleChange}
      sx={{ 
        m: 2,
        width: "100%",
        textAlign: "left",
        borderRadius: '20px', 
    backgroundColor: '#EDEDED', 
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
    },
    '& .MuiFilledInput-underline:after': {
        borderBottomColor: 'transparent',
    },
    '& .MuiFilledInput-root::before': {
        borderBottom: 'none', 
    },
    '&:hover .MuiFilledInput-root::before': {
        borderBottom: 'none', 
    }

        }}
    />
  );
}

export default CustomNoteModifica;
