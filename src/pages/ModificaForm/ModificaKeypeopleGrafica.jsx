import React, { useState, useEffect }                                                                           from 'react';
import { useNavigate, useLocation, useParams }                                                                  from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Snackbar, Skeleton, Grid, IconButton, Popover, Slide, Container } from '@mui/material';
import CircleOutlinedIcon                                                                                       from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                    from 'axios';
import CustomAutocomplete                                                                                       from '../../components/fields/CustomAutocomplete';
import CustomTextFieldModifica                                                                                  from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica                                                                                       from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                                                                                 from '../../components/fields/CustomDatePickerModifica';
import InfoIcon                                                                                                 from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const ModificaKeypeopleGrafica = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const valori = location.state;
    const { id } = useParams();



    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Anagrafica');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);

    //stati per i valori
    const [ aziendeOptions, setAziendeOptions] = useState([]);
    const [ ownerOptions,   setOwnerOptions  ] = useState([]);
    const [ statiOptions,   setStatiOptions  ] = useState([]);
    const [ datiModifica,   setDatiModifica  ] = useState([]);
    const [ values,         setValues        ] = useState({});



    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const keypeopleResponse = await axios.get(`http://localhost:8080/keypeople/react/${id}`,    { headers: headers });
            const aziendeResponse = await axios.get("http://localhost:8080/aziende/react/select",       { headers: headers });
            const ownerResponse   = await axios.get("http://localhost:8080/owner",        { headers: headers });
            const statiResponse   = await axios.get("http://localhost:8080/keypeople/react/stati",      { headers: headers });

            if (Array.isArray(statiResponse.data)) {
                const statiOptions = statiResponse.data.map((stati) => ({
                    label: stati.descrizione,
                    value: stati.id,
                }));
                setStatiOptions(statiOptions);
                } else {
                console.error("I dati ottenuti non sono nel formato Array:", statiResponse.data);
                }
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

            const modificaData = keypeopleResponse.data;
            setDatiModifica(modificaData);
            setLoading(false);
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
                return ["nome", "idAzienda", "idOwner", "email", "idStato", "ruolo", "dataCreazione"]; 
            default:
                return [];
        }
    };


    //funzione per la validazione dei campi
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

    
                    const response = await axios.post("http://localhost:8080/keypeople/react/salva", values, {
                        headers: headers
                    });
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: "contatto già esistente!" });
                        console.error("il contatto è già stata salvato.");
                        return; 
                    }
                    if (response.data === "ERRORE") {
                        setAlert({ open: true, message: "errore durante il salvataggio del contatto!" });
                        console.error("Il contatto non è stata salvata.");
                        return;
                    }
                    navigate("/contacts");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
            }
        };


          //funzione per il popover
        const [anchorElStato, setAnchorElStato] = useState(null);
        const [anchorElTipo, setAnchorElTipo] = useState(null);


        const handlePopoverStatoOpen = (event) => {
            setAnchorElStato(event.currentTarget);
        };

        const handlePopoverStatoClose = () => {
            setAnchorElStato(null);
        };
        const openStato = Boolean(anchorElStato);

        const handlePopoverTipoOpen = (event) => {
            setAnchorElTipo(event.currentTarget);
        };

        const handlePopoverTipoClose = () => {
            setAnchorElTipo(null);
        };

        const openTipo = Boolean(anchorElTipo);


        const campiObbligatori = [ "nome", "idAzienda", "email", "idOwner", "idStato", "ruolo", "dataCreazione" ];

        const fields =[
            { type: "titleGroups",                label: "Anagrafica"            },
            { label: "Nome Contatto*",        name: "nome",                type: "text", maxLength: 255 },
            { label: "Ruolo*",                name: "ruolo",               type: "text", maxLength: 255 },
            { label: "Azienda*",              name: "idAzienda",           type: "select",      options: aziendeOptions },
            { label: 'Tipo',                  name: 'tipo',                type: 'select',      options: [
                { value: 1, label: "Keypeople" },
                { value: 2, label: "Hook" },
                { value: 3, label: 'Link'}
              ] },
              { label: "Stato*",              name: "idStato",              type: "select",      options: statiOptions },
              { label: "Owner*",              name: "idOwner",              type: "select",      options: ownerOptions},
            { label: "Email*",                name: "email",                type: "text", maxLength: 45 },
            { label: "Cellulare",             name: "cellulare",            type: "text", maxLength: 20},
           
            
            { label: "Data di Creazione*",    name: "dataCreazione",       type: "date" },
            { label: 'Ultima attività',       name: 'dataUltimaAttivita',  type: 'date' },
            { label: "Note",                  name: "note",                type: "note", maxLength: 20000 },
        ];



        const initialValues = {
            id:                 datiModifica.id                                                  ,
            nome:               datiModifica.nome                                                || null,
            idAzienda:          datiModifica.cliente && datiModifica.cliente.id                  || null,
            idOwner:            datiModifica.owner   && datiModifica.owner.id                    || null,
            email:              datiModifica.email                                               || null,
            cellulare:          datiModifica.cellulare                                           || null,
            ruolo:              datiModifica.ruolo                                               || null,
            dataCreazione:      datiModifica.dataCreazione                                       || null,
            dataUltimaAttivita: datiModifica.dataUltimaAttivita                                  || null,
            idStato:            datiModifica.stato && datiModifica.stato.id                      || null,
            tipo:               datiModifica.tipo                                                || null,   
            note:               datiModifica.note                                                || null,
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
                            if (field.name === 'tipo') {
                                return (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomAutocomplete
                                            name={field.name}
                                            label={field.label}
                                            options={field.options}
                                            value={values[field.name] || null}
                                            onChange={handleChange}
                                            getOptionSelected={(option, value) => option.value === value.value}
                                        />
                                        <IconButton onClick={handlePopoverStatoOpen} sx={{ mr: -3, ml: 2 }}>
                                            <InfoIcon />
                                        </IconButton>
                                        <Popover
                                            open={openStato}
                                            anchorEl={anchorElStato}
                                            onClose={handlePopoverStatoClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            >
                                            <List dense>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Keypeople:</Typography>
                                                        {" lavora in azienda target, ha budget da gestire e potere decisionale "}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Hook:</Typography>
                                                        {" lavora in azienda target, ma non ha budget e potere decisionale "}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Link:</Typography>
                                                        {" persona che fa parte del nostro network e potrebbe avere contatti utili "}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                            </List>
                                            </Popover>

                                    </Box>
                                );
                            }
                            if (field.name === 'idStato') {
                                return (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CustomAutocomplete
                                            name={field.name}
                                            label={field.label}
                                            options={field.options}
                                            value={values[field.name] || null}
                                            onChange={handleChange}
                                            getOptionSelected={(option, value) => option.value === value.value}
                                        />
                                        <IconButton onClick={handlePopoverTipoOpen} sx={{ mr: -3, ml: 2 }}>
                                            <InfoIcon />
                                        </IconButton>
                                        <Popover
                                            open={openTipo}
                                            anchorEl={anchorElTipo}
                                            onClose={handlePopoverTipoClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            >
                                            <List dense>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Gold:</Typography>
                                                        {" ho ricevuto un’esigenza di business"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Silver:</Typography>
                                                        {" ho fissato una prospection"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Bronze:</Typography>
                                                        {" sono entrato in contatto"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Wood:</Typography>
                                                        {" ho effettuato un’azione senza esito"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                                <ListItem>
                                                <ListItemText 
                                                    primary={
                                                    <Box>
                                                        <Typography component="span" sx={{ fontWeight: 'bold' }}>Start:</Typography>
                                                        {" non ho ancora effettuato azioni commerciali"}
                                                    </Box>
                                                    } 
                                                />
                                                </ListItem>
                                            </List>
                                            </Popover>
                                    </Box>
                                );
                            }
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
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: 'black'}}>  Aggiorna <br /> Contatto </Typography>
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
                                backgroundColor: "#00B400",
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

export default ModificaKeypeopleGrafica;