import React, { useEffect, useState } from "react";
import {
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    ListItemText,
    Checkbox,
} from "@mui/material";
import { useUserTheme } from "../TorchyThemeProvider";

const FilterMultipleAutocomplete = ({ name, label, onChange, skillsOptions, value }) => {
    const theme = useUserTheme();
    const [selectedSkills, setSelectedSkills] = useState(value || []);

    // Aggiorna lo stato quando i filtri vengono resettati
    useEffect(() => {
        setSelectedSkills(value || []);
    }, [value]);

    const handleChangeSkills = (event) => {
        const newValue = event.target.value;
        setSelectedSkills(newValue);
        onChange({ [name]: newValue });
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
                sx={{
                    m: 0,
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "20px",
                    backgroundColor: "white",
                    border: "1px solid #00B400",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                renderValue={(selected) =>
                    selected
                        .map((skillId) => skillsOptions.find((option) => option.value === skillId)?.label || "")
                        .join(", ")
                }
            >
                {skillsOptions.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.isHeader === true} // 👈 disabilita il click
                        sx={
                            option.isHeader
                                ? {
                                    fontWeight: "bold",
                                    color: "#777",
                                    pointerEvents: "none", // 👈 blocca il click
                                    backgroundColor: "#f5f5f5",
                                }
                                : {}
                        }
                    >
                        {!option.isHeader && ( // 👈 mostra la checkbox solo se non è header
                            <Checkbox checked={selectedSkills.indexOf(option.value) > -1} />
                        )}
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FilterMultipleAutocomplete;
