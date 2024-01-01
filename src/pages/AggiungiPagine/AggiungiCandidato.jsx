import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldsBox                      from "../../components/FieldsBox";

const AggiungiCandidato = () => {
  const navigate = useNavigate();

  const [ statoOptions,             setStatoOptions             ] = useState([]);
  const [ fornitoriOptions,         setFornitoriOptions         ] = useState([]);
  const [ jobTitleOptions,          setJobTitleOptions          ] = useState([]);
  const [ tipologiaOptions,         setTipologiaOptions         ] = useState([]);
  const [ skillsOptions,            setSkillsOptions            ] = useState([]);
  const [ ownerOptions,             setOwnerOptions             ] = useState([]);
  const [ facoltaOptions,           setFacoltaOptions           ] = useState([]);
  const [ livelloScolasticoOptions, setLivelloScolasticoOptions ] = useState([]);
  // const [selectedCV, setSelectedCV] = useState(null);
  // const [selectedCF, setSelectedCF] = useState(null);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [candidatoId, setCandidatoId] = useState(null);

  // const handleCVChange = (file) => {
  //   setSelectedCV(file);
  // };

  // const handleCFChange = (file) => {
  //   setSelectedCF(file);
  // };
  



  // const [ skillsSelected, setSkillsSelected ] = useState([]);

  // const handleSkillsChange = (selectedOptions) => {
  //   setSkillsSelected(selectedOptions);
  // };


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseStato               = await axios.get("http://localhost:8080/staffing/react/stato/candidato");
        const responseFornitori           = await axios.get("http://localhost:8080/fornitori/react");
        const responseJobTitle            = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseTipologia           = await axios.get("http://localhost:8080/staffing/react/tipo");
        const responseNeedSkills          = await axios.get("http://localhost:8080/staffing/react/skill");
        const ownerResponse               = await axios.get("http://localhost:8080/aziende/react/owner");
        const facoltaResponse             = await axios.get("http://localhost:8080/staffing/react/facolta");
        const livelloScolasticoResponse   = await axios.get("http://localhost:8080/staffing/react/livello");

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

        if (Array.isArray(ownerResponse.data)) {
          const ownerOptions = ownerResponse.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);
        
        if (Array.isArray(responseNeedSkills.data)) {
          const skillsOptions = responseNeedSkills.data.map((skills) => ({
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


            if (Array.isArray(responseJobTitle.data)) {
              const jobTitleOptions = responseJobTitle.data.map((jobTitle) => ({
                label: jobTitle.descrizione,
                value: jobTitle.id,
              }));
              setJobTitleOptions(jobTitleOptions);


              if (Array.isArray(responseFornitori.data)) {
                const fornitoriOptions = responseFornitori.data.map((fornitori) => ({
                  label: fornitori.denominazione,
                  value: fornitori.id,
                }));
                setFornitoriOptions(fornitoriOptions);


       
                if (Array.isArray(responseStato.data)) {
                  const statoOptions = responseStato.data.map((stato) => ({
                    label: stato.descrizione,
                    value: stato.id,
                  }));
                  setStatoOptions(statoOptions);
  
         
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 
      }
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


  const campiObbligatori = ["nome", "cognome", "email", "anniEsperienza", "tipologia" ];

  const fields = [
    { label: "Tipologia",                     name: "tipo",                     type: "select",          options: tipologiaOptions                      },
    { label: "Fornitore",                     name: "fornitore",                type: "select",          options: fornitoriOptions                      },
    { label: "Tipo Ricerca",                  name: "ricerca",                  type: "select",          options: [
      { value: "C", label: "C"},
      { value: "R", label: "R" },
      { value: "C-R", label: "C-R" },
    ]},
    { label: "Nome",                          name: "nome",                     type: "text"                                                            },
    { label: "Cognome",                       name: "cognome",                  type: "text"                                                            },
    { label: "Data di Nascita",               name: "dataNascita",              type: "date"                                                            },
    { label: "Email",                         name: "email",                    type: "text"                                                            },
    { label: "Cellulare",                     name: "cellulare",                type: "text"                                                            },
    { label: "Anni di Esperienza",            name: "anniEsperienza",           type: "text"                                                            },
    { label: "Residenza",                     name: "citta",                    type: "text"                                                            },
    { label: "Modalità di lavoro",            name: "modalita",                 type: "select",          options: [ 
      { value: 1, label: "Full Remote" },
      { value: 2, label: "Ibrido" },
      { value: 3, label: "On Site"},
    ] },
    { label: "Anni di Esperienza nel Ruolo",  name: "anniEsperienzaRuolo",      type: "text"                                                            },
    { label: "Livello Scolastico",            name: "livelloScolastico",        type: "select",          options: livelloScolasticoOptions },
    { label: "Facoltà",                       name: "facolta",                  type: "select",          options: facoltaOptions},
    { label: "Job Title",                     name: "tipologia",                type: "select",          options: jobTitleOptions                       },
    { label: "Data Inserimento",              name: "dataUltimoContatto",       type: "date"                                                            },
    { label: "Stato",                         name: "stato",                    type: "select",          options: statoOptions                          },
    { label: "Owner",                         name: "owner",                    type: "select",          options: ownerOptions      },
    { label: "Seleziona le Skills",           name: "skills",                   type: "multipleSelect",  options: skillsOptions                         },
    { label: "RAL/Tariffa",                   name: "ral",                      type: "text"                                                            },
    { label: "Disponibilità",                 name: "disponibilita",            type: "text"                                                            },
    { label: "Note",                          name: "note",                     type: "note"                                                            },
    { label: "Curriculim Vitae",              name: "cv",                       type: "file"                                                            },
    { label: "Consultant File",               name: "cf",                       type: "file"                                                            },
  ];





const handleSubmit = async (values) => {
  const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
  try {

    console.log("DATI PRIMA DI ESSERE INVIATI: ", values);
    const formData = new FormData();

    // const idCandidatoGenerato = "1"; 
    // setCandidatoId(idCandidatoGenerato);

    if (values.cv) {
      formData.append("cv", values.cv);
      console.log("File CV selezionato:", values.cv);
    }
    if (values.cf) {
      formData.append("cf", values.cf);
      console.log("File CF selezionato:", values.cf);
    }


    // // Aggiungi i file cv e cf al formData se presenti
    // if (selectedCV) {
    //   formData.append("cv", selectedCV);
    //   console.log("File CV selezionato:", selectedCV.name);
    // }
    // if (selectedCF) {
    //   formData.append("cf", selectedCF);
    //   console.log("File CF selezionato:", selectedCF.name);
    // }

    let skills = "";
    if (values.skills && values.skills.length) {
      // Trasforma l'array delle skills in una stringa
      skills = values.skills.join(',');
      console.log("Skills selezionate:", skills);
    }

    // Aggiungi tutti gli altri valori al formData
    Object.keys(values).forEach(key => {
      if (key !== 'skills' && key !== 'cv' && key !== 'cf') { 
        formData.append(key, values[key]);
      }
    });

    // Verifica il contenuto di formData
    console.log("Contenuto di formData:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Invia la richiesta al server
    const response = await axios.post(`http://localhost:8080/staffing/salva`, formData, {
      params: { skill: skills },
      headers: {"Content-Type": "multipart/form-data"},
    });

    console.log("Risposta dal server:", response.data);
    navigate("/recruiting");
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






  // const handleSubmit = async (values) => {
  //   try {
  //     const formData = new FormData();
  
  //     // Aggiungi i file cv e cf al formData se presenti
  //     if (selectedCV) {
  //       formData.append("cv", selectedCV);
  //       console.log("File CV selezionato:", selectedCV.name);
  //     }
  //     if (selectedCF) {
  //       formData.append("cf", selectedCF);
  //       console.log("File CF selezionato:", selectedCF.name);
  //     }
  
  //     let skills = "";
  //     if (values.skills && values.skills.length) {
  //       // Trasforma l'array delle skills in una stringa
  //       skills = values.skills.join(',');
  //       console.log("Skills selezionate:", skills);
  //     }
  
  //     // Aggiungi tutti gli altri valori al formData
  //     Object.keys(values).forEach(key => {
  //       if (key !== 'skills' && key !== 'cv' && key !== 'cf') { 
  //         formData.append(key, values[key]);
  //       }
  //     });
  
  //     // Verifica il contenuto di formData
  //     console.log("Contenuto di formData:");
  //     formData.forEach((value, key) => {
  //       console.log(`${key}:`, value);
  //     });
  
  //     // Invia la richiesta al server
  //     const response = await axios.post("http://localhost:8080/staffing/salva", formData, {
  //       params: { skill: skills },
  //       headers: {"Content-Type": "multipart/form-data"},
  //     });
  
  //     console.log("Risposta dal server:", response.data);
  //     navigate("/recruiting");
  //   } catch (error) {
  //     console.error("Errore durante il salvataggio:", error);
  //     if (error.response) {
  //       console.error("Dettagli dell'errore:", error.response.data);
  //     }
  //   }
  // };
  
  


  // const handleSubmit = async (values) => {
  //   try {
  //     const formData = new FormData();
      
  //     console.log("DATI DENTRO CV: ", values.cv);
  
  //     const cv = values.cv;
  //     console.log("Contenuto del campo cv:", cv); 
  //     delete values.cv; // Rimuovi il campo cv dai values
  
  //     let skills = "";
  
  //     if (values.skills && values.skills.length) {
  //       // Trasforma l'array delle skills in una stringa
  //       skills = values.skills.join(',');
  //     }
  //     delete values.skills; // Rimuovi il campo skills dai values
  
  //     // Aggiungi il JSON serializzato dei values al formData
  //     formData.append("values", JSON.stringify(values));
  
  //     // Aggiungi il file cv al formData
  //     formData.append("cv", cv);

  //     // Verifica il contenuto di formData
  //     console.log("Contenuto di formData:");
  //     formData.forEach((value, key) => {
  //       if (key === "cv") {
  //         console.log(`${key}:`, value.name); // Questo restituirà il nome del file "cv"
  //       } else {
  //         console.log(`${key}:`, value);
  //       }
  //     });
      
  
  //     // Invia la richiesta al server
  //     const response = await axios.post("http://localhost:8080/staffing/salva", formData, {
  //       params: { skill: skills },
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  
  //     console.log("Risposta dal server:", response.data);
  //     navigate("/recruiting");
  //   } catch (error) {
  //     console.error("Errore durante il salvataggio:", error);
  //     if (error.response) {
  //       console.error("Dettagli dell'errore:", error.response.data);
  //     }
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
          <div className="page-name">Aggiungi Candidato</div>
          <FieldsBox 
          fields={fields} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title=""  
        // onCVChange={handleCVChange}
        // onCFChange={handleCFChange}
        
        />
        </div>
      </div>
    </div>
  );
};


export default AggiungiCandidato;
