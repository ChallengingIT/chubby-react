import React, { useEffect, useState } from 'react'
import { Box, Grid, Skeleton, Typography } from '@mui/material'
import RicercheHiring from '../components/ricerche/RicercheHiring'
import Tabella from '../components/Tabella';
import { useNavigate } from 'react-router-dom';
import EditButton from '../components/button/EditButton.jsx';
import TabellaHiring from '../components/TabellaHiring.jsx';
import SchemePage from '../components/SchemePage.jsx';
import axios from 'axios';

const Hiring = () => {

  const navigate = useNavigate();
  const [ openFiltri,                 setOpenFiltri           ] = useState(false);
  const [ loading,                    setLoading              ] = useState(false);
  const [ righeTot,                   setRigheTot             ] = useState(0);
  const [ filtri,                     setFiltri               ] = useState(() => {
    const filtriSalvati = sessionStorage.getItem('filtriRicercaHiring');
    return filtriSalvati ? JSON.parse(filtriSalvati) : {
    cliente: null,
    servizi: null,
    scheda: null,
    candidato: null,
    termini: null
    };
});

  //stati per il fetch
    const [ hiringData,                    setHiringData               ] = useState([]);
    const [ terminiOptions,                setTerminiOptions           ] = useState([]);
    const [ serviziOptions,                setServiziOptions           ] = useState([]);
        const [ clienteOptions,             setClienteOptions             ] = useState([]);



  //stati per la paginazione
  const [ pagina,                 setPagina       ] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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




   const fetchData = async () => {

    setLoading(true);

    const filtriDaInviare = {
      idCliente: null,
      idTipoServizio: null,
      idScheda: null,
      idCandidato: null,
      pagina: 0,
      quantita: 10
  };



    try {
        // const response          = await axios.get("http://localhost:8080/staffing/react/mod",          { headers: headers, params: filtriDaInviare });

        const responseHiring    = await axios.get("http://localhost:8080/hiring",                       { headers: headers });
        const responseTermini   = await axios.get("http://localhost:8080/hiring/termini",            { headers: headers });
        const responseServizi   = await axios.get("http://localhost:8080/hiring/servizi",              { headers: headers });
        const responseCliente = await axios.get("http://localhost:8080/aziende/react/select",            { headers: headers });


        if (Array.isArray(responseCliente.data)) {
            setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
            console.error("I dati degli stati ottenuti non sono nel formato Array:", responseCliente.data);
        }



        if (Array.isArray(responseTermini.data)) {
            setTerminiOptions(responseTermini.data.map((termini, index) => ({ label: termini.descrizione, value: termini.id })));
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseTermini.data);
        } 


        if (Array.isArray(responseServizi.data)) {
            setServiziOptions(responseServizi.data.map((servizi, index) => ({ label: servizi.descrizione, value: servizi.id })));
    
        } else {
            console.error("I dati ottenuti non sono nel formato Array:", responseServizi.data);
        } 


        if (Array.isArray(responseHiring.data)) {
            const hiringConId = responseHiring.data.map((hiring) => ({
            ...hiring,
            }));
            setHiringData(hiringConId);
            setHasMore(hiringConId.length >= quantita);
            // setPagina(pagina + 1);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array:",
            responseHiring.data
            );
        }
    //     const { record, hiring } = responseHiring.data;

    // if (hiring && Array.isArray(hiring)) {
    //     setHiringData(hiring); 

    //     if (typeof record === 'number') {
    //         setRigheTot(record);
    //     } else {
    //         console.error("Il numero di record da hiring ottenuto non è un numero: ", record);
    //     }
    // } else {
    //     console.error("I dati ottenuti non contengono 'hiring' come array: ", responseHiring.data);
    // }
        setLoading(false);
        } catch(error) {
        console.error("Errore durante il recupero dei dati: ", error);
        }
    };



    



    useEffect(() => {
      const filtriSalvati = sessionStorage.getItem('filtriRicercaHiring');
      if (filtriSalvati) {
      const filtriParsed = JSON.parse(filtriSalvati);
      setFiltri(filtriParsed);
      
      const isAnyFilterSet = Object.values(filtriParsed).some(value => value);
      if (isAnyFilterSet) {
          handleRicerche();
      } else {
          fetchData();
      }
      } else {
      fetchData();
      }
      // eslint-disable-next-line
  }, []);




const handleRicerche = async () => {
  const isAnyFilterSet = Object.values(filtri).some(value => value);
  if (!isAnyFilterSet) {
      return; 
  }


    const filtriDaInviare = {
      idCliente: filtri.cliente || null,
      idTipoServizio: filtri.servizi || null,
      pagina: 0,
      quantita: 10
    };
    setLoading(true);

    try {
        const responseRicerca          = await axios.get("http://localhost:8080/hiring/ricerca", { headers: headers, params: filtriDaInviare });

      if (Array.isArray(responseRicerca.data)) {
            const hiringConId = responseRicerca.data.map((hiring) => ({
            ...hiring,
            }));
            setHiringData(hiringConId);
            setHasMore(hiringConId.length >= quantita);
            // setPagina(pagina + 1);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array:",
            responseRicerca.data
            );
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dati filtrati:", error);
    } finally {
        setLoading(false);
    }
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


  const handleReset = async () => {
    setFiltri({
    cliente: null,
    servizi: null,
    scheda: null,
    candidato: null,
    termini: null
    });
    // sessionStorage.removeItem("RicercheRecruiting");
    setPagina(0);
    setHiringData([]);

    await fetchData();
};

const navigateToModificaHiring = (id) => {
navigate(`/modificaHiring/${id}`);
};





const columns = [
  { field: "denominazioneCliente",              headerName: "Nome Azienda",            flex: 1.5 },
  { field: "tipoServizio",                      headerName: "Tipo di servizio",        flex: 1.3, renderCell: (params) => {
    const tipoServizio = params.value;
    return `${tipoServizio.descrizione}`;
  }
  },
  { field: "azioni",        headerName: "Azioni",          flex: 1.6, renderCell: (params) => (
    <Box>
      <EditButton onClick={() => {
        navigateToModificaHiring(params.row.id);
      }} />
    </Box>
  ), },];


  return (
    <SchemePage>
      <RicercheHiring 
      filtri={filtri}
      onFilterChange={handleFilterChange}
      onReset={handleReset}
      clienteOptions={clienteOptions}
      serviziOptions={serviziOptions}
      onRicerche={handleRicerche}
      />
<Box container sx={{ mr: 0.2}}>
        { loading ? (
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
          <TabellaHiring
          data={hiringData}
          columns={columns}
          getRowId={(row) => row.id}
          />
        )} 
      </Box>
      </SchemePage>

);
}

export default Hiring