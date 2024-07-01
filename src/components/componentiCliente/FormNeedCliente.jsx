import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomAutocomplete from "../../components/fields/CustomAutocomplete";
import CustomMultipleSelectAggiunta from "../../components/fields/CustomMultipleSelectAggiunta";
import {
  Box,
  Skeleton,
  Grid,
  Slide,
} from "@mui/material";
import { useUserTheme } from "../../components/TorchyThemeProvider";
import CustomTextFieldModifica from "../fields/CustomTextFieldModifica";
import CustomNoteModifica from "../fields/CustomNoteModifica";

const FormNeedCliente = ({idNeed}) => {


  const theme = useUserTheme();
  const { id } = useParams();
  const idAzienda = id;


  //stati della pagina
  const [alert, setAlert] = useState({ open: false, message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [datiModifica, setDatiModifica] = useState([]);
  const [aziendaID, setAziendaID] = useState(null);
  const [impiegoOptions, setImpiegoOptions] = useState([]);
  const [lavoroOptions, setLavoroOptions] = useState([]);
  const [jobtitleOptions, setJobtitleOptions] = useState([]);


  const [values, setValues] = useState({ idAzienda });
  // Recupera l'token da sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //chiamata per ricevere i dati dal db
  useEffect(() => {
    const fetchNeedOptions = async () => {
      try {
        const responseSkill = await axios.get(
          "http://89.46.196.60:8443/staffing/react/skill",
          { headers: headers }
        );
        const needResponse = await axios.get(
          `http://89.46.196.60:8443/job/description/need/${idNeed}`,
          { headers: headers }
        );

        const impiegoResponse = await axios.get(
          "http://89.46.196.60:8443/job/description/impiego",
          { headers: headers }
        );

        const lavoroResponse = await axios.get(
          "http://89.46.196.60:8443/job/description/lavoro",
          { headers: headers }
        )

        const responseJobtitle = await axios.get(
          "http://89.46.196.60:8443/aziende/react/tipologia",
          { headers: headers }
        )


        if (Array.isArray(responseJobtitle.data)) {
          const jobtitleOptions = responseJobtitle.data.map((jobtitle) => ({
              label: jobtitle.descrizione,
              value: jobtitle.id,
          }));
          setJobtitleOptions(jobtitleOptions);
      }


        const modificaData = needResponse.data;
        const aziendaId = needResponse.data.cliente.id;
        setAziendaID(aziendaId);
        setDatiModifica(modificaData);


        if (Array.isArray(impiegoResponse.data)) {
          const impiegoOptions = impiegoResponse.data.map((impiego) => ({
            label: impiego.descrizione,
            value: impiego.id,
          }));
          setImpiegoOptions(impiegoOptions);
        }


        if (Array.isArray(lavoroResponse.data)) {
          const lavoroOptions = lavoroResponse.data.map((lavoro) => ({
            label: lavoro.descrizione,
            value: lavoro.id,
          }));
          setLavoroOptions(lavoroOptions);
        }



        if (Array.isArray(responseSkill.data)) {
          const skillsOptions = responseSkill.data.map((skill) => ({
            value: skill.id,
            label: skill.descrizione,
          }));
          setSkillsOptions(skillsOptions);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle aziende:", error);
      }
      setLoading(false);
    };

    fetchNeedOptions();
  }, []);

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
          setAlert({
            open: true,
            message: "errore durante il salvataggio del need!",
          });
          console.error("Il need non è stata salvata.");
          return;
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


  const seniorityOptions = [
    { label: "Neo", value: "0", min: 0, max: 1 },
    { label: "Junior", value: "1", min: 1, max: 2 },
    { label: "Middle", value: "2", min: 2, max: 3 },
    { label: "Senior", value: "3", min: 3 },
];


  const fieldObbligatori = [
    "descrizione",
    "tipologia",
    "modalitaLavoro",
    "modalitaImpiego",
    "localita",
    "anniEsperienza"
  ];

  const fields = [
    { label: "Funzione aziendale*", name: "descrizione", type: "text", maxLength: 200 },
    { label: "Job Title*", name: "tipologia", type: "select", options: jobtitleOptions },
    { label: "Modalità di lavoro*", name: "modalitaLavoro", type: "select", options: lavoroOptions },
    { label: "Modalità di impiego*", name: "modalitaImpiego", type: "select", options: impiegoOptions },
    { label: "Località*", name: "location", type: "text", maxLength: 200 },
    { label: "Livello di esperienza*", name: "anniEsperienza", type: "select", options: seniorityOptions },
    { label: "Skills", name: "idSkills", type: "multipleSelect", options: skillsOptions },
    { label: "Descrizione", name: "note", type: "note", maxLength: 4000 },
  ];

  const initialValues = {
    id: datiModifica.id,
    descrizione: datiModifica.descrizione || null,
    tipologia: datiModifica.tipologia || null,
    modalitaLavoro: datiModifica.modalitaLavoro || null,
    modalitaImpiego: datiModifica.modalitaImpiego || null,
    location: datiModifica.location || null,
    anniEsperienza: datiModifica.anniEsperienza || null,
    idSkills: datiModifica.skills ? datiModifica.skills.map((skills) => skills.id) : [],
    note: datiModifica.note || null,
  };

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
        case "text":
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

        case "note":
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

        case "select":
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

        case "multipleSelect":
          return (
            <CustomMultipleSelectAggiunta
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

        default:
          return null;
      }
    }
  };

  return (
    
    <Box sx={{ pl: 10, pr: 10, pt: 2, pb: 2 }}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid
              item
              xs={12}
              md={
                ["note", "descrizione", "tipologia"].includes(field.name) ? 12 : 6
              }
              key={index}
            >
              {renderFields(field)}
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default FormNeedCliente;
