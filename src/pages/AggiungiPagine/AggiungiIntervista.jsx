import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import axios                            from "axios";
import Sidebar                          from "../../components/Sidebar";
import MyBoxGroups                      from "../../components/MyBoxGroups";
import { Button } from "@mui/material";

const AggiungiIntervista = () => {
const navigate      = useNavigate();
const location      = useLocation();
const candidatoID   = location.state?.candidatoID;

console.log("ID Candidato: ", candidatoID);

// Recupera l'accessToken da localStorage
const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

// Configura gli headers della richiesta con l'Authorization token
const headers = {
  Authorization: `Bearer ${accessToken}`
};







const [ tipologiaOptions,           setTipologiaOptions             ] = useState([]); //jobtile
const [ ownerOptions,               setOwnerOptions                 ] = useState([]);
const [ statoOptions,               setStatoOptions                 ] = useState([]); //tipologiaIncontro
const [ tipoIntervistaOptions,      setTipoIntervistaOptions        ] = useState([]); //follow up
const [ interviste,                 setInterviste                   ] = useState([]);
const [ candidato,                  setCandidato                    ] = useState([]);
const [ isDataLoaded,               setIsDataLoaded                 ] = useState(false);



useEffect(() => {
const fetchData = async () => {
    try {


      //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
    const responseTipologia                      = await axios.get("http://localhost:8080/aziende/react/tipologia"                  , { headers: headers });
    const ownerResponse                          = await axios.get("http://localhost:8080/aziende/react/owner"                      , { headers: headers });
    const responseStato                          = await axios.get("http://localhost:8080/staffing/react/stato/candidato"           , { headers: headers });
    const responseTipoIntervista                 = await axios.get("http://localhost:8080/intervista/react/tipointervista"          , { headers: headers });
    const responseIntervista                     = await axios.get(`http://localhost:8080/intervista/react/${candidatoID}`          , { headers: headers });
    const responseCandidato                      = await axios.get(`http://localhost:8080/staffing/react/${candidatoID}`            , { headers: headers }); 



    if (Array.isArray(responseIntervista.data) && responseIntervista.data.length > 0) {
        // Prendi l'ultima intervista (supponendo che l'array sia ordinato in base alla data)
        const ultimaIntervista = responseIntervista.data[responseIntervista.data.length - 1];
        setInterviste(ultimaIntervista); // Aggiorna lo stato con l'ultima intervista
        console.log("Ultima intervista caricata da axios: ", ultimaIntervista);
    } else if (responseIntervista.data.length === 0) {
        // Gestisci il caso in cui non ci sono interviste
        console.log("Non ci sono interviste disponibili per questo candidato.");
        // Potresti anche voler impostare uno stato di default o eseguire altre azioni qui
    } else {
        console.error("I dati ottenuti non sono nel formato Array:", responseIntervista.data);
        // Gestisci altri potenziali errori
    }
    
    if (responseCandidato.data && typeof responseCandidato.data === 'object' && !Array.isArray(responseCandidato.data)) {
        // Supponendo che setCandidato sia il metodo per impostare lo stato del candidato nel tuo componente
        setCandidato(responseCandidato.data);
        console.log("Candidato caricato da axios: ", responseCandidato.data);
    } else {
        console.error("I dati ottenuti non sono in formato oggetto:", responseCandidato.data);
    }


    if (Array.isArray(responseTipoIntervista.data)) {
        const tipoIntervistaOptions = responseTipoIntervista.data.map((tipoIntervista) => ({
        label: tipoIntervista.descrizione,
        value: tipoIntervista.id,
        }));
        setTipoIntervistaOptions(tipoIntervistaOptions);


    if (Array.isArray(responseStato.data)) {
        const statoOptions = responseStato.data.map((stato) => ({
        label: stato.descrizione,
        value: stato.id,
        }));
        setStatoOptions(statoOptions);

    if (Array.isArray(ownerResponse.data)) {
        const ownerOptions = ownerResponse.data.map((owner) => ({
        label: owner.descrizione,
        value: owner.id,
        }));
        setOwnerOptions(ownerOptions);

    if (Array.isArray(responseTipologia.data)) {
        const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
        label: tipologia.descrizione,
        value: tipologia.id,
        }));
        setTipologiaOptions(tipologiaOptions);
        // console.log("DATI DI JOBTILEOPTIONS: ", tipologiaOptions);
    }
    }
}
}

setIsDataLoaded(true);
    } catch (error) {
    console.error("Errore durante il recupero delle province:", error);
    }
};

fetchData();
}, []);

const handleGoBack = () => {
    navigate(-1); 
  };


const campiObbligatori = [ "dataColloquio"];

const fields = [
    { type: "titleGroups",                label: "Informazioni candidato"             },
    { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, },
    { label: "Nome",                      name: "nome",                   type: "text"},
    { label: "Cognome",                   name: "cognome",                type: "text"},
    { label: "Data di Nasciata",          name: "dataNascita",            type: "date"},
    { label: "Location",                  name: "location",               type: "text"},
    { label: "Job Title",                 name: "tipologia",              type: "select", options: tipologiaOptions },
    { label: "Anni di Esperienza",        name: "anniEsperienza",         type: "text"},
    { label: "* Data Incontro",           name: "dataColloquio",          type: "date"},
    { label: "Recapiti",                  name: "cellulare",              type: "text"},
    { label: "Intervistatore",            name: "idOwner",                type: "select", options: ownerOptions },




    { type: "titleGroups",                label: "Soft Skills"                         },
    { label: "Aderenza Posizione",        name: "aderenza",                type: "text"},
    { label: "Coerenza Percorso",         name: "coerenza",                type: "text"},
    { label: "Motivazione Posizione",     name: "motivazione",             type: "text"},
    { label: "Standing",                  name: "standing",                type: "text"},
    { label: "Energia",                   name: "energia",                 type: "text"},
    { label: "Comunicazione",             name: "comunicazione",           type: "text"},
    { label: "Livello di Inglese",        name: "inglese",                 type: "text"},



    { type: "titleGroups",                label: "Hard Skills"                         },
    { label: "Competenze vs ruolo",       name: "competenze",              type: "text"},
    { label: "Valutazione",               name: "valutazione",             type: "text"},



    { type: "titleGroups",                label: "Ultime Osservazioni"                 },
    { label: "One word",                  name: "descrizioneCandidatoUna", type: "text"},
    { label: "Lo vorresti nel tuo team?", name: "teamSiNo",                type: "text"},
    { label: "Descrizione Candidato",     name: "note",                    type: "note"},
    


    { type: "titleGroups",                label: "Next Steps"},
    { label: "Disponibilità",             name: "disponibilita",           type: "text"},
    { label: "RAL Attuale",               name: "attuale",                 type: "text"},
    { label: "RAL Desiderata",            name: "desiderata",              type: "text"},
    { label: "Proposta economica",        name: "proposta",                type: "text"},
    { label: "Follow Up",                 name: "tipo",                    type: "select", options: tipoIntervistaOptions },
    { label: "Preavviso",                 name: "preavviso",               type: "text"},
    { label: "Next Deadline",             name: "dataAggiornamento",       type: "dateOra"},
    { label: "Owner next Deadline",       name: "idNextOwner",             type: "select", options: ownerOptions },

];



const initialValues = {
    stato:                            candidato.stato?.id                           || null,
    nome:                             candidato?.nome                               || null,
    cognome:                          candidato.cognome                             || null,
    dataNascita:                      candidato.dataNascita                         || null,
    location:                         candidato.citta                               || null, 
    tipologia:                        candidato.tipologia?.id                       || null,
    anniEsperienza:                   candidato.anniEsperienza                      || null,
    dataColloquio:                    interviste.dataColloquio                      || null,
    cellulare:                        candidato.cellulare                           || null,
    idOwner:                          interviste.owner?.id                          || null,
    aderenza:                         interviste.aderenza                           || null,
    coerenza:                         interviste.coerenza                           || null,
    motivazione:                      interviste.motivazione                        || null,
    standing:                         interviste.standing                           || null,
    energia:                          interviste.energia                            || null,
    comunicazione:                    interviste.comunicazione                      || null,
    inglese:                          interviste.inglese                            || null,
    competenze:                       interviste.competenze                         || null,
    valutazione:                      interviste.valutazione                        || null,
    descrizioneCandidatoUna:          interviste.descrizioneCandidatoUna            || null,
    teamSiNo:                         interviste.teamSiNo                           || null,
    note:                             interviste.note                               || null,
    disponibilita:                    interviste.disponibilita                      || null,
    attuale:                          interviste.attuale                            || null,
    desiderata:                       interviste.desiderata                         || null,
    proposta:                         interviste.proposta                           || null,
    tipo:                             interviste.tipo?.id                           || null,
    preavviso:                        interviste.preavviso                          || null,
    dataAggiornamento:                interviste.dataAggiornamento                  || null,
    idNextOwner:                      interviste.nextOwner?.id                      || null
};

console.log("DATI INITIAL: ", initialValues);

const disableFields = {
nome:               true,
cognome:            true,
dataNascita:        true,
tipologia:          true,
location:           true,
anniEsperienza:     true,
cellulare:          true,
};

const handleSubmit = async (values) => {
    try {
      // console.log("DATI DI VALUES: ", values);



    //   const idCandidato = rowData.candidato?.id;
    const note = values.note;
    const modifica = 0; 

    // delete values.candidatoID;
    // delete values.modifica;
    // delete values.note;

    // const url = `http://localhost:8080/intervista/react/salva?idCandidato=${idCandidato}&note=${encodeURIComponent(note)}&modifica=${modifica}`;
    const response = await axios.post("http://localhost:8080/intervista/react/salva",  values, {
      params: {
        idCandidato: candidatoID,
        note: note,
        modifica: modifica
      },
      headers: headers
    });
    console.log("DATI INVIATI: ", values);
    console.log("Response from server:", response.data);


    navigate(`/staffing/intervista/${candidatoID}`);
    } catch (error) {
    console.error("Errore durante il salvataggio:", error);
    }
};

return (
    <div className="container">
    <div className="content">
        <div className="sidebar-container">
        <Sidebar />
        </div>
        <div className="container">
        <div className="page-name" style={{ margin: '20px',fontSize: "15px" }}>
        <h1>{`Aggiungi Intervista `}</h1>
        </div>
        {isDataLoaded ? (
        <MyBoxGroups 
        fields={fields} 
        initialValues={initialValues}  
        disableFields={disableFields} 
        onSave={handleSubmit} 
        title="" 
        campiObbligatori={campiObbligatori}
        />
        ) : (
            <div>Caricamento in corso...</div> // Puoi sostituirlo con un componente di spinner o simili
          )}
          <Button
              color="primary"
              onClick={handleGoBack}
              sx={{
                backgroundColor: "black",
                borderRadius: '40px',
                color: "white",
                width: '250px',
                height: '30px', 
                margin: 'auto',
                marginBottom: '20px',
                marginTop: 'auto',
                "&:hover": {
                  backgroundColor: "black",
                  transform: "scale(1.05)",
                },
              }}
            >
              Torna ad Interviste
            </Button>
        </div>
    </div>
    </div>
);
};

export default AggiungiIntervista;
