import React, { useEffect, useState }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import RecruitingSearchBox                    from "../components/searchBox/RecruitingSearchBox.jsx";
import NoteButton                             from "../components/button/NoteButton.jsx";
import EuroButton                             from "../components/button/EuroButton.jsx";
import PersonInfoButton                       from "../components/button/PersonInfoButton.jsx";
import DeleteButton                           from "../components/button/DeleteButton.jsx";
import ClipButton                             from "../components/button/ClipButton.jsx";
import { Link }                               from "react-router-dom";
import SmileGreenIcon                         from '../components/icone/SmileGreenIcon.jsx';
import SmileOrangeIcon                        from '../components/icone/SmileOrangeIcon.jsx';
import SmileRedIcon                           from '../components/icone/SmileRedIcon.jsx';
import Tabella                                from "../components/Tabella.jsx";
import AddIcon                                from "@mui/icons-material/Add";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Button
} from '@mui/material';


const Recruiting = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [ originlRecruiting,      setOriginalRecruiting ] = useState([]);
  const [ filteredRecruiting,     setFilteredRecruiting ] = useState([]);
  const [ searchText,             setSearchText         ] = useState([]);
  const [ notePopup,              setNotePopup          ] = useState(false);
  const [ ralPopup,               setRalPopup           ] = useState(false);
  const [ openDialog,             setOpenDialog         ] = useState(false);
  const [ selectedNote,           setSelectedNote       ] = useState('');
  const [ selectedRal,            setSelectedRal        ] = useState('');
  const [ deleteId,               setDeleteId           ] = useState(null);
  const [ page,                   setPage               ] = useState(0);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  const fetchData = async () => {
    try {
      const response = await axios.get("http://89.46.67.198:8443/staffing/react/mod", { headers: headers });
      if (Array.isArray(response.data)) {
        const recruitingConId = response.data.map((recruiting) => ({...recruiting}));
        setOriginalRecruiting(recruitingConId);
        setFilteredRecruiting(recruitingConId);
      } else {
        console.error("I dati ottenuti non sono nel formato Array: ", response.data);
      }
    } catch(error) {
      console.error("Errore durante il recupero dei dati: ", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const navigateToAggiungiCandidato = () => {
    navigate('/recruiting/aggiungi');
  };

  const navigateToModificaCandidato = (nome) => {
    navigate(`/recruiting/modifica/${nome}`);
  };

  const handleDelete = async () => {
    try {
      const responseDelete = await axios.delete(`http://89.46.67.198:8443/staffing/elimina/${deleteId}`, { headers: headers });
      setOpenDialog(false);
      fetchData();
    } catch(error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };

  const handleCloseNotesModal = () => {
    setNotePopup(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage); 
  };

  const getSmileIcon = (params) => {
    const rating = params.row.rating;
  
    if (rating <= 1) {
      return <SmileRedIcon />;
    } else if (rating >= 2 && rating < 3) {
      return <SmileOrangeIcon />;
    } else if (rating >= 3) {
      return <SmileGreenIcon />;
    } else {
      return rating; 
    }
  };


  const handleSearch = (filteredData) => {
    setFilteredRecruiting(filteredData)
  };

  const handleReset = () => {
    setSearchText('');
    fetchData();
  };

  const handleDownloadCV = async (fileId, fileDescrizione) => {
    const url = `http://89.46.67.198:8443/files/react/download/file/${fileId}`;
    try {
      const responseDownloadCV = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob',
        headers: headers
      });
      const fileURL = window.URL.createObjectURL(new Blob([responseDownloadCV.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `${fileDescrizione}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(error) {
      console.error("Si è verificato un errore durante il download del file: ", error);
    }
  };

  const columns = [
    { field: 'nome',        headerName: 'Nome',         flex: 1.3, renderCell: (params) => (
      <Box sx={{ textAlign: 'left' }}>
        <Link
      to={`/recruiting/modifica/${params.row.id}`}
      state={{ recruitingData: params.row }}
      >
        {params.row.nome}<br />{params.row.cognome}
      </Link>
      </Box>
    )},
    { field: 'email',       headerName: 'Email',      flex: 2 },
    { field: 'tipologia',   headerName: 'Tipologia',  flex: 1.4, renderCell: (params) => (
      <Box sx={{ textAlign: 'left' }}>
        {params.row.tipologia && params.row.tipologia.descrizione ? params.row.tipologia.descrizione : 'N/A' }
      </Box>
    )},
    { field: 'rating',      headerName: 'Rating',     flex: 0.6, renderCell: (params) => getSmileIcon(params) },
    { field: 'owner',       headerName: 'Owner',      flex: 0.6, renderCell: (params) => (
      <Box sx={{ textAlign: 'left' }}>
        {params.row.owner && params.row.owner.descrizione ? params.row.owner.descrizione : 'N/A'}
      </Box>
    )},
    { field: 'stato',       headerName: 'Stato',      flex: 0.6, renderCell: (params) => (
      <Box sx={{ textAlign: 'left' }}>
        {params.row.stato && params.row.stato.descrizione ? params.row.stato.descrizione : 'N/A'}
      </Box>
    )},
    { field: 'dataUltimoContatto',    headerName: 'Contatto',     flex: 1 },
    { field: 'noteRal',               headerName: 'Note/Ral',     flex: 0.8, renderCell: (params) => (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <NoteButton onClick={() => {
          setNotePopup(true);
          setSelectedNote(params.row.note);
        }} />
        <EuroButton onClick={() => {
          setRalPopup(true);
          setSelectedRal(params.row.ral);
        }} />
      </Box>
    )},
    { field: 'schedaITW',             headerName: 'Scheda ITW',    flex: 0.8, renderCell: (params) => (
      <Link
      to={`/recruiting/intervista/${params.row.id}`}
      state = {{ recruitingData: params.row.id}}
      >
        <PersonInfoButton />
      </Link>
    )},
    { field: 'azioni',                headerName: 'Azioni',       flex: 1, renderCell: (params) => (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <ClipButton
        onClick={handleDownloadCV}
        idFile={params.row.files && params.row.files.length > 0 ? params.row.fils[0].id : null }
        fileDescrizione={params.row.files && params.row.files.length > 0 ? params.row.files[0].descrizione : null }
        />
        <DeleteButton 
        onClick={() => openDeleteDialog(params.row.id )}
        />
      </Box>
    )}
  ];


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
      <Box sx={{ 
                flexGrow: 1, 
                p: 3, 
                marginLeft: '13.2em', 
                marginTop: '0.5em', 
                marginBottom: '0.8em', 
                marginRight: '0.8em', 
                backgroundColor: '#FEFCFD', 
                borderRadius: '10px', 
                minHeight: '98vh',
                mt: 1.5
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Typography variant="h4" component="h1" sx={{  fontWeight: 'bold', fontSize: '1.4em'}}>Gestione Staffing</Typography>
                  <Button onClick={navigateToAggiungiCandidato}
                      startIcon={<AddIcon />}
                      sx={{
                        width: "100%",
                        maxWidth: "16em",
                        height: '3em',
                        backgroundColor: "#00853C",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: "bolder",
                        
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign:'center',
                  
                        "&:hover": {
                          backgroundColor: "#00853C",
                          transform: "scale(1.05)",
                          color: 'white',
                        },
                      }}
                      >
                        Aggiungi Candidato
                    </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 , ml: -5}}>
                <Tabella
                  data={filteredRecruiting} 
                  columns={columns} 
                  title="Candidati" 
                  getRowId={(row) => row.id}
                  storageID={"RecruitingPagination"}
                  searchBoxComponent={() => (
                    <RecruitingSearchBox 
                  data={filteredRecruiting} 
                  onSearch={handleSearch} 
                  onReset={handleReset} 
                  onSearchTextChange={(text) => setSearchText(text)} 
                  />
                  )}
                />
              </Box>


              {notePopup && (
                <Dialog open={notePopup} onClose={handleCloseNotesModal} sx={{ '& .MuiDialog-paper': { width: '400px', height: 'auto' } }}>
                  <DialogTitle>Note</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedNote}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseNotesModal}>Chiudi</Button>
                  </DialogActions>
                </Dialog>
              )}

              {ralPopup && (
                <Dialog open={ralPopup} onClose={() => setRalPopup(false)} sx={{ '& .MuiDialog-paper': { width: '400px', height: 'auto' } }}>
                  <DialogTitle>RAL</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {selectedRal}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRalPopup(false)}>Chiudi</Button>
                  </DialogActions>
                </Dialog>
              )}


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
                                  backgroundColor: "#00853C",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#00853C",
                                    color: "white",
                                    transform: "scale(1.05)",
                                  },
                                }}>
                        Conferma
                      </Button>
                    </DialogActions>
                  </Dialog>


            


      </Box>
    </Box>
  );


};

export default Recruiting;
