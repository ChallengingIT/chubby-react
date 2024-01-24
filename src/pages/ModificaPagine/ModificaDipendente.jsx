import React, { useState, useEffect }       from "react";
import { useNavigate, useLocation }         from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../../components/Sidebar";
import FieldsBox                            from "../../components/FieldsBox";

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

  console.log("Dati Arrivati: ", dipendentiData);

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
        const responseTipologia                      = await axios.get("http://localhost:8080/aziende/react/tipologia" , { headers: headers });
        const skillsResponse                         = await axios.get("http://localhost:8080/staffing/react/skill"    , { headers: headers });
        const facoltaResponse                        = await axios.get("http://localhost:8080/staffing/react/facolta"  , { headers: headers });
        const livelloScolasticoResponse              = await axios.get("http://localhost:8080/staffing/react/livello"  , { headers: headers });
        const tipologiaContrattoResponse             = await axios.get("http://localhost:8080/hr/react/tipocontratto"  , { headers: headers });

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

  const campiObbligatori = [ "nome", "cognome", "dataNasciata", "luogoNascita", "email", "cellulare", "dataInizio", "scadenza", "anniEsperienza", "idTipologia" ];

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
      { label: "Livello Scolastico",                  name: "livelloScolastico",                              type: "select",          options: livelloScolasticoOptions },
      { label: "Facoltà",                             name: "facolta",                                        type: "select",          options: facoltaOptions},
      { label: "IBAN",                                name: "iban",                                           type:"text"   },
      { label: "Codice Fiscale",                      name: "codFiscale",                                     type:"text"   },
      { label: "RAL/Tariffa",                         name: "ral",                                            type:"text"   },
      { label: "Job Title",                           name: "tipologia",                                      type: "select",          options: tipologiaOptions },
      { label: "Seleziona le Skills",                 name: "skills",                                         type: "multipleSelectSkill",  options: skillsOptions },
      { label: "Tipologia Contratto",                 name: "tipologiaContratto",                             type: "select",          options: tipologiaContrattoOptions },
      { label: "Note",                                name: "note",                                           type: "note"  },
      { lavel: "Allegati",                            name: "files",                                          type: "mofificaAllegati"},
  ];

  const initialValues = {
    nome:                                             dipendentiData.nome                                                                   || "",
    cognome:                                          dipendentiData.cognome                                                                || "",
    dataNascita:                                      dipendentiData.dataNascita                                                            || "",
    luogoNascita:                                     dipendentiData.luogoNascita                                                           || "",
    email:                                            dipendentiData.email                                                                  || "",
    cellulare:                                        dipendentiData.cellulare                                                              || "",
    citta:                                            dipendentiData.citta                                                                  || "",
    dataInizio:                                       dipendentiData.dataInizio                                                             || "",
    datascadenza:                                     dipendentiData.dataScadenza                                                           || "",
    anniEsperienza:                                   dipendentiData.anniEsperienza                                                         || "",
    livelloScolastico:                                dipendentiData.livelloScolastico  && dipendentiData.livelloScolastico.id              || "",
    facolta:                                          dipendentiData.facolta            && dipendentiData.facolta.id                        || "",
    iban:                                             dipendentiData.iban                                                                   || "",
    codFiscale:                                       dipendentiData.codFiscale                                                             || "",
    ral:                                              dipendentiData.ral                                                                    || "",
    tipologia:                                        dipendentiData.tipologia          && dipendentiData.tipologia.id                      || "",
    skills:                                         (dipendentiData.skills?.map(skill => skill?.id))                                       || [],
    tipologiaContratto:                               dipendentiData.tipologiaContratto && dipendentiData.tipologiaContratto.id             || "",
    note:                                             dipendentiData.note                                                                   || "",
    files: (dipendentiData.files?.map(file => {
      return {
        id: file.id, 
        descrizione: file.descrizione
      };
    })) || [],
  };

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
//         headers: { ...headers, "Content-Type": "multipart/form-data"},
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



const handleSubmit = async (values) => {
  const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {

    try {
      // Preparazione dei dati delle skills come stringhe separate
      const skills = values.skills ? values.skills.join(',') : '';

      console.log("Skills selezionate:", values.skills);
      console.log("Values: ", values);

      // Rimozione delle proprietà delle skills dall'oggetto values
      delete values.skills;

      const allegati = values.file;
      delete values.file;

      const datiResponse = await axios.post("http://localhost:8080/hr/react/staff/salva", values, {
        params: { skill: skills },
        headers: headers,
      });

    console.log("Risposta dal server: ", datiResponse.data);

    // Ottieni l'ID dello staff dalla risposta
    const staffId = datiResponse.data;
    console.log("ID :", staffId);
  

    // Controlla se ci sono file da inviare
    if (allegati && allegati.length) {
      for (const file of allegati) {
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        // Invia ogni file separatamente utilizzando l'ID dello staff
        const fileResponse = await axios.post(`http://localhost:8080/hr/react/staff/salva/file/${staffId}`, fileFormData, 
        {headers: headers});
        
        console.log("Risposta dal server per il file: ", fileResponse.data);
      }
    }
  navigate("/hr");

  } catch (error) {
    console.error("Errore nell'invio dei dati: ", error);
  }
}else {
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



  

  const handleDownloadAllegati = async () => {
    for (const file of dipendentiData.files) {
      try {
        const fileID = file.id;
        const fileDescrizione = file.descrizione; // Assicurati che ogni file abbia una descrizione.
        console.log("File ID: ", fileID);
  
        const url = `http://localhost:8080/files/react/download/file/${fileID}`;
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'blob', 
          headers: headers
        });
  
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${fileDescrizione}.pdf`); 
        document.body.appendChild(link);
    
        link.click();
        document.body.removeChild(link);
  
      } catch (error) {
        console.error('Si è verificato un errore durante il download del file:', error);
      }
    }
  };

  const handleDeleteAllegati = async (fileID) => {
    try {
      const ids = idStaff; // L'id dello staff è già noto qui.
      const url = `http://localhost:8080/files/react/elimina/file/${fileID}/${ids}`;
  
      const response = await axios.delete(url, {headers: headers});
      console.log("Risposta del server: ", response);
  
      // Dopo l'eliminazione, potresti voler aggiornare lo stato per rimuovere il file dall'elenco.
      // Ad esempio, potresti impostare lo stato del componente con i file rimanenti.
      // Questo dipende da come gestisci lo stato dei file nel tuo componente.
  
    } catch (error) {
      console.error('Si è verificato un errore durante l\'eliminazione del file:', error);
    }
  };
  
      
  

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Modifica Staff {nomeDipendente} {cognomeDipendente} </div>
          <FieldsBox
          fields={fields}
          initialValues={initialValues}
          campiObbligatori={campiObbligatori}
          onSubmit={handleSubmit}
          title=""
          onDownloadAllegati = {handleDownloadAllegati}
          onDeleteAllegati = {handleDeleteAllegati}
          skillsOptions={skillsOptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaDipendente;
