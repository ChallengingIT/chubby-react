import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import axios                            from "axios";
import Sidebar                          from "../../components/Sidebar";
import FieldsBox                        from "../../components/FieldsBox";

const AggiungiProgetto = () => {
  const navigate = useNavigate();

  const [ clientiOptions,     setClientiOptions   ] = useState([]);
  const [ dipendentiOptions,  setDipendentiOptions] = useState([]);
  
  
  
  

  const campiObbligatori = [ "descrizione", "idCliente", "idStaff", "inzio", "scadenza", ]

  const fields = [
    { label: "Descrizione",     name: "descrizione",              type: "text" },
    { label: "Cliente",         name: "idCliente",                type: "select", options: clientiOptions },
    { label: "Dipendente",      name: "idStaff",                  type: "select", options: dipendentiOptions },
    { label: "Data Inizio",     name: "inizio",                   type: "date" },
    { label: "Scadenza",        name: "scadenza",                 type: "date" },
    { label: "Durata Stimata",  name: "durataStimata",            type: "text" },
    { label: "Rate",            name: "rate",                     type: "text" },
    { label: "Costo",           name: "costo",                    type: "text" },
    { label: "Margine",         name: "margine",                  type: "text" },
    { label: "Durata",          name: "durata",                   type: "text" },
    { label: "Valore Totale",   name: "valoreTotale",             type: "text" },
    { label: "Note",            name: "note",                     type: "note" },



  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      console.log("DATI DI VALUES: ", values);

      const response = await axios.post("http://localhost:8080/progetti/react/salva", values);
      console.log("Response from server:", response.data);

      navigate("/progetti");
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
          <div className="page-name">Aggiungi un nuovo Progetto</div>
          <FieldsBox 
          fields={fields} 
          campiObbligatori={campiObbligatori}  
          onSubmit={handleSubmit} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiProgetto;
