import React, { useEffect, useState}                  from 'react'
import MyDataGrid                                     from '../../components/MyDataGrid';
import Sidebar                                        from '../../components/Sidebar';
import { useParams }                                  from 'react-router-dom';
import { useNavigate }                                from "react-router-dom";
import DeleteButton                                   from '../../components/button/DeleteButton';
import axios                                          from 'axios';
import { Link }                                       from "react-router-dom";
import NeedMatchSearchBox                             from '../../components/searchBox/NeedMatchSearchBox.jsx';
import { Modal, Box, Button, Typography }                         from '@mui/material';
import ModalBox                                       from '../../components/ModalBox.jsx';
import { useLocation }                                from 'react-router-dom';
import MyDataGridPerc from '../../components/MyDataGridPerc.jsx';
import Sidebar2 from '../../components/componentiBackup/Sidebar2.jsx';



function NeedMatchPages() {
  const navigate                                      = useNavigate();
  const params                                        = useParams();
  const { id }                                        = params;
  const location                                      = useLocation();
  const { needData = {} }                             = location.state || {};
  const descrizione                                   = needData.descrizione;
  const nomeAzienda                                   = needData.cliente?.denominazione;




  const [ needMatch,                   setNeedMatch                 ] = useState([]);
  const [ searchText,                  setSearchText                ] = useState("");
  const [ filteredAssociabili,         setFilteredAssociabili       ] = useState([]);
  const [ originalAssociabili,         setOriginalAssociabili       ] = useState([]);
  const [ storicoOptions,              setStoricoOptions            ] = useState([]);
  const [ associatiOptions,            setAssociatiOptions          ] = useState([]);
  const [ ownerOptions,                setOwnerOptions              ] = useState([]);
  const [ statoOptions,                setStatoOptions              ] = useState([]);
  const [ isModalOpen,                 setIsModalOpen               ] = useState(false);
  const [ initialValuesAggiorna,       setInitialValuesAggiorna     ] = useState([]);

  // Recupera l'accessToken da localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  // Configura gli headers della richiesta con l'Authorization token
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  

  const navigateToCercaCandidato = (params) => {
    navigate('/recruiting', { state: { params } });
  };
  
  const fetchData = async () => {
    try {
      const associatiResponse   = await axios.get(`http://89.46.196.60:8443/need/react/match/associati/mod/${id}`, { headers: headers});
      const storicoResponse     = await axios.get(`http://89.46.196.60:8443/need/react/storico/${id}`, { headers: headers});
      const associabiliResponse = await axios.get(`http://89.46.196.60:8443/staffing/react/mod`, { headers: headers});
      const ownerResponse       = await axios.get("http://89.46.196.60:8443/aziende/react/owner", { headers: headers});
      const statoResponse       = await axios.get("http://89.46.196.60:8443/associazioni/react/stati", { headers: headers});

      if (Array.isArray(ownerResponse.data)) {
        const ownerOptions = ownerResponse.data.map((owner) => ({
          label: owner.descrizione,
          value: owner.id,
        }));
        setOwnerOptions(ownerOptions);

        if (Array.isArray(statoResponse.data)) {
          const statoOptions = statoResponse.data.map((stato) => ({
            label: stato.descrizione,
            value: stato.id,
          }));
          setStatoOptions(statoOptions);



      if (Array.isArray(associatiResponse.data)) {
        const associatiConId = associatiResponse.data.map((associati) => ({ ...associati }));
        setAssociatiOptions(associatiConId);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", associatiResponse.data);
      }

      if (Array.isArray(storicoResponse.data)) {
        const storicoConId = storicoResponse.data.map((storico) => ({ ...storico }));
        setStoricoOptions(storicoConId);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", storicoResponse.data);
      }


      if (Array.isArray(associabiliResponse.data)) {
        const associabiliConId = associabiliResponse.data.map((associabili) => ({ ...associabili }));
        setFilteredAssociabili(associabiliConId);
        setOriginalAssociabili(associabiliConId);
      } else {
        console.error("I dati ottenuti non sono nel formato Array:", associabiliResponse.data);
      }
      }
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

  const handleSearch = (filteredData) => {
    setFilteredAssociabili(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    setFilteredAssociabili(originalAssociabili);
  };

  const handleDeleteAssociati = async (row) => {
    try {
      const idNeed = parseInt(id); 
      const idCandidato = row;
      const url = `http://89.46.196.60:8443/associazioni/react/rimuovi/candidato/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
      const response = await axios.delete(url, { headers: headers});;
      fetchData();
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };
  



  const handleDeleteStorico = async (row) => {
    try {
      const idAssociazione = row;
      const url = `http://89.46.196.60:8443/associazioni/react/rimuovi/associa/${idAssociazione}`;
      const response = await axios.delete(url, { headers: headers});;;
      fetchData();
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };
  

  const handleAssocia = async (row) => {
    try {
      const idNeed = parseInt(id); 
      const idCandidato = row.id;
      const url = `http://89.46.196.60:8443/associazioni/react/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
      const response = await axios.post(url, { headers: headers});
      fetchData();
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
  };
  


  const handleOpenModal = (selectedRow) => {

    const initialValuesWithDefaults = {
      cliente: nomeAzienda || "",
      idNeed: descrizione || "",
      candidato: `${selectedRow.nome || ""} ${selectedRow.cognome || ""}`.trim(),
      idCandidato: selectedRow.id || "",

    };
  

    fieldsAggiorna.forEach(field => {
      if (field.type === 'select' && !initialValuesWithDefaults[field.name]) {
        initialValuesWithDefaults[field.name] = field.options?.[0]?.value || '';
      }
    });
  
    setInitialValuesAggiorna(initialValuesWithDefaults); 
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleSaveModal = async (selectedRow) => {
    try {


      const idNeedNum = parseInt(id); 
      const idCandidatoNum = parseInt(selectedRow.idCandidato); 
  

      const updatedValues = {
        ...selectedRow,
        idNeed: idNeedNum,
        idCandidato: idCandidatoNum
      };
  
      delete updatedValues.candidato;
      delete updatedValues.cliente;
  
  
      const response = await axios.post(`http://89.46.196.60:8443/associazioni/salva`, updatedValues, { headers: headers });;
      fetchData();
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    }
    handleCloseModal();
  };
  


  const fieldsAggiorna = [
    { label: "Cliente",                 name: "cliente",               type: "text" },
    { label: "Need",                    name: "idNeed",                type: "text" },
    { label: "Candidato",               name: "candidato",             type: "text" },
    { label: "Stato",                   name: "stato",                 type: "select", options: statoOptions || [] },
    { label: "Data Aggiornamento",      name: "dataModifica",          type: "date" },
    { label: "Owner",                   name: "idOwner",               type: "select", options: ownerOptions || [] },
  ];

  const disableFields = {
    cliente:      true,
    idNeed:       true,
    candidato:  true,
  };

const tableStorico = [
  { field: "dataModifica",            headerName: "Data",         flex: 1 },
  { field: "tipo",                    headerName: "Tipologia",    flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.candidato && params.row.candidato.tipo ? params.row.candidato.tipo.descrizione : "N/A"}
    </div>
  )},
  { field: "candidato",                    headerName: "Nome",         flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "left"  }}>
        <div onClick={() => navigateToCercaCandidato(params.row)}>
        {params.row.candidato ? `${params.row.candidato.nome} ${params.row.candidato.cognome}` : ""}
          </div>
  </div>


    ),},
    { field: "tipologia",             headerName: "Job Title",    flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.candidato && params.row.candidato.tipologia.descrizione}
      </div>
    ),},
    { field: "stato",                 headerName: "Stato",       flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione}
      </div>
    ),},
  { field: "owner",                   headerName: "Owner",       flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.owner && params.row.owner.descrizione}
    </div>
  )},
  { field: "azioni",                  headerName: "Azioni",       flex: 1, renderCell: (params) => (
    <div>
      <DeleteButton onClick={handleDeleteStorico} id={params.row.id}/>
    </div>
  ), },
];


const tableAssociati = [
  { field: "nome",                    headerName: "Nome",         flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "left"  }}>
      <div onClick={() => navigateToCercaCandidato(params.row)}>
            
            {params.row.nome} {params.row.cognome}
          </div>
  
  </div>
    ),},
  { field: "email",                   headerName: "E-Mail",        flex: 1.4},
  { field: "tipologia",               headerName: "Job Title",     flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.tipologia && params.row.tipologia.descrizione
        ? params.row.tipologia.descrizione
        : "N/A"}
    </div>
  ),},
  { field: "rating",                  headerName: "Rating",        flex: 1},
  { field: "stato",                   headerName: "Stato",         flex: 1, renderCell: (params) => (
    <div style={{ textAlign: "start" }}>
      {params.row.stato && params.row.stato.descrizione
        ? params.row.stato.descrizione
        : "N/A"}
    </div>
  ),},
  { field: "dataUltimoContatto",       headerName: "Contatto",       flex: 1},
  { field: "elimina",                  headerName: "Elimina",        flex: 1, renderCell: (params) => (
    <div>
      <DeleteButton onClick={handleDeleteAssociati} id={params.row.id}/>
    </div>
  ), },
  { field: "status",                   headerName: "Status",         flex: 1, renderCell: (params) => (
    <div>
      <Button
      onClick={() => handleOpenModal(params.row)}
      sx={{ backgroundColor: '#14D928',
      fontWeight: 'bold',
      color: 'black',
      "&:hover": {
        backgroundColor: "#14D928",
        transform: "scale(1.05)",
        color: 'black',
        
      },
    }}>Aggiorna</Button>
    </div>
  )},
];

  const tableAssociabili = [
    { field: "nome",                    headerName: "Nome",          flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "left"  }}>
          <div onClick={() => navigateToCercaCandidato(params.row)}>
            
  {params.row.nome} {params.row.cognome}
</div>

      
    </div>
  
  
      ),},
    { field: "email",                   headerName: "E-Mail",         flex: 1.4},
    { field: "tipologia",               headerName: "Job Title",      flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.tipologia && params.row.tipologia.descrizione
          ? params.row.tipologia.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "rating",                  headerName: "Rating",         flex: 1},
    { field: "stato",                   headerName: "Stato",         flex: 1, renderCell: (params) => (
      <div style={{ textAlign: "start" }}>
        {params.row.stato && params.row.stato.descrizione
          ? params.row.stato.descrizione
          : "N/A"}
      </div>
    ),},
    { field: "dataUltimoContatto",      headerName: "Contatto",        flex: 1},
    { field: "azioni",                  headerName: "Azioni",          flex: 1, renderCell: (params) => (
      <div>
        <Button
        onClick={() => handleAssocia(params.row)}
        sx={{ backgroundColor: '#14D928',
        fontWeight: 'bold',
        color: 'black',
        "&:hover": {
          backgroundColor: "#14D928",
          transform: "scale(1.05)",
          color: 'black',
        },
      }}>Associa</Button>
      </div>
    )},
  ];


  return (
          
    <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100vh', width: '100vw', overflow: 'hidden'}}>
    <Sidebar2 />
    <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', overFlowY: 'auto', width: '100vw'}}>
          <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
    <ModalBox
      fields=        {fieldsAggiorna}
      initialValues= {initialValuesAggiorna}
      disableFields= {disableFields}
      onSubmit=      {handleSaveModal}
      title="Modifica stato Associazioni"
      showBackButton={true}
      onClose={handleCloseModal}
      
    />
  {/* </Box> */}
</Modal>
          <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.8rem'}}>{descrizione} {nomeAzienda}</Typography>

          <Box sx={{ height: '90vh', marginTop: '20px', width: '100vw', marginBottom: '2%'}}>
                <MyDataGridPerc data={filteredAssociabili} columns={tableAssociabili} title="Candidati"             getRowId={(row) => row.id} searchBoxComponent={() => (<NeedMatchSearchBox data={needMatch}
          onSearch={handleSearch}
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalAssociabili={originalAssociabili}/>)} />
          </Box>
          <Box sx={{ marginBottom: '20px'}}>

                <MyDataGridPerc data={storicoOptions}      columns={tableStorico}   title="Storico"               getRowId={(row) => row.id} />
                </Box>
                <Box sx={{ marginBottom: '2%'}}>

                <MyDataGridPerc data={associatiOptions}    columns={tableAssociati} title="Candidati Associati"   getRowId={(row) => row.id} />
                </Box>
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
        </Box>
        </Box>
  );
};

export default NeedMatchPages;