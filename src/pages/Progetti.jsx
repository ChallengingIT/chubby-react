import React, { useState, useEffect} from "react";
import { useNavigate }               from "react-router-dom";
import axios                         from "axios";
import { Link }                      from "react-router-dom";
import Sidebar                       from "../components/Sidebar";
import MyDataGrid                    from "../components/MyDataGrid";
import ProgettiSearchBox             from "../components/searchBox/ProgettiSearchBox.jsx";
import MyButton                      from '../components/MyButton.jsx';
import EditButton                    from "../components/button/EditButton.jsx";
import DeleteButton                  from "../components/button/DeleteButton.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

import "../styles/Progetti.css";

const Progetti = () => {
  const [ progetti,                   setProgetti               ] = useState([]);
  const [ originalProgetti,           setOriginalProgetti       ] = useState([]);
  const [ filteredProgetti,           setFilteredProgetti       ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState([]);
  const [ deleteId,                   setDeleteId               ] = useState(null);
  const [ openDialog,                 setOpenDialog             ] = useState(false);
 

        

  const fetchData = async () => {
    try {
       // Recupera l'accessToken da localStorage
       const user = JSON.parse(localStorage.getItem("user"));
       const accessToken = user?.accessToken;
   
       // Configura gli headers della richiesta con l'Authorization token
       const headers = {
         Authorization: `Bearer ${accessToken}`
       };
 
      const response = await axios.get("https://localhost:8443/progetti/react", { headers: headers });
      if (Array.isArray(response.data)) {
      const progettiConId = response.data.map((progetti) => ({ ...progetti}));
      setOriginalProgetti(progettiConId);
      setFilteredProgetti(progettiConId);

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

  const navigateToAggiungiProgetti = () => {
    navigate("/progetti/aggiungi");
  };


  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`https://localhost:8443/progetti/react/elimina/${id}`);
  //     const updatedProgetti = originalProgetti.filter((progetti) => progetti.id !== id);
  //     setProgetti(updatedProgetti);
  //     setOriginalProgetti(updatedProgetti);

  //   } catch (error) {
  //     console.error("Errore durante la cancellazione:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
       // Recupera l'accessToken da localStorage
       const user = JSON.parse(localStorage.getItem("user"));
       const accessToken = user?.accessToken;
   
       // Configura gli headers della richiesta con l'Authorization token
       const headers = {
         Authorization: `Bearer ${accessToken}`
       };
      const response = await axios.delete(`https://localhost:8443/progetti/react/elimina/${deleteId}`, { headers: headers });

      setOpenDialog(false);

fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };



  const columns = [
    // { field: "id", headerName: "ID", width: 50 },
    {
      field: "cliente",
      headerName: "Cliente",
      width: 100,
      valueGetter: (params) =>
        (params.row.cliente && params.row.cliente.denominazione) || "N/A",
    },
    { field: "idStaff",                     headerName: "Consulente",               width: 200 },
    { field: "description",                 headerName: "Ruolo",                    width: 100 },
    { field: "inizio",                      headerName: "Inizio",                   width: 100 },
    { field: "scadenza",                    headerName: "Fine",                     width: 100 },
    { field: "rate",                        headerName: "Rate",                     width: 80  },
    { field: "costo",                       headerName: "Costo",                    width: 80  },
    { field: "margine",                     headerName: "Margine",                  width: 80  },
    { field: "marginePerc",                 headerName: "Margine%",                 width: 80  },
    { field: "durata",                      headerName: "Durata",                   width: 80  },
    { field: "durataStimata",               headerName: "D.Stimata",                width: 80  },
    { field: "durataEffettiva",             headerName: "D.Effettiva",              width: 80  },
    { field: "molTotale",                   headerName: "MOL Tot",                  width: 80  },
    { field: "valoreTotale",                headerName: "Valore Tot",               width: 80  },
    {
      field: "azioni",
      headerName: "Azioni",
      width: 200,
      renderCell: (params) => (
        <div>
          <Link
            to={`/progetti/modifica/${params.row.id}`}
            state={{ progettiData: params.row }}
          >
            <EditButton />
          </Link>
          <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
        </div>
      ),
    },
  ];


  const handleSearch = (filteredData) => {
    setFilteredProgetti(filteredData);
  };
  const handleReset = () => {
    setSearchText("");
    setFilteredProgetti(originalProgetti);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Progetti</div>
            <MyButton onClick={navigateToAggiungiProgetti}>Aggiungi Progetto</MyButton>
          {/* <div className="table-container"> */}
            <MyDataGrid 
            data={originalProgetti} 
            columns={columns} 
            title="Progetti" 
            getRowId={(row) => row.id}
            searchBoxComponent={() => (
              <ProgettiSearchBox 
              data={progetti} 
              onSearch={handleSearch} 
              onReset={handleReset} 
              OriginalProgetti={originalProgetti} 
              searchText={searchText} 
              onSearchTextChange={(text) => setSearchText(text)}/>

            )}
            />
          {/* </div> */}
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

export default Progetti;
