import React from 'react';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import Button from "@mui/material/Button";

function NoteButton({onClick}) {


return (
    <Button 
    variant="contained" 
    size="medium" 
    startIcon={<SpeakerNotesIcon />} 
    onClick={onClick}
    sx={{
        marginRight: '10%',
        backgroundColor: '#14D928',
        color: 'black',
        borderRadius: '50%',
        minWidth: '40px',
        width: '40px',
        height: '40px',
        padding: '0',
        '& .MuiButton-startIcon': {
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '&:hover': {
          backgroundColor: '#14D928',
          transform:'scale(1.05)',
          color: 'black',
          cursor: 'pointer',
          borderRadius: '50%',
          borderStyle: 'none',
        }
      }}
        />
);
};

export default NoteButton;