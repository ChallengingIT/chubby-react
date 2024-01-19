import React, { useEffect, useState}              from 'react'
import MyButton                                   from '../../components/MyButton';
import MyDataGrid                                 from '../../components/MyDataGrid';
import { Button }                                 from '@mui/material';
import Sidebar                                    from '../../components/Sidebar';
import { useParams }                              from 'react-router-dom';
import { Link, useNavigate, useLocation}          from "react-router-dom";
import EditButton                                 from "../../components/button/EditButton.jsx";
import DeleteButton                               from '../../components/button/DeleteButton';
import axios                                      from 'axios';
import ListaNeedSearchBox                         from '../../components/searchBox/ListaNeedSearchBox.jsx';

function ListaNeed() {
  const navigate              = useNavigate();
  const params                = useParams();
  const location              = useLocation();
  const { id }                = params;
  const { aziendaData = {} }  = location.state;

  const nomeAzienda           = aziendaData.denominazione;
  const idAzienda             = aziendaData.id;

  console.log("ID: ", id);

 


  const [ need,               setNeed               ] = useState([]);
  const [ searchText,         setSearchText         ] = useState("");
  const [ originalListaNeed,  setOriginalListaNeed  ] = useState([]);
  const [ filteredListaNeed,  setFilteredListaNeed  ] = useState([]);
  
  console.log("ORIGINAL LISTA NEED: ", originalListaNeed);


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/need/react/cliente/${id}`);
      if (Array.isArray(response.data)) {
        const needConId = response.data.map((need) => ({ ...need }));
        setNeed(needConId);
        setFilteredListaNeed(needConId);
        setOriginalListaNeed(needConId);
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

  const handleGoBack = () => {
    window.history.back(); 
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
      const response = await axios.delete(`http://localhost:8080/need/react/elimina/${id}`);
      console.log("Risposta dalla chiamata delete: ", response);
      console.log("ID NEED ELIMINATO: ", id)
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione: ", error);
    }
  };


  const columns = [
    { field: "id" , headerName: "#", width: 70},
    { field: "weekDescrizione",  headerName: "Week/Descrizione",    width: 200, renderCell: (params) => (
      <div style={{ textAlign: "left" }}>
      <div style={{ textAlign: "start" }}>{params.row.week}</div>
      <div style={{ textAlign: "start" }}>{params.row.descrizione}</div>
    </div>
      ),
    },
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
        <DeleteButton onClick={handleDelete} id={params.row.id}/>
        
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
                  state={{ aziendeData: aziendaData }}
                  >
                <MyButton>Aggiungi Need</MyButton>
                </Link>
                <ListaNeedSearchBox 
                data={need} 
                onSearch={handleSearch} 
                onReset={handleReset} 
                onSearchTextChange={(text) => setSearchText(text)} 
                OriginalListaNeed={originalListaNeed}
                />

                <MyDataGrid 
                data={need} 
                columns={columns} 
                title={`Needs for ${nomeAzienda}`} 
                getRowId={(row) => row.id} 
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
    </div>
  );
};

export default ListaNeed;





  