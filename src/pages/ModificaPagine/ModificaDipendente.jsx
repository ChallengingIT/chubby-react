import React, { useState, useEffect }       from "react";
import { useNavigate, useLocation }         from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../../components/Sidebar";
import FieldBoxFile                         from "../../components/FieldBoxFile";
import { Box, Typography } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";


const ModificaDipendente = () => {

    const navigate                        = useNavigate();
    const location                        = useLocation();
    const { dipendentiData = {} }         = location.state || {};
    const nomeDipendente                  = dipendentiData.nome;
    const cognomeDipendente               = dipendentiData.cognome;
    const idStaff                         = dipendentiData.id;
  
  
    const [ tipologiaOptions,               setTipologiaOptions                 ] = useState([]);
    const [ skillsOptions,                  setSkillsOptions                    ] = useState([]);
    const [ facoltaOptions,                 setFacoltaOptions                   ] = useState([]);
    const [ livelloScolasticoOptions,       setLivelloScolasticoOptions         ] = useState([]);
    const [ tipologiaContrattoOptions,      setTipologiaContrattoOptions        ] = useState([]);
  
  
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
  
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
  
    useEffect(() => {
      const fetchAziendeOptions = async () => {
        try {
          const responseTipologia                      = await axios.get("http://89.46.196.60:8443/aziende/react/tipologia" , { headers: headers });
          const skillsResponse                         = await axios.get("http://89.46.196.60:8443/staffing/react/skill"    , { headers: headers });
          const facoltaResponse                        = await axios.get("http://89.46.196.60:8443/staffing/react/facolta"  , { headers: headers });
          const livelloScolasticoResponse              = await axios.get("http://89.46.196.60:8443/staffing/react/livello"  , { headers: headers });
          const tipologiaContrattoResponse             = await axios.get("http://89.46.196.60:8443/hr/react/tipocontratto"  , { headers: headers });
  
          if (Array.isArray(tipologiaContrattoResponse.data)) {
            const tipologiaContrattoOptions = tipologiaContrattoResponse.data.map((tipologiaContratto) => ({
              label: tipologiaContratto.descrizione,
              value: tipologiaContratto.id,
            }));
            setTipologiaContrattoOptions(tipologiaContrattoOptions);
  
  
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
  
            if (Array.isArray(skillsResponse.data)) {
              const skillsOptions = skillsResponse.data.map((skills) => ({
                label: skills.descrizione,
                value: skills.id,
              }));
              setSkillsOptions(skillsOptions);
  
  
          if (Array.isArray(responseTipologia.data)) {
            const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
              label: tipologia.descrizione,
              value: tipologia.id,
            }));
            setTipologiaOptions(tipologiaOptions);
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

    const initialValues = {
      id:                                               dipendentiData.id                                                                     || null,
      nome:                                             dipendentiData.nome                                                                   || null,
      cognome:                                          dipendentiData.cognome                                                                || null,
      dataNascita:                                      dipendentiData.dataNascita                                                            || null,
      luogoNascita:                                     dipendentiData.luogoNascita                                                           || null,
      email:                                            dipendentiData.email                                                                  || null,
      cellulare:                                        dipendentiData.cellulare                                                              || null,
      citta:                                            dipendentiData.citta                                                                  || null,
      dataInizio:                                       dipendentiData.dataInizio                                                             || null,
      dataScadenza:                                     dipendentiData.dataScadenza                                                           || null,
      anniEsperienza:                                   dipendentiData.anniEsperienza                                                         || null,
      livelloScolastico:                                dipendentiData.livelloScolastico  && dipendentiData.livelloScolastico.id              || null,
      facolta:                                          dipendentiData.facolta            && dipendentiData.facolta.id                        || null,
      iban:                                             dipendentiData.iban                                                                   || null,
      codFiscale:                                       dipendentiData.codFiscale                                                             || null,
      ral:                                              dipendentiData.ral                                                                    || null,
      tipologia:                                        dipendentiData.tipologia          && dipendentiData.tipologia.id                      || null,
      skills:                                         (dipendentiData.skills?.map(skills => skills?.id))                                      || [],
      tipologiaContratto:                               dipendentiData.tipologiaContratto && dipendentiData.tipologiaContratto.id             || null,
      note:                                             dipendentiData.note                                                                   || null,
      files: (dipendentiData.files?.map(file => {
        return {
          id: file.id, 
          descrizione: file.descrizione
        };
      })) || [],
    };


    const fields = [
        { label: "Nome*",                               name: "nome",                                           type: "text" },
        { label: "Cognome*",                            name: "cognome",                                        type: "text" },
        { label: "Data di Nascita*",                    name: "dataNascita",                                    type: "date" },
        { label: "Luogo di Nascita",                    name: "luogoNascita",                                   type: "text" },
        { label: "Email*",                              name: "email",                                          type: "text" },
        { label: "Cellulare",                           name: "cellulare",                                      type: "text" },
        { label: "Residenza*",                          name: "citta",                                          type: "text" },
        { label: "Data Inizio",                         name: "dataInizio",                                     type: "date" },
        { label: "Scadenza Contratto",                  name: "dataScadenza",                                   type: "date" },
        { label: "Anni Esperienza*",                    name: "anniEsperienza",                                 type: "decimalNumber" },
        { label: "Livello Scolastico*",                 name: "livelloScolastico",                              type: "select",               options: livelloScolasticoOptions },
        { label: "Facoltà",                             name: "facolta",                                        type: "select",               options: facoltaOptions},
        { label: "IBAN",                                name: "iban",                                           type: "text"  },
        { label: "Codice Fiscale",                      name: "codFiscale",                                     type: "text"  },
        { label: "RAL/Tariffa",                         name: "ral",                                            type: "text"  },
        { label: "Job Title",                           name: "tipologia",                                      type: "select",               options: tipologiaOptions },
        { label: "Seleziona le Skills",                 name: "skills",                                         type: "multipleSelectSkill",  options: skillsOptions },
        { label: "Tipologia Contratto",                 name: "tipologiaContratto",                             type: "select",               options: tipologiaContrattoOptions },
        { label: "Note",                                name: "note",                                           type: "note"  },
        { lavel: "Allegati",                            name: "files",                                          type: "modificaAllegati",     files: initialValues.files},
    ];
  
 

    const campiObbligatori = [ "nome"];




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

      const allegati = values.files;
      delete values.files;

      const datiResponse = await axios.post("http://89.46.196.60:8443/hr/react/staff/salva", values, {
        params: { skill: skills },
        headers: headers,
      });
    const staffId = datiResponse.data;
    if (fileAllegati && fileAllegati.length > 0) {
      fileAllegati.forEach(async (file) => {
        if(file.isNew) {
        const formData = new FormData();
        formData.append("file", file.file);
        try {
          const fileResponse = await axios.post(`http://89.46.196.60:8443/hr/react/staff/salva/file/${staffId}`, formData, { headers: headers });
        } catch (error) {
          console.error("Errore nell'invio del file: ", error);
        }
      }
      });
      
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
            <Sidebar2 />
            <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
            <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Modifica di {nomeDipendente} {cognomeDipendente}</Typography>
            <FieldBoxFile
            fields={fields}
            initialValues={initialValues}
            campiObbligatori={campiObbligatori}
            onSubmit        ={handleSubmit} 
            title=""
            // onDeleteAllegati = {handleDeleteAllegati}
            skillsOptions={skillsOptions} 
            idStaff={idStaff}
              />
                </Box>
          </Box>
    
    );
  };
  
  export default ModificaDipendente;
  

