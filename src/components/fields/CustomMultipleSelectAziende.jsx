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

    const CustomMultipleSelectAziende = ({
    name,
    label,
    onChange,
    multipleOptions,
    initialValues,
    }) => {
    const theme = useUserTheme();

    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedSkills(value);
        const valueAsString = value.join(",");
        onChange({ [name]: valueAsString });
    };

    return (
        <FormControl fullWidth variant="filled">
        <InputLabel
            sx={{
            // ml: 2,
            // mt: 2,
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
            variant="filled"
            onChange={handleChange}
            sx={{
                // m: 2,
                width: "100%",
                textAlign: "left",
                borderRadius: "20px",
                backgroundColor: "#EDEDED",
            "& .MuiFilledInput-root": {
                backgroundColor: "transparent",
                "&:after": {
                borderBottomColor: theme.palette.border.main,
                },
                "&:before": {
                borderBottom: "none",
                },
                "&:hover:before": {
                borderBottom: "none",
                },
            },
            "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.border.main,
            },
            }}
            renderValue={(selected) =>
            selected
                .map(
                (id) =>
                    multipleOptions.find((option) => option.value === id)?.label ||
                    ""
                )
                .join(", ")
            }
        >
            {multipleOptions.map((option) => (
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

    export default CustomMultipleSelectAziende;
