import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomAutocomplete from "../../components/fields/CustomAutocomplete";
import CustomMultipleSelectModifica from "../../components/fields/CustomMultipleSelectModifica";
import { Box, Skeleton, Grid } from "@mui/material";
import CustomTextFieldModifica from "../fields/CustomTextFieldModifica";
import CustomNoteModifica from "../fields/CustomNoteModifica";
import CustomAutocompleteSeniority from "../fields/CustomAutocompleteSeniority";

const FormNeedCliente = ({ idNeed }) => {
  const { id } = useParams();
  const idAzienda = id;

  const [alert, setAlert] = useState({ open: false, message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [datiModifica, setDatiModifica] = useState({});
  const [impiegoOptions, setImpiegoOptions] = useState([]);
  const [lavoroOptions, setLavoroOptions] = useState([]);
  const [jobtitleOptions, setJobtitleOptions] = useState([]);
  const [values, setValues] = useState({ idAzienda });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchNeedOptions = async () => {
      try {
        const responseSkill = await axios.get(
          "http://localhost:8080/staffing/react/skill",
          { headers: headers }
        );
        const needResponse = await axios.get(
          `http://localhost:8080/need/react/${idNeed}`,
          { headers: headers }
        );

        const impiegoResponse = await axios.get(
          "http://localhost:8080/need/impiego",
          { headers: headers }
        );

        const lavoroResponse = await axios.get(
          "http://localhost:8080/need/lavoro",
          { headers: headers }
        );

        const responseJobtitle = await axios.get(
          "http://localhost:8080/aziende/react/tipologia",
          { headers: headers }
        );

        if (Array.isArray(responseJobtitle.data)) {
          const jobtitleOptions = responseJobtitle.data.map((jobtitle) => ({
            label: jobtitle.descrizione,
            value: jobtitle.id,
          }));
          setJobtitleOptions(jobtitleOptions);
        }

        const modificaData = needResponse.data;
        const aziendaId = needResponse.data.cliente.id;
        setDatiModifica(modificaData);
        setValues({
          ...modificaData,
          idAzienda: aziendaId,
          idSkills: modificaData.skills
            ? modificaData.skills.map((skill) => skill.id)
            : [],
        });

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
  }, [idNeed]);

  const handleChange = (fieldValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...fieldValue,
    }));
  };

  const handleChangeSkill = (fieldValue) => {
    const fieldName = Object.keys(fieldValue)[0];
    const newSelections = fieldValue[fieldName];

    setValues((prevValues) => {
      const currentSelections = prevValues[fieldName] || [];

      const selectionsToAdd = newSelections.filter(
        (selection) => !currentSelections.includes(selection)
      );

      const selectionsToRemove = currentSelections.filter(
        (selection) => !newSelections.includes(selection)
      );

      const updatedSelections = currentSelections
        .filter((selection) => !selectionsToRemove.includes(selection))
        .concat(selectionsToAdd);

      return {
        ...prevValues,
        [fieldName]: updatedSelections,
      };
    });
  };

  const handleCloseAlert = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const fieldMapping = {
    idSkills: "skills",
  };

  const replaceKeysInValues = (values, mapping) => {
    const newValues = { ...values };
    Object.keys(mapping).forEach((key) => {
      if (key in newValues) {
        const newKey = mapping[key];
        newValues[newKey] = newValues[key];
        delete newValues[key];
      }
    });
    return newValues;
  };

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

        const transformedValues = replaceKeysInValues(values, fieldMapping);

        const responseSaveNeed = await axios.post(
          "http://localhost:8080/need/react/salva",
          transformedValues,
          {
            params: { skill: skills },
            headers: headers,
          }
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
    { label: "Neo", value: 1 },
    { label: "Junior", value: 2 },
    { label: "Middle", value: 3 },
    { label: "Senior", value: 4 },
    ...(values.anniEsperienza > 4 ? [{ label: "Senior", value: values.anniEsperienza }] : [])
  ];
  

  const getSeniorityLabel = (value) => {
    if (value > 4) return "Senior";
    const option = seniorityOptions.find((opt) => opt.value === value);
    return option ? option.label : "Unknown";
  };

  const fieldObbligatori = [
    "descrizione",
    "tipologia",
    "modalitaLavoro",
    "modalitaImpiego",
    "localita",
    "anniEsperienza",
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
    idSkills: datiModifica.skills
      ? datiModifica.skills.map((skills) => skills.id)
      : [],
    note: datiModifica.note || null,
  };

  const renderFieldSkeleton = (type) => {
    switch (type) {
      case "text":
        return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

      case "note":
        return <Skeleton variant="text" width={710} height={120} />;

      case "select":
      case "multipleSelect":
        return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;

      default:
        return <Skeleton variant="text" sx={{ fontSize: "3rem" }} />;
    }
  };

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
            <CustomMultipleSelectModifica
              name={field.name}
              label={field.label}
              value={values[field.name] || []}
              onChange={handleChangeSkill}
              skillsOptions={skillsOptions}
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
            md={["note", "descrizione", "tipologia"].includes(field.name) ? 12 : 6}
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
