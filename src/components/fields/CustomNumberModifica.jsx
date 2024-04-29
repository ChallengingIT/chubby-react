    import React from 'react';
    import TextField from '@mui/material/TextField';

    function CustomNumberModifica({ name, label, onChange, values, initialValues, maxLength }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (/^\d*$/.test(value)) {
        onChange({ [name]: value });
        }
    };

    const valueToShow = values[name] !== undefined ? values[name] : initialValues[name];

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
        value={valueToShow || ''}
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
            color: '#00B400',
            },
        }}
        />
    );
    }

    export default CustomNumberModifica;
