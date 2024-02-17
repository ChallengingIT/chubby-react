import React, { useState, useEffect}          from "react";
import { useNavigate }                        from "react-router-dom";
import axios                                  from "axios";
import { Link }                               from "react-router-dom";
import Sidebar                                from "../components/Sidebar";
import MyDataGrid                             from "../components/MyDataGrid";
import MyButton                               from "../components/MyButton";
import FatturazionePassivaSearchBox           from "../components/searchBox/FatturazionePassivaSearchBox";
import EditButton                             from "../components/button/EditButton";
import { Box, Typography }                    from "@mui/material";
import MyDataGridPerc from "../components/MyDataGridPerc";
import Sidebar2 from "../components/componentiBackup/Sidebar2";

const FatturazionePassiva = () => {

  const navigate = useNavigate();

  const [ fatturazionePassiva,            setFatturazionePassiva            ] = useState([]);
  const [ searchText,                     setSearchText                     ] = useState([]);
  const [ originalFatturazionePassiva,    setOriginalFatturazionePassiva    ] = useState([]);
  const [ filteredFatturazionePassiva,    setFilteredFatturazionePassiva    ] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get("http://89.46.67.198:8443/fatturazione/passiva/react", { headers: headers});

        if (Array.isArray(response.data)) {

        const fatturazionePassivaConId = response.data.map((fatturazionePassiva) => ({ ...fatturazionePassiva}));

        setFatturazionePassiva        (fatturazionePassivaConId);
        setFilteredFatturazionePassiva(fatturazionePassivaConId);
        setOriginalFatturazionePassiva(fatturazionePassivaConId);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };


    fetchData();
  }, []);

  const navigateToAggiungiFatturazionePassiva = () => {
    navigate("/fatturazione/passiva/aggiungi");
  };

  const columns = [
    // { field: "id",                    headerName: "ID",                     width: 70  },
    { field: "tipologia",             headerName: "Tipologia",              flex: 2 },
    { field: "fornitore",             headerName: "Fornitore Riferimenti",  flex: 2,  renderCell: (params) => (
                                                                                                                  <div style={{ textAlign: "start" }}>
                                                                                                                    {params.row.fornitore && params.row.fornitore.denominazione 
                                                                                                                    ? params.row.fornitore.denominazione: "N/A"}
                                                                                                                    </div>
                                                                                                                ) },
    { field: "descrizione",           headerName: "Descrizione",            flex: 2 },
    { field: "dataFattura",           headerName: "Data Fattura",           flex: 1.2 },
    { field: "scadenza",              headerName: "Scadenza",               flex: 1.2 },
    { field: "imponibile",            headerName: "Imponibile",             flex: 1 },
    { field: "iva",                   headerName: "Iva",                    flex: 1 },
    { field: "importo",               headerName: "Importo",                flex: 1 },
    { field: "stato",                 headerName: "Stato",                  flex: 1,   renderCell: (params) => (
                                                                                                                    <div style={{ textAlign: "start" }}>
                                                                                                                      {params.row.stato && params.row.stato.descrizione
                                                                                                                        ? params.row.stato.descrizione
                                                                                                                        : "N/A"}
                                                                                                                    </div>
                                                                                                                  ),
                                                                                                                },
    { field: "azioni",                headerName: "Azioni",                 flex: 1, renderCell: (params) => ( <div>
                                                                                                                      <Link
                                                                                                                      to={`/fatturazione/passiva/modifica/${params.row.id}`}
                                                                                                                        state={{ fatturazionePassivaData: params.row }}
                                                                                                                      >
                                                                                                                        <EditButton />
                                                                                                                      </Link>
                                                                                                                      </div>
                                                                                                                    ), },
  ];

  const handleSearch = (filteredData) => {
    setFatturazionePassiva(filteredData);
  };
  const handleReset = () => {
    setSearchText("");
    setFatturazionePassiva(originalFatturazionePassiva);
  };


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100vh', width: '100vw', overflow: 'hidden'}}>
    <Sidebar2 />
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100vw'}}>
    <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.8rem'}}>Fatturazione Passiva</Typography>
          <MyButton onClick={navigateToAggiungiFatturazionePassiva}>Aggiungi una nuova Fattura</MyButton>
          <Box sx={{ height: '90vh', marginTop: '20px', width: '100vw'}}>
            <MyDataGridPerc
            data={fatturazionePassiva} 
            columns={columns} 
            title="Fatture Passive" 
            getRowId={(row) => row.id}
            searchBoxComponent={() => (
              <FatturazionePassivaSearchBox 
                data={fatturazionePassiva} 
                onSearch={handleSearch} 
                onReset={handleReset}
                searchText={searchText}
                onSearchTextChange={(text) => setSearchText(text)}
                OriginalFatturazionePassiva={originalFatturazionePassiva}
                />
            )}
            />
          </Box>
          </Box>
    </Box>
  );
};

export default FatturazionePassiva;
