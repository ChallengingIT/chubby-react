
//funzionante al 21 dicembre 2023 9:00

import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import Sidebar                          from "../../components/Sidebar";
import axios                            from "axios";
import MyBoxGroups                      from "../../components/MyBoxGroups";

const AggiungiIncontro = () => {
  const navigate = useNavigate();
  const location = useLocation();
// const candidatoData = location.state.candidatoData;
// const candidatoID = candidatoData.id;
const candidatoData = location.state?.candidatoData;
const candidatoID   = location.state?.candidatoID; 

console.log("CANDIDATO DATA ARRIVATO: ", candidatoData);

// Recupera l'accessToken da localStorage
const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

// Configura gli headers della richiesta con l'Authorization token
const headers = {
  Authorization: `Bearer ${accessToken}`
};


useEffect(() => {
  // console.log("ID DEL CANDIDATO: ", candidatoID); 

}, [candidatoID]); 

// console.log("DATI ARRIVATI DA INTERVISTE: ", candidatoData);

  const handleCancel = () => {

    // console.log("Operazione annullata");
  };


  const [ tipologiaOptions,             setTipologiaOptions       ] = useState([]); //jobtile
  const [ ownerOptions,                 setOwnerOptions           ] = useState([]);
  const [ statoOptions,                 setStatoOptions           ] = useState([]); //tipologiaIncontro
  const [ tipoIntervistaOptions,        setTipoIntervistaOptions  ] = useState([]); //follow up
  const [ interviste,                   setInterviste             ] = useState([]);
  






  useEffect(() => {
    const fetchData = async () => {
      try {


        //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
        const responseTipologia                      = await axios.get("http://localhost:8080/aziende/react/tipologia"          , { headers });
        const ownerResponse                          = await axios.get("http://localhost:8080/aziende/react/owner"              , { headers });
        const responseStato                          = await axios.get("http://localhost:8080/staffing/react/stato/candidato"   , { headers });
        const responseTipoIntervista                 = await axios.get("http://localhost:8080/intervista/react/tipointervista"  , { headers });
        const responseIntervista                     = await axios.get(`http://localhost:8080/intervista/react/${candidatoID}`  , { headers });

        if (Array.isArray(responseIntervista.data)) {
          const intervisteConId = responseIntervista.data.map((interviste) => ({ ...interviste }));
          setInterviste(intervisteConId);
          // console.log("ARRAY DI INTERVISTE DEL CANDIDATO: ", intervisteConId);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseIntervista.data);
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



      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };
  
    fetchData();
  }, []);

//verifica se candidato ha interviste altrimenti lo crea
  useEffect(() => {
    if (candidatoData) {
      const intervisteArray = candidatoData.interviste || [];
      setInterviste(intervisteArray);

    }
  }, [candidatoData]);

  //se c'è interviste ne prende l'ultima
  const getUltimaIntervista = () => {
    if (interviste.length > 0) {
      return interviste[interviste.length - 1];
    }
    return null;
  };
  
  

  const fields = [

    { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, 
  
},
    { label: "Nome",                      name: "nome",                   type: "text"   },
    { label: "Cognome",                   name: "cognome",                type: "text"   },
    { label: "Data di Nasciata",          name: "dataNascita",            type: "date"   },
    { label: "Location",                  name: "location",               type: "text"   },
    { label: "Job Title",                 name: "tipologia",              type: "select", options: tipologiaOptions },
    { label: "Anni di Esperienza",        name: "anniEsperienza",         type: "text"   },
    { label: "Data Incontro",             name: "dataUltimoContatto",     type: "date"   },
    { label: "Recapiti",                  name: "cellulare",              type: "text"   },
    { label: "Intervistatore",            name: "idOwner",                type: "select", options: ownerOptions },




    { type: "titleGroups",                label: "Soft Skills"                           },
    { label: "Aderenza Posizione",        name: "aderenza",                type: "number"},
    { label: "Coerenza Percorso",         name: "coerenza",                type: "number"},
    { label: "Motivazione Posizione",     name: "motivazione",             type: "number"},
    { label: "Standing",                  name: "standing",                type: "number"},
    { label: "Energia",                   name: "energia",                 type: "number"},
    { label: "Comunicazione",             name: "comunicazione",           type: "number"},
    { label: "Livello di Inglese",        name: "inglese",                 type: "number"},



    { type: "titleGroups",                label: "Hard Skills"                           },
    { label: "Competenze vs ruolo",       name: "competenze",              type: "text"  },
    { label: "Valutazione",               name: "valutazione",             type: "number"},



    { type: "titleGroups",                label: "Ultime Osservazioni"                    },
    { label: "One word",                  name: "descrizioneCandidatoUna",  type: "text"  },
    { label: "Lo vorresti nel tuo team?", name: "teamSiNo",                 type: "text"  },
    { label: "Descrizione Candidato",     name: "descrizioneCandidato",     type: "note"  },
    


    { type: "titleGroups",                label: "Next Steps"},
    { label: "Disponibilità",             name: "disponibilita",            type: "text"  },
    { label: "RAL Attuale",               name: "attuale",                  type: "text"  },
    { label: "RAL Desiderata",            name: "desiderata",               type: "text"  },
    { label: "Proposta economica",        name: "proposta",                 type: "text"  },
    { label: "Follow Up",                 name: "idTipo",                   type: "select", options: tipoIntervistaOptions },
    { label: "Preavviso",                 name: "preavviso",                type: "text"  },
    { label: "Next Deadline",             name: "dataAggiornamento",        type: "date"  },
    { label: "Owner next Deadline",       name: "idNextOwner",              type: "select", options: ownerOptions },

  ];
  // const intervistaData = intervisteData.intervista && intervisteData.intervista[0];
  const candidatoDataObject = candidatoData[0];
  console.log("CANDIDATO OBJECT: ", candidatoDataObject);
  const ultimaIntervista = getUltimaIntervista();
  console.log("ULTIMA INTERVISTA: ", ultimaIntervista);
  

const initialValues = {
    stato:                            candidatoDataObject.stato?.id                                                   || "",
    nome:                             candidatoDataObject.nome                                                        || "",
    cognome:                          candidatoDataObject.cognome                                                     || "",
    dataNascita:                      candidatoDataObject.dataNascita                                                 || "",
    citta:                            candidatoDataObject.citta                                                       || "", 
    tipologia:                        candidatoDataObject.tipologia?.id                                               || "",
    anniEsperienza:                   candidatoDataObject.anniEsperienza                                              || "",
    dataUltimoContatto:               ultimaIntervista ? ultimaIntervista.dataUltimoContatto                           : "",
    cellulare:                        candidatoDataObject?.cellulare                                                  || "",
    idOwner:                          ultimaIntervista ? ultimaIntervista.owner?.id                                    : "",
    aderenza:                         ultimaIntervista ? ultimaIntervista.aderenza                                     : "",
    coerenza:                         ultimaIntervista ? ultimaIntervista.coerenza                                     : "",
    motivazione:                      ultimaIntervista ? ultimaIntervista.motivazione                                  : "",
    standing:                         ultimaIntervista ? ultimaIntervista.standing                                     : "",
    energia:                          ultimaIntervista ? ultimaIntervista.energia                                      : "",
    comunicazione:                    ultimaIntervista ? ultimaIntervista.comunicazione                                : "",
    inglese:                          ultimaIntervista ? ultimaIntervista.inglese                                      : "",
    competenze:                       ultimaIntervista ? ultimaIntervista.competenze                                   : "",
    valutazione:                      ultimaIntervista ? ultimaIntervista.valutazione                                  : "",
    descrizioneCandidatoUna:          ultimaIntervista ? ultimaIntervista.descrizioneCandidatoUna                      : "",
    teamSiNo:                         ultimaIntervista ? ultimaIntervista.teamSiNo                                     : "",
    descrizioneCandidato:             candidatoDataObject.note                                                        || "",
    disponibilita:                    ultimaIntervista ? ultimaIntervista.disponibilita                                : "",
    attuale:                          ultimaIntervista ? ultimaIntervista.attuale                                      : "",
    desiderata:                       ultimaIntervista ? ultimaIntervista.desiderata                                   : "",
    proposta:                         ultimaIntervista ? ultimaIntervista.proposta                                     : "",
    idTipo:                           ultimaIntervista ? ultimaIntervista.tipo?.id                                     : "",
    preavviso:                        ultimaIntervista ? ultimaIntervista.preavviso                                    : "",
    dataAggiornamento:                candidatoDataObject?.dataAggiornamento                                          || "",
    idNextOwner:                      ultimaIntervista?.nextOwner?.id                                                 || ""
};

console.log("DATI IN INTIAL VALUES: ", initialValues);


  //   tipologiaIncontro:                    intervisteData.stato?.descrizione || "",
  //   nome:                                 intervisteData.nome                                         || "",
  //   cognome:                              intervisteData.cognome                                      || "",
  //   dataNascita:                          intervisteData.dataNascita                                  || "",
  //   location:                             intervisteData.location                                     || "",
  //   jobTitle:                             intervisteData.jobTitle                                     || "",
  //   anniEsperienza:                       intervisteData.intervista.anniEsperienza                    || "",
  //   dataIncontro:                         intervisteData.intervista.dataColloquio                     || "",
  //   recapiti:                             intervisteData.intervista.recapiti                          || "",
  //   intervistatore:                       intervisteData.owner.descrizione                            || "",
  //   aderenzaPosizione:                    intervisteData.intervista.aderenza                          || "",
  //   coerenzaPercorso:                     intervisteData.intervista.coerenza                          || "",
  //   motivazionePosizione:                 intervisteData.intervista.motivazione                       || "",
  //   standing:                             intervisteData.intervista.standing                          || "",
  //   energia:                              intervisteData.intervista.energia                           || "",
  //   comunicazione:                        intervisteData.intervista.comunicazione                     || "",
  //   livelloInglese:                       intervisteData.intervista.inglese                           || "",
  //   competenzeRuolo:                      intervisteData.intervista.competenze                        || "",
  //   valutazione:                          intervisteData.intervista.valutazione                       || "",
  //   oneWord:                              intervisteData.intervista.descrizioneCandidatoUna           || "",
  //   loVorrestiNelTuoTeam:                 intervisteData.intervista.teamSiNo                          || "",
  //   descrizione:                          intervisteData.note                                         || "",
  //   disponibilita:                        intervisteData.intervista.disponibilita                     || "",
  //   ralAttuale:                           intervisteData.intervista.attuale                           || "",
  //   ralDesiderata:                        intervisteData.intervista.desiderata                        || "",
  //   propostaEconomica:                    intervisteData.intervista.proposta                          || "",
  //   followUp:                             intervisteData.followUp                                     || "",
  //   preavviso:                            intervisteData.intervista.preavviso                         || "",
  //   nextDeadline:                         intervisteData.nextDeadline                                 || "",
  //   ownerNextDeadline:                    intervisteData.intervista.nextOwner                         || "",
  // };


  // console.log("DATI IN INITIAL VALUES: ", initialValues); 

  const disableFields = {
    stato:                      true,
    nome:                       true,
    cognome:                    true,
    dataNascita:                true,
    citta:                      true,
    tipologia:                  true,
    anniEsperienza:             true,
    cellulare:                  true,
    owner:                      true
  };

  const handleSubmit = async (values) => {
    try {
      // console.log("DATI DI VALUES: ", values);
  

      const idCandidato = candidatoID;
      const note = values.note;
      const modifica = 0; 
  
      const response = await axios.post("http://localhost:8080/intervista/react/salva", { headers }, values, {
          params: {
            idCandidato: idCandidato,
            note: note,
            modifica: modifica
          }
        });
      console.log("DATI INVIATI: ", values);
      console.log("Response from server:", response.data);
  

      navigate(`/staffing/intervista/${candidatoID}`);
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };
  

  // const handleSubmit = async (values) => {
  //   try {
  //     console.log("DATI DI VALUES: ", values);

  //     const idCandidato = intervistaData.id;
  //     const modifica = 0;
  //     const note = values.descrizione;
  //     // values.modifica = modifica;
  //     // console.log("DATI DI IDCANDIDATO IN SUBMIT: ", idCandidato);

  //     const response = await axios.post("http://localhost:8080/intervista/react/salva", values);
  //     console.log("Response from server:", response.data);

  //     navigate("/interviste"); //poi dove si va?
  //   } catch (error) {
  //     console.error("Errore durante il salvataggio:", error);
  //   }
  // };

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Aggiungi un nuovo incontro</div>
          <MyBoxGroups 
          fields={fields} 
          initialValues={initialValues} 
          disableFields={disableFields} 
          onSave={handleSubmit} 
          onCancel={handleCancel} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};


export default AggiungiIncontro;
