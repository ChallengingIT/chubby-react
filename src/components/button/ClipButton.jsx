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
              marginRight: '10%',
              backgroundColor: '#00853C',
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
                backgroundColor: '#00853C',
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

export default ClipButton;
