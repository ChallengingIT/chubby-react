import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Snackbar, Skeleton } from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios from 'axios';
import CustomAutocomplete from '../../components/fields/CustomAutocomplete';
import CustomTextFieldModifica from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica from '../../components/fields/CustomDatePickerModifica';


const ModificaKeypeopleGrafica = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const valori = location.state;


    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Anagrafica');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);

    //stati per i valori
    const [ aziendeOptions, setAziendeOptions] = useState([]);
    const [ ownerOptions,   setOwnerOptions  ] = useState([]);
    const [ values,             setValues               ] = useState({});



    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const aziendeResponse = await axios.get("http://localhost:8080/aziende/react/select",       { headers: headers });
            const ownerResponse   = await axios.get("http://localhost:8080/aziende/react/owner",        { headers: headers });
            if (Array.isArray(ownerResponse.data)) {
            const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", ownerResponse.data);
            }
    
    
            if (Array.isArray(aziendeResponse.data)) {
            const aziendeOptions = aziendeResponse.data.map((aziende) => ({
                label: aziende.denominazione,
                value: aziende.id,
            }));
            setAziendeOptions(aziendeOptions);
            setLoading(false);
            } else {
            console.error("I dati ottenuti non sono nel formato Array:", aziendeResponse.data);
            }
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };
    
        fetchAziendeOptions();
    }, []);

    const menu = [
        {
            title: 'Anagrafica',
            icon: <CircleOutlinedIcon />
        },
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return ["nome", "idAzienda", "idOwner", "email", "status", "ruolo", "dataCreazione"]; 
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
    
                    const response = await axios.post("http://localhost:8080/keypeople/react/salva", values, {
                        headers: headers
                    });
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: "contatto già esistente!" });
                        console.error("il contatto è già stata salvato.");
                        return; 
                    }
                    navigate("/keyPeople");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
            }
        };
        



        const campiObbligatori = [ "nome", "idAzienda", "email", "idOwner", "status", "ruolo", "dataCreazione" ];

        const fields =[
            { type: "titleGroups",                label: "Anagrafica"            },
            { label: "Nome Contatto*",        name: "nome",                 type: "text" },
            { label: "Azienda*",              name: "idAzienda",            type: "select",      options: aziendeOptions },
            { label: "Email*",                name: "email",                type: "text" },
            { label: "Cellulare",             name: "cellulare",            type: "text" },
            { label: "Owner*",                name: "idOwner",              type: "select",      options: ownerOptions},
            { label: "Stato*",                name: "status",               type: "select",      options: [
              { value: "1", label: "Verde" },
              { value: "2", label: "Giallo" },
              { value: "3", label: "Rosso" },
            ] },
            
            { label: "Ruolo*",                name: "ruolo",               type: "text" },
            { label: "Data di Creazione*",    name: "dataCreazione",       type: "date" },
            { label: 'Ultima attività',       name: 'dataUltimaAttivita',  type: 'date' },
            { label: "Note",                  name: "note",                type: "note" },
        ];



        const initialValues = {
            id:                 valori.id                                                  ,
            nome:               valori.nome                                                || null,
            idAzienda:          valori.cliente && valori.cliente.id                        || null,
            idOwner:            valori.owner   && valori.owner.id                          || null,
            email:              valori.email                                               || null,
            cellulare:          valori.cellulare                                           || null,
            ruolo:              valori.ruolo                                               || null,
            dataCreazione:      valori.dataCreazione                                       || null,
            dataUltimaAttivita: valori.dataUltimaAttivita                                  || null,
            status:             valori.status                                              || null,
            note:               valori.note                                                || null,
        };


         //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
         useEffect(() => {
            if (Object.keys(valori).length !== 0) {
                const updatedFormValues = { ...initialValues };
        
                Object.keys(valori).forEach(key => {
                    if (initialValues.hasOwnProperty(key)) {
                        updatedFormValues[key] = valori[key];
                    }
                });
        
                setValues(updatedFormValues);
            }
        }, [valori]); 
    


        const renderFieldSkeleton = (type) => {
            switch (type) {
                case 'text':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'date':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'decimalNumber':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'select':
                case 'multipleSelectSkill':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'note':
                    return <Skeleton variant="text" width={710} height={120} />;
                default:
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

            }
        };


        

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
            if (loading ) {
                return renderFieldSkeleton(field.type);
            } else {
            const { type, ...otherProps } = field;
            // const errorMessage = errors[field.name];


            switch (type) {
                case 'text':
                    return (
                        <CustomTextFieldModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        initialValues={initialValues}
                        />
                    );


                    case 'note':
                        return (
                            <CustomNoteModifica
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                            initialValues={initialValues}
                            />
                        );

                    case 'date':
                        return (
                            <CustomDatePickerModifica
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                            initialValues={initialValues}
                            />
                        )

                case 'select': 
                        return (
                            <CustomAutocomplete
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChange}
                            getOptionSelected={(option, value) => option.value === value.value}
                            initialValues={initialValues}
                            />
                        );

                    default:
                        return null;
            }
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
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: '#EDEDED'}}>  Modifica <br /> Contatto </Typography>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, overflow: 'auto'}}>
                {renderFieldsGroups(groupedFields)}
                </Box>
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>* Campo Obbligatorio</Typography>


                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 6 }}>
                {currentPageIndex > 0 && (
                        <Button onClick={handleBackButtonClick}
                            sx={{
                            mb: 4,
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
                                sx={{ 
                                mb: 4,
                                width: '250px',
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
                                mb: 4,
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

export default ModificaKeypeopleGrafica;