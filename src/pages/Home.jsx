import React, { useState }      from "react";
// import axios from 'axios';
import MyDataGrid               from "../components/MyDataGrid";
import Sidebar                  from "../components/Sidebar";

import "../styles/Home.css";

const Home = () => {

  const columns = [
    { field: "id",          headerName: "ID",          width: 70  },
    { field: "priorità",    headerName: "Priorità",    width: 70  },
    { field: "descrizione", headerName: "Descrizione", width: 350, renderCell: (params) => (
      <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
        {params.row.descrizione.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    ), },
    { field: "data",        headerName: "Data",        width: 100 },
  ];


  const initialData = [
    { id: 1, priorità: "1", descrizione: "Sistemista Unix- Roma presenza",                                                                        data: ""      },
    { id: 2, priorità: "1", descrizione: "Sviluppatore Java su diversi progetti Betting, +3 anni di esperienza, Java, Spring,Springboot, Agile.", data: ""      },
    { id: 3, priorità: "1", descrizione: "Head of seller experience	",                                                                            data: ""      },
    { id: 4, priorità: "1", descrizione: "Helpdesk	",                                                                                            data: "Rosso" },
    { id: 5, priorità: "1", descrizione: "Java Developer - Medium Rome e remoto	",                                                                data: ""      },
    { id: 6, priorità: "1", descrizione: "Sviluppatore SAS",                                                                                      data: ""      },
    { id: 7, priorità: "1", descrizione: "Cliente",                                                                                               data: ""      },
    { id: 8, priorità: "1", descrizione: "Cliente",                                                                                               data: ""      },
    { id: 9, priorità: "1", descrizione: "Consulenza",                                                                                            data: ""      },
  ];

  const columns2 = [
    { field: "id",         headerName: "ID",         width: 70  },
    { field: "week",       headerName: "Week",       width: 100 },
    { field: "vinti",      headerName: "Vinti",      width: 100 },
    { field: "persi",      headerName: "Persi",      width: 100 },
    { field: "chiusi",     headerName: "Chiusi",     width: 100 },
    { field: "prioritari", headerName: "Prioritari", width: 100 },
  ];

  const initialData2 = [
    { id: 1, week: "44", vinti: "0", persi: "0", chiusi: "0", prioritari: "0" },
    { id: 2, week: "45", vinti: "0", persi: "0", chiusi: "0", prioritari: "0" },
    { id: 3, week: "46", vinti: "0", persi: "0", chiusi: "0", prioritari: "0" },

  ];

  const columns3 = [
    { field: "id",  headerName: "ID",   width: 70  },
    { field: "week",headerName: "Week", width: 100 },
    { field: "RT",  headerName: "RT",   width: 100 },
    { field: "RM",  headerName: "RM",   width: 100 },
    { field: "MS",  headerName: "MS",   width: 100 },
    { field: "EU",  headerName: "EU",   width: 300 },
  ];

  const initialData3 = [
    { id: 1, week: "44", RT: "0", RM: "0", MS: "1", EU: "0" },
    { id: 2, week: "45", RT: "2", RM: "1", MS: "0", EU: "0" },
    { id: 3, week: "46", RT: "0", RM: "0", MS: "0", EU: "0" },

  ];


  const [tableData]   = useState(initialData);
  const [tableData2]  = useState(initialData2);
  const [tableData3]  = useState(initialData3);

  return (
    <div className="container">
      <div className="content">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="container">
          <div className="primafila">
            <div className="table-container">
            <MyDataGrid data={tableData} columns={columns} title="Need Prioritari" />
            </div>
            <div className="table-container">
              <MyDataGrid data={tableData2} columns={columns2} title="Andamento Need" />
            </div>
          </div>
          <div className="secondafila">
            <div className="table-container2">
              <MyDataGrid data={tableData3} columns={columns3} title="Dashboard Incontri" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
