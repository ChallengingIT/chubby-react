import { Box, Checkbox, Grid, IconButton, Switch, Typography, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useUserTheme } from '../TorchyThemeProvider';
import CloseIcon from "@mui/icons-material/Close";

const initialData = [
  { name: 'Ludovica La Torre', email: 'ludovica@example.com', stato: 'int 1', progress: 50 },
  { name: 'Ramona Ruoppo', email: 'ramona@example.com', stato: 'int 1', progress: 75 },
  { name: 'Andrea Rizza', email: 'andrea@example.com', stato: 'int 1', progress: 30 },
  { name: 'Marco Sciuto', email: 'marco@example.com', stato: 'int 1', progress: 90 }
];

const IntervistePage = () => {
  const theme = useUserTheme();
  const [data, setData] = useState(initialData);
  const [switchStates, setSwitchStates] = useState(data.map(() => false));

  const handleSwitchChange = (index) => {
    setSwitchStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
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
          <Grid container spacing={2} alignItems="center" justifyContent="space-around">
            <Grid item xs={1}>
            <IconButton sx={{
              backgroundColor: "transparent",
              '&:hover': {
                backgroundColor: 'transparent'
              }}}> 
                  <CloseIcon sx={{
                    bgcolor: 'transparent',
                    '&:hover': {
                      color: 'red',
                      backgroundColor: 'transparent'
                    }
                  }} />
            </IconButton>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h8">{item.name}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">{item.email}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="body2">{item.stato}</Typography>
            </Grid>
            <Grid item xs={1}>
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

export default IntervistePage;