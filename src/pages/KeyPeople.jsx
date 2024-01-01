import React, { useEffect, useState }                 from "react";
import { useNavigate }                                from "react-router-dom";
import { Link }                                       from "react-router-dom";
import axios                                          from "axios";
import Sidebar                                        from "../components/Sidebar";
import MyDataGrid                                     from "../components/MyDataGrid";
import KeyPeopleSearchBox                             from "../components/searchBox/KeyPeopleSearchBox.jsx";
import MyButton                                       from '../components/MyButton.jsx';
import DeleteButton                                   from "../components/button/DeleteButton.jsx";
import EditButton                                     from "../components/button/EditButton.jsx";
import SmileGreenIcon                                 from "../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                                from "../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                                   from "../components/button/SmileRedIcon.jsx";

import "../styles/KeyPeople.css";

const KeyPeople = () => {
  const navigate = useNavigate();
  const [ searchText,           setSearchText               ] = useState("");
  const [ keypeople,            setKeypeople                ] = useState([]);
  const [ originalKeypeople,    setOriginalKeypeople        ] = useState([]);
  const [ filteredKeypeople,    setFilteredKeypeople        ] = useState([]);
  const [ denominazioneAzienda, setDenominazioneAzienda     ] = useState("");

  const translateAziendaNames = async (keypeopleData) => {
    try {
      const updatedKeypeople = await Promise.all(
        keypeopleData.map(async (keypeople) => {
          if (keypeople.idAzienda !== null && keypeople.idAzienda !== undefined) {
            try {
              const responseAzienda = await axios.get(`http://localhost:8080/aziende/react/${keypeople.idAzienda}`);
              const denominazioneAzienda = responseAzienda.data.denominazione;

              return { ...keypeople, denominazioneAzienda };
            } catch (error) {
              console.error(`Errore durante la traduzione dell'azienda con id=${keypeople.idAzienda}:`, error);
              return keypeople;
            }
          }
          return keypeople;
        })
      );

      return updatedKeypeople;
    } catch (error) {
      console.error("Errore durante la traduzione delle aziende:", error);
      return keypeopleData;
    }
  };

  const translateOwnerNames = async (keypeopleData) => {
    try {
      const updatedKeypeople = await Promise.all(
        keypeopleData.map(async (keypeople) => {
          if (keypeople.idOwner !== null && keypeople.idOwner !== undefined) {
            try {
              const responseOwner = await axios.get(`http://localhost:8080/aziende/react/owner/${keypeople.idOwner}`);
              const descrizioneOwner = responseOwner.data.descrizione;

              return { ...keypeople, descrizioneOwner };
            } catch (error) {
              console.error(`Errore durante la traduzione dell'azienda con id=${keypeople.idOwner}:`, error);
              return keypeople;
            }
          }
          return keypeople;
        })
      );

      return updatedKeypeople;
    } catch (error) {
      console.error("Errore durante la traduzione delle aziende:", error);
      return keypeopleData;
    }
  };
  
  
  
  const fetchDataAndTranslate = async () => {
    try {
      const response = await axios.get("http://localhost:8080/keypeople/react");
      if (Array.isArray(response.data)) {
        const keypeopleConId = response.data.map((keypeople) => ({ ...keypeople }));

        console.log("DATI CHE ARRIVANO DAL DB: ", keypeopleConId);

        const keypeopleConDenominazione = await translateAziendaNames(keypeopleConId);
        const keypeopleConOwner = await translateOwnerNames(keypeopleConDenominazione);

        // Aggiorna lo stato con i dettagli delle aziende
        setKeypeople(keypeopleConOwner);
        setOriginalKeypeople(keypeopleConOwner);
        setFilteredKeypeople(keypeopleConOwner);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", response.data);
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  };

  useEffect(() => {
    fetchDataAndTranslate();
  }, []);

  
  
  

  

  const navigateToAggiungiContatto = () => {
    navigate("/keyPeople/aggiungi");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/keypeople/react/elimina/${id}`);

      const updatedKeypeople = originalKeypeople.filter((keypeople) => keypeople.id !== id);
      setKeypeople(updatedKeypeople);
      setOriginalKeypeople(updatedKeypeople);
      setFilteredKeypeople(updatedKeypeople);
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const getSmileIcon = (params) => {
    switch (params.row.status) {
      case "1":
        return <SmileGreenIcon />;
      case "2":
        return <SmileOrangeIcon />;
      case "3":
        return <SmileRedIcon />;
      default:
        return params.row.status;
    }
  };

  const columns = [
    { field: "status", headerName: "Stato", width: 60, renderCell: (params) => getSmileIcon(params) },
    {
      field: "nomeEmail",
      headerName: "Nome/Email",
      width: 250,
      renderCell: (params) => {
        // console.log("Dati passati premendo sul nome:", params.row); 
        return (
          <div style={{ textAlign: "left" }}>
            <Link
              to={`/keyPeople/dettaglio/${params.row.id}`}
              state={{ keypeopleData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner, denominazioneAzienda: params.row.denominazioneAzienda } }}
            >
              {params.row.nome}
            </Link>
            <div style={{ textAlign: "start" }}>{params.row.email}</div>
          </div>
        );
      },
    },
    { field: "cellulare",          headerName: "Telefono", width: 150 },
    { field: "Owner",              headerName: "Proprietario",    width: 150,
    valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A",
},

{
  field: "cliente",
  headerName: "Azienda",
  width: 150,
  valueGetter: (params) => params.row.cliente && params.row.cliente.denominazione || "N/A",
  },
    { field: "ruolo", headerName: "Ruolo", width: 150 },
    {
      field: "azioni",
      headerName: "Azioni",
      width: 400,
      renderCell: (params) => (
        <div>
          <Link to={`/keyPeople/modifica/${params.row.id}`} state={{ keyPeopleData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner, denominazioneAzienda: params.row.denominazioneAzienda } }}>
  <EditButton />
</Link>
          <DeleteButton onClick={() => handleDelete(params.row.id)} />
        </div>
      ),
    },
  ];

  const handleSearch = (filteredData) => {
    setFilteredKeypeople(filteredData);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredKeypeople(originalKeypeople);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Contatti</div>
          <MyButton onClick={navigateToAggiungiContatto}>Aggiungi Contatto</MyButton>
          <KeyPeopleSearchBox
            data={keypeople}
            onSearch={handleSearch}
            onReset={handleReset}
            onSearchTextChange={(text) => setSearchText(text)}
            OriginalKeypeople={originalKeypeople}
          />
          <MyDataGrid data={filteredKeypeople} columns={columns} title="Key People" getRowId={(row) => row.id} />
        </div>
      </div>
    </div>
  );
};

export default KeyPeople;
