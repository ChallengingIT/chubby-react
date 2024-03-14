import React, { useState, useEffect }               from "react";
import { useNavigate }                              from "react-router-dom";
import axios                                        from "axios";
import { Box,Typography }                           from "@mui/material";
import FieldBoxFile                                 from "../../components/FieldBoxFile";

const AggiungiAziende = () => {
  const navigate = useNavigate();

  const [ provinceOptions, setProvinceOptions] = useState([]);
  const [ ownerOptions,    setOwnerOptions   ] = useState([]);
  const [                  setAlert          ] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  useEffect(() => {
    const fetchProvinceOptions = async () => {
      try {

        const provinceResponse = await axios.get("http://localhost:8080/aziende/react/province", { headers: headers });
        const ownerResponse    = await axios.get("http://localhost:8080/aziende/react/owner",    { headers: headers }   );

        if (Array.isArray(ownerResponse.data)) {
          const ownerOptions = ownerResponse.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);
        }
        
          if (Array.isArray(provinceResponse.data)) {
            const provinceOptions = provinceResponse.data.map((province) => ({
              label: province.nomeProvince,
              value: province.nomeProvince,
            }));
            setProvinceOptions(provinceOptions);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", provinceResponse.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchProvinceOptions();
  }, []);

  const campiObbligatori = [ "denominazione", "ragioneSociale", "email", "idOwner", "status", "citta", "provincia" ];

  const fields = [
    { label: "Nome Azienda*",                   name: "denominazione",            type: "text"                             },
    { label: "Ragione Sociale*",                name: "ragioneSociale",           type: "text"                             },
    { label: "Email*",                          name: "email",                    type: "text"                             },
    { label: "Partita IVA",                     name: "pi",                       type: "text"                             },
    { label: "Codice Fiscale",                  name: "cf",                       type: "text"                             },
    { label: "Città*",                          name: "citta",                    type: "text"                             },
    { label: "CAP",                             name: "cap",                      type: "text"                             },
    { label: "Paese",                           name: "paese",                    type: "text"                             },
    { label: "Provincia*",                      name: "provincia",                type: "select", options: provinceOptions },
    { label: "Pec",                             name: "pec",                      type: "text"                             },
    { label: "Sede Operativa",                  name: "sedeOperativa",            type: "text"                             },
    { label: "Sede Legale",                     name: "sedeLegale",               type: "text"                             },
    { label: "Codice Destinatario",             name: "codiceDestinatario",       type: "text"                             },
    { label: "Sito Web",                        name: "sito",                     type: "text"                             },
    { label: "Settore di mercato",              name: "settoreMercato",           type: "text"                             },
    { label: "Owner*",                          name: "idOwner",                  type: "select", options: ownerOptions    },
    { label: "Tipologia",                       name: "tipologia",                type: "select", options: [
      { value: "Cliente", label: "Cliente" },
      { value: "Prospect", label: "Prospect" },
      { value: "Consulenza", label: "Consulenza" }
    ]  },
    { label: "Stato*",                          name: "status",                    type: "select", options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ]  },
    
    { label: "Note",                            name: "note",                      type: "note" },

  ];


  const handleSubmit = async (values) => {
    const errors    = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
  
    if (!hasErrors) {
      try {

        Object.keys(values).forEach(key => {
          if (!campiObbligatori.includes(key) && !values[key]) {
            values[key] = null;
          }
        });


        const userString = localStorage.getItem("user");
        if (!userString) {
          console.error("Nessun utente o token trovato in localStorage");
          return;
        }
        const user = JSON.parse(userString);
        const accessToken = user?.accessToken;
        
        if (!accessToken) {
          console.error("Nessun token di accesso disponibile");
          return;
        }
  
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };

        const response = await axios.post("http://localhost:8080/aziende/react/salva", values, {
          headers: headers
        });
        if (response.data === "DUPLICATO") {
          setAlert({ open: true, message: "Email già utilizzata!" });
          console.error("L'email fornita è già in uso.");
          return; 
        }
        navigate("/aziende");
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
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
            <Box sx={{ 
              flexGrow: 1, 
              p: 3, 
              marginLeft: '12.2em', 
              marginTop: '0.5em', 
              marginBottom: '0.8em', 
              marginRight: '0.8em', 
              backgroundColor: '#FEFCFD', 
              borderRadius: '10px', 
              display: 'flex', 
              justifyContent: 'center', 
              flexDirection: 'column' 
          }}
            >
          <Typography variant="h4" component="h1" sx={{mt:3, fontWeight: 'bold', fontSize: '1.8rem', color: '#00853C'}}>Aggiungi una nuova Azienda</Typography>

          <FieldBoxFile
          fields={fields}
          campiObbligatori={campiObbligatori}
          onSubmit={handleSubmit}
          title=""
          />
          </Box>
    </Box>
  );
};

export default AggiungiAziende;
