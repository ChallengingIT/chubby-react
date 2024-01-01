import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Input, Box, Typography, Checkbox, ListItemText, FormHelperText } from '@mui/material';

const InvioAllegati = () => {
  const [staff, setStaff] = useState({
    nome: '',
    cognome: '',
    email: '',
    // Add other staff details as necessary
  });
  const [skill, setSkill] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [files, setFiles] = useState([]);



  const demoSkill = [
    { id: '1', name: 'Skill 1' },
    { id: '2', name: 'Skill 2' },
    { id: '3', name: 'Skill 3' },
    { id: '4', name: 'Skill 4' },
    { id: '5', name: 'Skill 5' },
  ];

  useEffect(() => {
    // Impostare qui le skill reali
    setSkill(demoSkill);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
  };

  const handleSkillChange = (event) => {
    // Verifica che l'evento e i suoi target siano definiti e che il target abbia selectedOptions
    if (event?.target?.selectedOptions) {
      const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
      setSelectedSkill(selectedOptions);
    } else {
      // Se non c'è un iterable, resetta o gestisci l'errore come preferisci
      setSelectedSkill([]);
    }
  };
  
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    for (const key in staff) {
      formData.append(key, staff[key]);
    }
  
    // Converti selectedSkill in interi e poi in una stringa JSON
    const skillAsIntegers = selectedSkill.map(skill => parseInt(skill, 10));
    formData.append('skill', JSON.stringify(skillAsIntegers));
  
    for (const file of files) {
      formData.append('file', file);
    }
  
    // Aggiungere un log per visualizzare i dati prima dell'invio
    console.log("Invio i seguenti dati al server:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      const response = await fetch('http://localhost:8080/hr/react/staff/salva', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();
      console.log("Risposta del server:", result); // Handle the response accordingly
    } catch (error) {
      console.error('Submission failed', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nome" value={staff.nome} onChange={handleInputChange} placeholder="Nome" />
      <input type="text" name="cognome" value={staff.cognome} onChange={handleInputChange} placeholder="Cognome" />
      <input type="email" name="email" value={staff.email} onChange={handleInputChange} placeholder="Email" />
      <input type="date" name="dataNascita" value={staff.dataNascita} onChange={handleInputChange} placeholder='Data di nascita' />
      <input type="text" name="luogoNascita" value={staff.luogoNascita} onChange={handleInputChange} placeholder="Luogo di nascita" />
      <input type="text" name="cellulare" value={staff.cellulare} onChange={handleInputChange} placeholder="cellulare" />
      <input type="text" name="citta" value={staff.citta} onChange={handleInputChange} placeholder="citta" />
      <input type="date" name="dataInizio" value={staff.dataInizio} onChange={handleInputChange} placeholder='dataInizio' />
      <input type="date" name="dataScadenza" value={staff.dataScadenza} onChange={handleInputChange} placeholder='dataScadenza' />
      <input type="text" name="idFacolta" value={staff.idFacolta} onChange={handleInputChange} placeholder='idFacolta' />
      <input type="text" name="iban" value={staff.iban} onChange={handleInputChange} placeholder="iban" />
      <input type="text" name="ral" value={staff.ral} onChange={handleInputChange} placeholder="ral" />







      <input type="number" name="anniEsperienza" value={staff.anniEsperienza} onChange={handleInputChange} placeholder="Anni Esperienza" />
      {/* Add other input fields as necessary */}
      <input type="select" name="livelloScolastico" value={staff.livelloScolastico} onChange={handleInputChange} placeholder="Livello scolastico" />
      <input type="select" name="idTipologia" value={staff.idTipologia} onChange={handleInputChange} placeholder="Job Title" />
      <input type="select" name="idTipoContratto" value={staff.idTipoContratto} onChange={handleInputChange} placeholder="Contratto" />
      <input type="note" name="note" value={staff.note} onChange={handleInputChange} placeholder="Note" />





      <div>
      <select multiple value={selectedSkill} onChange={handleSkillChange}>
        {skill.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
      </div>

     
      <FormControl fullWidth style={{ marginTop: '20px', marginBottom: '20px' }}>
        <InputLabel id="demo-multiple-chip-label">Skill</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          multiple
          value={selectedSkill}
          onChange={handleSkillChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={skill.find(skill => skill.id === value)?.name} />
              ))}
            </Box>
          )}
        >
          {skill.map((skill) => (
            <MenuItem key={skill.id} value={skill.id}>
              {skill.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
             

      <input type="file" multiple onChange={handleFileChange} />

      <button type="submit">Invia</button>
    </form>
  );
};

export default InvioAllegati;
