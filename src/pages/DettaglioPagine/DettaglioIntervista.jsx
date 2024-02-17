import React, { useState, useEffect }               from "react";
import { useNavigate, useLocation, useParams }      from "react-router-dom";
import axios                                        from "axios";
import Sidebar                                      from "../../components/Sidebar";
import MyBoxGroups                                  from "../../components/MyBoxGroups";
import { Button, Box, Typography }                                   from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const DettaglioIntervista = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rowData  = location.state;
  const params   = useParams();

  const handleGoBack = () => {
    navigate(-1); 
  };

const fields = [

  { label: "Tipologia Incontro",        name: "stato",                  type: "text"},
  { label: "Nome",                      name: "nome",                   type: "text"},
  { label: "Cognome",                   name: "cognome",                type: "text"},
  { label: "Data di Nasciata",          name: "dataNascita",            type: "text"},
  { label: "Location",                  name: "location",               type: "text"},
  { label: "Job Title",                 name: "tipologia",              type: "text"},
  { label: "Anni di Esperienza",        name: "anniEsperienza",         type: "text"},
  { label: "Data Incontro",             name: "dataColloquio",          type: "text"},
  { label: "Recapiti",                  name: "cellulare",              type: "text"},
  { label: "Intervistatore",            name: "owner",                  type: "text"},




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
  { label: "Follow Up",                 name: "idTipo",                  type: "text"},
  { label: "Preavviso",                 name: "preavviso",               type: "text"},
  { label: "Next Deadline",             name: "dataAggiornamento",       type: "text"},
  { label: "Owner next Deadline",       name: "idNextOwner",             type: "text"},

];




const initialValues = {
  stato:                            rowData.stato?.id                         || "",
  nome:                             rowData.candidato?.nome                   || "",
  cognome:                          rowData.candidato?.cognome                || "",
  dataNascita:                      rowData.candidato?.dataNascita            || "",
  location:                         rowData.candidato?.citta                  || "", 
  tipologia:                        rowData.candidato?.tipologia?.descrizione || "",
  anniEsperienza:                   rowData.candidato?.anniEsperienza         || "",
  dataColloquio:                    rowData.dataColloquio                     || "",
  cellulare:                        rowData.candidato?.cellulare              || "",
  owner:                            rowData.owner?.descrizione                || "",
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
  idTipo:                           rowData.tipo?.descrizione                 || "",
  preavviso:                        rowData.preavviso                         || "",
  dataAggiornamento:                rowData.dataAggiornamento                 || "", 
  idNextOwner:                      rowData.candidato?.owner?.descrizione     || ""
};




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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar2 />
        <div className="container">
          <div className="page-name" style={{ margin: '20px',fontSize: "15px" }}>
          <h1>{`Gestisci Incontro `}</h1>
          </div>
          <MyBoxGroups fields={fields} initialValues={initialValues} disableFields={disableFields} title="" showSaveButton={false} />
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
</Box> 
 );
};

export default DettaglioIntervista;
