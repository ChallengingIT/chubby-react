import React from 'react';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import Button from "@mui/material/Button";

function NoteButton({onClick}) {


return (
    <Button 
    variant="contained" 
    size="medium" 
    startIcon={<SpeakerNotesIcon />} 
    onClick={onClick}
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

export default NoteButton;