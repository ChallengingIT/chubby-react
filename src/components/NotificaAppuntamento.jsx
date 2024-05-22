// // NotificaAppuntamento.jsx
// import React, { useEffect, useState } from 'react';
// import { Snackbar, Alert } from '@mui/material';

// const NotificaAppuntamento = ({ appointments }) => {
//     const [open, setOpen] = useState(false);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const checkAppointments = () => {
//             const now = new Date();
//             appointments.forEach(appointment => {
//                 const appointmentTime = new Date(appointment.time);
//                 const diff = appointmentTime - now;
//                 if (diff > 0 && diff <= 10 * 60 * 1000) {
//                     setMessage(`Hai un appuntamento tra 10 minuti: ${appointment.description}`);
//                     setOpen(true);
//                 }
//             });
//         };
//         //controllo ogni minuto l'intervallo di tempo
//         const intervalId = setInterval(checkAppointments, 60000); 

//         //pulisco l'intervallo quando il componente viene smontato
//         return () => clearInterval(intervalId); 
//     }, [appointments]);

//     const handleClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpen(false);
//     };

//     return (
//         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//             <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
//                 {message}
//             </Alert>
//         </Snackbar>
//     );
// };

// export default NotificaAppuntamento;
