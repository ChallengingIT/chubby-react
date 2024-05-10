import React                    from 'react';
import CloseIcon                from '@mui/icons-material/Close';
import Button                   from "@mui/material/Button";

function CloseIconButton({ onClick, id }) {
  return (
    <Button
      // variant="contained"
      // size="medium"
      startIcon={<CloseIcon />}
      sx={{
        color: 'black',
        minWidth: '2em',
        height: '2em',
        '&:hover': {
          color:'red',
          cursor: 'pointer',
        },
    }}
      // sx={{
      //   bgcolor: 'transparent',
      //   marginRight: '10%',
      //   color: 'black',
      //   borderRadius: '50%', 
      //   minWidth: '2em', 
      //   width: '2em', 
      //   height: '2em', 
      //   padding: '0', 
      //   '& .MuiButton-startIcon': { 
      //     margin: '0', 
      //     display: 'flex', 
      //     alignItems: 'center', 
      //     justifyContent: 'center' 
      //   },
      //   '&:hover': {
      //     bgcolor: 'transparent',
      //     transform:'scale(1.05)',
      //     color: 'red',
      //     cursor: 'pointer',
      //     borderRadius: '50%',
      //     borderStyle: 'none',
      //   }
      // }}
      onClick={() => onClick(id)}
    />
  );
}

export default CloseIconButton;
