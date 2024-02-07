import React, { useState, useEffect }           from "react";
import { useNavigate }                          from "react-router-dom";
import axios                                    from "axios";
import Sidebar                                  from "../components/Sidebar";
import MyDataGrid                               from "../components/MyDataGrid";
import FatturazioneAttivaSearchBox              from "../components/searchBox/FatturazioneAttivaSearchBox.jsx";
import MyButton                                 from '../components/MyButton.jsx';
import EditButton                               from "../components/button/EditButton.jsx";
import { Link }                                 from "react-router-dom";
import { Box, Typography }                      from "@mui/material";


const FatturazioneAttiva = () => {

  const navigate = useNavigate();

  const [ fatturazioneAttiva,                  setFatturazioneAttiva                ] = useState([]);  
  const [ originalFatturazioneAttiva,          setOriginalFatturazioneAttiva        ] = useState([]);
  const [ searchText,                          setSearchText                        ] = useState("");
  const [ filteredFatturazioneAttiva,          setFilteredFatturazioneAttiva        ] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

 const headers = {
    Authorization: `Bearer ${accessToken}`
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFatturazioneAttiva = await axios.get("http://89.46.67.198:8443/fatturazione/attiva/react", { headers: headers});

        if (Array.isArray(responseFatturazioneAttiva.data)) {

          const fatturazioneAttivaConId = responseFatturazioneAttiva.data.map((fatturazioneAttiva) => ({ ...fatturazioneAttiva}));
          setFatturazioneAttiva           (fatturazioneAttivaConId);
          setFilteredFatturazioneAttiva   (fatturazioneAttivaConId);
          setOriginalFatturazioneAttiva   (fatturazioneAttivaConId);
          } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseFatturazioneAttiva.data);
          }
        } catch (error) {
          console.error("Errore durante il recupero dei dati:", error);
        }
      };

    fetchData();
  }, []);

  const navigateToAggiungiFatturazioneAttiva = () => {
    navigate("/fatturazioneAttiva/aggiungi");
  };

  const columns = [
    // { field: "id",                  headerName: "ID",                          width: 70  },
    { field: "dataEmissione",       headerName: "Data Emissione",              width: 120 },
    { field: "termine",             headerName: "Termine di pagamento",        width: 120 },
    { field: "dataScadenza",        headerName: "Data Scadenza",               width: 120 },
    { field: "tariffa",             headerName: "Tariffa",                     flex: 1 },
    { field: "giorniLavorati",      headerName: "GG Lavorati",                 flex: 1 },
    { field: "imponibile",          headerName: "Imponibile",                  flex: 1 },
    { field: "totaleConIva",        headerName: "Totale con Iva",              flex: 1 },
    { field: "nfattura",            headerName: "N. Fattura",                  flex: 1 },
    { field: "stato",               headerName: "Stato",                       flex: 1, renderCell: (params) => (  <div style={{ textAlign: "start" }}>
                                                                                                                        {params.row.stato && params.row.stato.descrizione}
                                                                                                                      </div>
                                                                                                                    ) },
    { field: "idCliente",           headerName: "Cliente",                     width: 130, renderCell: (params) => (  <div style={{ textAlign: "start" }}>
                                                                                                                        {params.row.cliente && params.row.cliente.denominazione}
                                                                                                                      </div>
                                                                                                                    ) },
    { field: "consulente",          headerName: "Consulente",                  flex: 1 },
    { field: "oggetto",             headerName: "Oggetto",                     flex: 1 },
    { field: "descrizione",         headerName: "Descrizione",                 flex: 1 },
    { field: "oda",                 headerName: "ODA",                         flex: 1 },
    { field: "azioni",              headerName: "Azioni",                      flex: 1, renderCell: (params) => ( <div>
      <Link
      to={`/fatturazioneAttiva/modifica/${params.row.id}`}
        state={{ fatturazioneAttivaData: params.row }}
      >
        <EditButton />
      </Link>
      </div>
    ), },
  ];

  

  const handleSearch = (filteredData) => {
    setFatturazioneAttiva(filteredData);
  };

  const handleReset = () => {
    setSearchText(""); 
    setFatturazioneAttiva(originalFatturazioneAttiva);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
          <Sidebar />
          <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Typography variant="h4" component="h1" sx={{ margin: '30px', fontWeight: 'bold', fontSize: '1.8rem'}}>Fatturazione Attiva</Typography>
          <MyButton onClick={navigateToAggiungiFatturazioneAttiva}>Aggiungi una nuova Fattura</MyButton>
          <Box sx={{ height: '90%', marginTop: '40px', width: '100%'}}>
            <MyDataGrid 
            data={fatturazioneAttiva} 
            columns={columns} 
            title="Fatture Attive" 
            getRowId={(row) => row.id} 
            searchBoxComponent={() => (
              <FatturazioneAttivaSearchBox 
          data={fatturazioneAttiva} 
          onSearch={handleSearch} 
          onReset={handleReset} 
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalFatturazioneAttiva={originalFatturazioneAttiva}/>
            )}
            />
          </Box>
          </Box>
  </Box>
  );
};

export default FatturazioneAttiva;
