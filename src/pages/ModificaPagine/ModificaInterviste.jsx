import React, { useState, useEffect }           from "react";
import { useNavigate, useLocation }             from "react-router-dom";
import axios                                    from "axios";
import { Button, Box, Typography, Alert, Snackbar }                               from "@mui/material";
import IntervistaBox from "../../components/IntervistaBox";


const ModificaIntervista = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const rowData  = location.state;

  const [ tipologiaOptions,         setTipologiaOptions      ] = useState([]); //jobtile
  const [ ownerOptions,             setOwnerOptions          ] = useState([]);
  const [ statoOptions,             setStatoOptions          ] = useState([]); //tipologiaIncontro
  const [ tipoIntervistaOptions,    setTipoIntervistaOptions ] = useState([]); //follow up
  const [ isDataLoaded,               setIsDataLoaded                 ] = useState(false);
  const [ alert,                      setAlert                        ] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

useEffect(() => {
  const fetchData = async () => {
    try {
      //jobtitle = tipologia, tipologiaIncontro = stato, owner = owner
      const responseTipologia                      = await axios.get("http://localhost:8080/aziende/react/tipologia",         { headers: headers});
      const ownerResponse                          = await axios.get("http://localhost:8080/aziende/react/owner",             { headers: headers});
      const responseStato                          = await axios.get("http://localhost:8080/staffing/react/stato/candidato",  { headers: headers});
      const responseTipoIntervista                 = await axios.get("http://localhost:8080/intervista/react/tipointervista", { headers: headers});

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

const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlert({ ...alert, open: false });
};

const campiObbligatori = [ "dataColloquio"];


const fields = [
  { type: "titleGroups",                label: "Informazioni candidato", xs: 12, sm: 12             },
  { label: "Tipologia Incontro",        name: "stato",                  type: "select", options: statoOptions, xs: 12, sm: 4 },
  { label: "Nome",                      name: "nome",                   type: "text", xs: 12, sm: 4},
  { label: "Cognome",                   name: "cognome",                type: "text", xs: 12, sm: 4},
  { label: "Data di Nasciata",          name: "dataNascita",            type: "date", xs: 12, sm: 4},
  { label: "Location",                  name: "location",               type: "text", xs: 12, sm: 4},
  { label: "Job Title",                 name: "tipologia",              type: "select", options: tipologiaOptions, xs: 12, sm: 4 },
  { label: "Anni di Esperienza",        name: "anniEsperienza",         type: "text", xs: 12, sm: 4},
  { label: "Data Incontro*",            name: "dataColloquio",          type: "date", xs: 12, sm: 4},
  { label: "Recapiti",                  name: "cellulare",              type: "text", xs: 12, sm: 4},
  { label: "Intervistatore",            name: "idOwner",                type: "select", options: ownerOptions, xs: 12, sm: 4 },




  { type: "titleGroups",                label: "Soft Skills", xs: 12, sm: 12                          },
  { label: "Aderenza Posizione",        name: "aderenza",                type: "text", xs: 12, sm: 4},
  { label: "Coerenza Percorso",         name: "coerenza",                type: "text", xs: 12, sm: 4},
  { label: "Motivazione Posizione",     name: "motivazione",             type: "text", xs: 12, sm: 4},
  { label: "Standing",                  name: "standing",                type: "text", xs: 12, sm: 4},
  { label: "Energia",                   name: "energia",                 type: "text", xs: 12, sm: 4},
  { label: "Comunicazione",             name: "comunicazione",           type: "text", xs: 12, sm: 4},
  { label: "Livello di Inglese",        name: "inglese",                 type: "text", xs: 12, sm: 4},



  { type: "titleGroups",                label: "Hard Skills", xs: 12, sm: 12                          },
  { label: "Competenze vs ruolo",       name: "competenze",              type: "text", xs: 12, sm: 6},
  { label: "Valutazione",               name: "valutazione",             type: "text", xs: 12, sm: 6},



  { type: "titleGroups",                label: "Ultime Osservazioni", xs: 12, sm: 12                 },
  { label: "One word",                  name: "descrizioneCandidatoUna", type: "text", xs: 12, sm: 6},
  { label: "Lo vorresti nel tuo team?", name: "teamSiNo",                type: "text", xs: 12, sm: 6},
  { label: "Descrizione Candidato",     name: "note",                    type: "note", xs: 12, sm: 12},
  


  { type: "titleGroups",                label: "Next Steps", xs: 12, sm: 12},
  { label: "Disponibilità",             name: "disponibilita",           type: "text", xs: 12, sm: 4},
  { label: "RAL Attuale",               name: "attuale",                 type: "text", xs: 12, sm: 4},
  { label: "RAL Desiderata",            name: "desiderata",              type: "text", xs: 12, sm: 4},
  { label: "Proposta economica",        name: "proposta",                type: "text", xs: 12, sm: 4},
  { label: "Follow Up",                 name: "tipo",                    type: "select", options: tipoIntervistaOptions, xs: 12, sm: 4 },
  { label: "Preavviso",                 name: "preavviso",               type: "text", xs: 12, sm: 4},
  { label: "Next Deadline",             name: "dataAggiornamento",       type: "dateOra", xs: 12, sm: 4},
  { label: "Owner next Deadline",       name: "idNextOwner",             type: "select", options: ownerOptions, xs: 12, sm: 4 },

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

  const disableFields = {
    nome:               true,
    cognome:            true,
    dataNascita:        true,
    tipologia:          true,
    anniEsperienza:     true,
    cellulare:          true,
  };

  const handleSubmit = async (values) => {
    try {
      const idCandidato = rowData.candidato?.id;
      const note        = values.note;
      const modifica    = 1; 
      const response = await axios.post("http://localhost:8080/intervista/react/salva", values, {
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
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
        <Box sx={{ flexGrow: 1, p: 3, marginLeft: '12.2em', marginTop: '0.5em', marginBottom: '0.8em', marginRight: '0.8em', backgroundColor: '#EEEDEE', borderRadius: '10px' }}>
        <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem', color: '#00853C'}}>Aggiungi Intervista</Typography>
            
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        {isDataLoaded ? (
        <IntervistaBox 
        fields={fields} 
        initialValues={initialValues}  
        disableFields={disableFields} 
        onSave={handleSubmit} 
        title="" 
        campiObbligatori={campiObbligatori}
        />
        ) : (
            <div>Caricamento in corso...</div>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                color="primary"
                onClick={handleGoBack}
                sx={{
                    backgroundColor: "black",
                    borderRadius: '40px',
                    color: "white",
                    width: '250px',
                    height: '30px', 
                    mt: 2,
                    "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                    },
                }}
                >
                Torna ad Interviste
                </Button>
        </Box>
        </Box>
</Box>
);
};

export default ModificaIntervista;