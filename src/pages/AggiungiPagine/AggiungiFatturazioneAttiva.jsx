import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldsBox                      from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const AggiungiFatturazioneAttiva = () => {
  const navigate = useNavigate();
  const [ clientiOptions, setClientiOptions] = useState([]);
  const [ statoOptions,   setStatoOptions  ] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseClienti   = await axios.get("http://89.46.67.198:8443/aziende/react/select"            , { headers: headers });
        const responseStato     = await axios.get("http://89.46.67.198:8443/fatturazione/passiva/react/stato", { headers: headers });


        if (Array.isArray(responseStato.data)) {
          const statoOptions = responseStato.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);

        if (Array.isArray(responseClienti.data)) {
          const clientiOptions = responseClienti.data.map((clienti) => ({
            label: clienti.denominazione,
            value: clienti.id,
          }));
          setClientiOptions(clientiOptions);
                }
              }
            
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);

  const campiObbligatori = [ "idCliente", "stato", "dataEmissione", "dataScadenza", "tariffa"];

  const fields = [
 
    { label: "Cliente*",                name: "idCliente",            type: "select", options: clientiOptions },
    { label: "Stato*",                  name: "stato",                type: "select", options: statoOptions},
    { label: "Data Emissione*",         name: "dataEmissione",        type: "date" },
    { label: "Data Scadenza*",          name: "dataScadenza",         type: "date" },
    { label: "Termine",                 name: "termine",              type: "text" },
    { label: "Tariffa*",                name: "tariffa",              type: "text" },
    { label: "Giorni Lavorati",         name: "giorniLavorati",       type: "text" },
    { label: "Imponibile",              name: "imponibile",           type: "text" },
    { label: "Totale con Iva",          name: "totaleConIva",         type: "text" },
    { label: "N.Fattura",               name: "nFattura",             type: "text" },
    { label: "Consulente",              name: "consulente",           type: "text" },
    { label: "Oggetto",                 name: "oggetto",              type: "text" },
    { label: "Descrizione",             name: "descrizione",          type: "text" },
    { label: "Oda",                     name: "oda",                  type: "text" },
    { label: "Note",                    name: "note",                 type: "note" },
  ];

  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

      const response = await axios.post("http://89.46.67.198:8443/fatturazione/attiva/react/salva", values, { headers: headers });

      navigate("/fatturazioneAttiva");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }

  }
  };

  const validateFields = (values) => {
    let errors = {};
    campiObbligatori.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Questo campo è obbligatorio';
      }
    });
    return errors;
  };



  return (
    <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar2 />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi una nuova fattura</Typography>

          <FieldsBox 
          fields={fields} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title="" 
          />
          </Box>
      </Box>
  );
};

export default AggiungiFatturazioneAttiva;
