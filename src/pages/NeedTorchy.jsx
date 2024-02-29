import React, { useState, useEffect }                                                             from "react";
import { useNavigate, useLocation }                                                               from "react-router-dom";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Card, CardContent, CardActions, InputAdornment, LinearProgress, Select }       from "@mui/material";
import { useParams }                                                                              from "react-router-dom";
import SidebarTorchy from "../components/SidebarTorchy";
import SearchIcon from '@mui/icons-material/Search';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InfoIcon from '@mui/icons-material/Info';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WorkIcon from '@mui/icons-material/Work';


import { createTheme, ThemeProvider } from '@mui/material/styles';




function NeedTorchy() {

    const navigate = useNavigate();
        const [openStato, setOpenStato] = useState(false);
        const [openFiltri, setOpenFiltri] = useState(false);
        const [progress, setProgress] = useState(50);

        const handleOpenStato = () => {
            setOpenStato(true);
        };

        const handleCloseStato = () => {
            setOpenStato(false);
        };

        const handleOpenFiltri = () => {
            setOpenFiltri(true);
        };

        const handleCloseFiltri = () => {
            setOpenFiltri(false);
        
        };

        const navigateTo = () => {
            navigate('/need/aggiungi');
        }


        const theme = createTheme({
            components: {
            MuiLinearProgress: {
                styleOverrides: {
                colorPrimary: {
                    backgroundColor: '#e0e0e0', 
                },
                barColorPrimary: {
                    backgroundColor: '#00853C', 
                },
                },
            },
            },
        });



        return (
            <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: 'auto', width: '100vw' }}>
            <SidebarTorchy />
            <Box sx={{ flexGrow: 1, p: 3, marginLeft: '13.2em', marginTop: '0.5em', marginBottom: '0.8em', marginRight: '0.8em', backgroundColor: '#FEFCFD', borderRadius: '10px' }}>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#FEFCFD', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px',  marginBottom: '4rem' }}>
            <Button variant="contained" color="primary" onClick={navigateTo} sx={{
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
            {/* Card 1 */}
            <Grid item xs={12} md={6}>
                <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Java Software Engineer
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Milano, Lombardia, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    1 Settimana fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In sede - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            {/* Card 2 */}
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Marketing
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
                        In remoto - A tempo pieno - Livello medio
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                        Competenze: Java, Hibernate e altre 4
                        </InputAdornment>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 4}}>
                    <InputAdornment position="start" >
                        <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                        Tipologia: Informatica
                        </InputAdornment>
                    </Typography>
                </CardContent>
                <CardActions>
                <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#00853C',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#00853C',
                            transform: 'scale(1.05)',
                        },
                    }}>Modifica</Button>
                   <Button 
                    size="small"
                    sx={{
                        backgroundColor: '#000000',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>

            {/* Aggiungi altre card qui seguendo lo stesso schema */}
            <Grid item xs={12} md={6}>
            <Card raised sx={{ borderRadius: '10px', maxWidth: '80%', justifyContent: 'center', margin: 'auto' }}>
                <CardContent>
                    {/* Contenuto della Card */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Junior project manager   
                    </Typography>
                    <Button
                        onClick={handleOpenStato}
                        size="small"
                        sx={{
                        color: '#000000',
                        minWidth: 'auto', // Riduce la larghezza minima del bottone
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        }}
                    >
                        <InfoIcon />
                    </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:0.5}}>
                    Roma, Lazio, Italia
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5}}>
                    2 Giorni fa
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt:2}}>
                    <InputAdornment position="start" >
                        <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
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
                        backgroundColor: '#000000',
                        color: 'white',
                        ml: 1,
                        '&:hover': {
                            backgroundColor: '#000000',
                            transform: 'scale(1.05)',
                        },
                    }}>Note</Button>
                </CardActions>
                </Card>
            </Grid>
            
            </Grid>
            </Box>

            <Dialog open={openStato} onClose={handleCloseStato} maxWidth="xl" fullWidth sx={{ width: '100%' }}>
        <DialogContent >
          <Typography variant="h6">Stato del Need</Typography>
          <Box sx={{ width: '100%', mb: 2 }}>
          <ThemeProvider theme={theme}>
  <LinearProgress variant="determinate" value={progress} />
</ThemeProvider>
          </Box>
          <Typography variant="body1">Progresso: {progress}%</Typography>
        </DialogContent>
      </Dialog>


      <Dialog
  open={openFiltri}
  onClose={handleCloseFiltri}
  maxWidth="m"
  PaperProps={{
    sx: {
      position: 'fixed', // Imposta la posizione fissa per il Paper interno
      top: 0, // Allinea al lato superiore dello schermo
      right: 0, // Allinea al lato destro dello schermo
      margin: '16px', // Aggiungi un po' di margine (opzionale, per estetica)
    }
  }}
  >     
     <DialogContent >
            <Box sx={{ display: 'flex', justifyContent:'space-between', mb: 2, gap: 3, width: '30em' }}>
            <Select
                  className="dropdown-menu"
                //   value={searchTerm.tipologia}
                //   onChange={(e) => setSearchTerm({...searchTerm, tipologia: e.target.value })}
                  sx={{
                    width: '20em',
                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                //   onKeyDown={handleKeyDown}
                >
                  <option value="" disabled>
                    Tipologia
                  </option>
                  <option value="Marketing">Marketing</option>
                  <option value="Informatica">Informatica</option>
                  <option value="Business">Business</option>
                </Select>

                <Select
                  className="dropdown-menu"
                  sx={{
                    width: '20em',

                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                >
                  <option value="" disabled>
                    Modalità
                  </option>
                  <option value="In sede">In sede</option>
                  <option value="Ibrido">Ibrido</option>
                  <option value="In remoto">In remoto</option>
                </Select>

                <Select
                  className="dropdown-menu"
                  sx={{
                    width: '20em',

                    marginTop: '1%',
                    borderRadius: "40px",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                  }}
                  native
                >
                  <option value="" disabled>
                    Data
                  </option>
                  <option value="Più recente">Più recente</option>
                  <option value="Meno recente">Meno recente</option>
                
                </Select>
                </Box>
                </DialogContent>
                </Dialog>




        </Box>

    )
    }

    export default NeedTorchy