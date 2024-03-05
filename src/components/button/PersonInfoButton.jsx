import React from 'react';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function PersonInfoButton({onClick, to}) {
    const navigate = useNavigate();

    const handleEditAction = () => {
      if (to) {
        navigate(to);
      } else {
        console.warn("L'URL non è definito");
      }
        };
   
    
    return (
        <Button 
        variant="contained" 
        size="medium" 
        startIcon={<PersonSearchIcon />} 
        onClick={handleEditAction}
        sx={{
          marginRight: '10%',
          backgroundColor: '#00853C',
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
            backgroundColor: '#00853C',
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

export default PersonInfoButton;