    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Grid,
    Snackbar,
    Slide,
    TextField,
    Container,
    } from "@mui/material";
    import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
    import { useTranslation } from "react-i18next";
    import axios from "axios";
    import Autocomplete from "@mui/material/Autocomplete";
    import CustomTextFieldAggiungi from "../components/fields/CustomTextFieldAggiungi";
    import { useUserTheme } from "../components/TorchyThemeProvider";

    const SettingsPage = () => {
    const theme = useUserTheme();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const languageOptions = [
        { value: "it",  label: t("Italiano"),   flag: "🇮🇹" },
        { value: "es",  label: t("Spagnolo"),   flag: "🇪🇸" },
        { value: "en",  label: t("Inglese"),    flag: "🇬🇧" },
        { value: "de",  label: t("Tedesco"),    flag: "🇩🇪" },
        { value: "fr",  label: t("Francese"),   flag: "🇫🇷" },
        { value: "pt",  label: t("Portoghese"), flag: "🇵🇹" },
        { value: "ru",  label: t("Russo"),      flag: "🇷🇺" },
        { value: "ja",  label: t("Giapponese"), flag: "🇯🇵" },
        { value: "cmn", label: t("Cinese"),     flag: "🇨🇳" },
        { value: "ar",  label: t("Arabo"),      flag: "🇸🇦" },
    ];

    const [activeSection, setActiveSection] = useState("Cambia Password");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [errors, setErrors] = useState([]);
    const [values, setValues] = useState({ lingua: i18n.language });

    const menu = [
        {
        title: t("Cambia Password"),
        icon: <CircleOutlinedIcon />,
        },
        {
        title: t("Lingua"),
        icon: <CircleOutlinedIcon />,
        },
    ];

    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return ["username", "oldPassword", "newPassword"];
        default:
            return [];
        }
    };

    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = t("Questo campo è obbligatorio");
        }
        });
        if (values.nuova && values.ripeti && values.nuova !== values.ripeti) {
        errors.ripeti = t("Le nuove password non coincidono");
        }
        return errors;
    };

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const handleMenuItemClick = (section, index) => {
        setActiveSection(section);
        setCurrentPageIndex(index);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleChange = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
    };

    const handleCloseAlert = (reason) => {
        if (reason === "clickaway") {
        return;
        }
        setAlert({ ...alert, open: false });
    };

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const handleSubmitChangePassword = async () => {
        const currentIndex = menu.findIndex(
        (item) => item.title.toLowerCase() === activeSection.toLowerCase()
        );
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;

        if (!hasErrors) {
        try {
            const { username, oldPassword, newPassword } = values;
            const payload = { username, oldPassword, newPassword };

            if (!token) {
            console.error("Nessun token di accesso disponibile");
            return;
            }

            const headers = {
            Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
            "http://89.46.196.60:8443/api/auth/change/password",
            payload,
            {
                headers: headers,
            }
            );
            if (response.data === "ERRORE") {
            setAlert({
                open: true,
                message: t("Errore durante il salvataggio della password!"),
                severity: "error",
            });
            console.error("La password non è stata cambiata.");
            return;
            }
            setAlert({
            open: true,
            message: t("Password cambiata con successo!"),
            severity: "success",
            });
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
            setAlert({
            open: true,
            message: t("Errore durante il salvataggio!"),
            severity: "error",
            });
        }
        } else {
        setErrors(errors);
        setAlert({
            open: true,
            message: t(
            "Compilare tutti i campi obbligatori presenti prima di avanzare"
            ),
            severity: "error",
        });
        }
    };

    const handleSubmitCambioLingua = async () => {
        const selectedLanguage = values.lingua;
        i18n.changeLanguage(selectedLanguage, (err, t) => {
        if (err) return console.error("Errore cambiando lingua", err);
        });
        setAlert({
        open: true,
        message: t("Lingua cambiata con successo!"),
        severity: "success",
        });
    };

    const handleSubmitFunctions = {
        0: handleSubmitChangePassword,
        1: handleSubmitCambioLingua,
    };

    const handleSaveSection = (sectionIndex) => {
        const handleSubmit = handleSubmitFunctions[sectionIndex];
        if (handleSubmit) {
        handleSubmit();
        } else {
        console.error("Nessuna funzione di salvataggio trovata per l'indice:", sectionIndex);
        }
    };

    useEffect(() => {
        setValues((prevValues) => ({
        ...prevValues,
        lingua: i18n.language,
        }));
    }, [i18n.language]);

    const fields = [
        { type: "titleGroups", label: t("Cambia Password") },
        {
        label: t("Username*"),
        name: "username",
        type: "text",
        maxLength: 90,
        },
        {
        label: t("Vecchia Password*"),
        name: "oldPassword",
        type: "text",
        maxLength: 90,
        },
        { label: t("Nuova Password*"), name: "newPassword", type: "text", maxLength: 255 },

        { type: "titleGroups", label: t("Lingua") },
        {
        label: t("Lingua"),
        name: "lingua",
        type: "autocomplete",
        },
    ];

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

    const groupedFields = groupFields(fields);

    const renderFields = (field) => {
        if (field.type === "titleGroups" && field.label !== activeSection) {
        return null;
        }

        switch (field.type) {
        case "text":
            return (
            <CustomTextFieldAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                maxLength={field.maxLength}
                values={values}
                onChange={handleChange}
            />
            );

        case "autocomplete":
            return (
            <Autocomplete
                options={languageOptions}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                <Box component="li" {...props}>
                    {option.flag} {option.label}
                </Box>
                )}
                value={languageOptions.find(
                (option) => option.value === values.lingua
                )}
                onChange={(event, newValue) => {
                handleChange({ lingua: newValue ? newValue.value : "" });
                }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label={field.label}
                    variant="filled"
                    sx={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: "20px",
                    backgroundColor: "#EDEDED",
                    "& .MuiFilledInput-root": {
                        backgroundColor: "transparent",
                    },
                    "& .MuiFilledInput-underline:after": {
                        borderBottomColor: "transparent",
                    },
                    "& .MuiFilledInput-root::before": {
                        borderBottom: "none",
                    },
                    "&:hover .MuiFilledInput-root::before": {
                        borderBottom: "none",
                    },
                    "& .Mui-disabled": {
                        WebkitTextFillColor: "#a09f9f", // Questo sovrascrive il colore del testo per i browser basati su Webkit come Chrome e Safari
                        color: "#a09f9f",
                        cursor: "not-allowed",
                    },
                    "& .MuiFormLabel-root.Mui-focused": {
                        color: theme.palette.border.main,
                    },
                    "& .MuiFilledInput-root.Mui-disabled": {
                        bgcolor: "transparent",
                        cursor: "not-allowed",
                        borderBottom: "none",
                    },
                    "& .Mui-disabled": {
                        cursor: "not-allowed",
                    },
                    }}
                    InputProps={{
                    ...params.InputProps,
                    startAdornment: values.lingua && (
                        <Box component="span" sx={{ mr: 1 }}>
                        {
                            languageOptions.find(
                            (option) => option.value === values.lingua
                            )?.flag
                        }
                        </Box>
                    ),
                    }}
                />
                )}
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
            {groupedFields[currentPageIndex].map((field, index) => (
                <Grid item xs={12} key={index}>
                {renderFields(field)}
                </Grid>
            ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
                onClick={() => handleSaveSection(currentPageIndex)}
                sx={{
                backgroundColor: theme.palette.button.main,
                color: "white",
                fontWeight: "bold",
                borderRadius: "10px",
                boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                    backgroundColor: theme.palette.button.main,
                    transform: "scale(1.01)",
                    borderRadius: "10px",
                    boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
                },
                }}
            >
                {t("Salva Modifiche")}
            </Button>
            </Box>
        </Box>
        );
    };

    return (
        <Container
        maxWidth="false"
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
                {t("Indietro")}
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
                color: theme.palette.aggiungiSidebar.title,
                }}
            >
                {t("Settings")}
            </Typography>
            <List sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                {menu.map((item, index) => (
                <ListItem
                    key={item.title}
                    selected={activeSection === item.title}
                    onClick={() => handleMenuItemClick(item.title, index)}
                    sx={{
                    mb: 4,
                    cursor: [index] ? "pointer" : "not-allowed",
                    "&.Mui-selected, &:hover": {
                        backgroundColor: [index]
                        ? theme.palette.aggiungiSidebar.hover
                        : theme.palette.aggiungiSidebar.hover,
                        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color: [index]
                            ? theme.palette.aggiungiSidebar.textHover
                            : theme.palette.aggiungiSidebar.textHover,
                        },
                        borderRadius: "10px",
                    },
                    }}
                >
                    <ListItemIcon sx={{ color: theme.palette.aggiungiSidebar.text }}>
                    {item.icon}
                    </ListItemIcon>
                    <ListItemText
                    primary={item.title}
                    sx={{ color: theme.palette.aggiungiSidebar.text }}
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
                    severity={alert.severity}
                    sx={{ width: "100%" }}
                >
                    {alert.message}
                </Alert>
                </Snackbar>
                <Typography
                variant="h4"
                component="h1"
                sx={{ mt: 1, fontWeight: "bold", fontSize: "1.8em" }}
                >
                {t(activeSection)}
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
                {renderFieldsGroups()}
            </Box>
            <Typography
                variant="h6"
                sx={{ mt: 2, color: "#666565", fontSize: "1em", ml: 16 }}
            >
                {t("* Campo Obbligatorio")}
            </Typography>

            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 5,
                gap: 6,
                }}
            ></Box>
            </Box>
        </Box>
        </Container>
    );
    };

    export default SettingsPage;
