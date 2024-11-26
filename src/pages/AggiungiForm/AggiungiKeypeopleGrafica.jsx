    import React, { useState, useEffect }                   from "react";
    import { useNavigate }                                  from "react-router-dom";
    import CircleOutlinedIcon                               from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
    import axios                                            from "axios";
    import CustomAutocomplete                               from "../../components/fields/CustomAutocomplete";
    import CustomTextFieldAggiungi                          from "../../components/fields/CustomTextFieldAggiungi";
    import CustomNoteAggiungi                               from "../../components/fields/CustomNoteAggiungi";
    import CustomDatePickerAggiungi                         from "../../components/fields/CustomDatePickerAggiungi";
    import InfoIcon                                         from "@mui/icons-material/Info";
    import ClearIcon                                        from '@mui/icons-material/Clear';
    import CheckIcon                                        from '@mui/icons-material/Check';
    import CustomEmailAFieldAggiungi                        from "../../components/fields/CustomEmailFieldAggiungi";
    import { useTranslation }                               from 'react-i18next';
    import { useMediaQuery }                                from '@mui/material';
    import { useUserTheme }                                 from "../../components/TorchyThemeProvider";

    import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Snackbar,
    Grid,
    Popover,
    IconButton,
    Slide,
    Container
    } from "@mui/material";

    const AggiungiKeypeopleGrafica = () => {
    const navigate = useNavigate();
    const theme = useUserTheme();
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');



    //stati della pagina
    const [ activeSection,                  setActiveSection                ] = useState(t("Anagrafica"));
    const [ currentPageIndex,               setCurrentPageIndex             ] = useState(0);
    const [ alert,                          setAlert                        ] = useState({ open: false, message: "" });
    const [ errors,                         setErrors                       ] = useState({});

    //stati per i valori
    const [ aziendeOptions,                 setAziendeOptions               ] = useState([]);
    const [ ownerOptions,                   setOwnerOptions                 ] = useState([]);
    const [ statiOptions,                   setStatiOptions                 ] = useState([]);
    const [ values,                         setValues                       ] = useState({});
    const [ emailValidation,                setEmailValidation              ] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const aziendeResponse = await axios.get(
            "http://89.46.196.60:8443/aziende/react/select",
            { headers: headers }
            );
            const ownerResponse = await axios.get(
            "http://89.46.196.60:8443/owner",
            { headers: headers }
            );
            const statiResponse = await axios.get(
            "http://89.46.196.60:8443/keypeople/react/stati",
            { headers: headers }
            );

            if (Array.isArray(statiResponse.data)) {
            const statiOptions = statiResponse.data.map((stati) => ({
                label: stati.descrizione,
                value: stati.id,
            }));
            setStatiOptions(statiOptions);
            } else {
            console.error(
                "I dati ottenuti non sono nel formato Array:",
                statiResponse.data
            );
            }

            if (Array.isArray(ownerResponse.data)) {
            const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
            } else {
            console.error(
                "I dati ottenuti non sono nel formato Array:",
                ownerResponse.data
            );
            }

            if (Array.isArray(aziendeResponse.data)) {
            const aziendeOptions = aziendeResponse.data.map((aziende) => ({
                label: aziende.denominazione,
                value: aziende.id,
            }));
            setAziendeOptions(aziendeOptions);
            } else {
            console.error(
                "I dati ottenuti non sono nel formato Array:",
                aziendeResponse.data
            );
            }
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };

        fetchAziendeOptions();
    }, []);

    const menu = [
        {
        title: t("Anagrafica"),
        icon: <CircleOutlinedIcon />,
        },
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return [
            "nome",
            "idAzienda",
            "email",
            "idStato",
            "ruolo",
            "dataCreazione",
            ];
        default:
            return [];
        }
    };

    //funzione per la validazione dei campi
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = t("Questo campo è obbligatorio");
        }
        });
        return errors;
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
                t("Compilare tutti i campi obbligatori presenti per poter avanzare"),
            });
        }
        }
    };

    // Funzione per il cambio stato degli input
    const handleChange = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
        if (fieldValue.email) {
            verifyEmail(fieldValue.email);
          }
    };

    //funzione per la chiusura dell'alert
    const handleCloseAlert = (reason) => {
        if (reason === "clickaway") {
        return;
        }
        setAlert({ ...alert, open: false });
    };

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

            const response = await axios.post(
            "http://89.46.196.60:8443/keypeople/react/salva",
            values,
            {
                headers: headers,
            }
            );
            if (response.data === "DUPLICATO") {
            setAlert({ open: true, message: t("contatto già esistente!") });
            console.error("il contatto è già stata salvato.");
            return;
            }
            if (response.data === "ERRORE") {
            setAlert({
                open: true,
                message: t("errore durante il salvataggio del contatto!"),
            });
            console.error("Il contatto non è stata salvata.");
            return;
            }
            navigate("/contacts");
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
        } else {
        setErrors(errors);
        setAlert({
            open: true,
            message:
            t("Compilare tutti i campi obbligatori presenti prima di avanzare"),
        });
        }
    };

    //verifica se l'email è già presente o meno a db
    const verifyEmail = async (email) => {
        try {
          const emailResponse = await axios.get(
            `http://89.46.196.60:8443/keypeople/${email}`,
            { headers: headers }
          );
          if (emailResponse.data === "KO") {
            setEmailValidation("error");
          } else if (emailResponse.data === "OK") {
            setEmailValidation("success");
          }
        } catch (error) {
          console.error("errore durante la verifica della email: ", error);
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

    const handlePopoverTipoOpen = (event) => {
        setAnchorElTipo(event.currentTarget);
    };

    const handlePopoverTipoClose = () => {
        setAnchorElTipo(null);
    };

    const openStato = Boolean(anchorElStato);

    const openTipo = Boolean(anchorElTipo);

    //funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const campiObbligatori = [
        "nome",
        "idAzienda",
        "email",
        "idStato",
        "ruolo",
        "dataCreazione",
    ];

    const fields = [
        { type: "titleGroups", label: t("Anagrafica") },
        { label: t("Nome Contatto*"),          name: "nome",               type: "text",               maxLength: 255          },
        { label: t("Ruolo*"),                  name: "ruolo",              type: "text",               maxLength: 255          },
        { label: t("Azienda*"),                name: "idAzienda",          type: "select",             options: aziendeOptions, },
        { label: t("Tipo"),                    name: "tipo",               type: "select",             options: [
            { value: 1, label: "Keypeople" },
            { value: 2, label: "Hook" },
            { value: 3, label: "Link" },
        ],
        },
        { label: t("Stato*"),                  name: "idStato",            type: "select",             options: statiOptions },

        { label: "Email*",                  name: "email",              type: "email",              maxLength: 45         },
        { label: t("Cellulare"),               name: "cellulare",          type: "text",               maxLength: 20         },

        { label: t("Data di Creazione*"),      name: "dataCreazione",      type: "date"                                      },
        // { label: "Ultima attività",         name: "dataUltimaAttivita", type: "date"                                      },
        { label: t("Note"),                    name: "note",               type: "note",               maxLength: 2000       },
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

    //funzione per richiamare i vari campi
    const renderFields = (field) => {
        const { type, ...otherProps } = field;
        // const errorMessage = errors[field.name];
        

        switch (type) {
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
           

        case "email":
            return (
            <CustomEmailAFieldAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                maxLength={field.maxLength}
                error={emailValidation === "error"}
                helperText={emailValidation === "error" ? t("Email già presente") : ""}
                InputProps={{
                endAdornment: emailValidation === "error" ? (
                    <ClearIcon color="error" />
                ) : emailValidation === "success" ? (
                    <CheckIcon color="success" />
                ) : null,
                }}
                sx={{
                borderBottom: emailValidation === "error" ? "2px solid red" : emailValidation === "success" ? "2px solid green" : "none"
                }}
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

        case "select":
            if (field.name === "tipo") {
            return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                <IconButton
                    onClick={handlePopoverStatoOpen}
                    sx={{ mr: -3, ml: 2 }}
                >
                    <InfoIcon />
                </IconButton>
                <Popover
                    open={openStato}
                    anchorEl={anchorElStato}
                    onClose={handlePopoverStatoClose}
                    anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                    }}
                    transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                    }}
                >
                    <List dense>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Keypeople:
                            </Typography>
                            {
                                t(" lavora in azienda target, ha budget da gestire e potere decisionale ")
                            }
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Hook:
                            </Typography>
                            {
                                t(" lavora in azienda target, ma non ha budget e potere decisionale ")
                            }
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Link:
                            </Typography>
                            {
                                t(" persona che fa parte del nostro network e potrebbe avere contatti utili ")
                            }
                            </Box>
                        }
                        />
                    </ListItem>
                    </List>
                </Popover>
                </Box>
            );
            }
            if (field.name === "idStato") {
            return (
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                <IconButton
                    onClick={handlePopoverTipoOpen}
                    sx={{ mr: -3, ml: 2 }}
                >
                    <InfoIcon />
                </IconButton>
                <Popover
                    open={openTipo}
                    anchorEl={anchorElTipo}
                    onClose={handlePopoverTipoClose}
                    anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                    }}
                    transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                    }}
                >
                    <List dense>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Gold:
                            </Typography>
                            {t(" ho ricevuto un’esigenza di business ")}
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Silver:
                            </Typography>
                            {t(" ho fissato una prospection ")}
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Bronze:
                            </Typography>
                            {t(" sono entrato in contatto ")}
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Wood:
                            </Typography>
                            {t(" ho effettuato un’azione senza esito ")}
                            </Box>
                        }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                        primary={
                            <Box>
                            <Typography
                                component="span"
                                sx={{ fontWeight: "bold" }}
                            >
                                Start:
                            </Typography>
                            {t(" non ho ancora effettuato azioni commerciali ")}
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
            marginLeft: isSmallScreen ? "3.5em" : "12.8em",
            mt: "0.5em",
            mb: "0.5em",
            mr: "0.8em",
            borderRadius: "20px",
            overflow: "hidden",
            transition: 'margin-left 0.3s ease',
            }}
        >
            <Box
            sx={{
                width: { xs: '70px', sm: '150px', md: '220px', lg: '280px' },
                height: "98%",
                background: "#00B400",
                p: 2,
                overflow: "hidden",
                position: "fixed",
                borderRadius: "20px 0px 0px 20px",
                transition: 'width 0.3s ease',
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
                    color: 'black',
                    },
                }}
                >
                <span style={{ marginRight: "0.5em" }}>{"<"}</span>
                {t('Indietro')}
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
                fontSize: { xs: "1.2em", sm: "1.5em", md: "1.8em" },
                transition: 'fontSize 0.3s ease',
                color: "black",
                }}
            >
                {" "}
                {t('Aggiungi')} <br /> {t('Contatto')}
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
                        activeSection === item.title ? "black" : "trasparent",
                        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color:
                            activeSection === item.title ? "#EDEDED" : "#EDEDED",
                        },
                        borderRadius: "10px",
                    },
                    }}
                >
                <ListItemIcon
                    sx={{ color: theme.palette.aggiungiSidebar.text, mr: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 }, display: { xs: 'none', sm: 'none', md: 'block' }, }}
                >{item.icon}</ListItemIcon>
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
                pl: { xs: 1, sm: 2, md: 3, lg: 5 },
                pr: { xs: 1, sm: 2, md: 3, lg: 5 },
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

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' } }}>

                {currentPageIndex > 0 && (
                <Button
                    onClick={handleBackButtonClick}
                    sx={{
                    mb: 4,
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
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
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },

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
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%'}, 
                    backgroundColor: "#00B400",
                    color: "#EDEDED",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },

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

    export default AggiungiKeypeopleGrafica;
