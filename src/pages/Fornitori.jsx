import React, { useEffect, useState }         from "react";
import { useNavigate }                        from "react-router-dom";
import axios                                  from "axios";
import Sidebar                                from "../components/Sidebar";
import MyDataGrid                             from "../components/MyDataGrid";
import FornitoriSearchBox                     from "../components/searchBox/FornitoriSearchBox.jsx";
import MyButton                               from '../components/MyButton.jsx';
import EditButton                             from "../components/button/EditButton.jsx";
import DeleteButton                           from "../components/button/DeleteButton.jsx";
import { Link }                               from "react-router-dom";

import "../styles/Fornitori.css";

const Fornitori = () => {
  const navigate = useNavigate();
  const [ fornitori,              setFornitori                        ] = useState([]);
  const [ originalFornitori,      setOriginalFornitori                ] = useState([]);
  const [ searchText,             setSearchText                       ] = useState("");
  const [ filteredFornitori,      setFilteredFornitori                ] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/fornitori/react");
        if (Array.isArray(response.data)) {
        const fornitoriConId = response.data.map((fornitori) => ({ ...fornitori}));
        setOriginalFornitori(fornitoriConId);
        setFilteredFornitori(fornitoriConId);
        console.log(fornitoriConId);
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", response.data);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };


    fetchData();
  }, []);
  

  const navigateToAggiungiFornitori = () => {
    navigate("/fornitori/aggiungi");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/fornitori/react/elimina/${id}`);
      const updatedFornitori = originalFornitori.filter((fornitori) => fornitori.id !== id);
      setFornitori(updatedFornitori);
      setOriginalFornitori(updatedFornitori);
      setFilteredFornitori(updatedFornitori);
    } catch (error) {
      console.error("Errore durante la cancellazione:", error);
    }
  };

  const columns = [
    // { field: "id",              headerName: "ID",               width: 70  },
    { field: "denominazione",   headerName: "Ragione Sociale",  width: 150 },
    { field: "email",           headerName: "Email",            width: 250 },
    { field: "referente",       headerName: "Referente",        width: 200 },
    { field: "cellulare",       headerName: "Cellulare",        width: 100 },
    { field: "azioni",          headerName: "Azioni",           width: 615,  renderCell: (params) => (
      <div>
        <Link
        to={`/fornitori/modifica/${params.row.id}`}
        state={{ fornitoriData: params.row }}
>
        <EditButton  />
        </Link>
        <DeleteButton onClick={handleDelete} id={params.row.id}/>
      </div>
    ), },
  ];


  const handleSearch = (filteredData) => {
    setFilteredFornitori(filteredData);
  };
  const handleReset = () => {
    setSearchText(""); 
    setFilteredFornitori(originalFornitori);
  };


  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Gestione Fornitori</div>
          <MyButton onClick={navigateToAggiungiFornitori}>Gestione Fornitori</MyButton>
          <FornitoriSearchBox data={fornitori}
          onSearch={handleSearch} 
          onReset={handleReset}
          searchText={searchText}
          onSearchTextChange={(text) => setSearchText(text)}
          OriginalFornitori={originalFornitori}/>
            <MyDataGrid data={filteredFornitori} columns={columns} title="Fornitori" getRowId={(row) => row.id}/>
        </div>
      </div>
    </div>
  );
};

export default Fornitori;
