import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function VisibilityButton({onClick, to, recruitingData}) {
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
    startIcon={<VisibilityIcon />} 
    onClick={handleEditAction}
    sx={{backgroundColor: '#14D928',
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
};

export default VisibilityButton;