import React from 'react';
import EuroIcon from '@mui/icons-material/Euro';
import Button from "@mui/material/Button";

function EuroButton({onClick}) {
 
    return (
        <Button 
        variant="contained" 
        size="medium" 
        startIcon={<EuroIcon />} 
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
}

export default EuroButton