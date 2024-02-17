
//funzionante al 21 dicembre 2023 9:00

import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import Sidebar                          from "../../components/Sidebar";
import axios                            from "axios";
import MyBoxGroups                      from "../../components/MyBoxGroups";
import { Box, Typography } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const AggiungiIncontro = () => {
  const navigate = useNavigate();
  const location = useLocation();

const candidatoData = location.state?.candidatoData;
const candidatoID   = location.state?.candidatoID; 


const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

const headers = {
  Authorization: `Bearer ${accessToken}`
};


useEffect(() => {

}, [candidatoID]); 


  const handleCancel = () => {

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
        const responseTipologia                      = await axios.get("http://89.46.67.198:8443/aziende/react/tipologia"          , { headers: headers });
        const ownerResponse                          = await axios.get("http://89.46.67.198:8443/aziende/react/owner"              , { headers: headers });
        const responseStato                          = await axios.get("http://89.46.67.198:8443/staffing/react/stato/candidato"   , { headers: headers });
        const responseTipoIntervista                 = await axios.get("http://89.46.67.198:8443/intervista/react/tipointervista"  , { headers: headers });
        const responseIntervista                     = await axios.get(`http://89.46.67.198:8443/intervista/react/mod/${candidatoID}`  , { headers: headers });

        if (Array.isArray(responseIntervista.data)) {
          const intervisteConId = responseIntervista.data.map((interviste) => ({ ...interviste }));
          setInterviste(intervisteConId);
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

    { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, },
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
  const ultimaIntervista = getUltimaIntervista();
  

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
  

      const idCandidato = candidatoID;
      const note = values.note;
      const modifica = 0; 
  
      const response = await axios.post("http://89.46.67.198:8443/intervista/react/salva", values, {
          params: {
            idCandidato: idCandidato,
            note: note,
            modifica: modifica
          },
          header: headers
        });

  

      navigate(`/staffing/intervista/${candidatoID}`);
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };
  

 

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar2 />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi un nuovo incontro</Typography>

          <MyBoxGroups 
          fields={fields} 
          initialValues={initialValues} 
          disableFields={disableFields} 
          onSave={handleSubmit} 
          onCancel={handleCancel} 
          title="" 
          />
           </Box>
      </Box>
  );
};


export default AggiungiIncontro;
