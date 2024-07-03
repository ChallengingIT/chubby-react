import { Box, Grid, Rating, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useUserTheme } from '../TorchyThemeProvider';
import CustomDatePickerAggiungi from '../fields/CustomDatePickerAggiungi';
import axios from 'axios';

const initialData = [
  { id: 1, name: 'Andrea Rizza', email: 'andrea@example.com', rating: 0, date: '' },
  { id: 2, name: 'Ludovica La Torre', email: 'ludovica@example.com', rating: 0, date: '' },
  { id: 3, name: 'Ramona Ruoppo', email: 'ramona@example.com', rating: 0, date: '' },
  { id: 4, name: 'Marco Sciuto', email: 'marco@example.com', rating: 0, date: '' },
  { id: 5, name: 'Martina Squadrilli', email: 'smartys@example.com', rating: 0, date: '' }
];

const Shortlist = ({ idNeed }) => {
  const theme = useUserTheme();
  const [data, setData] = useState(initialData);
  const [switchStates, setSwitchStates] = useState(data.map(() => false));

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleRatingChange = async (index, newRating) => {
    const newData = [...data];
    newData[index].rating = newRating;
    setData(newData);

    try {
      const responseRating = await axios.post(
        'http://localhost:8080/staffing/salva/rating',
        null, // il corpo della richiesta è nullo, dato che stiamo usando i parametri di query
        {
          headers: headers,
          params: {
            id: newData[index].id,
            rating: newRating
          }
        }
      );
      console.log(responseRating.data); 
    } catch (error) {
      console.error("Errore durante l'invio del rating:", error);
    }
  };

  const handleSwitchChange = (index) => {
    setSwitchStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const handleDateChange = (index, newDate) => {
    const newData = [...data];
    newData[index].date = newDate.date;
    setData(newData);
  };

  return (
    <Box sx={{
      height: 'auto',
      width: '100%',
      mt: 2,
      mb: 2,
      bgcolor: '#D9D9D9',
      borderRadius: '20px',
      p: 2
    }}>
      {data.map((item, index) => (
        <Box key={index} sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'white',
          borderRadius: '20px',
          p: 2,
          mb: 2
        }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={2}>
              <Typography variant="h8">{item.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">{item.email}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Rating
                value={item.rating}
                onChange={(event, newValue) => handleRatingChange(index, newValue)}
                max={4}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomDatePickerAggiungi
                name="date"
                // label="Date"
                onChange={(newDate) => handleDateChange(index, newDate)}
                values={{ date: item.date }}
              />
            </Grid>
            <Grid item xs={2}>
              <Switch
                checked={switchStates[index]}
                onChange={() => handleSwitchChange(index)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'green',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 0, 0.08)',
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'green',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default Shortlist;
