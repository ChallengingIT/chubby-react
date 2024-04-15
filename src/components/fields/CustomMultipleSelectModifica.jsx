import React, { useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem, ListItemText, Checkbox } from '@mui/material';

const CustomMultipleSelectModifica = ({ name, label, options, value, onChange, skillsOptions, initialValues }) => {



    const handleChangeSkills = (event) => {
        const value = event.target.value;
        onChange({ [name]: value });
    };


    const currentValue = Array.isArray(value) ? value : [];



    return (
        <FormControl fullWidth>
            <InputLabel sx={{ ml: 2, mt: 2}}>{label}</InputLabel>
            <Select
                multiple
                name={name}
                value={currentValue}
                variant='filled'
                onChange={handleChangeSkills}
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
                renderValue={(selected) =>
                    selected.map((skillId) => skillsOptions.find(option => option.value === skillId)?.label || "").join(", ")
                }
            >
                {skillsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={(value || []).indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                </MenuItem>
                
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomMultipleSelectModifica;
