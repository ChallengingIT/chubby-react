import React, { useState, useEffect }             from "react";
import { useNavigate, useLocation }               from "react-router-dom";
import Sidebar                                    from "../../components/Sidebar";
import FieldsBox                                  from "../../components/FieldsBox";
import axios from "axios";



const DettaglioNeed = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { needData = {} } = location.state || {};


  const [ skillsOptions,          setSkillsOptions    ] = useState([]);
  const [ skills2Options,         setSkill2sOptions   ] = useState([]);


   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };



  console.log("Dati Arrivati: ", needData);


    useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseSkill        = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
        const responseSkill2       = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });


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

        }
        }
                
              } catch (error) {
                console.error("Errore durante il recupero delle province:", error);
              }
            };
            fetchAziendeOptions();
          }, []);



//   useEffect(() => {
//     const fetchAziendeOptions = async () => {
//       try {
//         const responseAziende      = await axios.get("http://localhost:8080/aziende/react", { headers: headers });
//         const responseSkill        = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
//         const responseSkill2       = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
//         const ownerResponse        = await axios.get("http://localhost:8080/aziende/react/owner", { headers: headers });
//         const tipologiaResponse    = await axios.get("http://localhost:8080/need/react/tipologia", { headers: headers });
//         const statoResponse        = await axios.get("http://localhost:8080/need/react/stato", { headers: headers });


//         if (Array.isArray(statoResponse.data)) {
//           const statoOptions = statoResponse.data.map((stato) => ({
//             label: stato.descrizione,
//             value: stato.id,
//           }));
//           setStatoOptions(statoOptions);



//         if (Array.isArray(tipologiaResponse.data)) {
//           const tipologiaOptions = tipologiaResponse.data.map((tipologia) => ({
//             label: tipologia.descrizione,
//             value: tipologia.id,
//           }));
//           setTipologiaOptions(tipologiaOptions);



//         if (Array.isArray(ownerResponse.data)) {
//           const ownerOptions = ownerResponse.data.map((owner) => ({
//             label: owner.descrizione,
//             value: owner.id,
//           }));
//           setOwnerOptions(ownerOptions);

       
//       if (Array.isArray(responseSkill.data)) {
//         const skillsOptions = responseSkill.data.map((skill) => ({
//           value: skill.id,
//           label: skill.descrizione
//         }));
//         setSkillsOptions(skillsOptions);

//         if (Array.isArray(responseSkill2.data)) {
//           const skills2Options = responseSkill2.data.map((skill2) => ({
//             value: skill2.id,
//             label: skill2.descrizione
//           }));
//           setSkill2sOptions(skills2Options);
  


       
    
//         if (Array.isArray(responseAziende.data)) {
//           const ownerOptions = responseAziende.data.map((aziende) => ({
//             label: aziende.denominazione,
//             value: aziende.id,
//           }));
//           setAziendeOptions(ownerOptions);
          
//         } else {
//           console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
//         }
//       }
//     }
//   }
// }
//         }
//       } catch (error) {
//         console.error("Errore durante il recupero delle province:", error);
//       }
//     };
//     fetchAziendeOptions();
//   }, []);



  const fields = [
    { label: "Descrizione",         name: "descrizione",            type: "text",  disabled: true },
    { label: "Priorità",            name: "priorita",               type: "text",  disabled: true },
    { label: "Week",                name: "week",                   type: "text",  disabled: true },
    { label: "Tipologia",           name: "tipologia",              type: "text",  disabled: true },
    { label: "Tipologia Azienda",   name: "tipo",                   type: "text",  disabled: true },
    { label: "Owner",               name: "owner",                  type: "text",  disabled: true },
    { label: "Stato",               name: "stato",                  type: "text",  disabled: true },
    { label: "Headcount",           name: "numeroRisorse",          type: "text",  disabled: true },
    { label: "Location",            name: "location",               type: "text",  disabled: true },
    { label: "Skills 1",            name: "skills",                 type: "multipleSelectSkill",  disabled: true },
    { label: "Skills 2",            name: "skills2",                type: "multipleSelectSkill",  disabled: true },
    { label: "Seniority",           name: "anniEsperienza",         type: "text",  disabled: true },
    { label: "Note",                name: "note",                   type: "note",  disabled: true },
  ];


  // console.log("Valore di week:", needData.week);


  const initialValues = {
    id:                         needData.id                                                 || "",
    descrizione:                needData.descrizione                                        || "",
    priorita:                   needData.priorita                                           || "",
    week:                       needData.week                                               || "",
    tipologia:                  needData.tipologia && needData.tipologia.descrizione                 || "",
    tipo:                       needData.tipo                                               || "",
    owner:                      needData.owner     && needData.owner.descrizione                     || "",
    stato:                      needData.stato     && needData.stato.descrizione                     || "",
    numeroRisorse:              needData.numeroRisorse                                      || "",
    location:                   needData.location                                           || "",
    skills:                    (needData.skills?.map(skill => skill?.id))                   || [],
    skills2:                   (needData.skills2?.map(skill => skill?.id))                  || [],
    anniEsperienza:             needData.anniEsperienza                                     || "",
    note:                       needData.note                                               || "",          
  };







  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name" style={{ margin: "20px", fontSize: "15px"}}>
            <h1>{`Dettaglio Need di ${needData.cliente.denominazione}`}
            </h1>
          </div>
          <FieldsBox
          fields={fields}
          initialValues={initialValues}
          title=""
          skillsOptions={skillsOptions} 
          skills2Options={skills2Options}
          showSaveButton={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default DettaglioNeed;
