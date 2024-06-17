    import React, { useState, useEffect }                   from "react";
    import { useNavigate }                                  from "react-router-dom";
    import CircleOutlinedIcon                               from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
    import axios                                            from "axios";
    import CustomAutocomplete                               from "../../components/fields/CustomAutocomplete";
    import CustomTextFieldAggiungi                          from "../../components/fields/CustomTextFieldAggiungi";
    import CustomNoteAggiungi                               from "../../components/fields/CustomNoteAggiungi";
    import CustomDatePickerAggiungi                         from "../../components/fields/CustomDatePickerAggiungi";
    import InfoIcon                                         from "@mui/icons-material/Info";
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
    Container,
    Slide,
    } from "@mui/material";
import { useUserTheme } from "../../components/TorchyThemeProvider";

    const AggiungiOwner = () => {
    const navigate = useNavigate();
    const theme = useUserTheme();

    //stati della pagina
    const [ activeSection,                  setActiveSection                ] = useState("Owner");
    const [ currentPageIndex,               setCurrentPageIndex             ] = useState(0);
    const [ alert,                          setAlert                        ] = useState({ open: false, message: "" });
    const [ errors,                         setErrors                       ] = useState({});

    //stati per i valori

    const [ values,                         setValues                       ] = useState({});

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
    };



    const menu = [
        {
        title: "Owner",
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
            errors[field] = "Questo campo è obbligatorio";
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
                "Compilare tutti i campi obbligatori presenti per poter avanzare",
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
            const response = await axios.post(
                "http://89.46.196.60:8443/owner/salva",
                values,
                {
                    headers: headers,
                }
            );

            if (typeof response.data === "number") { // Assumendo che l'ID sia un numero
                setAlert({
                    open: true,
                    message: `Salvato con successo!`,
                    severity: "success"
                });
                console.log("Il salvataggio è andato a buon fine");
                // Opzionalmente, reindirizza l'utente o aggiorna la pagina
            } else if (response.data === "DUPLICATO") {
                setAlert({ open: true, message: "Contatto già esistente!" });
                console.error("Il contatto è già stato salvato.");
            } else if (response.data === "ERRORE") {
                setAlert({
                    open: true,
                    message: "Errore durante il salvataggio del contatto!",
                });
                console.error("Il contatto non è stato salvato.");
            }
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
            setAlert({
                open: true,
                message: "Errore di sistema durante il salvataggio del contatto."
            });
        }
    } else {
        setErrors(errors);
        setAlert({
            open: true,
            message: "Compilare tutti i campi obbligatori presenti prima di avanzare",
        });
    }
};


    //funzione per la transizione dell'alert
    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const campiObbligatori = [

    ];

    const fields = [
        { type: "titleGroups", label: "Owner" },
        { label: "Nome",             name: "nome",               type: "text",               maxLength: 255          },
        { label: "Cognome",          name: "cognome",            type: "text",               maxLength: 255          },
        { label: "Email",            name: "email",              type: "text",               maxLength: 255          },
        { label: "Sigla",            name: "descrizione",        type: "text",               maxLength: 255          },

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
                    severity={alert.severity || "error"}
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
                        backgroundColor: theme.palette.button.mainHover,
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

    export default AggiungiOwner;
