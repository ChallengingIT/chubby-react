import React, { useState, useEffect, useRef } from "react";


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
    Dialog,
    DialogActions,
    DialogContent, 
    DialogContentText, 
    DialogTitle
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon  from "@mui/icons-material/CloudUpload";
import DeleteIcon       from "@mui/icons-material/Delete";
import axios            from "axios";



const FieldBoxFile = ({
    fields,
    initialValues = {},
    disableFields = {},
    onSubmit,
    showBackButton = true,
    showSaveButton = true,
    title = "",
    campiObbligatori,
    skillsOptions,
    idCandidato,
}) => {
    const [values, setValues] = useState(initialValues || {});
    const [errors, setErrors] = useState({});

    const [ fileCV,               setFileCV             ] = useState(null);
    const [ fileCF,               setFileCF             ] = useState(null);
    const [ fileIMG,              setFileIMG            ] = useState(null);
    const [ imagePreviewUrl,      setImagePreviewUrl    ] = useState(null);

    const [ fileAllegati,         setFileAllegati       ] = useState(initialValues.files || []);
    const [ openDialog,           setOpenDialog         ] = useState(false);
    const [ selectedFileId,       setSelectedFileId     ] = useState(null);



    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };


    
    //apertura popup eliminazione cv e cf
    const handleOpenDeleteDialogCVCF = (fileId, fileType) => {
        setSelectedFileId({ id: fileId, type: fileType });
        setOpenDialog(true);
    };
    

    const getDisabledStyles = (isDisabled) => {
        return isDisabled ? { color: "black" } : {};
    };

    const handleChangeSkills = (event) => {
        const selectedSkills = event.target.value; 
        setValues({ ...values, skills: selectedSkills }); 
    };
    

    const handleChange = (name) => (event) => {
        const { type, value } = event.target;
        let fileValue = value;
        setValues({ ...values, [name]: fileValue });
        if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
        }
    };

      //funzione di change per decimalNumber
    const handleChangeDecimal = (name) => (event) => {
    let { value } = event.target;
    value = value.replace(/,/g, '.');
    if (!value || value.match(/^\d+(\.\d{0,2})?$/)) {
    setValues({ ...values, [name]: value });
    }
    };


    const validate = () => {
        let tempErrors = {};
        campiObbligatori.forEach((field) => {
        if (!values[field]) {
            tempErrors[field] = "Campo obbligatorio";
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
            onSubmit(values, fileCV, fileCF, fileIMG);
        }
    };

    const [isWeekPickerVisible, setIsWeekPickerVisible] = useState(false);
    const handleWeekPickerClick = () => {
        setIsWeekPickerVisible(!isWeekPickerVisible);
    };
    const weekPickerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            weekPickerRef.current &&
            !weekPickerRef.current.contains(event.target)
        ) {
            setIsWeekPickerVisible(false);
        }
        };

        if (isWeekPickerVisible) {
        document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isWeekPickerVisible]); 



    const handleDownloadCVCF = async (fileId, fileDescrizione) => {
        const url = `http://89.46.196.60:8443/files/react/download/file/${fileId}`;
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'blob', 
                headers: headers
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `${fileDescrizione}.pdf`); 
            document.body.appendChild(link);
        
            link.click();
            document.body.removeChild(link);
            } catch (error) {
            console.error('Si è verificato un errore durante il download del file:', error);
            }
        };


        const handleDeleteCVCF = async (fileId, idCandidato, fileType) => {
            const idc = idCandidato;
            try {
            const response = await axios.delete(`http://89.46.196.60:8443/files/react/elimina/file/candidato/${fileId}/${idc}`, { headers: headers })
            if(response.data === "OK") {
            } else {
                console.error("Errore dal server: ", response.data);
            }
            if (fileType === 'cv') {
                setValues({ ...values, cv: null });
            } else if (fileType === 'cf') {
                setValues({ ...values, cf: null });
            }
            setOpenDialog(false); 
            setSelectedFileId(null);  
            } catch (error) {
            console.error("Si è verificato un errore durante l'eliminazione del file:", error);
            }
        };


        const handleChangeCV = (name) => (event) => {
            const file = event.target.files[0];
            if (file) {
                setFileCV(file);
                setValues({ ...values, cv: { descrizione: file.name } });
            }
        };
        
        const handleChangeCF = (name) => (event) => {
            const file = event.target.files[0];
            if (file) {
                setFileCF(file);
                setValues({ ...values, cf: { descrizione: file.name } });
            }
        };


        const handleChangeIMG = (name) => (event) => {
            const file = event.target.files[0];
            if (file) {
                setFileIMG(file);
                setValues({ ...values, image: file });
                setImagePreviewUrl(URL.createObjectURL(file));
            }
        };





    //*******************parte del return per la creazione grafica dei componenti*******************//

    const renderField = (field) => {
        const isDisabled = disableFields[field.name];
        const errorMessage = errors[field.name];
        switch (field.type) {
        case "text":
            return (
            <TextField
                style={getDisabledStyles(field.disabled)}
                label={field.label}
                name={field.name}
                onChange={handleChange(field.name)}
                value={values[field.name] || ""}
                fullWidth
                error={!!errors[field.name]} 
                helperText={errors[field.name]} 
                disabled={field.disabled}
            />
            );


            case 'decimalNumber':
                return (
                    <TextField
                    sx={{ width: "100%", textAlign: "left" }}
                    label={field.label}
                    name={field.name}
                    value={values[field.name] || ''}
                    onChange={handleChangeDecimal(field.name)} 
                    fullWidth
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                    // disabled={field.disabled}
                    />
                );


        case "select":
            return (
            <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}>
                {" "}
                <InputLabel style={getDisabledStyles(isDisabled)}>
                {field.label}
                </InputLabel>
                <Select
                style={{ width: "100%", textAlign: "left" }}
                name={field.name}
                value={values[field.name] || ""}
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
                <FormHelperText>{errorMessage || ""}</FormHelperText>{" "}
            </FormControl>
            );

        case "multipleSelect":
            return (
            <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                name={field.name}
                value={values[field.name] || []}
                onChange={handleChange(field.name)}
                renderValue={
                    (selected) =>
                    selected
                        .map(
                        (
                            value 
                        ) =>
                            field.options.find((option) => option.value === value)
                            ?.label || value 
                        )
                        .join(", ") 
                }
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

        case "multipleSelectSkill":
            return (
            <FormControl
                fullWidth
                error={!!errors[field.name]}
                disabled={isDisabled}
            >
                <InputLabel>{field.label}</InputLabel>
                <Select
                multiple
                name="skills"
                value={values.skills || []}
                onChange={handleChangeSkills}
                disabled={field.disabled}
                style={{ width: "100%", textAlign: "left" }}
                renderValue={(selected) =>
                    selected
                    .map((skillId) => {
                        const foundOption = skillsOptions.find(
                        (option) => option.value === skillId
                        );
                        return foundOption ? foundOption.label : "";
                    })
                    .join(", ")
                }
                >
                {skillsOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                        checked={(values.skills || []).indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
                </Select>
                {errors.skills && <FormHelperText>{errors.skills2}</FormHelperText>}
            </FormControl>
            );

        case "selectValue":
            return (
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

        case "weekPicker":
            return (
            <TextField
                type="week"
                label={field.label}
                name={field.name}
                value={values[field.name] || ""}
                onChange={handleChange(field.name)}
                InputLabelProps={{ shrink: true }}
                error={!!errors[field.name]}
                fullWidth
            />
            );


        case "number":
            return (
            <TextField
                type="number"
                label={field.label}
                name={field.name}
                onChange={(e) => {
                const value = e.target.value;
                if (
                    value === "" ||
                    (/^-?\d+$/.test(value) && parseInt(value) >= 0)
                ) {
                    handleChange(field.name)(e);
                }
                }}
                value={values[field.name] || ""}
                fullWidth
                disabled={isDisabled}
                InputProps={{
                inputProps: {
                    min: 0, 
                    step: 1, 
                },
                }}
            />
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
                error={!!errors[field.name]}
                disabled={field.disabled}
                fullWidth
            />
            );

        case "note":
            return (
            <TextField
                label={field.label}
                name={field.name}
                multiline
                rows={4}
                onChange={handleChange(field.name)}
                value={values[field.name] || ""}
                disabled={field.disabled}
                fullWidth
            />
            );


            case "modificaFileCV":
                return(
                    <Box sx={{ width: '25em', overflow: 'hidden', mr: 10}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                        <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                        <Button
                                    variant="contained"
                                    sx={{ 
                                    backgroundColor: 'black',
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    justifyContent:"flex-end",
                                    mr: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                startIcon={<CloudDownloadIcon />}
                                disabled={!values[field.name]}
                                component="label"
                                onClick={() => handleDownloadCVCF(values.cv.id, values.cv.descrizione)}
                                >

                                </Button>
                                </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0'}}>
                        <Typography variant="body2">
                        {values.cv?.descrizione || 'Nessun file selezionato'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                <Button
                                    variant="contained"
                                    sx={{ 
                                    backgroundColor: 'black',
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    justifyContent:"flex-end", 
                                    color: 'white',
                                    ':hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                    startIcon={<CloudUploadIcon />}
                                    component="label"
                                >
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleChangeCV(field.name)}
                                    />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        marginLeft: '10px', 
                                        marginBottom: "10px", 
                                        marginTop: "10px", 
                                        justifyContent:"flex-end", 
                                        backgroundColor: '#246f55', 
                                        color: 'white',
                                        ':hover': {
                                            backgroundColor: 'red',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    startIcon={<DeleteIcon />}
                                    component="label"
                                    disabled={!values[field.name]}
                                    // onClick={() => handleDeleteCVCF(values.cv.id, idCandidato, 'cv')}
                                    onClick={() => handleOpenDeleteDialogCVCF(values.cv.id, 'cv')}
                                >
                                </Button>
                                </Box>
                        </Box>
                    </Box>
                );
            



                case "modificaFileCF":
                    return(
                        <Box sx={{ width: '20em'}}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                            <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                            <Button
                                    variant="contained"
                                    sx={{ 
                                    backgroundColor: 'black',
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    mr: 0.5,
                                    justifyContent:"flex-end", 
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                    startIcon={<CloudDownloadIcon />}
                                    disabled={!values[field.name]}
                                    component="label"
                                    onClick={() => handleDownloadCVCF(values.cf.id, values.cf.descrizione)}
                                    >

                                </Button>
                                </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', margin: '10px 0'}}>
                            <Typography variant="body2" >
                            {values.cf?.descrizione || 'Nessun file selezionato'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    justifyContent:"flex-end", 
                                    backgroundColor: 'black', 
                                    color: 'white',
                                    ':hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'

                                    }
                                }}
                                    startIcon={<CloudUploadIcon />}
                                    component="label"
                                >
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleChangeCF(field.name)}
                                    />
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        marginLeft: '10px', 
                                        marginBottom: "10px", 
                                        marginTop: "10px", 
                                        justifyContent:"flex-end", 
                                        backgroundColor: '#246f55', 
                                        color: 'white',
                                        ':hover': {
                                            backgroundColor: 'red',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    startIcon={<DeleteIcon />}
                                    component="label"
                                    disabled={!values[field.name]}
                                    // onClick={() => handleDeleteCVCF(values.cf.id, idCandidato, 'cf')}
                                    onClick={() => handleOpenDeleteDialogCVCF(values.cf.id, 'cf')}

                                >
                                </Button>
                                </Box>
                            </Box>
                        </Box>
                    );



                    case "aggiungiImmagine":
                        return(
                            <Box sx={{ width: '25em', overflow: 'hidden', mr: 10}}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                                <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                                        </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0'}}>
                                <Typography variant="body2">
                                        {imagePreviewUrl ? (
                                            <img src={imagePreviewUrl} alt="Immagine Caricata" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                        ) : (
                                            'Nessun file selezionato'
                                        )}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                        <Button
                                            variant="contained"
                                            sx={{ 
                                            backgroundColor: 'black',
                                            marginLeft: '10px', 
                                            marginBottom: "10px", 
                                            marginTop: "10px", 
                                            justifyContent:"flex-end", 
                                            color: 'white',
                                            ':hover': {
                                                backgroundColor: 'black',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                            startIcon={<CloudUploadIcon />}
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleChangeIMG(field.name)}
                                            />
                                        </Button>
                                        </Box>
                                </Box>
                            </Box>
                        );

        default:
            return null;
        }
    };

    return (
        <Box>
            <Dialog
    open={openDialog}
    onClose={() => setOpenDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        {"Conferma Eliminazione"}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare questo file?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenDialog(false)}
        sx={{
            backgroundColor: 'black',
            color: 'white',
            "&:hover": {
                backgroundColor: 'black'
            }
            
            }}>
            Annulla
            </Button>
        <Button onClick={() => {
            if (selectedFileId.type === 'cv') {
                handleDeleteCVCF(selectedFileId.id, idCandidato, 'cv');
            } else if (selectedFileId.type === 'cf') {
                handleDeleteCVCF(selectedFileId.id, idCandidato, 'cf');
            }
            setOpenDialog(false);
        }} 
        autoFocus 
        sx={{
            backgroundColor: '#00853C',
            color: 'white',
            "&:hover": {
                backgroundColor: '#00853C',
            }
        }}>
            Elimina
        </Button>
    </DialogActions>
</Dialog>
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
            {title}
        </Typography>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
            {fields.map((field) => (
                <Grid item xs={field.type === "note" ? 12 : 4} key={field.name}>
                {renderField(field)}
                </Grid>
            ))}
            </Grid>
            <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em'}}>* Campo Obbligatorio</Typography>

            <Box
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
                    fontWeight: "bold",
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
                    backgroundColor: "#00853C",
                    color: "white",
                    fontWeight: "bold",

                    "&:hover": {
                    backgroundColor: "#00853C",
                    color: "white",
                    transform: "scale(1.05)",
                    },
                }}
                >
                Salva
                </Button>
            )}
            </Box>

        </form>
        </Box>
    );
    };

    export default FieldBoxFile;
