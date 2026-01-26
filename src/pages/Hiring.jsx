import React, { useEffect, useState }   from 'react'
import RicercheHiring                   from '../components/ricerche/RicercheHiring'
import { useNavigate }                  from 'react-router-dom';
import EditButton                       from '../components/button/EditButton.jsx';
import SchemePage                       from '../components/SchemePage.jsx';
import TabellaHiring                    from '../components/TabellaHiring.jsx';
import ApiService                       from '../services/ApiService.js';
import { 
    Box,
    Grid, 
    Skeleton, 
    IconButton 
} from '@mui/material'


const Hiring = () => {

    const navigate = useNavigate();
    const [ loading,                    setLoading              ] = useState(false);
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
    const [ clienteOptions,                setClienteOptions           ] = useState([]);

    //stati per la paginazione
    const [ pagina,                 setPagina       ] = useState(0);
    const [hasMore,                 setHasMore      ] = useState(true);
    const quantita = 10;


    const serviziOptions = [
    { value: "Temporary",     label: "Temporary"    },
    { value: "Head Hunting",  label: "Head Hunting" },
    { value: "Staffing",      label: "Staffing"     },
    { value: "Recruiting",    label: "Recruiting"   },
    ];


    useEffect(() => {
        sessionStorage.setItem('filtriRicercaRecruiting', JSON.stringify(filtri));
    }, [filtri]);


    const fetchData = async () => {

        setLoading(true);
    try {
        const responseHiring    = await ApiService.request("getAllHiring");
        const responseCliente   = await ApiService.request("getAziendeSelect");        

        if (Array.isArray(responseCliente.data)) {
            setClienteOptions(responseCliente.data.map((cliente) => ({ label: cliente.denominazione, value: cliente.id })));
        } else {
            console.error("I dati degli stati ottenuti non sono nel formato Array:", responseCliente.data);
        }

        if (Array.isArray(responseHiring.data)) {
            const hiringConId = responseHiring.data.map((hiring) => ({
            ...hiring,
            }));
            setHiringData(hiringConId);
            setHasMore(hiringConId.length >= quantita);
        } else {
            console.error(
            "I dati ottenuti non sono nel formato Array:",
            responseHiring.data
            );
        }
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
    idCliente:          filtri.cliente || null,
    idTipoServizio:     filtri.servizi || null,
    pagina: 0,
    quantita: 10
    };
    setLoading(true);

    try {
        const responseRicerca = await await ApiService.request("ricercaHiring", {}, {}, {}, filtriDaInviare);

    if (Array.isArray(responseRicerca.data)) {
            const hiringConId = responseRicerca.data.map((hiring) => ({
            ...hiring,
            }));
            setHiringData(hiringConId);
            setHasMore(hiringConId.length >= quantita);
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

//   useEffect(() => {
//     // Controllo se tutti i filtri sono vuoti 
//     const areFiltersEmpty = Object.values(filtri).every(value => value === null || value === '');
//     if (areFiltersEmpty) {
//         // fetchData();
//     } else {
//         // handleRicerche();
//     }
//   }, [filtri, pagina]);


    const handleReset = async () => {
        setFiltri({
        cliente: null,
        servizi: null,
        scheda: null,
        candidato: null,
        termini: null
        });
        setPagina(0);
        setHiringData([]);

        await fetchData();
    };

const navigateToModificaHiring = (id) => {
navigate(`/modificaHiring/${id}`);
};

const columns = [
    { field: "denominazioneCliente",              headerName: "Nome Azienda",            flex: 1.5 },
    { field: "azioni",                            headerName: "",                        flex: 1.6, renderCell: (params) => (
        <IconButton sx={{ bgcolor: 'transparent'}}>
        <EditButton onClick={() => {
            navigateToModificaHiring(params.row.id);
        }}
        />
        </IconButton>
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
<Box sx={{ mr: 0.2}}>
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