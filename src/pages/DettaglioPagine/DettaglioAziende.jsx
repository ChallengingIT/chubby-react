import React, { useState, useEffect }     from "react";
import { useNavigate, useLocation }       from "react-router-dom";
import Sidebar                            from "../../components/Sidebar";
import { Button, Grid }                   from "@mui/material";
import { useParams }                      from "react-router-dom";
import FeedIcon                           from "@mui/icons-material/Feed";
import EmailIcon                          from "@mui/icons-material/Email";
import LocalPhoneIcon                     from "@mui/icons-material/LocalPhone";
import dayjs                              from 'dayjs';
import ReusablePopup                      from "../../components/ReusablePopup";
import axios                              from 'axios';
import AttivitaCard                       from "../../components/card/AttivitaCard";
import InformazioniAziendaCard            from "../../components/card/InformazioniAziendaCard";
import ComunicazioniCard                  from "../../components/card/ComunicazioniCard";
import NeedCard                           from "../../components/card/NeedCard";
import ContattiCard                       from "../../components/card/ContattiCard";
import "../../styles/DettaglioAziende.css";

const DettaglioAziende = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params   = useParams();


  const { aziendaData = {} }  = location.state || {};
  const { id }                = params;

  const idAzienda   = aziendaData.id;
  const nomeAzienda = aziendaData.denominazione;


  const handleGoBack = () => {
    window.history.back();
  };



  const [ isFeedPopupOpen,    setFeedPopupOpen      ] = useState(false);
  const [ isEmailPopupOpen,   setEmailPopupOpen     ] = useState(false);
  const [ isPhonePopupOpen,   setPhonePopupOpen     ] = useState(false);
  const [ ownerOptions,       setOwnerOptions       ] = useState([]);
  const [ contattoOptions,    setContattoOptions    ] = useState([]);
  const [ needOptions,        setNeedOptions        ] = useState([]);
  const [ attivitaOptions,    setAttivitaOptions    ] = useState([]);
  const [ statoNeedOptions,   setStatoNeedOptions   ] = useState([]);

  // console.log("DATI IN Contatto: ", contattoOptions);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const responseOwner           = await axios.get("http://localhost:8080/aziende/react/owner"             );
        const responseContatto        = await axios.get(`http://localhost:8080/aziende/react/keypeople/${id}`   );
        const responseNeed            = await axios.get(`http://localhost:8080/need/react/cliente/${id}`        );
        const responseAttivita        = await axios.get(`http://localhost:8080/aziende/react/attivita/${id}`    );
        const responseStatoNeed       = await axios.get(`http://localhost:8080/need/react/cliente/${id}`        );

        if (Array.isArray(responseStatoNeed.data)) {
          const statoNeedOptions = responseStatoNeed.data.map((statoNeed) => ({

           label:         statoNeed.descrizione,
           statoNeed:     statoNeed.stato && statoNeed.stato.descrizione,
           data:          statoNeed.data,
           ownerNome:     statoNeed.owner && statoNeed.owner.nome,
           ownerCognome:  statoNeed.owner && statoNeed.owner.cognome,

          }));

          setStatoNeedOptions(statoNeedOptions);
          // console.log("DATI RECUPERATI PER STATO VINTO: ", statoNeedOptions);
        }

        if (Array.isArray(responseAttivita.data)) {
          const attivitaOptions = responseAttivita.data.map((attivita) => ({

            note:     attivita.note,
            owner: `${attivita.owner.nome} ${attivita.owner.cognome}`,
            data:     attivita.data

          }));

          setAttivitaOptions(attivitaOptions);
          // console.log("DATI RECUPERATI PER ATTIVITA: ", attivitaOptions);
        }
  
        if (Array.isArray(responseNeed.data)) {
          const needOptions = responseNeed.data.map((need) => ({

            descrizione: need.descrizione,
            priorita:    need.priorita

          }));
          setNeedOptions(needOptions);
        }
  
        if (Array.isArray(responseContatto.data)) {
          const contattoOptions = responseContatto.data.map((contatto) => ({

            nome:       contatto.nome,
            ruolo:      contatto.ruolo,
            email:      contatto.email,
            cellulare:  contatto.cellulare,
            value:      contatto.id,
            label:      contatto.nome

          }));
          setContattoOptions(contattoOptions);
        }
  
        if (Array.isArray(responseOwner.data)) {
          const ownerOptions = responseOwner.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);
        }
      
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };
    fetchOptions();
  }, []);
  

  const countVintoStatus = (statoNeedOptions) => {
    return statoNeedOptions.filter(option => option.statoNeed === 'Vinto').length;
  };
  
  const totalVinto = countVintoStatus(statoNeedOptions);
  // console.log('Numero totale di stati "Vinto":', totalVinto);

  const totalStatus = statoNeedOptions.length;
// console.log('Numero totale di stati:', totalStatus);

const getUltimaAttivita = (attivitaOptions) => {
  let ultimaData = "";

  attivitaOptions.forEach(attivita => {
    // Assicurati che la data dell'attività esista e sia in un formato valido
    if (attivita.data && dayjs(attivita.data).isValid()) {
      if (ultimaData === "" || dayjs(attivita.data).isAfter(dayjs(ultimaData))) {
        ultimaData = attivita.data;
      }
    }
  });

  return ultimaData; // Questo sarà una stringa vuota se non ci sono date valide
};

// console.log("ATTIVITA OPTIONS: ", attivitaOptions);

  

const handleSave = (popupData, tipoAttivita) => {
  switch (tipoAttivita) {

    case 'feed':
      handleSaveFeedPopup(popupData);
      break;

    case 'email':
      handleSaveEmailPopup(popupData);
      break;

    case 'phone':
      handleSavePhonePopup(popupData);
      break;

    default:
      console.error('Tipo di attività non riconosciuto:', tipoAttivita);
  }
};



  const handleFeedIconClick = () => {
    setFeedPopupOpen(true);

    setEmailPopupOpen(false);
    setPhonePopupOpen(false);
  };

  const handleCloseFeedPopup = () => {
    setFeedPopupOpen(false);
  };

  const handleEmailIconClick = () => {
    setEmailPopupOpen(true);

    setFeedPopupOpen(false);
    setPhonePopupOpen(false);
  };

  const handleCloseEmailPopup = () => {
    setEmailPopupOpen(false);
  };

  const handlePhoneIconClick = () => {
    setPhonePopupOpen(true);

    setFeedPopupOpen(false);
    setEmailPopupOpen(false);
  };

  const handleClosePhonePopup = () => {
    setPhonePopupOpen(false);
  };

  const handleSaveFeedPopup = (popupData) => {
    const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
    const params = {
      idTipoAttivita: 1, 
      idAzienda,
      idOwner,
      idKeyPeople,
      data: new Date()
    };
    
    // console.log("Dati salvati (Feed):", { attivitaMap, params });
    // Logica per inviare i dati al server, esempio:
     axios.post('http://localhost:8080/aziende/react/attivita/salva', attivitaMap, { params });
  };
  
  
  const handleSaveEmailPopup = (popupData) => {
    const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
    const params = {
      idTipoAttivita: 2, 
      idAzienda,
      idOwner,
      idKeyPeople
    };
    
    console.log("Dati salvati (email):", { attivitaMap, params });
    // Logica per inviare i dati al server, esempio:
     axios.post('http://localhost:8080/aziende/react/attivita/salva', attivitaMap, { params });
  };
  
  const handleSavePhonePopup = (popupData) => {
    const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
    const params = {
      idTipoAttivita: 3, 
      idAzienda,
      idOwner,
      idKeyPeople
    };
    
    // console.log("Dati salvati (phone):", { attivitaMap, params });
    // Logica per inviare i dati al server, esempio:
     axios.post('http://localhost:8080/aziende/react/attivita/salva', attivitaMap, { params });
  };
  


  const fieldsInformazioniAzienda = [
    { label: "Nome",          name: "denominazione"         },
    { label: "Settore",       name: "settoreMercato"        },
    { label: "Email",         name: "email"                 },
    { label: "Pec",           name: "pec"                   },
    { label: "Owner",         name: "owner"                 },
    { label: "Tipologia",     name: "tipologia"             },
    { label: "PI",            name: "pi"                    },
    { label: "Paese",         name: "paese"                 },
    { label: "Citta",         name: "citta"                 },
  ];

  const initialValuesInformazioniAzienda = {
    denominazione:            aziendaData.denominazione                                       || "",
    settoreMercato:           aziendaData.settoreMercato                                      || "",
    email:                    aziendaData.email                                               || "",
    pec:                      aziendaData.pec                                                 || "",
    owner:                    aziendaData.owner && aziendaData.owner.descrizione              || "",
    tipologia:                aziendaData.tipologia                                           || "",
    pi:                       aziendaData.pi                                                  || "",
    paese:                    aziendaData.paese                                               || "",
    citta:                    aziendaData.citta                                               || "",
  };

  // console.log("DATI IN INITIAL VALUES:" , initialValuesInformazioniAzienda);

  const fieldsComunicazioni = [
    { label: "Need Aperti",     name: "needAperti"     },
    { label: "Need Vinti",      name: "needVinti"      },
    { label: "Ultime Attività", name: "ultimeAttivita" },
  ];

  const ultimaData = getUltimaAttivita(attivitaOptions);

  const initialValuesComunicazioni = {
    needAperti:                 totalStatus                       || "",
    needVinti:                  totalVinto                        || "",
    ultimeAttivita:             ultimaData                        || "", 
  };

  // console.log("DATI IN INITIAL VALUES 2: ", initialValuesComunicazioni);


  const tableNeed = [
    { label: "Priorità",        name: "priorita" },
    { label: "Nome",            name: "nome"     }
  ];

  const initialValuesNeed = needOptions.map(need => ({
    priorita:                   need.priorita     || "",
    nome:                       need.descrizione  || ""
  }));
  

  // console.log("DATI IN INITIAL VALUES need:" , initialValuesNeed);

  const tableAttivita = [
    { label: "Owner",                 name: "owner" },
    { label: "Data" ,                 name: "data"  },
    { label: "Note",                  name: "note"  },
  ];

  const intialValuesAttivita = attivitaOptions.map(attivita => ({
    owner:                            attivita.owner || "",
    data:                             attivita.data  || "",
    note:                             attivita.note  || ""
  }));


  const tableContatti = [
{ label: "Nome",                      name: "nome"      },
{ label: "Ruolo",                     name: "ruolo"     },
{ label: "Email",                     name: "email"     },
{ label: "Cellulare",                 name: "cellulare" },
  ];


  const initialValuesContatti = contattoOptions.map(contatto => ({
    nome:                            contatto.nome       || "",
    ruolo:                           contatto.ruolo      || "",
    email:                           contatto.email      || "",
    cellulare:                       contatto.cellulare  || ""
  }));

  const popupFields = [
    { label: 'Owner',                 name: 'idOwner',                type: "select",                 options: ownerOptions    },
    { label: 'Contatto',              name: 'idKeyPeople',            type: "select",                 options: contattoOptions },
    { label: 'Commento',              name: 'note',                   type: "note"                                             },
  ];
  

  return (
    <div className="containerDettaglioAziende">
      <div className="contentDettaglioAziende">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="flex-container" style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", 
  }}>
          <div className="containerTitle">
            <h1>{`Visualizzazione ${nomeAzienda}`}</h1>
          </div>
          <div className="containerTable">
            <div className="columnMenu">
              <Button
                variant="contained"
                startIcon={<FeedIcon />}
                onClick={handleFeedIconClick}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  margin: "10px",
                  borderRadius: "40px",
                  justifyContent: "flex-end",
                  "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                  },
                }}
              ></Button>
              <ReusablePopup
                  fields={popupFields}
                  open={isFeedPopupOpen}
                  onClose={handleCloseFeedPopup}
                  onSave={handleSave}
                  title="Inserimento nota Attività"
                  idTipoAttivita={1}
                  idAzienda={idAzienda}
                />

              {/* <ReusablePopup fields={popupFields} open={isFeedPopupOpen} onClose={handleCloseFeedPopup} onSave={handleSaveFeedPopup} title="Inserimento nota Attività"  idTipoAttivita={1} idAzienda={idAzienda}   /> */}
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                onClick={handleEmailIconClick}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  margin: "10px",
                  borderRadius: "40px",
                  justifyContent: "flex-end",
                  "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                  },
                }}
              ></Button>
              <ReusablePopup
                  fields={popupFields}
                  open={isEmailPopupOpen}
                  onClose={handleCloseEmailPopup}
                  onSave={handleSave}
                  title="Registrazione Email inviata"
                  idTipoAttivita={2}
                  idAzienda={idAzienda}
                />
              {/* <ReusablePopup fields={popupFields} open={isEmailPopupOpen} onClose={handleCloseEmailPopup} onSave={handleSaveEmailPopup} title="Registrazione email inviata" idTipoAttivita={2} idAzienda={idAzienda} /> */}
              <Button
                variant="contained"
                startIcon={<LocalPhoneIcon />}
                onClick={handlePhoneIconClick}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  margin: "10px",
                  borderRadius: "40px",
                  justifyContent: "flex-end",
                  "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                  },
                }}
              ></Button>
              <ReusablePopup
                  fields={popupFields}
                  open={isPhonePopupOpen}
                  onClose={handleClosePhonePopup}
                  onSave={handleSave}
                  title="Registrazione Chiamata effettuata"
                  idTipoAttivita={3}
                  idAzienda={idAzienda}
                />
              {/* <ReusablePopup fields={popupFields} open={isPhonePopupOpen} onClose={handleClosePhonePopup} onSave={handleSavePhonePopup} title="Registrazione chiamata effettuata" idTipoAttivita={3} idAzienda={idAzienda} /> */}
            </div>



            <Grid container spacing={2} sx={{ padding: "20px"}}>
            <Grid item xs={12} md={6}>
              <InformazioniAziendaCard
                fields={fieldsInformazioniAzienda}
                initialValues={initialValuesInformazioniAzienda}
                tableTitle="Informazioni Azienda"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <AttivitaCard
                columns={tableAttivita}
                initialValues={intialValuesAttivita}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <NeedCard
                columns={tableNeed}
                initialValues={initialValuesNeed}
                tableTitle="Need"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ComunicazioniCard
                fields={fieldsComunicazioni}
                initialValues={initialValuesComunicazioni}
                tableTitle="Comunicazioni"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ContattiCard
                fields={tableContatti}
                initialValues={initialValuesContatti}
                tableTitle="Contatti"
              />
            </Grid>

           

            
          </Grid>

          </div>

          <Button
            color="primary"
            onClick={handleGoBack}
            sx={{
              backgroundColor: "black",
              borderRadius: "40px",
              color: "white",
              width: "250px",
              height: "30px",
              margin: "auto",
              marginTop: "auto",
              marginBottom: "20px",
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Indietro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DettaglioAziende;
