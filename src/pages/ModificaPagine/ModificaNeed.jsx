import React, { useState, useEffect }             from "react";
import { useNavigate, useLocation }               from "react-router-dom";
import axios                                      from "axios";
import Sidebar                                    from "../../components/Sidebar";
import FieldsBox                                  from "../../components/FieldsBox";



const ModificaNeed = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { needData = {} } = location.state || {};

  const [ aziendeOptions,         setAziendeOptions   ] = useState([]);
  const [ skillsOptions,          setSkillsOptions    ] = useState([]);
  const [ skills2Options,         setSkill2sOptions   ] = useState([]);
  const [ ownerOptions,           setOwnerOptions     ] = useState([]);
  const [ tipologiaOptions,       setTipologiaOptions ] = useState([]);
  const [ statoOptions,           setStatoOptions     ] = useState([]);


  // Recupera l'accessToken da localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  const navigateBack = () => {
    navigate(-1); 
  };



  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseAziende      = await axios.get("https://localhost:8443/aziende/react", { headers: headers });
        const responseSkill        = await axios.get("https://localhost:8443/staffing/react/skill", { headers: headers });
        const responseSkill2       = await axios.get("https://localhost:8443/staffing/react/skill", { headers: headers });
        const ownerResponse        = await axios.get("https://localhost:8443/aziende/react/owner", { headers: headers });
        const tipologiaResponse    = await axios.get("https://localhost:8443/need/react/tipologia", { headers: headers });
        const statoResponse        = await axios.get("https://localhost:8443/need/react/stato", { headers: headers });


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
        console.error("Errore durante il recupero delle province:", error);
      }
    };
    fetchAziendeOptions();
  }, []);

  const campiObbligatori = [ "descrizione", "priorita", "week"]; 

  const fields = [
    { label: "Descrizione",         name: "descrizione",            type: "text" },
    { label: "Priorità",            name: "priorita",               type: "text" },
    { label: "Week",                name: "week",                   type: "weekPicker" },
    { label: "Tipologia",           name: "tipologia",              type: "select",               options: tipologiaOptions },
    { label: "Tipologia Azienda",   name: "tipo",                   type: "select",               options: [ 
      { value: 1, label: "Cliente"},
      { value: 2, label: "Consulenza"}, 
      { value: 3, label: "Prospect" },
      ] },
    { label: "Owner",               name: "owner",                  type: "select",               options: ownerOptions },
    { label: "Stato",               name: "stato",                  type: "select",               options: statoOptions },
    { label: "Headcount",           name: "numeroRisorse",          type: "text" },
    { label: "Location",            name: "location",               type: "text" },
    { label: "Skills 1",            name: "skills",                 type: "multipleSelectSkill",  options: skillsOptions },
    { label: "Skills 2",            name: "skills2",                type: "multipleSelectSkill2", options: skillsOptions },
    { label: "Seniority",           name: "anniEsperienza",         type: "text" },
    { label: "Note",                name: "note",                   type: "note" },
  ];




  const initialValues = {
    id:                         needData.id                                                 ,
    descrizione:                needData.descrizione                                        || null,
    priorita:                   needData.priorita                                           || null,
    week:                       needData.week                                               || null,
    tipologia:                  needData.tipologia && needData.tipologia.id                 || null,
    tipo:                       needData.tipo                                               || null,
    owner:                      needData.owner     && needData.owner.id                     || null,
    stato:                      needData.stato     && needData.stato.id                     || null,
    numeroRisorse:              needData.numeroRisorse                                      || null,
    location:                   needData.location                                           || null,
    skills:                    (needData.skills?.map(skill => skill?.id))                   || null,
    skills2:                   (needData.skills2?.map(skill => skill?.id))                  || null,
    anniEsperienza:             needData.anniEsperienza                                     || null,
    note:                       needData.note                                               || null,          
  };




  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

    const skills = values.skills ? values.skills.join(',') : null;
    const skills2 = values.skills2 ? values.skills2.join(',') : null;
    delete values.skills;
    delete values.skills2;



    const response = await axios.post("https://localhost:8443/need/react/salva", values, {
      params: { skill1: skills, skill2: skills2 },
      headers: headers
    });

   

    navigateBack();
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name" style={{ margin: "20px", fontSize: "15px"}}>
            <h1>{`Modifica Need di ${needData.cliente.denominazione}`}
            </h1>
          </div>
          <FieldsBox
          fields={fields}
          initialValues={initialValues}
          campiObbligatori={campiObbligatori}
          onSubmit={handleSubmit}
          title=""
          skillsOptions={skillsOptions} 
          skills2Options={skills2Options}
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaNeed;
