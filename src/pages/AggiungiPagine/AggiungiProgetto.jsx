import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import axios                            from "axios";
import Sidebar                          from "../../components/Sidebar";
import FieldsBox                        from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";

const AggiungiProgetto = () => {
  const navigate = useNavigate();

  const [ clientiOptions,     setClientiOptions   ] = useState([]);
  const [ dipendentiOptions,  setDipendentiOptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  useEffect(() => {
    const fetchProgettiOptions = async () => {
      try {
        const responseDipendenti = await axios.get("http://89.46.196.60:8443/hr/react/modificato"     , { headers: headers});
        const responseClienti    = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });


        if (Array.isArray(responseDipendenti.data)) {
          const dipendentiOptions = responseDipendenti.data.map((dipendenti) => ({
            label: `${dipendenti.nome} ${dipendenti.cognome}`,
            value: dipendenti.id,
          }));
          setDipendentiOptions(dipendentiOptions);
        }

        if (Array.isArray(responseClienti.data)) {
          const clientiOptions = responseClienti.data.map((clienti) => ({
            label: clienti.denominazione,
            value: clienti.id,
          }));
          setClientiOptions(clientiOptions);
        }

        } catch (error) {
          console.error("Errore durante il recupero delle aziende:", error);
        }
      };
  
      fetchProgettiOptions();
    }, []);


  const campiObbligatori = [ "description", "idAzienda", "idStaff", "inizio", "scadenza" ];


  const fields = [
    { label: "Descrizione*",      name: "description",              type: "text" },
    { label: "Cliente*",          name: "idAzienda",                type: "select", options: clientiOptions },
    { label: "Dipendente*",       name: "idStaff",                  type: "select", options: dipendentiOptions },
    { label: "Data Inizio*",      name: "inizio",                   type: "date" },
    { label: "Scadenza*",         name: "scadenza",                 type: "date" },
    { label: "Durata Stimata",    name: "durataStimata",            type: "text" },
    { label: "Rate",              name: "rate",                     type: "text" },
    { label: "Costo",             name: "costo",                    type: "text" },
    { label: "Margine",           name: "margine",                  type: "text" },
    { label: "Durata",            name: "durata",                   type: "text" },
    { label: "Valore Totale",     name: "valoreTotale",             type: "text" },
    { label: "Note",              name: "note",                     type: "note" },
  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

      const response = await axios.post("http://89.46.196.60:8443/progetti/react/salva", values,
      { headers: headers });

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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi un nuovo progetto</Typography>

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

export default AggiungiProgetto;