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
  Button,
  Box,
  Typography
} from '@mui/material';
import { set } from "date-fns";
import Sidebar2 from "../components/componentiBackup/Sidebar2.jsx";

const Aziende = () => {


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarWidth = isSidebarOpen ? "13.5vw" : "3.5vw";
  const contentWidth = `calc(100vw - ${sidebarWidth})`;


  const [ aziende,                    setAziende                ] = useState([]);
  const [ originalAziende,            setOriginalAziende        ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState("");
  const [ filteredAziende,            setFilteredAziende        ] = useState([]);
  const [ openDialog,                 setOpenDialog             ] = useState(false);
  const [ deleteId,                   setDeleteId               ] = useState(null);
  const [ content,                    setContent                ] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };





const fetchData = async () => {
  try {

    const response = await axios.get("http://89.46.196.60:8443/aziende/react/mod", { headers: headers });

    if (Array.isArray(response.data)) {
      const aziendeConId = response.data.map((aziende) => ({ ...aziende }));
      setFilteredAziende(aziendeConId);
      setOriginalAziende(aziendeConId);
    } else {
      console.error("I dati ottenuti non sono nel formato Array:", response.data);
    }
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
  }
};







// const fetchData = async () => {
//   try {

//     const savedSearchTerms = JSON.parse(localStorage.getItem("searchTerms"));
//     console.log("savedSearchTerms", savedSearchTerms);

//     let url = "http://89.46.196.60:8443/aziende/react";

//     if (savedSearchTerms && Object.keys(savedSearchTerms).length > 0) {
//       const params = new URLSearchParams();

//       if (savedSearchTerms.status) params.append("stato", savedSearchTerms.status);
//       if (savedSearchTerms.denominazione) params.append("ragione", savedSearchTerms.denominazione);
//       if (savedSearchTerms.owner) params.append("owner", savedSearchTerms.owner);
//       if (savedSearchTerms.tipologia) params.append("tipologia", savedSearchTerms.tipologia);



//       console.log("sto chiamando l'url con la ricerca: ", url, savedSearchTerms);
//       url += `/ricerca/mod?${params.toString()}`;
//     } else {
//       console.log("sto chiamando l'url senza la ricerca: ", url);

//       url += "/mod";
//     }
//     const response = await axios.get(url, { headers: headers });

//     // const response = await axios.get("http://89.46.196.60:8443/aziende/react/mod", { headers: headers });

//     if (Array.isArray(response.data)) {
//       const aziendeConId = response.data.map((aziende) => ({ ...aziende }));
//       setFilteredAziende(aziendeConId);
//       setOriginalAziende(aziendeConId);
//     } else {
//       console.error("I dati ottenuti non sono nel formato Array:", response.data);
//     }
//   } catch (error) {
//     console.error("Errore durante il recupero dei dati:", error);
//   }
// };


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



  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://89.46.196.60:8443/aziende/react/elimina/${deleteId}`, { headers: headers});
      setOpenDialog(false);
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
    { field: "status",         headerName: "Stato",            flex: 0.4,  renderCell: (params) => getSmileIcon(params), },
    { field: "denominazione",  headerName: "Cliente",   flex: 1.5,  renderCell: (params) => (
      <Link to={`/aziende/dettaglio/${params.row.id}`} state={{ aziendaData: { ...params.row} }}>
          {params.row.denominazione}
        </Link>
    ),
  },
    { field: "owner",          headerName: "Owner",           flex: 0.6, valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A" },
    { field: "tipologia",      headerName: "Tipologia",       flex: 1 },
    { field: "citta",          headerName: "Città",           flex: 1 },
    { field: "paese",          headerName: "Paese",           flex: 1 },
    { field: "need",           headerName: "Need",            flex: 0.3, renderCell: (params) => (
    <div>
    <Link to={`/need/${params.row.id}`} state={{ aziendaData: { ...params.row} }} >
        <ListButton />
    </Link>
    </div>
    ),
    },
    { field: "azioni",         headerName: "Azioni",          flex: 0.5, renderCell: (params) => (
      <div>
    <Link to={`/aziende/modifica/${params.row.id}`} state={{ aziendaData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner } }} >
      <EditButton />
    </Link>
        <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
      </div>
    ),
  },
  ];

  const handleSearch = (filteredData) => {
    setFilteredAziende(filteredData);
  };

  


  const handleReset = () => {
    setSearchText("");
    setFilteredAziende(originalAziende);
  };


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
      <Sidebar2 isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', overFlowY:'auto', width: contentWidth,}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Aziende</Typography>
          <MyButton onClick={navigateToAggiungiAzienda}>Aggiungi Azienda</MyButton>
          <Box sx={{ height: '90%', marginTop: '40px', width: '100%'}}>
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
            }}>
            Annulla
          </Button>
          <Button
            onClick={handleDelete}
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

    </Box>  );
};

export default Aziende;


