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

  console.log("Dati Arrivati: ", needData);


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseAziende      = await axios.get("http://localhost:8080/aziende/react");
        const responseSkill        = await axios.get("http://localhost:8080/staffing/react/skill");
        const responseSkill2       = await axios.get("http://localhost:8080/staffing/react/skill");
        const ownerResponse        = await axios.get("http://localhost:8080/aziende/react/owner");
        const tipologiaResponse    = await axios.get("http://localhost:8080/need/react/tipologia");
        const statoResponse        = await axios.get("http://localhost:8080/need/react/stato");


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

  const campiObbligatori = [ "descrizione", "priorita", "week", "tipo", "owner", "stato"]; 

  const fields = [
    { label: "Descrizione",         name: "descrizione",            type: "text" },
    { label: "Priorità",            name: "priorita",               type: "text" },
    { label: "Week",                name: "week",                   type: "weekPicker" },
    { label: "Tipologia",           name: "tipologia",              type: "select",          options: tipologiaOptions },
    { label: "Tipologia Azienda",   name: "tipo",                   type: "select",          options: [ 
      { value: 1, label: "Cliente"},
      { value: 2, label: "Consulenza"}, 
      {value: 3, label: "Prospect" },
      ] },
    { label: "Owner",               name: "owner",                  type: "select",          options: ownerOptions },
    { label: "Stato",               name: "stato",                  type: "select",          options: statoOptions },
    { label: "Headcount",           name: "numeroRisorse",          type: "text" },
    { label: "Location",            name: "location",               type: "text" },
    { label: "Skills 1",            name: "skills",                 type: "multipleSelectSkill",  options: skillsOptions },
    { label: "Skills 2",            name: "skills2",                type: "multipleSelectSkill2",  options: skillsOptions },
    { label: "Seniority",           name: "anniEsperienza",         type: "text" },
    { label: "Note",                name: "note",                   type: "note" },
  ];


  // console.log("Valore di week:", needData.week);


  const initialValues = {
    id:                         needData.id                                                 || "",
    descrizione:                needData.descrizione                                        || "",
    priorita:                   needData.priorita                                           || "",
    week:                       needData.week                                               || "",
    tipologia:                  needData.tipologia && needData.tipologia.id                 || "",
    tipo:                       needData.tipo                                               || "",
    owner:                      needData.owner     && needData.owner.id                     || "",
    stato:                      needData.stato     && needData.stato.id                     || "",
    numeroRisorse:              needData.numeroRisorse                                      || "",
    location:                   needData.location                                           || "",
    skills:                    (needData.skills?.map(skill => skill?.id))                   || [],
    skills2:                   (needData.skills2?.map(skill => skill?.id))                  || [],
    anniEsperienza:             needData.anniEsperienza                                     || "",
    note:                       needData.note                                               || "",          
  };




  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      let skills = "";
      let skills2 = "";

      if(values.skills && values.skills.length && values.skills2 && values.skills2.length) {

        skills = values.skills.join(',');
        skills2 = values.skills2.join(',');
    
        console.log("DATI DI SOLE SKILLS: ", skills);
        console.log("DATI DI SOLE SKILLS2: ", skills2);
    
        delete values.skills;
        delete values.skills2;
    }
    const response = await axios.post("http://localhost:8080/need/react/salva", values, {
      params: { skill1: skills, skill2: skills2 }
    });

    console.log("DATI IN VALUES: ", values);

    console.log("Risposta dal server:", response.data);
    navigate("/need");
  } catch (error) {
    console.error("Errore durante il salvataggio:", error);
    if (error.response) {
      console.error("Dettagli dell'errore:", error.response.data);
    }
  

    }
  } else {
    // Gestisci qui gli errori di validazione...
    console.log("Errore di validazione:", errors);
    // Potresti voler impostare lo stato degli errori o visualizzare un messaggio all'utente
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
