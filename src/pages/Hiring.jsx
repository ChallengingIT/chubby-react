import React, { useEffect, useState } from 'react'
import { Box, Grid, Skeleton, Typography } from '@mui/material'
import RicercheHiring from '../components/ricerche/RicercheHiring'
import Tabella from '../components/Tabella';
import { useNavigate } from 'react-router-dom';
import EditButton from '../components/button/EditButton.jsx';

const Hiring = () => {

  const navigate = useNavigate();

  const [ openFiltri,                 setOpenFiltri           ] = useState(false);
  const [ loading,                    setLoading              ] = useState(true);
  const [ righeTot,                   setRigheTot             ] = useState(0);
  const [ filtri,                     setFiltri               ] = useState(() => {
    const filtriSalvati = sessionStorage.getItem('filtriRicercaHiring');
    return filtriSalvati ? JSON.parse(filtriSalvati) : {

      };
  });



  //stati per la paginazione
  const [ pagina,                 setPagina       ] = useState(0);
  const quantita = 10;

  const userHasRole = (role) => {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
      return false;
    }
    const userObj = JSON.parse(userString);
    return userObj.roles.includes(role);
  };

      //funzione per il cambio pagina
      const handlePageChange = (newPage) => {
        setPagina(newPage);
        // fetchMoreData(newPage);
    };

    useEffect(() => {
      sessionStorage.setItem('filtriRicercaRecruiting', JSON.stringify(filtri));
    }, [filtri]);



  
  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const handleFilterChange = (name) => (event) => {
    const newValue = event.target.value;
    setFiltri(currentFilters => {
        const newFilters = { ...currentFilters, [name]: newValue };
          setPagina(0);
        return newFilters;
    });
  };

  useEffect(() => {
    // Controllo se tutti i filtri sono vuoti 
    const areFiltersEmpty = Object.values(filtri).every(value => value === null || value === '');
    if (areFiltersEmpty) {
        // fetchData();
    } else {
        // handleRicerche();
    }
  }, [filtri, pagina]);


  const handleReset = () => {
    setFiltri({

    });
    sessionStorage.removeItem("RicercheRecruiting");
    setPagina(0);

    // fetchData();
};

const navigateToModificaHiring = (id) => {
navigate(`/modificaHiring/${id}`);
};



const columns = [
  // { field: "id",            headerName: "ID",             width: 70  },
  { field: "nome",              headerName: "Nome",            flex: 1.5 },
  { field: "tipologia",         headerName: "Tipologia",       flex: 1.3
  },
  { field: "cliente",          headerName: "Cliente",          flex: 2},
  { field: "descrizione",      headerName: "Descrizione",      flex: 1.4, 
  // renderCell: (params) => (
  //   <div style={{ textAlign: "start" }}>
  //     {params.row.tipologia && params.row.tipologia.descrizione
  //       ? params.row.tipologia.descrizione
  //       : "N/A"}
  //   </div>
  // ),
}, 
  { field: "status",         headerName: "Status",         flex: 0.6,
  // renderCell: (params) => (
  //     <div style={{ textAlign: "start" }}>
  //       {params.row.owner && params.row.owner.descrizione
  //         ? params.row.owner.descrizione
  //         : "N/A"}
  //     </div>
  //   ),
  },

  { field: "valorePreventivoEconomico",      headerName: "Valore preventivo economico",       flex: 1 },
  { field: "valoreConsuntivo",               headerName: "Valore consuntivo",                 flex: 1 },
  { field: "azioni",        headerName: "Azioni",          flex: 1.6, renderCell: (params) => (
    <Box>
      <EditButton onClick={() => {
        navigateToModificaHiring(params.row.id);
      }} />
    </Box>
  ), },];







  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', minHeight: '100vh', flexGrow: 1}}>
    <Box sx={{
      p: 2,
      ml: 25,
      mt: 1.5,
      mb: 0.5,
      mr: 0.8,
      backgroundColor: '#FEFCFD',
      borderRadius: '20px',
      height: '97vh',
      width: '100%',
      flexDirection: 'column',
      overflow: 'auto',
    }}>
      <RicercheHiring 
      // filtri={filtri}
      // onFilterChange={handleFilterChange}
      // onReset={handleReset}
      // tipologiaOptions={tipologiaOptions}
      // statoOptions={statoOptions}
      // tipoOptions={tipoOptions}
      // onRicerche={handleRicerche}
      />
      <Box sx={{ mr: 0.2}}>
        {/* { loading ? (
            <>
            {Array.from(new Array(1)).map((_, index) => (
                <Grid item xs={12} md={6} key={index}>
                    <Box sx={{ marginRight: 2, marginBottom: 2 }}>
                        <Skeleton variant="rectangular" width="100%" height={118} />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                    </Box>
                </Grid>
            ))}
            </>   
        ) : ( 
          <Tabella
          // data={originalRecruiting} 
          columns={columns} 
          title="Hiring" 
          getRowId={(row) => row.id}
          pagina={pagina}
          quantita={quantita}
          righeTot={righeTot}
          onPageChange={handlePageChange} 
        />
        )} */}
        <Typography variant="h4"  sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>WORK IN PROGRESS</Typography>
      </Box>
    </Box>
  </Box>

);
}

export default Hiring