import React, { useState, useEffect }       from "react";
import { useNavigate, useLocation }         from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../../components/Sidebar";
import FieldBoxFile from "../../components/FieldBoxFile";



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
  
  
     // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
  
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
  
    useEffect(() => {
      const fetchAziendeOptions = async () => {
        try {
          const responseTipologia                      = await axios.get("https://89.46.67.198:8443/aziende/react/tipologia" , { headers: headers });
          const skillsResponse                         = await axios.get("https://89.46.67.198:8443/staffing/react/skill"    , { headers: headers });
          const facoltaResponse                        = await axios.get("https://89.46.67.198:8443/staffing/react/facolta"  , { headers: headers });
          const livelloScolasticoResponse              = await axios.get("https://89.46.67.198:8443/staffing/react/livello"  , { headers: headers });
          const tipologiaContrattoResponse             = await axios.get("https://89.46.67.198:8443/hr/react/tipocontratto"  , { headers: headers });
  
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
      id:                                               dipendentiData.id                                                                     || "",
      nome:                                             dipendentiData.nome                                                                   || "",
      cognome:                                          dipendentiData.cognome                                                                || "",
      dataNascita:                                      dipendentiData.dataNascita                                                            || "",
      luogoNascita:                                     dipendentiData.luogoNascita                                                           || "",
      email:                                            dipendentiData.email                                                                  || "",
      cellulare:                                        dipendentiData.cellulare                                                              || "",
      citta:                                            dipendentiData.citta                                                                  || "",
      dataInizio:                                       dipendentiData.dataInizio                                                             || "",
      dataScadenza:                                     dipendentiData.dataScadenza                                                           || "",
      anniEsperienza:                                   dipendentiData.anniEsperienza                                                         || "",
      livelloScolastico:                                dipendentiData.livelloScolastico  && dipendentiData.livelloScolastico.id              || "",
      facolta:                                          dipendentiData.facolta            && dipendentiData.facolta.id                        || "",
      iban:                                             dipendentiData.iban                                                                   || "",
      codFiscale:                                       dipendentiData.codFiscale                                                             || "",
      ral:                                              dipendentiData.ral                                                                    || "",
      tipologia:                                        dipendentiData.tipologia          && dipendentiData.tipologia.id                      || "",
      skills:                                         (dipendentiData.skills?.map(skills => skills?.id))                                       || [],
      tipologiaContratto:                               dipendentiData.tipologiaContratto && dipendentiData.tipologiaContratto.id             || "",
      note:                                             dipendentiData.note                                                                   || "",
      files: (dipendentiData.files?.map(file => {
        return {
          id: file.id, 
          descrizione: file.descrizione
        };
      })) || [],
    };


    const fields = [
        { label: "Nome",                                name: "nome",                                           type: "text" },
        { label: "Cognome",                             name: "cognome",                                        type: "text" },
        { label: "Data di Nascita",                     name: "dataNascita",                                    type: "date" },
        { label: "Luogo di Nascita",                    name: "luogoNascita",                                   type: "text" },
        { label: "Email",                               name: "email",                                          type: "text" },
        { label: "Cellulare",                           name: "cellulare",                                      type: "text" },
        { label: "Residenza",                           name: "citta",                                          type: "text" },
        { label: "Data Inizio",                         name: "dataInizio",                                     type: "date" },
        { label: "Scadenza Contratto",                  name: "dataScadenza",                                   type: "date" },
        { label: "Anni Esperienza",                     name: "anniEsperienza",                                 type: "text" },
        { label: "Livello Scolastico",                  name: "livelloScolastico",                              type: "select",               options: livelloScolasticoOptions },
        { label: "Facoltà",                             name: "facolta",                                        type: "select",               options: facoltaOptions},
        { label: "IBAN",                                name: "iban",                                           type:"text"   },
        { label: "Codice Fiscale",                      name: "codFiscale",                                     type:"text"   },
        { label: "RAL/Tariffa",                         name: "ral",                                            type:"text"   },
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
      // Preparazione dei dati delle skills come stringhe separate
      const skills = values.skills ? values.skills.join(',') : '';


      delete values.skills;

      const allegati = values.files;
      delete values.files;

      const datiResponse = await axios.post("https://89.46.67.198:8443/hr/react/staff/salva", values, {
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
          const fileResponse = await axios.post(`https://89.46.67.198:8443/hr/react/staff/salva/file/${staffId}`, formData, { headers: headers });
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
      <div className="container">
        <div className="content">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="container">
            <div className="page-name">Modifica Staff {nomeDipendente} {cognomeDipendente} </div>
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
          </div>
        </div>
      </div>
    );
  };
  
  export default ModificaDipendente;
  

