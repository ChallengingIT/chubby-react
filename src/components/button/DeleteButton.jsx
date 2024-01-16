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
        backgroundColor: 'black',
        color: '#ECECEC',
        borderRadius: '40px',
        justifyContent: 'end !important',
        "&:hover": {
          backgroundColor: "#fc2d2d",
          transform: "scale(1.05)",
          color: 'black',
        },
      }}
      onClick={() => onClick(id)}
    />
  );
}

export default DeleteButton;
