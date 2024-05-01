// import React, { useState, useEffect } from "react";
// import { useTheme, useMediaQuery, BottomNavigation, BottomNavigationAction } from "@mui/material";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { useLocation, useNavigate } from "react-router-dom";
//     import LogoBianco from "../images/logoTorchyChallengingBianco.png";
//     import TorciaBianca from "../images/torciaBianca.svg";


//     import {
//     Box,
//     Drawer,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     IconButton,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Button,
//     DialogContentText,
//     Popover,
//     Typography,
    
//     } from "@mui/material";
//     import DashboardIcon from "@mui/icons-material/Dashboard";
//     import PersonIcon from "@mui/icons-material/Person";
//     import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
//     import ExitToAppIcon from "@mui/icons-material/ExitToApp";
//     import ExploreIcon from "@mui/icons-material/Explore";
//     import PersonSearchIcon from "@mui/icons-material/PersonSearch";
//     import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
//     import PersonAddIcon from "@mui/icons-material/PersonAdd"; //aggiungi candidato
//     import AddCircleIcon from "@mui/icons-material/AddCircle"; //aggiungi need
//     import AddIcCallIcon from "@mui/icons-material/AddIcCall"; //aggiungi appuntamento
//     import EmailIcon from "@mui/icons-material/Email"; //email
//     import AppuntamentoModal from "./AppuntamentoModal";
//     import EmailModal from "./EmailModal";
// import Sidebar from "./Sidebar";
// import BottomNav from "./BottomNav";

// function SidebarNavbar() {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const [value, setValue] = useState(0);



//     const [activeLink, setActiveLink] = useState(null);
//     const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
//     const [anchorEl, setAnchorEl] = useState(null); // Nuovo stato per l'ancoraggio del Popover
//     const [appuntamentoModal, setAppuntamentoModal] = useState(false);
//     const [emailModal, setEmailModal] = useState(false);




//     const userHasRole = (roleToCheck) => {
//         const userString = sessionStorage.getItem("user");
//         if (!userString) {
//         return false;
//         }
//         const userObj = JSON.parse(userString);
//         return userObj.roles.includes(roleToCheck);
//     };

//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleLogoutClick = () => {
//         setIsLogoutPopupOpen(true);
//     };

//     const closeLogoutPopup = () => {
//         setIsLogoutPopupOpen(false);
//     };

//     const handleLogout = () => {
//         sessionStorage.clear();
//         navigate("/login", { replace: true });
//         closeLogoutPopup();
//     };

//     const handleAppuntamentoClick = () => {
//         setAppuntamentoModal(true);
//     };

//     const closeAppuntamentoModal = () => {
//         setAppuntamentoModal(false);
//     };

//     const handleEmailClick = () => {
//         setEmailModal(true);
//     };

//     const closeEmailModal = () => {
//         setEmailModal(false);
//     };

//     useEffect(() => {
//         setActiveLink(location.pathname);
//     }, [location.pathname]);

//     const handleTorciaClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleAdditionalDrawerClose = () => {
//         setAnchorEl(null);
//     };

//     const handleAggiungiCandidatoClick = () => {
//         navigate("/recruiting/aggiungi");
//         handleAdditionalDrawerClose(); 
//     };

//     const handleAggiungiNeedClick = () => {
//         navigate("/need/aggiungi");
//         handleAdditionalDrawerClose();
//     };

//     const ruolo = () => {
//         const userString = sessionStorage.getItem("user");
//         if (userString) {
//         const userObj = JSON.parse(userString);
//         const rolesArray = userObj.roles;
//         const rolesReadable = rolesArray.map((role, index) => {
//             switch (role) {
//             case "ROLE_ADMIN":
//                 return <span key={index}>Admin</span>;
//             case "ROLE_BM":
//                 return (
//                 <React.Fragment key={index}>
//                     Business
//                     <br />
//                     Manager
//                 </React.Fragment>
//                 );
//                 case "ROLE_RECRUITER":
//                     return (
//                         <span key={index}>Recruiter</span>
//                     );
//             default:
//                 return <span key={index}>Utente</span>;
//             }
//         });
//         return rolesReadable.reduce(
//             (prev, curr, index) => (index === 0 ? [curr] : [...prev, ", ", curr]),
//             []
//         );
//         } else {
//         return "Utente";
//         }
//     };

//     const nome = () => {
//         const userString = sessionStorage.getItem("user");
//         if (userString) {
//             const userObj = JSON.parse(userString);
//             return userObj.nome || "Utente senza nome"; 
//         } else {
//             return "Utente senza nome"; 
//         }
//     };
    
//     const cognome = () => {
//         const userString = sessionStorage.getItem("user");
//         if (userString) {
//             const userObj = JSON.parse(userString);
//             return userObj.cognome || ""; 
//         } else {
//             return ""; 
//         }
//     };


//     const additionalDrawerContent = (
//         <List>
//         <ListItem button onClick={handleAggiungiCandidatoClick}>
//             <ListItemText primary="Aggiungi candidato" />
//             <ListItemIcon>
//             <PersonAddIcon sx={{ color: "#00B401" }} />
//             </ListItemIcon>
//         </ListItem>
//         {!userHasRole("ROLE_RECRUITER") && ( 
//         <ListItem button onClick={handleAggiungiNeedClick}>
//             <ListItemText primary="Aggiungi need" />
//             <ListItemIcon>
//             <AddCircleIcon sx={{ color: "#00B401" }} />
//             </ListItemIcon>
//         </ListItem>
//         )}
//         <ListItem button onClick={handleAppuntamentoClick}>
//             <ListItemText primary="Appuntamento" />
//             <ListItemIcon>
//             <AddIcCallIcon sx={{ color: "#00B401" }} />
//             </ListItemIcon>
//         </ListItem>
//         <ListItem button onClick={handleEmailClick}>
//             <ListItemText primary="Email" />
//             <ListItemIcon>
//             <EmailIcon sx={{ color: "#00B401" }} />
//             </ListItemIcon>
//         </ListItem>
//         </List>
//     );

//     const sidebarData = [
//         {
//         title: "Dashboard",
//         icon: <DashboardIcon />,
//         },
//         {
//         title: "Business",
//         icon: <BusinessCenterIcon />,
//         isVisible: !userHasRole("ROLE_RECRUITER")
//         },
//         {
//         title: "Contacts",
//         icon: <PersonIcon />,
//         isVisible: !userHasRole("ROLE_RECRUITER")
//         },
//         {
//         title: "Need",
//         icon: <ExploreIcon />,
//         },
//         {
//         title: "Recruiting",
//         icon: <PersonSearchIcon />,
//         },
//         {
//         title: "Hiring",
//         icon: <ChecklistRtlIcon />,
//         isVisible: !userHasRole("ROLE_USER" && "ROLE_RECRUITER"),
//         },
//     ];

//     return (
//         <Box sx={{ display: 'flex', width: '100%' }}>
//             {!isMobile && (
//                 <Drawer
//                     variant="permanent"
//                 >
//                     {/* Place your sidebar content here */}
//                     <Sidebar />
//                 </Drawer>
//             )}

//             <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//                 {/* Main content here */}
//             </Box>

//             {isMobile && (
//                 <BottomNavigation
//                     sx={{ width: '100%', position: 'fixed', bottom: 0 }}
//                     value={value}
//                     onChange={(event, newValue) => {
//                         setValue(newValue);
//                     }}
//                 >
//                 <BottomNav />
//                 </BottomNavigation>
//             )}
//         </Box>
//     );
// }

// export default SidebarNavbar;
