//funzionante al 18 dicembre 2023 9:00


import React, { useEffect, useState} from 'react'
import MyButton from '../../components/MyButton';
import MyDataGrid from '../../components/MyDataGrid';
import { Button } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import { Link, useNavigate} from "react-router-dom";
import EditButton    from "../../components/button/EditButton.jsx";
import DeleteButton from '../../components/button/DeleteButton';
import axios from 'axios';
import NeedSearchBox from '../../components/searchBox/NeedSearchBox';

function ListaNeed() {
  const navigate = useNavigate();
  const params = useParams();
  const { id, nomeAzienda } = params;
  const [need, setNeed] = useState([]);
  const [searchText, setSearchText] = useState("");
  


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/need/react/cliente/${id}`);
      if (Array.isArray(response.data)) {
        const needConId = response.data.map((need) => ({ ...need }));
        setNeed(needConId);
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

  const handleSearch = (need) => {
    setNeed(need);
  };
  const handleReset = () => {
    setSearchText(""); 
    fetchData();
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
        <DeleteButton/>
        
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
        to={`/need/aggiungi/${id}/${nomeAzienda}`}
        state={{ needData: params.row }}
        >
                <MyButton>Aggiungi Need</MyButton>
                </Link>
                <NeedSearchBox data={need} onSearch={handleSearch} onReset={handleReset} onSearchTextChange={(text) => setSearchText(text)}/>
                <MyDataGrid data={need} columns={columns} title={`Needs for ${nomeAzienda}`} getRowId={(row) => row.id} />
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