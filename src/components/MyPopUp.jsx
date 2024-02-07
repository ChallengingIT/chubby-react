
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button 
} from '@mui/material';

function MyPopUp({ open, onClose, onSave, title }) {
  const [ owner,         setOwner        ] = useState('');
  const [ contatto,      setContatto     ] = useState('');
  const [ commento,      setCommento     ] = useState('');

  const handleSave = () => {
    onSave({ owner, contatto, commento });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{fontWeight: 'bolder'}}>{title}</DialogTitle>
      <DialogContent sx={{width: 500, height: 300 }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FormControl fullWidth style={{ marginRight: '10px' }}>
            <InputLabel id="owner-select-label" sx={{marginRight: '20px'}}>Owner</InputLabel>
            <Select
              labelId="owner-select-label"
              id="owner-select"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              sx={{backgroundColor: '#ececec'}}
            >
              <MenuItem value="RT">RT</MenuItem>
              <MenuItem value="RM">RM</MenuItem>
              <MenuItem value="MS">MS</MenuItem>
              <MenuItem value="EU">EU</MenuItem>
              <MenuItem value="PC">PC</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="contatto-select-label">Contatto</InputLabel>
            <Select
              labelId="contatto-select-label"
              id="contatto-select"
              value={contatto}
              sx={{backgroundColor: '#ececec'}}
              onChange={(e) => setContatto(e.target.value)}
            >
              <MenuItem value="contatto1">Contatto 1</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TextField
          multiline
          rows={4}
          fullWidth
          label="Commento"
          value={commento}
          sx={{backgroundColor: '#ececec', marginTop: '30px'}}
          onChange={(e) => setCommento(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
      <Button
          color="primary"
          onClick={onClose}
          sx={{
            backgroundColor: "#6C757D",
            color: "white",
            "&:hover": {
              backgroundColor: "#6C757D",
              transform: "scale(1.05)",
            },
          }}
        >
          Indietro
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onSave(handleSave)}
          sx={{
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MyPopUp;
