import React, { useState, useEffect, useRef } from 'react';
import { 
  Grid, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Chip, 
  Input, 
  Box, 
  Typography, 
  Checkbox, 
  ListItemText, 
  FormHelperText 
} from '@mui/material';
// import WeekPickers from "./WeekPickers";
// import dayjs from 'dayjs';
import CloudDownloadIcon  from '@mui/icons-material/CloudDownload';
import CloudUploadIcon    from '@mui/icons-material/CloudUpload';
import DeleteIcon         from '@mui/icons-material/Delete';
// import axios from 'axios';



const FieldsBox = ({
  fields,
  initialValues = {},
  disableFields = {},
  onSubmit,
  onDownloadCV,
  onDeleteCV,
  onUploadCF,
  onUploadCV,
  onDeleteCF,
  onDownloadCF,
  onCVChange, onCFChange,
  showBackButton = true,
  showSaveButton = true,
  title="",
  campiObbligatori,
  skillsOptions,
  skills2Options,
  onDownloadAllegati
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});


  // const handleChange = (name) => (event) => {
  //   setValues({ ...values, [name]: event.target.value });
  // };
  const handleChangeMultiple = (name) => (event) => {
    if (event.target.type === 'file') {
      // Prendi tutti i file dall'input
      const files = Array.from(event.target.files);
      console.log(`File caricati per ${name}:`, files);

      // Aggiorna il valore del form con l'array di file
      setValues({ ...values, [name]: files });
    } else {
      // Per altri tipi di input, imposta il valore come al solito
      setValues({ ...values, [name]: event.target.value });
    }
  };



  useEffect(() => {

    if (values.cf && values.cf.file) {

      setValues(prevValues => ({
        ...prevValues,
        cf: {
          ...prevValues.cf,
          descrizione: values.cf.file.name,
        },
      }));
    }

    if (values.cv && values.cv.file) {
      setValues(prevValues => ({
        ...prevValues,
        cv: {
          ...prevValues.cv,
          descrizione: values.cv.file.name,
        },
      }));
    }
  }, [values.cf, values.cv]); 



// const handleDownload = async (fileId) => {
//   console.log("FILE ID: ", fileId);
//   // URL dell'endpoint per il download del file
//   const url = `http://localhost:8080/files/react/download/file/${fileId}`;

//   try {
//     // Esegui la richiesta POST usando Axios
//     const response = await axios({
//       method: 'POST',
//       url: url,
//       responseType: 'blob', // Importante per gestire il download di file binari
//     });

//     // Crea un URL temporaneo per il file scaricato
//     const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

//     // Crea un elemento link per scaricare il file
//     const link = document.createElement('a');
//     link.href = fileURL;
//     link.setAttribute('download', `file-${fileId}.pdf`); // Imposta un nome file per il download con estensione .pdf
//     document.body.appendChild(link);

//     // Simula il click e rimuovi l'elemento link
//     link.click();
//     document.body.removeChild(link);
//   } catch (error) {
//     console.error('Si è verificato un errore durante il download del file:', error);
//     // Gestisci qui l'errore come preferisci
//   }
// };





  // const handleDownload = (fileUrl, fileName) => {
  //   const link = document.createElement('a');
  //   link.href = fileUrl;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  
  // const handleDeleteFile = (fieldName, fileName) => {
  //   // Aggiorna lo stato per rimuovere il file dall'elenco
  //   setValues({
  //     ...values,
  //     [fieldName]: values[fieldName].filter(file => file.name !== fileName)
  //   });
  // };

  // const handleDeleteFile = (fieldName, fileId) => {
  //   // Verifica che il campo esista e che sia un oggetto
  //   if (values[fieldName] && typeof values[fieldName] === 'object') {
  //     // Verifica che l'oggetto rappresenti il file che vuoi eliminare
  //     if (values[fieldName].id === fileId) {
  //       // Rimuovi il file dall'oggetto values
  //       const {[fieldName]: _, ...newvalues} = values;
  
  //       // Aggiorna lo stato per riflettere la rimozione del file
  //       setValues(newvalues);
  //     } else {
  //       console.error("Il file da eliminare non corrisponde all'ID fornito.");
  //     }
  //   } else {
  //     console.error(`Expected an object for ${fieldName}, but received:`, values[fieldName]);
  //     // Gestisci l'errore come preferisci...
  //   }
  // };
  
  

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
  //     setValues({ ...values, [name]: formData });
  //   }
  // };

  const handleFileChange = (name, event) => {
    const file = event.target.files[0];
    if (file) {
      setValues(prevValues => ({
        ...prevValues,
        [name]: {
          file,
          name: file.name,
          url: URL.createObjectURL(file), // Crea un URL temporaneo per il download del file
        }
      }));
    }
  };

  // const handleFileCVCF = (name, event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     if (name === "cv") {
  //       onUploadCV(file);  // Chiama handleUploadCV con il file selezionato
  //     } else if (name === "cf") {
  //       onUploadCF(file);  // Chiama handleUploadCF con il file selezionato
  //     }
  //   }
  // };
  
  
  
  const handleChangeSkills = (event) => {
    // Assicurati che event.target sia definito
    const selectedSkills = event.target ? event.target.value : [];
    setValues({ ...values, skills: selectedSkills });
  };
  
  const handleChangeSkills2 = (event) => {
    // Assicurati che event.target sia definito
    const selectedSkills2 = event.target ? event.target.value : [];
    setValues({ ...values, skills2: selectedSkills2 });
  };


  const handleChangeCV = (name) => (event) => {
  const { type, value, files } = event.target;
  let fileValue = value;
    if ( type === 'file' && name === 'cv') {
      fileValue = files[0];
    if (fileValue) {

      setValues(prevValues => ({
        ...prevValues,
        cv: {
          file: fileValue,
          descrizione: fileValue.name
          }
      }));
      console.log(`File ${name} sostituisce il vecchio:`, fileValue);
    }
  }  
    }

    const handleChangeCF = (name) => (event) => {
      const { type, value, files } = event.target;
      let fileValue = value;
        if ( type === 'file' && name === 'cf') {
          fileValue = files[0];
        if (fileValue) {
    
          setValues(prevValues => ({
            ...prevValues,
            cf: {
              file: fileValue,
              descrizione: fileValue.name
              }
          }));
          console.log(`File ${name} sostituisce il vecchio:`, fileValue);
        }
      }  
        }
  


  



  const handleChange = (name) => (event) => {
    const { type, value, files } = event.target;
    let fileValue = value;
  
    if (type === 'file') {
      fileValue = files[0];
      console.log(`File caricato per ${name}:`, fileValue);
    }
  
    setValues({ ...values, [name]: fileValue });
  
    // Rimuovi l'errore quando un utente modifica il campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    campiObbligatori.forEach(field => {
      if (!values[field]) {
        tempErrors[field] = 'Campo obbligatorio';
      }
    });
    setErrors(tempErrors);
    // console.log('Validating: ', tempErrors);
    return !Object.keys(tempErrors).length;
  };
  
  
  

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    
    if (isValid) {
      onSubmit(values);
    }
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
    const errorMessage = errors[field.name];
    switch (field.type) {
      case 'text':

        return (
  
          <TextField
          label={field.label}
          name={field.name}
          onChange={handleChange(field.name)}
          value={values[field.name] || ''}
          fullWidth
          error={!!errors[field.name]} // Il campo diventa rosso se c'è un errore
          helperText={errors[field.name]} // Mostra il messaggio di errore se c'è un errore
          disabled={field.disabled}
        />

        
        );




        

      case 'select':
        return (
          <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}> {/* Aggiungi error qui */}
  <InputLabel>{field.label}</InputLabel>
  <Select
    style={{ width: "100%", textAlign: "left" }}
    name={field.name}
    value={values[field.name] || ''}
    onChange={handleChange(field.name)}
    error={!!errors[field.name]}
    disabled={field.disabled}
  >
    {field.options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
  <FormHelperText>{errorMessage || ''}</FormHelperText> {/* Aggiungi helperText sotto al Select */}
</FormControl>

        );

      case 'multipleSelect':
        return (
            <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                name={field.name}
                value={values[field.name] || []}
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


                  case 'multipleSelectSkill':
  return (
    <FormControl fullWidth error={!!errors[field.name]} disabled={isDisabled}>
  <InputLabel>{field.label}</InputLabel>
  <Select
    multiple
    name="skills2"
    value={values.skills || []}
    onChange={handleChangeSkills}
    style={{ width: "100%", textAlign: "left" }}
    renderValue={selected =>
      selected.map(skillId => {
        const foundOption = skillsOptions.find(option => option.value === skillId);
        return foundOption ? foundOption.label : '';
      }).join(', ')
    }
  >
    {skillsOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={(values.skills || []).indexOf(option.value) > -1} />
        <ListItemText primary={option.label} />
      </MenuItem>
    ))}
  </Select>
  {errors.skills && <FormHelperText>{errors.skills2}</FormHelperText>}
</FormControl>

  );

case 'multipleSelectSkill2':
  return (
    <FormControl fullWidth error={!!errors[field.name]} disabled={isDisabled}>
  <InputLabel>{field.label}</InputLabel>
  <Select
    multiple
    name="skills2"
    value={values.skills2 || []}
    onChange={handleChangeSkills2}
    style={{ width: "100%", textAlign: "left" }}
    renderValue={selected =>
      selected.map(skillId => {
        const foundOption = skills2Options.find(option => option.value === skillId);
        return foundOption ? foundOption.label : '';
      }).join(', ')
    }
  >
    {skills2Options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={(values.skills2 || []).indexOf(option.value) > -1} />
        <ListItemText primary={option.label} />
      </MenuItem>
    ))}
  </Select>
  {errors.skills2 && <FormHelperText>{errors.skills2}</FormHelperText>}
</FormControl>

  );



                  case 'downloadFileCF':
                    return (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                        <Box style={{ display: 'flex', flexDirection: "column", alignItems: 'center', margin: '10px 0' }}>
                        <Typography variant="body2" style={{ marginRight: '10px' }}>
                          {values.cf?.descrizione || 'Nessun file selezionato'}
                        </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            style={{  marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
                            startIcon={<CloudDownloadIcon />}
                            // onChange={(event) => handleFileChange(field.name, event)}
                            onClick={() => onDownloadCF(values.cf.id, values.cf.descrizione)}
    
                            disabled={!values[field.name]}
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
                              // onChange={(event) => handleFileCVCF('cf', event)}
                              onChange={handleChangeCF(field.name)}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            
                            startIcon={<DeleteIcon />}
                            onClick={() => onDeleteCF(values.cf.id)}
                            style={{ backgroundColor: 'red', marginLeft: '10px', color: "white", marginBottom: "10px" }}
                            disabled={!values[field.name]}
                          >
                            
                          </Button>
                          </Box>
                        </Box>
                    );
                  
                  
                


                  case 'downloadFileCV':
                    return (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                        <Box style={{ display: 'flex', flexDirection: "column", alignItems: 'center', margin: '10px 0' }}>
                        <Typography variant="body2" style={{ marginRight: '10px' }}>
                          {values.cv?.descrizione || values.cv?.file?.name || 'Nessun file selezionato'}
                        </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            style={{  marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
                            startIcon={<CloudDownloadIcon />}
                            // onClick={() => values[field.name] && handleDownload(values[field.name].url, values[field.name].name)}
                            onClick={() => onDownloadCV(values.cv.id, values.cv.descrizione)}
                            disabled={!values[field.name]}
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
                              onChange={handleChangeCV(field.name)}
                              // onChange={(event) => handleFileCVCF('cv', event)}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            
                            startIcon={<DeleteIcon />}
                            onClick={() => onDeleteCV(values.cv.id)}
                            style={{ backgroundColor: 'red', marginLeft: '10px', color: "white", marginBottom: "10px" }}
                            disabled={!values[field.name]}
                          >
                            
                          </Button>
                          </Box>
                        </Box>
                    );

                    case 'downloadAllegati':
                      return (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                          <Box style={{ display: 'flex', flexDirection: "column", alignItems: 'center', margin: '10px 0' }}>
                            {values[field.name] && values[field.name].length > 0 ? (
                              values[field.name].map((file, index) => (
                                <Box key={file.id || index} style={{ display: 'flex', alignItems: 'center', marginBottom: "10px" }}>
                                  <Typography variant="body2" style={{ marginRight: '10px', flexGrow: 1 }}>
                                    {file.descrizione || 'Nessun file selezionato'}  
                                  </Typography>
                          
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudDownloadIcon />}
                                    onClick={() => onDownloadAllegati(file.id, file.descrizione)}  
                                    disabled={!file}
                                  >
                                    
                                  </Button>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2">Nessun file disponibile</Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    
                    
        case 'selectValue':
          return(
            <FormControl fullWidth disabled={isDisabled}>
    <InputLabel>{field.label}</InputLabel>
    <Select
      name={field.name}
      value={values[field.name] || ""}
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
                type="week"
                label={field.label}
                name={field.name}
                value={values[field.name] || ''}
                onChange={handleChange(field.name)}
                InputLabelProps={{ shrink: true }}
                error={!!errors[field.name]}
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
      value={values[field.name] || ''}
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
            value={values[field.name] || ''}
            onChange={handleChange(field.name)}
            InputLabelProps={{ shrink: true }}
            error={!!errors[field.name]}
            disabled={field.disabled}
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
      value={values[field.name] || ''}
      disabled={field.disabled}
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
              // onClick={() => onSubmit(values)}
              type="submit"
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

export default FieldsBox;
