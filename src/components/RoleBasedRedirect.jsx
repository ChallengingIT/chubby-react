// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/auth.service';

// const RoleBasedRedirect = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = authService.getCurrentUser();

//     if (user) {
//       const roles = user.roles;
//       if (roles.includes("ROLE_ADMIN")) {
//         // Reindirizza l'admin alla sua homepage
//         navigate('/admin-homepage');
//       } else if (roles.includes("ROLE_USER")) {
//         // Reindirizza l'utente con ROLE_USER alla sua homepage
//         navigate('/user-homepage');
//       } else {
//         // Reindirizza ad una pagina di default o al login se il ruolo non è riconosciuto
//         navigate('/login');
//       }
//     } else {
//       // Se l'utente non è autenticato, reindirizza al login
//       navigate('/login');
//     }
//   }, [navigate]);

//   return null;
// };

// export default RoleBasedRedirect;
