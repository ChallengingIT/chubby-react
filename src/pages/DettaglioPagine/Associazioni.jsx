import React, { useEffect, useState}            from 'react'
import MyDataGrid                               from '../../components/MyDataGrid';
import Sidebar                                  from '../../components/Sidebar';
import { Button }                               from '@mui/material';
import { useParams }                            from 'react-router-dom';
import { useNavigate}                           from "react-router-dom";
import { Link }                                 from "react-router-dom";
import axios                                    from 'axios';
// import EditButton from '../../components/button/EditButton.jsx';
// import VisibilityButton from '../../components/button/VisibilityButton.jsx';
// import IntervisteSearchBox from '../../components/searchBox/IntervisteSearchBox.jsx';
// import MyButton from '../../components/MyButton.jsx';
import AssociazioniSearchBox                    from '../../components/searchBox/AssociazioniSearchBox.jsx';

function Associazioni() {
  const navigate = useNavigate();
  const params   = useParams();
  const { id, nome, nomeAzienda } = params;


  // const [need, setNeed] = useState([]);
  const [searchText,                setSearchText              ] = useState("");
  const [filteredAssociabili,       setFilteredAssociabili     ] = useState([]);
  const [originalAssociabili,       setOriginalAssociabili     ] = useState([]);
  const [associatiOptions,          setAssociatiOptions        ] = useState([]);

  const navigateToDettaglioKeyPeople = (nome) => {
    navigate(`/keyPeople/dettaglio/${nome}`);
  };
  
  const fetchData = async () => {
    try {
      const associabiliResponse = await axios.get(`http://localhost:8080/associazioni/react/match/associabili/${id}`);
      const associatiResponse   = await axios.get(`http://localhost:8080/need/react/match/associati/${id}`);

      if (Array.isArray(associatiResponse.data)) {
        const associatiConId = associatiResponse.data.map((associati) => ({ ...associati }));
        setAssociatiOptions(associatiConId);
        // setFilteredAssociabili(associatiConId);
        console.log("DATI DA ASSOCIATI: ", associatiOptions);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", associatiResponse.data);
      }
      
      
      
      if (Array.isArray(associabiliResponse.data)) {
        const associabiliConId = associabiliResponse.data.map((associabili) => ({ ...associabili }));
        setFilteredAssociabili(associabiliConId);
        setOriginalAssociabili(associabiliConId);
        console.log("DATI DA ASSOCIABILI: ",associabiliConId);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", associabiliResponse.data);
      }


    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    window.history.back(); 
  };


  const handleAssocia = async (row) => {
    try {
      const idNeed = parseInt(id); 
      const idCandidato = row.id;
  
      // Costruisci l'URL con i parametri
      const url = `http://localhost:8080/associazioni/react/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
  
      console.log("URL con parametri di query: ", url);
  
      // Effettua la richiesta POST
      const response = await axios.post(url);
      console.log(response.data);
  
      // Aggiorna i dati
      fetchData();
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  };



  const tableAssociabili = [
    { field: "cliente", headerName: "Cliente", width: 250, renderCell: (params) => (
      <div style={{ textAlign: "left"  }}>
          <Link
        to={`/staffing/ricerca/${params.row.email}`}
        onClick={() => navigateToDettaglioKeyPeople(params.row.nome)}
      >
        {params.row.nome} {params.row.cognome}
      </Link>
      
    </div>
  
  
      ),},
    { field: "email",                 headerName: "Descrizione",                        width: 250},
    { field: "tipologia",             headerName: "Priorità",                           width: 250, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipologia && params.row.tipologia.descrizione
          ? params.row.tipologia.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "rating",                headerName: "Stato",                              width: 150},
    { field: "stato",                 headerName: "Week",                               width: 70, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione
          ? params.row.stato.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "azioni",                headerName: "Azioni",                             width: 250, renderCell: (params) => (
      <div>
        <Button
         onClick={() => handleAssocia(params.row)}
         sx={{ backgroundColor: '#FFB800',
        color: 'white',
        "&:hover": {
          backgroundColor: "#ffb800",
          transform: "scale(1.05)",
          color: 'white',
        },
      }}>Associa</Button>
      </div>
    )},
  ];



  const tableAssociati = [
    { field: "nome",                   headerName: "Cliente",                             width: 250, renderCell: (params) => (
      <div style={{ textAlign: "left"  }}>
          <Link
        to={`/staffing/ricerca/${params.row.email}`}
        onClick={() => navigateToDettaglioKeyPeople(params.row.nome)}
      >
        {params.row.nome} {params.row.cognome}
      </Link>
    
    </div>
      ),},
    { field: "email",                   headerName: "Need",                                width: 250},
    { field: "tipologia",               headerName: "Priorità",                            width: 150, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipologia && params.row.tipologia.descrizione
          ? params.row.tipologia.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "stato",                   headerName: "Stato",                                width: 70, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione
          ? params.row.stato.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "dataUltimoContatto",      headerName: "Week",                                 width: 100},
  ];

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
        <div className="containerTitle">
                    <h1>{`Lista match per ${nome} `}</h1>
                </div>
                <AssociazioniSearchBox/>
                <MyDataGrid data={filteredAssociabili} columns={tableAssociabili} title="Need Associabili" getRowId={(row) => row.id} />
                <MyDataGrid data={associatiOptions}    columns={tableAssociati}   title="Need Associati"   getRowId={(row) => row.id} />
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

export default Associazioni;