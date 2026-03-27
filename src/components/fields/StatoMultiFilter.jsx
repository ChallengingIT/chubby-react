import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const StatoMultiFilter = ({
    value = [],
    onChange,
    options = [],
    align = "left",
    placeholder
}) => {
    return (
        <Autocomplete
            multiple
            size="small"
            options={options}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            disableCloseOnSelect
            isOptionEqualToValue={(option, val) => option.value === val.value}
            getOptionLabel={(option) => option?.label || ""}
            renderOption={(props, option) => (
                <li
                    {...props}
                    style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                        paddingTop: 8,
                        paddingBottom: 8,
                    }}
                >
                    {option.label}
                </li>
            )}
            sx={{
                width: "100%",
                minWidth: 140,
                "& .MuiAutocomplete-inputRoot": {
                    paddingTop: "0 !important",
                    paddingBottom: "0 !important",
                    minHeight: 32,
                    alignItems: "center",
                },
                "& .MuiAutocomplete-input": {
                    textAlign: align,
                },
                "& .MuiChip-root": {
                    maxWidth: "100%",
                },
            }}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 180,
                    },
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    fullWidth
                    placeholder={placeholder}
                    inputProps={{
                        ...params.inputProps,
                        style: {
                            textAlign: align,
                            fontSize: "16px",
                        },
                    }}
                />
            )}
        />
    );
};

export default StatoMultiFilter;