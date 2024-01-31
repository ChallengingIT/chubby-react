import React, { useState, useEffect }       from "react";
import { useNavigate, useLocation }         from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../../components/Sidebar";
import FieldBoxFile from "../FieldBoxFile";
const ModificaDipendente2 = () => {

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
  
    console.log("Dati Arrivati da dipendentiData: ", dipendentiData);
  
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



// const handleSubmit = async (values) => {
//     const errors = validateFields(values);
//       const hasErrors = Object.keys(errors).length > 0;
//       if (!hasErrors) {
//         const staffId=0;
//         const allegati=null;
  
//       try {

//         console.log("HEADERS: ", headers);
//         // Preparazione dei dati delle skills come stringhe separate
//         const skills = values.skills ? values.skills.join(',') : '';
  
//         console.log("Skills selezionate:", values.skills);
//         console.log("Values: ", values);
  
//         // Rimozione delle proprietà delle skills dall'oggetto values
//         delete values.skills;
//         if(values.file) {
//             allegati = values.file;
//         }

//         delete values.file;
  
//         const datiResponse = await axios.post("http://localhost:8080/hr/react/staff/salva", values, {
//           params: { skill: skills },
//           headers: headers,
//         });
//         staffId = datiResponse.data;
//          console.log("id:", staffId);
  
//       console.log("Risposta dal server: ", datiResponse.data);
//     } catch(error) {
//         console.error("ERRORE NELLA PRIMA CHIAMATA", error);
//     }
  
//       // Ottieni l'ID dello staff dalla risposta

//       console.log("ID :", staffId);
    
//       try{
  
//       // Controlla se ci sono file da inviare
//       if (allegati && allegati.length) {
//         if(allegati instanceof File && allegati.lengh instanceof File) {
//         for (const file of allegati) {
//           const fileFormData = new FormData();
//           fileFormData.append("file", file);

       
  
//           // Invia ogni file separatamente utilizzando l'ID dello staff
//           const fileResponse = await axios.post(`http://localhost:8080/hr/react/staff/salva/file/${staffId}`, fileFormData, 
//           {headers: headers});
          
//           console.log("Risposta dal server per il file: ", fileResponse.data);
//         }
//       }
//     navigate("/hr");
//       }
    
//     } catch (error) {
//       console.error("Errore nell'invio dei dati: ", error);
//     }
//   }else {
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

      const allegati = values.files;
      delete values.files;

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
        if(file.isNew) {
        const formData = new FormData();
        formData.append("file", file.file);
    
        try {
          const fileResponse = await axios.post(`http://localhost:8080/hr/react/staff/salva/file/${staffId}`, formData, { headers: headers });
          console.log("Risposta dal server per il file: ", fileResponse.data);
        } catch (error) {
          console.error("Errore nell'invio del file: ", error);
        }
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
  
  
  
    
  

  
    // const handleDeleteAllegati = async (fileID) => {
    //   try {
    //     const ids = idStaff; // L'id dello staff è già noto qui.
    //     const url = `http://localhost:8080/files/react/elimina/file/${fileID}/${ids}`;
    
    //     const response = await axios.delete(url, {headers: headers});
    //     console.log("Risposta del server: ", response);
    
    //     // Dopo l'eliminazione, potresti voler aggiornare lo stato per rimuovere il file dall'elenco.
    //     // Ad esempio, potresti impostare lo stato del componente con i file rimanenti.
    //     // Questo dipende da come gestisci lo stato dei file nel tuo componente.
    
    //   } catch (error) {
    //     console.error('Si è verificato un errore durante l\'eliminazione del file:', error);
    //   }
    // };
    
        
    
  
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
  
  export default ModificaDipendente2;
  

