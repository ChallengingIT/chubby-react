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

export default ListButton;
