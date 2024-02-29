import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InfoIcon from '@mui/icons-material/Info';
import ApartmentIcon from '@mui/icons-material/Apartment';
import WorkIcon from '@mui/icons-material/Work';
import { createTheme } from '@mui/material/styles';

import { 
        Card, 
        CardContent, 
        Box,
        Typography,
        Button,
        InputAdornment,
        CardActions,
        Dialog,
        DialogContent,
        ThemeProvider,
        LinearProgress
        } from '@mui/material';




        const calculateDateDifference = (weekString) => {
            const [year, week] = weekString.split('-W');
            const firstDayOfYear = new Date(year, 0, 1);
            const weekDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + (week - 1) * 7));
            weekDate.setDate(weekDate.getDate() - weekDate.getDay());
            const currentDate = new Date();
            const diffInMs = currentDate - weekDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          
            if (diffInDays < 7) {
              return `${Math.round(diffInDays)} giorno${Math.round(diffInDays) !== 1 ? 'i' : ''} fa`;
            } else {
              const diffInWeeks = diffInDays / 7;
              return `${Math.round(diffInWeeks)} settiman${Math.round(diffInWeeks) !== 1 ? 'e' : ''} fa`;
            }
          };


const NeedCardTorchy = ({ valori }) => {

    const navigate = useNavigate();
    const [openStato, setOpenStato] = useState(false);
    const [progress, setProgress] = useState(50);



    const handleCardClick = (id) => {
      navigate(`/need/dettaglio/${valori.id}`, { state: { ...valori } });
  };

    const navigateToModifica = (id, event) => {
      event.stopPropagation();
        navigate(`/need/modifica/${valori.id}`, { state: { ...valori } });
    };

    const navigateToAssocia = (id, event) => {
      event.stopPropagation();
      navigate(`/need/match/${valori.id}`, { state: {...valori}});
    };

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


    const handleOpenStato = (event) => {
      event.stopPropagation();
      setOpenStato(true);
  };

  const handleCloseStato = (event) => {
    event.stopPropagation();
      setOpenStato(false);
  };


    const timeDifference = calculateDateDifference(valori.week);


    return (
      
      <Card onClick={handleCardClick} raised sx={{ borderRadius: '20px', maxWidth: '80%', justifyContent: 'center', margin: 'auto', cursor: 'pointer', height: '30vh', border: '2px solid #54AC7C' }}>
        <CardContent>
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

          {/* Contenuto della Card */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography gutterBottom variant="h5" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
              {valori.descrizione}
            </Typography>
            <Button
              onClick={handleOpenStato}
              size="small"
              sx={{
                color: '#000000',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <InfoIcon />
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black' }}>
            {valori.location}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, color: 'black' }}>
            {timeDifference}
          </Typography>
          <Typography variant="body2" color="text.primary"  sx={{ mt: 2, color: 'black' }}>
            <InputAdornment position="start">
              <ApartmentIcon sx={{ color: '#00853C', mr: 1 }} />
              {valori.tipologia.descrizione}
            </InputAdornment>
          </Typography>
          <Typography variant="body2" color="text.primary"  sx={{ mt: 4, color: 'black' }}>
            <InputAdornment position="start">
              <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
              Competenze: {valori.descrizione}
            </InputAdornment>
          </Typography>
          <Typography variant="body2" color="text.primary"  sx={{ mt: 4, color: 'black' }}>
            <InputAdornment position="start">
              <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
              Tipologia: {valori.tipo}
            </InputAdornment>
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            size="small"
            onClick={(event) => navigateToModifica(valori.id, event)}
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
            <Button
            size="small"
            onClick={(event) => navigateToAssocia(valori.id, event)}
            sx={{
              backgroundColor: '#000000',
              color: 'white',
              '&:hover': {
                backgroundColor: '#000000',
                transform: 'scale(1.05)',
              },
            }}>Associa</Button>
        </CardActions>
      </Card>


            

    );
  };

export default NeedCardTorchy