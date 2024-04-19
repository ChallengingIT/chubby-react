
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Autocomplete,
  Box,
  Typography,
  
} from '@mui/material';
import CloseIcon                            from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'; 
import axios from 'axios';
import dayjs from 'dayjs';




function AppuntamentoModal({ open, handleClose }) {


    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
  
    const headers = {
      Authorization: `Bearer ${token}`
    };


    const [ ownerOptions,    setOwnerOptions   ] = useState([]);
    const [formData, setFormData] = useState({
    destinatari: '',
    oggetto: '',
    luogo: '',
    data: '',
    ownerIds: '',
    note: '',
  });

  const handleChange = (name) => (event) => {
    const newValue = event.target.value;
    setFormData({...formData, [name]:newValue});
};


    // Aggiornamento del gestore di eventi per gestire oggetti dayjs
    const handleDateChange = (newValue) => {
        setFormData({...formData, data: newValue});
    };

const onClose = () => {
    setFormData({
    destinatari: '',
    oggetto: '',
    luogo: '',
    data: '',
    ownerIds: '',
    note: '',
    owner: '',
    });
    handleClose();
};



  const optionSelect = async() => {
    try{
        const ownerResponse    = await axios.get("http://localhost:8080/aziende/react/owner",    { headers: headers }   );
        if (Array.isArray(ownerResponse.data)) {
            const ownerOptions = ownerResponse.data.map((owner) => ({
              label: owner.descrizione,
              value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
          }
    } catch(error) {
        console.error("Errore durante il recupero delle province:", error);
    }
  };

  useEffect(() => {
    optionSelect()
  }, []);



  const handleSubmitAppuntamento = async () => {
        const inizio = `${dayjs(formData.data).format('YYYY-MM-DDTHH:mm')}:00.000+01:00`;
        const fine = dayjs(inizio).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss') + '.000+01:00';
        const ownerString = formData.owner.join(';');



      const datiDaInviare = {
        oggetto: formData.oggetto ,
        luogo: formData.luogo ,
        note: formData.note ,
        destinatari: formData.destinatari ,
        inizio: inizio ,
        fine: fine ,
        ownerIds: ownerString
      };
      try {
        const responseInviaAppuntamento = await axios.post("http://localhost:8080/calendar/insert", datiDaInviare, { headers: headers });
        if (responseInviaAppuntamento.data === 'OK') {
          onClose();
        }
      } catch (error) {
        console.error("Errore durante l'invio dell'appuntamento: ", error);
      }
  };
  


  return (
        <Dialog 
        open={open} 
        onClose={handleClose} 
        sx={{ 
            '& .MuiDialog-paper': {
            width: '70%',
            maxWidth: '70%',
            },
        }}
        >
        <LocalizationProvider dateAdapter={AdapterDayjs}>

        <Box sx={{ display:'flex', justifyContent: 'flex-end'}}>
        <Button onClick={onClose} variant="outlined" sx={{mt: 3, mr: 3 ,backgroundColor: 'transparent', border: 'none', color: '#898989', '&:hover': { border: 'none', color: 'red', transform: 'scale(1.1)'}}}startIcon={<CloseIcon sx={{backgroundColor: 'transparent'}}/>}/>

        </Box>
      <DialogTitle sx={{ mb: 2, display: 'flex', justifyContent: 'center', fontWeight: '600'}}>Aggiungi Appuntamento</DialogTitle>
      <DialogContent sx={{ p: 12}}  >
        <Box >
        <TextField
          id="destinatari-box"
          label="Destinatari*"
          fullWidth
          variant='filled'
          name="destinatari"
          value={formData.destinatari}
          onChange={handleChange('destinatari')}
          sx={{
            height: '4em',
            p: 1,
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: '#00B400',
            },
            
            }} 
        />
        <Typography variant="h6" sx={{ mb: 1, mt: 0.3, ml: 1, color: '#666565', fontSize: '1em'}}>* Inserire i destinatari separati da " ; "</Typography>


        <TextField
        id='oggetto-box'
          label="Oggetto"
          fullWidth
          variant='filled'
          name="oggetto"
          value={formData.oggetto}
          onChange={handleChange('oggetto')}
          sx={{
            height: '4em',
            mb: 4,
            p: 1,
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: '#00B400',
            },
            }} 
        />

        <TextField
        id='luogo-box'
          label="Luogo"
          fullWidth
          variant='filled'
          name="luogo"
          value={formData.luogo}
          onChange={handleChange('luogo')}
          sx={{
            height: '4em',
            mb: 2,
            p: 1,
            borderRadius: '20px', 
            backgroundColor: '#EDEDED', 
            '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
            },
            '& .MuiFilledInput-underline:after': {
                borderBottomColor: 'transparent',
            },
            '& .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '&:hover .MuiFilledInput-root::before': {
                borderBottom: 'none', 
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: '#00B400',
              },
            }} 
        />

        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                
                <DateTimePicker
                label="Data e ora"
                value={formData.data}
                onChange={handleDateChange}
                fullWidth

                renderInput={(params) => <TextField {...params} variant="filled" fullWidth/>}
                ampm={true}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                sx={{
                    height: '4em',
                    mb: 2,
                    p: 1,
                    borderRadius: '20px', 
                    backgroundColor: '#EDEDED',
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-underline:after': {
                        borderBottomColor: 'transparent',
                    },
                    '& .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    },
                    '&:hover .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    }
                }}
                />

            </LocalizationProvider> */}


<TextField
  id='data-box'
  label="Data e ora"
  type="datetime-local"
  name="data"
  value={formData.data}
  onChange={handleChange('data')}
  fullWidth
  variant='filled'
  sx={{
    height: '4em',
    mb: 2,
    p: 1,
    borderRadius: '20px',
    backgroundColor: '#EDEDED',
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      '&:after': { 
        borderBottomColor: '#00B400',
      },
    },
    '& .MuiFilledInput-underline:before': { 
      borderBottomColor: '#00B400',
    },
    '& .MuiFilledInput-underline:hover:before': { 
      borderBottomColor: ['#00B400', '!important'], 
    },
    '& .MuiFilledInput-underline:after': { 
      borderBottomColor: '#00B400', 
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#00B400',
    },
  }}
/>





<FormControl fullWidth >
    <Autocomplete
        id="owner-combo-box"
        options={ownerOptions}
        getOptionLabel={(option) => option.label}
        multiple 
        value={ownerOptions.filter(option => (formData.owner ?? []).includes(option.value)) || []} 
        onChange={(event, newValues) => {
            const selectedValues = newValues.map(newValue => newValue.value); 
            handleChange('owner')({ target: { value: selectedValues || [] }}); 
        }}
        renderInput={(params) => (
            <TextField 
                {...params} 
                label="Owner" 
                variant='filled' 
                sx={{
                    height: '4em',
                    mb: 2,
                    p: 1,
                    borderRadius: '20px', 
                    backgroundColor: '#EDEDED', 
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-underline:after': {
                        borderBottomColor: 'transparent',
                    },
                    '& .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    },
                    '&:hover .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: '#00B400',
                    },
                }}  
            />
        )}
    />
</FormControl>



        <TextField
        id='messaggio-box'
                label="Testo del messaggio"
                name="note"
                multiline
                rows={3}
                onChange={handleChange('note')}
                value={formData.note}
                fullWidth
                variant='filled'
                sx={{
                    mb: 2,
                    p: 1,
                    borderRadius: '20px', 
                    backgroundColor: '#EDEDED', 
                    '& .MuiFilledInput-root': {
                        backgroundColor: 'transparent',
                    },
                    '& .MuiFilledInput-underline:after': {
                        borderBottomColor: 'transparent',
                    },
                    '& .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    },
                    '&:hover .MuiFilledInput-root::before': {
                        borderBottom: 'none', 
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: '#00B400',
                    },
                    }}
                    />
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <Button onClick={handleSubmitAppuntamento} variant="contained" sx={{ borderRadius: '5px', backgroundColor: '#00B401', '&:hover': { backgroundColor: '#00B401', transform: 'scale(1.1)'}}}>
          Invia
        </Button>
        </Box>

            </Box>
      </DialogContent>
      <DialogActions>
        
      </DialogActions>
      </LocalizationProvider>

    </Dialog>
  );
}

export default AppuntamentoModal;
