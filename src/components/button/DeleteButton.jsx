import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";

function DeleteButton({ onClick, id }) {
  return (
    <Button
      variant="contained"
      size="medium"
      startIcon={<DeleteIcon />}
      sx={{
        backgroundColor: 'red',
        color: 'black',
        borderRadius: '40px',
        justifyContent: 'end !important',
        "&:hover": {
          backgroundColor: "red",
          transform: "scale(1.05)",
          color: 'white',
        },
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default DeleteButton;
