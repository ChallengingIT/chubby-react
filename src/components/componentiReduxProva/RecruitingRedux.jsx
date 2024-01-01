
//studio di implementazione redux al 21 dicembre 2023

import React, { useEffect, useState } from "react";
import "../styles/Recruiting.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar             from "../components/Sidebar";
import MyDataGrid          from "../components/MyDataGrid";
import RecruitingSearchBox from "../components/searchBox/RecruitingSearchBox.jsx";
import MyButton            from '../components/MyButton.jsx';
import NoteButton          from "../components/button/NoteButton.jsx";
import EuroButton          from "../components/button/EuroButton.jsx";
import PersonInfoButton    from "../components/button/PersonInfoButton.jsx";
// import BagButton           from "../components/button/BagButton.jsx";
import DeleteButton        from "../components/button/DeleteButton.jsx";
import ClipButton          from "../components/button/ClipButton.jsx";
import Modal from 'react-modal';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { setRecruiting, setOriginalRecruiting, setFilteredRecruiting, deleteRecruiting } from '../store/slices/recruitingSlice';



const Recruiting = () => {const dispatch = useDispatch();
  const { recruiting, originalRecruiting, filteredRecruiting } = useSelector(state => state.recruiting);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();


  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false);
  const [isRalPopupOpen, setIsRalPopupOpen] = useState(false);

  const [selectedCandidateNotes, setSelectedCandidateNotes] = useState("");




  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/staffing/react");
        if (Array.isArray(response.data)) {
          console.log("Dati ricevuti:", response.data); // Log specifico dei dati
          console.log("Numero di elementi ricevuti:", response.data.length); // Log del numero di elementi
          dispatch(setOriginalRecruiting(response.data));
          dispatch(setFilteredRecruiting(response.data));
    
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };
    fetchData();
  }, [dispatch]);
  

  const navigateToAggiungiCandidato = () => {
    navigate("/recruiting/aggiungi");
  };

  const navigateToModificaStaffing = (nome) => {
    navigate(`/staffing/modifica/${nome}`);
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/staffing/elimina/${id}`);
      console.log("Risposta della chiamata DELETE: ", response);

      dispatch(deleteRecruiting(id));
      
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const handleCloseNotesModal = () => {
    setIsNotesPopupOpen(false);
  };

  

  const columns = [
    // { field: "id",            headerName: "ID",             width: 70  },
    { field: "nomeEmail",     headerName: "Nome/Email",     width: 250, renderCell: (params) => (
      <div style={{ textAlign: "left"  }}>
      <Link
      to={`/staffing/modifica/${params.row.id}/${params.row.nome}/${params.row.cognome}`}
      state={{ recruitingData: params.row }}

    >
      {params.row.nome} {params.row.cognome}
    </Link>
      <div style={{ textAlign: "left" }}>
      <div style={{ textAlign: "start" }}>{params.row.email}</div>
    </div>
    </div>
      ),
    },
    { field: "tipologia",      headerName: "Job Title",      width: 150, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipologia && params.row.tipologia.descrizione
          ? params.row.tipologia.descrizione
          : "N/A"}
      </div>
    ),
  }, 
    { field: "rating",        headerName: "Rating",         width: 100 }, //fino a 1.9 è rosso, da 2 a 3 giallo, sopra 3 è verde
    { field: "nrating",        headerName: "N. Rating",      width: 90  },
    { field: "owner",         headerName: "Owner",          width: 70, renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.owner && params.row.owner.descrizione
            ? params.row.owner.descrizione
            : "N/A"}
        </div>
      ),
    },
    {
      field: "stato",
      headerName: "Stato",
      width: 70,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "dataUltimoContatto",      headerName: "Contatto",       width: 100 },
    { field: "noteRal",       headerName: "Note/Ral",       width: 200,  renderCell: (params) => (
      <div>
        <NoteButton onClick={() => setIsNotesPopupOpen(true)} />

        <EuroButton onClick={() => setIsRalPopupOpen(true)}/>
      </div>
    ), },
    { field: "schedaITW",     headerName: "Scheda ITW",      width: 100, renderCell: (params) => ( <Link
      to={`/staffing/intervista/${params.row.id}`}
      // state = {{ recruitingData: params.row }}
      >
    <PersonInfoButton /> 
    </Link>
    ), },
    // { field: "associazioni",  headerName: "Associazioni",    width: 110, renderCell: (params) => ( <BagButton to={`/associazioni/${params.row.id}/${params.row.nome}`}/> ), },
    { field: "azioni",        headerName: "Azioni",          width: 200, renderCell: (params) => (
      <div>
        <ClipButton to={`/associazioni/${params.row.id}/${params.row.nome}`}/>
        <DeleteButton onClick={handleDelete} id={params.row.id}/>
      </div>
    ), },
  ];


  const handleSearch = (filteredData) => {
    setFilteredRecruiting(filteredData);
  };


  const handleReset = async () => {
    setSearchText(""); // Resetta il testo di ricerca
    
    // Opzionale: Riesegui il fetch dei dati invece di usare quelli memorizzati
    try {
        const response = await axios.get("http://localhost:8080/staffing/react");
        if (Array.isArray(response.data)) {
            dispatch(setOriginalRecruiting(response.data));
            dispatch(setFilteredRecruiting(response.data));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
    }
};



 return (
  <div className="container">
    <div className="content">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="container">
        <div className="page-name">Gestione staffing</div>
        <MyButton onClick={navigateToAggiungiCandidato}>Aggiungi Candidato</MyButton>
        <RecruitingSearchBox data={recruiting} onSearch={handleSearch} onReset={handleReset} onSearchTextChange={(text) => setSearchText(text)} OriginalRecruiting={originalRecruiting} />
        <MyDataGrid data={filteredRecruiting} columns={columns} title="Candidati" getRowId={(row) => row.id} />
        <Modal
  isOpen={isNotesPopupOpen}
  onRequestClose={() => setIsNotesPopupOpen(false)}
  style={{
    content: {
      width: '400px',
      height: '400px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      position: 'relative', 
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  }}
>
  <h2>Note</h2>
  <div>{selectedCandidateNotes}</div>
  <Button
    color="primary"
    onClick={() => setIsNotesPopupOpen(false)}
    sx={{
      position: 'absolute', 
      bottom: '10px',       
      right: '10px',        
      backgroundColor: "#6C757D",
      color: "white",
      "&:hover": {
        backgroundColor: "#6C757D",
        transform: "scale(1.05)",
      },
    }}
  >
    Indietro
  </Button>
</Modal>
<Modal
  isOpen={isRalPopupOpen}
  onRequestClose={() => setIsRalPopupOpen(false)}
  style={{
    content: {
      width: '400px',
      height: '400px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      position: 'relative', 
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  }}
>
  <h2>Ral</h2>
  <div>{selectedCandidateNotes}</div>
  <Button
    color="primary"
    onClick={() => setIsRalPopupOpen(false)}
    sx={{
      position: 'absolute', 
      bottom: '10px',       
      right: '10px',        
      backgroundColor: "#6C757D",
      color: "white",
      "&:hover": {
        backgroundColor: "#6C757D",
        transform: "scale(1.05)",
      },
    }}
  >
    Indietro
  </Button>
</Modal>


      </div>
    </div>
  </div>
);

};

export default Recruiting;
