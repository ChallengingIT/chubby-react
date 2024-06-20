import React, { useState, useEffect }                                                                           from 'react';
import { useNavigate, useLocation }                                                                             from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Snackbar, Skeleton, Grid, Slide, Container} from '@mui/material';
import CircleOutlinedIcon                                                                                       from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                    from 'axios';
import CustomAutocomplete                                                                                       from '../../components/fields/CustomAutocomplete';
import CustomTextFieldModifica                                                                                  from '../../components/fields/CustomTextFieldModifica';
import CustomImgFieldModifica                                                                                   from '../../components/fields/CustomImgFieldModifica';
import CustomNoteModifica                                                                                       from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                                                                                 from '../../components/fields/CustomDatePickerModifica';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomMultipleSelectModificaAziende from '../../components/fields/CustomMultipleSelectModificaAziende';


const ModificaAziendaGrafica = () => {
    const navigate = useNavigate();
    const location             = useLocation();
    const valori               = location.state;
    const id = valori.id;

    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Profilo');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ imagePreviewUrl,    setImagePreviewUrl      ] = useState(null);
    const [ fileIMG,            setFileIMG              ] = useState(null);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);

    //stati per i valori
    const [ provinceOptions,    setProvinceOptions      ] = useState([]);
    const [ ownerOptions,       setOwnerOptions         ] = useState([]);
    const [ values,             setValues               ] = useState({});
    const [ aziendeOptions,     setAziendeOptions       ] = useState([]);
    const [ datiModifica,       setDatiModifica         ] = useState([]);
    const [ tipoServizioOptions,     setTipoServizioOptions       ] = useState([]);


    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchProvinceOptions = async () => {
        try {
            const responseProvince = await axios.get("http://localhost:8080/aziende/react/province",         { headers: headers });
            const responseOwner    = await axios.get("http://localhost:8080/owner",                          { headers: headers });
            const responseAziende  = await axios.get("http://localhost:8080/aziende/react/select",           { headers: headers });
            const responseModifica = await axios.get(`http://localhost:8080/aziende/react/${id}`,            { headers: headers });
            const tipoServizioResponse  = await axios.get("http://localhost:8080/hiring/servizi",            { headers: headers });

            if (Array.isArray(tipoServizioResponse.data)) {
            const tipoServizioOptions = tipoServizioResponse.data.map((tipoServizio) => ({
                label: tipoServizio.descrizione,
                value: tipoServizio.id,
            }));
            setTipoServizioOptions(tipoServizioOptions);
        }



            if (Array.isArray(responseAziende.data)) {
            const aziendeOptions = responseAziende.data.map((aziende) => ({
                label: aziende.denominazione,
                value: aziende.id,
            }));
            setAziendeOptions(aziendeOptions);
        }

        
            if (Array.isArray(responseOwner.data)) {
            const ownerOptions = responseOwner.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
        }


            if (Array.isArray(responseProvince.data)) {
                const provinceOptions = responseProvince.data.map((province) => ({
                label: province.nomeProvince,
                value: province.nomeProvince,
                }));
                setProvinceOptions(provinceOptions);
            }

            const modificaData = responseModifica.data;
            setDatiModifica(modificaData);
            setLoading(false);

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
            title: 'IDA',
            icon: <CircleOutlinedIcon />
        },
        { 
            title: 'Contratti',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Documenti',
            icon: <CircleOutlinedIcon />
        }
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

       //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0: 
            return [ "denominazione", "settoreMercato", "citta" ]
            case 1:
                return [ "status", "potenzialita", "semplicita" ];
            case 2:
                return [ "idOwner", "tipologia" ];
            default: 
                return [];
        }
    };


    //funzione per la validazione dei campi
    // const validateFields = (values, mandatoryFields) => {
    //     let errors = {};
    //     mandatoryFields.forEach(field => {
    //         if (!values[field]) {
    //             errors[field] = 'Questo campo è obbligatorio';
    //         }
    //     });
    //     return errors;
    // };
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

         //funzione per la transizione dell'alert
        function TransitionDown(props) {
            return <Slide {...props} direction="down" />;
        }


        // //funzione per il cambio stato del tipo servizio
        // const handleChangeMultipleTipoServizio = (fieldValue) => {
        //     const fieldName = Object.keys(fieldValue)[0];
        //     const newSelections = fieldValue[fieldName]; 
        
        //     setValues(prevValues => {
        //         const currentSelections = prevValues[fieldName] || []; 
        
        //         const selectionsToAdd = newSelections.filter(selection => !currentSelections.includes(selection));
        
        //         const selectionsToRemove = currentSelections.filter(selection => !newSelections.includes(selection));
        
        //         const updatedSelections = currentSelections
        //             .filter(selection => !selectionsToRemove.includes(selection))
        //             .concat(selectionsToAdd);
        
        //         return {
        //             ...prevValues,
        //             [fieldName]: updatedSelections
        //         };
        //     });
        // };



        //funzione per il cambio stato delle skill
// const handleChangeMultipleTipoServizio = (fieldValue) => {
//     const fieldName = Object.keys(fieldValue)[0];
//     //devo riconvertire in array per usare .split e .trim
//     const newSelections = fieldValue[fieldName].split(',').map(item => item.trim());

//     setValues(prevValues => {
//         const currentSelections = typeof prevValues[fieldName] === 'string'
//             ? prevValues[fieldName].split(',').map(item => item.trim())
//             : prevValues[fieldName] || [];

//         const selectionsToAdd = newSelections.filter(selection => !currentSelections.includes(selection));
//         const selectionsToRemove = currentSelections.filter(selection => !newSelections.includes(selection));

//         const updatedSelections = currentSelections
//             .filter(selection => !selectionsToRemove.includes(selection))
//             .concat(selectionsToAdd);

//         return {
//             ...prevValues,
//             //riconverto in stringa
//             [fieldName]: updatedSelections.join(',') 
//         };
//     });
// };


    const handleChangeMultipleTipoServizio = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
    };





    //funzione per convertire le chiavi delle select da "idX" a "X"
    const replaceKeysInValues = (values, mapping) => {
    const newValues = { ...values };

    Object.keys(mapping).forEach(key => {
        if (key in newValues) {
            const newKey = mapping[key];
            if (key === 'idTipiServizio' && Array.isArray(newValues[key])) {
                newValues[newKey] = newValues[key].join(',');
            } else {
                newValues[newKey] = newValues[key];
            }
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

            const fieldMapping = {
                idTipiServizio: "tipiServizio"
            };

            const transformedValues = replaceKeysInValues(values, fieldMapping);
            const valuesToSend = {
                ...transformedValues,
            };


                    Object.keys(values).forEach(key => {
                        if (!campiObbligatori.includes(key) && !values[key]) {
                            values[key] = null;
                        }
                    });
        
                    const userString = sessionStorage.getItem("user");
                    if (!userString) {
                        console.error("Nessun utente o token trovato in sessionStorage");
                        return;
                    }
                    const user = JSON.parse(userString);
                    const token = user?.token;
        
                    if (!token) {
                        console.error("Nessun token di accesso disponibile");
                        return;
                    }
        
                    const headers = {
                        Authorization: `Bearer ${token}`
                    };
                    delete values.image;
                    delete values.logo;

                    

    
        
                    const response = await axios.post("http://localhost:8080/aziende/react/salva", valuesToSend, {
                        headers: headers
                    });
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: "azienda già esistente!" });
                        console.error("L'azienda è già stata salvata.");
                        return; 
                    }
                    if (response.data === "ERRORE") {
                        setAlert({ open: true, message: "errore durante il salvataggio dell'azienda!" });
                        console.error("L'azienda non è stata salvata.");
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
                            Authorization: `Bearer ${token}`
                            }
                        });
                    
                        } else {
                            navigate("/business");
                        }
                    } catch (error) {
                        console.error("Errore nell'invio dell'immagine: ", error);
                    }
                    navigate("/business");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
            }
        };
        



 
        const campiObbligatori = [ "denominazione", "ragioneSociale", "idOwner", "citta", "tipologia", "status", "potenzialita", "semplicita" ];

        const fields =[
            { type: "titleGroups",                label: "Profilo"            },
            { label: 'Nome Azienda*',                   name: 'denominazione',            type:'text', maxLength: 90                              },
            { label: 'Settore Mercato*',                name: 'settoreMercato',           type:'text', maxLength: 255                             },
            { label: "Partita IVA",                     name: "pi",                       type: "text", maxLength: 45                             },
            { label: "Codice Fiscale",                  name: "cf",                       type: "text", maxLength: 45                             },
            { label: "Pec",                             name: "pec",                      type: "text", maxLength: 45                             },
            { label: "Codice Destinatario",             name: "codiceDestinatario",       type: "text", maxLength: 45                             },
            { label: "Sito Web",                        name: "sito",                     type: "text", maxLength: 90                             },
            { label: "Sede Legale",                      name: "sedeLegale",               type: "text", maxLength: 45                            },
            { label: "Sede Operativa",                   name: "sedeOperativa",            type: "text", maxLength: 45                            },
            { label: "Città*",                           name: "citta",                    type: "text", maxLength: 45                            },
            { label: "Paese",                            name: "paese",                    type: "text", maxLength: 255                           },


            { type: 'titleGroups',                label: "IDA"     },
            { label: "Potenzialità*",                          name: "potenzialita",                  type: "select", options: [
                { value: 1, label: "Basso" },
                { value: 2, label: "Medio" },
                { value: 3, label: "Alto" },
            ]  },
            { label: "Semplicità*",                            name: "semplicita",                    type: "select", options: [
                { value: 1, label: "Basso" },
                { value: 2, label: "Medio" },
                { value: 3, label: "Alto" },
            ]  },
            { label: "Complicità*",                                 name: "status",                        type: "select", options: [
                { value: 1, label: "Basso" },
                { value: 2, label: "Medio" },
                { value: 3, label: "Alto" },
            ]  },


            { type: "titleGroups",                label: "Contratti"            },
            { label: "Owner*",                                name: "idOwner",                       type: "select", options: ownerOptions    },
            { label: "Tipologia*",                            name: "tipologia",                     type: "select", options: [
                { value: "Cliente", label: "Cliente" },
                { value: "Prospect", label: "Prospect" },
                { value: "EXCLIENTE", label: "Ex Cliente" }
            ]  },
            { label: 'Scadenza Contratto',              name: 'dataScadenzaContratto',    type: 'date'                                            },
            { label: 'Tipo di servizio',                name: 'idTipiServizio',             type: 'multipleSelect', options: tipoServizioOptions         },
            { label: 'Note',                            name: 'note',                     type: 'note', maxLength: 2000                           },


            { type: "titleGroups",   label: "Documenti"                            },
            { label: 'Logo',         name: 'logo',  type: 'aggiungiImmagine'  },
        ];



        const initialValues = {
            id:                           datiModifica.id                              ,
            denominazione:                datiModifica.denominazione                   || null,
            pi:                           datiModifica.pi                              || null,
            dataScadenzaContratto:        datiModifica.dataScadenzaContratto           || null,
            cf:                           datiModifica.cf                              || null,
            citta:                        datiModifica.citta                           || null,
            cap:                          datiModifica.cap                             || null,
            paese:                        datiModifica.paese                           || null,
            provincia:                    datiModifica.provincia                       || null,
            pec:                          datiModifica.pec                             || null,
            sedeOperativa:                datiModifica.sedeOperativa                   || null,
            sedeLegale:                   datiModifica.sedeLegale                      || null,
            codicePa:                     datiModifica.codicePa                        || null,
            codiceDestinatario:           datiModifica.codiceDestinatario              || null,
            sito:                         datiModifica.sito                            || null,
            settoreMercato:               datiModifica.settoreMercato                  || null,
            tipologia:                    datiModifica.tipologia                       || null,
            status:                       datiModifica.status                          || null,
            semplicita:                   datiModifica.semplicita                      || null,
            potenzialita:                 datiModifica.potenzialita                    || null, 
            idOwner:                     (datiModifica.owner && datiModifica.owner.id) || null,
            idTipiServizio:               datiModifica.tipiServizio ? datiModifica.tipiServizio.map((tipoServizio) => tipoServizio.id) :            [] || null,
            note:                         datiModifica.note                            || null,
            logo:                         datiModifica.logo                            || null,
        };

        // const fieldMapping = {
        //     idTipiServizio: "tipiServizio"
        // };



        //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
        useEffect(() => {
            if (Object.keys(datiModifica).length !== 0) {
                const updatedFormValues = { ...initialValues };
        
                Object.keys(datiModifica).forEach(key => {
                    if (initialValues.hasOwnProperty(key)) {
                        updatedFormValues[key] = datiModifica[key];
                    }
                });
        
                setValues(updatedFormValues);
            }
        }, [datiModifica]); 

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
                case 'multipleSelectSkill':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'note':
                    return <Skeleton variant="text" width={710} height={120} />;
                default:
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

            }
        };

        //funzione per richiamare i vari campi
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

                case 'select': 
                const initialValue = field.options.find(option => option.value === values[field.name]);
                return (
                <CustomAutocomplete
                            // key={field.name}
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChange}
                            initialValue={initialValue}
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
                    );

                    case 'multipleSelect':
                        return ( 
                        <CustomMultipleSelectModificaAziende
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChangeMultipleTipoServizio}
                            getOptionSelected={(option, value) => option.value === value.value}
                            tipiServizioOptions={tipoServizioOptions}
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
                        maxLength={field.maxLength}

                        />
                    );

                case 'aggiungiImmagine': 
                return (
                    <CustomImgFieldModifica
                    label={field.label}
                    imagePreviewUrl={imagePreviewUrl}
                    onChange={handleChangeIMG}
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
                        Indietro
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: 'black'}}>  Aggiorna <br /> Azienda </Typography>
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
                                        backgroundColor: activeSection === item.title ? 'black' : 'transparent',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: activeSection === item.title ? '#EDEDED' : '#EDEDED'
                                        },
                                        borderRadius: '10px',
                                    }
                                }}
                            >
                                <ListItemIcon>
                                <ListItemIcon>
                                        {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon} 
                                    </ListItemIcon> 
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                            ))}
                        </List>
            </Box>
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column', ml: '280px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3}}>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" component="h1" sx={{ mt:1, fontWeight: 'bold', fontSize: '1.8'}}>{datiModifica.denominazione}</Typography>
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
                            }}>Salva</Button>
                        )}
                </Box>
            </Box>
        </Box>
    </Container>
    )
}

export default ModificaAziendaGrafica;