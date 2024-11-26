import React, { useState, useEffect }                                                                           from 'react';
import { useNavigate }                                                                                          from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Skeleton, Snackbar, Grid, Slide, Container } from '@mui/material';
import CircleOutlinedIcon                                                                                       from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                    from 'axios';
import CustomAutocomplete                                                                                       from '../../components/fields/CustomAutocomplete';
import CustomTextFieldAggiungi                                                                                  from '../../components/fields/CustomTextFieldAggiungi';
import CustomNoteAggiungi                                                                                       from '../../components/fields/CustomNoteAggiungi';
import CustomDatePickerAggiungi                                                                                 from '../../components/fields/CustomDatePickerAggiungi';
import CustomDecimalNumberAggiungi                                                                              from '../../components/fields/CustomDecimalNumberAggiungi';
import CustomMultipleSelectAggiunta                                                                             from '../../components/fields/CustomMultipleSelectAggiunta';
import CustomWeekDateAggiungi                                                                                   from '../../components/fields/CustomWeekDateAggiungi';
import CustomNumberAggiunta from '../../components/fields/CustomNumberAggiunta';
import { useTranslation }                   from 'react-i18next';
import { useMediaQuery }                    from '@mui/material';
import { useUserTheme }                     from "../../components/TorchyThemeProvider";


const AggiungiNeedGrafica = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useUserTheme();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');




    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState(t('Descrizione Need'));
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);    

    //stati per i valori
    const [ idCandidato,        setIdCandidato          ] = useState([]);


    const [ aziendeOptions,       setAziendeOptions     ] = useState([]);
    const [ skillsOptions,        setSkillsOptions      ] = useState([]);
    const [ ownerOptions,         setOwnerOptions       ] = useState([]);
    const [ tipologiaOptions,     setTipologiaOptions   ] = useState([]);
    const [ statoOptions,         setStatoOptions       ] = useState([]);
    const [ keypeopleOptions,     setKeypeopleOptions   ] = useState([]);
    const [ isKeypeopleEnabled,   setIsKeypeopleEnabled ] = useState(false);

  
    const [ values,             setValues               ] = useState([]);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchNeedOptions = async () => {
            try {
            const responseAziende       = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });
            const responseSkill         = await axios.get("http://89.46.196.60:8443/staffing/react/skill", { headers: headers });
            const ownerResponse         = await axios.get("http://89.46.196.60:8443/owner" , { headers: headers });
            const tipologiaResponse     = await axios.get("http://89.46.196.60:8443/need/react/tipologia", { headers: headers });
            const statoResponse         = await axios.get("http://89.46.196.60:8443/need/react/stato"    , { headers: headers});
    
    
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
    
    
        const pubblicazioneOptions = [
        { value: 1, label: 'To Do' },
        { value: 2, label: 'Done'  }
        ];
    
        const screeningOptions = [
        { value: 1, label: 'To Do' },
        { value: 2, label: 'In progress' },
        { value: 3, label: 'Done' }
        ];


        const seniorityOptions = [
            { label: "Neo", value: 1},
            { label: "Junior", value: 2},
            { label: "Middle", value: 3 },
            { label: "Senior", value: 4 },
        ];


    const menu = [
        {
            title: t('Descrizione Need'),
            icon: <CircleOutlinedIcon />
        },
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return ["idAzienda", "descrizione", "priorita", "week", "pubblicazione", "screening", "tipologia", "stato", "idOwner", "location", "idKeyPeople"]; 
            default:
                return [];
        }
    };


    //funzione per la validazione dei field
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach(field => {
            if (!values[field]) {
                errors[field] = t('Questo campo è obbligatorio');
            }
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
            const newValues = fieldValue[fieldName];
        
            setValues(prevValues => ({
                ...prevValues,
                [fieldName]: [...newValues]
            }));
        };



        //useEffect che controlla se l'azienda è selezionata
        useEffect(() => {
            if (values.idAzienda && values.idAzienda.length !== 0) {
                const azinedaConId = values.idAzienda; 
        
                setIsKeypeopleEnabled(true);
                fetchKeypeopleOptions(azinedaConId);
            } else {
                setIsKeypeopleEnabled(false);
                setKeypeopleOptions([]);
            }
        }, [values.idAzienda]); 


        const fetchKeypeopleOptions = async (aziendaConId) => {
            try {
                const responseKeypeople = await axios.get(`http://89.46.196.60:8443/keypeople/react/azienda/${aziendaConId}`, { headers: headers });
                const keypeopleOptions = responseKeypeople.data.map(keypeople => ({
                    value: keypeople.id,
                    label: keypeople.nome
                }));
                setKeypeopleOptions(keypeopleOptions);
            } catch(error) {
                console.error("Errore durante il recupero dei keypeople:", error);
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
                setAlert({ open: true, message: t('Compilare tutti i field obbligatori presenti per poter avanzare')});
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

                const skills = values.skills ? values.skills.join(',') : '';


                delete values.skills;

                const responseSaveNeed = await axios.post("http://89.46.196.60:8443/need/react/salva", values, { params: { skill1: skills }, headers: headers});
                if (responseSaveNeed.data === "ERRORE") {
                    setAlert({ open: true, message: t("errore durante il salvataggio del need!") });
                    console.error("Il need non è stata salvata.");
                    return;
                }
                navigate('/need');
            } catch(error) {
                console.error("Errore durante il salvataggio", error);
            }
        } else {
            setErrors(errors);
            setAlert({ open: true, message: t("Compilare tutti i field obbligatori presenti prima di avanzare") });
        }
    };

        const fieldObbligatori = [ "idAzienda", "descrizione", "priorita", "week", "pubblicazione", "screening", "tipologia", "stato", "idOwner", "location", "idKeyPeople" ];

            const fields =[
            { label: t("Azienda*"),                   name: "idAzienda",                    type: "select",               options: aziendeOptions          },
            { label: t('Contatto*'),                  name: "idKeyPeople",                  type: "select",               options: keypeopleOptions        },
            { label: t("Descrizione Need*"),          name: "descrizione",                  type: "text",                 maxLength: 200                   },
            { label: t("Priorità*"),                  name: "priorita",                     type: "select",               options: [
                { value: 1,                   label: "1" },
                { value: 2,                   label: "2" },
                { value: 3,                   label: "3" },
                { value: 4,                   label: "4" } 
                ] },
            { label: "Week*",                      name: "week",                         type: "week"                                                   },
            { label: t("Tipologia*"),                 name: "tipologia",                    type: "select",               options: tipologiaOptions        },
            { label: t("Tipologia Azienda"),          name: "tipo",                         type: "select",               options: [
            { value: 1,                   label: t("Cliente") },
            { value: 2,                   label: t("Consulenza") },
            { value: 3,                   label: t("Prospect") }
            ] },
            { label: t("Owner*"),                     name: "idOwner",                      type: "select",                 options: ownerOptions          },
            { label: t("Stato*"),                     name: "stato",                        type: "select",                 options: statoOptions          },
            { label: "Headcount",                  name: "numeroRisorse",                type: "number"                                                 },
            { label: "Location*",                  name: "location",                     type: "text",                   maxLength: 45                  },
            { label: "Skills",                     name: "skills",                       type: "multipleSelect",    options: skillsOptions              },
            { label: "Seniority",                  name: "anniEsperienza",               type: "select",             options: seniorityOptions                            },
            { label: t('Pubblicazione Annuncio*'),    name: 'pubblicazione',                type: 'select',                 options: pubblicazioneOptions  },
            { label: t('Screening*'),                 name: 'screening',                    type: 'select',                 options: screeningOptions      },
            { label: t("Note"),                       name: "note",                         type: "note",                   maxLength: 4000                },
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
                        <CustomTextFieldAggiungi
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        maxLength={field.maxLength}
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
                        maxLength={field.maxLength}
                        />
                    );

                    case 'select': 
                    if ( field.name === 'idKeyPeople') {
                        return (
                            <CustomAutocomplete
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChange}
                            getOptionSelected={(option, value) => option.value === value.value}
                            disabled={!isKeypeopleEnabled}
                            />
                        );
                    } else {
                    
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
                }


                    case 'week': 
                    return (
                    <CustomWeekDateAggiungi
                        name={field.name}
                        label={field.label}
                        values={values}
                        onChange={handleChange}
                    />
                    )



                case 'date':
                    return (
                        <CustomDatePickerAggiungi
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        />
                    );


                case 'decimalNumber':
                return (
                    <CustomDecimalNumberAggiungi
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    values={values}
                    onChange={handleChange}
                    />
                );

                case 'number':
                    return (
                        <CustomNumberAggiunta
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        />
                    );


                case 'multipleSelect':
                    return ( 
                        <CustomMultipleSelectAggiunta
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChangeSkill}
                            getOptionSelected={(option, value) => option.value === value.value}
                            skillsOptions={skillsOptions}
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
                                    <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
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
        <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', marginLeft: isSmallScreen ? "3.5em" : "12.8em", mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden',transition: 'margin-left 0.3s ease', }}>
        <Box
            sx={{
                width: { xs: '70px', sm: '150px', md: '220px', lg: '280px' },
                height: "98%",
                background: '#00B400',
                p: 2,
                overflow: "hidden",
                position: "fixed",
                borderRadius: "20px 0px 0px 20px",
                transition: 'width 0.3s ease',
            }}
            >                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                    <Button
                    onClick={handleGoBack}
                    sx={{
                        color: '#EDEDED',
                        border:'none',
                        fontSize: '0.8em',
                        cursor: 'pointer',
                        outline: 'none',
                        borderRadius: '10px',
                        mt: 4,
                        ml: 2,
                        '&:hover': {
                            color: 'black'
                        }
                    }}
                    >
                        <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                        {t('Indietro')}
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: { xs: "1.2em", sm: "1.5em", md: "1.8em" }, color: 'black'}}>  {t('Aggiungi')} <br /> {t('Need')} </Typography>
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
                                    <ListItemIcon sx={{ color: theme.palette.aggiungiSidebar.text, mr: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 }, display: { xs: 'none', sm: 'none', md: 'block' }, }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title}  sx={{ color: theme.palette.aggiungiSidebar.text, fontSize: { xs: "0.7em", sm: "0.8em", md: "1em" }, ml: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 } }} />
                                </ListItem>
                            ))}
                        </List>
            </Box>
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column',  ml: { xs: '70px', sm: '150px', md: '220px', lg: '280px' }}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3}}>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" component="h1" sx={{ mt:1, fontWeight: 'bold', fontSize: '1.8'}}>{activeSection}</Typography>
                </Box>
                <Box
                sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                pl: { xs: 1, sm: 2, md: 3, lg: 5 },
                pr: { xs: 1, sm: 2, md: 3, lg: 5 },
                overflow: "auto",
                }}
            >                {renderFieldsGroups(groupedFields)}
                </Box>   
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>{t('* Campo Obbligatorio')}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' } }}>
                {currentPageIndex > 0 && (
                        <Button onClick={handleBackButtonClick}
                            sx={{
                            mb: 4,
                            width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                            backgroundColor: "black",
                            color: "white",
                            fontWeight:"bold",
                            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
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
                                width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                                backgroundColor: "black",
                                color: "white",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                                
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
                                width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                                backgroundColor: "#00B400",
                                color: "#EDEDED",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                                "&:hover": {
                                    backgroundColor: "#019301",
                                color: "#EDEDED",
                                transform: "scale(1.05)",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                },
                            }}>{t('Salva')}</Button>
                        )}
                </Box>
            </Box>
        </Box>
    </Container>
    )
}

export default AggiungiNeedGrafica;