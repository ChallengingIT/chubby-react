import React, { useEffect, useState}              from 'react'
import MyButton                                   from '../../components/MyButton';
import MyDataGrid                                 from '../../components/MyDataGrid';
import Sidebar                                    from '../../components/Sidebar';
import { useParams }                              from 'react-router-dom';
import { Link, useNavigate, useLocation}          from "react-router-dom";
import EditButton                                 from "../../components/button/EditButton.jsx";
import DeleteButton                               from '../../components/button/DeleteButton';
import axios                                      from 'axios';
import ListaNeedSearchBox                         from '../../components/searchBox/ListaNeedSearchBox.jsx';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

function ListaNeed() {
  const navigate              = useNavigate();
  const params                = useParams();
  const location              = useLocation();
  const { id }                = params;
  const { aziendaData = {} }  = location.state;

  const nomeAzienda           = aziendaData.denominazione;
  const idAzienda             = aziendaData.id;


 


  const [ need,               setNeed               ] = useState([]);
  const [ searchText,         setSearchText         ] = useState("");
  const [ originalListaNeed,  setOriginalListaNeed  ] = useState([]);
  const [ filteredListaNeed,  setFilteredListaNeed  ] = useState([]);
  const [ openDialog,         setOpenDialog         ] = useState(false);
  const [ deleteId,           setDeleteId           ] = useState(null);


  // Recupera l'accessToken da localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  


  const fetchData = async () => {
    try {
      const response = await axios.get(`https://localhost:8443/need/react/cliente/${id}`, { headers: headers });;
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
    navigate(`/need/aggiungi/${id}/${nomeAzienda}`);
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
      const response = await axios.delete(`https://localhost:8443/need/react/elimina/${deleteId}`);
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };


  const columns = [
    { field: "id" , headerName: "#", width: 70},
    { field: "week",             headerName: "Week",    width: 200, renderCell: (params) => (
      <div style={{ textAlign: "left" }}>
      <div style={{ textAlign: "start" }}>{params.row.week}</div>

    </div>
      ),
    },
    { field: "descrizione",       headerName: "Descrizione",         width: 350 },
    { field: "priorita",          headerName: "Priorità",            width: 100 },
    {
      field: "tipologia",
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
    { field: "owner",             headerName: "Owner",               width: 70, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.owner && params.row.owner.descrizione
          ? params.row.owner.descrizione
          : "N/A"}
      </div>
    ),  },
    { field: "numeroRisorse",         headerName: "Headcount",           width: 100 },
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
    { field: "azioni",            headerName: "Azioni",              width: 500,  renderCell: (params) => (
      <div>
        <Link
        to={`/need/modifica/${params.row.id}`}
        state={{ needData: params.row }}
        >
        <EditButton  />
        </Link>
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
        
      </div>
    ), },
  ]

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
        <div className="containerTitle">
                    <h1>{`Visualizzazione ${nomeAzienda}`}</h1>
                </div>
                <Link
                  to={`/need/aggiungi/${id}`}
                  state={{ aziendaData: aziendaData }}
                  >
                <MyButton>Aggiungi Need</MyButton>
                </Link>
               

                <MyDataGrid 
                data={need} 
                columns={columns} 
                title={`Needs for ${nomeAzienda}`} 
                getRowId={(row) => row.id} 
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
    </div>
  );
};

export default ListaNeed;





  