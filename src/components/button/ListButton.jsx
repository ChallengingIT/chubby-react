import React from 'react';
import ListIcon from '@mui/icons-material/List';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ListButton({ onClick, to, rowData }) {
  const navigate = useNavigate();

  const handleEditAction = () => {
    if (onClick) {
      onClick(rowData.id);
    } else if (to) {
      navigate(to);
    } else {
      console.warn("L'URL non è definito");
    }
  };

  return (
    <Button 
      variant="contained" 
      size="medium" 
      startIcon={<ListIcon />} 
      onClick={handleEditAction}
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

export default ListButton;
