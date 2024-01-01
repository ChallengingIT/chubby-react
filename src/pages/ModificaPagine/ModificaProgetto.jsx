import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";

const ModificaProgetto = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { progettiData = {} } = location.state || {};

  console.log("DATI ARRIVATI DA PROGETTI: ", progettiData);

  const [clienteOptions,    setClienteOptions]    = useState([]);
  const [dipendenteOptions, setDipendenteOptions] = useState([]);

  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseCliente    = await axios.get("http://localhost:8080/aziende/react");
        const responseDipendente = await axios.get("http://localhost:8080/hr/react");

        if (Array.isArray(responseCliente.data)) {
          const clienteOptions = responseCliente.data.map((cliente) => ({
            label: cliente.denominazione,
            value: cliente.id,
          }));
          setClienteOptions(clienteOptions);

          if (Array.isArray(responseDipendente.data)) {
            const dipendenteOptions = responseDipendente.data.map((dipendente) => ({
              label: dipendente.denominazione,
              value: dipendente.id,
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

  const fields = [
    { label: "Descrizione",             name: "descrizione",            type: "text" },
    { label: "Cliente",                 name: "idCliente",              type: "select", options: clienteOptions },
    { label: "Dipendente",              name: "idStaff",                type: "select", options: dipendenteOptions },
    { label: "Data Inizio",             name: "inizio",                 type: "date" },
    { label: "Scadenza",                name: "scadenza",               type: "date" },
    { label: "Durata Stimata",          name: "durataStimata",          type: "text" },
    { label: "Rate",                    name: "rate",                   type: "text" },
    { label: "Costo",                   name: "costo",                  type: "text" },
    { label: "Margine",                 name: "margine",                type: "text" },
    { label: "Durata",                  name: "durata",                 type: "text" },
    { label: "Valore Totale",           name: "valoreTotale",           type: "text" },
    { label: "Note",                    name: "note",                   type: "note" },
  ];
  const initialValues = {
    descrizione:      progettiData.description      || "",
    idCliente:        progettiData.cliente && progettiData.cliente.id || "",
    dipendente:       progettiData.dipendente       || "",
    dataInizio:       progettiData.inizio           || "",
    scadenza:         progettiData.scadenza         || "",
    durataStimata:    progettiData.durataStimata    || "",
    rate:             progettiData.rate             || "",
    costo:            progettiData.costo            || "",
    margine:          progettiData.margine          || "",
    durata:           progettiData.durata           || "",
    valoreTotale:     progettiData.valoreTotale     || "",
    note:             progettiData.note             || "",
  };

  console.log("VALORE TOTALE: ", progettiData.valoreTotale);


  const handleSubmit = async (values) => {
    try {
      console.log("DATI DI VALUES: ", values);

      const response = await axios.post("http://localhost:8080/progetti/react/salva", values);
      console.log("Response from server:", response.data);

      navigate("/progetti");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Modifica Progetto</div>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaProgetto;
