import React, { useState, useEffect }     from "react";
import { useNavigate, useLocation }       from "react-router-dom";
import axios                              from "axios";
import Sidebar                            from "../../components/Sidebar";
import FieldsBox                          from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";

const AggiungiFatturazioneAttiva = () => {
  const navigate = useNavigate();

  const [ clientiOptions,     setClientiOptions  ] = useState([]);
  const [ fornitoriOptions,   setFornitoriOptions] = useState([]);
  const [ statoOptions,       setStatoOptions    ] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseClienti   = await axios.get("http://89.46.196.60:8443/aziende/react/select"            , { headers: headers });
        const responseFornitori = await axios.get("http://89.46.196.60:8443/fornitori/react"                 , { headers: headers });
        const responseStato     = await axios.get("http://89.46.196.60:8443/fatturazione/passiva/react/stato", { headers: headers });


        if (Array.isArray(responseStato.data)) {
          const statoOptions = responseStato.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);

          if (Array.isArray(responseFornitori.data)) {
            const fornitoriOptions = responseFornitori.data.map((fornitori) => ({
              label: fornitori.denominazione,
              value: fornitori.id,
            }));
            setFornitoriOptions(fornitoriOptions);


            if (Array.isArray(responseClienti.data)) {
              const clientiOptions = responseClienti.data.map((clienti) => ({
                label: clienti.denominazione,
                value: clienti.id,
              }));
              setClientiOptions(clientiOptions);
            }
          }
        }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);

  const campiObbligatori = ["idFornitore", "stato", "dataFattura", "scadenza", "importo"];

  const fields = [
 
    { label: "Fornitore*",              name: "idFornitore",    type: "select", options: fornitoriOptions },
    { label: "Stato*",                  name: "stato",          type: "select", options: statoOptions },
    { label: "Data Fattura*",           name: "dataFattura",    type: "date" },
    { label: "Data Scadenza*",          name: "scadenza",       type: "date" },
    { label: "Tipologia",               name: "tipologia",      type: "text" },
    { label: "Descrizione",             name: "descrizione",    type: "text" },
    { label: "Importo*",                name: "importo",        type: "text" },
    { label: "Imponibile",              name: "imponibile",     type: "text" },
    { label: "Iva",                     name: "iva",            type: "text" },
    { label: "Riferimenti",             name: "riferimenti",    type: "text" },
    { label: "Note",                    name: "note",           type: "note" },
  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

      const response = await axios.post("http://89.46.196.60:8443/fatturazione/passiva/react/salva", values, { headers: headers });;

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
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi una nuova fattura passiva</Typography>

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