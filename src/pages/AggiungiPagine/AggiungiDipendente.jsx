import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldBoxFile from "../../components/FieldBoxFile";
import FieldsBox from "../../components/FieldsBox";

const AggiungiDipendente = () => {
  const navigate = useNavigate();
  const [ jobTitleOptions,                setJobTitleOptions                  ] = useState([]);
  const [ skillsOptions,                  setSkillsOptions                    ] = useState([]);
  const [ facoltaOptions,                 setFacoltaOptions                   ] = useState([]);
  const [ livelloScolasticoOptions,       setLivelloScolasticoOptions         ] = useState([]);
  const [ contrattoOptions,               setContrattoOptions                 ] = useState([]);

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
    

        const responseJobTitle              = await axios.get("http://localhost:8080/aziende/react/tipologia" , { headers: headers });
        const responseSkill                 = await axios.get("http://localhost:8080/staffing/react/skill"    , { headers: headers });
        const facoltaResponse               = await axios.get("http://localhost:8080/staffing/react/facolta"  , { headers: headers });
        const livelloScolasticoResponse     = await axios.get("http://localhost:8080/staffing/react/livello"  , { headers: headers });
        const contrattoResponse             = await axios.get("http://localhost:8080/hr/react/tipocontratto"  , { headers: headers });

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

  // const campiObbligatori = [ "nome", "cognome", "dataNasciata", "luogoNascita", "email", "cellulare", "dataInizio", "scadenza", "anniEsperienza", "idTipologia" ];
const campiObbligatori = [ "nome", "cognome", "email", "anniEsperienza", "livelloScolastico", "tipologia", "tipologiaContratto", "citta", "dataNascita" ];
  const fields = [
    { label: "* Nome",                        name: "nome",               type: "text" },
    { label: "* Cognome",                     name: "cognome",            type: "text" },
    { label: "* Data di Nascita",             name: "dataNascita",        type: "date" },
    { label: "Luogo di Nascita",              name: "luogoNascita",       type: "text" },
    { label: "* Email",                       name: "email",              type: "text" },
    { label: "Cellulare",                     name: "cellulare",          type: "text" },
    { label: "* Residenza",                   name: "citta",              type: "text" },
    { label: "Data Inizio",                   name: "dataInizio",         type: "date" },
    { label: "Scadenza Contratto",            name: "dataScadenza",       type: "date" },
    { label: "* Anni Esperienza",             name: "anniEsperienza",     type: "text" },
    { label: "* Livello Scolastico",          name: "livelloScolastico",  type: "select",                      options: livelloScolasticoOptions },
    { label: "Facoltà",                       name: "facolta",            type: "select",                      options: facoltaOptions},
    { label: "IBAN",                          name: "iban",               type:"text"  },
    { label: "Codice Fiscale",                name: "codFiscale",         type:"text"  },
    { label: "RAL/Tariffa",                   name: "ral",                type:"text"  },
    { label: "* Job Title",                   name: "tipologia",          type: "select",                       options: jobTitleOptions },
    { label: "Seleziona le skill",            name: "skills",             type: "multipleSelectSkill",          options: skillsOptions },
    { label: "* Tipologia Contratto",         name: "tipologiaContratto", type: "select",                       options: contrattoOptions },
    { label: "Note",                          name: "note",               type: "note" },
    { label: "Allegati",                      name: "file",               type: "modificaAllegati" },
  ];




//   const handleSubmit = async (values) => {
//     const errors = validateFields(values);
//     const hasErrors = Object.keys(errors).length > 0;
  
//     if (!hasErrors) {
//     try {
//       console.log("DATI PRIMA DI ESSERE INVIATI: ", values);
//       const formData = new FormData();
  
//     //  if (values.file) {
//     //   formData.append("file", values.file);
//     //   console.log("File selezionato:", values.file);
//     // }

//      // Aggiungi tutti i file a formData
//   if (values.file && values.file.length) {
//     values.file.forEach((file) => {
//       formData.append("file", file); // Utilizza lo stesso nome 'file' per tutti i file
//     });
//   }
//   // Stampa i file aggiunti a formData
// console.log("Files aggiunti a formData:");
// for (let key of formData.keys()) {
//   const fileData = formData.getAll(key);
//   fileData.forEach((file, index) => {
//     console.log(`File ${index + 1} con chiave "${key}":`, file.name);
//   });
// }
  
//       // Aggiungi le skills se presenti, come stringa separata da virgole
//       if (values.skills && values.skills.length) {
//         const skills = values.skills.join(',');
//         console.log("Skills selezionate:", skills);
//         formData.append('skills', skills);
//       }
  
//       // Aggiungi tutti gli altri valori al formData escludendo 'skills' e 'file'
//       Object.keys(values).forEach(key => {
//         if (key !== 'skills' && key !== 'file') { 
//           formData.append(key, values[key]);
//         }
//       });

//       // if (values.file && values.file.length) {
//       //   // Assicurati che 'file' sia un array e non un singolo file
//       //   Array.from(values.file).forEach((file) => {
//       //     formData.append("file", file); // Utilizza lo stesso nome 'file' per tutti i file
//       //   });
//       // }
    
  
//       // Verifica il contenuto di formData
//       console.log("Contenuto di formData:");
//       formData.forEach((value, key) => {
//         console.log(`${key}:`, value);
//       });
  
//       // Invia la richiesta al server
//       const response = await axios.post(`http://localhost:8080/hr/react/staff/salva`, formData, {
//         headers: {"Content-Type": "multipart/form-data"},
//       });
  
//       console.log("Risposta dal server:", response.data);
//       navigate("/hr"); // Assicurati che 'navigate' sia definito e disponibile in questo contesto
//     } catch (error) {
//       console.error("Errore durante il salvataggio:", error);
//       if (error.response) {
//         // Mostra i dettagli dell'errore ritornati dal server
//         console.error("Dettagli dell'errore:", error.response.data);
//       }
//     }
//   } else {
//     // Gestisci qui gli errori di validazione...
//     console.log("Errore di validazione:", errors);
//     // Potresti voler impostare lo stato degli errori o visualizzare un messaggio all'utente
//   }
//   };



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

      console.log("Skills selezionate:", values.skills);
      console.log("Values: ", values);

      // Rimozione delle proprietà delle skills dall'oggetto values
      delete values.skills;

      // const allegati = values.file;
      // delete values.file;

      const datiResponse = await axios.post("http://localhost:8080/hr/react/staff/salva", values, {
        params: { skill: skills },
        headers: headers,
      });

    console.log("Risposta dal server senza file: ", datiResponse.data);

    const staffId = datiResponse.data;
    console.log("ID :", staffId);
  

    // if (fileAllegati && fileAllegati.length > 0) {
      
    //   fileAllegati.forEach(file => {
    //       // formData.append("file", file);
    //       const formData = new FormData();
    //       for (let [key, value] of formData.entries()) {
    //         if (value instanceof File) {
    //             console.log(key, `File Name: ${value.name}, File Type: ${value.type}, File Size: ${value.size} bytes`);
    //         } else {
    //             console.log(key, value);
    //         }
    //     }
    //       formData.append("file", file);
    //       const fileResponse = axios.post(`http://localhost:8080/hr/react/staff/salva/file/${staffId}`, FormData, 
    //       {headers: headers});
    //       console.log("Risposta dal server per il file: ", fileResponse.data);
    //   });
    // }


    if (fileAllegati && fileAllegati.length > 0) {
      fileAllegati.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file.file);
        console.log("Sto inviando il file: ", file.file.name);
    
        try {
          const fileResponse = await axios.post(`http://localhost:8080/hr/react/staff/salva/file/${staffId}`, formData, { headers: headers });
          console.log("Risposta dal server per il file: ", fileResponse.data);
        } catch (error) {
          console.error("Errore nell'invio del file: ", error);
        }
      });
    }
    


        // Invia ogni file separatamente utilizzando l'ID dello staff

      
      navigate("/hr");
    


  } catch (error) {
    console.error("Errore nell'invio dei dati: ", error);
  }
}else {
  console.log("Errore di validazione:", errors);
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


  



  

 
// const handleSubmit = async (values) => {
//   try {

//     console.log("DATI PRIMA DI ESSERE INVIATI: ", values);
//     const formData = new FormData();

 

//     // if (Array.isArray(values.file)) {
//     //   // Itera ogni file e aggiungilo a formData
//     //   values.file.forEach((file, index) => {
//     //     formData.append(`file${index}`, file);
//     //     console.log(`File ${index} selezionato:`, file.name);
//     //   });
//     // } else if (values.file) {
//     //   // Se `values.file` è un singolo file, aggiungilo come prima
//     //   formData.append("file", values.file);
//     //   console.log("File selezionato:", values.file.name);
//     // }

//     //con singolo file
//     if (values.file) {
//       formData.append("file", values.file);
//       console.log("File selezionato:", values.file);
//     }

//     //prima prova di file multiple
//     // if (values.file && values.file.length) {
//     //   Array.from(values.file).forEach((file, index) => {
//     //     formData.append(`file${index}`, file);
//     //     console.log(`File ${index} selezionato:`, file);
//     //   });
//     // }

//     let skills = "";
//     if (values.skills && values.skills.length) {
//       // Trasforma l'array delle skills in una stringa
//       skills = values.skills.join(',');
//       console.log("Skills selezionate:", skills);
//     }

//     // Aggiungi tutti gli altri valori al formData
//     Object.keys(values).forEach(key => {
//       if (key !== 'skills' && key !== 'file') { 
//         formData.append(key, values[key]);
//       }
//     });

//     if (values.file instanceof FormData) {
//       values.file.forEach((value, key) => {
//         formData.append(key, value);
//       });
//     }

//     // Verifica il contenuto di formData
//     console.log("Contenuto di formData:");
//     formData.forEach((value, key) => {
//       console.log(`${key}:`, value);
//     });

//     // Invia la richiesta al server
//     const response = await axios.post(`http://localhost:8080/hr/react/staff/salva`, formData, {
//       params: { skill: skills },
//       headers: {"Content-Type": "multipart/form-data"},
//     });

//     console.log("Risposta dal server:", response.data);
//     navigate("/hr");
//   } catch (error) {
//     console.error("Errore durante il salvataggio:", error);
//     if (error.response) {
//       console.error("Dettagli dell'errore:", error.response.data);
//     }
//   }
// };






  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Aggiungi un nuovo Dipendente</div>
          <FieldBoxFile 
          fields={fields} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title="" 
          skillsOptions={skillsOptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiDipendente;
