import React, { useState, useEffect } from "react";
import { useNavigate, useLocation }   from "react-router-dom";
import axios                          from "axios";
import Sidebar                        from "../../components/Sidebar";
import FieldsBox                      from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";

const AggiungiFornitore = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


const campiObbligatori = [ "denominazione", "referente", "email"];

  const fields = [
    { label: "Ragione Sociale*",      name: "denominazione",  type: "text" },
    { label: "Referente*",            name: "referente",      type: "text" },
    { label: "Email*",                name: "email",          type: "text"},
    { label: "PI",                    name: "pi",             type: "text" },
    { label: "Codice",                name: "codice",         type: "text"},
    { label: "Città",                 name: "citta",          type: "text" },
    { label: "Cellulare",             name: "cellulare",      type: "text" },
  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
    try {

      const response = await axios.post("http://89.46.67.198:8443/fornitori/react/salva",  values, { headers: headers });

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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>

          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi un nuovo Fornitore</Typography>

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

export default AggiungiFornitore;
