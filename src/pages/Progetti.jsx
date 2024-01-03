import React, { useState, useEffect} from "react";
import { useNavigate }               from "react-router-dom";
import axios                         from "axios";
import { Link }                      from "react-router-dom";
import Sidebar                       from "../components/Sidebar";
import MyDataGrid                    from "../components/MyDataGrid";
import ProgettiSearchBox             from "../components/searchBox/ProgettiSearchBox.jsx";
import MyButton                      from '../components/MyButton.jsx';
import EditButton                    from "../components/button/EditButton.jsx";
import DeleteButton                  from "../components/button/DeleteButton.jsx";

import "../styles/Progetti.css";

const Progetti = () => {
  const [ progetti,                   setProgetti               ] = useState([]);
  const [ originalProgetti,           setOriginalProgetti       ] = useState([]);
  const [ filteredProgetti,           setFilteredProgetti       ] = useState([]);
  const [ searchText,                 setSearchText             ] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/progetti/react");
      if (Array.isArray(response.data)) {
      const progettiConId = response.data.map((progetti) => ({ ...progetti}));
      setOriginalProgetti(progettiConId);
      setFilteredProgetti(progettiConId);
      console.log(progettiConId);
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

  const navigate = useNavigate();

  const navigateToAggiungiProgetti = () => {
    navigate("/progetti/aggiungi");
  };


  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/progetti/react/elimina/${id}`);
  //     const updatedProgetti = originalProgetti.filter((progetti) => progetti.id !== id);
  //     setProgetti(updatedProgetti);
  //     setOriginalProgetti(updatedProgetti);

  //   } catch (error) {
  //     console.error("Errore durante la cancellazione:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/progetti/react/elimina/${id}`);
console.log("Risposta dalla chiamata Delete: ", response);
console.log("ID ELIMINATO: ", id);
fetchData();
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };



  const columns = [
    // { field: "id", headerName: "ID", width: 50 },
    {
      field: "cliente",
      headerName: "Cliente",
      width: 100,
      valueGetter: (params) =>
        (params.row.cliente && params.row.cliente.denominazione) || "N/A",
    },
    { field: "idStaff",                     headerName: "Consulente",               width: 200 },
    { field: "description",                 headerName: "Ruolo",                    width: 100 },
    { field: "inizio",                      headerName: "Inizio",                   width: 100 },
    { field: "scadenza",                    headerName: "Fine",                     width: 100 },
    { field: "rate",                        headerName: "Rate",                     width: 80  },
    { field: "costo",                       headerName: "Costo",                    width: 80  },
    { field: "margine",                     headerName: "Margine",                  width: 80  },
    { field: "marginePerc",                 headerName: "Margine%",                 width: 80  },
    { field: "durata",                      headerName: "Durata",                   width: 80  },
    { field: "durataStimata",               headerName: "D.Stimata",                width: 80  },
    { field: "durataEffettiva",             headerName: "D.Effettiva",              width: 80  },
    { field: "molTotale",                   headerName: "MOL Tot",                  width: 80  },
    { field: "valoreTotale",                headerName: "Valore Tot",               width: 80  },
    {
      field: "azioni",
      headerName: "Azioni",
      width: 200,
      renderCell: (params) => (
        <div>
          <Link
            to={`/progetti/modifica/${params.row.id}`}
            state={{ progettiData: params.row }}
          >
            <EditButton />
          </Link>
          <DeleteButton onClick={handleDelete} id={params.row.id} />
        </div>
      ),
    },
  ];



  // const initialData = [
  //   { id: 1, cliente: "AON",   consulente: "",                    ruolo: "",      inizio: "2023-01-30", fine: "2023-04-02",  rate: "", costo: "",    margine: "",    margineP: "",   durata: "",   dStimata: "", dEffettiva: "", molTot: "0", valoreTot: "0" },
  //   { id: 2, cliente: "AON",   consulente: "",                    ruolo: "",      inizio: "",           fine: "2023-01-30",  rate: "", costo: "21",  margine: "31",  margineP: "43", durata: "10", dStimata: "4",dEffettiva: "0",molTot: "0", valoreTot: "0" },
  //   { id: 3, cliente: "Sisal", consulente: "Ngo Ndjock Angelica", ruolo: "PM",    inizio: "2023-01-30", fine: "2023-04-02	", rate: "", costo: "340", margine: "",    margineP: "",   durata: "",   dStimata: "", dEffettiva: "", molTot: "0", valoreTot: "0" },

  // ];


  // const [tableData, setTableData] = React.useState(initialData);

  const handleSearch = (filteredData) => {
    setFilteredProgetti(filteredData);
  };
  const handleReset = () => {
    setSearchText("");
    setFilteredProgetti(originalProgetti);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Progetti</div>
            <MyButton onClick={navigateToAggiungiProgetti}>Aggiungi Progetto</MyButton>
            <ProgettiSearchBox data={progetti} onSearch={handleSearch} onReset={handleReset} OriginalProgetti={originalProgetti} searchText={searchText} onSearchTextChange={(text) => setSearchText(text)}/>
          {/* <div className="table-container"> */}
            <MyDataGrid data={originalProgetti} columns={columns} title="Progetti" getRowId={(row) => row.id}/>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Progetti;
