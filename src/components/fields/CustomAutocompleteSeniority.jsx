import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useUserTheme } from "../TorchyThemeProvider";

function CustomAutocompleteSeniority({
  name,
  label,
  options,
  value,
  onChange,
  disabled,
}) {
  const theme = useUserTheme();

  const seniorityOptions = [
    { label: "Neo", value: 0, min: 0, max: 1 },
    { label: "Junior", value: 1, min: 1, max: 2 },
    { label: "Middle", value: 2, min: 2, max: 3 },
    { label: "Senior", value: 3, min: 3 },
  ];

  const handleChange = (event, newValue) => {
    onChange({ [name]: newValue ? newValue.value : null });
  };

  const getLabelByValue = (value) => {
    const option = seniorityOptions.find(
      (option) => value >= option.min && (option.max === undefined || value < option.max)
    );
    return option ? option.label : "";
  };

  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={(option) => getLabelByValue(option.value)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label}
          disabled={disabled}
          sx={{
            width: "100%",
            textAlign: "left",
            borderRadius: "20px",
            backgroundColor: "#EDEDED",
            "& .MuiFilledInput-root": {
              backgroundColor: "transparent",
            },
            "& .MuiFilledInput-underline:after": {
              borderBottomColor: "transparent",
            },
            "& .MuiFilledInput-root::before": {
              borderBottom: "none",
            },
            "&:hover .MuiFilledInput-root::before": {
              borderBottom: "none",
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: "#a09f9f",
              color: "#a09f9f",
              cursor: "not-allowed",
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: theme.palette.border.main,
            },
            "& .MuiFilledInput-root.Mui-disabled": {
              bgcolor: "transparent",
              cursor: "not-allowed",
              borderBottom: "none",
            },
            "& .Mui-disabled": {
              cursor: "not-allowed",
            },
          }}
        />
      )}
    />
  );
}

export default CustomAutocompleteSeniority;
