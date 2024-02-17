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
import MyDataGridPerc from "../MyDataGridPerc.jsx";
import Sidebar2 from "./Sidebar2.jsx";

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
    const [ tempDenominazione,   setTempDenominazione ] = useState(searchTerm.denominazione);



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
        

    //fetch sia per la tabella che per la search box
        const fetchData = async () => {
            try {
        
            const responseAziende = await axios.get("http://89.46.67.198:8443/aziende/react/mod",   { headers: headers });
            const responseOwner   = await axios.get("http://89.46.67.198:8443/aziende/react/owner", { headers: headers });
            const responseStato   = await axios.get("http://89.46.67.198:8443/aziende/react/mod",   { headers: headers });
        
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
                    const response = await axios.delete(`http://89.46.67.198:8443/aziende/react/elimina/${deleteId}`, { headers: headers});
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


                const handleSearch2 = () => {
                    const filtered = originalAziende.filter((azienda) => {
                        const matchDenominazione = searchTerm.denominazione ? azienda.denominazione.toLowerCase().includes(searchTerm.denominazione.toLowerCase()) : true;
                        const matchTipologia = searchTerm.tipologia ? azienda.tipologia === searchTerm.tipologia : true;
                        const matchStatus = searchTerm.status ? String(azienda.status) === String(searchTerm.status) : true;
                        const matchOwner = searchTerm.owner ? azienda.owner && azienda.owner.descrizione === searchTerm.owner : true;
                
                        return matchDenominazione && matchTipologia && matchStatus && matchOwner;
                    });
                
                    setFilteredAziende(filtered);

                };

                const handleSearch = async () => {
                    localStorage.setItem("lastSearchAziendeParams", JSON.stringify({
                      denominazione: searchTerm.denominazione || "",
                      tipologia: searchTerm.tipologia || "",
                      status: searchTerm.status || "",
                      owner: searchTerm.owner || "",
                    }));
                    try {
                        const savedSearchTerms = JSON.parse(localStorage.getItem("lastSearchAziendeParams"));

                        const responseSearch = await axios.get("http://89.46.67.198:8443/aziende/react/ricerca/mod", { headers: headers, params: savedSearchTerms
                    })
                    console.log("responseSearch: ", responseSearch); 
                    if (Array.isArray(responseSearch.data)) {
                        const aziendeConId = responseSearch.data.map((aziende) => ({ ...aziende }));
                        setFilteredAziende(aziendeConId);
                        setOriginalAziende(aziendeConId);
                    } else {
                        console.error("I dati ottenuti non sono nel formato Array:", responseSearch.data);
                    }
                    } catch(error) {
                        console.error("Errore durante la ricerca: ", error);
                    }
                  
                  };


            //funzione per resettare i valori di ricerca della search box
            const handleReset = () => {
                setSearchTerm(initialSearchTerm);
                setFilteredData([]);
                setFilteredAziende(originalAziende);
                };




                    const columns = [
                        // { field: "id",             headerName: "aziende.id",              width: 70  },
                        { field: "status",         headerName: "Stato",            flex: 0.4,  renderCell: (params) => getSmileIcon(params), },
                        { field: "denominazione",  headerName: "Cliente",          flex: 1.5,  renderCell: (params) => (
                        <Link to={`/aziende/dettaglio/${params.row.id}`} state={{ aziendaData: { ...params.row} }}>
                            {params.row.denominazione}
                            </Link>
                        ),
                    },
                        { field: "owner",          headerName: "Owner",           flex: 0.6, valueGetter: (params) => params.row.owner && params.row.owner.descrizione || "N/A" },
                        { field: "tipologia",      headerName: "Tipologia",       flex: 1 },
                        { field: "citta",          headerName: "Città",           flex: 1 },
                        { field: "paese",          headerName: "Paese",           flex: 1 },
                        { field: "need",           headerName: "Need",            flex: 0.5, renderCell: (params) => (
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
            //permetto di premero invio ed effettuare la ricerca da qualsiasi punto della pagina
            const handleGlobalKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        };
    
        useEffect(() => {
            document.addEventListener('keydown', handleGlobalKeyDown);
    
            return () => {
                document.removeEventListener('keydown', handleGlobalKeyDown);
            };
        }, []);


                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '0.5%', alignItems: 'center', margin: '0.4%', borderBottom: '2px solid #dbd9d9'}}>
                    {/* Prima colonna */}
                    <Select
                className="dropdown-menu"
                value={searchTerm.status}
                onChange={(e) => setSearchTerm({ ...searchTerm, status: e.target.value })}
                sx={{
                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                }}
                native
                // onKeyDown={handleKeyDown}
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
                                    border: 'none', 
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none',
                                },
                            },
                            
                            display: 'flex', justifyContent: 'center', border: 'solid 1px #c4c4c4', width: '100%', marginTop: '-2%'}}
                        type="text"
                        placeholder="Ragione Sociale"
                        className="text-form"
                        value={searchTerm.denominazione}
                        onChange={(e) => setSearchTerm({ ...searchTerm, denominazione: e.target.value })}
                        // onKeyDown={handleKeyDown}
                    />
                    
                
                    {/* Terza colonna */}
                    <Select
                                className="dropdown-menu"
                                value={searchTerm.owner}
                                onChange={e => setSearchTerm({...searchTerm, owner: e.target.value })}
                                sx={{
                                    marginTop: '1%',
                                    borderRadius: "40px",
                                    fontSize: "0.8rem",
                                    textAlign: "start",
                                    color: "#757575",
                                }}
                                native
                                // onKeyDown={handleKeyDown}
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
                                    marginTop: '1%',
                                    borderRadius: "40px",
                                    fontSize: "0.8rem",
                                    textAlign: "start",
                                    color: "#757575",
                                }}
                                native
                                // onKeyDown={handleKeyDown}
                                >
                                <option value="" disabled>
                                    Tipologia
                                </option>
                                <option value="Cliente">Cliente</option>
                                <option value="Prospect">Prospect</option>
                                <option value="Consulenza">Consulenza</option>
                                
                                </Select>
                
                    {/* Colonna dei pulsanti */}
                    <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '5%', marginLeft: '10px', marginTop: '-5%' }}>
                        <Button
                        className="button-search"
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            width: '2rem',
                            height: "40px",
                            backgroundColor: "#ffb700",
                            color: "black",
                            borderRadius: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "bolder",
                            "&:hover": {
                            backgroundColor: "#ffb700",
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
                            width: '2rem', 
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
                    </Box>
                    </Box>
                );
        };












//return della pagina delle aziende
    return (
        <Box sx={{ display: 'flex', backgroundColor: '#FFB700', height: '100vh', width: '100vw', overflow: 'hidden'}}>
            <Sidebar2 />
            <Box sx={{height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', width: '100vw'}}>
            <Typography variant="h4" component="h1" sx={{ marginLeft: '30px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold', fontSize: '1.8rem'}}>Gestione Aziende</Typography>
            <MyButton onClick={navigateToAggiungiAzienda}>Aggiungi Azienda</MyButton>

            <Box sx={{ height: '90vh', marginTop: '20px', width: '100vw'}}>
            <MyDataGridPerc
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
                backgroundColor: "#FFB700",
                color: "black",
                "&:hover": {
                    backgroundColor: "#FFB700",
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