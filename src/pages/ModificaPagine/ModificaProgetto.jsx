import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";
import { Box,Typography } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const ModificaProgetto = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { progettiData = {} } = location.state || {};


  const [clienteOptions,    setClienteOptions]    = useState([]);
  const [dipendenteOptions, setDipendenteOptions] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseCliente    = await axios.get("http://89.46.67.198:8443/aziende/react/select",{ headers: headers });
        const responseDipendente = await axios.get("http://89.46.67.198:8443/hr/react/modificato", { headers: headers });

        if (Array.isArray(responseCliente.data)) {
          const clienteOptions = responseCliente.data.map((cliente) => ({
            label: cliente.denominazione,
            value: cliente.id,
          }));
          setClienteOptions(clienteOptions);

          if (Array.isArray(responseDipendente.data)) {
            const dipendenteOptions = responseDipendente.data.map((dipendenti) => ({
              label: `${dipendenti.nome} ${dipendenti.cognome}`,
              value: dipendenti.id,
            }));
            setDipendenteOptions(dipendenteOptions);
          }
        }

      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);

  const campiObbligatori = ["descrizione", "idCliente", "idStaff", "inizio", "scadenza"];


  const fields = [
    { label: "Descrizione*",            name: "descrizione",            type: "text" },
    { label: "Cliente*",                name: "idCliente",              type: "select", options: clienteOptions },
    { label: "Dipendente*",             name: "idStaff",                type: "select", options: dipendenteOptions },
    { label: "Data Inizio*",            name: "inizio",                 type: "date" },
    { label: "Scadenza*",               name: "scadenza",               type: "date" },
    { label: "Durata Stimata",          name: "durataStimata",          type: "text" },
    { label: "Rate",                    name: "rate",                   type: "text" },
    { label: "Costo",                   name: "costo",                  type: "text" },
    { label: "Margine",                 name: "margine",                type: "text" },
    { label: "Durata",                  name: "durata",                 type: "text" },
    { label: "Valore Totale",           name: "valoreTotale",           type: "text" },
    { label: "Note",                    name: "note",                   type: "note" },
  ];
  const initialValues = {
    id:               progettiData.id               ,
    descrizione:      progettiData.description                        || null,
    idCliente:        progettiData.cliente && progettiData.cliente.id || null,
    idStaff:          progettiData.idStaff                            || null,
    inizio:           progettiData.inizio                             || null,
    scadenza:         progettiData.scadenza                           || null,
    durataStimata:    progettiData.durataStimata                      || null,
    rate:             progettiData.rate                               || null,
    costo:            progettiData.costo                              || null,
    margine:          progettiData.margine                            || null,
    durata:           progettiData.durata                             || null,
    valoreTotale:     progettiData.valoreTotale                       || null,
    note:             progettiData.note                               || null,
  };



  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      const response = await axios.post("http://89.46.67.198:8443/progetti/react/salva", values, {
        headers: headers 
      });
      navigate("/progetti");
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
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Modifica Progetto</Typography>

          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          title="" 
          campiObbligatori={campiObbligatori}
          />
                    </Box>
          </Box>

  );
};

export default ModificaProgetto;
