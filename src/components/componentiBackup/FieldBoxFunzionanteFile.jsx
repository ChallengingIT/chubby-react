//funzionante al 25 dicembre 2023 10:30

import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Input, Box, Typography, Checkbox, ListItemText } from '@mui/material';
// import WeekPickers from "./WeekPickers";
// import dayjs from 'dayjs';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';



const FieldBoxFunzionanteFile = ({ fields, initialValues = {}, disableFields = {}, onSubmit, onCVChange, onCFChange, showBackButton = true, showSaveButton = true, title="" }) => {
  const [formValues, setFormValues] = useState(initialValues || {});

  // const handleChange = (name) => (event) => {
  //   setFormValues({ ...formValues, [name]: event.target.value });
  // };
  const handleChangeMultiple = (name) => (event) => {
    if (event.target.type === 'file') {
      // Prendi tutti i file dall'input
      const files = Array.from(event.target.files);
      console.log(`File caricati per ${name}:`, files);

      // Aggiorna il valore del form con l'array di file
      setFormValues({ ...formValues, [name]: files });
    } else {
      // Per altri tipi di input, imposta il valore come al solito
      setFormValues({ ...formValues, [name]: event.target.value });
    }
  };


  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // const handleDeleteFile = (fieldName, fileName) => {
  //   // Aggiorna lo stato per rimuovere il file dall'elenco
  //   setFormValues({
  //     ...formValues,
  //     [fieldName]: formValues[fieldName].filter(file => file.name !== fileName)
  //   });
  // };

  const handleDeleteFile = (fieldName, fileId) => {
    // Verifica che il campo esista e che sia un oggetto
    if (formValues[fieldName] && typeof formValues[fieldName] === 'object') {
      // Verifica che l'oggetto rappresenti il file che vuoi eliminare
      if (formValues[fieldName].id === fileId) {
        // Rimuovi il file dall'oggetto formValues
        const {[fieldName]: _, ...newFormValues} = formValues;
  
        // Aggiorna lo stato per riflettere la rimozione del file
        setFormValues(newFormValues);
      } else {
        console.error("Il file da eliminare non corrisponde all'ID fornito.");
      }
    } else {
      console.error(`Expected an object for ${fieldName}, but received:`, formValues[fieldName]);
      // Gestisci l'errore come preferisci...
    }
  };
  
  

  // const handleChangeMultiple = (name) => (event) => {
  //   if (event.target.type === 'file') {
  //     // Crea un array dai file selezionati
  //     const filesArray = Array.from(event.target.files);
  //     console.log(`File caricati per ${name}:`, filesArray);
  
  //     // Crea un nuovo oggetto FormData
  //     const formData = new FormData();
  //     // Aggiungi ogni file a formData
  //     filesArray.forEach((file, index) => {
  //       formData.append(`${name}${index}`, file);
  //     });
  
  //     // Aggiorna il valore del form con l'oggetto FormData
  //     setFormValues({ ...formValues, [name]: formData });
  //   }
  // };

  const handleFileChange = (name, event) => {
    const file = event.target.files[0];
    if (file) {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: {
          file,
          name: file.name,
          url: URL.createObjectURL(file), // Crea un URL temporaneo per il download del file
        }
      }));
    }
  };
  
  
  




  const handleChange = (name) => (event) => {
    if (event.target.type === 'file') {
      // Prendi il primo file dall'input
      const file = event.target.files[0];
      console.log(`File caricato per ${name}:`, file);
  
      // Aggiorna il valore del form con il file
      setFormValues({ ...formValues, [name]: file });
    } else {
      // Per altri tipi di input, imposta il valore come al solito
      setFormValues({ ...formValues, [name]: event.target.value });
    }
  };
  
  

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };


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

  const renderField = (field) => {
    const isDisabled = disableFields[field.name];
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}

            name={field.name}
            onChange={handleChange(field.name)}
            value={formValues[field.name] || ''}
            fullWidth
            disabled={isDisabled}
          />
        );




        

      case 'select':
        return (
          <FormControl fullWidth disabled={isDisabled}>
            <InputLabel>{field.label}</InputLabel>
            <Select
            style={{ width: "100%", textAlign: "left" }}
              name={field.name}
              value={formValues[field.name] || ''}
              onChange={handleChange(field.name)}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multipleSelect':
        return (
            <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                name={field.name}
                value={formValues[field.name] || []}
                onChange={handleChange(field.name)}
                renderValue={(selected) => (
                  selected.map(value => ( // Mappa ciascun ID alla sua etichetta
                    field.options.find(option => option.value === value)?.label || value // Trova l'etichetta corrispondente o restituisce l'ID se non viene trovata nessuna corrispondenza
                  )).join(', ') // Unisci le etichette in una stringa
                )}
                
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
                  );

                case 'multipleSelectCheck':
                  return (
                    <FormControl fullWidth disabled={isDisabled}>
  <InputLabel>{field.label}</InputLabel>
  <Select
    multiple
    name={field.name}
    value={formValues[field.name] || []} // Assicurati che sia sempre un array
    onChange={handleChange(field.name)}
   renderValue={(selected) => (
                  selected.map(value => ( // Mappa ciascun ID alla sua etichetta
                    field.options.find(option => option.value === value)?.label || value // Trova l'etichetta corrispondente o restituisce l'ID se non viene trovata nessuna corrispondenza
                  )).join(', ') // Unisci le etichette in una stringa
                )}
                
    disabled={field.disabled}
    style={{ width: "100%", textAlign: "left" }}
  >
    {field.options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={formValues[field.name].indexOf(option.value) > -1} />
        <ListItemText primary={option.label} />
      </MenuItem>
    ))}
  </Select>
</FormControl>
                  );


                  case 'downloadFile':
                    return (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                        <Box style={{ display: 'flex', flexDirection: "column", alignItems: 'center', margin: '10px 0' }}>
                          <Typography variant="body2" style={{ marginRight: '10px' }}>
                            {formValues[field.name]?.descrizione || 'Nessun file selezionato'}
                          </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            style={{  marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => formValues[field.name] && handleDownload(formValues[field.name].url, formValues[field.name].name)}
                            disabled={!formValues[field.name]}
                          >
                  
                          </Button>

                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            style={{ marginLeft: '10px', backgroundColor: "green", color: "white",  marginBottom: "10px" }}
                          >
                        
                            <input
                              type="file"
                              hidden
                              onChange={(event) => handleFileChange(field.name, event)}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteFile(field.name)}
                            style={{ backgroundColor: 'red', marginLeft: '10px', color: "white", marginBottom: "10px" }}
                            disabled={!formValues[field.name]}
                          >
                            
                          </Button>
                         
                          </Box>
                        </Box>
                   
                    );
                  
                  
                

            
            
        //   <FormControl fullWidth>
        //     <InputLabel>{field.label}</InputLabel>
        //     <Select
        //     style={{ width: "100%", textAlign: "left" }}
        //       multiple
        //       name={field.name}
        //       value={formValues[field.name] || []}
        //       onChange={handleChange(field.name)}
        //       input={<Input id="select-multiple-chip" />}
        //       renderValue={(selected) => (
        //         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        //           {selected.map((value) => (
        //             <Chip key={value} label={value} />
        //           ))}
        //         </Box>
        //       )}
        //     >
        //       {field.options.map((option) => (
        //         <MenuItem key={option.value} value={option.value}>
        //           {option.label}
        //         </MenuItem>
        //       ))}
        //     </Select>
        //   </FormControl>

     

        case 'selectValue':
          return(
            <FormControl fullWidth disabled={isDisabled}>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      value={formValues[field.name] || ""}
      onChange={handleChange(field.name)}
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

          );

          case 'weekPicker':
            return (
              <TextField
                type="week"picker
                label={field.label}
                name={field.name}
                value={formValues[field.name] || ''}
                onChange={handleChange(field.name)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            );

      case 'file':
        return (
          <input
            type="file"
            name={field.name}
         
            // onChange={field.name === 'cv' ? onCVChange : onCFChange}
            onChange={handleChange(field.name)}
          />
        );

      case 'number':
  return (
    <TextField
      type="number"
      label={field.label}
      name={field.name}
      onChange={(e) => {
        // Verifica se il valore inserito è un intero prima di chiamare handleChange
        const value = e.target.value;
        if (value === '' || (/^-?\d+$/.test(value) && parseInt(value) >= 0)) {
          // Chiama handleChange solo se il valore è un intero non negativo
          handleChange(field.name)(e);
        }
      }}
      value={formValues[field.name] || ''}
      fullWidth
      disabled={isDisabled}
      InputProps={{
        inputProps: { 
          min: 0, // Imposta il minimo a 0
          step: 1 // Assicura che i cambiamenti siano di 1, per mantenere i valori interi
        }
      }}
    />
  );


        case 'fileMultiple':
          return (
            <input
              type="file"
              name={field.name}
              multiple
              // onChange={field.name === 'cv' ? onCVChange : onCFChange}
              onChange={handleChangeMultiple(field.name)}
            />
          );

      case 'date':
        return (
          <TextField
            type="date"
            label={field.label}
            name={field.name}
            value={formValues[field.name] || ''}
            onChange={handleChange(field.name)}
            InputLabelProps={{ shrink: true }}
            fullWidth
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
      value={formValues[field.name] || ''}
      fullWidth
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

export default FieldBoxFunzionanteFile;
