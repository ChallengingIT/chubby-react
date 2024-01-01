import React from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function ClipButton({onClick, to}) {
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
        startIcon={<AttachmentIcon />} 
        onClick={handleEditAction}
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
};

export default ClipButton;