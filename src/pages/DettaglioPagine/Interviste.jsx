
//funzionante al 21 dicembre 2023 9:00

import React, { useEffect, useState}          from 'react'
import MyDataGrid                             from '../../components/MyDataGrid';
import Sidebar                                from '../../components/Sidebar';
import { Link, useParams }                    from 'react-router-dom';
import { useNavigate, useLocation }           from "react-router-dom";
import DeleteButton                           from '../../components/button/DeleteButton';
import axios                                  from 'axios';
import EditButton                             from '../../components/button/EditButton.jsx';
import VisibilityButton                       from '../../components/button/VisibilityButton.jsx';
import IntervisteSearchBox                    from '../../components/searchBox/IntervisteSearchBox.jsx';
import MyButton                               from '../../components/MyButton.jsx';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

function Interviste() {
  const navigate                = useNavigate();
  const params                  = useParams();
  const { id }                  = params;
  const location                = useLocation();
  const { recruitingData = {} } = location.state || {};
  const candidatoID             = id;



  const [ interviste,               setInterviste           ] = useState([]);
  const [ searchText,               setSearchText           ] = useState("");
  const [ originalInterviste,       setOriginalInterviste   ] = useState([]);
  const [ filteredInterviste,       setFilteredInterviste   ] = useState([]);
  const [ candidatoData,            setCandidatoData        ] = useState([]);
  const [ openDialog,               setOpenDialog           ] = useState(false);
  const [ deleteId,                 setDeleteId             ] = useState(null);


   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };

  const fetchData = async () => {
    try {
      const response                = await axios.get(`http://89.46.67.198/intervista/react/${id}`       , { headers: headers});
      const candidatoResponse       = await axios.get(`http://89.46.67.198/staffing/react/${candidatoID}`, { headers: headers});

      if (typeof candidatoResponse.data === 'object') {
        setCandidatoData([candidatoResponse.data]); 
      }


      if (Array.isArray(response.data)) {
        const intervisteConId = response.data.map((interviste) => ({ ...interviste }));
        setOriginalInterviste(intervisteConId);
        setFilteredInterviste(intervisteConId);
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

  useEffect(() => {
  }, [candidatoData]); 

  const handleGoBack = () => {
navigate("/recruiting");
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };
  



  const navigateToAggiungiIntervista = () => {
    navigate("/intervista/aggiungi", { state: {  candidatoID  }});
  };



  const handleSearch = (filteredData) => {
    setFilteredInterviste(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    setFilteredInterviste(originalInterviste);
  };

  const handleDelete = async (id) => {
    try {

        const response = await axios.delete(`http://89.46.67.198/intervista/react/elimina/${deleteId}`, { headers: headers});
        setOpenDialog(false);

  
  
        fetchData();
      
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'intervista:", error);
    }
  };


const candidatoNome    = candidatoData.length > 0 ? candidatoData[0].nome : '';
const candidatoCognome = candidatoData.length > 0 ? candidatoData[0].cognome : '';




  const prepareDataForChild = (rowData) => {
    return {
      rowData,
      candidatoData,
    };
  };
  
const table1 = [
  // { field: "id", headerName: "Id", width: 70},
  { field: "stato",               headerName: "Stato",          width: 100,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione
          ? params.row.stato.descrizione
          : "N/A"}
      </div>
    ),
  },
  { field: "dataColloquio",       headerName: "Data Colloquio", width: 250},
  { field: "candidato",           headerName: "Intervistatore", width: 250,
renderCell: (params) => (
  <div style={{ textAlign: "start" }}>
        {params.row.candidato?.owner?.descrizione || "N/A"}
      </div>
    ),
},
  { field: "dataAggiornamento",   headerName: (
      <div style={{ lineHeight: '1' }}>
        Follow Up <br /> Data Aggiornamento
      </div>
    ),
    width: 350,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipo?.descrizione || "N/A"}
      </div>
    ),
  },
  
   //dataAggiornamento e follo up si chiama intervista.tipo.descrizione
  { field: "azioni",         headerName: "Azioni",          width: 800, renderCell: (params) => (
    <div>
      <Link
      to={`/intervista/visualizza/${params.row.id}`}
      state={params.row}
  
>
<VisibilityButton />
</Link>
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
        <div className="containerTitle">
        <h1>{`Lista ITW di ${candidatoNome} ${candidatoCognome}`}</h1>
                </div>
                <MyButton onClick={navigateToAggiungiIntervista}>Aggiungi Intervista</MyButton>
               
                <MyDataGrid 
                data={filteredInterviste} 
                columns={table1} 
                title="Interviste" 
                getRowId={(row) => row.id}
                searchBoxComponent={() => (
                  <IntervisteSearchBox data={interviste}
                  onSearch={handleSearch}
                  onReset={handleReset}
                  searchText={searchText}
                  onSearchTextChange={(text) => setSearchText(text)}
                  OriginalInterviste={originalInterviste}/>
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

export default Interviste;