import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";

const AggiungiFatturazioneAttiva = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fatturazioneAttivaData = {} } = location.state || {};

  const [ clienteOptions, setClienteOptions] = useState([]);
  const [ statoOptions,   setStatoOptions  ] = useState([]);

  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseCliente   = await axios.get("http://localhost:8080/aziende/react");
        const responseStato     = await axios.get("http://localhost:8080/fatturazione/attiva/react/stato");


        if (Array.isArray(responseStato.data)) {
          const statoOptions = responseStato.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);

        if (Array.isArray(responseCliente.data)) {
          const clienteOptions = responseCliente.data.map((cliente) => ({
            label: cliente.denominazione,
            value: cliente.id,
          }));
          setClienteOptions(clienteOptions);
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
 
    { label: "Cliente",               name: "idCliente",            type: "select", options: clienteOptions },
    { label: "Stato",                 name: "stato",                type: "select", options: statoOptions},
    { label: "Data Emissione",        name: "dataEmissione",        type: "date" },
    { label: "Data Scadenza",         name: "dataScadenza",         type: "date" },
    { label: "Termine",               name: "termine",              type: "text" },
    { label: "Tariffa",               name: "tariffa",              type: "text" },
    { label: "Giorni Lavorati",       name: "giorniLavorati",       type: "text" },
    { label: "Imponibile",            name: "imponibile",           type: "text" },
    { label: "Totale con Iva",        name: "totaleConIva",         type: "text" },
    { label: "N.Fattura",             name: "nFattura",             type: "text" },
    { label: "Consulente",            name: "consulente",           type: "text" },
    { label: "Oggetto",               name: "oggetto",              type: "text" },
    { label: "Descrizione",           name: "descrizione",          type: "text" },
    { label: "Oda",                   name: "oda",                  type: "text" },
    { label: "Note",                  name: "note",                 type: "note" },
  ];

  const initialValues = {
    id:                               fatturazioneAttivaData.id,
    idCliente:                        fatturazioneAttivaData.cliente && fatturazioneAttivaData.cliente.id || "",
    stato:                            fatturazioneAttivaData.stato && fatturazioneAttivaData.stato.id     || "",
    dataEmissione:                    fatturazioneAttivaData.dataEmissione                                || "",
    dataScadenza:                     fatturazioneAttivaData.dataScadenza                                 || "",
    termine:                          fatturazioneAttivaData.termine                                      || "",
    tariffa:                          fatturazioneAttivaData.tariffa                                      || "",
    giorniLavorati:                   fatturazioneAttivaData.giorniLavorati                               || "",
    imponibile:                       fatturazioneAttivaData.imponibile                                   || "",
    totaleConIva:                     fatturazioneAttivaData.totaleConIva                                 || "",
    nFattura:                         fatturazioneAttivaData.nfattura                                     || "",
    consulente:                       fatturazioneAttivaData.consulente                                   || "",
    oggetto:                          fatturazioneAttivaData.oggetto                                      || "",
    descrizione:                      fatturazioneAttivaData.descrizione                                  || "",
    oda:                              fatturazioneAttivaData.oda                                          || "",
    note:                             fatturazioneAttivaData.note                                         || "",
  }

  console.log("DATI IN INITIALVALUES: ", initialValues);

  const handleSubmit = async (initialValues) => {
    const errors = validateFields(initialValues);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      console.log("DATI DI VALUES: ", initialValues);

      const response = await axios.post("http://localhost:8080/fatturazione/attiva/react/salva", initialValues);
      console.log("Response from server:", response.data);

      navigate("/fatturazioneAttiva");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  } else {
    // Gestisci qui gli errori di validazione...
    console.log("Errore di validazione:", errors);
    // Potresti voler impostare lo stato degli errori o visualizzare un messaggio all'utente
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Aggiungi un nuova fattura</div>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiFatturazioneAttiva;
