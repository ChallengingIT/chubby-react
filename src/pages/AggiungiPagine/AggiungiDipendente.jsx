import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldBoxFile from "../../components/FieldBoxFile";
import FieldsBox from "../../components/FieldsBox";
import { Box, Typography, Alert, Snackbar } from "@mui/material";

const AggiungiDipendente = () => {
  const navigate = useNavigate();
  const [ jobTitleOptions,                setJobTitleOptions                  ] = useState([]);
  const [ skillsOptions,                  setSkillsOptions                    ] = useState([]);
  const [ facoltaOptions,                 setFacoltaOptions                   ] = useState([]);
  const [ livelloScolasticoOptions,       setLivelloScolasticoOptions         ] = useState([]);
  const [ contrattoOptions,               setContrattoOptions                 ] = useState([]);
  const [ alert,                          setAlert                            ] = useState(false);

      const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = user?.accessToken;
  
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };



  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
    

        const responseJobTitle              = await axios.get("http://89.46.196.60:8443/aziende/react/tipologia" , { headers: headers });
        const responseSkill                 = await axios.get("http://89.46.196.60:8443/staffing/react/skill"    , { headers: headers });
        const facoltaResponse               = await axios.get("http://89.46.196.60:8443/staffing/react/facolta"  , { headers: headers });
        const livelloScolasticoResponse     = await axios.get("http://89.46.196.60:8443/staffing/react/livello"  , { headers: headers });
        const contrattoResponse             = await axios.get("http://89.46.196.60:8443/hr/react/tipocontratto"  , { headers: headers });

        if (Array.isArray(contrattoResponse.data)) {
          const contrattoOptions = contrattoResponse.data.map((contratto) => ({
            label: contratto.descrizione,
            value: contratto.id,
          }));
          setContrattoOptions(contrattoOptions);


        if (Array.isArray(livelloScolasticoResponse.data)) {
          const livelloScolasticoOptions = livelloScolasticoResponse.data.map((livelloScolastico) => ({
            label: livelloScolastico.descrizione,
            value: livelloScolastico.id,
          }));
          setLivelloScolasticoOptions(livelloScolasticoOptions);


        if (Array.isArray(facoltaResponse.data)) {
          const facoltaOptions = facoltaResponse.data.map((facolta) => ({
            label: facolta.descrizione,
            value: facolta.id,
          }));
          setFacoltaOptions(facoltaOptions);


          if (Array.isArray(responseSkill.data)) {
            const skillsOptions = responseSkill.data.map((skill) => ({
              value: skill.id,
              label: skill.descrizione
            }));
            setSkillsOptions(skillsOptions);
    
          if (Array.isArray(responseJobTitle.data)) {
            const jobTitleOptions = responseJobTitle.data.map((jobTitle) => ({
              label: jobTitle.descrizione,
              value: jobTitle.id,
            }));
            setJobTitleOptions(jobTitleOptions);

          }
        }
      }
    }
  }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlert({ ...alert, open: false });
};

const campiObbligatori = [ "nome", "cognome", "email", "anniEsperienza", "livelloScolastico", "tipologia", "tipologiaContratto", "citta", "dataNascita" ];
  const fields = [
    { label: "Nome*",                         name: "nome",               type: "text" },
    { label: "Cognome*",                      name: "cognome",            type: "text" },
    { label: "Data di Nascita*",              name: "dataNascita",        type: "date" },
    { label: "Luogo di Nascita",              name: "luogoNascita",       type: "text" },
    { label: "Email*",                        name: "email",              type: "text" },
    { label: "Cellulare",                     name: "cellulare",          type: "text" },
    { label: "Residenza*",                    name: "citta",              type: "text" },
    { label: "Data Inizio",                   name: "dataInizio",         type: "date" },
    { label: "Scadenza Contratto",            name: "dataScadenza",       type: "date" },
    { label: "Anni Esperienza*",              name: "anniEsperienza",     type: "decimalNumber" },
    { label: "Livello Scolastico*",           name: "livelloScolastico",  type: "select",                      options: livelloScolasticoOptions },
    { label: "Facoltà",                       name: "facolta",            type: "select",                      options: facoltaOptions},
    { label: "IBAN",                          name: "iban",               type:"text"  },
    { label: "Codice Fiscale",                name: "codFiscale",         type:"text"  },
    { label: "RAL/Tariffa",                   name: "ral",                type:"text"  },
    { label: "Job Title*",                    name: "tipologia",          type: "select",                       options: jobTitleOptions },
    { label: "Seleziona le skill",            name: "skills",             type: "multipleSelectSkill",          options: skillsOptions },
    { label: "Tipologia Contratto*",          name: "tipologiaContratto", type: "select",                       options: contrattoOptions },
    { label: "Note",                          name: "note",               type: "note" },
    { label: "Allegati",                      name: "file",               type: "modificaAllegati" },
  ];




const handleSubmit = async (values, fileCV, fileCF, fileMultipli, fileAllegati) => {
  const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {

    try {

      Object.keys(values).forEach(key => {
        if (!campiObbligatori.includes(key) && !values[key]) {
          values[key] = null;
        }
      });
      const skills = values.skills ? values.skills.join(',') : '';
      delete values.skills;
      const datiResponse = await axios.post("http://89.46.196.60:8443/hr/react/staff/salva", values, {
        params: { skill: skills },
        headers: headers,
      });
    const staffId = datiResponse.data;

    if (fileAllegati && fileAllegati.length > 0) {
      fileAllegati.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file.file);
    
        try {
          const fileResponse = await axios.post(`http://89.46.196.60:8443/hr/react/staff/salva/file/${staffId}`, formData, { headers: headers });
        } catch (error) {
          console.error("Errore nell'invio del file: ", error);
        }
      });
      if (datiResponse.data === "DUPLICATO") {
        setAlert({ open: true, message: "Email già utilizzata!" });
        console.error("L'email fornita è già in uso.");
        return; 
      }
    }
      navigate("/hr");
  
  } catch (error) {
    console.error("Errore nell'invio dei dati: ", error);
  }
}else {
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi un nuovo dipendente</Typography>
          <FieldBoxFile 
          fields={fields} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title="" 
          skillsOptions={skillsOptions} 
          />
       </Box>
      </Box>
  );
};

export default AggiungiDipendente;