import React, { useEffect, useState}        from "react";
import { useNavigate }                      from "react-router-dom";
import axios                                from "axios";
import { Link }                             from "react-router-dom";
import Sidebar                              from "../components/Sidebar";
import Button                               from "@mui/material/Button";
import MyDataGrid                           from "../components/MyDataGrid";
import AddIcon                              from "@mui/icons-material/Add";
import HRSearchBox                          from "../components/searchBox/HRSearchBox";
import NoteButton                           from "../components/button/NoteButton";
import TimesheetButton                      from "../components/button/TimesheetButton";
import VisibilityButton                     from "../components/button/VisibilityButton";
import EditButton                           from "../components/button/EditButton";
import DeleteButton                         from "../components/button/DeleteButton";
import Modal                                from 'react-modal';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import "../styles/HR.css";






const HR = () => {
  const navigate = useNavigate();

const [ hr,                               setHr                           ] = useState([]);
const [ originalHr,                       setOriginalHr                   ] = useState([]);
const [ filteredHr,                       setFilteredHr                   ] = useState([]);
const [ searchText,                       setSearchText                   ] = useState("");
const [ isNotesPopupOpen,                 setIsNotesPopupOpen             ] = useState(false);
const [ selectedCandidateNotes,           setSelectedCandidateNotes       ] = useState("");
const [ openDialog,                       setOpenDialog                   ] = useState(false);
const [ deleteId,                         setDeleteId                     ] = useState(null);





   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };



  const handleCloseNotesModal = () => {
    setIsNotesPopupOpen(false);
  };


  const fetchData = async () => {
    try {
      // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };

      const response = await axios.get("http://localhost:8080/hr/react/modificato", { headers: headers });
      if (Array.isArray(response.data)) {
        const hrConId = response.data.map((hr) => ({ ...hr }));
        setOriginalHr(hrConId);
        setFilteredHr(hrConId);

        
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

const openDeleteDialog = (id) => {
  setDeleteId(id);
  setOpenDialog(true);
};


  const navigateToAggiungiUser = () => {
    navigate("/hr/crea/utente");
  };

  const navigateToAggiungiDipendente = () => {
    navigate("/hr/staff/aggiungi");
  };

  const navigateToEstraiReport = () => {
    navigate("/hr/report");
  };



  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/hr/react/staff/elimina/${deleteId}`, { headers: headers});

      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };

  const columns = [
    // { field: "id",        headerName: "ID",         width: 70  },
    { field: "nome",      headerName: "Nome",       width: 150 },
    { field: "cognome",   headerName: "Cognome",    width: 150 },
    { field: "email",     headerName: "Email",      width: 250 },
    { field: "note",      headerName: "Note",       width: 180, renderCell: (params) => (
      <div>
        <NoteButton onClick={() => {
          setIsNotesPopupOpen(true);
          setSelectedCandidateNotes(params.row.note);
        }} />
        </div>
    ),
      },
    { field: "timesheet", headerName: "Timesheet",  width: 180, renderCell: (params) => (
      <div>
        <Link
        to={`/hr/staff/timesheet/${params.row.id}`}
        state={{ dipendentiData: params.row}}
        >
          <TimesheetButton />
          </Link>
      </div> 
       ), },
    { field: "azioni",    headerName: "Azioni",     width: 700, renderCell: (params) => (
      <div>
        <Link
        to={`/hr/staff/visualizza/${params.row.id}`}
        state={{ dipendentiData: params.row}}
        >
        <VisibilityButton />
        </Link>
        <Link
        to={`/hr/staff/modifica/${params.row.id}`}
        state={{ dipendentiData: params.row}}
        >
        <EditButton  />
        </Link>
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
      </div>
    ), },
  ];


  // const handleSearch = (text) => {
  //   setSearchText(text);
  
  //   const filtered = originalHr.filter((item) =>
  //     Object.values(item).some(
  //       (value) =>
  //         value && value.toString().toLowerCase().includes(text.toLowerCase())
  //     )
  //   );
  
  //   setFilteredHr(filtered);
  // };
  
  const handleSearch = (filteredData) => {
    setFilteredHr(filteredData);
  };


  const handleReset = () => {
    setSearchText(""); 
    // fetchData();
    setFilteredHr(originalHr);
  };


  const handleInviaSollecito = async () => {
    try {
      // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };

      const response = await axios.post("http://localhost:8080/hr/react/staff/sollecito", { headers: headers });
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  }


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">HR Managing</div>
      
          <div className="row-container1">
            <Button
                className="button-add"
                variant="contained"
                size="medium"
                startIcon={<AddIcon />}
                onClick={navigateToAggiungiDipendente}
                sx={{
                width: "100%",
                height: "35px",
                maxWidth: "210px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.6rem",
                fontWeight: "bolder",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "flex-start",
                "&:hover": {
                  backgroundColor: "#ffb800",
                  transform: "scale(1.05)",
                  color: 'black',
                },
              }}
            >
              Aggiungi Dipendente
            </Button>
            <Button
            onClick={navigateToEstraiReport}
                className="button-add"
                variant="contained"
                size="medium"
                sx={{
                width: "100%",
                height: "35px",
                maxWidth: "210px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.6rem",
                fontWeight: "bolder",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "flex-start",
                "&:hover": {
                  backgroundColor: "#ffb800",
                  transform: "scale(1.05)",
                  color: 'black',
                },
              }}
            >
              Estrai report
            </Button>
            <Button
                onClick={handleInviaSollecito}
                className="button-add"
                variant="contained"
                size="medium"
                sx={{
                width: "100%",
                height: "35px",
                maxWidth: "210px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.6rem",
                fontWeight: "bolder",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "flex-start",
                "&:hover": {
                  color: 'black',
                  backgroundColor: "#ffb800",
                  transform: "scale(1.05)",
                },
              }}
            >
              Invia Sollecito
            </Button>
          </div>
         
          
            <MyDataGrid 
            data={filteredHr} 
            columns={columns} 
            title="Staff" 
            getRowId={(row) => row.id}
            searchBoxComponent={() => (
              <HRSearchBox data={hr}
          onSearch={handleSearch} 
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalHr={originalHr}/>

            )}
            />
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
  <div style={{ marginTop: "20px"}}>{selectedCandidateNotes}</div>
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
        </div>
      </div>
      <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  
>
  <DialogTitle id="alert-dialog-title">{"Conferma Eliminazione"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Sei sicuro di voler eliminare questa azienda?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary" style={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}>
      Annulla
    </Button>
    <Button onClick={handleDelete} color="primary" variant="contained" type="submit"
              style={{
                backgroundColor: "#fbb800",
                color: "black",
                "&:hover": {
                  backgroundColor: "#fbb800",
                  color: "black",
                  transform: "scale(1.05)",
                },
              }}>
      Conferma
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default HR;
