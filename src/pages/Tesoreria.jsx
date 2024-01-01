import React              from "react";
import Sidebar            from "../components/Sidebar";
import Button             from "@mui/material/Button";
import MyDataGrid         from "../components/MyDataGrid";
import TesoreriaSearchBox from "../components/searchBox/TesoreriaSearchBox.jsx";

import "../styles/Tesoreria.css";

const Tesoreria = () => {

  const columns = [
    // { field: "id",              headerName: "ID",                 width: 70  },
    { field: "ragioneSociale",  headerName: "Ragione Sociale",    width: 150 },
    { field: "stato",           headerName: "Stato",              width: 100 },
    { field: "owner",           headerName: "Owner",              width: 100 },
    { field: "tipologia",       headerName: "Tipologia",          width: 950 },
  ];


  const initialData = [
    { id: 1, ragioneSociale: "AON",           tipologia: "Cliente",       stato: "Verde",  owner: "RM" },
    { id: 2, ragioneSociale: "Eurobet",       tipologia: "Consulenza",    stato: "Rosso",  owner: "RT" },
    { id: 3, ragioneSociale: "Lottomatica",   tipologia: "Consulenza",    stato: "Giallo", owner: "MS" },
    { id: 4, ragioneSociale: "Fendi",         tipologia: "Cliente",       stato: "Rosso",  owner: "EU" },
    { id: 5, ragioneSociale: "Kering",        tipologia: "Consulenza",    stato: "Giallo", owner: "RM" },
    { id: 6, ragioneSociale: "Hotels.com",    tipologia: "Consulenza",    stato: "Verde",  owner: "RM" },
    { id: 7, ragioneSociale: "Sisal",         tipologia: "Cliente",       stato: "Giallo", owner: "RT" },
    { id: 8, ragioneSociale: "Armani",        tipologia: "Cliente",       stato: "Verde",  owner: "MS" },
    { id: 9, ragioneSociale: "Apple",         tipologia: "Consulenza",    stato: "Verde",  owner: "RM" },
  ];


  const [tableData, setTableData] = React.useState(initialData);

  const handleSearch = (filteredData) => {
    setTableData(filteredData);
  };
  const handleReset = () => {
    setTableData(initialData);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="page-name">Tesoreria</div>
            <TesoreriaSearchBox data={initialData} onSearch={handleSearch} onReset={handleReset}/>
          {/* <div className="table-container">
            <MyDataGrid data={tableData} columns={columns}/>
          </div>
          <div className="table-container" style={{marginBottom: '20px',}}>
            <MyDataGrid data={tableData} columns={columns}/>
          </div> */}
          <div className="row-container2">
            <Button
                className="button-add"
                variant="contained"
                size="medium"
                sx={{
                width: "100%",
                maxWidth: "210px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.6rem",
                fontWeight: "bolder",
                padding: "0.5rem 1rem",
                "&:hover": {
                  backgroundColor: "#ffb800",
                  transform: "scale(1.05)",
                },
              }}
            >
              Salva
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tesoreria;
