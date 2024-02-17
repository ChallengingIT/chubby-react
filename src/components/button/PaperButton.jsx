import React from 'react';
import NoteIcon from '@mui/icons-material/Note';
import Button from "@mui/material/Button";

function PaperButton({onClick}) {

  
    return (
      <Button 
        variant="contained" 
        size="medium" 
        startIcon={<NoteIcon />} 
        onClick={onClick}
        sx={{
          marginRight: '10%',
          backgroundColor: '#FFB700',
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
            backgroundColor: '#FFB700',
            transform:'scale(1.05)',
            color: 'black',
            cursor: 'pointer',
            borderRadius: '50%',
            borderStyle: 'none',
          }
        }}
        
      />
    );
  }
  

export default PaperButton;
