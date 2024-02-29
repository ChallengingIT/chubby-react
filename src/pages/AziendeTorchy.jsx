import React, { useState, useEffect }                                                             from "react";
import { useNavigate, useLocation }                                                               from "react-router-dom";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Card, CardContent, CardActions, InputAdornment }       from "@mui/material";
import { useParams }                                                                              from "react-router-dom";
import SidebarTorchy from "../components/SidebarTorchy";
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChecklistIcon from '@mui/icons-material/Checklist';



function AziendeTorchy() {



    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <SidebarTorchy />
        <Box sx={{ flexGrow: 1, p: 3, marginLeft: '12.5em', marginTop: '0.5em', marginBottom: '0.5em', marginRight: '0.5em', backgroundColor: '#FEFCFD', borderRadius: '10px',  }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Need</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Barra di ricerca */}
            <TextField
              id="search-bar"
              variant="outlined"
              placeholder="Cerca"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#00853C' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '25em',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#00853C', // Colore del bordo di default
                  },
                  '&:hover fieldset': {
                    borderColor: '#00853C', // Colore del bordo al passaggio del mouse
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00853C', // Colore del bordo quando il componente è in focus
                  },
                },
              }}
            />
          </Box>

          <Button variant="contained" color="primary" sx={{
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
        </Box>


        {/* Main Content Area */}
        <Grid container spacing={2}>
            {/* Card 1 */}
            <Grid item xs={12} md={6}>
                <Card raised sx={{ borderRadius: '10px' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#00853C', fontWeight: 'bold' }}>
                    Java Software Engineer
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Milano, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    1 Settimana fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <BusinessCenterIcon sx={{ color: '#00853C', mr: 1 }} />
                        In sede - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'black',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            {/* Card 2 */}
            <Grid item xs={12} md={6}>
                <Card raised sx={{ borderRadius: '10px' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#00853C', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <BusinessCenterIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'black',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            {/* Aggiungi altre card qui seguendo lo stesso schema */}
            <Grid item xs={12} md={6}>
                <Card raised sx={{ borderRadius: '10px' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#00853C', fontWeight: 'bold' }}>
                    Junior project manager                    
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <BusinessCenterIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'black',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            
            </Grid>
        </Box>
        </Box>

    )
    }

    export default AziendeTorchy