import React, { useState, useEffect }                       from "react";
import { useNavigate, useLocation }                         from "react-router-dom";
import CircleOutlinedIcon                                   from "@mui/icons-material/CircleOutlined"; //cerchio vuoto
import CustomAutocomplete                                   from "../../components/fields/CustomAutocomplete";
import CustomNoteAggiungi                                   from "../../components/fields/CustomNoteAggiungi";
import CustomDecimalNumberAggiungi                          from "../../components/fields/CustomDecimalNumberAggiungi";
import CustomTextFieldModifica                              from "../../components/fields/CustomTextFieldModifica";
import CustomDatePickerHoursAggiungi                        from "../../components/fields/CustomDatePickerHoursAggiungi";
import CustomDatePickerModifica                             from "../../components/fields/CustomDatePickerModifica";
import CheckCircleIcon                                      from "@mui/icons-material/CheckCircle";
import { useTranslation }                                   from 'react-i18next';
import ApiService                                           from "../../services/ApiService";


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
import AggiungiModificaSchemaPage from "../../components/AggiungiModificaSchemaPage";

const AggiungiIntervista = () => {
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


//chiamata per ricevere i dati dal db
    const fetchData = async () => {
    const paginazione = {
        pagina: 0,
        quantita: 10,
    };
    try {
        //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner

        const ownerResponse     = await ApiService.request("getAllOwnerSelect");
        const responseTipoIntervista     = await ApiService.request("tipoIntervistaSelect");
        const responseIntervista = await ApiService.request(
            "getIntervistaByCandidato", 
            { candidatoID }, 
            {}, 
            {}, 
            { pagina: paginazione.pagina, quantita: paginazione.quantita }
        );
        
        const responseCandidato     = await ApiService.request("getCandidato", {candidatoID: candidatoID});
        const responseStato     = await ApiService.request("statoRecruitingSelect");

        if (
        responseIntervista.data &&
        typeof responseIntervista.data === "object"
        ) {
        const intervisteData = responseIntervista.data.interviste;
        if (Array.isArray(intervisteData) && intervisteData.length > 0) {
            // Prendo l'ultima intervista per data
            const ultimaIntervista = intervisteData[intervisteData.length - 1];
            setInterviste(ultimaIntervista);
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

    useEffect(() => {
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
        return [ "coerenza", "standing", "energia", "comunicazione", "inglese", "competenze", "valutazione", "descrizioneCandidatoUna", "teamSiNo"];
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
        const response = await ApiService.request(
            "salvaIntervista",
            {},  
            values, 
            {}, 
            { idCandidato: candidatoID, note: values.note, modifica: 0 } 
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

const campiObbligatori = ["dataColloquio", "coerenza", "standing", "energia", "comunicazione", "inglese", "competenze", "valutazione", "descrizioneCandidatoUna", "teamSiNo"];

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
    { label: t("Coerenza Percorso*"),           name: "coerenza",                   type: "select",             options: valoriOptions  },
    { label: t("Standing*"),                    name: "standing",                   type: "select",             options: valoriOptions  },
    { label: t("Energia*"),                     name: "energia",                    type: "select",             options: valoriOptions  },
    { label: t("Comunicazione*"),               name: "comunicazione",              type: "select",             options: valoriOptions  },
    { label: t("Livello Di Inglese*"),          name: "inglese",                    type: "select",             options: valoriOptions  },
    { label: t("Competenze vs ruolo*"),         name: "competenze",                 type: "select",             options: valoriOptions  },
    { label: t("Valutazione*"),                 name: "valutazione",                type: "select",             options: valoriOptions  },
    { label: t("One word*"),                    name: "descrizioneCandidatoUna",    type: "text",               maxLength: 45,          },
    { label: t("Lo vorresti nel tuo team?*"),   name: "teamSiNo",                   type: "select",             options: siNoOptions    },

    { type: "titleGroups", label: t("Info Contrattuali") },
    { label: t("Preavviso"),                   name: "preavviso",                  type: "text",               maxLength: 45                   },
    { label: t("Disponibilità Effettiva"),     name: "disponibilita",              type: "text",               maxLength: 45,          },
    { label: t("RAL Attuale"),                 name: "attuale",                    type: "text",               maxLength: 90           },
    { label: t("RAL Desiderata"),              name: "desiderata",                 type: "text",               maxLength: 90,          },
    { label: t("Proposta Economica"),          name: "proposta",                   type: "note",               maxLength: 90,          },


    { type: "titleGroups", label: t("Azioni") },
    { label: t("Follow Up"),                   name: "tipo",                       type: "select",             options: tipoIntervistaOptions, },
    { label: t("Next Deadline"),               name: "dataAggiornamento",          type: "date"                                                },
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
        // const isDisabled = disableFields[field.name];
        return (
            <CustomTextFieldModifica
            name={field.name}
            label={field.label}
            type={field.type}
            values={values}
            onChange={handleChange}
            initialValues={initialValues}
            // disabled={!!isDisabled}
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
        // const dateDisabled = disableFields[field.name];
        return (
            <CustomDatePickerModifica
            name={field.name}
            label={field.label}
            type={field.type}
            values={values}
            onChange={handleChange}
            initialValues={initialValues}
            // disabled={!!dateDisabled}
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
    <AggiungiModificaSchemaPage
        menuItems={menu}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
        sectionCompleted={sectionCompleted}
        onMenuItemClick={handleMenuItemClick}
        onGoBack={handleGoBack}
        title={`${t("Aggiungi")} ${t("Intervista")}`}
        handleSubmit={handleSubmit}   
        handleNextButtonClick={handleNextButtonClick}
        handleBackButtonClick={handleBackButtonClick} 
        values={values}
    >
        {/* Contenuto della sezione corrente */}
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

export default AggiungiIntervista;
