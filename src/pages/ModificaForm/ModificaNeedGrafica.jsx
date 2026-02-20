import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Skeleton, Snackbar, Grid, Slide, Container, FormControlLabel, Switch, Hidden } from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import axios from 'axios';
import CustomAutocomplete from '../../components/fields/CustomAutocomplete';
import CustomWeekDateAggiungi from '../../components/fields/CustomWeekDateAggiungi';
import CustomTextFieldModifica from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica from '../../components/fields/CustomDatePickerModifica';
import CustomDecimalNumberModifica from '../../components/fields/CustomDecimalNumberModifica';
import CustomMultipleSelectModifica from '../../components/fields/CustomMultipleSelectModifica';
import CustomNumberModifica from '../../components/fields/CustomNumberModifica';
import { useUserTheme } from '../../components/TorchyThemeProvider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import BASE_URL from '../../api/apiConfig';


const ModificaNeedGrafica = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const theme = useUserTheme();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');


    //stati della pagina
    const [activeSection, setActiveSection] = useState(t('Descrizione Need'));
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [alert, setAlert] = useState({ open: false, message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    //stati per i datiModifica
    const [datiModifica, setDatiModifica] = useState([]);


    const [aziendeOptions, setAziendeOptions] = useState([]);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [statoOptions, setStatoOptions] = useState([]);
    const [keyPeopleOptions, setKeyPeopleOptions] = useState([]);
    const [aziendaID, setAziendaID] = useState(null);
    const [aziendaInternaOptions, setAziendaInternaOptions] = useState([]);
    const [isChallengingUser, setIsChallengingUser] = useState(false);
    const [values, setValues] = useState({});

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //controllo del ruolo dell'utente loggato
    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchNeedOptions = async () => {
            try {
                const userString = sessionStorage.getItem("user");
                const user = userString ? JSON.parse(userString) : null;
                const username = user?.username;

                const aziendaInternaUrl = userHasRole("ADMIN")
                    ? `${BASE_URL}gestione/aziende/interne`
                    : `${BASE_URL}gestione/aziende/interne/${username}`;

                const responseAziendeUrl = userHasRole("ADMIN")
                    ? `${BASE_URL}aziende/react/select`
                    : `${BASE_URL}aziende/react/select/${username}`;


                const responseAziende = await axios.get(responseAziendeUrl, { headers: headers });
                const responseSkill = await axios.get(`${BASE_URL}staffing/react/skill`, { headers: headers });
                //const ownerResponse = await axios.get(`${BASE_URL}owner`, { headers: headers });
                const tipologiaResponse = await axios.get(`${BASE_URL}need/react/tipologia`, { headers: headers });
                const statoResponse = await axios.get(`${BASE_URL}need/react/stato`, { headers: headers });
                const needResponse = await axios.get(`${BASE_URL}need/react/${id}`, { headers: headers });
                const aziendaInternaResponse = await axios.get(aziendaInternaUrl, { headers: headers });
                const responseAree = await axios.get(`${BASE_URL}staffing/react/areas`, { headers });

                let groupedSkills = [];

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
                    const allTipologie = tipologiaResponse.data.map(t => ({
                        label: t.descrizione,
                        value: t.id,
                    }));

                    // Esempio di logica: i primi 2 = Consulting, successivi 3 = Talent, restanti = Factory
                    const consulting = allTipologie.slice(0, 2);
                    const talent = allTipologie.slice(2, 5);
                    const factory = allTipologie.slice(5);

                    const groupedTipologie = [
                        { label: "Consulting", value: "__header_consulting__", isHeader: true },
                        ...consulting,
                        { label: "Talent", value: "__header_talent__", isHeader: true },
                        ...talent,
                        { label: "Factory", value: "__header_factory__", isHeader: true },
                        ...factory,
                    ];

                    setTipologiaOptions(groupedTipologie);
                }

                const ownerUrl = userHasRole('ADMIN')
                    ? `${BASE_URL}owner`
                    : `${BASE_URL}owner/${username}`;

                const ownerResponse = await axios.get(ownerUrl, { headers });

                if (Array.isArray(ownerResponse.data)) {
                    const ownerOptions = ownerResponse.data.map((owner) => ({
                        label: owner.descrizione,
                        value: owner.id,
                    }));
                    setOwnerOptions(ownerOptions);
                }


                if (Array.isArray(responseAree.data)) {
                    for (const area of responseAree.data) {
                        // Header per l'area
                        groupedSkills.push({
                            label: area.descrizione,
                            value: `__header_${area.id}__`,
                            isHeader: true,
                        });

                        try {
                            // Skill per area
                            const responseSkillByArea = await axios.get(
                                `${BASE_URL}staffing/react/skill/${area.id}`,
                                { headers }
                            );

                            if (Array.isArray(responseSkillByArea.data)) {
                                const skills = responseSkillByArea.data.map(skill => ({
                                    label: skill.descrizione,
                                    value: skill.id,
                                }));
                                groupedSkills = [...groupedSkills, ...skills];
                            }
                        } catch (err) {
                            console.error(`Errore durante il recupero delle skill per l'area ${area.descrizione}:`, err);
                        }
                    }

                    setSkillsOptions(groupedSkills);
                }


                if (Array.isArray(responseAziende.data)) {
                    const ownerOptions = responseAziende.data.map((aziende) => ({
                        label: aziende.denominazione,
                        value: aziende.id,
                    }));
                    setAziendeOptions(ownerOptions);
                }

                if (Array.isArray(aziendaInternaResponse.data)) {
                    const aziendaInternaOptions = aziendaInternaResponse.data.map((aziendaInterna) => ({
                        value: aziendaInterna.id,
                        label: aziendaInterna.descrizione
                    }));
                    setAziendaInternaOptions(aziendaInternaOptions);
                } else {
                    const aziendaUtente = aziendaInternaResponse.data;
                    setAziendaInternaOptions([{
                        label: aziendaUtente.descrizione,
                        value: aziendaUtente.id
                    }]);
                }

            } catch (error) {
                console.error("Errore durante il recupero delle aziende:", error);
            }
            setLoading(false);

        };

        fetchNeedOptions();
    }, []);

    useEffect(() => {
        const fetchAziendaUtente = async () => {
            try {
                const userString = sessionStorage.getItem("user");
                if (!userString) return;

                const user = JSON.parse(userString);
                const username = user?.username;
                const headers = { Authorization: `Bearer ${user?.token}` };

                const response = await axios.get(`${BASE_URL}gestione/aziende/interne/${username}`, { headers });

                const aziendaUtente = response.data;
                if (aziendaUtente.descrizione?.toLowerCase().includes("challenging")) {
                    setIsChallengingUser(true);
                } else {
                    setIsChallengingUser(false);
                }
            } catch (error) {
                console.error("Errore durante il recupero dell'azienda utente:", error);
            }
        };

        fetchAziendaUtente();
    }, []);

    useEffect(() => {
        if (datiModifica.cliente && datiModifica.cliente.length !== 0) {
            const aziendaConId = datiModifica.cliente.id;
            fetchKeypeopleOptions(aziendaConId);
        }
    }, [datiModifica.cliente]);

    const fetchKeypeopleOptions = async (aziendaConId) => {
        try {

            const keypeopleResponse = await axios.get(`${BASE_URL}keypeople/react/azienda/${aziendaID}`, { headers: headers });

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
        { value: 2, label: 'Done' }
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



    const menu = [
        {
            title: t('Descrizione Need'),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t('Dettagli Need'),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t('Dettagli Ricerca e Selezione'),
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
                return ["idAziendaInterna", "idAzienda", "idKeyPeople"];
            case 1:
                return ["descrizione", "idStato", "priorita", "idTipologia", "dataRichiesta", "location", "idOwner", "idOwnerRecruiter"];
            case 2:
                return isChallengingUser ? ["pubblicazione", "screening"] : [];
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
                setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter avanzare') });
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
        idStato: "stato",
        idTipologia: "tipologia",
        idTipo: 'tipo'
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
                    if (key !== 'compilato' && !fieldObbligatori.includes(key) && !values[key]) {
                        values[key] = null;
                    }
                });

                const skills = values.idSkills ? values.idSkills.join(',') : '';
                delete values.idSkills;

                const transformedValues = replaceKeysInValues(values, fieldMapping);

                const userString = sessionStorage.getItem("user");
                const userObj = userString ? JSON.parse(userString) : null;

                if (values.toggleRicerca === undefined || values.toggleRicerca === null) {
                    values.toggleRicerca = false;
                }

                if (values.idNeedPadre !== null && values.compilato === false) {
                    values.compilato = true;
                }

                transformedValues.toggleRicerca = values.toggleRicerca;
                transformedValues.compilato = values.compilato ?? false; // per includere il campo "compilato" nel body inviato al backend

                const responseSaveNeed = await axios.post(
                    `${BASE_URL}need/react/salva`,
                    transformedValues,
                    {
                        params: {
                            skill1: skills,
                            username: userObj?.username || null
                        },
                        headers: headers
                    }
                );

                if (responseSaveNeed.data === "ERRORE") {
                    setAlert({ open: true, message: t("errore durante il salvataggio del need!") });
                    console.error("Il need non è stato salvato.");
                    return;
                }

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
            } catch (error) {
                console.error("Errore durante il salvataggio", error);
            }
        } else {
            setErrors(errors);
            setAlert({ open: true, message: t("Compilare tutti i field obbligatori presenti prima di avanzare") });
        }
    };

    const fieldObbligatori = ["idAziendaInterna", "idAzienda", "priorita", "descrizione", "dataRichiesta", "pubblicazione", "screening", "idTipologia", "stato", "idOwner", "location", "idOwnerRecruiter"];

    const fields = [
        { type: "titleGroups", label: t("Dettagli Business") },
        { label: t("Società Owner*"), name: "idAziendaInterna", type: "select", options: aziendaInternaOptions },
        { label: t("Cliente*"), name: "idAzienda", type: "select", options: aziendeOptions },
        {
            label: t("Tipo Azienda"), name: "idTipo", type: "select", options: [
                { value: 1, label: t("Cliente") },
                { value: 2, label: t("Consulenza") },
                { value: 3, label: t("Prospect") }
            ]
        },
        { label: t("Contatto*"), name: "idKeyPeople", type: "select", options: keyPeopleOptions },

        // Sezione Dettagli Need
        { type: "titleGroups", label: t("Dettagli Need") },
        { label: t("Descrizione Need*"), name: "descrizione", type: "text", maxLength: 200 },
        { label: t("Stato Need*"), name: "idStato", type: "select", options: statoOptions },
        {
            label: t("Priorità*"), name: "priorita", type: "select", options: [
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" }
            ]
        },
        { label: t("Tipo Need*"), name: "idTipologia", type: "select", options: tipologiaOptions },
        { label: "Data apertura Need*", name: "dataRichiesta", type: "date" },
        { label: "Location*", name: "location", type: "text", maxLength: 45 },
        {
            label: "Delivery Model", name: "deliveryModel", type: "select", options: [
                { value: "Product", label: "Product" },
                { value: "Outsourcing", label: "Outsourcing" },
                { value: "Service", label: "Service" },
                { value: "Project", label: "Project" },
                { value: "Task", label: "Task" },
                { value: "Time&Material", label: "Time & Material" }
            ]
        },
        { label: "Valore economico potenziale", name: "valorePotenziale", type: "number" },
        { label: t("Note"), name: "note", type: "note", maxLength: 4000 },
        { label: t("Business Owner*"), name: "idOwner", type: "select", options: ownerOptions },
        { label: t("Owner Operativo*"), name: "idOwnerRecruiter", type: "select", options: ownerOptions },

        // Sezione Dettagli Ricerca e Selezione
        // Modalità A: solo Challenging
        { type: "titleGroups", label: t("Dettagli Ricerca e Selezione") },
        { label: "Headcount", name: "numeroRisorse", type: "number", visibleIf: () => isChallengingUser },
        { label: "Seniority", name: "anniEsperienza", type: "select", options: seniorityOptions, visibleIf: () => isChallengingUser },
        { label: "Skills", name: "idSkills", type: "multipleSelect", options: skillsOptions, visibleIf: () => isChallengingUser },
        { label: t('Pubblicazione Annuncio*'), name: 'pubblicazione', type: 'select', options: pubblicazioneOptions, visibleIf: () => isChallengingUser },
        { label: t('Screening*'), name: 'screening', type: 'select', options: screeningOptions, visibleIf: () => isChallengingUser },
        { label: t("Note"), name: "noteRicercaToggle", type: "note", visibleIf: () => isChallengingUser },

        // Modalità B: tutti gli altri
        { label: "Richiede ricerca e selezione?", name: "toggleRicerca", type: "toggle", visibleIf: () => !isChallengingUser },
        { label: "Note di ricerca e selezione", name: "noteRicercaToggle", type: "note", visibleIf: () => !isChallengingUser && values.toggleRicerca },
    ];

    const initialValues = {
        id: datiModifica?.id || null,
        idAzienda: datiModifica?.cliente?.id,
        idAziendaInterna: (datiModifica?.aziendaInterna && datiModifica.aziendaInterna.id) || null,
        descrizione: datiModifica?.descrizione || null,
        idKeyPeople: (datiModifica?.keyPeople && datiModifica?.keyPeople?.id) || null,
        priorita: datiModifica?.priorita || null,
        dataRichiesta: datiModifica?.dataRichiesta || null,
        idTipologia: (datiModifica?.tipologia && datiModifica?.tipologia?.id) || null,
        idTipo: datiModifica?.tipo || null,
        deliveryModel: datiModifica?.deliveryModel || null,
        valorePotenziale: datiModifica?.valorePotenziale || null,
        idOwner: (datiModifica?.ownerBusiness && datiModifica?.ownerBusiness?.id) || null,
        idOwnerRecruiter: (datiModifica?.ownerRecruiter && datiModifica?.ownerRecruiter?.id) || null,

        idStato: (datiModifica?.stato && datiModifica?.stato?.id) || null,
        numeroRisorse: datiModifica?.numeroRisorse || null,
        location: datiModifica?.location || null,
        idSkills: datiModifica?.skills ? datiModifica.skills.map((skills) => skills?.id) : [],
        anniEsperienza: datiModifica?.anniEsperienza || null,
        pubblicazione: datiModifica?.pubblicazione || null,
        screening: datiModifica?.screening || null,
        note: datiModifica?.note || null,
        toggleRicerca: datiModifica?.toggleRicerca ? true : false,
        noteRicercaToggle: datiModifica?.noteRicercaToggle || null,
        compilato: datiModifica?.compilato || false,
        idNeedPadre: datiModifica?.idNeedPadre || null,
    };




    //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
    useEffect(() => {
        if (Object.keys(datiModifica).length !== 0) {
            const updatedvalues = { ...initialValues };

            Object.keys(datiModifica).forEach(key => {
                if (initialValues.hasOwnProperty(key) && key !== 'compilato') {
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

                case 'toggle':
                    return (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!values[field.name]}
                                    onChange={(e) => handleChange({ [field.name]: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label={field.label}
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
                        if (field.visibleIf && !field.visibleIf(values)) {
                            return null;
                        }
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
        <Container
                maxWidth={false}
                disableGutters
                sx={{
                display: "flex",
                backgroundColor: "#EEEDEE",
                maxHeight: "100dvh",
                width: "100%",
                overflowX: "hidden",
                }}
            >
                {/* WRAPPER */}
                <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    width: "100%",
                    flexDirection: "row",
                    mt: "0.5em",
                    mb: 2,
                    mr: "0.8em",
                    ml: isSmallScreen ? "3.5em" : "12.8em",
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "margin-left 0.3s ease",
                }}
                >
                {/* SIDEBAR */}
                <Box
                    sx={{
                    width: { xs: "70px", sm: "150px", md: "220px", lg: "280px" },
                    background: theme.palette.aggiungiSidebar.bg,
                    p: 2,
                    borderRadius: "20px 0px 0px 20px",
                    transition: "width 0.3s ease",
                    position: "sticky",
                    top: 0,
                    alignSelf: "flex-start",
                    height: "100dvh",
                    overflow: "hidden",
                    flexShrink: 0,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                        <Button
                            onClick={handleGoBack}
                            sx={{
                                color: theme.palette.textButton.main,
                                border: 'none',
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
                            <span style={{ marginRight: '0.5em' }}>{"<"}</span>
                            {t('Indietro')}
                        </Button>
                    </Box>
                    <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: { xs: "1.2em", sm: "1.5em", md: "1.8em" }, transition: 'fontSize 0.3s ease', color: theme.palette.aggiungiSidebar.title }}>  {t('Modifica')} <br /> {t('Need')} </Typography>
                    <List sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {menu.map((item, index) => (
                            <ListItem
                                key={item.title}
                                selected={activeSection === item.title}
                                onClick={() => handleMenuItemClick(item.title, index)}
                                sx={{
                                    mb: 4,
                                    cursor: sectionCompleted[index] ? "pointer" : "not-allowed",
                                    "&.Mui-selected, &:hover": {
                                    backgroundColor: sectionCompleted[index]
                                        ? theme.palette.aggiungiSidebar.hover
                                        : theme.palette.aggiungiSidebar.hover,
                                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                                        color: sectionCompleted[index]
                                        ? theme.palette.aggiungiSidebar.textHover
                                        : theme.palette.aggiungiSidebar.textHover,
                                    },
                                    borderRadius: "10px",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: theme.palette.aggiungiSidebar.text, mr: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 }, display: { xs: 'none', sm: 'none', md: 'block' }, }}>
                                    {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} sx={{ color: theme.palette.aggiungiSidebar.text, fontSize: { xs: "0.7em", sm: "0.8em", md: "1em" }, ml: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 } }} />
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
                        minHeight: "100dvh",
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3 }}>
                        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={TransitionDown}>
                            <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                                {alert.message}
                            </Alert>
                        </Snackbar>
                        <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.8' }}>{datiModifica.descrizione}</Typography>
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
                    <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16 }}>{t('* Campo Obbligatorio')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' } }}>
                        {currentPageIndex > 0 && (
                            <Button onClick={handleBackButtonClick}
                                sx={{
                                    mb: 6,
                                    minWidth: { xs: 120, sm: 140, md: 170, lg: 170 },
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "10px",
                                    fontSize: { xs: "0.75em", sm: "0.85em", md: "0.95em" },
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                        transform: "scale(1.05)",
                                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "10px",
                                    },
                                }}>
                                {t('Indietro')}
                            </Button>
                        )}
                        {currentPageIndex < groupedFields.length - 1 && (
                            <Button onClick={handleNextButtonClick}
                                sx={{
                                    mb: 6,
                                    minWidth: { xs: 120, sm: 140, md: 170, lg: 170 },
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "bold",
                                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "10px",
                                    fontSize: { xs: "0.75em", sm: "0.85em", md: "0.95em" },
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                        transform: "scale(1.05)",
                                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                                        borderRadius: "10px",
                                    },
                                }}>{t('Avanti')}</Button>
                        )}
                        {currentPageIndex === groupedFields.length - 1 && (
                            <Button
                                onClick={() => handleSubmit(values)}
                                type="submit"
                                sx={{
                                    mb: 6,
                                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%' },
                                    backgroundColor: theme.palette.button.main,
                                    color: theme.palette.textButton.white,
                                    fontWeight: "bold",
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                                    "&:hover": {
                                        backgroundColor: theme.palette.button.mainHover,
                                        color: theme.palette.textButton.white,
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

export default ModificaNeedGrafica;