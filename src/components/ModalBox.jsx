import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Container,
  FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalBox = ({
  fields,
  initialValues = {},
  disableFields = {},
  onSubmit,
  onClose,
  title,
  showSaveButton = true,
}) => {
  const [values, setValues] = useState(initialValues || {});
    const [errors, setErrors] = useState({});


  const handleChange = (fieldName) => (event) => {
    setValues((prevValues) => ({
      ...prevValues,
      [fieldName]: event.target.value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!values.idOwner) {
      newErrors.idOwner = "Owner is required";
    }
    if (!values.stato) {
      newErrors.stato = "Stato is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
  };

  const renderField = (field) => {
    const isDisabled = disableFields[field.name];
    const isError = !!errors[field.name];
    const helperText = errors[field.name] || "";
    switch (field.type) {
      case "text":
        return (
          <TextField
            label={field.label}
            name={field.name}
            onChange={handleChange(field.name)}
            value={values[field.name] || ""}
            fullWidth
            disabled={isDisabled}
            variant="filled"
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
                color: "#00B400",
              },
            }}
          />
        );

      case "select":
        return (
          <FormControl
            fullWidth
            disabled={isDisabled}
            variant="filled"
            error={isError}
            sx={{
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
                color: "#00B400",
              },
            }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              style={{ width: "100%", textAlign: "left" }}
              name={field.name}
              value={values[field.name] || ""}
              onChange={handleChange(field.name)}
              variant="filled"
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
                  color: "#00B400",
                },
              }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {isError && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case "date":
        return (
          <TextField
            type="date"
            label={field.label}
            name={field.name}
            value={values[field.name] || ""}
            onChange={handleChange(field.name)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant="filled"
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
                color: "#00B400",
              },
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
   <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        m: 1,
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "20px",
        justifyItems: "center",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          {title}
        </Typography>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            mt: -2,
            backgroundColor: "transparent",
            border: "none",
            color: "#898989",
            "&:hover": {
              border: "none",
              color: "red",
              transform: "scale(1.1)",
            },
          }}
          startIcon={<CloseIcon sx={{ backgroundColor: "transparent" }} />}
        />
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={field.type === "note" ? 12 : 4} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
        <Container
          className="bottoni"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "40px",
            gap: "40px",
          }}
        >
          {showSaveButton && (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{
                width: "30%",
                borderRadius: "5px",
                fontWeight: "bold",
                backgroundColor: "#00B401",
                color: "white",
                "&:hover": {
                  backgroundColor: "#00B401",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              Salva
            </Button>
          )}
        </Container>
      </form>
    </Container>
  );
};

export default ModalBox;
