import React, { useState, useEffect }                from "react";
import { useNavigate, useLocation, useParams }       from "react-router-dom";
import axios                                         from "axios";
import Sidebar                                       from "../../components/Sidebar";



import FieldsBox from "../../components/FieldsBox";

const AggiungiNeedID = () => {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const location = useLocation();
  const aziendaData = location.state?.aziendaData;
  console.log("Nome Azienda e id Azienda:", aziendaData);
  

  const [ aziendeOptions,       setAziendeOptions     ] = useState([]);
  const [ skillsOptions,        setSkillsOptions      ] = useState([]);
  const [ skills2Options,       setSkill2sOptions     ] = useState([]);
  const [ ownerOptions,         setOwnerOptions       ] = useState([]);
  const [ tipologiaOptions,     setTipologiaOptions   ] = useState([]);
  const [ statoOptions,         setStatoOptions       ] = useState([]);


  // Recupera l'accessToken da localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };



  useEffect(() => {
    const fetchNeedOptions = async () => {
      try {
        const responseAziende       = await axios.get("http://localhost:8080/aziende/react"       , { headers: headers });
        const responseSkill         = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
        const responseSkill2        = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
        const ownerResponse         = await axios.get("http://localhost:8080/aziende/react/owner" , { headers: headers });
        const tipologiaResponse     = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers });
        const statoResponse         = await axios.get("http://localhost:8080/need/react/stato"    , { headers: headers });


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

  const campiObbligatori = [ "idAzienda", "descrizione", "priorita", "week", "tipo", "idOwner", "stato"]; 

  const fields = [
    { label: "Azienda",           name: "idAzienda",                    type: "text",           disabled:true },
    { label: "Descrizione Need",  name: "descrizione",                  type: "text" },
    { label: "Priorità",          name: "priorita",                     type: "text" },
    { label: "Week",              name: "week",                         type: "weekPicker" },
    { label: "Tipologia",         name: "tipologia",                    type: "select",           options: tipologiaOptions  },
    { label: "Tipologia Azienda", name: "tipo",                         type: "select",           options: [ 
    { value: 1,                   label: "Cliente" },
    { value: 2,                   label: "Consulenza" },
    { value: 3,                   label: "Prospect" }
  ] },
    { label: "Owner",             name: "idOwner",                      type: "select",           options: ownerOptions },
    { label: "Stato",             name: "stato",                        type: "select",           options: statoOptions },
    { label: "Headcount",         name: "numeroRisorse",                type: "text" },
    { label: "Location",          name: "location",                     type: "text" },
    { label: "Skills 1",          name: "skills",                       type: "multipleSelectSkill",   options: skillsOptions },
    { label: "Skills 2",          name: "skills2",                      type: "multipleSelectSkill2",   options: skills2Options },
    { label: "Seniority",         name: "anniEsperienza",               type: "text" },
    { label: "Note",              name: "note",                         type: "note" },
  ];


  const initialValues = {
    id:        aziendaData?.id          || "",
    idAzienda: aziendaData?.denominazione || "",
  };

  // const handleSubmit = async (values) => {
  //   const errors = validateFields(values);
  //   const hasErrors = Object.keys(errors).length > 0;
  
  //   if (!hasErrors) {
  //   try {
  //     let skills = "";
  //     let skills2 = "";

  //     if(values.skills && values.skills.length && values.skills2 && values.skills2.length) {

  //       skills = values.skills.join(',');
  //       skills2 = values.skills2.join(',');
    
  //       console.log("DATI DI SOLE SKILLS: ", skills);
  //       console.log("DATI DI SOLE SKILLS2: ", skills2);
    
  //       delete values.skills;
  //       delete values.skills2;
  //   }
  //   const response = await axios.post("http://localhost:8080/need/react/salva", values, {
  //     params: { skill1: skills, skill2: skills2 }
  //   });

  //   console.log("DATI IN VALUES: ", values);

  //   console.log("Risposta dal server:", response.data);
  //   navigate("/need");
  // } catch (error) {
  //   console.error("Errore durante il salvataggio:", error);
  //   if (error.response) {
  //     console.error("Dettagli dell'errore:", error.response.data);
  //   }
  

  //   }
  // } else {
  //   // Gestisci qui gli errori di validazione...
  //   console.log("Errore di validazione:", errors);
  //   // Potresti voler impostare lo stato degli errori o visualizzare un messaggio all'utente
  // }
  // };

  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
      try {
        // Preparazione dei dati delle skills come stringhe separate
        const skills = values.skills ? values.skills.join(',') : '';
        const skills2 = values.skills2 ? values.skills2.join(',') : '';

        console.log("Skills selezionate:", values.skills);
  console.log("Skills2 selezionate:", values.skills2);

  
        // Rimozione delle proprietà delle skills dall'oggetto values
        delete values.skills;
        delete values.skills2;
  
        // Invio della richiesta al server con skills e skills2 come parametri di query
        const response = await axios.post("http://localhost:8080/need/react/salva", values, {
          params: {
            skill1: skills,
            skill2: skills2
          },
          headers: headers
        });
  
        console.log("Risposta dal server:", response.data);
        navigate("/need");
      } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        if (error.response) {
          console.error("Dettagli dell'errore:", error.response.data);
        }
      }
    } else {
      console.log("Errore di validazione:", errors);
      // Gestisci qui gli errori di validazione
    }
  };
  





  // const handleSubmit = async (values) => {
  //   try {

  //     const skillsWithDescriptions = values.skills.map(skillId => {
  //       const skill = skillsOptions.find(option => option.value === skillId);
  //       return { id: skillId, descrizione: skill ? skill.label : 'Descrizione non trovata' };
  //     });

  //     console.log("DATI IN SKILLS: ", skillsWithDescriptions);

  //     const skills2WithDescriptions = values.skills2.map(skill2Id => {
  //       const skill2 = skills2Options.find(option => option.value === skill2Id);
  //       return { id: skill2Id, descrizione: skill2 ? skill2.label : 'Descrizione non trovata' };
  //     });
      

  //     console.log("DATI IN SKILLS2: ", skills2WithDescriptions);
  

  //     const dataToSubmit = {
  //       ...values,
  //       skills: skillsWithDescriptions,
  //       skills2: skills2WithDescriptions,
  //     };
  
  //     console.log("Dati inviati al server:", dataToSubmit);
  

  //     const response = await axios.post("http://localhost:8080/need/react/salva", dataToSubmit);
  //     console.log("Response from server:", response.data);
  
  //     navigate("/need");
  //   } catch (error) {
  //     console.error("Errore durante il salvataggio:", error);
  //   }
  // };
  

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
          <div className="page-name">Aggiungi un nuovo Need per {aziendaData.denominazione} </div>
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

export default AggiungiNeedID;
