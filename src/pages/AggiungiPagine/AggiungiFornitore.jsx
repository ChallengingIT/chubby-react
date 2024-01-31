import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldsBox                      from "../../components/FieldsBox";

const AggiungiFornitore = () => {
  const navigate = useNavigate();

  // Recupera l'accessToken da localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


const campiObbligatori = [ "denominazione", "referente", "email"];

  const fields = [
    { label: "* Ragione Sociale",     name: "denominazione",  type: "text" },
    { label: "* Referente",           name: "referente",      type: "text" },
    { label: "* Email",               name: "email",          type: "text"},
    { label: "PI",                  name: "pi",             type: "text" },
    { label: "Codice",              name: "codice",         type: "text"},
    { label: "Città",               name: "citta",          type: "text" },
    { label: "Cellulare",           name: "cellulare",      type: "text" },




  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      console.log("DATI DI VALUES: ", values);

      const response = await axios.post("http://localhost:8080/fornitori/react/salva",  values, { headers: headers });
      console.log("Response from server:", response.data);

      navigate("/fornitori");
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
          <div className="page-name">Aggiungi un nuovo Fornitore</div>
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

export default AggiungiFornitore;
