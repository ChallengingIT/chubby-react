import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import SidebarTorchy from '../components/SidebarTorchy';    

import { Button, Box, Grid, TextField, InputAdornment, Select, Dialog, DialogContent, Typography, ThemeProvider, LinearProgress, MenuItem } from "@mui/material";
import NeedCardTorchy from '../components/card/NeedCardTorchy';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; //aziende




function NeedTorchy2() {

    const navigate = useNavigate();

    const [ originalNeed, setOriginalNeed ] = useState([]);
    const [openFiltri, setOpenFiltri] = useState(false);
    const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || '');
    const [orderDate, setOrderDate] = useState('');
    const [ tipologia, setTipologia] = useState('');

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              const responseNeed = await axios.get("http://89.46.196.60:8443/need/react/modificato", { headers: headers });
              if (Array.isArray(responseNeed.data)) {
                const searchTerm = localStorage.getItem("searchTerm") || '';
                  filterData(responseNeed.data, searchTerm);
                  let data = responseNeed.data;
                  if (searchTerm.length > 0) {
                    data = responseNeed.data.filter(need =>
                      need.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
                  );        
                  }
                  data.sort((a, b) => b.week.localeCompare(a.week));

                  setOriginalNeed(data) ;

                } else {
                  console.error("I dati ottenuti non sono nel formato Array:", responseNeed.data);
              }
          } catch (error) {
              console.error("Errore durante il recupero dei dati:", error);
          }
      };

      fetchData();
  }, []); 

  const filterData = (data, searchTerm) => {
    if (searchTerm.trim() === '') {
        setOriginalNeed(data);
    } else {
        const filteredData = data.filter(need =>
            need.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOriginalNeed(filteredData);
    }
};




  useEffect(() => {
      filterData(originalNeed, searchTerm);
      localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm, originalNeed]);

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
  };



  
    


            const handleTipologiaChange = (event) => {
              return null;
            };

            const handleOpenFiltri = () => {
                setOpenFiltri(true);
            };
    
            const handleCloseFiltri = () => {
                setOpenFiltri(false);
            
            };
    
            const navigateToAggiungi = () => {
                navigate('/need/aggiungi');
            }

            useEffect(() => {
              const results = originalNeed.filter(need =>
                  need.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setOriginalNeed(results);
          }, [searchTerm, originalNeed]);
      
          



          useEffect(() => {
            const sortNeeds = () => {
              let sortedNeeds = [...originalNeed];
              if (orderDate === "Meno recente") {
                sortedNeeds.sort((a, b) => a.week.localeCompare(b.week));
              } else if (orderDate === "Più recente") {
                sortedNeeds.sort((a, b) => b.week.localeCompare(a.week));
              }
              setOriginalNeed(sortedNeeds);
            };
          
            sortNeeds();
          }, [orderDate, originalNeed]);
          
          const handleDateFilterChange = (event) => {
            setOrderDate(event.target.value);
          };
      

           
    
    
           


            const datiNeed = originalNeed.map(need => ({
                id: need.id || null,
                descrizione: need.descrizione || null,
                week: need.week || null,
                tipologia: need.tipologia || null,
                tipo: need.tipo || null,
                // skills: need.skills || null,
                location: need.location || null,

            }));





            return (
                <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
                <SidebarTorchy />
                <Box sx={{ flexGrow: 1, p: 3, marginLeft: '13.2em', marginTop: '0.5em', marginBottom: '0.8em', marginRight: '0.8em', backgroundColor: '#FEFCFD', borderRadius: '10px', minHeight: '98vh' }}>
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FEFCFD', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px',  marginBottom: '4rem' }}>
                <Button variant="contained" color="primary" onClick={navigateToAggiungi} sx={{
                    backgroundColor: '#00853C',
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': {
                    backgroundColor: '#00853C',
                    transform: 'scale(1.05)',
                    },
                }}>
                    + Aggiungi Need
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Barra di ricerca */}
                    <TextField
                        id="search-bar"
                        variant="outlined"
                        placeholder="Cerca"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#00853C' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: '25em',
                            mb: 0.5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '0px', 
                                '& fieldset': {
                                    borderColor: '#00853C', 
                                    borderRadius: '4px 0 0 4px', // Imposta il borderRadius solo per gli angoli di sinistra
                                    borderRight: 'none', // Rimuove il bordo di destra
                                },
                                '&:hover fieldset': {
                                    borderColor: '#00853C', 
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00853C', 
                                },
                            },
                        }}
                    />

                    <TextField
                    id="search-location"
                    variant="outlined"
                    placeholder="Azienda"
                    // value={searchTermLocation}
                    // onChange={handleSearchChangeLocation}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessCenterIcon sx={{ color: '#00853C' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      mb: 0.5,

                      '& .MuiOutlinedInput-root': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeft: 0,
                        borderColor: '#00853C',
                        '&:hover fieldset': {
                          borderColor: '#00853C', 
                        },
                        '&.Mui-focused': {
                          borderColor: '#00853C',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'black', 
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00853C',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'black', 
                      },
                      '& .MuiPlaceholder-root': {
                        color: 'black', 
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00853C', 
                      },
                    }}
                  />
                </Box>

                <Button variant="contained" color="primary" onClick={handleOpenFiltri} sx={{
                    backgroundColor: '#00853C',
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': {
                    backgroundColor: '#00853C',
                    transform: 'scale(1.05)',
                    },
                }}>
                    Filtra per: 
                </Button>                
    
                </Box>
            {/* Main Content Area */}
            <Grid container spacing={2}>
            {originalNeed.map((need, index) => (
                    <Grid item xs={12} md={6} key={index}>
                    <NeedCardTorchy 
                    valori={need}
                     />
                </Grid>
                  ))}
                </Grid>
                </Box>

                <Dialog
  open={openFiltri}
  onClose={handleCloseFiltri}
  maxWidth="m"
  PaperProps={{
    sx: {
      position: 'fixed', 
      top: 0, 
      right: 0, 
      margin: '16px', 
    }
  }}
  >     
     <DialogContent >
            <Box sx={{ display: 'flex', justifyContent:'center', mb: 2, gap: 3, width: '30em' }}>
            <Select
                    displayEmpty
                    value={orderDate}
                    onChange={handleDateFilterChange}
                    sx={{ width: '8em', backgroundColor: '#00853C', color: '#FEFCFD', borderRadius: '10px', height: '2em' }}
                  >
                    <MenuItem value="" disabled>Data</MenuItem>
                    <MenuItem value="Meno recente">Meno recente</MenuItem>
                    <MenuItem value="Più recente">Più recente</MenuItem>
                  </Select>


                  <Select
                      displayEmpty
                      value={tipologia} 
                      onChange={handleTipologiaChange} 
                      sx={{ width: '8em', backgroundColor: '#00853C', color: '#FEFCFD', borderRadius: '10px', height: '2em' }}
                    >
                      <MenuItem value="" disabled>Tipologia</MenuItem>
                      <MenuItem value="Informatica">Informatica</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                    </Select>
                </Box>
                </DialogContent>
                </Dialog>

                </Box>
            );
};

export default NeedTorchy2;