import React            from "react";
import TextField        from "@mui/material/TextField";
import { useUserTheme } from "../TorchyThemeProvider";

function CustomDatePickerAggiungi({ name, label, type, onChange, values }) {
  const theme = useUserTheme();
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <TextField
      name={name}
      label={label}
      variant="filled"
      fullWidth
      type="date"
      value={values[name] || ""}
      onChange={handleChange}
      sx={{
        // m: 2,
        height: "4em",
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
        "& .MuiInputLabel-filled": {
          transform: "translate(12px, 5px) scale(1)",
        },
        "& .MuiInputLabel-filled.MuiInputLabel-shrink": {
          transform: "translate(12px, 10px) scale(0.75)",
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: theme.palette.border.main,
        },
      }}
    />
  );
}

export default CustomDatePickerAggiungi;
