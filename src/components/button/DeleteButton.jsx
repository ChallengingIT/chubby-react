import React                    from 'react';
import DeleteIcon               from '@mui/icons-material/Delete';
import Button                   from "@mui/material/Button";

function DeleteButton({ onClick, id }) {
  return (
    <Button
      // variant="contained"
      size="medium"
      startIcon={<DeleteIcon />}
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
          color: 'red',
          cursor: 'pointer',
          borderRadius: '50%',
          borderStyle: 'none',
        }
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default DeleteButton;
