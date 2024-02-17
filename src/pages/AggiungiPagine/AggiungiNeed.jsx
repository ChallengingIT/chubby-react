import React, { useState, useEffect }     from "react";
import { useNavigate, useLocation }       from "react-router-dom";
import axios                              from "axios";
import Sidebar                            from "../../components/Sidebar";
import { Box, Typography } from "@mui/material";



import FieldsBox from "../../components/FieldsBox";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const AggiungiNeed = () => {
  const navigate   = useNavigate();

  const [ aziendeOptions,       setAziendeOptions     ] = useState([]);
  const [ skillsOptions,        setSkillsOptions      ] = useState([]);
  const [ skills2Options,       setSkill2sOptions     ] = useState([]);
  const [ ownerOptions,         setOwnerOptions       ] = useState([]);
  const [ tipologiaOptions,     setTipologiaOptions   ] = useState([]);
  const [ statoOptions,         setStatoOptions       ] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };



  useEffect(() => {
    const fetchNeedOptions = async () => {
      try {
        const responseAziende       = await axios.get("http://89.46.67.198:8443/aziende/react/select", { headers: headers });
        const responseSkill         = await axios.get("http://89.46.67.198:8443/staffing/react/skill", { headers: headers });
        const responseSkill2        = await axios.get("http://89.46.67.198:8443/staffing/react/skill", { headers: headers });
        const ownerResponse         = await axios.get("http://89.46.67.198:8443/aziende/react/owner" , { headers: headers });
        const tipologiaResponse     = await axios.get("http://89.46.67.198:8443/need/react/tipologia", { headers: headers });
        const statoResponse         = await axios.get("http://89.46.67.198:8443/need/react/stato"    , { headers: headers});


        if (Array.isArray(statoResponse.data)) {
          const statoOptions = statoResponse.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);



        if (Array.isArray(tipologiaResponse.data)) {
          const tipologiaOptions = tipologiaResponse.data.map((tipologia) => ({
            label: tipologia.descrizione,
            value: tipologia.id,
          }));
          setTipologiaOptions(tipologiaOptions);



        if (Array.isArray(ownerResponse.data)) {
          const ownerOptions = ownerResponse.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);


      if (Array.isArray(responseSkill.data)) {
        const skillsOptions = responseSkill.data.map((skill) => ({
          value: skill.id,
          label: skill.descrizione
        }));
        setSkillsOptions(skillsOptions);

        if (Array.isArray(responseSkill2.data)) {
          const skills2Options = responseSkill2.data.map((skill2) => ({
            value: skill2.id,
            label: skill2.descrizione
          }));
          setSkill2sOptions(skills2Options);

        if (Array.isArray(responseAziende.data)) {
          const ownerOptions = responseAziende.data.map((aziende) => ({
            label: aziende.denominazione,
            value: aziende.id,
          }));
          setAziendeOptions(ownerOptions);
          
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
        }
      }
    }
  }
}
        }
      } catch (error) {
        console.error("Errore durante il recupero delle aziende:", error);
      }
    };

    fetchNeedOptions();
  }, []);

  const campiObbligatori = [ "idAzienda", "descrizione", "priorita", "week"]; 

  const fields = [
    { label: "Azienda*",            name: "idAzienda",                    type: "select",           options: aziendeOptions },
    { label: "Descrizione Need*",   name: "descrizione",                  type: "text" },
    { label: "Priorità*",           name: "priorita",                     type: "number" },
    { label: "Week*",               name: "week",                         type: "weekPicker" },
    { label: "Tipologia",           name: "tipologia",                    type: "select",           options: tipologiaOptions  },
    { label: "Tipologia Azienda",   name: "tipo",                         type: "select",           options: [
    { value: 1,                   label: "Cliente" },
    { value: 2,                   label: "Consulenza" },
    { value: 3,                   label: "Prospect" }
  ] },
    { label: "Owner",             name: "idOwner",                      type: "select",                options: ownerOptions },
    { label: "Stato",             name: "stato",                        type: "select",                options: statoOptions },
    { label: "Headcount",         name: "numeroRisorse",                type: "number" },
    { label: "Location",          name: "location",                     type: "text" },
    { label: "Skills 1",          name: "skills",                       type: "multipleSelectSkill",    options: skillsOptions },
    { label: "Skills 2",          name: "skills2",                      type: "multipleSelectSkill2",   options: skills2Options },
    { label: "Seniority",         name: "anniEsperienza",               type: "decimalNumber" },
    { label: "Note",              name: "note",                         type: "note" },
  ];



  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
      try {
        const skills = values.skills ? values.skills.join(',') : '';
        const skills2 = values.skills2 ? values.skills2.join(',') : '';

        delete values.skills;
        delete values.skills2;
  
        const response = await axios.post("http://89.46.67.198:8443/need/react/salva", values, {
          params: {
            skill1: skills,
            skill2: skills2
          },
          headers: headers
        });
  
        navigate("/need");
      } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        if (error.response) {
          console.error("Dettagli dell'errore:", error.response.data);
        }
      }
    }
  };
  

  const validateFields = (values) => {
    let errors = {};
    campiObbligatori.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Questo campo è obbligatorio';
      }
    });
    return errors;
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar2 />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi un nuovo Need</Typography>

          <FieldsBox
          fields={fields}
          campiObbligatori={campiObbligatori}
          onSubmit={handleSubmit}
          title=""
          skillsOptions={skillsOptions} 
          skills2Options={skills2Options}
    />
         </Box>
      </Box>
  );
};

export default AggiungiNeed;
