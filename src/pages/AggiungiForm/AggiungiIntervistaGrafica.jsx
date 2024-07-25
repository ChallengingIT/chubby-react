    import React, { useState, useEffect }                       from "react";
    import { useNavigate, useLocation }                         from "react-router-dom";
    import CircleOutlinedIcon                                   from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
    import axios                                                from "axios";
    import CustomAutocomplete                                   from "../../components/fields/CustomAutocomplete";
    import CustomNoteAggiungi                                   from "../../components/fields/CustomNoteAggiungi";
    import CustomDecimalNumberAggiungi                          from "../../components/fields/CustomDecimalNumberAggiungi";
    import CustomTextFieldModifica                              from "../../components/fields/CustomTextFieldModifica";
    import CustomDatePickerHoursAggiungi                        from "../../components/fields/CustomDatePickerHoursAggiungi";
    import CustomDatePickerModifica                             from "../../components/fields/CustomDatePickerModifica";
    import CheckCircleIcon                                      from "@mui/icons-material/CheckCircle";
    import { useTranslation }                                   from 'react-i18next';

    import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Skeleton,
    Snackbar,
    Grid,
    Slide,
    Container
    } from "@mui/material";

    const AggiungiIntervistaGrafica = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const candidatoID = location.state?.candidatoID;
    const { t } = useTranslation();


    //stati della pagina
    const [ activeSection,                      setActiveSection            ] = useState(t("Informazioni"));
    const [ currentPageIndex,                   setCurrentPageIndex         ] = useState(0);
    const [ alert,                              setAlert                    ] = useState({ open: false, message: "" });
    const [ errors,                             setErrors                   ] = useState({});
    const [ loading,                            setLoading                  ] = useState(true);

    //stati per i valori
    const [ statoOptions,                       setStatoOptions             ] = useState([]); //tipologiaIncontro
    const [ ownerOptions,                       setOwnerOptions             ] = useState([]);
    const [ tipoIntervistaOptions,              setTipoIntervistaOptions    ] = useState([]); //follow up
    const [ interviste,                         setInterviste               ] = useState([]);
    const [ candidato,                          setCandidato                ] = useState([]);
    const [ values,                             setValues                   ] = useState([]);
    const [ statoCaricato,                      setStatoCaricato            ] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchData = async () => {
        const paginazione = {
            pagina: 0,
            quantita: 10,
        };
        try {
            //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
            const ownerResponse = await axios.get(
            "http://89.46.196.60:8443/owner",
            { headers: headers }
            );
            const responseTipoIntervista = await axios.get(
            "http://89.46.196.60:8443/intervista/react/tipointervista",
            { headers: headers }
            );
            const responseIntervista = await axios.get(
            `http://89.46.196.60:8443/intervista/react/mod/${candidatoID}`,
            { headers: headers, params: paginazione }
            ); //questa è la lista delle interviste di cui devo prendere sempre l'ultima
            const responseCandidato = await axios.get(
            `http://89.46.196.60:8443/staffing/react/${candidatoID}`,
            { headers: headers }
            ); //questo è il candidato
            const responseStato = await axios.get(
            "http://89.46.196.60:8443/staffing/react/stato/candidato",
            { headers: headers }
            );

            if (
            responseIntervista.data &&
            typeof responseIntervista.data === "object"
            ) {
            const intervisteData = responseIntervista.data.interviste;
            if (Array.isArray(intervisteData) && intervisteData.length > 0) {
                // Prendo l'ultima intervista per data
                const ultimaIntervista = intervisteData[intervisteData.length - 1];
                setInterviste(ultimaIntervista);
            } else if (intervisteData.length === 0) {
            } else {
                console.error(
                "I dati ottenuti da intervista non sono nel formato Array:",
                intervisteData
                );
            }
            } else {
            console.error(
                "I dati ottenuti non sono un oggetto valido:",
                responseIntervista.data
            );
            }

            if (Array.isArray(responseTipoIntervista.data)) {
            const tipoIntervistaOptions = responseTipoIntervista.data.map(
                (tipoIntervista) => ({
                label: tipoIntervista.descrizione,
                value: tipoIntervista.id,
                })
            );
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

            if (
            responseCandidato.data &&
            typeof responseCandidato.data === "object"
            ) {
            setCandidato(responseCandidato.data);
            setStatoCaricato(true);
            }

            setLoading(false);
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };

        fetchData();
    }, []);

    const menu = [
        {
        title: t("Informazioni"),
        icon: <CircleOutlinedIcon />,
        },
        {
        title: t("Competenze"),
        icon: <CircleOutlinedIcon />,
        },
        {
        title: t("Info Contrattuali"),
        icon: <CircleOutlinedIcon />,
        },
        {
        title: t("Azioni"),
        icon: <CircleOutlinedIcon />,
        },
    ];

    //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
    const [sectionCompleted, setSectionCompleted] = useState(
        new Array(menu.length).fill(false)
    );

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

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return ["dataColloquio"];
        case 1:
            return [];
        case 2:
            return [];
        default:
            return [];
        }
    };

    //funzione per la validazione dei field
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = t("Questo campo è obbligatorio");
        }
        });
        return errors;
    };

    // Funzione per il cambio stato degli input
    const handleChange = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
    };

    //funzioni per cambiare pagina del form
    const handleBackButtonClick = () => {
        const currentIndex = menu.findIndex(
        (item) => item.title.toLowerCase() === activeSection.toLowerCase()
        );
        if (currentIndex > 0) {
        setActiveSection(menu[currentIndex - 1].title);
        setCurrentPageIndex(currentIndex - 1);
        }
    };

    const handleNextButtonClick = () => {
        const currentIndex = menu.findIndex(
        (item) => item.title.toLowerCase() === activeSection.toLowerCase()
        );
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
        setAlert({
            open: true,
            message:
            t("Compilare tutti i campi obbligatori presenti per poter avanzare"),
        });
        }
    };

    //funzione per la chiusura dell'alert
    const handleCloseAlert = (reason) => {
        if (reason === "clickaway") {
        return;
        }
        setAlert({ ...alert, open: false });
    };

    //funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    //funzione per il salvataggio
    const handleSubmit = async (values) => {
        const currentIndex = menu.findIndex(
        (item) => item.title.toLowerCase() === activeSection.toLowerCase()
        );
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;

        if (!hasErrors) {
        try {
            Object.keys(values).forEach((key) => {
            if (!campiObbligatori.includes(key) && !values[key]) {
                values[key] = null;
            }
            });

            const note = values.note;
            const modifica = 0;
            const response = await axios.post(
            "http://89.46.196.60:8443/intervista/react/salva",
            values,
            {
                params: {
                idCandidato: candidatoID,
                note: note,
                modifica: modifica,
                },
                headers: headers,
            }
            );
            if (response.data === "ERRORE") {
            setAlert({
                open: true,
                message: t("errore durante il salvataggio dell'intervista!"),
            });
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

    const campiObbligatori = ["dataColloquio, coerenza, standing, energia, comunicazione, inglese, competenze, valutazione, descrizioneCandidatoUna, teamSiNo"];

    const fields = [
        { type: "titleGroups", label: t("Informazioni") },
        { label: t("Data Incontro*"),              name: "dataColloquio",              type: "date"                                       },
        { label: t("Intervistatore"),              name: "idOwner",                    type: "select",             options: ownerOptions, },
        // { label: "Tipologia Incontro",          name: "stato",                      type: "text"                                       },
        { label: t("Nome"),                        name: "nome",                       type: "text"                                       },
        { label: t("Cognome"),                     name: "cognome",                    type: "text"                                       },
        { label: t("Data Di Nascita"),             name: "dataNascita",                type: "date"                                       },
        { label: t("Location"),                    name: "location",                   type: "text"                                       },
        { label: t("Job Title"),                   name: "tipologia",                  type: "text"                                       },
        { label: t("Anni Di Esperienza"),          name: "anniEsperienza",             type: "text"                                       },
        { label: t("Recapiti"),                    name: "cellulare",                  type: "text"                                       },
        { label: t("Descrizione Candidato"),       name: "note",                       type: "note",                maxLength: 8000,      },

        { type: "titleGroups", label: t("Competenze") },
        { label: t("Coerenza Percorso"),           name: "coerenza",                   type: "select",             options: valoriOptions  },
        { label: t("Standing"),                    name: "standing",                   type: "select",             options: valoriOptions  },
        { label: t("Energia"),                     name: "energia",                    type: "select",             options: valoriOptions  },
        { label: t("Comunicazione"),               name: "comunicazione",              type: "select",             options: valoriOptions  },
        { label: t("Livello Di Inglese"),          name: "inglese",                    type: "select",             options: valoriOptions  },
        { label: t("Competenze vs ruolo"),         name: "competenze",                 type: "select",             options: valoriOptions  },
        { label: t("Valutazione"),                 name: "valutazione",                type: "select",             options: valoriOptions  },
        { label: t("One word"),                    name: "descrizioneCandidatoUna",    type: "text",               maxLength: 45,          },
        { label: t("Lo vorresti nel tuo team?"),   name: "teamSiNo",                   type: "select",             options: siNoOptions    },

        { type: "titleGroups", label: t("Info Contrattuali") },
        { label: t("Disponibilità"),               name: "disponibilita",              type: "text",               maxLength: 45,          },
        { label: t("RAL Attuale"),                 name: "attuale",                    type: "text",               maxLength: 90           },
        { label: t("RAL Desiderata"),              name: "desiderata",                 type: "text",               maxLength: 90,          },
        { label: t("Proposta Economica"),          name: "proposta",                   type: "text",               maxLength: 90,          },

        { type: "titleGroups", label: t("Azioni") },
        { label: t("Follow Up"),                   name: "tipo",                       type: "select",             options: tipoIntervistaOptions, },
        { label: t("Preavviso"),                   name: "preavviso",                  type: "text",               maxLength: 45                   },
        { label: t("Next Deadline"),               name: "dataAggiornamento",          type: "dateOra"                                             },
        { label: t("Owner next Deadline"),         name: "idNextOwner",                type: "select",             options: ownerOptions,          },
    ];

    const initialValues = {
        stato:                      (candidato.stato && candidato.stato.descrizione) || null,
        nome:                        candidato?.nome                                 || null,
        cognome:                     candidato.cognome                               || null,
        dataNascita:                 candidato.dataNascita                           || null,
        location:                    candidato.citta                                 || null,
        // tipologia:                   candidato.tipologia?.descrizione                || null,
        anniEsperienza:              candidato.anniEsperienza                        || null,
        cellulare:                   candidato.cellulare                             || null,
        idOwner:                     interviste.owner?.id                            || null,
        aderenza:                    interviste.aderenza                             || null,
        coerenza:                    interviste.coerenza                             || null,
        motivazione:                 interviste.motivazione                          || null,
        standing:                    interviste.standing                             || null,
        energia:                     interviste.energia                              || null,
        comunicazione:               interviste.comunicazione                        || null,
        inglese:                     interviste.inglese                              || null,
        competenze:                  interviste.competenze                           || null,
        valutazione:                 interviste.valutazione                          || null,
        descrizioneCandidatoUna:     interviste.descrizioneCandidatoUna              || null,
        teamSiNo:                    interviste.teamSiNo                             || null,
        note:                        interviste.note                                 || null,
        disponibilita:               interviste.disponibilita                        || null,
        attuale:                     interviste.attuale                              || null,
        desiderata:                  interviste.desiderata                           || null,
        proposta:                    interviste.proposta                             || null,
        tipo:                        interviste.tipo?.id                             || null,
        preavviso:                   interviste.preavviso                            || null,
        dataAggiornamento:           interviste.dataAggiornamento                    || null,
        idNextOwner:                 interviste.nextOwner?.id                        || null,
    };

    const disableFields = {
        nome:           true,
        cognome:        true,
        dataNascita:    true,
        tipologia:      true,
        location:       true,
        anniEsperienza: true,
        cellulare:      true,
        stato:          true,
    };

    //funzione per suddividere fields nelle varie pagine in base a titleGroups
    const groupFields = (fields) => {
        const groupedFields = [];
        let currentGroup = [];
        fields.forEach((field) => {
        if (field.type === "titleGroups") {
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
        case "text":
            return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

        case "date":
            return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

        case "decimalNumber":
            return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

        case "select":
        case "multipleSelect":
            return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

        case "note":
            return <Skeleton variant="text" width={710} height={120} />;
        default:
            return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;
        }
    };

    //funzione per richiamare i vari field
    const renderFields = (field) => {
        if (!statoCaricato) {
        return renderFieldSkeleton(field.type);
        } else {
        const { type, ...otherProps } = field;
        // const errorMessage = errors[field.name];

        switch (type) {
            case "text":
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

            case "note":
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

            case "select":
            return (
                <CustomAutocomplete
                name={field.name}
                label={field.label}
                options={field.options || []}
                value={values[field.name] || null}
                // value={initialValues.stato}
                onChange={handleChange}
                getOptionSelected={(option, value) =>
                    option.value === value.value
                }
                />
            );

            case "date":
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

            case "dateOra":
            return (
                <CustomDatePickerHoursAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                />
            );

            case "number":
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
        <Container maxWidth="false"
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            height: "100vh",
            width: "100vw",
            flexDirection: "row",
        }}
        >
        <Box
            sx={{
            display: "flex",
            height: "98%",
            width: "100vw",
            flexDirection: "row",
            ml: "12.5em",
            mt: "0.5em",
            mb: "0.5em",
            mr: "0.8em",
            borderRadius: "20px",
            overflow: "hidden",
            }}
        >
            <Box
            sx={{
                width: "280px",
                height: "98%",
                background: "#00B400",
                p: 2,
                overflow: "hidden",
                position: "fixed",
                borderRadius: "20px 0px 0px 20px",
            }}
            >
            <Box
                sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                }}
            >
                <Button
                onClick={handleGoBack}
                sx={{
                    color: "#EDEDED",
                    border: "none",
                    fontSize: "0.8em",
                    cursor: "pointer",
                    outline: "none",
                    borderRadius: "10px",
                    mt: 4,
                    ml: 2,
                    "&:hover": {
                    color: "black",
                    },
                }}
                >
                <span style={{ marginRight: "0.5em" }}>{"<"}</span>
                Indietro
                </Button>
            </Box>
            <Typography
                variant="h6"
                sx={{
                display: "flex",
                justifyContent: "flex-start",
                fontWeight: "bold",
                mt: 4,
                ml: 3,
                mb: 8,
                fontSize: "1.8em",
                color: "black",
                }}
            >
                {" "}
                {t("Aggiungi")} <br /> {t("Intervista")}
                </Typography>
            <List
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
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
                    cursor: sectionCompleted[index] ? "pointer" : "not-allowed",
                    "&.Mui-selected, &:hover": {
                        backgroundColor: sectionCompleted[index]
                        ? "black"
                        : "black",
                        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color: sectionCompleted[index] ? "#EDEDED" : "#EDEDED",
                        },
                        borderRadius: "10px",
                    },
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
            <Box
            sx={{
                flexGrow: 1,
                height: "100%",
                background: "#FEFCFD",
                display: "flex",
                flexDirection: "column",
                ml: "280px",
            }}
            >
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                mb: 3,
                }}
            >
                <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                >
                <Alert
                    onClose={handleCloseAlert}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {alert.message}
                </Alert>
                </Snackbar>
                <Typography
                variant="h4"
                component="h1"
                sx={{ mt: 1, fontWeight: "bold", fontSize: "1.8" }}
                >
                {activeSection}
                </Typography>
            </Box>
            <Box
                sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                pl: 5,
                pr: 5,
                overflow: "auto",
                }}
            >
                {renderFieldsGroups(groupedFields)}
            </Box>
            <Typography
                variant="h6"
                sx={{ mt: 2, color: "#666565", fontSize: "1em", ml: 16 }}
            >
                {t('* Campo Obbligatorio')}
                </Typography>
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 5,
                gap: 6,
                }}
            >
                {currentPageIndex > 0 && (
                <Button
                    onClick={handleBackButtonClick}
                    sx={{
                    mb: 4,
                    width: "250px",
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    "&:hover": {
                        backgroundColor: "black",
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    {t('Indietro')}
                    </Button>
                )}
                {currentPageIndex < groupedFields.length - 1 && (
                <Button
                    onClick={handleNextButtonClick}
                    sx={{
                    mb: 4,
                    width: "250px",
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",

                    "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    {t('Avanti')}
                    </Button>
                )}
                {currentPageIndex === groupedFields.length - 1 && (
                <Button
                    onClick={() => handleSubmit(values)}
                    type="submit"
                    sx={{
                    mb: 4,
                    width: "250px",
                    backgroundColor: "#00B400",
                    color: "#EDEDED",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",

                    "&:hover": {
                        backgroundColor: "#019301",
                        color: "#EDEDED",
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    {t('Salva')}
                    </Button>
                )}
            </Box>
            </Box>
        </Box>
        </Container>
    );
    };

    export default AggiungiIntervistaGrafica;
