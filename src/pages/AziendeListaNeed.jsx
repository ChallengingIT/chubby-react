import React, { useEffect, useState}              from 'react'
import { useParams }                              from 'react-router-dom';
import { Link, useNavigate, useLocation}          from "react-router-dom";
import EditButton from '../components/button/EditButton.jsx';
import DeleteButton from '../components/button/DeleteButton.jsx';
import axios                                      from 'axios';
import ListaNeedSearchBox from '../components/searchBox/ListaNeedSearchBox.jsx';
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
import AddIcon from "@mui/icons-material/Add";
import Tabella from '../components/Tabella.jsx';

function AziendeListaNeed() {
  const navigate              = useNavigate();
  const params                = useParams();
  const location              = useLocation();
  const { id }                = params;
  const valori                = location.state;


  const idAzienda             = valori.id;


 


  const [ need,               setNeed               ] = useState([]);
  const [ searchText,         setSearchText         ] = useState("");
  const [ originalListaNeed,  setOriginalListaNeed  ] = useState([]);
  const [ filteredListaNeed,  setFilteredListaNeed  ] = useState([]);
  const [ openDialog,         setOpenDialog         ] = useState(false);
  const [ deleteId,           setDeleteId           ] = useState(null);


  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://89.46.67.198:8443/need/react/cliente/modificato/${id}`, { headers: headers });;
      if (Array.isArray(response.data)) {
        const needConId = response.data.map((need) => ({ ...need }));
        setNeed(needConId);
        setFilteredListaNeed(needConId);
        setOriginalListaNeed(needConId);
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

  const handleGoBack = () => {
    window.history.back(); 
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const navigateToAggiungiNeedID = () => {
    navigate(`/need/aggiungi/${id}/${valori.denominazione}`);
  };

  const handleSearch = (filteredData) => {
    setNeed(filteredData);
  };

  const handleReset = () => {
    setSearchText(""); 
    setNeed(originalListaNeed);
    // fetchData();
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://89.46.67.198:8443/need/react/elimina/${deleteId}`);
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };


  const columns = [
    { field: "id" ,              headerName: "#",      flex: 1},
    { field: "week",             headerName: "Week",    flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "left" }}>
      <div style={{ textAlign: "start" }}>{params.row.week}</div>
    </div>
      ),
    },
    { field: "descrizione",       headerName: "Descrizione",         flex: 1 },
    { field: "priorita",          headerName: "Priorità",            flex: 1 },
    {
      field: "tipologia",
      headerName: "Tipologia",
      flex: 1,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.tipologia && params.row.tipologia.descrizione
            ? params.row.tipologia.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "owner",             headerName: "Owner",              flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.owner && params.row.owner.descrizione
          ? params.row.owner.descrizione
          : "N/A"}
      </div>
    ),  },
    { field: "numeroRisorse",         headerName: "Headcount",           flex: 1 },
    {
      field: "stato",
      headerName: "Stato",
      flex: 1,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "azioni",            headerName: "Azioni",              flex: 0.7,  renderCell: (params) => (
      <div>
        {/* <Link
        to={`/need/modifica/${params.row.id}`}
        state={{ needData: params.row }}
        >
        <EditButton  />
        </Link> */}
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
      </div>
    ), },
  ]

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
          <Box sx={{ flexGrow: 1, p: 3, marginLeft: '10.2em', marginTop: '0.5em', marginBottom: '0.8em', marginRight: '0.8em', backgroundColor: '#EEEDEE', borderRadius: '10px', width: '88vw' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2, width: '88vw', mr: 5}}>
          <Typography variant="h4" component="h1" sx={{ ml: 5, fontWeight: 'bold', fontSize: '1.8rem', color: '#00853C'}}>Visualizzazione di {valori.denominazione}</Typography>

      {/* <Link
                  to={`/need/aggiungi/${id}`}
                  state={{ valori: valori }}
                  >
          <Button 
          startIcon={<AddIcon />}
          sx={{
            width: "100%",
            maxWidth: "16em",
            height: '3em',
            backgroundColor: "black",
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
              color: 'black',
            },
          }}>Aggiungi Need</Button>
          </Link> */}
          </Box>
   
                <Box sx={{ height: '90vh', marginTop: '20px', width: '85vw'}}>

                <Tabella 
                data={need} 
                columns={columns} 
                title={`Needs for ${valori.denominazione}`} 
                getRowId={(row) => row.id} 
                storageID={"ListaNeedPagination"}
                searchBoxComponent={() => (
                  <ListaNeedSearchBox 
                  data={need} 
                  onSearch={handleSearch} 
                  onReset={handleReset} 
                  onSearchTextChange={(text) => setSearchText(text)} 
                  OriginalListaNeed={originalListaNeed}
                  />
                )}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2%', marginTop: '2%'}}>

            <Button
          color="primary"
          onClick={handleGoBack}
          sx={{
            backgroundColor: "black",
            borderRadius: '40px',
            color: "white",
            width: '250px',
            height: '30px', 
            margin: 'auto',
            marginBottom: '20px',
            marginTop: 'auto',
            "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Indietro
        </Button>
        </Box>
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
                          backgroundColor: "#00853C",
                          color: "black",
                          "&:hover": {
                            backgroundColor: "#00853C",
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

export default AziendeListaNeed;





  