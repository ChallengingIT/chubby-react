import React, { useState, useEffect, useRef } from 'react';
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
  Checkbox, 
  ListItemText, 
  FormHelperText,
  Autocomplete
} from '@mui/material';
import CloseIcon                            from '@mui/icons-material/Close';




const ModalBox = ({ 
  fields, 
  initialValues = {}, 
  disableFields = {}, 
  onSubmit, 
  onClose, 
  title, 
  showBackButton = true, 
  showSaveButton = true 
}) => {

  const [values,                       setValues                    ] = useState(initialValues || {});
  const [ isModalOpen,                 setIsModalOpen               ] = useState(false);

  const handleChange = (fieldName) => (event) => {
    setValues(prevValues => ({
      ...prevValues,
      [fieldName]: event.target.value
    }));
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };
  

  const renderField = (field) => {
    const isDisabled = disableFields[field.name];
    switch (field.type) {
      case 'text':

        return (
  
          <TextField
          label={field.label}
          name={field.name}
          onChange={handleChange(field.name)}
          value={values[field.name] || ''}
          fullWidth
          disabled={isDisabled}
          variant='filled'
          sx={{ 
            width: "100%",
            textAlign: "left",
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#00B400',
          },
            }}
        />
        );

      case 'select':
        return (
          <FormControl fullWidth disabled={isDisabled}
          variant='filled'
          sx={{
            textAlign: "left",
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
              backgroundColor: 'transparent',
          },
          '& .MuiFilledInput-underline:after': {
              borderBottomColor: 'transparent',
          },
          '& .MuiFilledInput-root::before': {
              borderBottom: 'none', 
          },
          '&:hover .MuiFilledInput-root::before': {
              borderBottom: 'none', 
          },
          '& .MuiFormLabel-root.Mui-focused': {
            color: '#00B400',
        },
          }}> 
          <InputLabel>{field.label}</InputLabel>
          <Select
            style={{ width: "100%", textAlign: "left" }}
            name={field.name}
            value={values[field.name] || ''}
            onChange={handleChange(field.name)}
            variant='filled'
          sx={{ 
            width: "100%",
            textAlign: "left",
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#00B400',
          },
            }}
          >
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        );

        

      case 'date':
        return (
          <TextField
            type="date"
            label={field.label}
            name={field.name}
            value={values[field.name] || ''}
            onChange={handleChange(field.name)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            variant='filled'
          sx={{ 
            width: "100%",
            textAlign: "left",
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#00B400',
          },
            }}
          />
        );

        case 'note':
  return (
    <TextField
      label={field.label}
      name={field.name}
      multiline
      rows={4}
      onChange={handleChange(field.name)}
      value={values[field.name] || ''}
      fullWidth
      variant='filled'
          sx={{ 
            width: "100%",
            textAlign: "left",
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: '#00B400',
          },
            }}
    />
  );

        

      default:
        return null;
    }
  };

  return (
    <div
      style={{
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        {title}
      </Typography>
      <Button onClick={onClose} variant="outlined" sx={{ mt: -2 ,backgroundColor: 'transparent', border: 'none', color: '#898989', '&:hover': { border: 'none', color: 'red', transform: 'scale(1.1)'}}}startIcon={<CloseIcon sx={{backgroundColor: 'transparent'}}/>}/>

      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid
              item
              xs={field.type === "note" ? 12 : 4}
              key={field.name}
            >
              {renderField(field)}
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
        {/* {showBackButton && (
          <Button
            color="primary"
            onClick={onClose}
            style={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Indietro
          </Button>
          )} */}
          {showSaveButton && (
            <Button
              color="primary"
              variant="contained"
              // onClick={() => onSubmit(values)}
              type="submit"
              sx={{
                width: '30%',
                borderRadius: '5px',
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
          </div>
      </form>
    </div>
  );
};

export default ModalBox;
