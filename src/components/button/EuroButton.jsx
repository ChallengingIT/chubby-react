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
        sx={{backgroundColor: '#ffb800',
        color: 'black',
        borderRadius: '40px',
        justifyContent: 'end !important',
        marginRight: '15px',
        "&:hover": {
            backgroundColor: "#ffb800",
            transform: "scale(1.05)",
            color: 'white',
        },
        }}
  
            />
    );
}

export default EuroButton