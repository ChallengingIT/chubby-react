import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import MyBoxGroups from "../../components/MyBoxGroups";
import { setRecruiting, setOriginalRecruiting, setFilteredRecruiting } from '../../store/slices/recruitingSlice';
import { setInterviste, setOriginalInterviste, setFilteredInterviste, addNewIntervista } from '../../store/slices/intervisteSlice';

const AggiungiIncontro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [specificRecruitingData, setSpecificRecruitingData] = useState(null);
  const { id } = useParams();

  const { recruiting, originalRecruiting, filteredRecruiting } = useSelector(state => state.recruiting);
  const { interviste, originalInterviste, filteredInterviste } = useSelector(state => state.interviste);

  console.log("Recruiting dallo store:", recruiting);
console.log("Interviste dallo store:", interviste);

useEffect(() => {
  if (originalRecruiting && originalRecruiting.length > 0) {
    const numericId = parseInt(id, 10);
    const foundRecruitingData = originalRecruiting.find((c) => c.id === numericId);
    setSpecificRecruitingData(foundRecruitingData);
  }
}, [recruiting, id]);


console.log("ID presunto: ", id);
console.log("DATI DELL'ID: ", specificRecruitingData);

  

  // console.log("DATI ARRIVATI IN PAGINA: ", intervisteData);

  const handleCancel = () => {

    // console.log("Operazione annullata");
  };


  const [ tipologiaOptions, setTipologiaOptions ] = useState([]); //jobtile
  const [ ownerOptions, setOwnerOptions ] = useState([]);
  const [ statoOptions, setStatoOptions ] = useState([]); //tipologiaIncontro
  const [ tipoIntervistaOptions, setTipoIntervistaOptions ] = useState([]); //follow up
  
  const intervisteData = location.state?.intervisteData;






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
    { label: "Data Incontro",             name: "dataIncontro",           type: "date"},
    { label: "Recapiti",                  name: "cellulare",              type: "text"},
    { label: "Intervistatore",            name: "owner",                  type: "select", options: ownerOptions },




    { type: "titleGroups",                label: "Soft Skills"                         },
    { label: "Aderenza Posizione",        name: "aderenzaPosizione",       type: "text"},
    { label: "Coerenza Percorso",         name: "coerenzaPercorso",        type: "text"},
    { label: "Motivazione Posizione",     name: "motivazionePosizione",    type: "text"},
    { label: "Standing",                  name: "standing",                type: "text"},
    { label: "Energia",                   name: "energia",                 type: "text"},
    { label: "Comunicazione",             name: "comunicazione",           type: "text"},
    { label: "Livello di Inglese",        name: "livelloInglese",          type: "text"},



    { type: "titleGroups",                label: "Hard Skills"                         },
    { label: "Competenze vs ruolo",       name: "competenzeRuolo",         type: "text"},
    { label: "Valutazione",               name: "valutazione",             type: "text"},



    { type: "titleGroups",                label: "Ultime Osservazioni"                  },
    { label: "One word",                  name: "oneWord",                  type: "text"},
    { label: "Lo vorresti nel tuo team?", name: "loVorrestiNelTuoTeam",     type: "text"},
    { label: "Descrizione Candidato",     name: "descrizione",              type: "note"},
    


    { type: "titleGroups",                label: "Next Steps"},
    { label: "Disponibilità",             name: "disponibilita",            type: "text"},
    { label: "RAL Attuale",               name: "ralAttuale",               type: "text"},
    { label: "RAL Desiderata",            name: "ralDesiderata",            type: "text"},
    { label: "Proposta economica",        name: "propostaEconomica",        type: "text"},
    { label: "Follow Up",                 name: "followUp",                 type: "select", options: tipoIntervistaOptions },
    { label: "Preavviso",                 name: "preavviso",                type: "text"},
    { label: "Next Deadline",             name: "nextDeadline",             type: "date"},
    { label: "Owner next Deadline",       name: "ownerNextDeadline",        type: "select", options: ownerOptions },

  ];

 

const initialValues = {
    stato:                            specificRecruitingData.stato?.id                                                  || "",
    nome:                             specificRecruitingData.nome                                                       || "",
    cognome:                          specificRecruitingData.cognome                                                    || "",
    dataNascita:                      specificRecruitingData.dataNascita                                                || "",
    location:                         specificRecruitingData.citta                                                      || "", 
    tipologia:                        specificRecruitingData.tipologia?.id                                              || "",
    anniEsperienza:                   specificRecruitingData.anniEsperienza                                             || "",
    dataIncontro:                     specificRecruitingData?.dataColloquio                                             || "",
    recapiti:                         specificRecruitingData?.recapiti                                                  || "",
    owner:                            specificRecruitingData?.owner?.id                                                 || "",
    aderenzaPosizione:                specificRecruitingData?.aderenza                                                  || "",
    coerenzaPercorso:                 specificRecruitingData?.coerenza                                                  || "",
    motivazionePosizione:             specificRecruitingData?.motivazione                                               || "",
    standing:                         specificRecruitingData?.standing                                                  || "",
    energia:                          specificRecruitingData?.energia                                                   || "",
    comunicazione:                    specificRecruitingData?.comunicazione                                             || "",
    livelloInglese:                   specificRecruitingData?.inglese                                                   || "",
    competenzeRuolo:                  specificRecruitingData?.competenze                                                || "",
    valutazione:                      specificRecruitingData?.valutazione                                               || "",
    oneWord:                          specificRecruitingData?.descrizioneCandidatoUna                                   || "",
    loVorrestiNelTuoTeam:             specificRecruitingData?.teamSiNo                                                  || "",
    descrizione:                      specificRecruitingData.note                                                       || "",
    disponibilita:                    specificRecruitingData?.disponibilita                                             || "",
    ralAttuale:                       specificRecruitingData?.attuale                                                   || "",
    ralDesiderata:                    specificRecruitingData?.desiderata                                                || "",
    propostaEconomica:                specificRecruitingData?.proposta                                                  || "",
    followUp:                         specificRecruitingData?.tipo?.id                                                  || "",
    preavviso:                        specificRecruitingData?.preavviso                                                 || "",
    nextDeadline:                     specificRecruitingData?.nextDeadline                                              || "",
    ownerNextDeadline:                specificRecruitingData?.nextOwner?.id                                             || ""
};


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
    nome: true,
    cognome: true,
    dataNascita: true,
    tipologia: true,
    anniEsperienza: true,
    cellulare: true,



  };

  const handleSubmit = async (values) => {
    try {
      // console.log("DATI DI VALUES: ", values);
  

      const idCandidato = specificRecruitingData.id;
      const note = values.descrizione;
      const modifica = 0; 
  console.log("IDCANDIDATO: ", idCandidato);
      const url = `http://localhost:8080/intervista/react/salva?idCandidato=${idCandidato}&note=${encodeURIComponent(note)}&modifica=${modifica}`;
      
      const response = await axios.post(url, values);
      console.log("DATI INVIATI: ", response);
      console.log("Response from server:", response.data);
      dispatch(addNewIntervista(response.data));
  

      navigate(`/staffing/intervista/${idCandidato}`);
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
          <MyBoxGroups fields={fields} initialValues={initialValues} disableFields={disableFields} onSave={handleSubmit} onCancel={handleCancel} title="" />
        </div>
      </div>
    </div>
  );
};


export default AggiungiIncontro;
