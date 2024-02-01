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

      const response = await axios.post("https://89.46.67.198:8443/fornitori/react/salva",  values, { headers: headers });

      navigate("/fornitori");
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
