import React, { useState, useEffect }                  from 'react';
import { useNavigate, useParams }                      from 'react-router-dom';
import CircleOutlinedIcon                              from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import CustomAutocomplete                              from '../../components/fields/CustomAutocomplete';
import CustomWeekDateAggiungi                          from '../../components/fields/CustomWeekDateAggiungi';
import CustomTextFieldModifica                         from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica                              from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                        from '../../components/fields/CustomDatePickerModifica';
import CustomDecimalNumberModifica                     from '../../components/fields/CustomDecimalNumberModifica';
import CustomMultipleSelectModifica                    from '../../components/fields/CustomMultipleSelectModifica';
import CustomNumberModifica                            from '../../components/fields/CustomNumberModifica';
import { useUserTheme }                                from '../../components/TorchyThemeProvider';
import { useTranslation }                              from 'react-i18next';
import { useMediaQuery }                               from '@mui/material';
import ApiService                                      from "../../services/ApiService";
import AggiungiModificaSchemaPage                      from "../../components/AggiungiModificaSchemaPage";

import { 
  Box, 
  Alert, 
  Skeleton, 
  Snackbar, 
  Grid, 
  Slide } from '@mui/material';




const ModificaNeed = () => {
    const navigate      = useNavigate();
    const { t }         = useTranslation();
    const {id}          = useParams();
    const theme         = useUserTheme();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');



    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState(t('Descrizione Need'));
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


    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchNeedOptions = async () => {
            try {
            const responseAziende   = await ApiService.request("getAziendeSelect");
            const responseSkill     = await ApiService.request("skillSelect");
            const ownerResponse     = await ApiService.request("getAllOwnerSelect");
            const tipologiaResponse = await ApiService.request("tipologiaSelect");
            const statoResponse     = await ApiService.request("getStatoNeed");
            const needResponse      = await ApiService.request("needByID", {id: id});

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
                const keypeopleResponse = await ApiService.request("aziendaFromKeypeople", {idAzienda: aziendaID});
    
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

        const seniorityOptions = [
            { label: "Neo", value: 1 },
            { label: "Junior", value: 2 },
            { label: "Middle", value: 3 },
            { label: "Senior", value: 4 },
            ...(values.anniEsperienza > 4 ? [{ label: "Senior", value: values.anniEsperienza }] : [])
        ];



        const aziendaInterna = [
            { value: "CHALLENGING", label: "Challenging" },
            { value: "INNOTEK",     label:"Innotek"   }
            ];



    const menu = [
        {
            title: t('Descrizione Need'),
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
            setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter cambiare sezione')});
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
                errors[field] = t('Questo campo è obbligatorio');
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
                setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter avanzare')});
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
                const userString = sessionStorage.getItem("user");
                if (userString) {
                    const userObj = JSON.parse(userString);
                    if (userObj.roles.includes("BUSINESS")) {
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
            setAlert({ open: true, message: t("Compilare tutti i field obbligatori presenti prima di avanzare") });
        }
    };

        const fieldObbligatori = [ "descrizione", "idKeyPeople", "priorita", "week", "pubblicazione", "screening", "idTipologia", "idStato", "idOwner", "location", "idOwnerRecruiter" ];

        const fields =[
            { label: t("Azienda*"),                   name: "idAziendaInterna",             type: "select",               options: aziendaInterna          },
            { label: t("Cliente*"),                   name: "idAzienda",                    type: "select",               options: aziendeOptions          },            { label: t("Descrizione Need*"),   name: "descrizione",                  type: "text", maxLength: 200                                                },
            { label: t("Contatto*"),           name: "idKeyPeople",                  type: "select",               options: keyPeopleOptions     },
            // { label: "Priorità*",           name: "priorita",                     type: "decimalNumber"                                       },
            { label: t("Priorità*"),              name: "priorita",                          type: "select",               options: [
                { value: 1,                   label: "1" },
                { value: 2,                   label: "2" },
                { value: 3,                   label: "3" },
                { value: 4,                   label: "4" } 
                ] },
            { label: "Week*",               name: "week",                         type: "week"                                                },
            { label: t("Tipologia*"),          name: "idTipologia",                  type: "select",               options: tipologiaOptions     },
            { label: t("Tipologia Azienda"),   name: "idTipo",                         type: "select",               options: [
            { value: 1,                   label: t("Cliente") },
            { value: 2,                   label: t("Consulenza") },
            { value: 3,                   label: t("Prospect") }
            ] },
            { label: t("Owner Business*"),            name: "idOwner",                     type: "select",                 options: ownerOptions         },
            { label: t("Owner Recruiter*"),           name: "idOwnerRecruiter",            type: "select",                 options: ownerOptions         },
            { label: t("Stato*"),                     name: "idStato",                     type: "select",                 options: statoOptions         },
            { label: "Headcount",                     name: "numeroRisorse",               type: "number"                                                },
            { label: "Location*",                     name: "location",                    type: "text", maxLength: 45                                                  },
            { label: "Skills",                        name: "idSkills",                    type: "multipleSelect",         options: skillsOptions        },
            { label: "Seniority",                     name: "anniEsperienza",              type: "select",                 options: seniorityOptions     },
            { label: t('Pubblicazione Annuncio*'),    name: 'pubblicazione',               type: 'select',                 options: pubblicazioneOptions },
            { label: t('Screening*'),                 name: 'screening',                   type: 'select',                 options: screeningOptions     },
            { label: t("Note"),                       name: "note",                        type: "note", maxLength:4000                                                  },
            ];




              useEffect(() => {
                      if (Object.keys(datiModifica).length !== 0) {
                          const updatedFormValues = {
                              ...values,
                              ...{
                                  denominazione:                datiModifica.denominazione                                        || null,
                                  id:                           datiModifica?.id                                                  || null,
                                  idAzienda:                    datiModifica?.cliente?.id                                                 ,
                                  idAziendaInterna:             datiModifica?.aziendaInterna                                      || null,
                                  descrizione:                  datiModifica?.descrizione                                         || null,
                                  idKeyPeople:                 (datiModifica?.keyPeople && datiModifica?.keyPeople?.id)           || null,
                                  priorita:                     datiModifica?.priorita                                            || null,
                                  week:                         datiModifica?.week                                                || null,
                                  idTipologia:                 (datiModifica?.tipologia && datiModifica?.tipologia?.id)           || null,
                                  idTipo:                       datiModifica?.tipo                                                || null,
                                  idOwner:                     (datiModifica?.ownerBusiness && datiModifica?.ownerBusiness?.id)   || null,
                                  idOwnerRecruiter:            (datiModifica?.ownerRecruiter && datiModifica?.ownerRecruiter?.id) || null,
                                  idStato:                     (datiModifica?.stato && datiModifica?.stato?.id)                   || null,
                                  numeroRisorse:                datiModifica?.numeroRisorse                                       || null,
                                  location:                     datiModifica?.location                                            || null,
                                  idSkills:                     datiModifica?.skills ? datiModifica.skills.map((skills) => skills?.id) :   [],
                                  anniEsperienza:               datiModifica?.anniEsperienza                                      || null,
                                  pubblicazione:                datiModifica?.pubblicazione                                       || null,
                                  screening:                    datiModifica?.screening                                           || null,
                                  note:                         datiModifica?.note                                                || null,        
                              }
                          };
                          setValues(updatedFormValues);
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
          <AggiungiModificaSchemaPage
              menuItems={menu}
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
              sectionCompleted={sectionCompleted}
              onMenuItemClick={handleMenuItemClick}
              onGoBack={handleGoBack}
              title={`${t("Aggiungi")} ${t("Azienda")}`}
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

export default ModificaNeed;