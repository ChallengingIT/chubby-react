  import React, { useState, useEffect }           from "react";
  import { useNavigate, useLocation }             from "react-router-dom";
  import axios                                    from "axios";
  import Sidebar                                  from "../../components/Sidebar";
  import MyBoxGroups                              from "../../components/MyBoxGroups";
  import { Button }                               from "@mui/material";


  const ModificaIntervista = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rowData  = location.state;




    const [ tipologiaOptions,         setTipologiaOptions      ] = useState([]); //jobtile
    const [ ownerOptions,             setOwnerOptions          ] = useState([]);
    const [ statoOptions,             setStatoOptions          ] = useState([]); //tipologiaIncontro
    const [ tipoIntervistaOptions,    setTipoIntervistaOptions ] = useState([]); //follow up

     // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };


  useEffect(() => {
    const fetchData = async () => {
      try {


        //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
        const responseTipologia                      = await axios.get("https://localhost:8443/aziende/react/tipologia", { headers: headers});
        const ownerResponse                          = await axios.get("https://localhost:8443/aziende/react/owner", { headers: headers});
        const responseStato                          = await axios.get("https://localhost:8443/staffing/react/stato/candidato", { headers: headers});
        const responseTipoIntervista                 = await axios.get("https://localhost:8443/intervista/react/tipointervista", { headers: headers});

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



  const handleGoBack = () => {
    navigate(-1); 
  };


  const fields = [

    { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, 

},
    { label: "Nome",                      name: "nome",                   type: "text"},
    { label: "Cognome",                   name: "cognome",                type: "text"},
    { label: "Data di Nasciata",          name: "dataNascita",            type: "date"},
    { label: "Location",                  name: "location",               type: "text"},
    { label: "Job Title",                 name: "tipologia",              type: "select", options: tipologiaOptions },
    { label: "Anni di Esperienza",        name: "anniEsperienzaRuolo",         type: "text"},
    { label: "Data Incontro",             name: "dataColloquio",          type: "date"},
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
      id:                               rowData.id                                  ,  
      stato:                            rowData.candidato.stato?.id                 || null,
      nome:                             rowData.candidato?.nome                     || null,
      cognome:                          rowData.candidato?.cognome                  || null,
      dataNascita:                      rowData.candidato?.dataNascita              || null,
      location:                         rowData.candidato?.citta                    || null, 
      tipologia:                        rowData.candidato?.tipologia?.id            || null,
      anniEsperienzaRuolo:              rowData.candidato?.anniEsperienzaRuolo      || null,
      dataColloquio:                    rowData.dataColloquio                       || null,
      cellulare:                        rowData.candidato?.cellulare                || null,
      idOwner:                          rowData.owner?.id                           || null,
      aderenza:                         rowData.aderenza                            || null,
      coerenza:                         rowData.coerenza                            || null,
      motivazione:                      rowData.motivazione                         || null,
      standing:                         rowData.standing                            || null,
      energia:                          rowData.energia                             || null,
      comunicazione:                    rowData.comunicazione                       || null,
      inglese:                          rowData.inglese                             || null,
      competenze:                       rowData.competenze                          || null,
      valutazione:                      rowData.valutazione                         || null,
      descrizioneCandidatoUna:          rowData.descrizioneCandidatoUna             || null,
      teamSiNo:                         rowData.teamSiNo                            || null,
      note:                             rowData.candidato?.note                     || null,
      disponibilita:                    rowData.disponibilita                       || null,
      attuale:                          rowData.attuale                             || null,
      desiderata:                       rowData.desiderata                          || null,
      proposta:                         rowData.proposta                            || null,
      tipo:                             rowData.tipo?.id                            || null,
      preavviso:                        rowData.preavviso                           || null,
      dataAggiornamento:                rowData.dataAggiornamento                   || null, 
      idNextOwner:                      rowData.nextOwner?.id                       || null
    };

  //   tipologiaIncontro:                    rowData.stato?.descrizione || "",
  //   nome:                                 rowData.nome                                         || "",
  //   cognome:                              rowData.cognome                                      || "",
  //   dataNascita:                          rowData.dataNascita                                  || "",
  //   location:                             rowData.location                                     || "",
  //   jobTitle:                             rowData.jobTitle                                     || "",
  //   anniEsperienza:                       rowData.intervista.anniEsperienza                    || "",
  //   dataIncontro:                         rowData.intervista.dataColloquio                     || "",
  //   recapiti:                             rowData.intervista.recapiti                          || "",
  //   intervistatore:                       rowData.owner.descrizione                            || "",
  //   aderenzaPosizione:                    rowData.intervista.aderenza                          || "",
  //   coerenzaPercorso:                     rowData.intervista.coerenza                          || "",
  //   motivazionePosizione:                 rowData.intervista.motivazione                       || "",
  //   standing:                             rowData.intervista.standing                          || "",
  //   energia:                              rowData.intervista.energia                           || "",
  //   comunicazione:                        rowData.intervista.comunicazione                     || "",
  //   livelloInglese:                       rowData.intervista.inglese                           || "",
  //   competenzeRuolo:                      rowData.intervista.competenze                        || "",
  //   valutazione:                          rowData.intervista.valutazione                       || "",
  //   oneWord:                              rowData.intervista.descrizioneCandidatoUna           || "",
  //   loVorrestiNelTuoTeam:                 rowData.intervista.teamSiNo                          || "",
  //   descrizione:                          rowData.note                                         || "",
  //   disponibilita:                        rowData.intervista.disponibilita                     || "",
  //   ralAttuale:                           rowData.intervista.attuale                           || "",
  //   ralDesiderata:                        rowData.intervista.desiderata                        || "",
  //   propostaEconomica:                    rowData.intervista.proposta                          || "",
  //   followUp:                             rowData.followUp                                     || "",
  //   preavviso:                            rowData.intervista.preavviso                         || "",
  //   nextDeadline:                         rowData.nextDeadline                                 || "",
  //   ownerNextDeadline:                    rowData.intervista.nextOwner                         || "",
  // };



const disableFields = {
  nome:               true,
  cognome:            true,
  dataNascita:        true,
  tipologia:          true,
  anniEsperienza:     true,
  cellulare:          true,
};


    // const initialValues = {
    //   tipologiaIncontro:                    rowData.stato && rowData.stato.descrizione || "",
    //   nome:                                 rowData.nome                     || "",
    //   cognome:                              rowData.cognome                  || "",
    //   dataNascita:                          rowData.dataNascita              || "",
    //   location:                             rowData.location                 || "",
    //   jobTitle:                             rowData.jobTitle                 || "",
    //   anniEsperienza:                       rowData.anniEsperienza           || "",
    //   dataIncontro:                         rowData.dataColloquio            || "",
    //   recapiti:                             rowData.recapiti                 || "",
    //   intervistatore:                       rowData.intervistatore           || "",
    //   aderenzaPosizione:                    rowData.aderenza                 || "",
    //   coerenzaPercorso:                     rowData.coerenza                 || "",
    //   motivazionePosizione:                 rowData.motivazione              || "",
    //   standing:                             rowData.standing                 || "",
    //   energia:                              rowData.energia                  || "",
    //   comunicazione:                        rowData.comunicazione            || "",
    //   livelloInglese:                       rowData.inglese                  || "",
    //   competenzeRuolo:                      rowData.competenze               || "",
    //   valutazione:                          rowData.valutazione              || "",
    //   oneWord:                              rowData.oneWord                  || "",
    //   loVorrestiNelTuoTeam:                 rowData.teamSiNo                 || "",
    //   descrizione:                          rowData.descrizione              || "",
    //   disponibilita:                        rowData.disponibilita            || "",
    //   ralAttuale:                           rowData.ralAttuale               || "",
    //   ralDesiderata:                        rowData.ralDesiderata            || "",
    //   propostaEconomica:                    rowData.propostaEconomica        || "",
    //   followUp:                             rowData.followUp                 || "",
    //   preavviso:                            rowData.preavviso                || "",
    //   nextDeadline:                         rowData.nextDeadline             || "",
    //   ownerNextDeadline:                    rowData.nextDeadline             || "",
    // };


    



    const handleSubmit = async (values) => {
      try {
    
  
        const idCandidato = rowData.candidato?.id;
        const note        = values.note;
        const modifica    = 1; 

   
        const response = await axios.post("https://localhost:8443/intervista/react/salva", values, {
          params: {
            idCandidato: idCandidato,
            note: note,
            modifica: modifica
          },
          headers: headers
        });

    
  
        navigate(`/staffing/intervista/${idCandidato}`);
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
            <h1>{`Modifica Incontro `}</h1>
            </div>
            <MyBoxGroups 
            fields={fields} 
            initialValues={initialValues} 
            disableFields={disableFields} 
            onSave={handleSubmit} 
            title="" 
            showSaveButton={false}

            />
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

  export default ModificaIntervista;
