import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";
import { Box, Typography } from "@mui/material";
import Sidebar2 from "../../components/componentiBackup/Sidebar2";



const ModificaAzienda = () => {

  console.log("localStorageAziende: ", localStorage.getItem("searchTermsAzienda"));


  const navigate             = useNavigate();
  const location             = useLocation();
  const { aziendaData = {} } = location.state || {};


  
  const [ provinceOptions, setProvinceOptions] = useState([]);
  const [ ownerOptions,    setOwnerOptions   ] = useState([]);
  const [ aziendeOptions,  setAziendeOptions ] = useState([]);

   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   const headers = {
     Authorization: `Bearer ${accessToken}`
   };




  useEffect(() => {
    const fetchProvinceOptions = async () => {
      try {
        const responseProvince = await axios.get("http://89.46.196.60:8443/aziende/react/province", { headers: headers });
        const responseOwner    = await axios.get("http://89.46.196.60:8443/aziende/react/owner", { headers: headers });
        const responseAziende  = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });

        if (Array.isArray(responseAziende.data)) {
          const aziendeOptions = responseAziende.data.map((aziende) => ({
            label: aziende.denominazione,
            value: aziende.id,
          }));
          setAziendeOptions(aziendeOptions);

       
        if (Array.isArray(responseOwner.data)) {
          const ownerOptions = responseOwner.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
          }));
          setOwnerOptions(ownerOptions);


          if (Array.isArray(responseProvince.data)) {
            const provinceOptions = responseProvince.data.map((province) => ({
              label: province.nomeProvince,
              value: province.nomeProvince,
            }));
            setProvinceOptions(provinceOptions);
          }
        }
      }

      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };

    fetchProvinceOptions();
  }, []);

  const campiObbligatori = [ "denominazione", "denominazione2", "email", "idOwner", "status", "citta", "provincia" ];

  const fields = [
    { label: "Nome Azienda*",           name: "denominazione",        type: "text",       disabled: true                                  },
    { label: "Ragione Sociale*",        name: "denominazione2",       type: "text",       disabled: true                                  },
    { label: "Email*",                  name: "email",                type: "text"                                                        },
    { label: "Partita IVA",             name: "pi",                   type: "text"                                                        },
    { label: "Codice Fiscale",          name: "cf",                   type: "text"                                                        },
    { label: "Città*",                  name: "citta",                type: "text"                                                        },
    { label: "CAP",                     name: "cap",                  type: "number"                                                      },
    { label: "Paese",                   name: "paese",                type: "text"                                                        },
    { label: "Provincia*",              name: "provincia",            type: "select",     options: provinceOptions                        },
    { label: "Pec",                     name: "pec",                  type: "text"                                                        },
    { label: "Sede Operativa",          name: "sedeOperativa",        type: "text"                                                        },
    { label: "Sede Legale",             name: "sedeLegale",           type: "text"                                                        },
    { label: "Codice Destinatario",     name: "codiceDestinatario",   type: "text"                                                        },
    { label: "Sito Web",                name: "sito",                 type: "text"                                                        },
    { label: "Settore di mercato",      name: "settoreMercato",       type: "text"                                                        },
    { label: "Owner*",                  name: "idOwner",              type: "select",      options: ownerOptions                          },
    { label: "Tipologia",               name: "tipologia",            type: "select",      options: [ 
      { label: "Cliente",    value: "Cliente" },
      { label: "Prospect",   value: "Prospect" },
      { label: "Consulenza", value: "Consulenza" },
    ] },
    { label: "Stato*",                  name: "status",               type: "selectValue", options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ] },
    { label: "Note",                    name: "note",                 type: "note" },
  ];

  const initialValues = {
    id:                           aziendaData.id                              ,
    denominazione:                aziendaData.denominazione                   || null,
    email:                        aziendaData.email                           || null,
    pi:                           aziendaData.pi                              || null,
    cf:                           aziendaData.cf                              || null,
    citta:                        aziendaData.citta                           || null,
    cap:                          aziendaData.cap                             || null,
    paese:                        aziendaData.paese                           || null,
    provincia:                    aziendaData.provincia                       || null,
    pec:                          aziendaData.pec                             || null,
    sedeOperativa:                aziendaData.sedeOperativa                   || null,
    sedeLegale:                   aziendaData.sedeLegale                      || null,
    codicePa:                     aziendaData.codicePa                        || null,
    codiceDestinatario:           aziendaData.codiceDestinatario              || null,
    sito:                         aziendaData.sito                            || null,
    settoreMercato:               aziendaData.settoreMercato                  || null,
    tipologia:                    aziendaData.tipologia                       || null,
    status:                       aziendaData.status                          || null,
    idOwner:                     (aziendaData.owner && aziendaData.owner.id)  || null,
    note:                         aziendaData.note                            || null,
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

      const response = await axios.post("http://89.46.196.60:8443/aziende/react/salva", values, {
        headers: headers
      });
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
          <Sidebar2 />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Modifica Azienda</Typography>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          title="" 
          campiObbligatori={campiObbligatori}
          />
          </Box>
          </Box>


  );
};

export default ModificaAzienda;
