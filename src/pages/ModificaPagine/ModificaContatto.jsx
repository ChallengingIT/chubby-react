import React, { useState, useEffect }             from "react";
import { useNavigate, useLocation }               from "react-router-dom";
import axios                                      from "axios";
import Sidebar                                    from "../../components/Sidebar";
import FieldsBox                                  from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";


const ModificaContatto = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { keyPeopleData = {} } = location.state || {};
  
  const [ aziendeOptions, setAziendeOptions] = useState([]);
  const [ ownerOptions,   setOwnerOptions  ] = useState([]);


   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   const headers = {
     Authorization: `Bearer ${accessToken}`
   };


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseAziende = await axios.get("http://89.46.196.60:8443/aziende/react/select",{ headers: headers});
        const responseOwner   = await axios.get("http://89.46.196.60:8443/aziende/react/owner", { headers: headers});
        
        if (Array.isArray(responseOwner.data)) {
          const ownerOptions = responseOwner.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id, 
          }));
          setOwnerOptions(ownerOptions);


        if (Array.isArray(responseAziende.data)) {
          const aziendeOptions = responseAziende.data.map((aziende) => ({
            label: aziende.denominazione,
            value: aziende.id,
          }));
          setAziendeOptions(aziendeOptions);
        }
      }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);


  const campiObbligatori = [ "nome", "idAzienda", "email", "idOwner", "status", "ruolo", "dataCreazione" ];

  const fields = [
    { label: "Nome Contatto*",            name: "nome",                         type: "text" },
    { label: "Azienda*",                  name: "idAzienda",                    type: "select",      options: aziendeOptions },
    { label: "Email*",                    name: "email",                        type: "text" },
    { label: "Cellulare",                 name: "cellulare",                    type: "text" },
    { label: "Proprietario*",             name: "idOwner",                      type: "select",      options: ownerOptions},
    { label: "Stato*",                    name: "status",                       type: "selectValue", options: [
      { value: "1", label: "Verde" },
      { value: "2", label: "Giallo" },
      { value: "3", label: "Rosso" },
    ] },
    { label: "Ruolo*",                    name: "ruolo",                        type: "text" },
    { label: "Data di Creazione*",        name: "dataCreazione",                type: "date" },
    { label: "Ultima Attività",           name: "dataUltimaAttivita",           type: "date" },
    { label: "Note",                      name: "note",                         type: "note" },


  ];

  const initialValues = {
    id:                 keyPeopleData.id                                                  ,
    nome:               keyPeopleData.nome                                                || null,
    idAzienda:          keyPeopleData.cliente && keyPeopleData.cliente.id                 || null,
    idOwner:            keyPeopleData.owner   && keyPeopleData.owner.id                   || null,
    email:              keyPeopleData.email                                               || null,
    cellulare:          keyPeopleData.cellulare                                           || null,
    ruolo:              keyPeopleData.ruolo                                               || null,
    dataCreazione:      keyPeopleData.dataCreazione                                       || null,
    dataUltimaAttivita: keyPeopleData.dataUltimaAttivita                                  || null,
    status:             keyPeopleData.status                                              || null,
    note:               keyPeopleData.note                                                || null,
  };



  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
    try {
      const response = await axios.post("http://89.46.196.60:8443/keypeople/react/salva", values, {
        headers: headers
      });
      navigate("/keypeople");
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overFlow: 'hidden'}}>
          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Modifica Contatto</Typography>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          campiObbligatori={campiObbligatori} 
          onSubmit={handleSubmit} 
          title="" 
          />
          </Box>
          </Box>


  );
};

export default ModificaContatto;
