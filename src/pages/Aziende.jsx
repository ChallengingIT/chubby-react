import React, { useState, useEffect }       from "react";
import { useNavigate }                      from "react-router-dom";
import { Link }                             from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../components/Sidebar";
import MyDataGrid                           from "../components/MyDataGrid";
import AziendeSearchBox                     from "../components/searchBox/AziendeSearchBox.jsx";
import MyButton                             from '../components/MyButton.jsx';
import EditButton                           from "../components/button/EditButton.jsx";
import DeleteButton                         from "../components/button/DeleteButton.jsx";
import ListButton                           from "../components/button/ListButton.jsx";
import SmileGreenIcon                       from "../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                      from "../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                         from "../components/button/SmileRedIcon.jsx";

import "../styles/Aziende.css";


const Aziende = () => {

  const [ aziende,                    setAziende                ] = useState([]);
  const [ originalAziende,            setOriginalAziende        ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState("");
  const [ filteredAziende,            setFilteredAziende        ] = useState([]);


  // const translateOwnerNames = async (aziendeData) => {
  //   try {
  //     const updatedAziende = await Promise.all(
  //       aziendeData.map(async (aziende) => {
  //         if (aziende.idOwner !== null && aziende.idOwner !== undefined) {
  //           try {
  //             const responseOwner = await axios.get(`http://localhost:8080/aziende/react/owner/${aziende.idOwner}`);
  //             const descrizioneOwner = responseOwner.data.descrizione;

  //             return { ...aziende, descrizioneOwner };
  //           } catch (error) {
  //             console.error(`Errore durante la traduzione dell'azienda con id=${aziende.idOwner}:`, error);
  //             return aziende;
  //           }
  //         }
  //         return aziende;
  //       })
  //     );

  //     return updatedAziende;
  //   } catch (error) {
  //     console.error("Errore durante la traduzione delle aziende:", error);
  //     return aziendeData;
  //   }
  // };


 const fetchDataAndTranslate = async () => {
  try {
    const response = await axios.get("http://localhost:8080/aziende/react");
    if (Array.isArray(response.data)) {
      const aziendeConId = response.data.map((aziende) => ({ ...aziende }));

      // const aziendeConOwner = await translateOwnerNames(aziendeConId);
      setAziende(aziendeConId);
      setFilteredAziende(aziendeConId);
      setOriginalAziende(aziendeConId);
      console.log(aziendeConId);
    } else {
      console.error("I dati ottenuti non sono nel formato Array:", response.data);
    }
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
  }
};

useEffect(() => {
  fetchDataAndTranslate();
}, []);


  const navigate = useNavigate();

  const navigateToAggiungiAzienda = () => {
    navigate("/aziende/aggiungi");
  };

  // const navigateToDettaglioAzienda = ( id, nomeAzienda) => {
  //   navigate(`/aziende/dettaglio/${id}`);
  // };



  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/aziende/react/elimina/${id}`);
      const updatedAziende = originalAziende.filter((azienda) => azienda.id !== id);
      setAziende(updatedAziende);
      setOriginalAziende(updatedAziende);
      setFilteredAziende(updatedAziende);
      console.log("ELIMINATA AZIENDA: ", id);
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
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
    { field: "status",         headerName: "Stato",            width: 70,  renderCell: (params) => getSmileIcon(params), },
    { field: "denominazione",  headerName: "Ragione Sociale", width: 150, renderCell: (params) => (
      <Link
          to={`/aziende/dettaglio/${params.row.id}`}
          state={{ aziendaData: { ...params.row
            // , descrizioneOwner: params.row.descrizioneOwner 
          } }}
        >
          {params.row.denominazione}
        </Link>
    ), },
    {
      field: "owner",
      headerName: "Owner",
      width: 150,
      valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A",
    },
    { field: "tipologia",      headerName: "Tipologia",       width: 150 },
    { field: "citta",          headerName: "Città",           width: 250 },
    { field: "paese",          headerName: "Paese",           width: 100 },
    { field: "need",           headerName: "Need",            width: 100, renderCell: (params) => ( 
    <div>
     <Link
  to={`/need/${params.row.id}`}
  state={{ aziendaData: { ...params.row} }}
>
  <ListButton />
</Link>
      </div> ),  },
    { field: "azioni",         headerName: "Azioni",          width: 300, renderCell: (params) => (
      <div>
<Link
  to={`/aziende/modifica/${params.row.id}`}
  state={{ aziendaData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner } }}
>
  <EditButton />
</Link>
        <DeleteButton onClick={handleDelete} id={params.row.id}/>
      </div>
    ), },
  ];

  const handleSearch = (filteredData) => {
    setFilteredAziende(filteredData);
  };
  

  const handleReset = () => {
    setSearchText(""); 
    setFilteredAziende(originalAziende);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Aziende</div>
          <MyButton onClick={navigateToAggiungiAzienda}>Aggiungi Azienda</MyButton>
      <AziendeSearchBox 
          data={aziende}
          onSearch={handleSearch}
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalAziende={originalAziende}/>
            <MyDataGrid data={filteredAziende} columns={columns} title="Aziende" getRowId={(row) => row.id} />
        </div>
      </div>
    </div>
  );
};

export default Aziende;


