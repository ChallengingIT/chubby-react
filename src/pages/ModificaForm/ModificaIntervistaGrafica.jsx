import React, { useState, useEffect }                                                                                             from 'react';
import { useNavigate, useLocation }                                                                                               from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Skeleton, Snackbar, Grid, Slide, Container } from '@mui/material';
import CircleOutlinedIcon                                                                                                         from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                                      from 'axios';
import CustomAutocomplete                                                                                                         from '../../components/fields/CustomAutocomplete';
import CustomDecimalNumberAggiungi                                                                                                from '../../components/fields/CustomDecimalNumberAggiungi';
import CustomTextFieldModifica                                                                                                    from '../../components/fields/CustomTextFieldModifica';
import CustomDatePickerHoursAggiungi                                                                                              from '../../components/fields/CustomDatePickerHoursAggiungi';
import CustomDatePickerModifica                                                                                                   from '../../components/fields/CustomDatePickerModifica';
import CustomNoteModifica                                                                                                         from '../../components/fields/CustomNoteModifica';
import CheckCircleIcon                                                                                                            from '@mui/icons-material/CheckCircle';
import { useTranslation }                                                                                                         from 'react-i18next';
import { useMediaQuery }                                                                                                          from '@mui/material';
import { useUserTheme }                                                                                                           from "../../components/TorchyThemeProvider";


const ModificaIntervistaGrafica = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const rowData = location.state;
    const candidatoID = rowData.candidato.id;
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');
    const theme = useUserTheme();




    //stati della pagina
    const [activeSection, setActiveSection] = useState(t("Informazioni"));
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [alert, setAlert] = useState({ open: false, message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    //stati per i valori
    const [statoOptions, setStatoOptions] = useState([]); //tipologiaIncontro
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [tipoIntervistaOptions, setTipoIntervistaOptions] = useState([]); //follow up
    const [interviste, setInterviste] = useState([]);
    const [candidatoData, setCandidatoData] = useState([]);
    const [values, setValues] = useState([]);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Funzione per fare il mapping dei valori di teamSiNo
    const getTeamSiNoLabel = (value) => {
        switch (value) {
            case 1:
                return "SI";
            case 2:
                return "NO";
            case 3:
                return "KO";
            default:
                return "";
        }
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchData = async () => {
            const paginazione = {
                pagina: 0,
                quantita: 10,
            }
            try {
                //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
                const ownerResponse = await axios.get("http://89.46.196.60:8443/owner", { headers: headers });
                const responseTipoIntervista = await axios.get("http://89.46.196.60:8443/intervista/react/tipointervista", { headers: headers });
                const responseIntervista = await axios.get(`http://89.46.196.60:8443/intervista/react/mod/${candidatoID}`, { headers: headers, params: paginazione }); //questa è la lista delle interviste di cui devo prendere sempre l'ultima
                const responseCandidato = await axios.get(`http://89.46.196.60:8443/staffing/react/${candidatoID}`, { headers: headers }); //questo è il candidato
                const responseStato = await axios.get("http://89.46.196.60:8443/staffing/react/stato/candidato", { headers: headers });

                if (responseIntervista.data && typeof responseIntervista.data === 'object') {
                    const intervisteData = responseIntervista.data.interviste;
                    if (Array.isArray(intervisteData) && intervisteData.length > 0) {
                        // Prendo l'ultima intervista per data
                        const ultimaIntervista = intervisteData[intervisteData.length - 1];
                        setInterviste(ultimaIntervista);
                    } else if (intervisteData.length === 0) {
                    } else {
                        console.error("I dati ottenuti da intervista non sono nel formato Array:", intervisteData);
                    }
                } else {
                    console.error("I dati ottenuti non sono un oggetto valido:", responseIntervista.data);
                }

                if (Array.isArray(responseTipoIntervista.data)) {
                    const tipoIntervistaOptions = responseTipoIntervista.data.map((tipoIntervista) => ({
                        label: tipoIntervista.descrizione,
                        value: tipoIntervista.id,
                    }));
                    setTipoIntervistaOptions(tipoIntervistaOptions);
                }

                if (Array.isArray(responseStato.data)) {
                    const statoOptions = responseStato.data.map((stato) => ({
                        label: stato.descrizione,
                        value: stato.id,
                    }));
                    setStatoOptions(statoOptions);
                }

                if (Array.isArray(ownerResponse.data)) {
                    const ownerOptions = ownerResponse.data.map((owner) => ({
                        label: owner.descrizione,
                        value: owner.id,
                    }));
                    setOwnerOptions(ownerOptions);
                }

                if (responseCandidato.data && typeof responseCandidato.data === 'object') {
                    setCandidatoData(responseCandidato.data);
                    setLoading(false);
                }

            } catch (error) {
                console.error("Errore durante il recupero delle province:", error);
            }
        };

        fetchData();
    }, []);

    const menu = [
        {
            title: t("Informazioni"),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t("Competenze"),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t("Info Contrattuali"),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t("Azioni"),
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
            setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter cambiare sezione') });
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return ["dataColloquio"];
            case 1:
                return [ "coerenza", "standing", "energia", "comunicazione", "inglese", "competenze", "valutazione", "descrizioneCandidatoUna", "teamSiNo"];
            case 2:
                return [];
            default:
                return [];
        }
    };

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
                setAlert({ open: true, message: t('Compilare tutti i field obbligatori presenti per poter avanzare') });
            }
        }
    };

    //funzione per la chiusura dell'alert
    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    //funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const fieldMapping = {
        idTipo: "tipo",
    };

    //funzione per convertire le chiavi delle select da "idX" a "X"
    const replaceKeysInValues = (values, mapping) => {
        const newValues = { ...values };
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
                    if (!campiObbligatori.includes(key) && !values[key]) {
                        values[key] = null;
                    }
                });

                const transformedValues = replaceKeysInValues(values, fieldMapping);

                // Rimuovi i secondi dalla dataAggiornamento se presente
                if (transformedValues.dataAggiornamento) {
                    const date = new Date(transformedValues.dataAggiornamento);
                    transformedValues.dataAggiornamento = date.toISOString().slice(0, 16); // Prendi solo la data con ore e minuti
                }

                const note = values.note;
                const modifica = 1;
                const response = await axios.post("http://89.46.196.60:8443/intervista/react/salva", transformedValues, {
                    params: {
                        idCandidato: candidatoID,
                        note: note,
                        modifica: modifica
                    },
                    headers: headers
                });
                if (response.data === "ERRORE") {
                    setAlert({ open: true, message: t("errore durante il salvataggio dell'intervista!")});
                    console.error("L'intervista non è stata salvata.");
                    return;
                }
                navigate(`/recruiting/intervista/${candidatoID}`);

            } catch (error) {
                console.error("Errore durante il salvataggio:", error);
            }
        }

    };

    const valoriOptions = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
    ];

    const siNoOptions = [
        { value: 1, label: "SI" },
        { value: 2, label: "NO" },
        { value: 3, label: "KO" },
    ];

    const campiObbligatori = ["dataColloquio", "coerenza", "standing", "energia", "comunicazione", "inglese", "competenze", "valutazione", "descrizioneCandidatoUna", "teamSiNo"];
    const fields = [
        { type: "titleGroups", label: t("Informazioni") },
        { label: t("Data Incontro*"), name: "dataColloquio", type: "date" },
        { label: t("Intervistatore"), name: "idOwner", type: "select", options: ownerOptions },
        // { label: "Tipologia Incontro", name: "idStato", type: "text" },
        { label: t("Nome"), name: "nome", type: "text" },
        { label: t("Cognome"), name: "cognome", type: "text" },
        { label: t("Data Di Nascita"), name: "dataNascita", type: "date" },
        { label: "Location", name: "location", type: "text" },
        { label: "Job Title", name: "tipologia", type: "text" },
        { label: t("Anni Di Esperienza"), name: "anniEsperienza", type: "text" },
        { label: t("Recapiti"), name: "cellulare", type: "text" },
        { label: t("Descrizione Candidato"), name: "note", type: "note", maxLength: 8000 },

        { type: "titleGroups", label: t("Competenze") },
        { label: t("Coerenza Percorso*"),           name: "coerenza",                   type: "select",             options: valoriOptions  },
        { label: t("Standing*"),                    name: "standing",                   type: "select",             options: valoriOptions  },
        { label: t("Energia*"),                     name: "energia",                    type: "select",             options: valoriOptions  },
        { label: t("Comunicazione*"),               name: "comunicazione",              type: "select",             options: valoriOptions  },
        { label: t("Livello Di Inglese*"),          name: "inglese",                    type: "select",             options: valoriOptions  },
        { label: t("Competenze vs ruolo*"),         name: "competenze",                 type: "select",             options: valoriOptions  },
        { label: t("Valutazione*"),                 name: "valutazione",                type: "select",             options: valoriOptions  },
        { label: t("One word*"),                    name: "descrizioneCandidatoUna",    type: "text",               maxLength: 45,          },
        { label: t("Lo vorresti nel tuo team?*"),   name: "teamSiNo",                   type: "select",             options: siNoOptions    },

        { type: "titleGroups", label: t("Info contrattuali") },
        { label: t("Preavviso"), name: "preavviso", type: "text", maxLength: 45 },
        { label: t("Disponibilità Effettiva"), name: "disponibilita", type: "text", maxLength: 45 },
        { label: t("RAL Attuale"), name: "attuale", type: "text", maxLength: 90 },
        { label: t("RAL Desiderata"), name: "desiderata", type: "text", maxLength: 90 },
        { label: t("Proposta Economica"), name: "proposta", type: "note", maxLength: 90 },


        { type: "titleGroups", label: t("Azioni") },
        { label: t("Follow Up"), name: "idTipo", type: "select", options: tipoIntervistaOptions },
        { label: t("Next Deadline"), name: "dataAggiornamento", type: "dateOra" },
        { label: t("Owner next Deadline"), name: "idNextOwner", type: "select", options: ownerOptions },
    ];

    const initialValues = {
        id: rowData.id,
        idStato: (candidatoData.stato && candidatoData.stato.descrizione) || null,
        nome: candidatoData?.nome || null,
        cognome: candidatoData.cognome || null,
        dataNascita: candidatoData.dataNascita || null,
        location: candidatoData.citta || null,
        // tipologia: candidatoData.tipologia?.descrizione || null,
        anniEsperienza: candidatoData.anniEsperienza || null,
        dataColloquio: rowData.dataColloquio || null,
        cellulare: candidatoData.cellulare || null,
        idOwner: rowData.owner?.id || null,
        aderenza: rowData.aderenza || null,
        coerenza: rowData.coerenza || null,
        motivazione: rowData.motivazione || null,
        standing: rowData.standing || null,
        energia: rowData.energia || null,
        comunicazione: rowData.comunicazione || null,
        inglese: rowData.inglese || null,
        competenze: rowData.competenze || null,
        valutazione: rowData.valutazione || null,
        descrizioneCandidatoUna: rowData.descrizioneCandidatoUna || null,
        teamSiNo: rowData.teamSiNo || null,
        note: candidatoData.note || null,
        disponibilita: rowData.disponibilita || null,
        attuale: rowData.attuale || null,
        desiderata: rowData.desiderata || null,
        proposta: rowData.proposta || null,
        idTipo: rowData.tipo?.id || null,
        preavviso: rowData.preavviso || null,
        dataAggiornamento: rowData.dataAggiornamento || null,
        idNextOwner: rowData.nextOwner?.id || null
    };

    const disableFields = {
        nome: true,
        cognome: true,
        dataNascita: true,
        tipologia: true,
        location: true,
        anniEsperienza: true,
        cellulare: true,
        stato: true
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

    //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
    useEffect(() => {
        if (Object.keys(rowData).length !== 0) {
            const updatedvalues = { ...initialValues };

            Object.keys(rowData).forEach(key => {
                if (initialValues.hasOwnProperty(key)) {
                    updatedvalues[key] = rowData[key];
                }
            });

            setValues(updatedvalues);
        }
    }, [rowData]);

    useEffect(() => {
        if (Object.keys(values).length > 0) {
            setLoading(false);
        }
    }, [values]);

    //funzione per richiamare i vari field
    const renderFields = (field) => {
        if (loading) {
            return renderFieldSkeleton(field.type);
        } else {
            const { type, ...otherProps } = field;
            // const errorMessage = errors[field.name];

            switch (type) {
                case 'text':
                    const isDisabled = disableFields[field.name];
                    return (
                        <CustomTextFieldModifica
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                            initialValues={initialValues}
                            disabled={!!isDisabled}
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

                case 'date':
                    const dateDisabled = disableFields[field.name];
                    return (
                        <CustomDatePickerModifica
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                            initialValues={initialValues}
                            disabled={!!dateDisabled}
                        />
                    );

                case 'dateOra':
                    return (
                        <CustomDatePickerHoursAggiungi
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                        />
                    );

                case 'number':
                    return (
                        <CustomDecimalNumberAggiungi
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            values={values}
                            onChange={handleChange}
                            maxLength={field.maxLength}
                        />
                    );

                default:
                    return null;
            }
        }
    };

    const renderFieldsGroups = () => {
        return (
            <Box sx={{ ml: 15, mr: 15 }}>
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
            <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', marginLeft: isSmallScreen ? "3.5em" : "12.8em", mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden', transition: 'margin-left 0.3s ease', }}>
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
            >                    
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                        <Button
                            onClick={handleGoBack}
                            sx={{
                                color: '#EDEDED',
                                border: 'none',
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
                            <span style={{ marginRight: '0.5em' }}>{"<"}</span>
                            {t('Indietro')}
                        </Button>
                    </Box>
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: { xs: "1.2em", sm: "1.5em", md: "1.8em" }, transition: 'fontSize 0.3s ease', color: 'black' }}>  {t('Aggiorna')} <br /> {t('Intervista')} </Typography>
                    <List sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {menu.map((item, index) => (
                            <ListItem
                                key={item.title}
                                selected={activeSection === item.title}
                                onClick={() => handleMenuItemClick(item.title, index)}
                                sx={{
                                    mb: 4,
                                    cursor: 'pointer', 
                                    '&.Mui-selected': {
                                        backgroundColor: activeSection === item.title ? 'black' : 'transparent',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: activeSection === item.title ? '#EDEDED' : '#EDEDED'
                                        },
                                        borderRadius: '10px',
                                    }
                                }}
                            >
                                <ListItemIcon
                                sx={{ color: theme.palette.aggiungiSidebar.text, mr: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 }, display: { xs: 'none', sm: 'none', md: 'block' }, }}
                                >
                                    {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.title}
                                    sx={{ color: theme.palette.aggiungiSidebar.text, fontSize: { xs: "0.7em", sm: "0.8em", md: "1em" }, ml: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box
            sx={{
                flexGrow: 1,
                height: "100%",
                background: "#FEFCFD",
                display: "flex",
                flexDirection: "column",
                ml: { xs: '70px', sm: '150px', md: '220px', lg: '280px' },
            }}
            >               
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3 }}>
                        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                                {alert.message}
                            </Alert>
                        </Snackbar>
                        <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.8' }}>{activeSection}</Typography>
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
                    >    
                    {renderFieldsGroups(groupedFields)}
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16 }}>* Campo Obbligatorio</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' } }}>
                    {currentPageIndex > 0 && (
                            <Button onClick={handleBackButtonClick}
                                sx={{
                                    mb: 4,
                                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
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
                                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                        transform: "scale(1.05)",
                                        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '10px',
                                    },
                                }}>{t('Avanti')}</Button>
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
                                    fontWeight: "bold",
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

export default ModificaIntervistaGrafica;
