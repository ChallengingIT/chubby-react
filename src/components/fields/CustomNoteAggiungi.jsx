import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import { useUserTheme } from "../TorchyThemeProvider";

function CustomNoteModifica({
  name,
  label,
  type,
  onChange,
  values,
  maxLength,
  onMaxLengthReached,
}) {
  const theme = useUserTheme();
  const hasShownLimitRef = useRef(false);

  const currentValue = values?.[name] || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > maxLength) {
      const trimmedValue = value.slice(0, maxLength);

      onChange({ [name]: trimmedValue });

      if (!hasShownLimitRef.current && onMaxLengthReached) {
        onMaxLengthReached(maxLength);
        hasShownLimitRef.current = true;
      }

      return;
    }

    if (value.length < maxLength) {
      hasShownLimitRef.current = false;
    }

    onChange({ [name]: value });
  };

  return (
    <TextField
      name={name}
      label={label}
      type={type}
      variant="filled"
      fullWidth
      multiline
      rows={4}
      value={currentValue}
      onChange={handleChange}
      inputProps={{
        maxLength,
      }}
      helperText={`${currentValue.length}/${maxLength}`}
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
        "& .MuiFormLabel-root.Mui-focused": {
          color: theme.palette.border.main,
        },
      }}
    />
  );
}

export default CustomNoteModifica;