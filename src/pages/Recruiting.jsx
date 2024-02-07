
//funzionante al 21 dicembre 2023 9:00

import React, { useEffect, useState }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../components/Sidebar";
import MyDataGrid                             from "../components/MyDataGrid";
import RecruitingSearchBox                    from "../components/searchBox/RecruitingSearchBox.jsx";
import MyButton                               from '../components/MyButton.jsx';
import NoteButton                             from "../components/button/NoteButton.jsx";
import EuroButton                             from "../components/button/EuroButton.jsx";
import PersonInfoButton                       from "../components/button/PersonInfoButton.jsx";
import BagButton                              from "../components/button/BagButton.jsx";
import DeleteButton                           from "../components/button/DeleteButton.jsx";
import ClipButton                             from "../components/button/ClipButton.jsx";
import Modal                                  from 'react-modal';
import { Button }                             from "@mui/material";
import { Link }                               from "react-router-dom";
import SmileGreenIcon                         from "../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                        from "../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                           from "../components/button/SmileRedIcon.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography
} from '@mui/material';




const Recruiting = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [ emailFromParams,                setEmailFromParams              ] = useState(location.state?.params?.email || "");
  const [ recruiting,                     setRecruiting                   ] = useState([]);
  const [ originalRecruiting,             setOriginalRecruiting           ] = useState([]);
  const [ filteredRecruiting,             setFilteredRecruiting           ] = useState([]);
  const [ searchText,                     setSearchText                   ] = useState("");
  const [ isNotesPopupOpen,               setIsNotesPopupOpen             ] = useState(false);
  const [ isRalPopupOpen,                 setIsRalPopupOpen               ] = useState(false);
  const [ selectedCandidateNotes,         setSelectedCandidateNotes       ] = useState("");
  const [ selectedCandidateRal,           setSelectedCandidateRal         ] = useState("");
  const [ openDialog,                     setOpenDialog                   ] = useState(false);
  const [ deleteId,                       setDeleteId                     ] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };


  useEffect(() => {
    if (emailFromParams) {
      setFilteredRecruiting(emailFromParams);
      handleSearch(emailFromParams); 
    }
  }, [emailFromParams]);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://89.46.196.60:8443/staffing/react/mod", { headers: headers });
        if (Array.isArray(response.data)) {
        const recruitingConId = response.data.map((recruiting) => ({ ...recruiting}));
        setOriginalRecruiting(recruitingConId);
        setFilteredRecruiting(recruitingConId);
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
  

  const navigateToAggiungiCandidato = () => {
    navigate("/recruiting/aggiungi");
  };

  const navigateToModificaStaffing = (nome) => {
    navigate(`/staffing/modifica/${nome}`);
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://89.46.196.60:8443/staffing/elimina/${deleteId}`, { headers: headers });
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const handleCloseNotesModal = () => {
    setIsNotesPopupOpen(false);
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
  
  const columns = [
    // { field: "id",            headerName: "ID",             width: 70  },
    { field: "nome",         headerName: "Nome",           flex: 1.3, renderCell: (params) => (
      <div style={{ textAlign: "left"  }}>
      <Link
      to={`/staffing/modifica/${params.row.id}`}
      state={{ recruitingData: params.row }}
    >
      {params.row.nome}<br />{params.row.cognome}
    </Link>
    </div>
      ),
    },
    { field: "email",          headerName: "Email",          flex: 2},
    { field: "tipologia",      headerName: "Job Title",      flex: 1.4, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipologia && params.row.tipologia.descrizione
          ? params.row.tipologia.descrizione
          : "N/A"}
      </div>
    ),
  }, 
    { field: "rating",        headerName: "Rating",         flex: 0.8, renderCell: (params) => getSmileIcon(params), }, //fino a 1.9 è rosso, da 2 a 3 giallo, sopra 3 è verde
    // { field: "nrating",       headerName: "N. Rating",      width: 90  },
    { field: "owner",         headerName: "Owner",         flex: 1, renderCell: (params) => (
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
      width: 150,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "dataUltimoContatto",      headerName: "Contatto",       flex: 1.4 },
    { field: "noteRal",                 headerName: "Note/Ral",       flex: 1.8,  renderCell: (params) => (
      <div>
        <NoteButton onClick={() => {
          setIsNotesPopupOpen(true);
          setSelectedCandidateNotes(params.row.note);
        }} />

        <EuroButton onClick={() => {
          setIsRalPopupOpen(true);
          setSelectedCandidateRal(params.row.ral)
        }}
        />
      </div>
    ), },
    { field: "schedaITW",     headerName: "Scheda ITW",      flex: 1, renderCell: (params) => ( <Link
      to={`/staffing/intervista/${params.row.id}`}
      state = {{ recruitingData: params.row.id}}
      >
    <PersonInfoButton /> 
    </Link>
    ), },
    // { field: "associazioni",  headerName: "Associazioni",    width: 110, renderCell: (params) => ( <BagButton to={`/associazioni/${params.row.id}/${params.row.nome}`}/> ), },
    { field: "azioni",        headerName: "Azioni",          flex: 1.5, renderCell: (params) => (
      <div>
      <ClipButton 
      onClick={handleDownloadCV} 
      idFile={params.row.files && params.row.files.length > 0 ? params.row.files[0].id : null} 
      fileDescrizione={params.row.files && params.row.files.length > 0 ? params.row.files[0].descrizione : null}
      />
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
      </div>
    ), },
  ];


  const handleSearch = (filteredData) => {
    setFilteredRecruiting(filteredData);
  };


  const handleReset = () => {
    setSearchText(""); 
    fetchData();
  };


  const handleDownloadCV = async (fileId, fileDescrizione) => {
    const url = `http://89.46.196.60:8443/files/react/download/file/${fileId}`;
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'blob', 
        headers: headers,
      });
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `${fileDescrizione}.pdf`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Si è verificato un errore durante il download del file:', error);
    }
  };


return (
  <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
        <Sidebar />
        <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Staffing</Typography>
        <MyButton onClick={navigateToAggiungiCandidato}>Aggiungi Candidato</MyButton>
        <Box sx={{ height: '100%', marginTop: '40px', width: '100%'}}>
        <MyDataGrid 
        data={filteredRecruiting} 
        columns={columns} 
        title="Candidati" 
        getRowId={(row) => row.id}
        searchBoxComponent={() => (
          <RecruitingSearchBox 
        data={recruiting} 
        onSearch={handleSearch} 
        onReset={handleReset} 
        onSearchTextChange={(text) => setSearchText(text)} 
        OriginalRecruiting={originalRecruiting}
        initialEmail={emailFromParams}
        />
        )}
        />
        </Box>
        </Box>
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
      <div style={{marginTop: "20px"}}>{selectedCandidateRal}</div>
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

export default Recruiting;
