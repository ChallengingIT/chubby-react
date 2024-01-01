//funzionante al 25 dicembre 2023 10:30

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

import ProvaComponente from "../../components/ProvaComponente.jsx";
import FieldsBox from "../../components/FieldsBox.jsx";

const AggiungiAziende = () => {
  const navigate = useNavigate();
  

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [salvaOptions, setSalvaOptions] = useState([]);

  const [campiObbligatori, setCampiObbligatori] = useState(["denominazione", "email", "owner", "status"]);
  const [ ownerOptions, setOwnerOptions ] = useState([]);

 


  const convertStatusStringToNumber = (statusString) => {
    switch (statusString) {
      case "Verde":
        return 1;
      case "Giallo":
        return 2;
      case "Rosso":
        return 3;
      default:
        return ;
    }
  };

  useEffect(() => {
    const fetchProvinceOptions = async () => {
      try {
        const provinceResponse = await axios.get("http://localhost:8080/aziende/react/province");
        const ownerResponse = await axios.get("http://localhost:8080/aziende/react/owner");
        if (Array.isArray(ownerResponse.data)) {
          const ownerOptions = ownerResponse.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);
        
          if (Array.isArray(provinceResponse.data)) {
            const provinceOptions = provinceResponse.data.map((province) => ({
              label: province.nomeProvince,
              value: province.nomeProvince,
            }));
            setProvinceOptions(provinceOptions);

        } else {
          console.error("I dati ottenuti non sono nel formato Array:", provinceResponse.data);
        }}
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchProvinceOptions();
  }, []);

  const fields = [
    { label: "Nome Azienda",                  name: "denominazione",            type: "text" },
    { label: "Email",                         name: "email",                    type: "text" },
    { label: "Partita IVA",                   name: "pi",                       type: "text" },
    { label: "Codice Fiscale",                name: "cf",                       type: "text" },
    { label: "Città",                         name: "citta",                    type: "text" },
    { label: "CAP",                           name: "cap",                      type: "text" },
    { label: "Paese",                         name: "paese",                    type: "text" },
    { label: "Provincia",                     name: "provincia",                type: "select", options: provinceOptions },
    { label: "Pec",                           name: "pec",                      type: "text" },
    { label: "Sede Operativa",                name: "sedeOperativa",            type: "text" },
    { label: "Sede Legale",                   name: "sedeLegale",               type: "text" },
    { label: "CodicePA",                      name: "codicePa",                 type: "text" },
    { label: "Codice Destinatario",           name: "codiceDestinatario",       type: "text" },
    { label: "Sito Web",                      name: "sito",                     type: "text" },
    { label: "Settore di mercato",            name: "settoreMercato",           type: "text" },
    { label: "Owner",                         name: "idOwner",                  type: "select", options: ownerOptions },
    { label: "Tipologia",                     name: "tipologia",                type: "select", options: [
      { value: "Cliente", label: "Cliente" },
      { value: "Prospect", label: "Prospect" },
      { value: "Consulenza", label: "Consulenza" }
    ]  },
    { label: "Stato",                         name: "status",                   type: "selectValue", options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ]  },
    
    { label: "Note", name: "note", type: "note" },

  ];



  // const handleSubmit = async (values) => {
  //   try {
  //     console.log("DATI DI VALUES: ", values);

  //     // Effettua la validazione prima di inviare la richiesta al server
  //     const validationErrors = validate(values);

  //     if (Object.keys(validationErrors).length === 0) {
  //       const response = await axios.post("http://localhost:8080/aziende/react/salva", values);
  //       console.log("Response from server:", response.data);

  //       navigate("/aziende");
  //     } else {
  //       console.log("Errore di validazione:", validationErrors);
  //     }
  //   } catch (error) {
  //     console.error("Errore durante il salvataggio:", error);
  //   }
  // };

  // const validate = (values) => {
  //   const errors = {};
  //   console.log("Dati in validate:", values);
  //   const campoObbligatorioErrors = {};

  //   // Esempio: verifica se il campo denominazione è vuoto
  //   if (!values.denominazione) {
  //     errors.denominazione = "Il campo Nome Azienda è obbligatorio";
  //   }
    
  //   if (!values.email) {
  //     errors.email = "Il campo Email è obbligatorio";
  //   }

  //   if (!values.idOwner) {
  //     errors.idOwner = "Il campo Owner è obbligatorio";
  //   }

  //   if (!values.status) {
  //     errors.status = "Il campo Stato è obbligatorio";
  //   }


  //   return { errors, campoObbligatorioErrors };
  // };

  const handleSubmit = async (values) => {
    try {
      console.log("DATI DI VALUES: ", values);
      
      // const validationResults = validate(values);
      // const { errors, campoObbligatorioErrors } = validationResults;
  
      // if (Object.keys(errors).length === 0 && Object.keys(campoObbligatorioErrors).length === 0) {
        const response = await axios.post("http://localhost:8080/aziende/react/salva", values);
        console.log("Response from server:", response.data);
  
        navigate("/aziende");
      // } else {
        // console.log("Errore di validazione:", validationResults);
        // Aggiungi gestione errori di validazione qui, ad esempio mostrando un messaggio all'utente
    // }
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
          <div className="page-name">Aggiungi un'Azienda</div>
          <FieldsBox fields={fields}  onSubmit={handleSubmit} title="" />
        </div>
      </div>
    </div>
  );
};

export default AggiungiAziende;
