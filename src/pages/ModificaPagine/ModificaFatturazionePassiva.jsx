import React, { useState, useEffect }           from "react";
import { useNavigate, useLocation }             from "react-router-dom";
import axios                                    from "axios";
import Sidebar                                  from "../../components/Sidebar";
import FieldsBox                                from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";

const ModificaFatturazionePassiva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fatturazionePassivaData = {} } = location.state || {};
  
  const [statoOptions, setStatoOptions] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };



  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseStato = await axios.get("http://89.46.196.60:8443/fatturazione/passiva/react/stato", { headers: headers});
        if (Array.isArray(responseStato.data)) {
          const statoOptions = responseStato.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };
    fetchAziendeOptions();
  }, []);

  const campiObbligatori = ["idFornitore", "stato", "dataFattura", "scadenza", "importo"];


  const fields = [
    { label: "Fornitore*",                name: "idFornitore",      type: "select", disabled:true},
    { label: "Stato*",                    name: "stato",            type: "select", options: statoOptions },
    { label: "Data Scadenza*",            name: "scadenza",         type: "date" },
    { label: "Data Fattura*",             name: "dataFattura",      type: "date" },
    { label: "Tipologia",                 name: "tipologia",        type: "text" },
    { label: "Descrizione",               name: "descrizione",      type: "text" },
    { label: "Importo*",                  name: "importo",          type: "text" },
    { label: "Imponibile",                name: "imponibile",       type: "text" },
    { label: "Iva",                       name: "iva",              type: "text" },
    { label: "Riferimenti",               name: "riferimenti",      type: "text" },
    { label: "Note",                      name: "note",             type: "note" },
  ];
  const initialValues = {
    // fornitore: fatturazionePassivaData.fornitore || "",
    id:                 fatturazionePassivaData.id,
    stato:              fatturazionePassivaData.stato && fatturazionePassivaData.stato.id || null,
    dataFattura:        fatturazionePassivaData.dataFattura    || null,
    scadenza:           fatturazionePassivaData.scadenza       || null,
    tipologia:          fatturazionePassivaData.tipologia      || null,
    descrizione:        fatturazionePassivaData.descrizione    || null,
    importo:            fatturazionePassivaData.importo        || null,
    imponibile:         fatturazionePassivaData.imponibile     || null,
    iva:                fatturazionePassivaData.iva            || null,
    riferimenti:        fatturazionePassivaData.riferimenti    || null,
    note:               fatturazionePassivaData.note           || null,
  };

const handleSubmit = async (initialValues) => {
  const errors = validateFields(initialValues);
  const hasErrors = Object.keys(errors).length > 0;
  if (!hasErrors) {
  try {
    const response = await axios.post("http://89.46.196.60:8443/fatturazione/passiva/react/salva", initialValues, {
      headers: headers
    });
    navigate("/fatturazione/passiva");
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Modifica Fatturazione Passiva</Typography>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          campiObbligatori={campiObbligatori} 
          onSubmit={handleSubmit} 
          title="" 
          />
                </Box>
          </Box>

  );
};

export default ModificaFatturazionePassiva;