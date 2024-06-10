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
    } from "@mui/material";
    import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
    import axios from "axios";
    import CustomAutocomplete from "../components/fields/CustomAutocomplete";
    import CustomTextFieldAggiungi from "../components/fields/CustomTextFieldAggiungi";
    import { useUserTheme } from "../components/TorchyThemeProvider";

    const SettingsPage = () => {
    const theme = useUserTheme();
    const navigate = useNavigate();

    //stati della pagina
    const [activeSection, setActiveSection] = useState("Cambia Password");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const [errors, setErrors] = useState([]);

    //stati per i valori
    const [values, setValues] = useState({});

    const menu = [
        {
        title: "Cambia Password",
        icon: <CircleOutlinedIcon />,
        },
        // {
        // title: "Lingua",
        // icon: <CircleOutlinedIcon />,
        // },
        // {
        // title: "Elimina Account",
        // icon: <CircleOutlinedIcon />,
        // },
    ];

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return ["username", "oldPassword", "newPassword"];
        // case 1:
        //     return ["username", "password"];
        // case 2:
        //     return ["lingua"];
        default:
            return [];
        }
    };

    //funzione per la validazione dei campi
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach((field) => {
        if (!values[field]) {
            errors[field] = "Questo campo è obbligatorio";
        }
        });
        if (values.nuova && values.ripeti && values.nuova !== values.ripeti) {
        errors.ripeti = "Le nuove password non coincidono";
        }
        return errors;
    };

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Funzione per la navigazione dal menu laterale
    const handleMenuItemClick = (section, index) => {
        setActiveSection(section);
        setCurrentPageIndex(index);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // Funzione per il cambio stato degli input
    const handleChange = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
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

    // // Gestisce il salvataggio delle modifiche per la sezione corrente
    // const handleSaveSection = (sectionIndex) => {
    //     console.log("Salvataggio dati per la sezione:", menu[sectionIndex].title);
    //     setAlert({ open: true, message: "Modifiche salvate con successo!" });
    // };





    //funzione per il salvataggio del cambio password
    const handleSubmitChangePassword = async () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
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
            Authorization: `Bearer ${token}`
            };

            const response = await axios.post("http://89.46.196.60:8443/api/auth/change/password", payload, {
            headers: headers
            });
            if (response.data === "ERRORE") {
            setAlert({ open: true, message: "Errore durante il salvataggio della password!", severity: "error" });
            console.error("La password non è stata cambiata.");
            return;
            }
            setAlert({ open: true, message: "Password cambiata con successo!", severity: "success" });
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
            setAlert({ open: true, message: "Errore durante il salvataggio!", severity: "error" });
        }
        } else {
        setErrors(errors);
        setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare", severity: "error" });
        }
    };


    // const handleSubmitCambioLingua = async (values) => {
    //     console.log("salvataggio cambio lingua");
    // };

    // const handleSubmitEliminaUtente = async (values) => {
    //     const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
    //     const mandatoryFields = getMandatoryFields(currentIndex);
    //     const errors = validateFields(values, mandatoryFields);
    //     const hasErrors = Object.keys(errors).length > 0;

    //     if (!hasErrors) {
    //     try {
    //         const { username, password } = values;
    //         const payload = { username, password };

    //         if (!token) {
    //         console.error("Nessun token di accesso disponibile");
    //         return;
    //         }

    //         const headers = {
    //         Authorization: `Bearer ${token}`
    //         };

    //         const response = await axios.post("http://89.46.196.60:8443/api/auth/delete", payload, {
    //         headers: headers
    //         });
    //         if (response.data === "ERRORE") {
    //         setAlert({ open: true, message: "Errore durante la cancellazione dell'utente!", severity: "error" });
    //         console.error("L'utente non è stato cancellato.");
    //         return;
    //         }
    //         console.log("qui buttare fuori l'utente alla login");
    //     } catch (error) {
    //         console.error("Errore durante l'eliminazione dell'utente:", error);
    //         setAlert({ open: true, message: "Errore durante l'eliminazione dell'utente!", severity: "error" });
    //     }
    //     } else {
    //     setErrors(errors);
    //     setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare", severity: "error" });
    //     }
    // };



    //array per capire quale handleSubmit deve chiamare il bottone "salva"
    const handleSubmitFunctions = {
    0: handleSubmitChangePassword,  //per la sezione "Password"
    // 1: handleSubmitEliminaUtente,   //per la sezione "Elimina Account"
    // 2: handleSubmitCambioLingua    //per la sezione "Lingua"
};

const handleSaveSection = (sectionIndex) => {
    //chiamo la funzione di salvataggio appropriata
    const handleSubmit = handleSubmitFunctions[sectionIndex];
    if (handleSubmit) {
        handleSubmit(values); 
    } else {
        console.error("Nessuna funzione di salvataggio trovata per l'indice:", sectionIndex);
    }
};

    const fields = [
        { type: "titleGroups", label: "Cambia Password" },
        {
        label: "Username*",
        name: "username",
        type: "text",
        maxLength: 90,
        },
        {
        label: "Vecchia Password*",
        name: "oldPassword",
        type: "text",
        maxLength: 90,
        },
        { label: "Nuova Password*", name: "newPassword", type: "text", maxLength: 255 },

        // { type: "titleGroups", label: "Elimina account" },
        // {
        // label: "Username",
        // name: "username",
        // type: "text",
        // maxLength: 90,
        // },
        // {
        // label: "Password",
        // name: "password",
        // type: "text",
        // maxLength: 90,
        // },

        // { type: "titleGroups", label: "Lingua" },
        // {
        // label: "Lingua",
        // name: "lingua",
        // type: "select",
        // options: [
        //     { value: 1, label: "Italiano" },
        //     { value: 2, label: "Spagnolo" },
        //     { value: 3, label: "Inglese" },
        // ],
        // },
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

        case "select":
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

    // Renderizza i gruppi di campi
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
                fontWeight:"bold",
                borderRadius: '10px',
                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',



                "&:hover": {
                    backgroundColor: theme.palette.button.main,
                    transform: 'scale(1.01)',
                    borderRadius: '10px',
                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',


                },
                }}
            >
                Salva Modifiche
            </Button>
            </Box>
        </Box>
        );
    };

    return (
        <Box
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
                color: theme.palette.aggiungiSidebar.title,
                }}
            >
                {" "}
                Settings{" "}
            </Typography>
            <List
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
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
                    <ListItemIcon
                    sx={{ color: theme.palette.aggiungiSidebar.text }}
                    >
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
            </Box>
            </Box>
        </Box>
        </Box>
    );
    };

    export default SettingsPage;
