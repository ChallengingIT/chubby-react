import React, { useState, useEffect }           from "react";
import { useNavigate, useLocation }             from "react-router-dom";
import Sidebar                                  from "../../components/Sidebar";
import { Button, Grid }                         from "@mui/material";
import { useParams }                            from "react-router-dom";
import AttivitaCard                             from "../../components/card/AttivitaCard";
import axios                                    from "axios";
import InformazioniKeypeopleCard                from "../../components/card/InformazioniKeypeopleCard";
import "../../styles/DettaglioKeyPeople.css";




const DettaglioKeyPeople = () => {
  const navigate               = useNavigate();
  const location               = useLocation();
  const { keypeopleData = {} } = location.state || {};
  const params                 = useParams();
  const { id }                 = params;
  const nomeKeypeople          = keypeopleData.nome;


  const [ attivitaOptions,  setAttivitaOptions ] = useState([]);
  const [ keypeopleOptions, setKeypeopleOptions] = useState({});

useEffect(() => {
  if (location.state?.keypeopleData) {
    setKeypeopleOptions(location.state.keypeopleData);
  }
}, [location.state]);


  const SimpleData = ({ fields, initialValues, tableTitle }) => (
    <div>
      <h1 style={{ color: "#808080", margin: '20px', fontSize: 'bold' }}>{tableTitle}</h1>
      {fields.map((field) => (
        <div key={field.name} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <strong style={{ marginRight: "8px" }}>{field.label}:</strong>
          <span>{initialValues[field.name]}</span>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchOptions = async () => {
      try { 
        const responseAttivita = await axios.get(`http://localhost:8080/keypeople/react/attivita/${id}`);
        if (Array.isArray(responseAttivita.data)) {
          const attivitaOptions = responseAttivita.data.map((attivita) => ({
            note: attivita.note,
            owner: `${attivita.owner.nome} ${attivita.owner.cognome}`,
            data: attivita.data
          }));
          setAttivitaOptions(attivitaOptions);
        }


      } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
      }
    };
    fetchOptions();
  }, []);
  


  const handleGoBack = () => {
    window.history.back();
  };



  const { nome } = params;

  const fields1 = [
    { label: "Nome",        name: "nome" },
    { label: "Azienda",     name: "cliente" },
    { label: "Email",       name: "email" },
    { label: "Cellulare",   name: "cellulare" },
    { label: "Owner",       name: "owner" },
  ];

  const initialValues1 = {
    nome:                 keypeopleData.nome                    || "",
    cliente:              keypeopleData.cliente && keypeopleData.cliente.denominazione    || "",
    email:                keypeopleData.email                   || "",
    cellulare:            keypeopleData.cellulare               || "",
    owner:                keypeopleData.owner && keypeopleData.owner.descrizione        || "",
  };

  const tableAttivita = [
    { label: "Owner", name: "owner" },
    { label: "Data" , name: "data" },
    { label: "Note",  name: "note" },
  ];

  const intialValuesAttivita = attivitaOptions.map(attivita => ({
    owner:  attivita.owner|| "",
    data:   attivita.data || "",
    note:   attivita.note || ""
  }));


  return (
    <div className="dettaglioContainerKeyPeople" >
    <div className="bar" style={{ height: '100vh', overflowY: 'hidden'}}>
    <Sidebar />
    </div>
      <div className="contentDettaglioKeyPeople">
       
        {/* <div className="flex-container" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}> */}
          <div className="containerTitle">
            <h1>{`Visualizzazione ${nomeKeypeople}`}</h1>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
            <InformazioniKeypeopleCard fields={fields1} initialValues={initialValues1} tableTitle="Informazioni Keypeople"/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AttivitaCard columns={tableAttivita} initialValues={intialValuesAttivita} />
            </Grid>
          </Grid>

          <Button
            color="primary"
            onClick={handleGoBack}
            sx={{
              backgroundColor: "black",
              borderRadius: "40px",
              color: "white",
              width: "250px",
              height: "30px",
              margin: "auto",
              marginTop: "20px", 
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Indietro
          </Button>
        </div>
      </div>
    // </div>
  );

};

export default DettaglioKeyPeople;
