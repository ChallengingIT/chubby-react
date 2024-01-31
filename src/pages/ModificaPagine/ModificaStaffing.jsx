import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldBoxFile from "../../components/FieldBoxFile";
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
  const [newCVUploaded,             setNewCVUploaded             ] = useState(false);
  const [newCFUploaded,             setNewCFUploaded             ] = useState(false);    

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
        const responseStato               = await axios.get("http://localhost:8080/staffing/react/stato/candidato", { headers: headers });
        const responseFornitore           = await axios.get("http://localhost:8080/fornitori/react", { headers: headers });
        const responseJobTitle            = await axios.get("http://localhost:8080/aziende/react/tipologia", { headers: headers });
        const responseTipologia           = await axios.get("http://localhost:8080/staffing/react/tipo", { headers: headers });
        const responseNeedSkill           = await axios.get("http://localhost:8080/staffing/react/skill", { headers: headers });
        const livelloScolasticoResponse   = await axios.get("http://localhost:8080/staffing/react/livello", { headers: headers });
        const ownerResponse               = await axios.get("http://localhost:8080/aziende/react/owner", { headers: headers });
        const facoltaResponse             = await axios.get("http://localhost:8080/staffing/react/facolta", { headers: headers });

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

  const campiObbligatori = ["nome", "cognome", "email", "anniEsperienzaRuolo", "tipologia", "dataUltimoContatto" ];

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
    { label: "Data Inserimento",                    name: "dataUltimoContatto",         type: "date" },
    { label: "Stato",                               name: "stato",                      type: "select",         options: statoOptions },
    { label: "Owner",                               name: "owner",                      type: "select",         options: ownerOptions },
    { label: "Seleziona le Skills",                 name: "skills",                     type: "multipleSelectSkill", options: skillsOptions },
    { label: "RAL/Tariffa",                         name: "ral",                        type: "text" },
    { label: "Disponibilità",                       name: "disponibilita",              type: "text" },
    { label: "Note",                                name: "note",                       type: "note" },
    { label: "Curriculim Vitae",                    name: "cv",                         type: "modificaFileCV" },
    { label: "Consultant File",                     name: "cf",                         type: "modificaFileCF" },


  ];
  const initialValues = {
    id:                                 recruitingData.id                                                                   ,
    tipo:                               recruitingData.tipo                      && recruitingData.tipo.id                  || null,
    fornitore:                          recruitingData.fornitore                 && recruitingData.fornitore.id             || null, 
    ricerca:                            recruitingData.ricerca                                                              || null, 
    nome:                               recruitingData.nome                                                                 || null,
    cognome:                            recruitingData.cognome                                                              || null,
    dataNascita:                        recruitingData.dataNascita                                                          || null,
    email:                              recruitingData.email                                                                || null,
    cellulare:                          recruitingData.cellulare                                                            || null,
    anniEsperienza:                     recruitingData.anniEsperienza                                                       || null,
    citta:                              recruitingData.citta                                                                || null,
    modalita:                           recruitingData.modalita                                                             || null, 
    anniEsperienzaRuolo:                recruitingData.anniEsperienzaRuolo                                                  || null,
    livelloScolastico:                  recruitingData.livelloScolastico          && recruitingData.livelloScolastico.id    || null,
    facolta:                            recruitingData.facolta                    && recruitingData.facolta.id              || null,
    tipologia:                          recruitingData.tipologia                  && recruitingData.tipologia.id            || null,
    dataUltimoContatto:                 recruitingData.dataUltimoContatto                                                   || null, 
    stato:                              recruitingData.stato                      && recruitingData.stato.id                || null,
    owner:                              recruitingData.owner                      && recruitingData.owner.id                || null, 
    skills:                            (recruitingData.skills?.map(skill => skill?.id))                                     || null,
    ral:                                recruitingData.ral                                                                  || null,
    disponibilita:                      recruitingData.disponibilita                                                        || null,
    cv:                                 recruitingData.files?.find(file => file.tipologia.descrizione === 'CV')             || null,
    cf:                                 recruitingData.files?.find(file => file.tipologia.descrizione === 'CF')             || null,
    note:                               recruitingData.note                                                                 || null,

  };

  console.log("DATI IN VALUES: ", initialValues);


const handleSubmit = async (values, fileCV, fileCF) => {
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

      const cv = values.cv;
      const cf = values.cf;

      delete values.cv;
      delete values.cf;

      // Invio della richiesta al server con skills e skills2 come parametri di query
      const datiResponse = await axios.post("http://localhost:8080/staffing/salva", values, {
      params: { skill: skills },
      headers: headers,
      });

      console.log("Risposta della prima chiamata:", datiResponse.data);
            // Ottieni l'ID del candidato dalla risposta
  const candidatoId = datiResponse.data;
  console.log("ID DEL CANDIDATO: ", candidatoId);


  



  

    // Preparazione dei dati per le chiamate Axios dei file
  const config = {
      headers: {
      Authorization: `Bearer ${accessToken}`,
      }
  };

  console.log("PRIMA DI INVIO FILE DENTRO CONFIG: ", config);


try{

  Object.keys(values).forEach(key => {
    if (!campiObbligatori.includes(key) && !values[key]) {
    values[key] = null;
    }
});

    // Invio del file "cv", se presente
    if (fileCV) {

    if( fileCV instanceof File) {
      const formDataCV = new FormData();
      formDataCV.append('file', fileCV);
      formDataCV.append('tipo', 1);

      const responseCV = await axios.post(`http://localhost:8080/staffing/react/staff/salva/file/${candidatoId}`, formDataCV, 
      {headers: headers});
      console.log("invio corretto del CV", responseCV);
  } 
}
} catch(error) {
      console.error("Errore nell'invio del CV", error);
  }

  try{

    // Invio del file "cf", se presente
if(fileCF) {
  if( fileCF instanceof File) {
      const formDataCF = new FormData();
      formDataCF.append('file', fileCF);
      formDataCF.append('tipo', 2);
      const responseCF = await axios.post(`http://localhost:8080/staffing/react/staff/salva/file/${candidatoId}`, formDataCF, {headers: headers});
      console.log("Invio corretto del CF", responseCF);
  }
}
} catch(error) {
  console.error("errore nell'invio del CF", error);
}

  navigate("/recruiting");

} catch(error) {
  console.error("Errore nella chiamata axios: ", error);
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
          <div className="page-name">Modifica Staffing {nomeCandidato} {cognomeCandidato} </div>
          <FieldBoxFile 
          fields          ={fields} 
          initialValues   ={initialValues}
          onSubmit        ={handleSubmit} 
          title           =""
          campiObbligatori={campiObbligatori}
          skillsOptions={skillsOptions} 
          idCandidato={idCandidato}
          
        
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaStaffing;
 