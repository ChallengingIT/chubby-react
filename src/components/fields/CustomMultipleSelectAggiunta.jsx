import React, { useState } from 'react';
import { Select, FormControl, InputLabel, MenuItem, ListItemText, Checkbox } from '@mui/material';

const CustomMultipleSelectAggiunta = ({ name, label, onChange, skillsOptions }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleChangeSkills = (event) => {
        const value = event.target.value;
        setSelectedSkills(value);
        onChange({ [name]: value });
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
                onChange={handleChangeSkills}
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
                    selected.map((skillId) => skillsOptions.find(option => option.value === skillId)?.label || "").join(", ")
                }
            >
                {skillsOptions.map((option) => (
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

export default CustomMultipleSelectAggiunta;
