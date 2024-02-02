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

import CloudDownloadIcon  from '@mui/icons-material/CloudDownload';
import CloudUploadIcon    from '@mui/icons-material/CloudUpload';
import DeleteIcon         from '@mui/icons-material/Delete';
import { GlobalStyles }   from '@mui/material';

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
  onDownloadAllegati,
  onDeleteAllegati
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  





//stile campi disabilitati
const getDisabledStyles = (isDisabled) => {
  return isDisabled ? { color: 'black' } : {};
};





  const handleChangeMultiple = (name) => (event) => {
    if (event.target.type === 'file') {
      // Prendi tutti i file dall'input
      const newFiles = Array.from(event.target.files);
  
      // Accedi ai file esistenti nel tuo stato (se presenti)
      const existingFiles = values[name] || [];
  
      // Combina i file esistenti con i nuovi file
      const combinedFiles = existingFiles.concat(newFiles);
  
      // Aggiorna il valore del form con l'array combinato di file
      setValues({ ...values, [name]: combinedFiles });
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



  const handleFileChange = (name, event) => {
    const file = event.target.files[0];
    if (file) {
      setValues(prevValues => ({
        ...prevValues,
        [name]: {
          file,
          name: file.name,
          url: URL.createObjectURL(file),
        }
      }));
    }
  };


  
  
  
  const handleChangeSkills = (event) => {
    const selectedSkills = event.target ? event.target.value : [];
    setValues({ ...values, skills: selectedSkills });
  };
  
  const handleChangeSkills2 = (event) => {
    const selectedSkills2 = event.target ? event.target.value : [];
    setValues({ ...values, skills2: selectedSkills2 });
  };




  const handleChangeCF = (name) => (event) => {
    const { type, value, files } = event.target;
    if (type === 'file' && files.length > 0) {
      const file = files[0];
      setValues(prevValues => ({
        ...prevValues,
        [name]: {
          file,
          descrizione: file.name,
        },
      }));
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  

  const handleChange = (name) => (event) => {
    const { type, value, files } = event.target;
    let fileValue = value;
  
    if (type === 'file') {
      fileValue = files[0];
    }
  
    setValues({ ...values, [name]: fileValue });
  
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
  
    if (isWeekPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWeekPickerVisible]); 
  

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
          style={getDisabledStyles(field.disabled)}
          
          label={field.label}
          name={field.name}
          onChange={handleChange(field.name)}
          value={values[field.name] || ''}
          fullWidth
          error={!!errors[field.name]} 
          helperText={errors[field.name]} 
          disabled={field.disabled}

        />

        
        );




        

      case 'select':
        return (
          <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}> 
  <InputLabel style={getDisabledStyles(isDisabled)} >{field.label}</InputLabel>
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
  <FormHelperText>{errorMessage || ''}</FormHelperText> 
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
                  selected.map(value => ( 
                    field.options.find(option => option.value === value)?.label || value 
                  )).join(', ') 
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
    disabled={field.disabled}
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
    disabled={field.disabled}
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
                          {/* <Typography variant="body2" style={{ marginRight: '10px' }}>
                          {fileName ? fileName : (values.cf?.descrizione || 'Nessun file selezionato')}
                      </Typography> */}
                        </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            style={{ display:"flex", justifyContent:"flex-end", marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
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
                            style={{ display:"flex", justifyContent:"flex-end", marginLeft: '10px', backgroundColor: "green", color: "white",  marginBottom: "10px" }}
                          >
                        
                            <input
                              type="file"
                              hidden
                              // onChange={(event) => handleFileCVCF('cf', event)}
                              onChange={handleChange(field.name)}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            
                            startIcon={<DeleteIcon />}
                            onClick={() => onDeleteCF(values.cf.id)}
                            style={{ display:"flex", justifyContent:"flex-end", backgroundColor: 'red', marginLeft: '10px', color: "white", marginBottom: "10px" }}
                            disabled={!values[field.name]}
                          >
                            
                          </Button>
                          </Box>
                        </Box>
                    );


                    case 'soloDownloadAllegati':
                    
                     return (
  <Box>
    <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
    {values[field.name] && values[field.name].length > 0 ? (
      values[field.name].map((file, index) => (
        <Box key={file.id} style={{ display: 'flex', flexDirection: "row", alignItems: 'center', margin: '10px 0', justifyContent: 'space-between', }}>
          <Typography variant="body1" style={{ marginRight: '10px' }}>{file}</Typography> 
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
            startIcon={<CloudDownloadIcon style={{justifyContent:"flex-end", marginLeft: "10px"}} />}

            onClick={() => {
              onDownloadAllegati(file.id, file.descrizione);
            }}
          >
          </Button>
        </Box>
      ))
    ) : (
      <Typography variant="body2">Non ci sono allegati presenti</Typography>
    )}
  </Box>
);



                      case 'mofificaAllegati':
                    
                      return (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                          {values[field.name] && values[field.name].map((file, index) => (
                            <Box key={file.id} style={{
                                display: 'flex', 
                                flexDirection: "row", 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                margin: '10px 0'
                              }}>
                              <Typography variant="body1" style={{ marginRight: '10px' }}>
                                {file.descrizione}
                              </Typography>
                              <div style={{ display: 'flex', gap: '10px' }}> 
                                <Button
                                  variant="contained"
                                  color="primary"
                                  startIcon={<CloudDownloadIcon />}
                                  onClick={() => onDownloadAllegati(file.id, file.descrizione)}
                                  style={{ marginLeft: '10px', marginBottom: "10px", marginTop: "10px", justifyContent:"flex-end" }}
                                >
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => onDeleteAllegati(file.id)}
                                  style={{ marginLeft: '10px', marginBottom: "10px", marginTop: "10px", justifyContent:"flex-end", backgroundColor: "red", color: "white" }}
                                  disabled={!values[field.name]}
                                >
                                </Button>
                                
                              </div>
                              
                            </Box>
                          ))}

                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            style={{ display:"flex", justifyContent:"flex-end", marginLeft: '10px', backgroundColor: "green", color: "white",  marginBottom: "10px", width: '70%'}}
                          >

                            <input
                              type="file"
                              hidden
                              multiple
                              name={field.name}
                              // onChange={(event) => handleFileCVCF('cf', event)}
                              onChange={handleChangeMultiple(field.name)}
                              
                            />
                            inserisci nuovi allegati
                          </Button>

                          {/* <input
                            type="file"
                            name={field.name}
                            multiple
                            onChange={handleChangeMultiple(field.name)}
                            /> */}
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
                            // style={{  display:"flex", justifyContent:"flex-end", marginLeft: '10px', marginBottom: "10px", marginTop: "10px" }}
                            style={{ marginLeft: '10px', marginBottom: "10px", marginTop: "10px", justifyContent:"flex-end" }}
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
                            // style={{ display:"flex", justifyContent:"flex-end", marginLeft: '10px', backgroundColor: "green", color: "white",  marginBottom: "10px" }}
                            style={{ marginLeft: '10px', marginBottom: "10px", marginTop: "10px",  backgroundColor: "green", color: "white", justifyContent:"flex-end" }}
                          >
                        
                            <input
                              type="file"
                              hidden
                              onChange={handleChange(field.name)}
                              // onChange={(event) => handleFileCVCF('cv', event)}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            
                            startIcon={<DeleteIcon />}
                            onClick={() => onDeleteCV(values.cv.id)}
                            style={{ display:"flex", justifyContent:"flex-end", backgroundColor: 'red', marginLeft: '10px', color: "white", marginBottom: "10px" }}
                            disabled={!values[field.name]}
                          >
                            
                          </Button>
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
        const value = e.target.value;
        if (value === '' || (/^-?\d+$/.test(value) && parseInt(value) >= 0)) {
          handleChange(field.name)(e);
        }
      }}
      value={values[field.name] || ''}
      fullWidth
      disabled={isDisabled}
      InputProps={{
        inputProps: { 
          min: 0, 
          step: 1 
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
              backgroundColor: "black",
              color: "white",
              fontWeight:"bold",
              "&:hover": {
                backgroundColor: "black",
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
              type="submit"
              style={{
                backgroundColor: "#14D928",
                color: "black",
                fontWeight:"bold",
                
                "&:hover": {
                  backgroundColor: "#14D928",
                  color: "black",
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
