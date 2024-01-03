import React from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ClipButton({ onClick, idFile, fileDescrizione }) {
    const navigate = useNavigate();

    const handleDownload = () => {
      console.log("ID File:", idFile);
      console.log("Descrizione File:", fileDescrizione);
      if (onClick && idFile && fileDescrizione) {
        onClick(idFile, fileDescrizione);  // Chiama la funzione handleDownloadCV passata come onClick con l'id del file.
      } else {
        console.warn("L'azione di download o l'ID del file non sono definiti");
      }
    };

    return (
        <Button 
            variant="contained" 
            size="medium" 
            startIcon={<AttachmentIcon />} 
            onClick={handleDownload}  // Usa handleDownload quando il bottone viene cliccato.
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
