import React, { useEffect, useState }                 from "react";
import { useNavigate }                                from "react-router-dom";
import { Link }                                       from "react-router-dom";
import axios                                          from "axios";
import Sidebar                                        from "../components/Sidebar";
import MyDataGrid                                     from "../components/MyDataGrid";
import MyButton                                       from '../components/MyButton.jsx';
import DeleteButton                                   from "../components/button/DeleteButton.jsx";
import EditButton                                     from "../components/button/EditButton.jsx";
import SmileGreenIcon                                 from "../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                                from "../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                                   from "../components/button/SmileRedIcon.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,

} from '@mui/material';


import KeyPeopleSearchBox from "../components/searchBox/KeyPeopleSearchBox.jsx";
import MyDataGridPerc from "../components/MyDataGridPerc.jsx";
import Sidebar2 from "../components/componentiBackup/Sidebar2.jsx";

const KeyPeople = () => {

  const navigate = useNavigate();

  const [ searchText,           setSearchText               ] = useState("");
  const [ keypeople,            setKeypeople                ] = useState([]);
  const [ originalKeypeople,    setOriginalKeypeople        ] = useState([]);
  const [ filteredKeypeople,    setFilteredKeypeople        ] = useState([]);
  const [ denominazioneAzienda, setDenominazioneAzienda     ] = useState("");
  const [ openDialog,           setOpenDialog               ] = useState(false);
  const [ deleteId,             setDeleteId                 ] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

  const fetchData = async () => {
    try {

      const response = await axios.get("http://89.46.196.60:8443/keypeople/react/mod", { headers: headers});

      if (Array.isArray(response.data)) {
      const keypeopleConId = response.data.map((keypeople) => ({ ...keypeople}));
      setOriginalKeypeople(keypeopleConId);
      setFilteredKeypeople(keypeopleConId);
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

  const navigateToAggiungiContatto = () => {
    navigate("/keyPeople/aggiungi");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://89.46.196.60:8443/keypeople/react/elimina/${deleteId}`, {headers: headers});
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };


  const getSmileIcon = (params) => {
    switch (params.row.status) {
      case "1":
        return <SmileGreenIcon />;
      case "2":
        return <SmileOrangeIcon />;
      case "3":
        return <SmileRedIcon />;
      default:
        return params.row.status;
    }
  };

  const columns = [
    { field: "status", headerName: "Stato", flex: 0.5, renderCell: (params) => getSmileIcon(params) },
    {
      field: "nome",   headerName: "Nome",  flex: 1, renderCell: (params) => {
        return (
          <div style={{ textAlign: "left" }}>
            <Link
              to={`/keyPeople/dettaglio/${params.row.id}`}
              state={{ keypeopleData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner, denominazioneAzienda: params.row.denominazioneAzienda } }}
            >
              {params.row.nome}
            </Link>
            {/* <div style={{ textAlign: "start" }}>{params.row.email}</div> */}
          </div>
        );
      },
    },
    { field: "email",              headerName: "Email",             flex: 1.5                },
    { field: "cellulare",          headerName: "Telefono",          flex: 1                },
    { field: "Owner",              headerName: "Proprietario",      flex: 1,
    valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A"        },

{
  field: "cliente",                headerName: "Azienda",            flex: 1,
  valueGetter: (params) => params.row.cliente && params.row.cliente.denominazione || "N/A"    },
    { field: "ruolo",             headerName: "Ruolo",               flex: 1 },
    { field: "azioni",            headerName: "Azioni",              flex: 0.5,  renderCell: (params) => (
        <div>
          <Link to={`/keyPeople/modifica/${params.row.id}`} state={{ keyPeopleData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner, denominazioneAzienda: params.row.denominazioneAzienda } }}>
  <EditButton />
</Link>
<DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
        </div>
      ),
    },
  ];

  const handleSearch = (filteredData) => {
    setFilteredKeypeople(filteredData);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredKeypeople(originalKeypeople);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100vh', width: '100vw', overflow: 'hidden'}}>
    <Sidebar2 />
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100vw'}}>
    <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Contatto</Typography>
    <MyButton onClick={navigateToAggiungiContatto}>Aggiungi Contatto</MyButton>
    <Box sx={{ height: '90vh', marginTop: '20px', width: '100vw'}}>
    <MyDataGridPerc
          data={filteredKeypeople} 
          columns={columns} 
          title="Key People" 
          getRowId={(row) => row.id}
          searchBoxComponent={() => (
          <KeyPeopleSearchBox
            data={keypeople}
            onSearch={handleSearch}
            onReset={handleReset}
            onSearchTextChange={(text) => setSearchText(text)}
            OriginalKeypeople={originalKeypeople}
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
        Sei sicuro di voler eliminare questo contatto?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button
        onClick={() => setOpenDialog(false)}
        color="primary"
        style={{
          backgroundColor: "black",
          color: "white",
          "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
          },
          }}
          >
        Annulla
        </Button>
        <Button onClick={handleDelete}
        color="primary"
        variant="contained"
        type="submit"
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

export default KeyPeople;
