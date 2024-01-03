import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import MyBoxMIU                               from "../../components/MyBoxMIU";
import FieldsBox from "../../components/FieldsBox";

const DettaglioDipendente = () => {
  const navigate                        = useNavigate();
  const location                        = useLocation();
  const { dipendentiData = {} }         = location.state || {};
  const nomeDipendente                  = dipendentiData.nome;
  const cognomeDipendente               = dipendentiData.cognome;


  const [ tipologiaOptions, setTipologiaOptions] = useState([]);
  const [ skillsOptions,   setSkillsOptions  ] = useState([]);
  const [ facoltaOptions,                 setFacoltaOptions                   ] = useState([]);
  const [ livelloScolasticoOptions,       setLivelloScolasticoOptions         ] = useState([]);
  const [ tipologiaContrattoOptions,      setTipologiaContrattoOptions                 ] = useState([]);

  console.log("Dati Arrivati: ", dipendentiData);


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseJobTitle              = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseNeed                  = await axios.get("http://localhost:8080/staffing/react/skill");
        const facoltaResponse               = await axios.get("http://localhost:8080/staffing/react/facolta");
        const livelloScolasticoResponse     = await axios.get("http://localhost:8080/staffing/react/livello");
        const tipologiaContrattoResponse    = await axios.get("http://localhost:8080/hr/react/tipocontratto");

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

        if (Array.isArray(responseNeed.data)) {
          const skillsNames = responseNeed.data.map((need) => need.descrizione || '');
        setSkillsOptions(skillsNames);          
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseNeed.data);
        }

        if (Array.isArray(responseJobTitle.data)) {
          const tipologiaOptions = responseJobTitle.data.map((tipologia) => ({
            label: tipologia.descrizione,
            value: tipologia.id,
          }));
          setTipologiaOptions(tipologiaOptions);

        
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




  const fields = [
    { label: "Nome",                      name: "nome",                 type: "text",                                     disabled: true },
    { label: "Cognome",                   name: "cognome",              type: "text",                                     disabled: true },
    { label: "Data di Nascita",           name: "dataNascita",          type: "date",                                     disabled: true},
    { label: "Luogo di Nascita",          name: "luogoNascita",         type: "text",                                     disabled: true },
    { label: "Email",                     name: "email",                type: "text",                                     disabled: true },
    { label: "Cellulare",                 name: "cellulare",            type: "text",                                     disabled: true},
    { label: "Residenza",                 name: "citta",                type: "text",                                     disabled: true },
    { label: "Data Inizio",               name: "dataInizio",           type: "date",                                     disabled: true },
    { label: "Scadenza Contratto",        name: "scadenza",             type: "date",                                     disabled: true },
    { label: "Anni Esperienza",           name: "anniEsperienza",       type: "text",                                     disabled: true },
    { label: "Livello Scolastico",        name: "livelloScolastico",    type: "select",          options: livelloScolasticoOptions, disabled: true },
    { label: "Facoltà",                   name: "facolta",              type: "select",          options: facoltaOptions, disabled: true},
    { label: "IBAN",                      name: "iban",                 type:"text",                                      disabled: true},
    { label: "Codice Fiscale",            name: "codFiscale",           type:"text",                                      disabled: true},
    { label: "RAL/Tariffa",               name: "ral",                  type:"text",                                      disabled: true},
    { label: "Job Title",                 name: "tipologia",            type: "select",          options: tipologiaOptions, disabled: true },
    { label: "Seleziona le Skills",       name: "skills",               type: "multipleSelect",  options: skillsOptions,   disabled: true },
    { label: "Tipologia Contratto",       name: "tipologiaContratto",   type: "select",          options: tipologiaContrattoOptions, disabled: true }, 
    { label: "Note",                      name: "note",                 type: "note",                                     disabled: true },
    { label: "Allegati",                  name: "files",                type: "soloDownloadAllegati" },
  ];

  const initialValues = {
    nome:               dipendentiData.nome              || "",
    cognome:            dipendentiData.cognome           || "",
    dataNascita:        dipendentiData.dataNascita       || "",
    luogoNascita:       dipendentiData.luogoNascita      || "",
    email:              dipendentiData.email             || "",
    cellulare:          dipendentiData.cellulare         || "",
    citta:              dipendentiData.citta             || "",
    dataInizio:         dipendentiData.dataInizio        || "",
    scadenza:           dipendentiData.dataScadenza      || "",
    anniEsperienza:     dipendentiData.anniEsperienza    || "",
    livelloScolastico:  dipendentiData.livelloScolastico && dipendentiData.livelloScolastico.id || "",
    facolta:            dipendentiData.facolta && dipendentiData.facolta.id           || "",
    iban:               dipendentiData.iban              || "",
    codFiscale:         dipendentiData.codFiscale        || "",
    ral:                dipendentiData.ral               || "",
    tipologia:          dipendentiData.tipologia && dipendentiData.tipologia.id || "",
    skills:            (dipendentiData.skills?.map(skill => skill?.descrizione)) || [],
    tipologiaContratto: dipendentiData.tipologiaContratto && dipendentiData.tipologiaContratto.id || "",
    note:               dipendentiData.note              || "",
    files:              (dipendentiData.files?.map(file => file?.descrizione)) || [],          
  };

  console.log("Valore iniziale di status:", initialValues.status);


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



  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Visualizza Staff {nomeDipendente} {cognomeDipendente} </div>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          showSaveButton={false} 
          title="" 
          onDownloadAllegati = {handleDownloadAllegati}
          />
        </div>
      </div>
    </div>
  );
};

export default DettaglioDipendente;
