// import React from 'react';
// import { Modal, Box, Typography, Button } from '@mui/material';

// const DeleteModal = (onOpen, onClose, onDelete) => {
//   return (

//         <Box
//                 sx={{
//                 backgroundColor: 'white',
//                 p: 4,
//                 borderRadius: 2,
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'column',
//                 gap: 2,
//                 width: '40vw',
//                 }}
//                 >
//                 <Typography id="modal-modal-title" variant="h6" component="h2">
//                 Sei sicuro di voler eliminare il contatto?
//                 </Typography>
//                 <Box 
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     gap: 3
//                 }}>
//                     <Button
//                     onClick={onClose}
//                     sx={{
//                         backgroundColor: 'black',
//                         color: 'white',
//                         borderRadius: '5px',
//                         '&:hover': {
//                             backgroundColor: 'black',
//                             color: 'white',
//                             transform: 'scale(1.01)'
//                         },
//                     }}>
//                     Indietro
//                 </Button>
//                 <Button
//                 onClick={onDelete}
//                 sx={{
//                     backgroundColor: '#00B401',
//                     color: 'white',
//                     borderRadius: '5px',
//                     '&:hover': {
//                         backgroundColor: '#00B401',
//                         color: 'white',
//                         transform: 'scale(1.01)'
//                     },
//                 }}>
//                     Conferma
//                 </Button>
//                 </Box>
//                 </Box>
//     );
// }

// export default DeleteModal