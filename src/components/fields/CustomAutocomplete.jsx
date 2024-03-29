import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CustomAutocomplete({ name, label, options, value, onChange }) {
  const handleChange = (event, newValue) => {
    onChange({ [name]: newValue ? newValue.value : null });
  };

  // Trova l'opzione che corrisponde al valore
  const selectedOption = options.find(option => option.value === value) || null;







  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={(option) => option.label ? String(option.label) : ''}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) =>
        <TextField 
        {...params} 
        variant='filled'
        label={label} 
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
      }
    />
  );
}


export default CustomAutocomplete;
