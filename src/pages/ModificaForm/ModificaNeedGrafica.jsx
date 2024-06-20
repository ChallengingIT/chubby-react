import React, { useState, useEffect }                                                                           from 'react';
import { useNavigate, useParams }                                                                               from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Skeleton, Snackbar, Grid, Slide, Container } from '@mui/material';
import CircleOutlinedIcon                                                                                       from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                    from 'axios';
import CustomAutocomplete                                                                                       from '../../components/fields/CustomAutocomplete';
import CustomWeekDateAggiungi                                                                                   from '../../components/fields/CustomWeekDateAggiungi';
import CustomTextFieldModifica                                                                                  from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica                                                                                       from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                                                                                 from '../../components/fields/CustomDatePickerModifica';
import CustomDecimalNumberModifica                                                                              from '../../components/fields/CustomDecimalNumberModifica';
import CustomMultipleSelectModifica                                                                             from '../../components/fields/CustomMultipleSelectModifica';
import CustomNumberModifica from '../../components/fields/CustomNumberModifica';
import { useUserTheme } from '../../components/TorchyThemeProvider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const ModificaNeedGrafica = () => {
    const navigate = useNavigate();
    const {id}                    = useParams();
    const theme = useUserTheme();


    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Descrizione Need');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);    

    //stati per i datiModifica
    const [ datiModifica,       setDatiModifica         ] = useState([]);


    const [ aziendeOptions,       setAziendeOptions     ] = useState([]);
    const [ skillsOptions,        setSkillsOptions      ] = useState([]);
    const [ ownerOptions,         setOwnerOptions       ] = useState([]);
    const [ tipologiaOptions,     setTipologiaOptions   ] = useState([]);
    const [ statoOptions,         setStatoOptions       ] = useState([]);
    const [ keyPeopleOptions,     setKeyPeopleOptions   ] = useState([]);
    const [ aziendaID,            setAziendaID          ] = useState(null);
    const [ values,               setValues             ] = useState([]);








    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchNeedOptions = async () => {
            try {
            const responseAziende       = await axios.get("http://localhost:8080/aziende/react/select", { headers: headers });
            const responseSkill         = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
            const ownerResponse         = await axios.get("http://localhost:8080/owner" , { headers: headers });
            const tipologiaResponse     = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers });
            const statoResponse         = await axios.get("http://localhost:8080/need/react/stato"    , { headers: headers});
            const needResponse          = await axios.get(`http://localhost:8080/need/react/${id}`     , { headers: headers});

            const modificaData = needResponse.data;
            const aziendaId = needResponse.data.cliente.id;
            setAziendaID(aziendaId);
            setDatiModifica(modificaData);

            
            if (Array.isArray(statoResponse.data)) {
                const statoOptions = statoResponse.data.map((stato) => ({
                label: stato.descrizione,
                value: stato.id,
                }));
                setStatoOptions(statoOptions);
            }
    
            if (Array.isArray(tipologiaResponse.data)) {
                const tipologiaOptions = tipologiaResponse.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
                }));
                setTipologiaOptions(tipologiaOptions);
            }
    

            if (Array.isArray(ownerResponse.data)) {
                const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
                }));
                setOwnerOptions(ownerOptions);
            }
    
    
            if (Array.isArray(responseSkill.data)) {
            const skillsOptions = responseSkill.data.map((skill) => ({
                value: skill.id,
                label: skill.descrizione
            }));
            setSkillsOptions(skillsOptions);
            }
    
    
            if (Array.isArray(responseAziende.data)) {
                const ownerOptions = responseAziende.data.map((aziende) => ({
                label: aziende.denominazione,
                value: aziende.id,
                }));
                setAziendeOptions(ownerOptions);
            }
            } catch (error) {
            console.error("Errore durante il recupero delle aziende:", error);
            }
            setLoading(false);

        };
    
        fetchNeedOptions();
    }, []);


    useEffect(() => {
        if (datiModifica.cliente && datiModifica.cliente.length !== 0) {
            const aziendaConId = datiModifica.cliente.id;
            fetchKeypeopleOptions(aziendaConId);
        } 
    },[ datiModifica.cliente]);

    const fetchKeypeopleOptions = async (aziendaConId) => {
        try {
            
                const keypeopleResponse     = await axios.get(`http://localhost:8080/keypeople/react/azienda/${aziendaID}`, { headers: headers });
    
                    if (Array.isArray(keypeopleResponse.data)) {
                    const keypeopleOptions = keypeopleResponse.data.map((keypeople) => ({
                        label: keypeople.nome,
                        value: keypeople.id,
                    }));
                    setKeyPeopleOptions(keypeopleOptions); 
                }
            } catch (error) {
            console.error("Errore durante il recupero dei key people:", error);
            }
        };
    
    
        const pubblicazioneOptions = [
        { value: 1, label: 'To Do' },
        { value: 2, label: 'Done'  }
        ];
    
        const screeningOptions = [
        { value: 1, label: 'To Do' },
        { value: 2, label: 'In progress' },
        { value: 3, label: 'Done' }
        ];



    const menu = [
        {
            title: 'Descrizione Need',
            icon: <CircleOutlinedIcon />
        },
    ];

     //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
     const [sectionCompleted, setSectionCompleted] = useState(new Array(menu.length).fill(true));

     //funzione per la navigazione del menu laterale
    const handleMenuItemClick = (section, index) => {
        if (index === currentPageIndex) return; 
    
        const mandatoryFields = getMandatoryFields(currentPageIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;
    
        if (!hasErrors) {
            setActiveSection(section);
            setCurrentPageIndex(index);
        } else {
            setAlert({ open: true, message: 'Compilare tutti i campi obbligatori presenti per poter cambiare sezione'});
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return [ "descrizione", "idKeyPeople", "priorita", "week", "pubblicazione", "screening", "idTipologia", "idStato", "idOwner", "location"]; 

            default:
                return [];
        }
    };


    //funzione per la validazione dei field
    const validateFields = (values, mandatoryFields, index) => {
        let errors = {};
        let allFieldsValid = true;

        mandatoryFields.forEach(field => {
            if (!values[field]) {
                errors[field] = 'Questo campo è obbligatorio';
                allFieldsValid = false;

            }
        });

         // Aggiorna lo stato di completamento della sezione
         setSectionCompleted(prev => {
            const newSectionCompleted = [...prev];
            newSectionCompleted[index] = allFieldsValid;
            return newSectionCompleted;
        });
        return errors;
    };



     // Funzione per il cambio stato degli input
    const handleChange = (fieldValue) => {
        setValues(prevValues => ({
            ...prevValues,
            ...fieldValue
        }));
    };

        //funzione per il cambio stato delle skill
        const handleChangeSkill = (fieldValue) => {
            const fieldName = Object.keys(fieldValue)[0];
            const newSelections = fieldValue[fieldName]; 
        
            setValues(prevValues => {
                const currentSelections = prevValues[fieldName] || []; 
        
                const selectionsToAdd = newSelections.filter(selection => !currentSelections.includes(selection));
        
                const selectionsToRemove = currentSelections.filter(selection => !newSelections.includes(selection));
        
                const updatedSelections = currentSelections
                    .filter(selection => !selectionsToRemove.includes(selection))
                    .concat(selectionsToAdd);
        
                return {
                    ...prevValues,
                    [fieldName]: updatedSelections
                };
            });
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

        //funzione per la chiusura dell'alert
        const handleCloseAlert = (reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({...alert, open: false});
        };

         //funzione per la transizione dell'alert
        function TransitionDown(props) {
            return <Slide {...props} direction="down" />;
        }


        const fieldMapping = {
            idStato: "stato",
            idTipologia: "tipologia",
            idTipo: 'tipo'
        };

        //funzione per convertire le chiavi delle select da "idX" a "X"
        const replaceKeysInValues = (values, mapping) => {
            const newValues = {...values}; 
            Object.keys(mapping).forEach(key => {
                if (key in newValues) {
                    const newKey = mapping[key];
                    newValues[newKey] = newValues[key];
                    delete newValues[key]; 
                }
            });
            return newValues;
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
                    if (!fieldObbligatori.includes(key) && !values[key]) {
                        values[key] = null;
                    }
                });

                const skills = values.idSkills ? values.idSkills.join(',') : '';


                delete values.idSkills;
                const transformedValues = replaceKeysInValues(values, fieldMapping);


                const responseSaveNeed = await axios.post("http://localhost:8080/need/react/salva", transformedValues, { params: { skill1: skills }, headers: headers});
                if (responseSaveNeed.data === "ERRORE") {
                    setAlert({ open: true, message: "errore durante il salvataggio del need!" });
                    console.error("Il need non è stata salvata.");
                    return;
                }
                const userString = sessionStorage.getItem("user");
                if (userString) {
                    const userObj = JSON.parse(userString);
                    if (userObj.roles.includes("ROLE_BUSINESS")) {
                        navigate(`/need/${aziendaID}`);
                    } else {
                        navigate('/need');
                    }
                } else {
                    navigate('/need');
                } 
            } catch(error) {
                console.error("Errore durante il salvataggio", error);
                }
        } else {
            setErrors(errors);
            setAlert({ open: true, message: "Compilare tutti i field obbligatori presenti prima di avanzare" });
        }
    };

        const fieldObbligatori = [ "descrizione", "idKeyPeople", "priorita", "week", "pubblicazione", "screening", "idTipologia", "idStato", "idOwner", "location" ];

        const fields =[
            { label: "Descrizione Need*",   name: "descrizione",                  type: "text", maxLength: 200                                                },
            { label: "Contatto*",           name: "idKeyPeople",                  type: "select",               options: keyPeopleOptions     },
            // { label: "Priorità*",           name: "priorita",                     type: "decimalNumber"                                       },
            { label: "Priorità*",              name: "priorita",                          type: "select",               options: [
                { value: 1,                   label: "Massima" },
                { value: 2,                   label: "Alta" },
                { value: 3,                   label: "Media" },
                { value: 4,                   label: "Bassa" } 
                ] },
            { label: "Week*",               name: "week",                         type: "week"                                                },
            { label: "Tipologia*",          name: "idTipologia",                  type: "select",               options: tipologiaOptions     },
            { label: "Tipologia Azienda",   name: "idTipo",                         type: "select",               options: [
            { value: 1,                   label: "Cliente" },
            { value: 2,                   label: "Consulenza" },
            { value: 3,                   label: "Prospect" }
            ] },
            { label: "Owner*",                    name: "idOwner",                     type: "select",                 options: ownerOptions         },
            { label: "Stato*",                    name: "idStato",                     type: "select",                 options: statoOptions         },
            { label: "Headcount",                 name: "numeroRisorse",               type: "number"                                         },
            { label: "Location*",                 name: "location",                    type: "text", maxLength: 45                                                  },
            { label: "Skills",                    name: "idSkills",                    type: "multipleSelect",         options: skillsOptions        },
            { label: "Seniority",                 name: "anniEsperienza",              type: "decimalNumber"                                         },
            { label: 'Pubblicazione Annuncio*',   name: 'pubblicazione',               type: 'select',                 options: pubblicazioneOptions },
            { label: 'Screening*',                name: 'screening',                   type: 'select',                 options: screeningOptions     },
            { label: "Note",                      name: "note",                        type: "note", maxLength:4000                                                  },
            ];


        const initialValues = {
            id:                         datiModifica.id                                                 ,
            descrizione:                datiModifica.descrizione                                        || null,
            idKeyPeople:                (datiModifica.keyPeople && datiModifica.keyPeople.id)           || null,
            priorita:                   datiModifica.priorita                                           || null,
            week:                       datiModifica.week                                               || null,
            idTipologia:               (datiModifica.tipologia && datiModifica.tipologia.id)            || null,
            idTipo:                       datiModifica.tipo                                               || null,
            idOwner:                   (datiModifica.owner && datiModifica.owner.id)                    || null,
            idStato:                   (datiModifica.stato && datiModifica.stato.id)                    || null,
            numeroRisorse:              datiModifica.numeroRisorse                                      || null,
            location:                   datiModifica.location                                           || null,
            idSkills:                   datiModifica.skills ? datiModifica.skills.map((skills) => skills.id) :   [],
            anniEsperienza:             datiModifica.anniEsperienza                                     || null,
            pubblicazione:              datiModifica.pubblicazione                                      || null,
            screening:                  datiModifica.screening                                          || null,
            note:                       datiModifica.note                                               || null,        
            };


        //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
        useEffect(() => {
            if (Object.keys(datiModifica).length !== 0) {
                const updatedvalues = { ...initialValues };
        
                Object.keys(datiModifica).forEach(key => {
                    if (initialValues.hasOwnProperty(key)) {
                        updatedvalues[key] = datiModifica[key];
                    }
                });
        
                setValues(updatedvalues);
            }
        }, [datiModifica]); 


        useEffect(() => {
            if (Object.keys(values).length > 0) {
                setLoading(false);
            }
        }, [values]); 




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

        const groupedFields = groupFields(fields); 


        const renderFieldSkeleton = (type) => {
            switch (type) {
                case 'text':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'date':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'decimalNumber':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'select':
                case 'multipleSelect':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'note':
                    return <Skeleton variant="text" width={710} height={120} />;
                default:
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

            }
        };



        //funzione per richiamare i vari field
        const renderFields = (field) => {
            if (loading) {
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
                        maxLength={field.maxLength}
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
                        maxLength={field.maxLength}

                        />
                    );

                    case 'select': 
                    return (
                        <CustomAutocomplete
                        name={field.name}
                        label={field.label}
                        options={field.options || []}
                        value={values[field.name] || null}
                        onChange={handleChange}
                        getOptionSelected={(option, value) => option.value === value.value}
                    />
                    );


                    case 'week': 
                    return (
                    <CustomWeekDateAggiungi
                        name={field.name}
                        label={field.label}
                        values={values}
                        onChange={handleChange}
                        initialValues={initialValues}
                    />
                    )



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
                    );


                case 'decimalNumber':
                return (
                    <CustomDecimalNumberModifica
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    values={values}
                    onChange={handleChange}
                    initialValues={initialValues}
                    />
                );

                case 'number':
                    return (
                        <CustomNumberModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        initialValues={initialValues}
                        />
                    );


                case 'multipleSelect':
                    return ( 
                        <CustomMultipleSelectModifica
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChangeSkill}
                            getOptionSelected={(option, value) => option.value === value.value}
                            skillsOptions={skillsOptions}
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
                    <Grid container spacing={2}> 
                        {groupedFields[currentPageIndex].map((field, index) => {
                            if (field.type === 'titleGroups') {
                                return (
                                    <Grid item xs={12} key={index}>
                                    </Grid>
                                );
                            } else if (field.type === 'note') {
                                return (
                                    <Grid item xs={12} key={index}>
                                        {renderFields(field)}
                                    </Grid>
                                );
                            } else {
                                return (
                                    <Grid item xs={12} sm={6} key={index}> 
                                        {renderFields(field)}
                                    </Grid>
                                );
                            }
                        })}
                    </Grid>
                </Box>
            );
        };

return (
    <Container maxWidth="false" sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
        <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', ml: '12.5em', mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden' }}>
        <Box sx={{ width: '280px', height: '98%', background: theme.palette.aggiungiSidebar.bg, p:2, overflow: 'hidden', position: 'fixed', borderRadius: '20px 0px 0px 20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                    <Button
                    onClick={handleGoBack}
                    sx={{
                        color: theme.palette.textButton.main,
                        border:'none',
                        fontSize: '0.8em',
                        cursor: 'pointer',
                        outline: 'none',
                        borderRadius: '10px',
                        mt: 4,
                        ml: 2,
                        '&:hover': {
                            color: 'black',
                        }
                    }}
                    >
                        <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                        Indietro
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: theme.palette.aggiungiSidebar.title}}>  Aggiorna <br /> Need </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                            {menu.map((item, index) => (
                                // <ListItem
                                // key={item.title}
                                // selected={activeSection === item.title}
                                // sx={{
                                //     mb: 4,
                                //     '&.Mui-selected': {
                                //         backgroundColor: activeSection === item.title ? 'black' : 'trasparent',
                                //         '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                //             color: activeSection === item.title ? '#EDEDED' : '#EDEDED'
                                //         },
                                //         borderRadius: '10px',
                                //     }
                                // }}
                                // >
                                //     <ListItemIcon>
                                //         {item.icon}
                                //     </ListItemIcon>
                                //     <ListItemText primary={item.title} />
                                // </ListItem>
                                <ListItem
                                key={item.title}
                                selected={activeSection === item.title}
                                onClick={() => handleMenuItemClick(item.title, index)}
                                sx={{
                                    mb: 4,
                                    cursor: 'pointer', // Assicurati che l'elemento sembri cliccabile
                                    '&.Mui-selected': {
                                        backgroundColor: activeSection === item.title ? theme.palette.aggiungiSidebar.hover : theme.palette.aggiungiSidebar.hover,
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: activeSection === item.title ? theme.palette.aggiungiSidebar.textHover : theme.palette.aggiungiSidebar.textHover
                                        },
                                        borderRadius: '10px',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: theme.palette.aggiungiSidebar.text }}>
                                        {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon} 
                                </ListItemIcon>
                                <ListItemText primary={item.title} sx={{ color: theme.palette.aggiungiSidebar.text }} />
                            </ListItem>
                            ))}
                        </List>
            </Box>
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column', ml: '280px'}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3}}>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" component="h1" sx={{ mt:1, fontWeight: 'bold', fontSize: '1.8'}}>{activeSection}</Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', pl: 5, pr: 5, overflow: 'auto'}}>
                {renderFieldsGroups(groupedFields)}
                </Box>   
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>* Campo Obbligatorio</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 6 }}>
                {currentPageIndex > 0 && (
                        <Button onClick={handleBackButtonClick}
                            sx={{
                            mb: 4,
                            width: '250px',
                            backgroundColor: theme.palette.button.main,
                            color: theme.palette.textButton.white,
                            fontWeight:"bold",
                            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            "&:hover": {
                                backgroundColor: theme.palette.button.main,
                                color: theme.palette.textButton.white,
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
                                backgroundColor: theme.palette.button.main,
                                color: theme.palette.textButton.white,
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                
                                "&:hover": {
                                    backgroundColor: theme.palette.button.main,
                                    color: theme.palette.textButton.white,
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
                                backgroundColor: theme.palette.button.main,
                                color: theme.palette.textButton.white,
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                "&:hover": {
                                    backgroundColor: theme.palette.button.mainHover,
                                    color: theme.palette.textButton.white,
                                transform: "scale(1.05)",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                },
                            }}>Salva</Button>
                        )}
                </Box>
            </Box>
        </Box>
    </Container>
    )
}

export default ModificaNeedGrafica;