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
  Button,
  Box,
  Typography
} from '@mui/material';


const Fornitori = () => {

  const navigate = useNavigate();

  const [ fornitori,              setFornitori                        ] = useState([]);
  const [ originalFornitori,      setOriginalFornitori                ] = useState([]);
  const [ searchText,             setSearchText                       ] = useState("");
  const [ filteredFornitori,      setFilteredFornitori                ] = useState([]);
  const [ openDialog,             setOpenDialog                       ] = useState(false);
  const [ deleteId,               setDeleteId                         ] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  const fetchData = async () => {
    try {

      const response = await axios.get("http://89.46.196.60:8443/fornitori/react", { headers: headers});

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

      const response = await axios.delete(`http://89.46.196.60:8443/fornitori/react/elimina/${deleteId}`, { headers: headers});

      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const columns = [
    // { field: "id",              headerName: "ID",               width: 70  },
    { field: "denominazione",   headerName: "Ragione Sociale",  flex: 1 },
    { field: "email",           headerName: "Email",            flex: 2 },
    { field: "referente",       headerName: "Referente",        flex: 1 },
    { field: "cellulare",       headerName: "Cellulare",        flex: 1 },
    { field: "azioni",          headerName: "Azioni",           flex: 1,  renderCell: (params) => (
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
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Fornitori</Typography>
          <MyButton onClick={navigateToAggiungiFornitori}>Gestione Fornitori</MyButton>
          <Box sx={{ height: '100%', marginTop: '40px', width: '100%'}}>
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
                OriginalFornitori={originalFornitori}
                />
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

export default Fornitori;
