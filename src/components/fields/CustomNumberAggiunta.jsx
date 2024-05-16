    import React from 'react';
    import TextField from '@mui/material/TextField';
import { useUserTheme } from '../TorchyThemeProvider';

    function CustomNumberAggiunta({ name, label, onChange, values, maxLength }) {
        const theme = useUserTheme();
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Filtra l'input per accettare solo numeri interi
        if (/^\d*$/.test(value)) {
        onChange({ [name]: value });
        }
    };

    return (
        <TextField
        name={name}
        label={label}
        type="text" 
        variant="filled"
        fullWidth
        inputProps={{
            maxLength: maxLength
        }}
        value={values[name] || ''}
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
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: theme.palette.border.main,
            },
        }}
        />
    );
    }

    export default CustomNumberAggiunta;
