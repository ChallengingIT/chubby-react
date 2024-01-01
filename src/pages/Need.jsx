import React, { useState, useEffect }             from "react";
import { Link, useNavigate}                       from "react-router-dom";
import axios                                      from "axios";
import Sidebar                                    from "../components/Sidebar";
import MyDataGrid                                 from "../components/MyDataGrid";
import NeedSearchBox                              from "../components/searchBox/NeedSearchBox.jsx";
import MyButton                                   from '../components/MyButton.jsx';
import EditButton                                 from "../components/button/EditButton.jsx";
import SearchButton                               from "../components/button/SearchButton.jsx"; 
import PaperButton                                from "../components/button/PaperButton.jsx";
import Modal                                      from 'react-modal';
import { Button, Select, MenuItem }               from "@mui/material";

import "../styles/Need.css";

//ricordati di togliere queste due righe
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Need = () => {
  const navigate = useNavigate();

  const [ need,                     setNeed                       ] = useState([]);
  const [ originalNeed,             setOriginalNeed               ] = useState([]);
  const [ filteredNeed,             setFilteredNeed               ] = useState([]);
  const [ searchText,               setSearchText                 ] = useState("");
  const [ selectedNeed,             setSelectedNeed               ] = useState(null);
  const [ newStato,                 setNewStato                   ] = useState("");
  const [ isModalOpen,              setIsModalOpen                ] = useState(false);
  const [ statoOptions,             setStatoOptions               ] = useState([]);





    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/need/react");
        const responseStato = await axios.get("http://localhost:8080/need/react/stato");

        if (Array.isArray(responseStato.data)) {
          const statoConId = responseStato.data.map((stato) => ({ ...stato}));
          setStatoOptions(statoConId);
          console.log(statoConId);
          } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
          }


        if (Array.isArray(response.data)) {
        const needConId = response.data.map((need) => ({ ...need}));
        setOriginalNeed(needConId);
        setFilteredNeed(needConId);
        console.log(needConId);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);
  

  const navigateToAggiungiNeed = () => {
    navigate("/need/aggiungi");
  };

  const handleOpenModal = (selectedRow) => {
    setSelectedNeed(selectedRow);
    setNewStato(selectedRow.stato.id);
    setIsModalOpen(true);
  };

  const handleUpdateStato = async () => {
    try {
      const idStato = newStato;
      
      // Nota: Axios accetterà automaticamente questo oggetto e lo convertirà in una stringa di query.
      const params = new URLSearchParams({
        stato: idStato
      });
  
      await axios.post(`http://localhost:8080/need/react/salva/stato/${selectedNeed.id}?${params.toString()}`);
      
      // Se la chiamata è andata a buon fine, chiudi il modal e aggiorna i dati
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato:", error);
    }
  };
  


  const columns = [
    { field: "id",               headerName: "#",                  width: 70  },
    { field: "weekDescrizione",  headerName: "Week/Descrizione",    width: 200, renderCell: (params) => (
      <div style={{ textAlign: "left" }}>
      <div style={{ textAlign: "start" }}>{params.row.week}</div>
      <div style={{ textAlign: "start" }}>{params.row.descrizione}</div>
    </div>
      ),
    },
    { field: "priorita",          headerName: "Priorità",            width: 100 },
    { field: "tipologia",
      headerName: "Tipologia",
      width: 150,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.tipologia && params.row.tipologia.descrizione
            ? params.row.tipologia.descrizione
            : "N/A"}
        </div>
      ),
    },
    {
      field: "owner",
      headerName: "Owner",
      width: 70,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.owner && params.row.owner.descrizione
            ? params.row.owner.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "cliente",           headerName: "Azienda",             width: 250, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.cliente && params.row.cliente.denominazione
          ? params.row.cliente.denominazione
          : "N/A"}
      </div>
    ), },
    { field: "numeroRisorse",     headerName: "Headcount",           width: 100 },
    { field: "stato",
      headerName: "Stato",
      width: 100,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "azioni",            headerName: "Azioni",              width: 270,  renderCell: (params) => (
      <div>
        <PaperButton onClick={() => handleOpenModal(params.row)} />
        <Link
        to={`/need/modifica/${params.row.id}`}
        state={{ needData: params.row }}
        >
        <EditButton  />
        </Link>
        <Link
        to={`/need/match/${params.row.id}`}
        state = {{ needData: params.row}}
        >
        <SearchButton />
        </Link>
      </div>
    ),
    }, 
  ];
  // const initialData = [
  //   { id: 1, priorità: "1", Azienda: "AON",         week: "2023-W03", descrizione: "Linux",                             azienda: "AON",                        headcount: "1",    stato: "Chiuso",      owner: "RM", tipologia: "Consulenza" },
  //   { id: 2, priorità: "1", Azienda: "Eurobet",     week: "2023-W37", descrizione: "Data modeler",                      azienda: "Gruppo Mutui Online",        headcount: "1",    stato: "Perso",       owner: "RT", tipologia: "Consulenza" },
  //   { id: 3, priorità: "1", Azienda: "Lottomatica", week: "2023-W37", descrizione: "Data modeler",                      azienda: "Gruppo Mutui Online",        headcount: "1",    stato: "Anticipato",  owner: "MS", tipologia: "Recruiting" },
  //   { id: 4, priorità: "1", Azienda: "Fendi",       week: "2023-W37", descrizione: "Sviluppatore Senior JAVA",          azienda: "AOGruppo Mutui Online",      headcount: "1",    stato: "Perso",       owner: "EU", tipologia: "Recruiting" },
  //   { id: 5, priorità: "1", Azienda: "Kering",      week: "2023-W37", descrizione: "Sviluppatore Medium Frontend",      azienda: "TAS Group",                  headcount: "1",    stato: "Attivo",      owner: "RM", tipologia: "Consulenza" },
  //   { id: 6, priorità: "1", Azienda: "Hotels.com",  week: "2023-W37", descrizione: "Sistemista Unix- Roma presenza",    azienda: "TAS Group",                  headcount: "1",    stato: "Chiuso",      owner: "RM", tipologia: "Recruiting" },
  //   { id: 7, priorità: "1", Azienda: "Sisal",       week: "2023-W37", descrizione: "PM Mid-Sen",                        azienda: "TAS Group",                  headcount: "1",    stato: "Attivo",      owner: "RT", tipologia: "Consulenza" },

  // ];


  // const [tableData, setTableData] = React.useState(initialData);

  const handleSearch = (filteredData) => {
   setFilteredNeed(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    // fetchData();
    setFilteredNeed(originalNeed);
  };



  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Need</div>
          <MyButton onClick={navigateToAggiungiNeed}>Aggiungi Need</MyButton>
          <NeedSearchBox
            data={need}
            onSearch={handleSearch}
            onReset={handleReset}
            onSearchTextChange={(text) => setSearchText(text)}
            OriginalNeed={originalNeed}
          />
          <MyDataGrid data={filteredNeed} columns={columns} title="Need" getRowId={(row) => row.id} />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: '800px',
            height: 'auto',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '40px',
          },
          overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
  <div
    style={{
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <h2>Cambia stato al need</h2>
    <Select
      value={newStato}
      onChange={(e) => setNewStato(e.target.value)}
      sx={{
        marginBottom: '10px',
        width: '200px', 
      }}
    >
     {statoOptions.map((stato) => (
    <MenuItem key={stato.id} value={stato.id}>
      {stato.descrizione}
    </MenuItem>
  ))}
    </Select>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        color="primary"
        onClick={() => setIsModalOpen(false)}
        sx={{
          backgroundColor: "#6C757D",
          color: "white",
          marginRight: '10px', 
          "&:hover": {
            backgroundColor: "#6C757D",
            transform: "scale(1.05)",
          },
        }}
      >
        Indietro
      </Button>
      <Button
        color="primary"
        variant="contained"
        onClick={handleUpdateStato}
        sx={{
          backgroundColor: "black",
          "&:hover": {
            backgroundColor: "black",
            transform: "scale(1.05)",
          },
        }}
      >
        Salva
      </Button>
    </div>
        </div>
      </Modal>
    </div>
  );
};

export default Need;