import React, { useState, useEffect }       from "react";
import { useNavigate }                      from "react-router-dom";
import { Link }                             from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../components/Sidebar";
import MyDataGrid                           from "../components/MyDataGrid";
import MyButton                             from '../components/MyButton.jsx';
import EditButton                           from "../components/button/EditButton.jsx";
import DeleteButton                         from "../components/button/DeleteButton.jsx";
import ListButton                           from "../components/button/ListButton.jsx";
import SmileGreenIcon                       from "../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                      from "../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                         from "../components/button/SmileRedIcon.jsx";
import AziendeSearchBox                     from "../components/searchBox/AziendeSearchBox.jsx";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';


import "../styles/Aziende.css";


const Aziende = () => {

  const [ aziende,                    setAziende                ] = useState([]);
  const [ originalAziende,            setOriginalAziende        ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState("");
  const [ filteredAziende,            setFilteredAziende        ] = useState([]);
  const [ openDialog,                 setOpenDialog             ] = useState(false);
  const [ deleteId,                   setDeleteId               ] = useState(null);
  const [ content,                    setContent                ] = useState("");

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };





const fetchData = async () => {
  try {
    
    const response = await axios.get("http://localhost:8080/aziende/react", { headers: headers });
    if (Array.isArray(response.data)) {
      const aziendeConId = response.data.map((aziende) => ({ ...aziende }));

      // const aziendeConOwner = await translateOwnerNames(aziendeConId);
      setFilteredAziende(aziendeConId);
      setOriginalAziende(aziendeConId);
      console.log(aziendeConId);
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



  const navigate = useNavigate();

  const navigateToAggiungiAzienda = () => {
    navigate("/aziende/aggiungi");
  };

  // const navigateToDettaglioAzienda = ( id, nomeAzienda) => {
  //   navigate(`/aziende/dettaglio/${id}`);
  // };



  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/aziende/react/elimina/${id}`);
  //     // const updatedAziende = originalAziende.filter((azienda) => azienda.id !== id);
  //     // setAziende(updatedAziende);
  //     // setOriginalAziende(updatedAziende);
  //     // setFilteredAziende(updatedAziende);
  //     fetchData();
  //     console.log("ELIMINATA AZIENDA: ", id);
  //   } catch (error) {
  //     console.error("Errore durante la cancellazione:", error);
  //   }
  // };



// const handleDelete = async (id) => {
//   try {
// const response = await axios.delete(`http://localhost:8080/aziende/react/elimina/${id}`);
// console.log("Risposta dalla chiamata delete: ", response);
// console.log("ID AZIENDA ELIMINATA: ", id)
// fetchData();
//   } catch (error) {
//     console.error("Errore durante la cancellazione: ", error);
//   }
//   };


const handleDelete = async () => {
  try {
    const response = await axios.delete(`http://localhost:8080/aziende/react/elimina/${deleteId}`, { headers: headers});
    setOpenDialog(false);
    console.log("Risposta dalla chiamata delete: ", response);
    console.log("ID AZIENDA ELIMINATA: ", deleteId);
    
    fetchData();
  } catch (error) {
    console.error("Errore durante la cancellazione: ", error);
  }
};



  const getSmileIcon = (params) => {
    switch (params.row.status) {
      case 1:
        return <SmileGreenIcon />;
      case 2:
        return <SmileOrangeIcon />;
      case 3:
        return <SmileRedIcon />;
      default:
        return params.row.status;
    }
  };


  const columns = [
    // { field: "id",             headerName: "aziende.id",              width: 70  },
    { field: "status",         headerName: "Stato",            width: 100,  renderCell: (params) => getSmileIcon(params), },
    { field: "denominazione",  headerName: "Ragione Sociale", width: 250, renderCell: (params) => (
      <Link
          to={`/aziende/dettaglio/${params.row.id}`}
          state={{ aziendaData: { ...params.row
            // , descrizioneOwner: params.row.descrizioneOwner 
          } }}
        >
          {params.row.denominazione}
        </Link>
    ), },
    {
      field: "owner",
      headerName: "Owner",
      width: 150,
      valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A",
    },
    { field: "tipologia",      headerName: "Tipologia",       width: 200 },
    { field: "citta",          headerName: "Città",           width: 250 },
    { field: "paese",          headerName: "Paese",           width: 150 },
    { field: "need",           headerName: "Need",            width: 150, renderCell: (params) => ( 
    <div>
    <Link
  to={`/need/${params.row.id}`}
  state={{ aziendaData: { ...params.row} }}
>
  <ListButton />
</Link>
      </div> ),  },
    { field: "azioni",         headerName: "Azioni",          width: 360, renderCell: (params) => (
      <div>
<Link
  to={`/aziende/modifica/${params.row.id}`}
  state={{ aziendaData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner } }}
>
  <EditButton />
</Link>

        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />

      </div>
    ), },
  ];

  const handleSearch = (filteredData) => {
    setFilteredAziende(filteredData);
  };
  

  const handleReset = () => {
    setSearchText(""); 
    setFilteredAziende(originalAziende);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Aziende</div>
          <MyButton onClick={navigateToAggiungiAzienda}>Aggiungi Azienda</MyButton>
      {/* <AziendeSearchBox 
          data={aziende}
          onSearch={handleSearch}
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalAziende={originalAziende}/> */}

          <MyDataGrid 
          data={filteredAziende} 
          columns={columns} 
          title="Aziende" 
          getRowId={(row) => row.id}
            searchBoxComponent={() => (
              <AziendeSearchBox
              data={aziende}
                    onSearch={handleSearch}
                    onReset={handleReset}
                    searchText={searchText}
                    onSearchTextChange={(text) => setSearchText(text)}
                    OriginalAziende={originalAziende}/>
                    )} />
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

export default Aziende;


