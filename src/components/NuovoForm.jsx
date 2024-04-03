import React, { useState, useEffect, useRef } from "react";
import CloudUploadIcon  from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from "@mui/x-date-pickers";
import { 
    Box,
    FormControl,
    Autocomplete,
    TextField,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel
} from "@mui/material";


const NuovoForm = ({
    fields,
    initialValues = {},
    disabledFields = {},
    onSubmit,
    showBackButton = true,
    showSaveButton = true,
    errors,
    removeError
}) => {
    const [ values, setValues ] = useState(initialValues || {});

    const [ fileCV,         setFileCV       ] = useState(null);
    const [ fileCF,         setFileCF       ] = useState(null);
    const [ fileIMG,        setFileIMG      ] = useState(null);
    const [ imagePreviewUrl, setImagePreviewUrl ] = useState(null);
    const [ openDialog,     setOpenDialog   ] = useState(false);
    const [ selectedFileId, setSelectedFileId ] = useState(null);



    const handleChange = (name, selectedValues) => {
        setValues({ ...values, [name]: selectedValues });
    
        if (errors[name]) {
            removeError(name); 
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


    const handleSubmit = (e) => {
        e.preventDefault();
            onSubmit(values, fileCV, fileCF, fileIMG);
    };

        //*******************parte del return per la creazione grafica dei componenti*******************//


        const renderField = (field) => {
            const isDisabled = disabledFields[field.name];
            const errorMessage = errors[field.name];
            switch (field.type) {
                case "text":
                    return (
                        <TextField
                        label={field.label}
                        name={field.name}
                        variant="filled"
                        onChange={handleChange}
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
                        label={field.label}
                        name={field.name}
                        variant="filled"
                        onChange={handleChangeDecimal}
                        fullWidth
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                        />
                    );

                case "select":
                    return (
                        <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}>
                            {" "}
                            <Autocomplete
                            fullWidth
                            variant="filled"
                            options={field.options}
                            error={!!errorMessage}
                            value={field.options.find(option => option.value === values[field.name]) || null}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                name={field.name}
                                label={field.label}
                                variant="filled"
                                />
                            )}
                            />
                        </FormControl>
                    );
                


                case 'multipleSelect':
                    return (
                    <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}>
                    <Autocomplete
                        multiple
                        options={field.options}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.label}
                        renderOption={(option, { selected }) => (
                            <FormControlLabel
                            control={<Checkbox checked={selected} />}
                            label={option.label}
                            onChange={() => handleChange(field.name, option.value)}
                            />
                        )}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            name={field.name}
                            label={field.label}
                            variant="filled"
                            />
                        )}
                        value={field.options.filter(option => values[field.name]?.includes(option.value))}
                        onChange={(event, newValue) => {
                            handleChange(field.name, newValue.map(option => option.value));
                        }}
                        />
                    </FormControl>
                    );

                    case 'date':
                        return(
                            <FormControl fullWidth error={!!errorMessage} disabled={isDisabled}>
                            <DatePicker
                                label={field.label}
                                value={values[field.name] || null}
                                onChange={(newValue) => handleChange(field.name, newValue)}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    name={field.name}
                                    variant="filled"
                                    />
                                )}
                                />
                            </FormControl>
                        );


                        case "weekPicker":
                            return (
                            <TextField
                                type="week"
                                variant="filled"
                                label={field.label}
                                name={field.name}
                                value={values[field.name] || ""}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors[field.name]}
                                fullWidth
                            />
                            );

                            case "number":
                                return (
                                <TextField
                                    type="number"
                                    variant="filled"
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


                                case "note":
                                    return (
                                    <TextField
                                        label={field.label}
                                        name={field.name}
                                        variant="filled"
                                        multiline
                                        rows={4}
                                        onChange={handleChange}
                                        value={values[field.name] || ""}
                                        disabled={field.disabled}
                                        fullWidth
                                    />
                                    );
                            default: 
                            return null;
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {fields.map((field, index) => (
                        <Grid item xs={12} md={field.type === "note" ? 12 : 6} key={index}>
                            {renderField(field)}
                        </Grid>
                    ))}
                </Grid>
            </form>
        );
        
};

export default NuovoForm;