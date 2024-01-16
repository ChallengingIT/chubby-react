import React, { useState, useEffect }               from "react";
import { useNavigate, useLocation, useParams }      from "react-router-dom";
import axios                                        from "axios";
import Sidebar                                      from "../../components/Sidebar";
import MyBoxGroups                                  from "../../components/MyBoxGroups";

const DettaglioIntervista = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rowData  = location.state;
  console.log("Dati ricevuti:", rowData);
  const params   = useParams();



  // const idIntervista = params.id;


  // console.log("ID INTERVISTA ARRIVATO: ", idIntervista);




  const [ tipologiaOptions,        setTipologiaOptions      ] = useState([]); //jobtile
  const [ ownerOptions,            setOwnerOptions          ] = useState([]);
  const [ statoOptions,            setStatoOptions          ] = useState([]); //tipologiaIncontro
  const [ tipoIntervistaOptions,   setTipoIntervistaOptions ] = useState([]); //follow up
  // const [ candidatoOptions, setCandidatoOptions ] = useState([]);
  // const [ intervistaData, setIntervistaData ] = useState([]);
  // const [rowData, setrowData] = useState(null);



useEffect(() => {
  const fetchData = async () => {
    try {


      //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
      const responseTipologia                      = await axios.get("http://localhost:8080/aziende/react/tipologia");
      const ownerResponse                          = await axios.get("http://localhost:8080/aziende/react/owner");
      const responseStato                          = await axios.get("http://localhost:8080/staffing/react/stato/candidato");
      const responseTipoIntervista                 = await axios.get("http://localhost:8080/intervista/react/tipointervista");


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
      console.error("Errore durante il recupero delle province:", error);
    }
  };

  fetchData();
}, []);




const fields = [

  { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, 

},
  { label: "Nome",                      name: "nome",                   type: "text"},
  { label: "Cognome",                   name: "cognome",                type: "text"},
  { label: "Data di Nasciata",          name: "dataNascita",            type: "date"},
  { label: "Location",                  name: "location",               type: "text"},
  { label: "Job Title",                 name: "tipologia",              type: "select", options: tipologiaOptions },
  { label: "Anni di Esperienza",        name: "anniEsperienza",         type: "text"},
  { label: "Data Incontro",             name: "dataColloquio",          type: "date"},
  { label: "Recapiti",                  name: "cellulare",              type: "text"},
  { label: "Intervistatore",            name: "owner",                  type: "select", options: ownerOptions },




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
  { label: "Follow Up",                 name: "idTipo",                  type: "select", options: tipoIntervistaOptions },
  { label: "Preavviso",                 name: "preavviso",               type: "text"},
  { label: "Next Deadline",             name: "dataAggiornamento",       type: "dateOra"},
  { label: "Owner next Deadline",       name: "idNextOwner",             type: "select", options: ownerOptions },

];




const initialValues = {
  stato:                            rowData.stato?.id                         || "",
  nome:                             rowData.candidato?.nome                   || "",
  cognome:                          rowData.candidato?.cognome                || "",
  dataNascita:                      rowData.candidato?.dataNascita            || "",
  location:                         rowData.candidato?.citta                  || "", 
  tipologia:                        rowData.candidato?.tipologia?.id          || "",
  anniEsperienza:                   rowData.candidato?.anniEsperienza         || "",
  dataColloquio:                    rowData.dataColloquio                     || "",
  cellulare:                        rowData.candidato?.cellulare              || "",
  owner:                            rowData.owner?.id                         || "",
  aderenza:                         rowData.aderenza                          || "",
  coerenza:                         rowData.coerenza                          || "",
  motivazione:                      rowData.motivazione                       || "",
  standing:                         rowData.standing?.toString()              || "",
  energia:                          rowData.energia?.toString()               || "",
  comunicazione:                    rowData.comunicazione?.toString()         || "",
  inglese:                          rowData.inglese?.toString()               || "",
  competenze:                       rowData.competenze                        || "",
  valutazione:                      rowData.valutazione                       || "",
  descrizioneCandidatoUna:          rowData.descrizioneCandidatoUna           || "",
  teamSiNo:                         rowData.teamSiNo                          || "",
  note:                             rowData.candidato?.note                   || "",
  disponibilita:                    rowData.disponibilita                     || "",
  attuale:                          rowData.attuale                           || "",
  desiderata:                       rowData.desiderata                        || "",
  proposta:                         rowData.proposta                          || "",
  idTipo:                           rowData.tipo?.id                          || "",
  preavviso:                        rowData.preavviso                         || "",
  dataAggiornamento:                rowData.dataAggiornamento                 || "", // Assicurati che questo sia il campo corretto
  idNextOwner:                      rowData.candidato?.owner?.id              || ""
};


// const initialValues = {
//   stato:                            rowData.stato?.id                                                  || "",
//   nome:                             rowData.candidato?.nome                                                       || "",
//   cognome:                          rowData.candidato?.cognome                                                    || "",
//   dataNascita:                      rowData.candidato?.dataNascita                                                || "",
//   location:                         rowData.candidato?.citta                                                      || "", 
//   tipologia:                        rowData.candidato?.tipologia?.id                                              || "",
//   anniEsperienza:                   rowData.anniEsperienza                                             || "",
//   dataIncontro:                     rowData.dataColloquio                                             || "",
//   recapiti:                         rowData.candidato?.cellulare                                                  || "",
//   owner:                            rowData.owner?.id                                                 || "",
//   aderenzaPosizione:                rowData.aderenza                                                  || "",
//   coerenzaPercorso:                 rowData.coerenza                                                  || "",
//   motivazionePosizione:             rowData.motivazione                                               || "",
//   standing:                         rowData.standing                                                  || "",
//   energia:                          rowData.energia                                                   || "",
//   comunicazione:                    rowData.comunicazione                                             || "",
//   livelloInglese:                   rowData.inglese                                                   || "",
//   competenzeRuolo:                  rowData.competenze                                                || "",
//   valutazione:                      rowData.valutazione                                               || "",
//   oneWord:                          rowData.descrizioneCandidatoUna                                   || "",
//   loVorrestiNelTuoTeam:             rowData.teamSiNo                                                  || "",
//   descrizione:                      rowData.descrizioneCandidato                                                       || "",
//   disponibilita:                    rowData.disponibilita                                             || "",
//   ralAttuale:                       rowData.attuale                                                   || "",
//   ralDesiderata:                    rowData.desiderata                                                || "",
//   propostaEconomica:                rowData.proposta                                                  || "",
//   followUp:                         rowData.tipo?.id                                                  || "",
//   preavviso:                        rowData.preavviso                                                 || "",
//   nextDeadline:                     rowData.nextDeadline                                              || "",
//   ownerNextDeadline:                rowData.candidato?.owner?.id                                             || ""
// };
// console.log("INITIAL: ", initialValues);



const disableFields = {
  stato:                      true,
  nome:                       true,
  cognome:                    true,
  dataNascita:                true,
  location:                   true,
  tipologia:                  true,
  anniEsperienza:             true,
  dataColloquio:              true,
  cellulare:                  true,
  owner:                      true,
  aderenza:                   true,
  coerenza:                   true,
  motivazione:                true,
  standing:                   true,
  energia:                    true,
  comunicazione:              true,
  inglese:                    true,
  competenze:                 true,
  valutazione:                true,
  descrizioneCandidatoUna:    true,
  teamSiNo:                   true,
  note:                       true,
  disponibilita:              true,
  attuale:                    true,
  desiderata:                 true,
  proposta:                   true,
  preavviso:                  true,
  dataAggiornamento:          true,
  idNextOwner:                true,
  idTipo:                     true,

};


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name" style={{ margin: '20px',fontSize: "15px" }}>
          <h1>{`Gestisci Incontro `}</h1>
          </div>
          <MyBoxGroups fields={fields} initialValues={initialValues} disableFields={disableFields} title="" showSaveButton={false} />
        </div>
      </div>
    </div>
  );
};

export default DettaglioIntervista;
