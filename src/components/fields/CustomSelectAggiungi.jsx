import React                                         from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useUserTheme } from '../TorchyThemeProvider';

function CustomSelectAggiungi({ name, label, options, value, onChange, disabled }) {

  const theme = useUserTheme();

  const handleChange = (event) => {
    onChange({ [name]: event.target.value });
  };

  return (
    <FormControl variant="filled" fullWidth sx={{ m: 2 }}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        label={label}
        sx={{
          textAlign: "left",
          borderRadius: '20px',
          backgroundColor: '#EDEDED',
          "& .MuiFilledInput-input": {
            backgroundColor: 'transparent',
          },
          '& .MuiFilledInput-underline:after': {
              borderBottomColor: 'transparent',
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: 'transparent',
          },
          "&:hover .MuiFilledInput-root::before": {
              borderBottom: 'none',
          },
          '& .Mui-disabled': {
            WebkitTextFillColor: '#a09f9f',
            color: '#a09f9f', 
            cursor: 'not-allowed', 
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: theme.palette.border.main,
        },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelectAggiungi;
