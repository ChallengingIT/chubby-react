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
          backgroundColor: '#14D928',
          color: 'black',
          borderRadius: '40px',
          justifyContent: 'end !important',
          marginRight: '15px',
          "&:hover": {
            backgroundColor: "#14D928",
            transform: "scale(1.05)",
            color: 'white',
          },
        }}
        
      />
    );
  }
  

export default PaperButton;
