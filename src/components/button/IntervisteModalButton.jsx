import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function IntervisteModalButton({ hasIntervista, onClick, to, recruitingData }) {
  const navigate = useNavigate();

  const handleEditAction = () => {
    if (hasIntervista && onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Button 
      // variant="contained" 
      size="medium" 
      startIcon={<VisibilityIcon sx={{ color: hasIntervista ? "black" : '#808080'}} />} 
      onClick={handleEditAction}
      sx={{
        marginRight: '10%',
        backgroundColor: 'transparent',
        color: 'black',
        borderRadius: '50%',
        minWidth: '2em', 
        width: '2em', 
        height: '2em',
        padding: '0',
        '& .MuiButton-startIcon': {
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '&:hover': {
          backgroundColor: 'transparent',
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

export default IntervisteModalButton;
