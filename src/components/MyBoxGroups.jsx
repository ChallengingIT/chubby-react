import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Input,
  Typography
} from "@mui/material";

const MyBoxGroups = ({ 
  fields, 
  initialValues, 
  onSubmit, 
  onSave, 
  showSaveButton = true, 
  showBackButton = true, 
  title = "Form", 
  disableFields 
}) => {
  const navigate = useNavigate();
  // const [values, setvalues] = useState(initialValues || {});

  const [values, setValues] = useState({
    ...initialValues, 
    dateOra: new Date().toISOString().slice(0, 16), // Aggiunge l'ora corrente nel formato 'YYYY-MM-DDTHH:MM'
  });
  

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === "select") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setValues((prevValues) => ({
        ...prevValues,
        [name]: selectedOptions,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValues((prevValues) => ({
      ...prevValues,
      file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderField = (field) => {
    const isDisabled = disableFields[field.name];
    switch (field.type) {
      case "select":
      case "selectValue":
        return (
          <FormControl fullWidth key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={values[field.name] || (field.type === "select" ? [] : "")}
              onChange={handleInputChange}
              // multiple={field.type === "select"}
              disabled={isDisabled}
              style={{ width: "100%", textAlign: "left" }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "file":
        return (
          <div style={{ marginBottom: "16px", textAlign: "left" }} key={field.name}>
            <div style={{ marginBottom: "4px" }}>{field.label}</div>
            <FormControl fullWidth>
              <Input
                type="file"
                name={field.name}
                onChange={handleFileChange}
                inputProps={{ accept: field.accept || ".pdf" }}
              />
            </FormControl>
          </div>
        );

      case "titleGroups":
        return (
          <Typography
            variant="h6"
            style={{
              marginBottom: "60px",
              textAlign: "center",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              marginTop: "80px",
              gridColumn: "1 / -1", // Occupa tutte le colonne
            }}
          >
            {field.label}
          </Typography>
        );
        case 'dateOra':
          return (
            <TextField
              type="datetime-local"
              label={field.label}
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => handleInputChange(e)}
              InputLabelProps={{ shrink: true }}
              disabled={isDisabled}
              fullWidth
            />
          );

      default:
        return (
          <TextField
            label={field.label}
            name={field.name}
            value={values[field.name] || ""}
            onChange={handleInputChange}
            disabled={isDisabled}
            multiline={field.type === "note"}
            fullWidth={field.type === "note"}
            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
            type={field.type === "date" ? "date" : "text"}
            key={field.name}
            style={{ width: "100%" }}
          />
        );
    }
  };

  const groupFields = (fields) => {
    const groupedFields = [];
    let currentGroup = [];

    fields.forEach(field => {
      if (field.type === "titleGroups") {
        if (currentGroup.length > 0) {
          groupedFields.push(currentGroup);
          currentGroup = [];
        }
        groupedFields.push([field]);
      } else {
        currentGroup.push(field);
      }
    });

    if (currentGroup.length > 0) {
      groupedFields.push(currentGroup);
    }

    return groupedFields;
  };

  const groupedFields = groupFields(fields);

  return (
    <div
      style={{
        display: "grid",
        flexDirection: "column",
        width: "80%",
        height: "auto",
        margin: "auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "20px",
        justifyItems: "center",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        {groupedFields.map((group, index) => (
          <Grid container spacing={3} key={index}>
            {group.map(field => (
              <Grid
                item
                xs={field.type === "titleGroups" ? 12 : (field.type === "note" ? 12 : 4)}
                key={field.name}
              >
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginTop: "40px",
            gap: "40px",
          }}
        >
          {showBackButton && (
            <Button
              color="primary"
              onClick={handleGoBack}
              style={{
                backgroundColor: "#6C757D",
                color: "white",
                "&:hover": {
                  backgroundColor: "#6C757D",
                  transform: "scale(1.05)",
                },
              }}
            >
              Indietro
            </Button>
          )}
          {showSaveButton && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => onSave(values)}
              style={{
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                  transform: "scale(1.05)",
                },
              }}
            >
              Salva
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MyBoxGroups;
