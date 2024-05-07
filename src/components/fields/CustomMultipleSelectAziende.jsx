import React, { useState }                                                   from 'react';
import { Select, FormControl, InputLabel, MenuItem, ListItemText, Checkbox } from '@mui/material';

const CustomMultipleSelectAziende = ({ name, label, onChange, multipleOptions, initialValues }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedSkills(value);
        const valueAsString = value.join(','); 
        onChange({ [name]: valueAsString });
    };
    
    

    return (
        <FormControl fullWidth variant='filled'
        >
            <InputLabel 
                sx={{ 
                    ml: 2, 
                    mt: 2,
                    '&.Mui-focused': {
                    color: '#00B400', 
                    },
                }}
            >
            {label}
            </InputLabel>
            <Select
                multiple
                name={name}
                value={selectedSkills}
                variant='filled'
                onChange={handleChange}
                sx={{ 
                    m: 2,
                    width: "100%",
                    textAlign: "left",
                    borderRadius: '20px', 
                    backgroundColor: '#EDEDED',
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                        '&:after': {
                            borderBottomColor: '#00B400', 
                        },
                        '&:before': {
                            borderBottom: 'none',
                        },
                        '&:hover:before': {
                            borderBottom: 'none',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#00B400', 
                    },
                }}               
                renderValue={(selected) =>
                    selected.map((id) => multipleOptions.find(option => option.value === id)?.label || "").join(", ")
                }
            >
                {multipleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Checkbox 
                            checked={selectedSkills.indexOf(option.value) > -1}
                                sx={{
                                    color: '#00B400', 
                                    '&.Mui-checked': {
                                        color: '#00B400', 
                                    },
                                }}
                        />
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomMultipleSelectAziende;
