    import React, { useState, useEffect }                       from "react";
    import { useNavigate, useLocation, useParams }              from "react-router-dom";
    import axios                                                from "axios";
    import CircleOutlinedIcon                                   from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
    import CustomAutocomplete                                   from "../../components/fields/CustomAutocomplete";
    import CustomTextFieldAggiungi                              from "../../components/fields/CustomTextFieldAggiungi";
    import CustomNoteAggiungi                                   from "../../components/fields/CustomNoteAggiungi";
    import CustomDatePickerAggiungi                             from "../../components/fields/CustomDatePickerAggiungi";
    import CustomDecimalNumberAggiungi                          from "../../components/fields/CustomDecimalNumberAggiungi";
    import CustomMultipleSelectAggiunta                         from "../../components/fields/CustomMultipleSelectAggiunta";
    import CustomWeekDateAggiungi                               from "../../components/fields/CustomWeekDateAggiungi";
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
import CustomNumberAggiunta from "../../components/fields/CustomNumberAggiunta";
import { useUserTheme } from "../../components/TorchyThemeProvider";

    const AggiungiNeedIDGragica = () => {
    const theme = useUserTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const idAzienda = id;


    //stati della pagina
    const [ activeSection,                  setActiveSection                ] = useState("Descrizione Need");
    const [ currentPageIndex,               setCurrentPageIndex             ] = useState(0);
    const [ alert,                          setAlert                        ] = useState({ open: false, message: "" });
    const [ errors,                         setErrors                       ] = useState({});
    const [ loading,                        setLoading                      ] = useState(true);

    const [ aziendeOptions,                 setAziendeOptions               ] = useState([]);
    const [ skillsOptions,                  setSkillsOptions                ] = useState([]);
    const [ ownerOptions,                   setOwnerOptions                 ] = useState([]);
    const [ tipologiaOptions,               setTipologiaOptions             ] = useState([]);
    const [ statoOptions,                   setStatoOptions                 ] = useState([]);
    const [ keypeopleOptions,               setKeypeopleOptions             ] = useState([]);


    const [values, setValues] = useState({ idAzienda });
    // Recupera l'token da sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    // Configura gli headers della richiesta con l'Authorization token
    const headers = {
        Authorization: `Bearer ${token}`,
    };


    useEffect(() => {
        const fetchNeedOptions = async () => {
        try {
            const responseAziende = await axios.get(
            `http://89.46.196.60:8443/aziende/react/${id}`,
            { headers: headers }
            );
            const responseSkill = await axios.get(
            "http://89.46.196.60:8443/staffing/react/skill",
            { headers: headers }
            );
            const ownerResponse = await axios.get(
            "http://89.46.196.60:8443/owner",
            { headers: headers }
            );
            const tipologiaResponse = await axios.get(
            "http://89.46.196.60:8443/need/react/tipologia",
            { headers: headers }
            );
            const statoResponse = await axios.get(
            "http://89.46.196.60:8443/need/react/stato",
            { headers: headers }
            );
            const responseKeypeople = await axios.get(
                `http://89.46.196.60:8443/keypeople/react/azienda/${idAzienda}`,
                { headers: headers }
            );
            const keypeopleOptions = responseKeypeople.data.map((keypeople) => ({
                value: keypeople.id,
                label: keypeople.nome,
            }));
            setKeypeopleOptions(keypeopleOptions);

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
                label: skill.descrizione,
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
        { value: 1, label: "To Do" },
        { value: 2, label: "Done" },
    ];

    const screeningOptions = [
        { value: 1, label: "To Do" },
        { value: 2, label: "In progress" },
        { value: 3, label: "Done" },
    ];

    const menu = [
        {
        title: "Descrizione Need",
        icon: <CircleOutlinedIcon />,
        },
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per fieldre quali field sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return [
                "descrizione",
                "idKeyPeople",
                "priorita",
                "week",
                "tipologia",
                "idOwner",
                "stato",
                "location",
                "pubblicazione",
                "screening",
            ];

        default:
            return [];
        }
    };

    //funzione per la validazione dei field
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = "Questo campo è obbligatorio";
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

    //funzione per il cambio stato delle skill
    const handleChangeSkill = (fieldValue) => {
        const fieldName = Object.keys(fieldValue)[0];
        const newValues = fieldValue[fieldName];

        setValues((prevValues) => ({
        ...prevValues,
        [fieldName]: [...newValues],
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
        if (currentIndex < menu.length - 1) {
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;

        if (!hasErrors) {
            setActiveSection(menu[currentIndex + 1].title);
            setCurrentPageIndex(currentIndex + 1);
        } else {
            setAlert({
            open: true,
            message:
                "Compilare tutti i field obbligatori presenti per poter avanzare",
            });
        }
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
            if (!fieldObbligatori.includes(key) && !values[key]) {
                values[key] = null;
            }
            });

            const skills = values.idSkills ? values.idSkills.join(",") : "";

            delete values.idSkills;

            const responseSaveNeed = await axios.post(
            "http://89.46.196.60:8443/need/react/salva",
            { ...values, idAzienda: parseInt(values.idAzienda, 10) }, 
            { params: { skill1: skills }, headers: headers }
            );
            if (responseSaveNeed.data === "ERRORE") {
                setAlert({ open: true, message: "errore durante il salvataggio del need!" });
                console.error("Il need non è stata salvata.");
                return;
            }
            const userString = sessionStorage.getItem("user");
            if (userString) {
                const userObj = JSON.parse(userString);
                if (userObj.roles.includes("ROLE_BUSINESS")) {
                    navigate(`/need/${idAzienda}`);
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
        setAlert({
            open: true,
            message:
            "Compilare tutti i field obbligatori presenti prima di avanzare",
        });
        }
    };

    const fieldObbligatori = [
        "descrizione",
        "idKeyPeople",
        "priorita",
        "week",
        "tipologia",
        "idOwner",
        "stato",
        "location",
        "pubblicazione",
        "screening",
    ];

    const fields = [
        { label: "Descrizione Need*",   name: "descrizione",                  type: "text", maxLength: 200                                                },
            { label: "Contatto*",           name: "idKeyPeople",                  type: "select",               options: keypeopleOptions     },
            // { label: "Priorità*",           name: "priorita",                     type: "decimalNumber"                                       },
            { label: "Priorità*",              name: "priorita",                          type: "select",               options: [
                { value: 1,                   label: "Massima" },
                { value: 2,                   label: "Alta" },
                { value: 3,                   label: "Media" },
                { value: 4,                   label: "Bassa" } 
                ] },
            { label: "Week*",               name: "week",                         type: "week"                                                },
            { label: "Tipologia*",          name: "tipologia",                  type: "select",               options: tipologiaOptions     },
            { label: "Tipologia Azienda",   name: "tipo",                         type: "select",               options: [
            { value: 1,                   label: "Cliente" },
            { value: 2,                   label: "Consulenza" },
            { value: 3,                   label: "Prospect" }
            ] },
            { label: "Owner*",                    name: "idOwner",                     type: "select",                 options: ownerOptions         },
            { label: "Stato*",                    name: "stato",                     type: "select",                 options: statoOptions         },
            { label: "Headcount",                 name: "numeroRisorse",               type: "number"                                         },
            { label: "Location*",                 name: "location",                    type: "text", maxLength: 45                                                  },
            { label: "Skills",                    name: "idSkills",                    type: "multipleSelect",         options: skillsOptions        },
            { label: "Seniority",                 name: "anniEsperienza",              type: "decimalNumber"                                         },
            { label: 'Pubblicazione Annuncio*',   name: 'pubblicazione',               type: 'select',                 options: pubblicazioneOptions },
            { label: 'Screening*',                name: 'screening',                   type: 'select',                 options: screeningOptions     },
            { label: "Note",                      name: "note",                        type: "note", maxLength:4000                                                  },
            ];

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
        if (loading) {
        return renderFieldSkeleton(field.type);
        } else {
        const { type, ...otherProps } = field;
        // const errorMessage = errors[field.name];

        switch (type) {
            // case "text":
            // if (field.name === "denominazione") {
            //     return (
            //     <CustomTextFieldModifica
            //         name={field.name}
            //         label={field.label}
            //         type={field.type}
            //         values={values}
            //         onChange={handleChange}
            //         initialValues={initialValues}
            //         disabled={disabledFields.includes(field.name)}
            //         maxLength={field.maxLength}
            //     />
            //     );
            // } else {
            //     return (
            //     <CustomTextFieldAggiungi
            //         name={field.name}
            //         label={field.label}
            //         type={field.type}
            //         values={values}
            //         onChange={handleChange}
            //         maxLength={field.maxLength}

            //     />
            //     );
            // }

            case "text":
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
            if (field.name === "idKeyPeople") {
                return (
                <CustomAutocomplete
                    name={field.name}
                    label={field.label}
                    options={field.options}
                    value={values[field.name] || null}
                    onChange={handleChange}
                    getOptionSelected={(option, value) =>
                    option.value === value.value
                    }
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
                    getOptionSelected={(option, value) =>
                    option.value === value.value
                    }
                />
                );
            }

            case "week":
            return (
                <CustomWeekDateAggiungi
                name={field.name}
                label={field.label}
                values={values}
                onChange={handleChange}
                />
            );

            case "date":
            return (
                <CustomDatePickerAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                />
            );

            case "decimalNumber":
            return (
                <CustomDecimalNumberAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                />
            );


            case "number":
            return (
                <CustomNumberAggiunta
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                />
            );

            case "multipleSelect":
            return (
                <CustomMultipleSelectAggiunta
                name={field.name}
                label={field.label}
                options={field.options}
                value={values[field.name] || null}
                onChange={handleChangeSkill}
                getOptionSelected={(option, value) =>
                    option.value === value.value
                }
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
        <Box sx={{ ml: 15, mr: 15 }}>
            <Grid container spacing={2}>
            {groupedFields[currentPageIndex].map((field, index) => {
                if (field.type === "titleGroups") {
                return (
                    <Grid item xs={12} key={index}>
                    </Grid>
                );
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
                background: theme.palette.aggiungiSidebar.bg,
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
                    color: theme.palette.textButton.main,
                    border: "none",
                    fontSize: "0.8em",
                    cursor: "pointer",
                    outline: "none",
                    borderRadius: "10px",
                    mt: 4,
                    ml: 2,
                    "&:hover": {
                        color: theme.palette.textButton.main,
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
                color: theme.palette.aggiungiSidebar.title
                }}
            >
                {" "}
                Aggiungi <br /> Need{" "}
            </Typography>
            <List
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
                {menu.map((item) => (
                <ListItem
                    key={item.title}
                    selected={activeSection === item.title}
                    sx={{
                    mb: 4,
                    "&.Mui-selected": {
                        backgroundColor:
                        activeSection === item.title ? theme.palette.aggiungiSidebar.hover : theme.palette.aggiungiSidebar.hover,
                        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color:
                            activeSection === item.title ? theme.palette.aggiungiSidebar.textHover : theme.palette.aggiungiSidebar.textHover,
                        },
                        borderRadius: "10px",
                    },
                    }}
                >
                    <ListItemIcon sx={{ color: theme.palette.aggiungiSidebar.text }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} sx={{ color: theme.palette.aggiungiSidebar.text }}/>
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
                * Campo Obbligatorio
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
                    backgroundColor: theme.palette.button.main,
                    color: theme.palette.textButton.white,
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    "&:hover": {
                        backgroundColor: theme.palette.button.main,
                        color: theme.palette.textButton.white,
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    Indietro
                </Button>
                )}
                {currentPageIndex < groupedFields.length - 1 && (
                <Button
                    onClick={handleNextButtonClick}
                    sx={{
                    mb: 4,
                    width: "250px",
                    backgroundColor: theme.palette.button.main,
                    color: theme.palette.textButton.white,
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",

                    "&:hover": {
                        backgroundColor: theme.palette.button.main,
                        color: theme.palette.textButton.white,
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    Avanti
                </Button>
                )}
                {currentPageIndex === groupedFields.length - 1 && (
                <Button
                    onClick={() => handleSubmit(values)}
                    type="submit"
                    sx={{
                    mb: 4,
                    width: "250px",
                    backgroundColor: theme.palette.button.main,
                    color: theme.palette.textButton.white,
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",

                    "&:hover": {
                        backgroundColor: theme.palette.button.main,
                        color: theme.palette.textButton.white,
                        transform: "scale(1.05)",
                        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                    },
                    }}
                >
                    Salva
                </Button>
                )}
            </Box>
            </Box>
        </Box>
        </Container>
    );
    };

    export default AggiungiNeedIDGragica;