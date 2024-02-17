import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import axios                            from "axios";
import Sidebar                          from "../../components/Sidebar";
import FieldsBox                        from "../../components/FieldsBox";
import { Box, Typography, Alert, Snackbar } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";

const AggiungiContatto = () => {
  const navigate = useNavigate();

  const [ aziendeOptions, setAziendeOptions] = useState([]);
  const [ ownerOptions,   setOwnerOptions  ] = useState([]);
  const [ alert,          setAlert         ] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
      const accessToken = user?.accessToken;
  
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const aziendeResponse = await axios.get("http://89.46.196.60:8443/aziende/react/select",       { headers: headers });
        const ownerResponse   = await axios.get("http://89.46.196.60:8443/aziende/react/owner",        { headers: headers });
        if (Array.isArray(ownerResponse.data)) {
          const ownerOptions = ownerResponse.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", ownerResponse.data);
        }


        if (Array.isArray(aziendeResponse.data)) {
          const aziendeOptions = aziendeResponse.data.map((aziende) => ({
            label: aziende.denominazione,
            value: aziende.id,
          }));
          setAziendeOptions(aziendeOptions);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", aziendeResponse.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchAziendeOptions();
  }, []);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlert({ ...alert, open: false });
};



  const campiObbligatori = ["nome", "idAzienda", "email", "idOwner", "status", "ruolo", "dataCreazione"];
  const fields = [
    { label: "Nome Contatto*",        name: "nome",                 type: "text" },
    { label: "Azienda*",              name: "idAzienda",            type: "select",      options: aziendeOptions },
    { label: "Email*",                name: "email",                type: "text" },
    { label: "Cellulare",             name: "cellulare",            type: "text" },
    { label: "Proprietario*",         name: "idOwner",              type: "select",      options: ownerOptions},
    { label: "Stato*",                name: "status",               type: "select",      options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ] },
    
    { label: "Ruolo*",                name: "ruolo",               type: "text" },
    { label: "Data di Creazione*",    name: "dataCreazione",       type: "date" },
    { label: "Ultima Attività",       name: "dataUltimaAttivita",  type: "date" },
    { label: "Note",                  name: "note",                type: "note" },


  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
    try {
      const response = await axios.post("http://89.46.196.60:8443/keypeople/react/salva", values, {
        headers: headers
      });
      if (response.data === "DUPLICATO") {
        setAlert({ open: true, message: "Email già utilizzata!" });
        console.error("L'email fornita è già in uso.");
        return; 
      }

      navigate("/keyPeople");
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
          <Sidebar2 />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Aggiungi Contatto</Typography>

          <FieldsBox 
          fields={fields}  
          onSubmit={handleSubmit} 
          campiObbligatori={campiObbligatori} 
          title="" 
          />
          </Box>
      </Box>
  );
};

export default AggiungiContatto;
