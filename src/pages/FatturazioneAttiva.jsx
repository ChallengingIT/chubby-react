import React, { useState, useEffect }           from "react";
import { useNavigate }                          from "react-router-dom";
import axios                                    from "axios";
import Sidebar                                  from "../components/Sidebar";
import MyDataGrid                               from "../components/MyDataGrid";
import FatturazioneAttivaSearchBox              from "../components/searchBox/FatturazioneAttivaSearchBox.jsx";
import MyButton                                 from '../components/MyButton.jsx';
import EditButton                               from "../components/button/EditButton.jsx";
import { Link }                                 from "react-router-dom";
import "../styles/FatturazioneAttiva.css";

const FatturazioneAttiva = () => {
  const navigate = useNavigate();

  const [ fatturazioneAttiva,                  setFatturazioneAttiva                ] = useState([]);  
  const [ originalFatturazioneAttiva,          setOriginalFatturazioneAttiva        ] = useState([]);
  const [ searchText,                          setSearchText                        ] = useState("");
  const [ filteredFatturazioneAttiva,          setFilteredFatturazioneAttiva        ] = useState([]);

   // Recupera l'accessToken da localStorage
   const user = JSON.parse(localStorage.getItem("user"));
   const accessToken = user?.accessToken;

   // Configura gli headers della richiesta con l'Authorization token
   const headers = {
     Authorization: `Bearer ${accessToken}`
   };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFatturazioneAttiva = await axios.get("http://localhost:8080/fatturazione/attiva/react", { headers: headers});
        if (Array.isArray(responseFatturazioneAttiva.data)) {
          const fatturazioneAttivaConId = responseFatturazioneAttiva.data.map((fatturazioneAttiva) => ({ ...fatturazioneAttiva}));
          setFatturazioneAttiva(fatturazioneAttivaConId);
          setFilteredFatturazioneAttiva(fatturazioneAttivaConId);
          setOriginalFatturazioneAttiva(fatturazioneAttivaConId);
 
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
    { field: "dataEmissione",       headerName: "Data Emissione",              width: 150 },
    { field: "termine",             headerName: "Termine di pagamento",        width: 100 },
    { field: "dataScadenza",        headerName: "Data Scadenza",               width: 100 },
    { field: "tariffa",             headerName: "Tariffa",                     width: 100 },
    { field: "giorniLavorati",      headerName: "GG Lavorati",                 width: 100 },
    { field: "imponibile",          headerName: "Imponibile",                  width: 100 },
    { field: "totaleConIva",        headerName: "Totale con Iva",              width: 100 },
    { field: "nfattura",            headerName: "N. Fattura",                  width: 100 },
    { field: "stato",               headerName: "Stato",                       width: 100, 
  renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.stato && params.row.stato.descrizione}
    </div>
  ) },
    { field: "idCliente",           headerName: "Cliente",                     width: 100,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.cliente && params.row.cliente.denominazione}
      </div>
    ) },
    { field: "consulente",          headerName: "Consulente",                  width: 100 },
    { field: "oggetto",             headerName: "Oggetto",                     width: 100 },
    { field: "descrizione",         headerName: "Descrizione",                 width: 100 },
    { field: "oda",                 headerName: "ODA",                         width: 100 },
    { field: "azioni",              headerName: "Azioni",                      width: 300, renderCell: (params) => ( <div>
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Fatturazione Attiva</div>
          <MyButton onClick={navigateToAggiungiFatturazioneAttiva}>Aggiungi una nuova Fattura</MyButton>
          
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
        </div>
      </div>
    </div>
  );
};

export default FatturazioneAttiva;
