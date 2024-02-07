import React, { useState, useEffect }       from "react";
import { useNavigate }                      from "react-router-dom";
import { Link }                             from "react-router-dom";
import axios                                from "axios";
import Sidebar                              from "../../components/Sidebar";
import MyDataGrid                           from "../../components/MyDataGrid";
import MyButton                             from '../../components/MyButton.jsx';
import EditButton                           from "../../components/button/EditButton.jsx";
import DeleteButton                         from "../../components/button/DeleteButton.jsx";
import ListButton                           from "../../components/button/ListButton.jsx";
import SmileGreenIcon                       from "../../components/button/SmileGreenIcon.jsx";
import SmileOrangeIcon                      from "../../components/button/SmileOrangeIcon.jsx";
import SmileRedIcon                         from "../../components/button/SmileRedIcon.jsx";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Select,
  TextField
} from '@mui/material';

const Aziende2 = () => {


        const initialSearchTerm = {
            denominazione: '',
            tipologia: '',
            status: '',
            owner:'',
        };
        
        
        const accessToken = localStorage.getItem("accessToken"); 
        
        const headers = {
        Authorization: `Bearer ${accessToken}`,
        };


    //stati per la pagina delle aziende
    const [ aziende,                    setAziende                ] = useState([]);
    const [ originalAziende,            setOriginalAziende        ] = useState([]);
    const [ searchText,                 setSearchText             ] = useState("");
    const [ filteredAziende,            setFilteredAziende        ] = useState([]);
    const [ openDialog,                 setOpenDialog             ] = useState(false);
    const [ deleteId,                   setDeleteId               ] = useState(null);
    const [ content,                    setContent                ] = useState("");

    //stati per la search box
    const [ searchTerm,          setSearchTerm        ] = useState(initialSearchTerm);
    const [ ownerOptions,        setOwnerOptions      ] = useState([]);
    const [ tipologiaOptions,    setTipologiaOptions  ] = useState([]);
    const [ statoOptions,        setStatoOptions      ] = useState([]);
    const [ filteredData,        setFilteredData      ] = useState([]);


        const convertStatus = (data) => {
            if (data && data.status) {
            const numericalStatus = data.status;
            switch (numericalStatus) {
                case 1:
                return 'Verde';
                case 2:
                return 'Giallo';
                case 3:
                return 'Rosso';
                default:
                return 'Sconosciuto';
            }
            }
        
            return 'Sconosciuto';
        };
        
        
        const handleKeyDown = (e) => {
            if (e.keyCode === 13) { // Verifica se è stato premuto il tasto "Invio"
            handleSearch();     
            }
        };


    //fetch sia per la tabella che per la search box
        const fetchData = async () => {
            try {
        
            const responseAziende = await axios.get("http://89.46.196.60:8443/aziende/react/mod",   { headers: headers });
            const responseOwner   = await axios.get("http://89.46.196.60:8443/aziende/react/owner", { headers: headers });
            const responseStato   = await axios.get("http://89.46.196.60:8443/aziende/react/mod",   { headers: headers });
        
            if (Array.isArray(responseAziende.data)) {
                const aziendeConId = responseAziende.data.map((aziende) => ({ ...aziende }));
                setFilteredAziende(aziendeConId);
                setOriginalAziende(aziendeConId);
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseAziende.data);
            }




            if (Array.isArray(responseStato.data)) {
                const statoOptionsData = responseStato.data.map((status) => ({
                label: convertStatus(status),
                value: status,
                }));
            
                setStatoOptions(statoOptionsData);
                if (!searchTerm.status && searchTerm.status !== "") {
                setSearchTerm({ ...searchTerm, status: "" });
                }
            } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseStato.data);
            }


            if (Array.isArray(responseOwner.data)) {
                setOwnerOptions(responseOwner.data.map((owner, index) => ({ label: owner.descrizione, value: owner.id })));
                } else {
                console.error("I dati ottenuti non sono nel formato Array:", responseOwner.data);
                } 

            } catch (error) {
            console.error("Errore durante il recupero dei dati:", error);
            }
        };
        
        useEffect(() => {
            fetchData();
        }, []);


            const openDeleteDialog = (id) => {
                setDeleteId(id);
                setOpenDialog(true);
                };
            
                const navigate = useNavigate();
            
                const navigateToAggiungiAzienda = () => {
                navigate("/aziende/aggiungi");
                };
            
            
            
                const handleDelete = async () => {
                try {
                    const response = await axios.delete(`http://89.46.196.60:8443/aziende/react/elimina/${deleteId}`, { headers: headers});
                    setOpenDialog(false);
                    fetchData();
                } catch (error) {
                    console.error("Errore durante la cancellazione: ", error);
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


                const handleSearch = () => {
                    // Filtra l'array originalAziende in base ai criteri di ricerca
                    const filtered = originalAziende.filter((azienda) => {
                        // Verifica per ciascun criterio di ricerca se il valore nell'azienda corrisponde
                        // Se il criterio di ricerca è vuoto, ignora quel criterio (ritorna true per quel filtro)
                        const matchDenominazione = searchTerm.denominazione ? azienda.denominazione.toLowerCase().includes(searchTerm.denominazione.toLowerCase()) : true;
                        const matchTipologia = searchTerm.tipologia ? azienda.tipologia === searchTerm.tipologia : true;
                        const matchStatus = searchTerm.status ? String(azienda.status) === String(searchTerm.status) : true;
                        const matchOwner = searchTerm.owner ? azienda.owner && azienda.owner.descrizione === searchTerm.owner : true;
                
                        // Ritorna true se l'azienda corrisponde a tutti i criteri di ricerca
                        return matchDenominazione && matchTipologia && matchStatus && matchOwner;
                    });
                
                    // Imposta l'array filtrato come nuovo stato per filteredAziende
                    setFilteredAziende(filtered);

                };
                


            //funzione per resettare i valori di ricerca della search box
            const handleReset = () => {
                setSearchTerm(initialSearchTerm);
                setFilteredData([]);
                setFilteredAziende(originalAziende);
                };




                    const columns = [
                        // { field: "id",             headerName: "aziende.id",              width: 70  },
                        { field: "status",         headerName: "Stato",            flex: 1,  renderCell: (params) => getSmileIcon(params), },
                        { field: "denominazione",  headerName: "Ragione Sociale",   flex: 1,  renderCell: (params) => (
                        <Link to={`/aziende/dettaglio/${params.row.id}`} state={{ aziendaData: { ...params.row} }}>
                            {params.row.denominazione}
                            </Link>
                        ),
                    },
                        { field: "owner",          headerName: "Owner",           flex: 1, valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A" },
                        { field: "tipologia",      headerName: "Tipologia",       flex: 1 },
                        { field: "citta",          headerName: "Città",           flex: 1 },
                        { field: "paese",          headerName: "Paese",           flex: 1 },
                        { field: "need",           headerName: "Need",            flex: 1, renderCell: (params) => (
                        <div>
                        <Link to={`/need/${params.row.id}`} state={{ aziendaData: { ...params.row} }} >
                            <ListButton />
                        </Link>
                        </div>
                        ),
                        },
                        { field: "azioni",         headerName: "Azioni",          flex: 1, renderCell: (params) => (
                        <div>
                        <Link to={`/aziende/modifica/${params.row.id}`} state={{ aziendaData: { ...params.row, descrizioneOwner: params.row.descrizioneOwner } }} >
                        <EditButton />
                        </Link>
                            <DeleteButton onClick={() => openDeleteDialog(params.row.id)} />
                        </div>
                        ),
                    },
                    ];

                //grafica della searchBox
        const SearchBox = () => {
                return (
                    <div className="gridContainer" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'center', margin: '20px 5px', padding: '0 0 20px 0',  borderBottom: '2px solid #dbd9d9',}}>
                    {/* Prima colonna */}
                    <Select
                className="dropdown-menu"
                value={searchTerm.status}
                onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
                sx={{
                    marginTop: '10px',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                }}
                native
                onKeyDown={handleKeyDown}
                >
                <option value="" disabled>
                    Stato
                </option>
                <option value={1}>Verde</option>
                <option value={2}>Giallo</option>
                <option value={3}>Rosso</option>
                </Select>
                    
                
                    {/* Seconda colonna */}
                    <TextField 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  border: 'none', // Rimuove il bordo esterno in tutti i casi
                                },
                                '&:hover fieldset': {
                                  border: 'none', // Assicura che il bordo rimanga nascosto anche al passaggio del mouse
                                },
                                '&.Mui-focused fieldset': {
                                  border: 'none', // Assicura che il bordo rimanga nascosto quando il TextField è in focus
                                },
                            },
                            
                            display: 'flex', justifyContent: 'center', border: 'solid 1px #c4c4c4', width: '100%'}}
                        type="text"
                        placeholder="Ragione Sociale"
                        className="text-form"
                        value={searchTerm.denominazione}
                        onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
                        onKeyDown={handleKeyDown}
                    />
                    
                
                    {/* Terza colonna */}
                    <Select
                                className="dropdown-menu"
                                value={searchTerm.owner}
                                onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
                                sx={{
                                    marginTop: '10px',
                                    borderRadius: "40px",
                                    fontSize: "0.8rem",
                                    textAlign: "start",
                                    color: "#757575",
                                }}
                                native
                                onKeyDown={handleKeyDown}
                                >
                                <option value="" disabled>
                                Owner
                                </option>
                                {ownerOptions.map((option) => (
                                    <option key={option.value} value={option.label}>
                                    {option.label}
                                    </option>
                                ))}
                                </Select>
                    
                
                    {/* Quarta colonna */}
                    <Select
                                className="dropdown-menu"
                                value={searchTerm.tipologia}
                                onChange={(e) => setSearchTerm({...searchTerm, tipologia: e.target.value })}
                                sx={{
                                    marginTop: '10px',
                                    borderRadius: "40px",
                                    fontSize: "0.8rem",
                                    textAlign: "start",
                                    color: "#757575",
                                }}
                                native
                                onKeyDown={handleKeyDown}
                                >
                                <option value="" disabled>
                                    Tipologia
                                </option>
                                <option value="Cliente">Cliente</option>
                                <option value="Prospect">Prospect</option>
                                <option value="Consulenza">Consulenza</option>
                                
                                </Select>
                
                    {/* Colonna dei pulsanti */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button
                        className="button-search"
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            width: '100px',
                            height: "40px",
                            backgroundColor: "#ffb800",
                            color: "black",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "bolder",
                            "&:hover": {
                            backgroundColor: "#ffb800",
                            color: "black",
                            transform: "scale(1.05)",
                            },
                        }}
                        >
                        Cerca
                        </Button>
                        <Button
                        className="ripristina-link"
                        onClick={handleReset}
                        sx={{
                            width: '100px', 
                            color: 'white', 
                            backgroundColor: 'black',
                            height: "40px",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "bolder",
                            "&:hover": {
                            backgroundColor: "black",
                            color: "white",
                            transform: "scale(1.05)",
                            },
                        }}>
                        Reset
                        </Button>
                    </div>
                    </div>
                );
        };












//return della pagina delle aziende
    return (
        <Box sx={{ display: 'flex', backgroundColor: '#14D928', height: '100%', width: '100%', overflow: 'hidden'}}>
            <Sidebar />
            <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
            <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '35px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Aziende</Typography>
            <Box sx={{ height: '90%', marginTop: '40px', width: '100%'}}>
            <MyButton onClick={navigateToAggiungiAzienda}>Aggiungi Azienda</MyButton>
            <MyDataGrid
                data={filteredAziende}
                columns={columns}
                title="Aziende"
                getRowId={(row) => row.id}
                searchBoxComponent={() => (
                    <SearchBox
                        data={aziende}
                        onSearch={handleSearch}
                        onReset={handleReset}
                        searchText={searchText}
                        onSearchTextChange={(text) => setSearchText(text)}
                        OriginalAziende={originalAziende}
                    />
                )}
            />
            </Box>
        </Box>


        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Conferma Eliminazione"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Sei sicuro di voler eliminare questa azienda?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            style={{
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                },
                }}>
                Annulla
            </Button>
            <Button
                onClick={handleDelete}
                color="primary"
                variant="contained"
                type="submit"
                style={{
                backgroundColor: "#14D928",
                color: "black",
                "&:hover": {
                    backgroundColor: "#14D928",
                    color: "black",
                    transform: "scale(1.05)",
                },
                }}>
                Conferma
            </Button>
            </DialogActions>
        </Dialog>

        </Box>  );
    };

    export default Aziende2;