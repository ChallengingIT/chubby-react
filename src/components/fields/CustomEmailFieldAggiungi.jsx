import React              from "react";
import TextField          from "@mui/material/TextField";
import { useUserTheme }   from "../TorchyThemeProvider";

function CustomEmailAFieldAggiungi({
  name,
  label,
  type,
  onChange,
  values,
  maxLength,
  error,
  helperText,
  InputProps,
  sx,
}) {
  const theme = useUserTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      inputProps={{
        maxLength: maxLength,
      }}
      variant="filled"
      fullWidth
      value={values[name] || ""}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      InputProps={InputProps}
      sx={{
          // m: 2,
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
        "& .MuiFormLabel-root.Mui-focused": {
          color: theme.palette.border.main,
        },
        "& .MuiFilledInput-root.Mui-disabled": {
            bgcolor: 'transparent',
            cursor: 'not-allowed'
        },
        "& .Mui-disabled": {
            cursor: 'not-allowed'
        },
        ...sx
      }}
    />
  );
}

export default CustomEmailAFieldAggiungi;