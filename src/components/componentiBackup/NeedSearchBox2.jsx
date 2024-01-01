// "funzionante" al 18 dicembre 17:30

import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from "axios";



function NeedMatchSearchBox({ onSearch, onReset }) {
  const initialSearchTerm = {
    nome: '',
    cognome: '',
    jobTitle: '',
    tipologia: '',
    seniority: ''
  };


  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [jobTitleOptions, setJobTitleOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const seniorities = [
    { label: 'Neo', value: '0' },
    { label: 'Junior', value: '1' },
    { label: 'Middle', value: '2' },
    { label: 'Senior', value: '3' }
  ];
  

  // const jobTitles = [/* ...job titles here... */];
  // const tipologie = [/* ...tipologie here... */];
  // const seniorities = [/* ...seniorities here... */];

  const handleSearch = () => {
    // Qui inserire la logica per filtrare i dati in base a searchTerm
    onSearch(filteredData);
  };

  const handleReset = () => {
    setSearchTerm(initialSearchTerm);
    onReset();
    setFilteredData([]);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseJobTitle = await axios.get("http://localhost:8080/aziende/react/tipologia");
        const responseTipo = await axios.get("http://localhost:8080/staffing/react/tipo"); 

        //seniority in locale codice: neo=0 ,junior=1 ,middle=2 , senior=3

        
        if (Array.isArray(responseJobTitle.data)) {
          setJobTitleOptions(responseJobTitle.data.map((jobTitle, index) => ({ label: jobTitle.descrizione, value: jobTitle.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseJobTitle.data);
        } 


        if (Array.isArray(responseTipo.data)) {
          setTipoOptions(responseTipo.data.map((tipo, index) => ({ label: tipo.descrizione, value: tipo.id })));
        } else {
          console.error("I dati ottenuti non sono nel formato Array:", responseTipo.data);
        } 
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={2}
    style={{ display: "flex",
        borderRadius: '40px',
        margin: '20px',
        backgroundColor: 'white',
        width: '90%',
        height: "100%",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
}}
    >
      <Grid item xs={3}>
        <TextField
          label="Nome Candidato"
          variant="outlined"
          value={searchTerm.nome}
          onChange={(e) => setSearchTerm({ ...searchTerm, nome: e.target.value })}
          fullWidth
          sx={{  marginLeft:"5px", marginTop: "10px", borderRadius: '40px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '40px' // Applica il borderRadius al bordo del TextField
          } }}
        />
        <TextField
          label="Cognome Candidato"
          variant="outlined"
          value={searchTerm.cognome}
          onChange={(e) => setSearchTerm({ ...searchTerm, cognome: e.target.value })}
          fullWidth
          sx={{ marginLeft:"5px", marginTop: "20px", marginBottom: "10px", borderRadius: '40px',
            '& .MuiOutlinedInput-root': {
            borderRadius: '40px' // Applica il borderRadius al bordo del TextField
          } }}
        />
      </Grid>
      <Grid item xs={3}>
      <FormControl fullWidth>
  <InputLabel
    shrink={false} // Impedisce che la label si riduca
    sx={{
      '&.Mui-focused': { // Nasconde la label quando il Select è in focus
        display: 'none'
      }
    }}
  >

  </InputLabel>
  <Select
  
     sx={{
      width: "100%",
      margin: "10px",
      borderRadius: '40px',
      '.MuiSelect-select': {
        alignItems: "flex-start",
        display: 'flex', // Assicurati che il contenitore interno del Select sia un flex container
        textAlign: 'start', // Allinea il testo a sinistra
      },
      // Quando il Select non è in focus, mostra la label come placeholder
      '&:not(.Mui-focused) .MuiSelect-select': {
   
      }
    }}
    value={searchTerm.jobTitle}
    onChange={(e) => setSearchTerm({ ...searchTerm, jobTitle: e.target.value })}
    displayEmpty 
    MenuProps={{
      sx: {
        '& .MuiMenu-paper': {
          textAlign: 'start'
        }
      }
    }}
  >
    <MenuItem disabled value="">
      <em style={{ marginLeft: '5px', fontStyle: 'normal', fontFamily: 'Arial', color: 'rgba(0, 0, 0, 0.54)' }}>job title</em> 
    </MenuItem>
    {jobTitleOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl fullWidth>
  <InputLabel
    shrink={false} // Impedisce che la label si riduca
    sx={{
      '&.Mui-focused': { // Nasconde la label quando il Select è in focus
        display: 'none'
      }
    }}
  >

  </InputLabel>
  <Select
    sx={{
      width: "100%",
      margin: "10px",
      borderRadius: '40px',
      '.MuiSelect-select': {
        alignItems: "flex-start",
        display: 'flex', // Assicurati che il contenitore interno del Select sia un flex container
        textAlign: 'start', // Allinea il testo a sinistra
      },
      // Quando il Select non è in focus, mostra la label come placeholder
      '&:not(.Mui-focused) .MuiSelect-select': {
   
      }
    }}
    value={searchTerm.tipologia}
    onChange={(e) => setSearchTerm({ ...searchTerm, tipologia: e.target.value })}
    displayEmpty 
    MenuProps={{
      sx: {
        '& .MuiMenu-paper': {
          textAlign: 'start'
        }
      }
    }}
  >
   <MenuItem disabled value="" >
      <em style={{ marginLeft: '5px', fontStyle: 'normal', fontFamily: 'Arial', color: 'rgba(0, 0, 0, 0.54)' }}>tipologia</em> 
    </MenuItem>
    {tipoOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
    ))}
  </Select>
</FormControl>

      </Grid>
      <Grid item xs={3}>
      <FormControl fullWidth>
  <InputLabel
    shrink={false} // Impedisce che la label si riduca
    sx={{
      '&.Mui-focused': { // Nasconde la label quando il Select è in focus
        display: 'none'
      }
    }}
  >
    {/* Label vuota per mantenere la consistenza */}
  </InputLabel>
  <Select
    sx={{
      width: "100%",
      margin: "10px",
      borderRadius: '40px',
      '.MuiSelect-select': {
        alignItems: "flex-start",
        display: 'flex',
        textAlign: 'start',
      },
    }}
    value={searchTerm.seniority}
    onChange={(e) => setSearchTerm({ ...searchTerm, seniority: e.target.value })}
    displayEmpty
    MenuProps={{
      sx: {
        '& .MuiMenu-paper': {
          textAlign: 'start'
        }
      }
    }}
  >
    <MenuItem disabled value="" >
      <em style={{ marginLeft: '5px', fontStyle: 'normal', fontFamily: 'Arial', color: 'rgba(0, 0, 0, 0.54)' }}>Seniority</em> 
    </MenuItem>
    {seniorities.map((level) => (
      <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
    ))}
  </Select>
</FormControl>
      </Grid>
      <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Button
         
          variant="contained"
          onClick={handleSearch}
          sx={{
        
            width: "100%",
            maxWidth: "90px",
            height: "40px",
            backgroundColor: "#ffb800",
            color: "black",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            marginLeft: "20px",
            marginTop: "20px",
            padding: "0.5rem 1rem",
            "&:hover": {
              backgroundColor: "#ffb800",
              color: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Cerca
        </Button>
        <Button  onClick={handleReset}
        sx={{ 
          color: 'white', backgroundColor: 'black',
          width: "100%",
            maxWidth: "90px",
            height: "40px",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            marginLeft: "20px",
            marginTop: "20px",
            padding: "0.5rem 1rem",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              transform: "scale(1.05)",
            },
          }}>
          Reset
        </Button>
      </Grid>
    </Grid>
  );
}

export default NeedMatchSearchBox;
