import React, { useState, useEffect }                   from "react";
import { useNavigate }                                  from "react-router-dom";
import CircleOutlinedIcon                               from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
import CustomAutocomplete                               from "../../components/fields/CustomAutocomplete";
import CustomTextFieldAggiungi                          from "../../components/fields/CustomTextFieldAggiungi";
import CustomNoteAggiungi                               from "../../components/fields/CustomNoteAggiungi";
import CustomDatePickerAggiungi                         from "../../components/fields/CustomDatePickerAggiungi";
import InfoIcon                                         from "@mui/icons-material/Info";
import ClearIcon                                        from '@mui/icons-material/Clear';
import CheckIcon                                        from '@mui/icons-material/Check';
import CustomEmailAFieldAggiungi                        from "../../components/fields/CustomEmailFieldAggiungi";
import { useTranslation }                               from 'react-i18next';
import ApiService                                       from "../../services/ApiService";
import AggiungiModificaSchemaPage                       from "../../components/AggiungiModificaSchemaPage";

import {
Box,
Typography,
List,
ListItem,
ListItemText,
Alert,
Snackbar,
Grid,
Popover,
IconButton,
Slide,
} from "@mui/material";

const AggiungiContatti = () => {
const navigate = useNavigate();
const { t } = useTranslation();



//stati della pagina
const [ activeSection,                  setActiveSection                ] = useState(t("Anagrafica"));
const [ currentPageIndex,               setCurrentPageIndex             ] = useState(0);
const [sectionCompleted,                setSectionCompleted             ] = useState([false]);
const [ alert,                          setAlert                        ] = useState({ open: false, message: "" });
const [ errors,                         setErrors                       ] = useState({});

//stati per i valori
const [ aziendeOptions,                 setAziendeOptions               ] = useState([]);
const [ ownerOptions,                   setOwnerOptions                 ] = useState([]);
const [ statiOptions,                   setStatiOptions                 ] = useState([]);
const [ values,                         setValues                       ] = useState({});
const [ emailValidation,                setEmailValidation              ] = useState(null);


//chiamata per ricevere i dati dal db
useEffect(() => {
    const fetchAziendeOptions = async () => {
    try {

        const aziendeResponse   = await ApiService.request("getAziendeSelect");
        const ownerResponse     = await ApiService.request("getAllOwnerSelect");
        const statiResponse     = await ApiService.request("statiContattoSelect");

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

        const response = await ApiService.request("salvaContatto", {}, values);
        
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
      const emailResponse = await ApiService.request("verificaEmialContatto", {email: email});
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

    { label: "Email*",                     name: "email",              type: "email",              maxLength: 45         },
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
        if (field.name === "nome") {
            // Il campo "Nome Contatto" deve essere nella prima colonna
            return (
                <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                    {renderFields(field)}
                </Grid>
            );
        }
        if (field.name === "note") {
            // Il campo "Note" deve occupare entrambe le colonne
            return (
                <Grid item xs={12} key={index}>
                    {renderFields(field)}
                </Grid>
            );
        }
        // Tutti gli altri campi normali occupano metà della larghezza
        return (
            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                {renderFields(field)}
            </Grid>
        );
    })}
</Grid>

    </Box>
    );
};


return (
  <AggiungiModificaSchemaPage
      menuItems={menu}
      currentPageIndex={currentPageIndex}
      setCurrentPageIndex={setCurrentPageIndex}
      sectionCompleted={sectionCompleted}
      onMenuItemClick={(section, index) => {
          setActiveSection(section);
          setCurrentPageIndex(index);
      }}
      onGoBack={handleGoBack}
      title={`${t("Aggiungi")} ${t("Contatto")}`}
      handleSubmit={handleSubmit}
      handleNextButtonClick={handleNextButtonClick}
      handleBackButtonClick={handleBackButtonClick}
      values={values}
  >
      {renderFieldsGroups()}

      {/* Snackbar per notifiche */}
      <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
          <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
              {alert.message}
          </Alert>
      </Snackbar>
  </AggiungiModificaSchemaPage>
);


};

export default AggiungiContatti;
