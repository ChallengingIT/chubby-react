import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";

const ModificaProgetto = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { progettiData = {} } = location.state || {};


  const [clienteOptions,    setClienteOptions]    = useState([]);
  const [dipendenteOptions, setDipendenteOptions] = useState([]);

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };

  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseCliente    = await axios.get("http://localhost:8080/aziende/react", { headers: headers });
        const responseDipendente = await axios.get("http://localhost:8080/hr/react/modificato", { headers: headers });

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
    id:               progettiData.id               ,
    descrizione:      progettiData.description      || "",
    idCliente:        progettiData.cliente && progettiData.cliente.id || "",
    idStaff:          progettiData.idStaff          || "",
    inizio:           progettiData.inizio           || "",
    scadenza:         progettiData.scadenza         || "",
    durataStimata:    progettiData.durataStimata    || "",
    rate:             progettiData.rate             || "",
    costo:            progettiData.costo            || "",
    margine:          progettiData.margine          || "",
    durata:           progettiData.durata           || "",
    valoreTotale:     progettiData.valoreTotale     || "",
    note:             progettiData.note             || "",
  };



  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

      const response = await axios.post("http://localhost:8080/progetti/react/salva", values, {
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
          campiObbligatori={campiObbligatori}

          />
        </div>
      </div>
    </div>
  );
};

export default ModificaProgetto;
