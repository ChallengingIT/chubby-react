import React, { useState, useEffect }                             from "react";
import { Link, useNavigate}                                       from "react-router-dom";
import axios                                                      from "axios";
import Sidebar                                                    from "../components/Sidebar";
import MyDataGrid                                                 from "../components/MyDataGrid";
import MyButton                                                   from '../components/MyButton.jsx';
import EditButton                                                 from "../components/button/EditButton.jsx";
import SearchButton                                               from "../components/button/SearchButton.jsx";
import PaperButton                                                from "../components/button/PaperButton.jsx";
import Modal                                                      from 'react-modal';
import { Button, Select, MenuItem, Box, Typography}               from "@mui/material";
import NeedSearchBox                                              from "../components/searchBox/NeedSearchBox.jsx";


const Need = () => {

  const navigate = useNavigate();

  const [ need,                     setNeed                       ] = useState([]);
  const [ originalNeed,             setOriginalNeed               ] = useState([]);
  const [ filteredNeed,             setFilteredNeed               ] = useState([]);
  const [ searchText,               setSearchText                 ] = useState("");
  const [ selectedNeed,             setSelectedNeed               ] = useState(null);
  const [ newStato,                 setNewStato                   ] = useState("");
  const [ isModalOpen,              setIsModalOpen                ] = useState(false);
  const [ statoOptions,             setStatoOptions               ] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const fetchData = async () => {
      try {

        const response      = await axios.get("http://89.46.67.198:8443/need/react/modificato",       { headers: headers});
        const responseStato = await axios.get("http://89.46.67.198:8443/need/react/stato", { headers: headers });

        if (Array.isArray(responseStato.data)) {
          const statoConId = responseStato.data.map((stato) => ({ ...stato}));
          setStatoOptions(statoConId);
          } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
          }


        if (Array.isArray(response.data)) {
        const needConId = response.data.map((need) => ({ ...need}));
        setOriginalNeed(needConId);
        setFilteredNeed(needConId);
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
  

  const navigateToAggiungiNeed = () => {
    navigate("/need/aggiungi");
  };

  const handleOpenModal = (selectedRow) => {
    setSelectedNeed(selectedRow);
    if (!selectedRow.stato || selectedRow.stato === null) {
      setNewStato("");
    } else {
      setNewStato(selectedRow.stato.id);
    }
  
    setIsModalOpen(true);
  };

  const handleUpdateStato = async () => {
    try {
      const idStato = newStato;
      const params = new URLSearchParams({ stato: idStato });
  
      await axios.post(`http://89.46.67.198:8443/need/react/salva/stato/${selectedNeed.id}?${params.toString()}`, { headers: headers });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato:", error);
    }
  };


  // function WrappedTextCell(props) {
  //   return (
  //     <div style={{
  //       whiteSpace: 'normal',
  //       overflowWrap: 'break-word',
  //       textAlign:"left",
  //       fontWeight:"bold",
  //       maxWidth: '250px',
  //     }}>
  //       {props.value}
  //     </div>
  //   );
  // }

  const columns = [
    { field: "id",               headerName: "#",                 flex: 0.1, renderCell: (params) => (
      <div style={{ textAlign: "center" }}>
        {params.row.id }
      </div>
    ),
  }, 
    // { field: "weekDescrizione",  headerName: "Week/Descrizione",    width: 200, renderCell: (params) => (
    //   <div style={{ textAlign: "left" }}>
    //   <div style={{ textAlign: "start" }}>{params.row.week}</div>
    //   <div style={{ textAlign: "start" }}>{params.row.descrizione}</div>
    // </div>
    //   ),
    // },
    { field: "week",              headerNmae: "Week",                flex: 1 },
    // {
    //   field: "descrizione",
    //   headerName: "Descrizione",
    //   width: 360,
    //   renderCell: (params) => <WrappedTextCell value={params.row.descrizione} />
    // },
    { field: "descrizione",       headerName: "Descrizione",         flex: 2,   renderCell: (params) => (
        // <a
        //   href={"/need/dettaglio/" + params.row.id}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   style={{
        //     textAlign: 'left',
        //     whiteSpace: 'normal',
        //     wordWrap: 'break-word',
        //     overflow: 'hidden',
        //     textOverflow: 'ellipsis',
        //     display: '-webkit-box',
        //     WebkitLineClamp: 2, // Numero di linee massime prima di mostrare '...'
        //     WebkitBoxOrient: 'vertical',
        //   }}
        // >
        //   {params.row.descrizione}
        // </a>
        <div style={{ 
          textAlign: "left",
            maxWidth: 250,
            whiteSpace: 'normal', 
            wordWrap: 'break-word',
            // overflow: 'auto',
            // textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.5',
            }}>
      <Link
      to={`/need/dettaglio/${params.row.id}`}
      state={{ needData: params.row }}
    >
      {params.row.descrizione} 
    </Link>
    </div>
      )
    },
    { field: "priorita",          headerName: "Priorità",           width: 100 },
    { field: "tipologia",         headerName: "Tipologia",           flex: 1,    renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.tipologia && params.row.tipologia.descrizione
            ? params.row.tipologia.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "owner",             headerName: "Owner",               width: 100,      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.owner && params.row.owner.descrizione
            ? params.row.owner.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "cliente",           headerName: "Azienda",             flex: 1.5, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.cliente && params.row.cliente.denominazione
          ? params.row.cliente.denominazione
          : "N/A"}
      </div>
    ), },
    { field: "numeroRisorse",     headerName: "Headcount",           flex: 1 },
    { field: "stato",             headerName: "Stato",               flex: 1,  renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "azioni",            headerName: "Azioni",              flex: 2,  renderCell: (params) => (
      <div>
        <PaperButton onClick={() => handleOpenModal(params.row)} />
        <Link
        to={`/need/modifica/${params.row.id}`}
        state={{ needData: params.row }}
        >
        <EditButton  />
        </Link>
        <Link
        to={`/need/match/${params.row.id}`}
        state = {{ needData: params.row}}
        >
        <SearchButton />
        </Link>
      </div>
    ),
    }, 
  ];

  const handleSearch = (filteredData) => {
  setFilteredNeed(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    fetchData();
  };



  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
      <Sidebar />
      <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Need</Typography>
          <MyButton onClick={navigateToAggiungiNeed}>Aggiungi Need</MyButton>
          <Box sx={{ height: '100%', marginTop: '40px', width: '100%'}}>
          <MyDataGrid 
          data={filteredNeed} 
          columns={columns} 
          title="Need" 
          getRowId={(row) => row.id}
          searchBoxComponent={() => (
            <NeedSearchBox
            data={need}
            onSearch={handleSearch}
            onReset={handleReset}
            searchText={searchText}
            onSearchTextChange={(text) => setSearchText(text)}
            OriginalNeed={originalNeed}/>
          )}
          />
          </Box>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: '800px',
            height: 'auto',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            borderRadius: '40px',
          },
          overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h2>Cambia stato al need</h2>
        <Select
          value={newStato}
          onChange={(e) => setNewStato(e.target.value)}
          sx={{
            marginBottom: '10px',
            width: '200px',
          }}
        >
        {statoOptions.map((stato) => (
        <MenuItem key={stato.id} value={stato.id}>
          {stato.descrizione}
        </MenuItem>
      ))}
        </Select>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            color="primary"
            onClick={() => setIsModalOpen(false)}
            sx={{
              backgroundColor: "black",
              color: "white",
              marginRight: '10px',
              "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Indietro
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateStato}
            sx={{
              backgroundColor: "#14D928",
              color: "black",
              "&:hover": {
                backgroundColor: "#14D928",
                color: "black",
                transform: "scale(1.05)",
              },
            }}
          >
            Salva
          </Button>
        </div>
            </div>
          </Modal>
      </Box>
  );
};

export default Need;