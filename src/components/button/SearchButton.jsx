import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";

function SearchButton({onClick, to}) {
    
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
        startIcon={<SearchIcon />} 
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
        onClick={() => 
            handleEditAction()} 
            />
    );
};

export default SearchButton;