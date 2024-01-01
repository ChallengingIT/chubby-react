import React, { useState, useEffect }     from "react";
import { useNavigate, useLocation }       from "react-router-dom";
import axios                              from "axios";
import Sidebar                            from "../../components/Sidebar";
import { useParams }                      from "react-router-dom";



import FieldsBox from "../../components/FieldsBox";

const AggiungiNeedID = () => {
const { id, nomeAzienda } = useParams();
const navigate            = useNavigate();


  const [ aziendeOptions,     setAziendeOptions       ] = useState([]);
  const [ skillsOptions,      setSkillsOptions        ] = useState([]);
  const [ skills2Options,     setSkill2sOptions       ] = useState([]);
  const [ ownerOptions,       setOwnerOptions         ] = useState([]);
  const [ tipologiaOptions,   setTipologiaOptions     ] = useState([]);
  const [ statoOptions,       setStatoOptions         ] = useState([]);
  const [ aziendeMapping,     setAziendeMapping       ] = useState([]);


  const convertStatusStringToNumber = (statusString) => {
    switch (statusString) {
      case "Verde":
        return 1;
      case "Giallo":
        return 2;
      case "Rosso":
        return 3;
      default:
        return ;
    }
  };

  useEffect(() => {
    const fetchNeedOptions = async () => {
      try {
        const responseAziende        = await axios.get("http://localhost:8080/aziende/react"       );
        const responseSkill          = await axios.get("http://localhost:8080/staffing/react/skill");
        const responseSkill2         = await axios.get("http://localhost:8080/staffing/react/skill");
        const ownerResponse          = await axios.get("http://localhost:8080/aziende/react/owner" );
        const tipologiaResponse      = await axios.get("http://localhost:8080/need/react/tipologia");
        const statoResponse          = await axios.get("http://localhost:8080/need/react/stato"    );


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
            const aziendeMapping = {};
            const aziendeOptions = responseAziende.data.map((aziende) => {
              aziendeMapping[aziende.denominazione] = aziende.id; // Aggiungi mapping
              return {
                label: aziende.denominazione,
                value: aziende.id,
              };
            });
            setAziendeOptions(aziendeOptions);
            // Salva il mapping nello stato o in una variabile ref
            setAziendeMapping(aziendeMapping); // Assumi che hai uno stato o ref per questo
          }
          
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", statoResponse.data);
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

  const convertStringToId = (idAziendaString) => {
    // Assumi che aziendeMapping sia disponibile qui
    return aziendeMapping[idAziendaString] || null;
  };
  

  const fields = [
    { label: "Azienda",           name: "idAzienda",                    type: "text",      },
    { label: "Descrizione Need",  name: "descrizione",                  type: "text"       },
    { label: "Priorità",          name: "priorita",                     type: "text"       },
    { label: "Week",              name: "week",                         type: "weekPicker" },
    { label: "Tipologia",         name: "tipologia",                    type: "select",           options: tipologiaOptions  },
    { label: "Tipologia Azienda", name: "tipo",                         type: "select",           options: [ 
    { value: 1,                   label: "Cliente" },
    { value: 2,                   label: "Consulenza" },
    { value: 3,                   label: "Prospect" }
  ] },
    { label: "Owner",             name: "idOwner",                      type: "select",           options: ownerOptions },
    { label: "Stato",             name: "stato",                        type: "select",           options: statoOptions },
    { label: "Headcount",         name: "numeroRisorse",                type: "text"        },
    { label: "Location",          name: "location",                     type: "text"        },
    { label: "Skills 1",          name: "skills",                       type: "multipleSelect",   options: skillsOptions },
    { label: "Skills 2",          name: "skills2",                      type: "multipleSelect",   options: skills2Options },
    { label: "Seniority",         name: "anniEsperienza",               type: "text"        },
    { label: "Note",              name: "note",                         type: "note"        },


  ];

  const initialValues = {
    idAzienda: nomeAzienda,
  };

  const disableFields = {
    idAzienda: true,

  };





  const handleSubmit = async (values) => {
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

      const idAziendaNumerico = convertStringToId(values.idAzienda);
    if (!idAziendaNumerico) {
      console.error("Errore: ID Azienda non trovato per la stringa fornita");
      return;
    }

    // Aggiungi l'ID numerico convertito ai valori da inviare
    const datiDaInviare = {
      ...values,
      idAzienda: idAziendaNumerico,
    };
    
      

      
    const response = await axios.post(`http://localhost:8080/need/react/salva`, datiDaInviare, {
      params: { skill1: skills, skill2: skills2 }
    });

    console.log("DATI DOPO L'INVIO: ", datiDaInviare);

    console.log("Risposta dal server:", response.data);
    navigate(`/need/${id}/${nomeAzienda}`);
  } catch (error) {
    console.error("Errore durante il salvataggio:", error);
    if (error.response) {
      console.error("Dettagli dell'errore:", error.response.data);
    }
  

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
  

  const validate = (values) => {
    const errors = {};
    console.log("Dati in validate:", values);


    if (!values.azienda) {
      errors.azienda = "Il campo Azienda è obbligatorio";
    }
    
    if (!values.descrizioneNeed) {
      errors.descrizioneNeed = "Il campo descrizioneNeed è obbligatorio";
    }

    if (!values.priorita) {
      errors.priorita = "Il campo priorita è obbligatorio";
    }

    if (!values.week) {
      errors.week = "Il campo week è obbligatorio";
    }

    if (!values.tipoAzienda) {
      errors.tipoAzienda = "Il campo tipoAzienda è obbligatorio";
    }

    if (!values.owner) {
      errors.owner = "Il campo owner è obbligatorio";
    }

    if (!values.stato) {
      errors.stato = "Il campo stato è obbligatorio";
    }




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
        <h1 >{`Aggiungi Need di ${nomeAzienda}`}</h1>
        </div>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          disableFields={disableFields}  
          onSubmit={handleSubmit} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiNeedID;
