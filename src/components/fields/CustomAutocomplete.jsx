import React              from "react";
import Autocomplete       from "@mui/material/Autocomplete";
import TextField          from "@mui/material/TextField";
import { useUserTheme }   from "../TorchyThemeProvider";

function CustomAutocomplete({
  name,
  label,
  options,
  value,
  onChange,
  disabled,
}) {
  const theme = useUserTheme();
  const handleChange = (event, newValue) => {
    onChange({ [name]: newValue ? newValue.value : null });
  };

  // Trova l'opzione che corrisponde al valore
  const selectedOption =
    options.find((option) => option.value === value) || null;

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={(option) => (option.label ? String(option.label) : "")}
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
              WebkitTextFillColor: "#a09f9f", // Questo sovrascrive il colore del testo per i browser basati su Webkit come Chrome e Safari
              color: "#a09f9f",
              cursor: "not-allowed",
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: theme.palette.border.main,
            },
            "& .MuiFilledInput-root.Mui-disabled": {
            bgcolor: 'transparent',
            cursor: 'not-allowed',
            borderBottom: 'none'
        },
        "& .Mui-disabled": {
            cursor: 'not-allowed'
        }
          }}
        />
      )}
    />
  );
}

export default CustomAutocomplete;
