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
  Button,
  Box,
  Typography
} from '@mui/material';
import MyDataGridPerc from "../components/MyDataGridPerc.jsx";
import Sidebar2 from "../components/componentiBackup/Sidebar2.jsx";


const Progetti = () => {

  const [ progetti,                   setProgetti               ] = useState([]);
  const [ originalProgetti,           setOriginalProgetti       ] = useState([]);
  const [ filteredProgetti,           setFilteredProgetti       ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState([]);
  const [ deleteId,                   setDeleteId               ] = useState(null);
  const [ openDialog,                 setOpenDialog             ] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://89.46.196.60:8443/progetti/react", { headers: headers });
      console.log("dati in arrivo: ", response.data);
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


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://89.46.196.60:8443/progetti/react/elimina/${deleteId}`, { headers: headers });
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };


  const columns = [
    // { field: "id", headerName: "ID", width: 50 },
    { field: "cliente",                     headerName: "Cliente",                 flex: 1,
      valueGetter: (params) =>
        (params.row.cliente && params.row.cliente.denominazione) || "N/A",
    },
    { field: "idStaff",                     headerName: "Consulente",               flex: 1.5, renderCell: (params) => (
      <div style={{ 
        textAlign: "left",
          maxWidth: 150,
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          overflow: 'auto',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5',
          }}>
            {params.row.nome}
            </div>
    )  },
    { field: "description",                 headerName: "Ruolo",                    flex: 1.5, renderCell: (params) => (
      <div style={{ 
        textAlign: "left",
          maxWidth: 120,
          whiteSpace: 'normal', 
          wordWrap: 'break-word',
          overflow: 'auto',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.5',
          }}>
            {params.row.description}
            </div>
    )  },
    { field: "inizio",                      headerName: "Inizio",                   flex: 1.5  },
    { field: "scadenza",                    headerName: "Fine",                     flex: 1.5  },
    { field: "rate",                        headerName: "Rate",                     flex: 1  },
    { field: "costo",                       headerName: "Costo",                    flex: 1  },
    { field: "margine",                     headerName: "Margine",                  flex: 1  },
    { field: "marginePerc",                 headerName: "Margine%",                 flex: 1  },
    { field: "durata",                      headerName: "Durata",                   flex: 1  },
    { field: "durataStimata",               headerName: "D.Stimata",                flex: 1 },
    { field: "durataEffettiva",             headerName: "D.Effettiva",              flex: 1 },
    { field: "molTotale",                   headerName: "MOL Tot",                  flex: 1 },
    { field: "valoreTotale",                headerName: "Valore Tot",               flex: 1 },
    { field: "azioni",                      headerName: "Azioni",                   flex: 1.4, renderCell: (params) => (
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100vh', width: '100vw', overflow: 'hidden',}}>
    <Sidebar2 />
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100vw'}}>
    <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.8rem'}}>Progetti</Typography>
            <MyButton onClick={navigateToAggiungiProgetti}>Aggiungi Progetto</MyButton>
            <Box sx={{ height: '90vh', marginTop: '20px', width: '100vw'}}>
            <MyDataGridPerc 
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
    </Box>
  );
};

export default Progetti;
