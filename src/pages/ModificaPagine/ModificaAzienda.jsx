import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../../components/Sidebar";
import FieldsBox                              from "../../components/FieldsBox";



const ModificaAzienda = () => {

  const navigate             = useNavigate();
  const location             = useLocation();
  const { aziendaData = {} } = location.state || {};


  
  const [ provinceOptions, setProvinceOptions] = useState([]);
  const [ ownerOptions,    setOwnerOptions   ] = useState([]);
  const [ aziendeOptions,  setAziendeOptions ] = useState([]);

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };




  useEffect(() => {
    const fetchProvinceOptions = async () => {
      try {
        const responseProvince = await axios.get("https://89.46.67.198:8443/aziende/react/province", { headers: headers });
        const responseOwner    = await axios.get("https://89.46.67.198:8443/aziende/react/owner", { headers: headers });
        const responseAziende  = await axios.get("https://89.46.67.198:8443/aziende/react", { headers: headers });

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

  const campiObbligatori = [ "denominazione", "email", "idOwner", "status", "citta", "provincia" ];

  const fields = [
    { label: "* Nome Azienda",          name: "denominazione",        type: "text",       disabled: true                                  },
    { label: "* Email",                 name: "email",                type: "text"                                                        },
    { label: "Partita IVA",           name: "pi",                   type: "text"                                                        },
    { label: "Codice Fiscale",        name: "cf",                   type: "text"                                                        },
    { label: "* Città",                 name: "citta",                type: "text"                                                        },
    { label: "CAP",                   name: "cap",                  type: "text"                                                        },
    { label: "Paese",                 name: "paese",                type: "text"                                                        },
    { label: "* Provincia",             name: "provincia",            type: "select",     options: provinceOptions                        },
    { label: "Pec",                   name: "pec",                  type: "text"                                                        },
    { label: "Sede Operativa",        name: "sedeOperativa",        type: "text"                                                        },
    { label: "Sede Legale",           name: "sedeLegale",           type: "text"                                                        },
    { label: "CodicePA",              name: "codicePa",             type: "text"                                                        },
    { label: "Codice Destinatario",   name: "codiceDestinatario",   type: "text"                                                        },
    { label: "Sito Web",              name: "sito",                 type: "text"                                                        },
    { label: "Settore di mercato",    name: "settoreMercato",       type: "text"                                                        },
    { label: "* Owner",                 name: "idOwner",              type: "select",      options: ownerOptions                          },
    { label: "Tipologia",             name: "tipologia",            type: "select",      options: [ 
      { label: "Cliente", value: "Cliente" },
      { label: "Prospect", value: "Prospect" },
      { label: "Consulenza", value: "Consulenza" },
    ] },
    { label: "* Stato",                 name: "status",               type: "selectValue", options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ] },
    { label: "Note",                  name: "note",                 type: "note" },
  ];

  const initialValues = {
    id:                           aziendaData.id                              ,
    denominazione:                aziendaData.denominazione                   || "",
    email:                        aziendaData.email                           || "",
    pi:                           aziendaData.pi                              || "",
    cf:                           aziendaData.cf                              || "",
    citta:                        aziendaData.citta                           || "",
    cap:                          aziendaData.cap                             || "",
    paese:                        aziendaData.paese                           || "",
    provincia:                    aziendaData.provincia                       || "",
    pec:                          aziendaData.pec                             || "",
    sedeOperativa:                aziendaData.sedeOperativa                   || "",
    sedeLegale:                   aziendaData.sedeLegale                      || "",
    codicePa:                     aziendaData.codicePa                        || "",
    codiceDestinatario:           aziendaData.codiceDestinatario              || "",
    sito:                         aziendaData.sito                            || "",
    settoreMercato:               aziendaData.settoreMercato                  || "",
    tipologia:                    aziendaData.tipologia                       || "",
    status:                       aziendaData.status                          || "",
    idOwner:                     (aziendaData.owner && aziendaData.owner.id)  || "",
    note:                         aziendaData.note                            || "",
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

       // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
      
      
      
      const response = await axios.post("https://89.46.67.198:8443/aziende/react/salva", values, {
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name" style={{ margin: '20px',fontSize: "15px" }}>
          <h1>{`Modifica Azienda `}</h1>
          </div>
          <FieldsBox 
          fields={fields} 
          initialValues={initialValues} 
          onSubmit={handleSubmit} 
          title="" 
          campiObbligatori={campiObbligatori}
          />
        </div>
      </div>
    </div>
  );
};

export default ModificaAzienda;
