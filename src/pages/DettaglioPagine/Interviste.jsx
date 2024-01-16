
//funzionante al 21 dicembre 2023 9:00

import React, { useEffect, useState}          from 'react'
import MyDataGrid                             from '../../components/MyDataGrid';
import { Button }                             from '@mui/material';
import Sidebar                                from '../../components/Sidebar';
import { Link, useParams }                    from 'react-router-dom';
import { useNavigate, useLocation }           from "react-router-dom";
import DeleteButton                           from '../../components/button/DeleteButton';
import axios                                  from 'axios';
import EditButton                             from '../../components/button/EditButton.jsx';
import VisibilityButton                       from '../../components/button/VisibilityButton.jsx';
import IntervisteSearchBox                    from '../../components/searchBox/IntervisteSearchBox.jsx';
import MyButton                               from '../../components/MyButton.jsx';

function Interviste() {
  const navigate                = useNavigate();
  const params                  = useParams();
  const { id }                  = params;
  const location                = useLocation();
  const { recruitingData = {} } = location.state || {};
  const candidatoID             = id;

  // console.log("DATI ARRIVATI DA RECRUITING:", recruitingData);


  const [ interviste,               setInterviste           ] = useState([]);
  const [ searchText,               setSearchText           ] = useState("");
  const [ originalInterviste,       setOriginalInterviste   ] = useState([]);
  const [ filteredInterviste,       setFilteredInterviste   ] = useState([]);
  const [ candidatoData,            setCandidatoData        ] = useState([]);

  const fetchData = async () => {
    try {
      const response                = await axios.get(`http://localhost:8080/intervista/react/${id}`       );
      const candidatoResponse       = await axios.get(`http://localhost:8080/staffing/react/${candidatoID}`);

      if (typeof candidatoResponse.data === 'object') {
        setCandidatoData([candidatoResponse.data]); 
      }


      if (Array.isArray(response.data)) {
        const intervisteConId = response.data.map((interviste) => ({ ...interviste }));
        setOriginalInterviste(intervisteConId);
        setFilteredInterviste(intervisteConId);
        console.log(intervisteConId);
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

  useEffect(() => {
    // console.log("DATI DI CANDIDATO AGGIORNATI: ", candidatoData);
  }, [candidatoData]); 

  const handleGoBack = () => {
navigate("/recruiting");
  };


// console.log("ID INSERITO: ", candidatoID);

  const navigateToAggiungiIntervista = () => {
    navigate("/intervista/aggiungi", { state: {  candidatoID  }});
    // console.log("DATI INVIATI AD AGGIUNGI INCONTRO: ", candidatoData, candidatoID);
  };



  const handleSearch = (filteredData) => {
    setFilteredInterviste(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    setFilteredInterviste(originalInterviste);
  };

  const handleDelete = async (id) => {
    try {

        const response = await axios.delete(`http://localhost:8080/intervista/react/elimina/${id}`);
        console.log("DELETE A ID: ", id);
        console.log("Risposta dalla chiamata DELETE:", response);
  
  
        fetchData();
      
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'intervista:", error);
    }
  };


const candidatoNome    = candidatoData.length > 0 ? candidatoData[0].nome : '';
const candidatoCognome = candidatoData.length > 0 ? candidatoData[0].cognome : '';




  const prepareDataForChild = (rowData) => {
    return {
      rowData,
      candidatoData,
    };
  };
  
const table1 = [
  // { field: "id", headerName: "Id", width: 70},
  { field: "stato",               headerName: "Stato",          width: 70,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione
          ? params.row.stato.descrizione
          : "N/A"}
      </div>
    ),
  },
  { field: "dataColloquio",       headerName: "Data Colloquio", width: 150},
  { field: "candidato",           headerName: "Intervistatore", width: 150,
renderCell: (params) => (
  <div style={{ textAlign: "start" }}>
        {params.row.candidato?.owner?.descrizione || "N/A"}
      </div>
    ),
},
  { field: "dataAggiornamento",   headerName: (
      <div style={{ lineHeight: '1' }}>
        Follow Up <br /> Data Aggiornamento
      </div>
    ),
    width: 150,
    renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipo?.descrizione || "N/A"}
      </div>
    ),
  },
  
   //dataAggiornamento e follo up si chiama intervista.tipo.descrizione
  { field: "azioni",         headerName: "Azioni",          width: 800, renderCell: (params) => (
    <div>
      <Link
      to={`/intervista/visualizza/${params.row.id}`}
      state={params.row}
  
>
<VisibilityButton />
</Link>
<Link
to={`/intervista/modifica/${params.row.id}`}
state={params.row}
>
<EditButton />
</Link>
      
      <DeleteButton onClick={handleDelete} id={params.row.id}/>
    </div>
  ), },
];


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
        <div className="containerTitle">
        <h1>{`Lista ITW di ${candidatoNome} ${candidatoCognome}`}</h1>
                </div>
                <MyButton onClick={navigateToAggiungiIntervista}>Aggiungi Intervista</MyButton>
                <IntervisteSearchBox data={interviste}
          onSearch={handleSearch}
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalInterviste={originalInterviste}/>
                <MyDataGrid data={filteredInterviste} columns={table1} title="Interviste" getRowId={(row) => row.id} />
            <Button
          color="primary"
          onClick={handleGoBack}
          sx={{
            backgroundColor: "black",
            borderRadius: '40px',
            color: "white",
            width: '250px',
            height: '30px', 
            margin: 'auto',
            marginBottom: '20px',
            marginTop: 'auto',
            "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Indietro
        </Button>
            </div>

        </div>
    </div>
  );
};

export default Interviste;