import React from "react";
import TextField from "@mui/material/TextField";
import { useUserTheme } from "../TorchyThemeProvider";

function CustomNoteModifica({
  name,
  label,
  type,
  onChange,
  values,
  initialValues,
  maxLength,
  onMaxLengthReached,
}) {
  const theme = useUserTheme();

  const currentValue =
    values?.[name] !== undefined ? values[name] : (initialValues?.[name] || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    const selectedText = window.getSelection()?.toString() || "";
    const currentLength = currentValue.length;
    const selectedLength = selectedText.length;

    const futureLength = currentLength - selectedLength + pastedText.length;

    if (futureLength > maxLength && onMaxLengthReached) {
      onMaxLengthReached(maxLength);
    }
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
      onPaste={handlePaste}
      inputProps={{
        maxLength: maxLength,
      }}
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