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
import CloudUploadIcon                                                                                          from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation }                   from 'react-i18next';



const AggiungiRecruitingGrafica = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();


    //stati della pagina
    const [ activeSection,              setActiveSection            ] = useState(t('Profilo Candidato'));      
    const [ currentPageIndex,           setCurrentPageIndex         ] = useState(0);
    const [ alert,                      setAlert                    ] = useState({ open: false, message: ''});
    const [ errors,                     setErrors                   ] = useState({});
    const [ loading,                    setLoading                  ] = useState(true);    

    //stati per i valori
    const [ idCandidato,                setIdCandidato              ] = useState([]);
    const [ fileCV,                     setFileCV                   ] = useState(null);
    const [ fileCF,                     setFileCF                   ] = useState(null);
    const [ statoOptions,               setStatoOptions             ] = useState([]);
    const [ jobTitleOptions,            setJobTitleOptions          ] = useState([]);
    const [ tipologiaOptions,           setTipologiaOptions         ] = useState([]);
    const [ skillsOptions,              setSkillsOptions            ] = useState([]);
    const [ ownerOptions,               setOwnerOptions             ] = useState([]);
    const [ facoltaOptions,             setFacoltaOptions           ] = useState([]);
    const [ values,                     setValues                   ] = useState([]);
    const [ jobTitleEnable,             setJobTitleEnable           ] = useState(false);    
    const [ livelloScolasticoOptions,   setLivelloScolasticoOptions ] = useState([]);
    const [ funzioniAziendaliOptions,   setFunzioniAziendaliOptions ] = useState([]);
    const [ ricercaOptions,             setRicercaOptions           ] = useState([]);
    const [ tipoOptions,                setTipoOptions          ] = useState([]);




    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const responseStato               = await axios.get("http://localhost:8080/staffing/react/stato/candidato"  , { headers: headers });
            // const responseJobTitle            = await axios.get(`http://localhost:8080/aziende/react/tipologia/${id}`   , { headers: headers });
            const responseTipologia           = await axios.get("http://localhost:8080/staffing/react/tipo/candidatura" , { headers: headers });
            const responseNeedSkills          = await axios.get("http://localhost:8080/staffing/react/skill"            , { headers: headers });
            const ownerResponse               = await axios.get("http://localhost:8080/owner"             , { headers: headers });
            const facoltaResponse             = await axios.get("http://localhost:8080/staffing/react/facolta"          , { headers: headers });
            const livelloScolasticoResponse   = await axios.get("http://localhost:8080/staffing/react/livello"          , { headers: headers });
            const funzioniAziendaliResponse   = await axios.get("http://localhost:8080/staffing/react/funzioni"         , { headers: headers }); 
            const ricercaResponse             = await axios.get("http://localhost:8080/staffing/react/tipo/ricerca"     , { headers: headers });
            const tipoResponse                = await axios.get("http://localhost:8080/staffing/react/tipo"            , { headers: headers });


            if (Array.isArray(tipoResponse.data)) {
                const tipoOptions = tipoResponse.data.map((tipo) => ({
                    label: tipo.descrizione,
                    value: tipo.id,
                }));
                setTipoOptions(tipoOptions);
                }


            if (Array.isArray(ricercaResponse.data)) {
                const ricercaOptions = ricercaResponse.data.map((ricerca) => ({
                    label: ricerca.descrizione,
                    value: ricerca.id,
                }));
                setRicercaOptions(ricercaOptions);
                }

    
            if (Array.isArray(livelloScolasticoResponse.data)) {
            const livelloScolasticoOptions = livelloScolasticoResponse.data.map((livelloScolastico) => ({
                label: livelloScolastico.descrizione,
                value: livelloScolastico.id,
            }));
            setLivelloScolasticoOptions(livelloScolasticoOptions);
        }
    
    
            if (Array.isArray(facoltaResponse.data)) {
            const facoltaOptions = facoltaResponse.data.map((facolta) => ({
                label: facolta.descrizione,
                value: facolta.id,
            }));
            setFacoltaOptions(facoltaOptions);
        }

    
            if (Array.isArray(ownerResponse.data)) {
        const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
        }
            
            if (Array.isArray(responseNeedSkills.data)) {
            const skillsOptions = responseNeedSkills.data.map((skills) => ({
                label: skills.descrizione,
                value: skills.id,
            }));
            setSkillsOptions(skillsOptions);
        }
    
            if (Array.isArray(responseTipologia.data)) {
                const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
                }));
                setTipologiaOptions(tipologiaOptions);
            }
    
    
            //     if (Array.isArray(responseJobTitle.data)) {
            //     const jobTitleOptions = responseJobTitle.data.map((jobTitle) => ({
            //         label: jobTitle.descrizione,
            //         value: jobTitle.id,
            //     }));
            //     setJobTitleOptions(jobTitleOptions);
            // }
    
                    if (Array.isArray(responseStato.data)) {
                    const statoOptions = responseStato.data.map((stato) => ({
                        label: stato.descrizione,
                        value: stato.id,
                    }));
                    setStatoOptions(statoOptions);
                }

                if (Array.isArray(funzioniAziendaliResponse.data)) {
                    const funzioneAziendaleOptions = funzioniAziendaliResponse.data.map((funzioni) => ({
                        label: funzioni.descrizione,
                        value: funzioni.id,
                    }));
                    setFunzioniAziendaliOptions(funzioneAziendaleOptions);
                }
            
            } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        setLoading(false);
        };
    
        fetchAziendeOptions();
    }, []);



    const menu = [
        {
            title: t('Profilo Candidato'),
            icon: <CircleOutlinedIcon />
        },
        { 
            title: t('Esperienza'),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t('Posizione Lavorativa'),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t('Allegati'),
            icon: <CircleOutlinedIcon />
        }
    ];

     //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
    const [sectionCompleted, setSectionCompleted] = useState(new Array(menu.length).fill(false));




        //funzione per la navigazione dal menu laterale
        const handleMenuItemClick = (section, index) => {
            const allPreviousCompleted = sectionCompleted.slice(0, index).every(x => x);
            if (allPreviousCompleted) {
                setActiveSection(section);
                setCurrentPageIndex(index);
            } else {
                setAlert({ open: true, message: t('Per cambiare sezione, completare tutti i campi obbligatori delle sezioni precedenti.')});
            }
        };
        

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return ["nome", "cognome", "email"]; 
            case 1:
                return [ "anniEsperienzaRuolo", "livelloScolastico"]; 
            case 2: 
                return ["candidatura", "tipologia", "dataUltimoContatto", "funzioneAziendale"];
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

    //funzioni per il cambio di CV e CF
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
        

    //funzioni per cambiare pagina del form
    const handleBackButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex > 0) {
            setActiveSection(menu[currentIndex - 1].title);
            setCurrentPageIndex(currentIndex - 1);
        }
    };


    // const handleNextButtonClick = () => {
    //     const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
    //     if (currentIndex < menu.length - 1) {
    //         const mandatoryFields = getMandatoryFields(currentIndex);
    //         const errors = validateFields(values, mandatoryFields);
    //         const hasErrors = Object.keys(errors).length > 0;

    //         if (!hasErrors) {
    //             setActiveSection(menu[currentIndex + 1].title);
    //             setCurrentPageIndex(currentIndex + 1);
    //         } else {
    //             setAlert({ open: true, message: 'Compilare tutti i field obbligatori presenti per poter avanzare'});
    //         }
    //     }
    // };


    const handleNextButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;
    
        if (!hasErrors) {
            let newSectionCompleted = [...sectionCompleted];
            newSectionCompleted[currentIndex] = true; // Imposta la sezione corrente come completata
            setSectionCompleted(newSectionCompleted);
    
            if (currentIndex < menu.length - 1) {
                setActiveSection(menu[currentIndex + 1].title);
                setCurrentPageIndex(currentIndex + 1);
            }
        } else {
            setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter avanzare')});
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
                delete values.cv;
                delete values.cf;

                const datiResponse = await axios.post("http://localhost:8080/staffing/salva", values, {
                params: { skill: skills },
                headers: headers,
                });
                if (datiResponse.data === "DUPLICATO") {
                    setAlert({ open: true, message: t("email già esistente!") });
                    console.error("il candidato è già stato salvato.");
                    return; 
                }
                if (datiResponse.data === "ERRORE") {
                    setAlert({ open: true, message: t("errore durante il salvataggio del candidato!") });
                    console.error("Il candidato non è stata salvata.");
                    return;
                }
                const candidatoId = datiResponse.data;
                setIdCandidato(candidatoId);

                try{
                    if (fileCV) {
                        const formDataCV = new FormData();
                        formDataCV.append('file', fileCV);
                        formDataCV.append('tipo', 1);
                
                        const responseCV = await axios.post(`http://localhost:8080/staffing/react/staff/salva/file/${candidatoId}`, formDataCV,
                        {headers: headers});
                    } 
                } catch(error) {
                        console.error("Errore nell'invio del CV", error);
                    }
                
                    try{
                        if (fileCF) {
                        const formDataCF = new FormData();
                        formDataCF.append('file', fileCF);
                        formDataCF.append('tipo', 2);
                        const responseCF = await axios.post(`http://localhost:8080/staffing/react/staff/salva/file/${candidatoId}`, formDataCF, {headers: headers});
                    }
                } catch(error) {
                    console.error("errore nell'invio del CF", error);
                }
                navigate("/recruiting");
            } catch (error) {
                console.error("Errore durante il salvataggio:", error);
            }
        } else {
            setErrors(errors);
            setAlert({ open: true, message: t("Compilare tutti i field obbligatori presenti prima di avanzare") });
        }
    };

    //useEffect che controlla il cambiamento di stato di funzioneAziendale, abilita la select di jobTitle e attiva la chiamata per popolarlo correttamente
    useEffect(() => {
        if (values.funzioneAziendale && values.funzioneAziendale.length !== 0) {
            const funzioneAziendaleId = values.funzioneAziendale; 
    
            setJobTitleEnable(true);
            fetchJobTitleOptions(funzioneAziendaleId);
        } else {
            setJobTitleEnable(false);
            setJobTitleOptions([]);
        }
    }, [values.funzioneAziendale]); 




    const fetchJobTitleOptions = async (funzioneAziendaleId) => {
        try {
            const response = await axios.get(`http://localhost:8080/aziende/react/tipologia/${funzioneAziendaleId}`, { headers: headers });
            const jobTitleOptions = response.data.map(jobTitle => ({
                label: jobTitle.descrizione,
                value: jobTitle.id,
            }));
            setJobTitleOptions(jobTitleOptions);
        } catch (error) {
            console.error("Errore nel caricamento dei jobTitle:", error);
        }
    };

        const fieldObbligatori = [ "nome", "cognome", "email", "anniEsperienzaRuolo", "tipologia", "dataUltimoContatto", "livelloScolastico", "funzioneAziendale" ];

        const fields =[
            { type: "titleGroups",                label: t("Profilo Candidato")            },
            { label: t("Nome*"),                         name: "nome",                     type: "text", maxLength: 45                                                            },
            { label: t("Cognome*"),                      name: "cognome",                  type: "text", maxLength: 45                                                           },
            { label: t("Email*"),                        name: "email",                    type: "text", maxLength: 45                                                           },
            { label: t("Cellulare"),                     name: "cellulare",                type: "text", maxLength: 20                                                           },
            { label: t("Residenza"),                     name: "citta",                    type: "text", maxLength: 45                                                           },
            
    
    
            { type: "titleGroups",                label: t("Esperienza")            },
            { label: t("Anni Di Esperienza"),              name: "anniEsperienza",           type: "decimalNumber"                                                   },
            { label: t("Anni Di Esperienza Nel Ruolo*"),   name: "anniEsperienzaRuolo",      type: "decimalNumber"                                                   },
            { label: t("Livello Scolastico*"),             name: "livelloScolastico",        type: "select",               options: livelloScolasticoOptions         },
            { label: t("Facoltà"),                         name: "facolta",                  type: "select",               options: facoltaOptions                   },
    
            { type: "titleGroups",                label: t("Posizione Lavorativa")            },
            { label: t('Tipo Ingaggio*'),                 name: 'tipo',                     type: 'select',          options: tipoOptions                           },
            { label: t("Tipo Candidatura*"),              name: "candidatura",              type: "select",          options: tipologiaOptions                       },
            // { label: "Tipo Ricerca*",                  name: "ricerca",                  type: "select",          options: ricercaOptions                         },
            { label: t("Modalità Di Lavoro"),             name: "modalita",                 type: "select",          options: [ 
                { value: 1, label: t("Full Remote") },
                { value: 2, label: t("Ibrido") },
                { value: 3, label: t("On Site")},
            ] },
        { label: t("Funzione Aziendale*"),                name: "funzioneAziendale",        type: "select",               options: funzioniAziendaliOptions         },
        { label: t("Job Title*"),                         name: "tipologia",                type: "select",               options: jobTitleOptions                  },
        { label: t("Data Inserimento*"),                  name: "dataUltimoContatto",       type: "date"                                                            },
        // { label: "Stato*",                             name: "stato",                    type: "select",               options: statoOptions                     },
        { label: t("Owner"),                              name: "owner",                    type: "select",               options: ownerOptions                     },
        { label: "Skills",                             name: "skills",                    type: "multipleSelect",        options: skillsOptions                    },
        { label: t("RAL/Tariffa"),                        name: "ral",                      type: "text", maxLength: 100                                                           },
        { label: t("Disponibilità"),                      name: "disponibilita",            type: "text", maxLength: 45                                                            },
        { label: t("Note"),                               name: "note",                     type: "note", maxLength: 8000                                                            },
    
    
            { type: "titleGroups",                label: t("Allegati")            },
            { label: "Curriculim Vitae",                name: "cv",                       type: "modificaFileCV"                                                  },
            { label: "Consultant File",                 name: "cf",                       type: "modificaFileCF"                                                  }, 
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
                    if ( field.name === 'tipologia' ) {
                    return (
                        <CustomAutocomplete
                        name={field.name}
                        label={field.label}
                        options={field.options || []}
                        value={values[field.name] || null}
                        onChange={handleChange}
                        getOptionSelected={(option, value) => option.value === value.value}
                        disabled={!jobTitleEnable}
                        error={!!errors[field.name]} 
                        helperText={errors[field.name]}
                        />
                    );
                    } else {
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
                    }


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


                    case "modificaFileCV":
                        return(
                            <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4}}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                                <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                                        </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0'}}>
                                <Typography variant="body2">
                                {values.cv?.descrizione || t('Nessun file selezionato')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                        <Button
                                            variant="contained"
                                            sx={{ 
                                            backgroundColor: '#00B400',
                                            marginLeft: '10px', 
                                            marginBottom: "10px", 
                                            marginTop: "10px", 
                                            justifyContent:"flex-end", 
                                            color: 'white',
                                            ':hover': {
                                                backgroundColor: '#00B400',
                                                color: 'white',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                            startIcon={<CloudUploadIcon sx={{color: 'white'}}/>}
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleChangeCV(field.name)}
                                            />
                                        </Button>
                                        </Box>
                                </Box>
                            </Box>
                        );
                    
        
        
        
                        case "modificaFileCF":
                            return(
                                <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4, ml: 10}}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                                    <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
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
                                            backgroundColor: '#00B400', 
                                            color: 'white',
                                            ':hover': {
                                                backgroundColor: '#00B400',
                                                color: 'white',
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
                                        </Box>
                                    </Box>
                                </Box>
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
                                        {/* <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>{field.label}</Typography> */}
                                    </Grid>
                                );
                            } else if (field.type === 'note') {
                                return (
                                    <Grid item xs={12} key={index}>
                                        {renderFields(field)}
                                        {/* <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>{field.label}</Typography> */}
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
        <Box sx={{ width: '280px', height: '98%', background: '#00B400', p:2, overflow: 'hidden', position: 'fixed', borderRadius: '20px 0px 0px 20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
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
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: 'black'}}>  {t('Aggiungi')} <br /> {t('Candidato')} </Typography>
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
                                    cursor: sectionCompleted[index] ? 'pointer' : 'not-allowed',
                                    '&.Mui-selected, &:hover': {
                                        backgroundColor: sectionCompleted[index] ? 'black' : 'black',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: sectionCompleted[index] ? '#EDEDED' : '#EDEDED'
                                        },
                                        borderRadius: '10px',
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon} 
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
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
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>{t('* Campo Obbligatorio')}</Typography>
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
                            }}>{t('Indietro')}</Button>
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
                                },}}>{t('Avanti')}</Button>
                        )}
                        {currentPageIndex === groupedFields.length - 1 && (
                            <Button 
                            onClick={() => handleSubmit(values)}
                            type="submit"
                            sx={{
                                mb: 4,
                                width: '250px',
                                backgroundColor: "#00B400",
                                color: "#EDEDED",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
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

export default AggiungiRecruitingGrafica;