import React, { useState, useEffect }   from "react";
import { useNavigate, useLocation }     from "react-router-dom";
import axios                            from "axios";
import Sidebar                          from "../../components/Sidebar";
import FieldsBox                        from "../../components/FieldsBox";

const AggiungiContatto = () => {
  const navigate = useNavigate();

  const [ aziendeOptions, setAziendeOptions] = useState([]);
  const [ ownerOptions,   setOwnerOptions  ] = useState([]);


  useEffect(() => {
    const fetchAziendeOptions = async () => {
      try {
        // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };

        const aziendeResponse = await axios.get("http://localhost:8080/aziende/react", { headers: headers });
        const ownerResponse = await axios.get("http://localhost:8080/aziende/react/owner", { headers: headers });
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



  const campiObbligatori = ["nome", "idAzienda", "email", "idOwner", "status", "ruolo", "dataCreazione"];
  const fields = [
    { label: "* Nome Contatto",       name: "nome",                 type: "text" },
    { label: "* Azienda",             name: "idAzienda",            type: "select",      options: aziendeOptions },
    { label: "* Email",               name: "email",                type: "text" },
    { label: "Cellulare",           name: "cellulare",            type: "text" },
    { label: "* Proprietario",        name: "idOwner",              type: "select",      options: ownerOptions},
    { label: "* Stato",               name: "status",               type: "select",      options: [
      { value: 1, label: "Verde" },
      { value: 2, label: "Giallo" },
      { value: 3, label: "Rosso" },
    ] },
    
    { label: "* Ruolo",                name: "ruolo",               type: "text" },
    { label: "* Data di Creazione",    name: "dataCreazione",       type: "date" },
    { label: "Ultima Attività",      name: "dataUltimaAttivita",  type: "date" },
    { label: "Note",                 name: "note",                type: "note" },


  ];


  const handleSubmit = async (values) => {
    const errors = validateFields(values);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
    try {
      // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };


      const response = await axios.post("http://localhost:8080/keypeople/react/salva", values, {
        headers: headers
      });

      navigate("/keyPeople");
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  }else {
    console.log("Errore di validazione:", errors);
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
          <div className="page-name">Aggiungi un Contatto</div>
          <FieldsBox 
          fields={fields}  
          onSubmit={handleSubmit} 
          campiObbligatori={campiObbligatori} 
          title="" 
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiContatto;
