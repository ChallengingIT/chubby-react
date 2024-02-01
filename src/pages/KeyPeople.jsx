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
  Button
} from '@mui/material';


import "../styles/KeyPeople.css";
import KeyPeopleSearchBox from "../components/searchBox/KeyPeopleSearchBox.jsx";

const KeyPeople = () => {
  const navigate = useNavigate();
  const [ searchText,           setSearchText               ] = useState("");
  const [ keypeople,            setKeypeople                ] = useState([]);
  const [ originalKeypeople,    setOriginalKeypeople        ] = useState([]);
  const [ filteredKeypeople,    setFilteredKeypeople        ] = useState([]);
  const [ denominazioneAzienda, setDenominazioneAzienda     ] = useState("");
  const [ openDialog,           setOpenDialog               ] = useState(false);
  const [ deleteId,             setDeleteId                 ] = useState(null);


  
  const fetchData = async () => {
    try {
      // Recupera l'accessToken da localStorage
     const user = JSON.parse(localStorage.getItem("user"));
     const accessToken = user?.accessToken;
 
     // Configura gli headers della richiesta con l'Authorization token
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
      const response = await axios.get("https://89.46.67.198:8443/keypeople/react", { headers: headers});
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

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`https://89.46.67.198:8443/keypeople/react/elimina/${id}`);

  //     const updatedKeypeople = originalKeypeople.filter((keypeople) => keypeople.id !== id);
  //     setKeypeople(updatedKeypeople);
  //     setOriginalKeypeople(updatedKeypeople);
  //     setFilteredKeypeople(updatedKeypeople);
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
      const response = await axios.delete(`https://89.46.67.198:8443/keypeople/react/elimina/${deleteId}`, {headers: headers});
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
    { field: "status", headerName: "Stato", width: 100, renderCell: (params) => getSmileIcon(params) },
    {
      field: "nome",
      headerName: "Nome",
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ textAlign: "left" }}>
            <Link
              to={`/keyPeople/dettaglio/${params.row.id}`}
              state={{ keypeopleData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner, denominazioneAzienda: params.row.denominazioneAzienda } }}
            >
              {params.row.nome}
            </Link>
          </div>
        );
      },
    },
    { field: "email",              headerName: "Email", width: 300 },
    { field: "cellulare",          headerName: "Telefono", width: 150 },
    { field: "Owner",              headerName: "Proprietario",    width: 150,
    valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A",
},

{
  field: "cliente",
  headerName: "Azienda",
  width: 150,
  valueGetter: (params) => params.row.cliente && params.row.cliente.denominazione || "N/A",
  },
    { field: "ruolo", headerName: "Ruolo", width: 200 },
    {
      field: "azioni",
      headerName: "Azioni",
      width: 400,
      renderCell: (params) => (
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Contatti</div>
          <MyButton onClick={navigateToAggiungiContatto}>Aggiungi Contatto</MyButton>
          
          <MyDataGrid 
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

export default KeyPeople;
