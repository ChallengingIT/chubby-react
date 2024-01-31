import React, { useState, useEffect }             from "react";
import { useNavigate, useLocation }               from "react-router-dom";
import axios                                      from "axios";
import Sidebar                                    from "../../components/Sidebar";
import FieldsBox                                  from "../../components/FieldsBox";



const ModificaContatto = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { keyPeopleData = {} } = location.state || {};
  
  const [ aziendeOptions, setAziendeOptions] = useState([]);
  const [ ownerOptions,   setOwnerOptions  ] = useState([]);

  console.log("Dati Arrivati: ", keyPeopleData);

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        const responseAziende = await axios.get("http://localhost:8080/aziende/react", { headers: headers});
        const responseOwner   = await axios.get("http://localhost:8080/aziende/react/owner", { headers: headers});
        
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


  const campiObbligatori = [ "nome", "idAzienda", "email", "idOwner", "status", "ruolo", "dataCreazione", "dataUltimaAttivita" ];

  const fields = [
    { label: "* Nome Contatto",           name: "nome",                         type: "text" },
    { label: "* Azienda",                 name: "idAzienda",                    type: "select", options: aziendeOptions },
    { label: "* Email",                   name: "email",                        type: "text" },
    { label: "Cellulare",               name: "cellulare",                    type: "text" },
    { label: "* Proprietario",            name: "idOwner",                      type: "select", options: ownerOptions},
    { label: "* Stato",                   name: "status",                       type: "selectValue", options: [
      { value: "1", label: "Verde" },
      { value: "2", label: "Giallo" },
      { value: "3", label: "Rosso" },
    ] },
    
    { label: "* Ruolo",                   name: "ruolo",                        type: "text" },
    { label: "* Data di Creazione",       name: "dataCreazione",                type: "date" },
    { label: "* Ultima Attività",         name: "dataUltimaAttivita",           type: "date" },
    { label: "Note",                    name: "note",                         type: "note" },


  ];

  const initialValues = {
    id:                 keyPeopleData.id                                                  ,
    nome:               keyPeopleData.nome                                                || "",
    idAzienda:          keyPeopleData.cliente && keyPeopleData.cliente.id                 || "",
    idOwner:            keyPeopleData.owner   && keyPeopleData.owner.id                   || "",
    email:              keyPeopleData.email                                               || "",
    cellulare:          keyPeopleData.cellulare                                           || "",
    ruolo:              keyPeopleData.ruolo                                               || "",
    dataCreazione:      keyPeopleData.dataCreazione                                       || "",
    dataUltimaAttivita: keyPeopleData.dataUltimaAttivita                                  || "",
    status:             keyPeopleData.status                                              || "",
    note:               keyPeopleData.note                                                || "",
  };

  console.log("Initial Values:", initialValues);


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
    try {
      
      
      // Log the values and id
      console.log("DATI inseriti con ID: ", values);

      const response = await axios.post("http://localhost:8080/keypeople/react/salva", values, {
        headers: headers
      });
      console.log("DATI INVIATI DOPO LA MODIFICA :", values);
      console.log("Response from server:", response.data);

      navigate("/keypeople");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  }else {
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
          <div className="page-name">Modifica Contatto</div>
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

export default ModificaContatto;
