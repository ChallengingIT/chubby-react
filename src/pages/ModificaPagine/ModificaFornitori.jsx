import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";

import FieldsBox                              from "../../components/FieldsBox";

const ModificaFornitori = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fornitoriData = {} } = location.state || {};

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };

  const campiObbligatori = [ "denominazione", "referente", "email"];
  const fields = [
    { label: "* Denominazione",           name: "denominazione", type: "text" },
    { label: "* Referente",               name: "referente",     type: "text" },
    { label: "* Email",                   name: "email",         type: "text" },
    { label: "Pi",                      name: "pi",            type: "text" },
    { label: "Codice",                  name: "codice",        type: "text" },
    { label: "Città",                   name: "citta",         type: "text" },
    { label: "Cellulare",               name: "cellulare",     type: "text" },
  ];

  const initialValues = {
    id:            fornitoriData.id            , 
    denominazione: fornitoriData.denominazione || "",
    referente:     fornitoriData.referente     || "",
    email:         fornitoriData.email         || "",
    pi:            fornitoriData.pi            || "",
    codice:        fornitoriData.codice        || "",
    citta:         fornitoriData.citta         || "",
    cellulare:     fornitoriData.cellulare     || "",

  };




  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {
      Object.keys(values).forEach(key => {
        if (!campiObbligatori.includes(key) && !values[key]) {
          values[key] = null;
        }
      });

      const response = await axios.post("http://89.46.67.198/fornitori/react/salva", values, {
        headers: headers
      });

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
          <div className="page-name" style={{ margin: "20px", fontSize: "15px"}}>
            <h1>{`Modifica Fornitori`}
            </h1>
          </div>
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

export default ModificaFornitori;
