import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Select, MenuItem, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Grid, FormControl, Autocomplete, InputLabel, FormHelperText, Snackbar } from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios from 'axios';
import CustomAutocomplete from '../../components/fields/CustomAutocomplete';
import CustomTextFieldAggiungi from '../../components/fields/CustomTextFieldAggiungi';
import CustomNoteAggiungi from '../../components/fields/CustomNoteAggiungi';
import CustomImgFieldAggiunta from '../../components/fields/CustomImgFieldAggiunta';


const AggiungiAziendaGrafica = () => {
    const navigate = useNavigate();

    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Profilo');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ imagePreviewUrl,    setImagePreviewUrl      ] = useState(null);
    const [ fileIMG,            setFileIMG              ] = useState(null);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});

    //stati per i valori
    const [ provinceOptions,    setProvinceOptions      ] = useState([]);
    const [ ownerOptions,       setOwnerOptions         ] = useState([]);
    const [ values,             setValues               ] = useState({});



    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchProvinceOptions = async () => {
        try {
    
            const provinceResponse = await axios.get("http://localhost:8080/aziende/react/province", { headers: headers });
            const ownerResponse    = await axios.get("http://localhost:8080/aziende/react/owner",    { headers: headers }   );
    
            if (Array.isArray(ownerResponse.data)) {
            const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
            }
            
            if (Array.isArray(provinceResponse.data)) {
                const provinceOptions = provinceResponse.data.map((province) => ({
                label: province.nomeProvince,
                value: province.nomeProvince,
                }));
                setProvinceOptions(provinceOptions);
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", provinceResponse.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };
    
        fetchProvinceOptions();
    }, []);



    const menu = [
        {
            title: 'Profilo',
            icon: <CircleOutlinedIcon />
        },
        { 
            title: 'Location',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Contatti',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'File',
            icon: <CircleOutlinedIcon />
        }
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0: 
                return [ "denominazione", "settoreMercato", "idOwner", "status" ];
            case 1: 
                return [ "citta", "provincia", "sedeOperativa", "cap" ];
            default: 
                return [];
        }
    };


    //funzione per la validazione dei campi
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach(field => {
            if (!values[field]) {
                errors[field] = 'Questo campo è obbligatorio';
            }
        });
        return errors;
    };


    //funzione per il cambio stato dell'immagine

    const handleChangeIMG = (file) => {
        if (file) {
            setFileIMG(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };


    //funzioni per cambiare pagina del form
    const handleBackButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex > 0) {
            setActiveSection(menu[currentIndex - 1].title);
            setCurrentPageIndex(currentIndex - 1);
        }
    };


    const handleNextButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex < menu.length - 1) {
            const mandatoryFields = getMandatoryFields(currentIndex);
            const errors = validateFields(values, mandatoryFields);
            const hasErrors = Object.keys(errors).length > 0;

            if (!hasErrors) {
                setActiveSection(menu[currentIndex + 1].title);
                setCurrentPageIndex(currentIndex + 1);
            } else {
                setAlert({ open: true, message: 'Compilare tutti i campi obbligatori presenti per poter avanzare'});
            }
        }
    };


        // Funzione per il cambio stato degli input
        const handleChange = (fieldValue) => {
        setValues(prevValues => ({
            ...prevValues,
            ...fieldValue
        }));
        };


        //funzione per la chiusura dell'alert
        const handleCloseAlert = (reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({...alert, open: false});
        };


        //funzione per il salvataggio
        const handleSubmit = async (values) => {
            const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
            const mandatoryFields = getMandatoryFields(currentIndex); 
            const errors = validateFields(values, mandatoryFields);
            const hasErrors = Object.keys(errors).length > 0;
        
            if (!hasErrors) {
                try {
                    Object.keys(values).forEach(key => {
                        if (!campiObbligatori.includes(key) && !values[key]) {
                            values[key] = null;
                        }
                    });
        
                    const userString = localStorage.getItem("user");
                    if (!userString) {
                        console.error("Nessun utente o token trovato in localStorage");
                        return;
                    }
                    const user = JSON.parse(userString);
                    const accessToken = user?.accessToken;
        
                    if (!accessToken) {
                        console.error("Nessun token di accesso disponibile");
                        return;
                    }
        
                    const headers = {
                        Authorization: `Bearer ${accessToken}`
                    };
                    delete values.image;


    
        
                    const response = await axios.post("http://localhost:8080/aziende/react/salva", values, {
                        headers: headers
                    });
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: "azienda già esistente!" });
                        console.error("L'azienda è già stata salvata.");
                        return; 
                    }
                    const aziendaID = response.data;
    
                    try {
                        if (fileIMG) {
                        const formDataIMG = new FormData();
                        formDataIMG.append('logo', fileIMG);
                    
                        const responseIMG = await axios.post(`http://localhost:8080/aziende/react/salva/file/${aziendaID}`, formDataIMG, {
                            headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${accessToken}`
                            }
                        });
                    
                        }
                    } catch (error) {
                        console.error("Errore nell'invio dell'immagine: ", error);
                    }
                    navigate("/aziende");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
            }
        };
        



        const campiObbligatori = [ "denominazione", "ragioneSociale", "idOwner", "status", "citta", "provincia", "sedeOperativa", "cap" ];

        const fields =[
            { type: "titleGroups",                label: "Profilo"            },
            { label: 'Nome Azienda*',                   name: 'denominazione',            type:'text'                              },
            { label: 'Settore Mercato*',                name: 'settoreMercato',           type:'text'                              },
            { label: "Email",                           name: "email",                    type: "text"                             },
            { label: "Partita IVA",                     name: "pi",                       type: "text"                             },
            { label: "Codice Fiscale",                  name: "cf",                       type: "text"                             },
            { label: "Owner*",                          name: "idOwner",                  type: "select", options: ownerOptions    },
            { label: "Tipologia",                       name: "tipologia",                type: "select", options: [
                { value: "Cliente", label: "Cliente" },
                { value: "Prospect", label: "Prospect" },
                { value: "EXCLIENTE", label: "Ex Cliente" }
            ]  },
            { label: "Stato*",                          name: "status",                    type: "select", options: [
                { value: 1, label: "Verde" },
                { value: 2, label: "Giallo" },
                { value: 3, label: "Rosso" },
            ]  },
    
            { type: "titleGroups",                label: "Location"            },
            { label: "Città*",                          name: "citta",                    type: "text"                             },
            { label: "Paese",                           name: "paese",                    type: "text"                             },
            { label: "Provincia*",                      name: "provincia",                type: "select", options: provinceOptions },
            { label: "Sede Operativa*",                  name: "sedeOperativa",            type: "text"                            },
            { label: "Sede Legale",                     name: "sedeLegale",               type: "text"                             },
            { label: "CAP*",                             name: "cap",                      type: "text"                             },
    
            { type: "titleGroups",                label: "Contatti"            },
            { label: "Pec",                             name: "pec",                      type: "text"                             },
            { label: "Codice Destinatario",             name: "codiceDestinatario",       type: "text"                             },
            { label: "Sito Web",                        name: "sito",                     type: "text"                             },
            { label: 'Note',                            name: 'note',                     type: 'note'                             },
    
    
            { type: "titleGroups",                label: "File"            },
            { label: 'Logo',                      name: 'logo',                     type: 'aggiungiImmagine'                             },
        ];

        //funzione per suddividere fields nelle varie pagine in base a titleGroups
        const groupFields = (fields) => {
            const groupedFields = [];
            let currentGroup = [];
            fields.forEach((field) => {
                if (field.type === 'titleGroups') {
                    if (currentGroup.length > 0) {
                        groupedFields.push([...currentGroup]);
                    }
                    currentGroup = [field];
                } else {
                    currentGroup.push(field);
                }
            });
            if (currentGroup.length > 0) {
                groupedFields.push([...currentGroup]); 
            }
            return groupedFields;
        };

        const groupedFields = groupFields(fields); //questo è l'array suddiviso

        //funzione per richiamare i vari campi
        const renderFields = (field) => {
            const { type, ...otherProps } = field;
            // const errorMessage = errors[field.name];


            switch (type) {
                case 'text':
                    return (
                        <CustomTextFieldAggiungi
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        />
                    );


                    case 'note':
                    return (
                        <CustomNoteAggiungi
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        />
                    );

                case 'select': 
                        return (
                            <CustomAutocomplete
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChange}
                            getOptionSelected={(option, value) => option.value === value.value}
                            />
                        );

                case 'aggiungiImmagine': 
                return (
                    <CustomImgFieldAggiunta
                    label={field.label}
                    imagePreviewUrl={imagePreviewUrl}
                    onChange={handleChangeIMG}
                    />
                );
                    default:
                        return null;
            }
        };


        const renderFieldsGroups = () => {
            return (
                <Box sx={{ ml: 15, mr: 15}}>
                    {groupedFields[currentPageIndex].map((fields, index) => {
                        return (
                            <Box key={index}>
                                {renderFields(fields)}
                            </Box>
                        );
                    })}
                </Box>
            );
        };


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
        <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', ml: '12.5em', mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden' }}>
            <Box sx={{ width: '22%', height: '100%', background: '#5F8671', p:2, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                    <Button
                    onClick={handleGoBack}
                    sx={{
                        color: 'black',
                        border:'none',
                        fontSize: '0.8em',
                        cursor: 'pointer',
                        outline: 'none',
                        borderRadius: '10px',
                        mt: 4,
                        ml: 2,
                        '&:hover': {
                            color: '#EDEDED'
                        }
                    }}
                    >
                        <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                        Indietro
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: '#EDEDED'}}>  Aggiungi <br /> Azienda </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                            {menu.map((item) => (
                                <ListItem
                                key={item.title}
                                selected={activeSection === item.title}
                                sx={{
                                    mb: 4,
                                    '&.Mui-selected': {
                                        backgroundColor: activeSection === item.title ? 'black' : 'trasparent',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: activeSection === item.title ? '#EDEDED' : '#EDEDED'
                                        },
                                        borderRadius: '10px',
                                    }
                                }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItem>
                            ))}
                        </List>
            </Box>
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3}}>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" component="h1" sx={{ mt:1, fontWeight: 'bold', fontSize: '1.8'}}>{activeSection}</Typography>
                </Box>
                {renderFieldsGroups(groupedFields)}
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>* Campo Obbligatorio</Typography>


                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 6 }}>
                {currentPageIndex > 0 && (
                        <Button onClick={handleBackButtonClick}
                            sx={{
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
                            }}>Indietro</Button>
                        )}
                        {currentPageIndex < groupedFields.length - 1 && (
                            <Button onClick={handleNextButtonClick}
                                sx={{ width: '250px',
                                backgroundColor: "black",
                                color: "white",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                    transform: "scale(1.05)",
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                },}}>Avanti</Button>
                        )}
                        {currentPageIndex === groupedFields.length - 1 && (
                            <Button 
                            onClick={() => handleSubmit(values)}
                            type="submit"
                            sx={{
                                width: '250px',
                                backgroundColor: "#5F8671",
                                color: "#EDEDED",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                "&:hover": {
                                backgroundColor: "#5F8671",
                                color: "#EDEDED",
                                transform: "scale(1.05)",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                },
                            }}>Salva</Button>
                        )}
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

export default AggiungiAziendaGrafica;