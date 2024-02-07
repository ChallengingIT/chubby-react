import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  InputAdornment,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WeekPickers from "./WeekPickers";


const ProvaComponente = ({ fields, initialValues, onSubmit, onCVChange, onCFChange, onSave, showSaveButton = true, showBackButton = true, title = "Form", }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialValues || {});
  const [validationErrors, setValidationErrors] = useState({});



  const [isWeekPickerVisible, setIsWeekPickerVisible] = useState(false);
  const handleWeekPickerClick = () => {
    setIsWeekPickerVisible(!isWeekPickerVisible);
  };
  const weekPickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (weekPickerRef.current && !weekPickerRef.current.contains(event.target)) {
        setIsWeekPickerVisible(false);
      }
    };
  
    // Aggiungi l'ascoltatore quando il WeekPicker è visibile
    if (isWeekPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    // Rimuovi l'ascoltatore quando il componente viene smontato o il WeekPicker è nascosto
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWeekPickerVisible]); // Assicurati di aggiungere le dipendenze corrette per useEffect
  

  function getWeekNumberAndYear(date) {
    const weekNumber = date.week();
    const year = date.year();
    return `Settimana ${weekNumber}, ${year}`;
  }



  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'cv') {
      onCVChange(files[0]);
    } else if (name === 'cf') {
      onCFChange(files[0]);
    }
  };



  useEffect(() => {
  }, [formValues]);

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));

    if (type === "multipleSelect") {
      const currentField = fields.find(field => field.name === name);
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => {
          const optionData = currentField.options.find(o => o.value.toString() === option.value);
          return optionData ? { id: optionData.value, descrizione: optionData.label } : null;
        }).filter(o => o);
    
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: selectedOptions,
      }));
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };


  
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0 && onSubmit) {
      onSubmit(formValues);
    }
  };

  const validate = (values) => {
    const errors = {};
    const campoObbligatorioErrors = {};

    fields.forEach((field) => {
      const value = values[field.name];
      if (field.type === "campoObbligatorio" && !value) {
        campoObbligatorioErrors[field.name] = "Campo obbligatorio";
      }
    });


  return {
    errors,
    campoObbligatorioErrors,
  };
};


  const handleGoBack = () => {
    window.history.back();
  };

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
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid
              item
              xs={field.type === "note" ? 12 : 4}
              key={field.name}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >


{
  field.type === "weekPicker" && (
    <div>
      <TextField
        label={field.label}
        name={field.name}
        onClick={handleWeekPickerClick}
        value={formValues[field.name] || ""}
        disabled={field.disabled}
        style={{ width: "100%", textAlign: "left" }}
      />
      {isWeekPickerVisible && (
        <div ref={weekPickerRef}>
         <WeekPickers
  value={formValues[field.name]}
  onChange={(newValue) => {
    const formattedWeek = getWeekNumberAndYear(dayjs(newValue));
    setFormValues({ ...formValues, [field.name]: formattedWeek });
    setIsWeekPickerVisible(false);
  }}
/>
        </div>
      )}
    </div>
  )
}


               
               {field.type === "select" && (
  <FormControl fullWidth>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      label="Filled"
      value={formValues[field.name] || ''}
      onChange={handleInputChange}
      disabled={field.disabled}
      style={{ width: "100%", textAlign: "left" }}
    >
      {field.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}

{field.type === "selectValore" && (
  <FormControl fullWidth>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      label="Filled"
      value={formValues[field.name] || ""}
      onChange={handleInputChange}
      disabled={field.disabled}
      style={{ width: "100%", textAlign: "left" }}
    >
      {field.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}

              {field.type === "campoObbligatorio" && validationErrors[field.name] && (
                <div style={{ color: "red", marginTop: "4px" }}>{validationErrors[field.name]}</div>
              )}
                
                {field.type === "selectValue" && (
  <FormControl fullWidth>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      value={formValues[field.name] || ""}
      onChange={handleInputChange}
      disabled={field.disabled}
      style={{ width: "100%", textAlign: "left" }}
    >
      {field.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
{field.type === "multipleSelect" && (
  <FormControl fullWidth>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      value={formValues[field.name] || []}
      onChange={handleInputChange}
      multiple
      disabled={field.disabled}
      style={{ width: "100%", textAlign: "left" }}
    >
      {field.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}



{field.type === "file" && (
                 <input
                 id="file-upload"
                 type="file"
                 accept=".pdf"
                 multiple
                 onChange={handleFileChange}
               />
              )}



    
    



              {field.type !== "select" && field.type !== "selectValue" && field.type !== "multipleSelect" && field.type !== "file" && field.type !== "downloadFile" && field.type !== "weekPicker" && field.type !== "campoObbligatorio" && (
                <TextField
                  {...(field.type === "date" && { type: "date" })}
                  {...(field.type === "note" && {
                    multiline: true,
                    fullWidth: true,
                  })}
                  label={field.label}
                  name={field.name}
                  value={formValues[field.name] || ""}
                  onChange={handleInputChange}
                  disabled={field.disabled}
                  InputLabelProps={
                    field.type === "date"
                      ? {
                          shrink: true,
                        }
                      : undefined
                  }
                  InputProps={{
                    placeholder: field.type === "date" && !formValues[field.name] ? field.label : undefined,
                  }}
                  style={{ width: "100%" }}
                />
              )}
            </Grid>
          ))}
        </Grid>
        <div
          className="bottoni"
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
              onClick={() => onSubmit(formValues)}
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

export default ProvaComponente;










// case 'note':
//   return (
//     <TextField
// label={field.label}
// name={field.name}
// onChange={handleChange(field.name)}
// value={formValues[field.name] || ''}
// multiline
// fullWidth
// rows={4} // Numero di righe per l'area di testo
// />