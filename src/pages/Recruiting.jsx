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
import SearchIcon                                       from '@mui/icons-material/Search';
import CloseIcon                                        from '@mui/icons-material/Close';



import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Drawer,
  MenuItem,
  Select,
  Grid
} from '@mui/material';


const Recruiting = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [ originalRecruiting,     setOriginalRecruiting ] = useState([]);
  const [ filteredRecruiting,     setFilteredRecruiting ] = useState([]);
  const [ searchText,             setSearchText         ] = useState([]);
  const [ notePopup,              setNotePopup          ] = useState(false);
  const [ ralPopup,               setRalPopup           ] = useState(false);
  const [ openDialog,             setOpenDialog         ] = useState(false);
  const [ selectedNote,           setSelectedNote       ] = useState('');
  const [ selectedRal,            setSelectedRal        ] = useState('');
  const [ deleteId,               setDeleteId           ] = useState(null);
  const [ tipologiaOptions,           setTipologiaOptions     ] = useState([]);
  const [ tipoOptions,                setTipoOptions          ] = useState([]);
  const [ statoOptions,               setStatoOptions         ] = useState([]);
  const [ page,                   setPage               ] = useState(0);
  const [ openFiltri,                 setOpenFiltri           ] = useState(false);
  const [ loading,                    setLoading              ] = useState(false);
  const [ filtri,                     setFiltri               ] = useState({
    nome: '',
    cognome: '',
    tipologia: '',
    stato: '',
    tipo:''
});

  
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  const fetchData = async () => {
    setLoading(true);
    try {
        const response          = await axios.get("http://89.46.67.198:8443/staffing/react/mod",          { headers: headers });
        const responseTipologia = await axios.get("http://localhost:8080/aziende/react/tipologia",        { headers });
        const responseTipo      = await axios.get("http://localhost:8080/staffing/react/tipo",            { headers });
        const responseStato     = await axios.get("http://localhost:8080/staffing/react/stato/candidato", { headers });


        if (Array.isArray(responseStato.data)) {
            setStatoOptions(responseStato.data.map((stato, index) => ({ label: stato.descrizione, value: stato.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
        } 


        if (Array.isArray(responseTipologia.data)) {
            setTipologiaOptions(responseTipologia.data.map((tipologia, index) => ({ label: tipologia.descrizione, value: tipologia.id })));
    
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseTipologia.data);
        } 

        if (Array.isArray(responseTipo.data)) {
            setTipoOptions(responseTipo.data.map((tipo, index) => ({ label: tipo.descrizione, value: tipo.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseTipo.data);
        } 
        if (Array.isArray(response.data)) {
            const recruitingConId = response.data.map((recruiting) => ({...recruiting}));
            setOriginalRecruiting(recruitingConId);
        } else {
            console.error("I dati ottenuti non sono nel formato Array: ", response.data);
        }
        setLoading(false);
        } catch(error) {
        console.error("Errore durante il recupero dei dati: ", error);
        }
    };
    
    
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);


  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const navigateToAggiungi = () => {
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


  // const handleSearch = (filteredData) => {
  //   setFilteredRecruiting(filteredData)
  // };

  // const handleReset = () => {
  //   setSearchText('');
  //   fetchData();
  // };



  const handleFilterChange = (name) => (event) => {
    const newValue = event.target.value;
    setFiltri({ ...filtri, [name]: newValue });
    if (name === 'denominazione' && newValue === '') {
        fetchData();
    } else {
        handleRicerche();
    }
};


const handleRicerche = async () => {

    const filtriDaInviare = {
        nome: filtri.nome || null,
        cognome: filtri.cognome || null,
        email: null,
        tipologia: filtri.tipologia || null,
        tipo: filtri.tipo || null,
        stato: filtri.stato || null
    };


    setLoading(true);
 
    try {
        const response = await axios.get("http://localhost:8080/staffing/react/mod/ricerca", { headers: headers, params: filtriDaInviare });

        if (Array.isArray(response.data)) {
            setOriginalRecruiting(response.data);
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dati filtrati:", error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const { nome, cognome, ...otherFilters } = filtri;
    const filtriHasValues = Object.values(otherFilters).some(x => x !== '' && x != null);

    if (filtriHasValues) {
        handleRicerche();
    }
}, [filtri.tipologia, filtri.stato, filtri.tipo]);


const handleOpenFiltri = () => setOpenFiltri(true);
const handleCloseFiltri = () => setOpenFiltri(false);



const handleReset = () => {
    setFiltri({
        nome: '',
        cognome: '',
        tipo:'',
        tipologia:'',
        stato: ''
    });
    localStorage.removeItem("RicercheRecruiting");

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
              <Box sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 1000, 
                    backgroundColor: '#FEFCFD', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    borderRadius: '10px',  
                    marginBottom: '4rem'
                }}>
                    <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={navigateToAggiungi} 
                    sx={{
                        minWidth: '12em',
                        backgroundColor: '#00853C',
                        borderRadius: '10px',
                        textTransform: 'none',
                        '&:hover': {
                        backgroundColor: '#00853C',
                        transform: 'scale(1.05)',
                    },
                }}>
                    + Aggiungi Candidato
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Barra di ricerca */}
                        <TextField
                        id="search-bar"
                        variant="outlined"
                        placeholder="Nome"
                        size="small"
                        value={filtri.nome}
                        onChange={(event) => setFiltri({ ...filtri, nome: event.target.value })}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleRicerche();
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#00853C' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: '25em',
                            mb: 0.5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0px', 
                                '& fieldset': {
                                    borderColor: '#00853C', 
                                    borderRadius: '4px 0 0 4px', 
                                    // borderRight: 'none',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#00853C', 
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00853C', 
                                },
                            },
                        }}
                    />


                      <TextField
                    id="search-location"
                    variant="outlined"
                    placeholder="Cognome"
                    size="small"
                    value={filtri.cognome}
                    onChange={(event) => setFiltri({ ...filtri, cognome: event.target.value })}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleRicerche();
                        }
                    }}
                    sx={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        mb: 0.5,

                        '& .MuiOutlinedInput-root': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeft: 0,
                        borderColor: '#00853C',
                        '&:hover fieldset': {
                            borderColor: '#00853C', 
                        },
                        '&.Mui-focused': {
                            borderColor: '#00853C',
                        },
                        },
                        '& .MuiInputLabel-root': {
                        color: 'black', 
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00853C',
                        },
                        '& .MuiOutlinedInput-input': {
                        color: 'black', 
                        },
                        '& .MuiPlaceholder-root': {
                        color: 'black', 
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00853C', 
                        },
                    }}
                    />
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleOpenFiltri} sx={{
                    minWidth: '12em',
                    backgroundColor: '#00853C',
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': {
                    backgroundColor: '#00853C',
                    transform: 'scale(1.05)',
                    },
                }}>
                    Filtra per: 
                </Button>  
                    </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 , ml: -5}}>
                <Tabella
                  data={originalRecruiting} 
                  columns={columns} 
                  title="Candidati" 
                  getRowId={(row) => row.id}
                  storageID={"RecruitingPagination"}
                />
              </Box>


              <Drawer
                anchor='right'
                open={openFiltri}
                onClose={handleCloseFiltri}
                sx={{ '& .MuiDrawer-paper': { width: '250px' } }}
            >
                <Box
                    sx={{ width: 250, p: 2 }}
                    role="presentation"
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
                        Filtri
                    </Typography>
                    <IconButton
                        onClick={handleCloseFiltri}
                        sx={{ color: 'black', mb: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    </Box>
                </Box>

                <Grid container spacing={2} direction="column" sx={{ p: 2}}>
                    <Grid item>


                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="tipologia-label">Tipologia</InputLabel>
                        <Select
                            labelId="tipologia-label"
                            displayEmpty
                            value={filtri.tipologia || ''} 
                            onChange={handleFilterChange('tipologia')}
                            renderValue={(selected) => {
                                if (selected === '') {
                                    return <em></em>;
                                }
                                const selectedLabel = tipologiaOptions.find(option => option.value === selected)?.label;
                                return selectedLabel || selected;
                            }}
                        >
                            
                            {tipologiaOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="stato-label">Stato</InputLabel>
                        <Select
                            labelId="stato-label"
                            displayEmpty
                            value={filtri.stato || ''} 
                            onChange={handleFilterChange('stato')}
                            renderValue={(selected) => {
                                if (selected === '') {
                                    return <em></em>;
                                }
                                const selectedLabel = statoOptions.find(option => option.value === selected)?.label;
                                return selectedLabel || selected;
                            }}
                        >
                            
                            {statoOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            displayEmpty
                            value={filtri.tipo || ''} 
                            onChange={handleFilterChange('tipo')}
                            renderValue={(selected) => {
                                if (selected === '') {
                                    return <em></em>;
                                }
                                const selectedLabel = tipoOptions.find(option => option.value === selected)?.label;
                                return selectedLabel || selected;
                            }}
                        >
                            
                            {tipoOptions.map((option) => (
                            <MenuItem key={option.value} value={option.label}>
                                {option.label}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button 
                        onClick={handleReset}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'black',
                                color: 'white',
                                trasform: '1.05'
                            },
                        }}>
                            Reset
                        </Button>
                        </Box>
                    </Grid>
                </Grid>
                </Drawer>


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
