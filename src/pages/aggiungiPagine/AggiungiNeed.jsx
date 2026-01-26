import React, { useState, useEffect }       from 'react';
import { useNavigate }                      from 'react-router-dom';
import CircleOutlinedIcon                   from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import CustomAutocomplete                   from '../../components/fields/CustomAutocomplete';
import CustomTextFieldAggiungi              from '../../components/fields/CustomTextFieldAggiungi';
import CustomNoteAggiungi                   from '../../components/fields/CustomNoteAggiungi';
import CustomDatePickerAggiungi             from '../../components/fields/CustomDatePickerAggiungi';
import CustomDecimalNumberAggiungi          from '../../components/fields/CustomDecimalNumberAggiungi';
import CustomMultipleSelectAggiunta         from '../../components/fields/CustomMultipleSelectAggiunta';
import CustomWeekDateAggiungi               from '../../components/fields/CustomWeekDateAggiungi';
import CustomNumberAggiunta                 from '../../components/fields/CustomNumberAggiunta';
import { useTranslation }                   from 'react-i18next';
import { Alert }                            from '@mui/material';
import ApiService                           from '../../services/ApiService';
import AggiungiModificaSchemaPage           from '../../components/AggiungiModificaSchemaPage';

import { 
  Box, 
  Skeleton, 
  Snackbar, 
  Grid, 
  Slide, 
  } from '@mui/material';



const AggiungiNeed = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();




    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState(t('Descrizione Need'));
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);    

    //stati per i valori

    const [ aziendeOptions,       setAziendeOptions     ] = useState([]);
    const [ skillsOptions,        setSkillsOptions      ] = useState([]);
    const [ ownerOptions,         setOwnerOptions       ] = useState([]);
    const [ tipologiaOptions,     setTipologiaOptions   ] = useState([]);
    const [ statoOptions,         setStatoOptions       ] = useState([]);
    const [ keypeopleOptions,     setKeypeopleOptions   ] = useState([]);
    const [ isKeypeopleEnabled,   setIsKeypeopleEnabled ] = useState(false);

  
    const [ values,             setValues               ] = useState([]);

    



    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchNeedOptions = async () => {
            try {              
            const responseAziende   = await ApiService.request("getAziendeSelect");
            const responseSkill     = await ApiService.request("skillSelect");
            const ownerResponse     = await ApiService.request("getAllOwnerSelect");
            const tipologiaResponse = await ApiService.request("tipologiaSelect");
            const statoResponse     = await ApiService.request("getStatoNeed");
    
            if (Array.isArray(statoResponse.data)) {
                const statoOptions = statoResponse.data.map((stato) => ({
                label: stato.descrizione,
                value: stato.id,
                }));
                setStatoOptions(statoOptions);
            }
    
            if (Array.isArray(tipologiaResponse.data)) {
              setTipologiaOptions(tipologiaResponse.data.map((tipologia) => ({ label: tipologia.descrizione, value: tipologia.id })));
          } else {
              console.error("I dati ottenuti dalla chiamata delle tipologie non sono nel formato Array; ", tipologiaResponse.data);
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
              const aziendeOptions = responseAziende.data.map((aziende) => ({
                  label: aziende.denominazione,
                  value: aziende.id,
              }));
              setAziendeOptions(aziendeOptions);
              } else {
              console.error(
                  "I dati ottenuti non sono nel formato Array:",
                  responseAziende.data
              );
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

        const aziendaInterna = [
            { value: "CHALLENGING", label: "Challenging" },
            { value: "INNOTEK",     label:"Innotek"   }
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
                const responseKeypeople = await ApiService.request("contattiOptions", {aziendaConId: aziendaConId})
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

                const skills = values.skills ? values.skills.map(skill => skill.value).join(',') : '';


                delete values.skills;

                const responseSaveNeed = await ApiService.request(
                  "salvaNeed", 
                  {},          
                  values,      
                  {},          
                  { skill1: skills } 
              );
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

        const fieldObbligatori = [ "idAzienda", "descrizione", "priorita", "week", "pubblicazione", "screening", "tipologia", "stato", "idOwner", "location", "idKeyPeople", "idOwnerRecruiter" ];

            const fields =[
            { label: t("Azienda*"),                   name: "idAziendaInterna",             type: "select",               options: aziendaInterna          },
            { label: t("Cliente*"),                   name: "idAzienda",                    type: "select",               options: aziendeOptions          },
            { label: t('Contatto*'),                  name: "idKeyPeople",                  type: "select",               options: keypeopleOptions        },
            { label: t("Descrizione Need*"),          name: "descrizione",                  type: "text",                 maxLength: 200                   },
            { label: t("Priorità*"),                  name: "priorita",                     type: "select",               options: [
                { value: 1,                   label: "1" },
                { value: 2,                   label: "2" },
                { value: 3,                   label: "3" },
                { value: 4,                   label: "4" } 
                ] },
            { label: "Week*",                         name: "week",                         type: "week"                                                   },
            { label: t("Tipologia*"),                 name: "tipologia",                    type: "select",               options: tipologiaOptions        },
            { label: t("Tipologia Azienda"),          name: "tipo",                         type: "select",               options: [
            { value: 1,                   label: t("Cliente") },
            { value: 2,                   label: t("Consulenza") },
            { value: 3,                   label: t("Prospect") }
            ] },
            { label: t("Owner Business*"),            name: "idOwner",                      type: "select",                 options: ownerOptions          },
            { label: t("Owner Recruiter*"),           name: "idOwnerRecruiter",             type: "select",                 options: ownerOptions          },
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

        //funzione per la navigazione dal menu laterale
const handleMenuItemClick = (section, index) => {
  const allPreviousCompleted = sectionCompleted
  .slice(0, index)
  .every((x) => x);
  if (allPreviousCompleted) {
  setActiveSection(section);
  setCurrentPageIndex(index);
  } else {
  setAlert({
      open: true,
      message:
      t("Per cambiare sezione, completare tutti i campi obbligatori delle sezioni precedenti."),
  });
  }
};

    //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
    const [sectionCompleted,    setSectionCompleted     ] = useState(
      new Array(menu.length).fill(false)
  );

        return (
          <AggiungiModificaSchemaPage
              menuItems={menu}
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
              sectionCompleted={sectionCompleted}
              onMenuItemClick={handleMenuItemClick}
              onGoBack={handleGoBack}
              title={`${t("Aggiungi")} ${t("Need")}`}
              handleSubmit={handleSubmit}   
              handleNextButtonClick={handleNextButtonClick}
              handleBackButtonClick={handleBackButtonClick} 
              values={values}
          >
              {/* Contenuto della sezione corrente */}
              <Box sx={{ ml: 15, mr: 15 }}>
                  <Grid container spacing={2}>
                      {groupedFields[currentPageIndex].map((field, index) => {
                          if (field.type === "titleGroups") {
                              return <Grid item xs={12} key={index}></Grid>;
                          } else if (field.type === "note") {
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
        
              <Snackbar
                open={alert.open}
                autoHideDuration={4000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        
              
          </AggiungiModificaSchemaPage>
        );
}

export default AggiungiNeed;