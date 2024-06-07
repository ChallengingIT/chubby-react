import React              from "react";
import TextField          from "@mui/material/TextField";
import { useUserTheme }   from "../TorchyThemeProvider";

function CustomTextFieldModifica({
  name,
  label,
  type,
  onChange,
  values,
  initialValues,
  disabled,
  maxLength,
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
      variant="filled"
      fullWidth
      inputProps={{
        maxLength: maxLength,
      }}
      value={values[name] || initialValues[name] || ""}
      onChange={handleChange}
      disabled={disabled}
      sx={{
          m: 2,
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
        "& .MuiFilledInput-underline:hover:before": {
          borderBottomStyle: "trasparent",
        },
        "& .Mui-disabled": {
          WebkitTextFillColor: "black", // Questo sovrascrive il colore del testo per i browser basati su Webkit come Chrome e Safari
          color: "black",
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
  );
}

export default CustomTextFieldModifica;
