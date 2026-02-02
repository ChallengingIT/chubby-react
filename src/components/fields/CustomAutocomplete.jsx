import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useUserTheme } from "../TorchyThemeProvider";

function CustomAutocomplete({
  name,
  label,
  options = [],
  value,
  onChange,
  disabled,
}) {
  const theme = useUserTheme();

  const getId = (v) => {
    if (v == null) return null;
    if (typeof v === "object") return v.value ?? v.id ?? null;
    return v;
  };

  const getLabel = (opt) => {
    if (!opt) return "";
    return String(opt.label ?? opt.descrizione ?? "");
  };

  const getOptionId = (opt) => {
    if (!opt) return null;
    return opt.value ?? opt.id ?? null;
  };

  const handleChange = (event, newValue) => {
    const id = getId(newValue);
    onChange({ [name]: id });
  };

  const selectedId = getId(value);

  const selectedOption =
    options.find((opt) => String(getOptionId(opt)) === String(selectedId)) || null;

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionDisabled={(option) => option?.isHeader === true}
      getOptionLabel={getLabel}
      isOptionEqualToValue={(option, v) =>
        String(getOptionId(option)) === String(getOptionId(v))
      }
      renderOption={(props, option) =>
        option?.isHeader ? (
          <li
            {...props}
            style={{
              fontWeight: "bold",
              color: "gray",
              pointerEvents: "none",
              backgroundColor: "#f5f5f5",
            }}
          >
            {getLabel(option)}
          </li>
        ) : (
          <li {...props}>{getLabel(option)}</li>
        )
      }
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
            "& .MuiFilledInput-root": { backgroundColor: "transparent" },
            "& .MuiFilledInput-underline:after": { borderBottomColor: "transparent" },
            "& .MuiFilledInput-root::before": { borderBottom: "none" },
            "&:hover .MuiFilledInput-root::before": { borderBottom: "none" },
            "& .Mui-disabled": {
              WebkitTextFillColor: "#a09f9f",
              color: "#a09f9f",
              cursor: "not-allowed",
            },
            "& .MuiFormLabel-root.Mui-focused": { color: theme.palette.border.main },
            "& .MuiFilledInput-root.Mui-disabled": {
              bgcolor: "transparent",
              cursor: "not-allowed",
              borderBottom: "none",
            },
          }}
        />
      )}
    />
  );
}

export default CustomAutocomplete;
