import React, { useState } from "react";
import {
Select,
FormControl,
InputLabel,
MenuItem,
ListItemText,
Checkbox,
} from "@mui/material";
import { useUserTheme } from "../TorchyThemeProvider";

const CustomMultipleAutocomplete = ({
name,
label,
onChange,
skillsOptions,
}) => {
const theme = useUserTheme();

const [selectedSkills, setSelectedSkills] = useState([]);


const handleChangeSkills = (event) => {
    const value = event.target.value;
    setSelectedSkills(value);
    onChange({ [name]: value });
};

return (
    <FormControl fullWidth variant="filled">
    <InputLabel
        sx={{

        "&.Mui-focused": {
            color: theme.palette.border.main,
        },
        }}
    >
        {label}
    </InputLabel>
    <Select
        multiple
        name={name}
        value={selectedSkills}
        variant="outlined"
        onChange={handleChangeSkills}
        MenuProps={{ disableAutoFocusItem: true }}
        sx={{
        m: 0,
        width: "100%",
        textAlign: "left",
        borderRadius: "20px",
        backgroundColor: "white",
        border: '1px solid #00B400',
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none", 
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none", 
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none", 
        },
        }}
        renderValue={(selected) =>
        selected
            .map(
            (skillId) =>
                skillsOptions.find((option) => option.value === skillId)
                ?.label || ""
            )
            .join(", ")
        }
    >
        {skillsOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
            <Checkbox
            checked={selectedSkills.indexOf(option.value) > -1}
            sx={{
                color: theme.palette.border.main,
                "&.Mui-checked": {
                color: theme.palette.border.main,
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

export default CustomMultipleAutocomplete;
