import React, { useEffect, useState }         from "react";
import { useNavigate }                        from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../components/Sidebar";
import MyDataGrid                             from "../components/MyDataGrid";
import FornitoriSearchBox                     from "../components/searchBox/FornitoriSearchBox.jsx";
import MyButton                               from '../components/MyButton.jsx';
import EditButton                             from "../components/button/EditButton.jsx";
import DeleteButton                           from "../components/button/DeleteButton.jsx";
import { Link }                               from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

import "../styles/Fornitori.css";

const Fornitori = () => {
  const navigate = useNavigate();
  const [ fornitori,              setFornitori                        ] = useState([]);
  const [ originalFornitori,      setOriginalFornitori                ] = useState([]);
  const [ searchText,             setSearchText                       ] = useState("");
  const [ filteredFornitori,      setFilteredFornitori                ] = useState([]);
  const [ openDialog,             setOpenDialog                       ] = useState(false);
  const [ deleteId,               setDeleteId                         ] = useState(null);

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };


  

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/fornitori/react", { headers: headers});
        if (Array.isArray(response.data)) {
        const fornitoriConId = response.data.map((fornitori) => ({ ...fornitori}));
        setOriginalFornitori(fornitoriConId);
        setFilteredFornitori(fornitoriConId);
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

  

  const navigateToAggiungiFornitori = () => {
    navigate("/fornitori/aggiungi");
  };

  const handleDelete = async () => {
  
    try {
      const response = await axios.delete(`http://localhost:8080/fornitori/react/elimina/${deleteId}`, { headers: headers});

      setOpenDialog(false);

      fetchData();

    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const columns = [
    // { field: "id",              headerName: "ID",               width: 70  },
    { field: "denominazione",   headerName: "Ragione Sociale",  width: 150 },
    { field: "email",           headerName: "Email",            width: 250 },
    { field: "referente",       headerName: "Referente",        width: 200 },
    { field: "cellulare",       headerName: "Cellulare",        width: 100 },
    { field: "azioni",          headerName: "Azioni",           width: 615,  renderCell: (params) => (
      <div>
        <Link
        to={`/fornitori/modifica/${params.row.id}`}
        state={{ fornitoriData: params.row }}
>
        <EditButton  />
        </Link>
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
      </div>
    ), },
  ];


  const handleSearch = (filteredData) => {
    setFilteredFornitori(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    setFilteredFornitori(originalFornitori);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Fornitori</div>
          <MyButton onClick={navigateToAggiungiFornitori}>Gestione Fornitori</MyButton>
          
            <MyDataGrid 
            data={filteredFornitori} 
            columns={columns} 
            title="Fornitori" 
            getRowId={(row) => row.id}
            searchBoxComponent={() => (
              <FornitoriSearchBox
               data={fornitori}
          onSearch={handleSearch} 
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalFornitori={originalFornitori}/>

            )}
            />
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

export default Fornitori;
