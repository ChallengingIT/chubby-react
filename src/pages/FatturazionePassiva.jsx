import React, { useState, useEffect}          from "react";
import { useNavigate }                        from "react-router-dom";
import axios                                  from "axios";
import { Link }                               from "react-router-dom";
import Sidebar                                from "../components/Sidebar";
import MyDataGrid                             from "../components/MyDataGrid";
import MyButton                               from "../components/MyButton";
import FatturazionePassivaSearchBox           from "../components/searchBox/FatturazionePassivaSearchBox";
import EditButton                             from "../components/button/EditButton";

import "../styles/FatturazionePassiva.css";

const FatturazionePassiva = () => {
  const navigate = useNavigate();

  const [ fatturazionePassiva,            setFatturazionePassiva            ] = useState([]);
  const [ searchText,                     setSearchText                     ] = useState([]);
  const [ originalFatturazionePassiva,    setOriginalFatturazionePassiva    ] = useState([]);
  const [ filteredFatturazionePassiva,    setFilteredFatturazionePassiva    ] = useState([]);

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
        const response = await axios.get("http://localhost:8080/fatturazione/passiva/react", { headers: headers});
        if (Array.isArray(response.data)) {
        const fatturazionePassivaConId = response.data.map((fatturazionePassiva) => ({ ...fatturazionePassiva}));
        setFatturazionePassiva(fatturazionePassivaConId);
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
    { field: "tipologia",             headerName: "Tipologia",              width: 180 },
    { field: "fornitore",             headerName: "Fornitore Riferimenti",  width: 180,
  renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.fornitore && params.row.fornitore.denominazione 
      ? params.row.fornitore.denominazione: "N/A"}
      </div>
  ) },
    { field: "descrizione",           headerName: "Descrizione",            width: 280 },
    { field: "dataFattura",           headerName: "Data Fattura",           width: 100 },
    { field: "scadenza",              headerName: "Scadenza",               width: 100 },
    { field: "imponibile",            headerName: "Imponibile",             width: 100 },
    { field: "iva",                   headerName: "Iva",                    width: 100 },
    { field: "importo",               headerName: "Importo",                width: 100 },
    {
      field: "stato",
      headerName: "Stato",
      width: 100,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione
            ? params.row.stato.descrizione
            : "N/A"}
        </div>
      ),
    },
    { field: "azioni",                headerName: "Azioni",                 width: 200, renderCell: (params) => ( <div>
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
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Fatturazione Passiva</div>
          <MyButton onClick={navigateToAggiungiFatturazionePassiva}>Aggiungi una nuova Fattura</MyButton>
        
            <MyDataGrid 
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
        OriginalFatturazionePassiva={originalFatturazionePassiva}/>

            )}
             />
        </div>
      </div>
    </div>
  );
};

export default FatturazionePassiva;
