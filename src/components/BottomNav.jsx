// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PersonIcon from '@mui/icons-material/Person';
// import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// function BottomNav() {
//     const [value, setValue] = useState(0);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Mantieni l'highlight corretto in base al percorso attuale
//     useEffect(() => {
//         const path = location.pathname;
//         const mapPathToValue = {
//             '/dashboard': 0,
//             '/business': 1,
//             '/contacts': 2,
//             '/logout': 3,
//         };
//         setValue(mapPathToValue[path] || 0);
//     }, [location]);

//     return (
//         <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
//             <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#191919' }} elevation={3}>
//                 <BottomNavigation
//                     value={value}
//                     onChange={(event, newValue) => {
//                         setValue(newValue);
//                         switch (newValue) {
//                             case 0:
//                                 navigate('/dashboard');
//                                 break;
//                             case 1:
//                                 navigate('/business');
//                                 break;
//                             case 2:
//                                 navigate('/contacts');
//                                 break;
//                             case 3:
//                                 navigate('/logout');
//                                 break;
//                             default:
//                                 break;
//                         }
//                     }}
//                     showLabels
//                     sx={{
//                         '& .Mui-selected, & .MuiButtonBase-root': {
//                             color: '#00B401', // Active color
//                         },
//                         '& .MuiBottomNavigationAction-root': {
//                             color: 'white', // Default icon and text color
//                         },
//                     }}
//                 >
//                     <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
//                     <BottomNavigationAction label="Business" icon={<BusinessCenterIcon />} />
//                     <BottomNavigationAction label="Contacts" icon={<PersonIcon />} />
//                     <BottomNavigationAction label="Logout" icon={<ExitToAppIcon />} />
//                 </BottomNavigation>
//             </Paper>
//         </Box>
//     );
// }

// export default BottomNav;
