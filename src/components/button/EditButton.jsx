import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function EditButton({ onClick, to, rowData }) {
  const navigate = useNavigate();

  const handleEditAction = () => {
    if (onClick) {
      onClick(rowData.id); // Passa l'ID o i dati necessari all'azione di modifica
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
      startIcon={<EditIcon />} 
      onClick={handleEditAction}
      sx={{
        backgroundColor: '#ffb800',
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

export default EditButton;
