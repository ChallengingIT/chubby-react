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
  Box,
  Typography
} from '@mui/material';


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

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const handleCloseNotesModal = () => {
      setIsNotesPopupOpen(false);
    };


  const fetchData = async () => {
    try {

      const response = await axios.get("http://89.46.196.60:8443/hr/react/modificato", { headers: headers });

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
      const response = await axios.delete(`http://89.46.196.60:8443/hr/react/staff/elimina/${deleteId}`, { headers: headers});
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };

  const columns = [
    // { field: "id",        headerName: "ID",         width: 70  },
    { field: "nome",      headerName: "Nome",       flex: 1 },
    { field: "cognome",   headerName: "Cognome",    flex: 1 },
    { field: "email",     headerName: "Email",      flex: 1.2 },
    { field: "note",      headerName: "Note",       flex: 0.5, renderCell: (params) => (
                                                                                          <div>
                                                                                            <NoteButton onClick={() => {
                                                                                              setIsNotesPopupOpen(true);
                                                                                              setSelectedCandidateNotes(params.row.note);
                                                                                            }} />
                                                                                            </div>
                                                                                            ),
                                                                                          },
    { field: "timesheet", headerName: "Timesheet",  flex: 0.5, renderCell: (params) => (
                                                                                            <div>
                                                                                              <Link
                                                                                              to={`/hr/staff/timesheet/${params.row.id}`}
                                                                                              state={{ dipendentiData: params.row}}
                                                                                              >
                                                                                                <TimesheetButton />
                                                                                                </Link>
                                                                                            </div> 
                                                                                            ), },
    { field: "azioni",    headerName: "Azioni",     flex: 1, renderCell: (params) => (
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
  
  const handleSearch = (filteredData) => {
    setFilteredHr(filteredData);
  };


  const handleReset = () => {
    setSearchText(""); 
    fetchData();
  };


  const handleInviaSollecito = async () => {
    try {
      const response = await axios.post("http://89.46.196.60:8443/hr/react/staff/sollecito", { headers: headers });
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  }


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>HR Managing</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '40px', margin: '0 30px' }}>
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
            </Box>
            <Box sx={{ height: '90%', marginTop: '40px', width: '100%'}}>
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
                      OriginalHr={originalHr}
                  />
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
            </Box>
                    </Box>
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
                            backgroundColor: "#14D928",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "#14D928",
                              color: "black",
                              transform: "scale(1.05)",
                            },
                          }}>
                  Conferma
                </Button>
              </DialogActions>
            </Dialog>
      </Box>
  );
};

export default HR;
