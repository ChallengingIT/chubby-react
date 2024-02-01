import React from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ClipButton({ onClick, idFile, fileDescrizione }) {
    const navigate = useNavigate();

    const handleDownload = () => {
      if (onClick && idFile && fileDescrizione) {
        onClick(idFile, fileDescrizione);  
      } else {
        console.warn("L'azione di download o l'ID del file non sono definiti");
      }
    };

    return (
        <Button 
            variant="contained" 
            size="medium" 
            startIcon={<AttachmentIcon />} 
            onClick={handleDownload} 
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
};

export default ClipButton;
