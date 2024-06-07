import React, { useState, useEffect }                                                                 from 'react';
import { useNavigate, useParams }                                                                                from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Grid, Snackbar, Slide, Skeleton, Container } from '@mui/material';
import CircleOutlinedIcon                                                                             from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                          from 'axios';
import CustomAutocomplete                                                                             from '../../components/fields/CustomAutocomplete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUserTheme } from '../../components/TorchyThemeProvider';
import CustomTextFieldModifica from '../../components/fields/CustomTextFieldModifica';
import CustomDatePickerModifica from '../../components/fields/CustomDatePickerModifica';
import CustomDecimalNumberModifica from '../../components/fields/CustomDecimalNumberModifica';

const ModificaStaffing = () => {
    const theme = useUserTheme();
    const navigate = useNavigate();
    const { idHiring } = useParams();
    const { idScheda } = useParams();

    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Descrizione');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);    


    //stati per i valori
    const [ values,               setValues               ] = useState({});
    const [ terminiOptions,       setTerminiOptions       ] = useState([]);
    const [ datiModifica,       setDatiModifica         ] = useState([]);   






    const menu = [
        {
            title: 'Descrizione',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Economics',
            icon: <CircleOutlinedIcon />
        },
        { 
            title: 'Fatturazione',
            icon: <CircleOutlinedIcon />
        },
    ];

    //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
    const [sectionCompleted, setSectionCompleted] = useState(new Array(menu.length).fill(false));




    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchProvinceOptions = async () => {
        try {

          const schedaResponse = await axios.get(
                "http://89.46.196.60:8443/hiring/scheda",
                { headers: headers,
                    params: { idScheda: idScheda}
                }
            );
    

            const terminiPagamentoResponse = await axios.get(
            "http://89.46.196.60:8443/hiring/termini",
            { headers: headers }
            );

          
            if (schedaResponse.data) {
                    setDatiModifica(schedaResponse.data); 
                } else {
                    console.error("I dati ottenuti non sono validi:", schedaResponse.data);
                }
            

            if (Array.isArray(terminiPagamentoResponse.data)) {
            setTerminiOptions(terminiPagamentoResponse.data.map((termini, index) => ({ label: termini.descrizione, value: termini.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", terminiPagamentoResponse.data);
        } 
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        setLoading(false);
        };
    
        fetchProvinceOptions();
    }, []);





    //funzione per la navigazione dal menu laterale
    const handleMenuItemClick = (section, index) => {
        const allPreviousCompleted = sectionCompleted.slice(0, index).every(x => x);
        if (allPreviousCompleted) {
            setActiveSection(section);
            setCurrentPageIndex(index);
        } else {
            setAlert({ open: true, message: 'Per cambiare sezione, completare tutti i campi obbligatori delle sezioni precedenti.'});
        }
    };
    

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0: 
            return [  ]
            case 1:
                return [  ];
            case 2:
                return [  ];
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
    //             setAlert({ open: true, message: 'Compilare tutti i campi obbligatori presenti per poter avanzare'});
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
            setAlert({ open: true, message: 'Compilare tutti i campi obbligatori presenti per poter avanzare'});
        }
    };
    


  // Funzione per il cambio stato degli input
        const handleChange = fieldValue => {
            setValues(prevValues => {
                const newValues = { ...prevValues, ...fieldValue };
    
                // Calcola il nuovo importo da fatturare ogni volta che rate o gioni lavorati cambia
                if ('rate' in fieldValue || 'giorniLavorati' in fieldValue) {
                    const rate = parseFloat(newValues.rate || 0);
                    const giorniLavorati = parseFloat(newValues.giorniLavorati || 0);
                    const importoDaFatturare = rate * giorniLavorati;
                    newValues.importo = isNaN(importoDaFatturare) ? '' : importoDaFatturare.toFixed(2);
                }
    
                return newValues;
            });
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

                    const valuesWithId = { ...values, id: idScheda };

    
                    const response = await axios.post("http://89.46.196.60:8443/hiring/salva/scheda", valuesWithId, {
                        headers: headers,
                        params: { idHiring: idHiring }
                    });
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: "azienda già esistente!" });
                        console.error("L'azienda è già stata salvata.");
                        return; 
                    }
                    if (response.data === "ERRORE") {
                        setAlert({ open: true, message: "errore durante il salvataggio del servizio staffing!" });
                        console.error("L'azienda non è stata salvata.");
                        return;
                    }
                    navigate("/hiring");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
            }
        };


        
        const campiObbligatori = [  ];


        const fields =[
            { type: "titleGroups",                label: "Descrizione"            },
            { label: 'Nome',                            name: 'nome',                     type:'text', maxLength: 90                              },
            { label: 'Cognome',                         name: 'cognome',                  type:'text', maxLength: 90                              },
            { label: 'Ruolo',                           name: 'descrizione',              type:'text', maxLength: 90                              },
            { label: "Data inizio",                     name: "inizioAttivita",           type: "date", maxLength: 45                             },
            { label: "Data fine",                       name: "fineAttivita",             type: "date", maxLength: 45                             },
            { label: "Durata staffing",                 name: "durata",                   type: "text", maxLength: 45                             },


            { type: 'titleGroups',                label: "Economics"     },
            { label: "Rate consulente",                  name: "rate",                    type: "decimalNumber", maxLength: 45                    },
             { label: "Giorni Lavorati",                  name: "giorniLavorati",          type: "decimalNumber", maxLength: 45                    },
            { label: "Importo da fatturare",             name: "fatturato",                 type: "decimalNumber", maxLength: 45                    },

            { type: "titleGroups",                label: "Fatturazione"            },
            { label: "Data fatturazione",                  name: "dataFatturazione",      type: "date",          maxLength: 45                    },
            { label: "Termini di pagamento",               name: "idTerminePagamento",    type: "select",        options: terminiOptions, },
        ];


          const initialValues = {
            nome:                         datiModifica.nomeCandidato                      || null,
            cognome:                      datiModifica.cognomeCandidato                   || null,
            descrizione:                  datiModifica.descrizione                        || null,
            inizioAttivita:               datiModifica.inizioAttivita                     || null,
            fineAttivita:                 datiModifica.fineAttivita                       || null,
            durata:                       datiModifica.durata                             || null,
            rate:                         datiModifica.rate                      || null,
            giorniLavorati:               datiModifica.giorniLavorati                          || null,
            fatturato:                    datiModifica.fatturato                          || null,

            dataFatturazione:             datiModifica.dataFatturazione                   || null,
            // idTerminePagamento:          (datiModifica.idTerminePagamento && datiModifica.idTerminePagamento.id)  || null,
            idTerminePagamento:          (datiModifica.terminePagamento && datiModifica.terminePagamento.id) || null,
        };




         const disableFields = {
    nome:               true,
    cognome:            true,
    };
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
                case 'multipleSelect':
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


            switch (type) {
                case 'text':
                    const isDisabled = disableFields[field.name];
                    return (
                        <CustomTextFieldModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        maxLength={field.maxLength}
                        values={values}
                        onChange={handleChange}
                        initialValues={initialValues}
                        disabled={!!isDisabled}

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
                            color: theme.palette.textButton.main,
                        }
                    }}
                    >
                        <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                        Indietro
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: theme.palette.aggiungiSidebar.title}}>  Aggiungi <br /> Staffing </Typography>
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
                                            backgroundColor: sectionCompleted[index] ? theme.palette.aggiungiSidebar.hover : theme.palette.aggiungiSidebar.hover,
                                            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                                // color: sectionCompleted[index] ? theme.palette.aggiungiSidebar.text : theme.palette.aggiungiSidebar.textHover
                                                color: sectionCompleted[index] ? theme.palette.aggiungiSidebar.textHover : theme.palette.aggiungiSidebar.textHover
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
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column', ml: '280px' }}>
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
                            backgroundColor: theme.palette.button.black,
                            color: theme.palette.textButton.white,
                            fontWeight:"bold",
                            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            "&:hover": {
                                backgroundColor: theme.palette.button.black,
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
                                backgroundColor: theme.palette.button.black,
                                color: theme.palette.textButton.white,
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                
                                "&:hover": {
                                    backgroundColor: theme.palette.button.black,
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
                                backgroundColor: theme.palette.button.main,
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

export default ModificaStaffing;