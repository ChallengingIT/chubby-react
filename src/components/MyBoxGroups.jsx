import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Input,
} from '@mui/material';

const MyBoxGroups = ({
  fields,
  initialValues,
  onSave,
  title = 'Form',
  disableFields,
  campiObbligatori,
  showSaveButton = true,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ ...initialValues, dateOra: new Date().toISOString().slice(0, 16) });
  const navigate = useNavigate();



//stile campi disabilitati
const getDisabledStyles = (isDisabled) => {
  return isDisabled ? { color: 'black' } : {};
};


const validate = () => {
  let tempErrors = {};
  campiObbligatori.forEach(field => {
    if (!values[field]) {
      tempErrors[field] = 'Campo obbligatorio';
    }
  });
  setErrors(tempErrors);
  return !Object.keys(tempErrors).length;
};


  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === 'select') {
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
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(values);
    }
  };

  const handleNext = () => {
    setCurrentGroupIndex(currentGroupIndex + 1);
  };

  const handleBack = () => {
    setCurrentGroupIndex(currentGroupIndex - 1);
  };


  const groupFields = (fields) => {
    const groupedFields = [];
    let currentGroup = [];
    fields.forEach((field) => {
      if (field.type === 'titleGroups') {
        if (currentGroup.length > 0) {
          groupedFields.push(currentGroup);
        }
        currentGroup = [field];
      } else {
        currentGroup.push(field);
      }
    });
    if (currentGroup.length > 0) {
      groupedFields.push(currentGroup);
    }
    return groupedFields;
  };

  const renderField = (field, groupLength) => {


    const gridWidth = field.type === 'note' ? 12 : groupLength === 2 ? 6 : 4;


    const isDisabled = disableFields[field.name];
    
    switch (field.type) {
      case 'select':
        return (
          
          <FormControl fullWidth key={field.name} sx={{ marginBottom: '16px', marginTop: '16px' }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={values[field.name] || []}
              onChange={handleInputChange}
              disabled={isDisabled}
              style={{ width: '100%', textAlign: 'left' }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
    
      case 'titleGroups':
        return (
          <Typography
            variant="h6"
            style={{
              marginBottom: '60px',
              textAlign: 'center',
              borderBottom: '1px solid #000',
              paddingBottom: '5px',
              marginTop: '80px',
              gridColumn: '1 / -1',
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
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
            fullWidth
            style={{ width: '100%', marginBottom: '16px', marginTop: '16px' }}
          />
        );

        case 'note':
          return (
            <Grid item xs={gridWidth} key={field.name} style={{ width: '100%' }}>
              <TextField
                label={field.label}
                name={field.name}
                value={values[field.name] || ''}
                onChange={handleInputChange}
                disabled={isDisabled}
                multiline
                fullWidth
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                type={field.type === 'date' ? 'date' : 'text'}
                style={{ width: '100%', marginBottom: '16px', marginTop: '16px' }}
              />
            </Grid>
          );



      default:
        return (
          <Grid item xs={12} key={field.name}>
            <TextField
              label={field.label}
              name={field.name}
              value={values[field.name] || ''}
              onChange={handleInputChange}
              disabled={isDisabled}
              multiline={field.type === 'note'}
              fullWidth
              InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              type={field.type === 'date' ? 'date' : 'text'}
              style={{ width: '100%', marginBottom: '16px', marginTop: '16px' }}
            />
          </Grid>
          
        );
    }
  };

  const groupedFields = groupFields(fields);
  const isLastGroup = currentGroupIndex === groupedFields.length - 1;

  return (
    <div
      style={{
        display: 'grid',
        flexDirection: 'column',
        width: '80%',
        height: 'auto',
        margin: 'auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '20px',
        justifyItems: 'center',
        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {groupedFields[currentGroupIndex].map((field, index) =>
            field.type === 'titleGroups' ? (
              <Grid item xs={12} key={index} style={{ gridColumn: '1 / -1' }}>
                <Typography variant="h6" style={{ textAlign: 'center', margin: '20px 0' }}>
                  {field.label}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12} sm={groupedFields[currentGroupIndex].length < 3 ? 6 : 4} key={field.name}>
                {renderField(field)}
              </Grid>
            )
          )}
        </Grid>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          
          {!isLastGroup && (
            <Grid item xs={12}>
              <Button onClick={handleNext} fullWidth
                style={{
                width: '250px',
                backgroundColor: "#FFB700",
                color: "black",
                fontWeight:"bold",
                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                
                "&:hover": {
                  backgroundColor: "#FFB700",
                  color: "black",
                  transform: "scale(1.05)",
                  boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                },
              }}
              >
                Avanti
                </Button>
            </Grid>
          )}
          {currentGroupIndex > 0 && (
            <Grid item xs={12}>
              <Button onClick={handleBack} fullWidth
              style={{
                width: '250px',
                backgroundColor: "black",
                color: "white",
                fontWeight:"bold",
                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                "&:hover": {
                  backgroundColor: "black",
                  transform: "scale(1.05)",
                  boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                },
              }}
              >
                Indietro
                </Button>
            </Grid>
          )}
          {isLastGroup && (
            <Grid item xs={12}>
              {showSaveButton && (
              <Button type="submit" fullWidth
              style={{
                width: '250px',
                backgroundColor: "#FFB700",
                color: "black",
                fontWeight:"bold",
                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                
                "&:hover": {
                  backgroundColor: "#FFB700",
                  color: "black",
                  transform: "scale(1.05)",
                  boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                },
              }}
              >
                Salva
                </Button>
                )}
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default MyBoxGroups;
