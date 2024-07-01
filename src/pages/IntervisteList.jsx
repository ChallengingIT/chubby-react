
//funzionante al 21 dicembre 2023 9:00

import React, { useEffect, useState}          from 'react'
import { Link, useParams }                    from 'react-router-dom';
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from 'axios';
import AddIcon                                from "@mui/icons-material/Add";
import Tabella                                from '../components/Tabella.jsx';
import DeleteButton                           from '../components/button/DeleteButton.jsx';
import EditButton                             from '../components/button/EditButton.jsx';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import SchemePage from '../components/SchemePage.jsx';

function IntervisteList() {

  const navigate                = useNavigate();
  const params                  = useParams();
  const { id }                  = params;
  const location                = useLocation();
  const { recruitingData = {} } = location.state || {};
  const candidatoID             = id;

  const [ originalInterviste,       setOriginalInterviste   ] = useState([]);
  const [ candidatoData,            setCandidatoData        ] = useState([]);
  const [ openDialog,               setOpenDialog           ] = useState(false);
  const [ deleteId,                 setDeleteId             ] = useState(null);
  const [ intervistaCaricata,       setIntervistaCaricata   ] = useState(false);
  const [ candidato,                setCandidato            ] = useState([]);


  //stati per la paginazione
  const [ righeTot,                 setRigheTot             ] = useState(0);
  const [ pagina,                   setPagina               ] = useState(0);
  const [ loading,                  setLoading              ] = useState(false);
  const quantita = 10;


    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
      Authorization: `Bearer ${token}`
    };

  const fetchData = async () => {
    setLoading(true);
    const paginazione = {
      pagina: 0,
      quantita: 10
    };

    try {
      const response                           = await axios.get(`http://localhost:8080/intervista/react/mod/${id}`       , { headers: headers, params: paginazione});  //queste sono le interviste effettive
      const responseCandidato                  = await axios.get(`http://localhost:8080/staffing/react/${candidatoID}`            , { headers: headers }); //questo è il candidato



      if (responseCandidato.data && typeof responseCandidato.data === 'object') {
        setCandidato(responseCandidato.data);
    }

      const { record, interviste } = response.data;
      if (interviste && Array.isArray(interviste)) {
        setOriginalInterviste(interviste);
        if (typeof record === 'number') {
          setRigheTot(record);
          setIntervistaCaricata(true);
        } else {
          console.error("Il numero di recordo ottenuto non è un numero: ", record);
        }
      } else {
        console.error("I dati non contengono interviste in formato array: ", response.data);
      }

      if (intervistaCaricata) {
      const filtriDaInviare = {
        nome:     recruitingData.nome,
        cognome:  recruitingData.cognome,
        email:    recruitingData.email,
        pagina: 0,
        quantita: 1
      }
      const responseCandidatoFiltrato          = await axios.get("http://localhost:8080/staffing/react/mod/ricerca",        { headers: headers, params: filtriDaInviare }); //questo è il candidato

      if (typeof responseCandidatoFiltrato.data === 'object') {
        setCandidatoData([responseCandidatoFiltrato.data]); 
      }
    }
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   //funzione per la paginazione
   const fetchMoreData = async (pagina) => {
    const paginazione = {
      pagina: pagina,
      quantita: 10
  };
  const filtriDaInviare = {
    nome:     recruitingData.nome,
    cognome:  recruitingData.cognome,
    email:    recruitingData.email,
    pagina: 0,
    quantita: 1
  }

    try{
      const responseIntervista                = await axios.get(`http://localhost:8080/intervista/react/mod/${id}`       , { headers: headers, params: paginazione});
      const responseCandidatoFiltrato          = await axios.get("http://localhost:8080/staffing/react/mod/ricerca", { headers: headers, params: filtriDaInviare });

      const { record, interviste } = responseIntervista.data;

      if (interviste && Array.isArray(interviste)) {
          setOriginalInterviste(interviste);
  
          if (typeof record === 'number') {
              setRigheTot(record);
          } else {
              console.error("Il numero di record ottenuto non è un numero: ", record);
          }
      } else {
          console.error("I dati ottenuti non contengono 'interviste' come array: ", responseIntervista.data);
      }
    } catch(error) {
    console.error("Errore durante il recupero dei dati: ", error);
    }
  };

  useEffect(() => {
  }, [candidatoData]); 

  const handleGoBack = () => {
    window.history.back();
    };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };


      //funzione per il cambio pagina
      const handlePageChange = (newPage) => {
        setPagina(newPage);
        fetchMoreData(newPage);
    };
  
  const navigateToAggiungiIntervista = () => {
    navigate("/intervista/aggiungi", { state: {  candidatoID  }});
  };

  const handleDelete = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:8080/intervista/react/elimina/${deleteId}`, { headers: headers});
        setOpenDialog(false);
        fetchData();
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'intervista:", error);
    }
  };


const candidatoNome    = candidatoData.length > 0 ? candidatoData[0].nome : '';
const candidatoCognome = candidatoData.length > 0 ? candidatoData[0].cognome : '';

  
const table1 = [
  // { field: "id", headerName: "Id", width: 70},
  { field: "stato",               headerName: "Stato",          flex: 1,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
      {params.row.stato?.descrizione || "N/A"}
      </div>
    ),
  },
  { field: "dataColloquio",       headerName: "Data Colloquio", flex: 1},
  { field: "candidato",           headerName: "Intervistatore", flex: 1,
renderCell: (params) => (
  <div style={{ textAlign: "start" }}>
        {params.row.owner?.descrizione || "N/A"}
      </div>
    ),
},
  { field: "dataAggiornamento",   headerName: "Follow Up",
  // : (
  //     <div style={{ lineHeight: '1' }}>
  //       Follow Up <br /> Data Aggiornamento
  //     </div>
  //   ),
    width: 350,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipo?.descrizione || "N/A"}
      </div>
    ),
  },
  
   //dataAggiornamento e follo up si chiama intervista.tipo.descrizione
  { field: "azioni",         headerName: "",          flex: 1, renderCell: (params) => (
    <div>
<Link
to={`/intervista/modifica/${params.row.id}`}
state={params.row}
>
<EditButton />
</Link>
      
<DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
    </div>
  ), },
];


  return (
    <SchemePage>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', mt: 5}}>
              <Button 
              variant="contained"
                onClick={handleGoBack}
                sx={{
                    minWidth: "12em",
                    backgroundColor: '#00B401',
                    color: 'white', 
                    border: 'none', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0.5rem 1rem', 
                    outline: 'none', 
                    textTransform: "none",
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#00B401',
                      color: 'white',
                      transform: 'scale(1.05)'
                    }
                }}
                >
                <span style={{ marginRight: '0.5rem' }}>{"<"}</span> 
                Indietro
                </Button>
                
                <Typography variant="h4" component="h1" sx={{  fontWeight: 'bold', fontSize: '1.4em', color: '#00B400'}}>Lista ITW di {candidato.nome} {candidato.cognome}</Typography>
                    <Button onClick={navigateToAggiungiIntervista}
                    startIcon={<AddIcon />}
                    variant='contained'
                    sx={{
                      minWidth: "12em",
                      backgroundColor: '#00B401',
                      color: 'white', 
                      border: 'none', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.5rem 1rem', 
                      outline: 'none', 
                      textTransform: "none",
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: '#00B401',
                        color: 'white',
                        transform: 'scale(1.05)'
                      }
                  }}
                    >Aggiungi Intervista</Button>
                    </Box>
                    <Box sx={{ mr: 0.2, mt: 2}}>

                    <Tabella
                        data={originalInterviste} 
                        columns={table1} 
                        title="Interviste" 
                        getRowId={(row) => row.id}
                        pagina={pagina}
                        quantita={quantita}
                        righeTot={righeTot}
                        onPageChange={handlePageChange}
                        />
                        
                    </Box>


                        <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        PaperProps={{
                          sx: {
                            borderRadius: '20px',
                          },
                        }}
                        
                    >
                        <DialogTitle id="alert-dialog-title">{"Conferma Eliminazione"}</DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Sei sicuro di voler eliminare questa intervista?
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 1}}>
                        <Button onClick={() => setOpenDialog(false)} color="primary" sx={{
                                    width: '8em',
                                    borderRadius: '10px',
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
                                    sx={{
                                    width: '8em',
                                    borderRadius: '10px',
                                    backgroundColor: "#00B401",
                                    color: "white",
                                    "&:hover": {
                                    backgroundColor: "#019301",
                                        color: "white",
                                        transform: "scale(1.05)",
                                    },
                                    }}>
                            Conferma
                        </Button>
                        </DialogActions>
                    </Dialog>
                    </SchemePage>
    );
};

export default IntervisteList;