import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";

const ModificaStaffing = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { recruitingData = {} } = location.state || {};
  const idCandidato             = recruitingData.id;
  const nomeCandidato           = recruitingData.nome;
  const cognomeCandidato        = recruitingData.cognome;

  const [statoOptions,              setStatoOptions              ] = useState([]);
  const [fornitoreOptions,          setFornitoreOptions          ] = useState([]);
  const [jobTitleOptions,           setJobTitleOptions           ] = useState([]);
  const [tipologiaOptions,          setTipologiaOptions          ] = useState([]);
  const [skillsOptions,             setSkillsOptions             ] = useState([]); 
  const [livelloScolasticoOptions,  setLivelloScolasticoOptions  ] = useState([]);
  const [ownerOptions,              setOwnerOptions              ] = useState([]);
  const [facoltaOptions,            setFacoltaOptions            ] = useState([]);
  const [cv,                        setCV                        ] = useState(null);
  const [cf,                        setCF                        ] = useState(null);  



  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseStato               = await axios.get("http://localhost:8080/staffing/react/stato/candidato");
        const responseFornitore           = await axios.get("http://localhost:8080/fornitori/react");
        const responseJobTitle            = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseTipologia           = await axios.get("http://localhost:8080/staffing/react/tipo");
        const responseNeedSkill           = await axios.get("http://localhost:8080/staffing/react/skill");
        const livelloScolasticoResponse   = await axios.get("http://localhost:8080/staffing/react/livello");
        const ownerResponse               = await axios.get("http://localhost:8080/aziende/react/owner");
        const facoltaResponse             = await axios.get("http://localhost:8080/staffing/react/facolta");

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


        if (Array.isArray(livelloScolasticoResponse.data)) {
          const livelloScolasticoOptions = livelloScolasticoResponse.data.map((livelloScolastico) => ({
            label: livelloScolastico.descrizione,
            value: livelloScolastico.id,
          }));
          setLivelloScolasticoOptions(livelloScolasticoOptions);




        if (Array.isArray(responseNeedSkill.data)) {
          const skillsOptions = responseNeedSkill.data.map((skills) => ({
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


            if (Array.isArray(responseFornitore.data)) {
              const fornitoreOptions = responseFornitore.data.map((fornitore) => ({
                label: fornitore.denominazione,
                value: fornitore.id,
              }));
              setFornitoreOptions(fornitoreOptions);

    

              if (Array.isArray(responseStato.data)) {
                const statoOptions = responseStato.data.map((stato) => ({
                  label: stato.descrizione,
                  value: stato.id,
                }));
                setStatoOptions(statoOptions);
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

  console.log("DATI CHE ARRIVANO: ", recruitingData);

  const campiObbligatori = ["nome", "cognome", "email", "anniEsperienza", "tipologia" ];

  const fields = [
    { label: "Tipologia",                           name: "tipo",                  type: "select",         options: tipologiaOptions },
    { label: "Fornitore",                           name: "fornitore",                  type: "select",         options: fornitoreOptions },
    { label: "Tipo Ricerca",                        name: "ricerca",                type: "select",         options: [
      { label: "C", value: "C" },
      { label: "R", value: "R"},
      { label: "C-R", value: "C-R"}
    ] },
    { label: "Nome",                                name: "nome",                       type: "text" },
    { label: "Cognome",                             name: "cognome",                    type: "text" },
    { label: "Data di Nascita",                     name: "dataNascita",                type: "date" },
    { label: "Email",                               name: "email",                      type: "text" },
    { label: "Cellulare",                           name: "cellulare",                  type: "text" },
    { label: "Anni di Esperienza",                  name: "anniEsperienza",             type: "text" },
    { label: "Residenza",                           name: "citta",                  type: "text" },
    { label: "Modalità di lavoro",                  name: "modalita",                   type: "select",         options: [{ value: 1, label: "Full Remote" },
    { value: 2, label: "Ibrido" },
    { value: 3, label: "On Site"},
  ] },
    { label: "Anni di Esperienza nel Ruolo",        name: "anniEsperienzaRuolo",        type: "text" },
    { label: "Livello Scolastico",                  name: "livelloScolastico",          type: "select",         options: livelloScolasticoOptions },
    { label: "Facoltà",                             name: "facolta",                    type: "select",         options: facoltaOptions },
    { label: "Job Title",                           name: "tipologia",                  type: "select",         options: jobTitleOptions },
    { label: "Data Inserimento",                    name: "dataUltimoContatto",            type: "date" },
    { label: "Stato",                               name: "stato",                      type: "select",         options: statoOptions },
    { label: "Owner",                               name: "owner",                      type: "select",         options: ownerOptions },
    { label: "Seleziona le Skills",                 name: "skills",                     type: "multipleSelectSkill", options: skillsOptions },
    { label: "RAL/Tariffa",                         name: "ral",                        type: "text" },
    { label: "Disponibilità",                       name: "disponibilita",              type: "text" },
    { label: "Note",                                name: "note",                       type: "note" },
    { label: "Curriculim Vitae",                    name: "cv",                         type: "downloadFileCV" },
    { label: "Consultant File",                     name: "cf",                         type: "downloadFileCF" },


  ];
  const initialValues = {
    tipo:                               recruitingData.tipo                      && recruitingData.tipo.id                  || "",
    fornitore:                          recruitingData.fornitore                 && recruitingData.fornitore.id             || "", 
    ricerca:                            recruitingData.ricerca                                                              || "", 
    nome:                               recruitingData.nome                                                                 || "",
    cognome:                            recruitingData.cognome                                                              || "",
    dataNascita:                        recruitingData.dataNascita                                                          || "",
    email:                              recruitingData.email                                                                || "",
    cellulare:                          recruitingData.cellulare                                                            || "",
    anniEsperienza:                     recruitingData.anniEsperienza                                                       || "",
    citta:                              recruitingData.citta                                                                || "",
    modalita:                           recruitingData.modalita                                                             || "", 
    anniEsperienzaRuolo:                recruitingData.anniEsperienzaRuolo                                                  || "",
    livelloScolastico:                  recruitingData.livelloScolastico          && recruitingData.livelloScolastico.id    || "",
    facolta:                            recruitingData.facolta                    && recruitingData.facolta.id              || "",
    tipologia:                          recruitingData.tipologia                  && recruitingData.tipologia.id            || "",
    dataUltimoContatto:                 recruitingData.dataUltimoContatto                                                   || "", 
    stato:                              recruitingData.stato                      && recruitingData.stato.id                || "",
    owner:                              recruitingData.owner                      && recruitingData.owner.id                || "", 
    skills:                            (recruitingData.skills?.map(skill => skill?.id))                                     || [],
    ral:                                recruitingData.ral                                                                  || "",
    disponibilita:                      recruitingData.disponibilita                                                        || "",
    cv:                                 recruitingData.files?.find(file => file.tipologia.descrizione === 'CV')             || '',
    cf:                                 recruitingData.files?.find(file => file.tipologia.descrizione === 'CF')             || '',
    note:                               recruitingData.note                                                                 || "",

  };

  console.log("DATI IN VALUES: ", initialValues);
  

  const handleSubmit = async (values) => {
 
console.log("CV prima dell'invio :", values.cv);
console.log("CF prima dell''invio :",values.cf);
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
 
    try {
  
      console.log("DATI PRIMA DI ESSERE INVIATI: ", values);
      const formData = new FormData();
  
      if (cv instanceof File) {
        formData.append("cv", cv);
      } else {
        // Qui potresti aggiungere il riferimento esistente al file CV, se necessario
         formData.append("cvId", initialValues.cv.id);
      }
      
      // Fai lo stesso per il file CF
      if (cf instanceof File) {
        formData.append("cf", cf);
      } else {
        // Qui potresti aggiungere il riferimento esistente al file CF, se necessario
         formData.append("cfId", initialValues.cf.id);
      }
  
      let skills = "";
      if (values.skills && values.skills.length) {
        skills = values.skills.join(',');
        console.log("Skills selezionate:", skills);
      }

      Object.keys(values).forEach(key => {
        if (key !== 'skills' && key !== 'cv' && key !== 'cf') { 
          formData.append(key, values[key]);
        }
      });
  
      console.log("Contenuto di formData:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      const response = await axios.post(`http://localhost:8080/staffing/salva`, formData, {
        params: { skill: skills },
        headers: {"Content-Type": "multipart/form-data"}
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

  const handleDownloadCV = async (fileId, fileDescrizione) => {
    console.log("FILE ID: ", fileId);

    const url = `http://localhost:8080/files/react/download/file/${fileId}`;
  
    try {

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob', 
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
  };

  
  const handleDownloadCF = async (fileId, fileDescrizione) => {
    console.log("FILE ID: ", fileId);

    const url = `http://localhost:8080/files/react/download/file/${fileId}`;
  
    try {

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob', 
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
  };


  const handleDeleteCV  = async (idf) => {
    console.log("ID DEL CV: ", idf);
    const idc = idCandidato;
    const url = `http://localhost:8080/files/react/elimina/file/candidato/${idf}/${idc}`;
  
    try {
      const response = await axios.delete(`http://localhost:8080/files/react/elimina/file/candidato/${idf}/${idc}`)
      
   
      console.log("Risposta del server: ", response.data);
  
      // Gestisci la risposta positiva
      if(response.data === "OK") {
        console.log("File eliminato con successo!");
        // Aggiorna lo stato o l'interfaccia utente se necessario
      } else {
        console.error("Errore dal server: ", response.data);
      }
  
    } catch (error) {
      console.error("Si è verificato un errore durante l'eliminazione del file:", error);
      // Gestisci eventuali errori di rete o di risposta
    }
  };
  

  const handleDeleteCF  = async (idf) => {
    console.log("ID DEL CV: ", idf);
    const idc = idCandidato;
    const url = `http://localhost:8080/files/react/elimina/file/candidato/${idf}/${idc}`;

    try {
      const response = await axios({
        method: 'DELETE',
        url: url,
      });
      console.log("Risposta del server: ", response);
    } catch (error) {
      console.error('Si è verificato un errore durante il download del file:', error);
    }
  };

  const handleUploadCV = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCV(file);
    }
  };
  
  // Funzione per gestire l'upload di nuovi file CF
  const handleUploadCF = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCF(file);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Modifica Staffing {nomeCandidato} {cognomeCandidato} </div>
          <FieldsBox 
          fields          ={fields} 
          initialValues   ={initialValues}
          onSubmit        ={handleSubmit} 
          title           =""
          onDownloadCV    ={handleDownloadCV}
          onDownloadCF    ={handleDownloadCF}
          onDeleteCV      ={handleDeleteCV}
          onDeleteCF      ={handleDeleteCF} 
          onUploadCV      ={handleUploadCV}
          onUploadCF      ={handleUploadCF}
          campiObbligatori={campiObbligatori}
          skillsOptions={skillsOptions} 
        
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaStaffing;
 