import React from 'react';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import Button from "@mui/material/Button";

function TimesheetButton() {

    const handleEditAction = (id) => {
    console.log(`Editing item with id ${id}`);
    };
return (
    <Button 
    variant="contained" 
    size="medium" 
    startIcon={<PunchClockIcon />} 
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
    onClick={() => 
        handleEditAction()} 
        />
);
};

export default TimesheetButton;