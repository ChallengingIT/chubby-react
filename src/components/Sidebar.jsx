import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo       from "../images/logo.svg"
import authService from "../services/auth.service";
import { Button, Dialog, DialogActions, DialogContent,DialogContentText,DialogTitle, LogoutIcon, Typography } from "@mui/material";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Collapse } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home'; 
import PeopleIcon from '@mui/icons-material/People'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import NearMeIcon from '@mui/icons-material/NearMe';
import PersonIcon from '@mui/icons-material/Person';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FactoryIcon from '@mui/icons-material/Factory';
import { ListItemIcon as MuiListItemIcon } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';





const drawerWidth = "13.5vw";
const drawerCollapsed = "3.5vw";

const Sidebar = () => {
    const [Sidebar2collapsed, setSidebar2collapsed] = useState(true);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [isSidebar2Open, setIsSidebar2Open] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true);
    };

    const toggleDrawer = () => {
        if (open) {
            setOpenSubmenus({});
        }
        setOpen(!open);
    };

    const closeLogoutPopup = () => {
        setIsLogoutPopupOpen(false);
    };

    // const handleLogout = async () => {
    //     console.log("Logout");
    //     try {
    //         await authService.logout();
    //         navigate("/login", { replace: true });
    //         closeLogoutPopup();
    //     } catch (error) {
    //         console.error('Errore durante il logout:', error);
    //     }
    // };

    const handleLogout = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        localStorage.removeItem("user");
        localStorage.clear();
        navigate('/login', { replace: true});
        closeLogoutPopup();
    };


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClickSubmenu = (index) => {
        if (!open) {
            setOpen(true);
        }
            setOpenSubmenus((prevOpenSubmenus) => ({
            ...prevOpenSubmenus,
            [index]: !prevOpenSubmenus[index],
        }));
    };
    



    useEffect(() => {
        setActiveLink(location.pathname);
        setSidebar2collapsed(true);
        setSubmenuOpen(false);
    }, [location.pathname]);

    const toglleSidebar2 = () => {
        const newSidebar2collapsed =!Sidebar2collapsed;
        setSidebar2collapsed(newSidebar2collapsed);
        setIsSidebar2Open(!isSidebar2Open);
        if (newSidebar2collapsed) {
            setSubmenuOpen(false);
        }
    };

    const toggleSubMenu = (index) => {
        if (Sidebar2collapsed) {
            setSidebar2collapsed(false);
        }
        setSubmenuOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };


    const StyledListItemIcon = styled(MuiListItemIcon)`
  &.MuiListItemIcon-root:hover {
    width: 60px;
    height: 60px;
    color: black;
    background-color: #e0a81a;
    transform: scale(1.05);
    cursor: pointer;
    border-radius: 50%;
    border-style: none;
  }
`;




const Sidebar2Data = [
    {
        title: 'Home',
        icon: <HomeIcon style={{ color: '#00853C' }}/>,
        Sidebar2collapsed: true,
    },
    {
        title: 'Business Dev',
        icon: <AccountBoxIcon style={{ color: '#00853C' }}/>,
        iconClosed: (
            <ExpandMore style={{ color: '#00853C', marginRight: '2em'}}/>
        ),
        Sidebar2collapsed: true,
        subNav: [
            {
                title: 'Aziende',
                path: '/aziende',
                icon: <BusinessCenterIcon style={{ color: '#00853C' }}/>,
                customStyle: { marginLeft: '10px' },
            },
            {
                title: 'KeyPeople',
                path: '/KeyPeople',
                icon: <CollectionsBookmarkIcon style={{ color: '#00853C' }}/>
            },
        ],
    },
    {
        title: 'Need',
        path: '/need',
        icon: <NearMeIcon style={{ color: '#00853C' }}/>,
        Sidebar2collapsed: true,
    },
    {
        title: 'Recruiting',
        path: '/recruiting',
        icon: <PersonIcon style={{ color: '#00853C' }}/>,
        Sidebar2collapsed: true,
    },

    {
        title: 'Logout',
        icon: <ExitToAppIcon style={{ color: '#00853C' }}/>,
        action: 'logout',
        
    }
];

return (
    <Box sx={{ display: 'flex' }}>
    <Drawer
        variant="permanent"
        sx={{
            width: open ? drawerWidth : drawerCollapsed, 
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
                width: open ? drawerWidth : drawerCollapsed, 
                boxSizing: 'border-box',
                backgroundColor: 'black',
                color: '#817B7B',
                transition: 'width 0.3s ease',
                borderRadius: '0 22px 22px 0',
                overflow: 'hidden', 
            },
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px', flexDirection: 'row' }}>
            {open && ( 
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px', flexDirection: 'column' }}>
                    <Typography sx={{ color: 'white', display: 'flex', alignItems: 'flex-start', fontWeight: 'bold', fontSize: '28px' }}>
                        TORCHY
                    </Typography>
                    <img src={Logo} alt="Logo" style={{ maxWidth: '100%' }} />
                </Box>
            )}
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    marginLeft: 'auto',
                    color: '#FBB700',
                }}
            >
                {open ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            </IconButton>
        </Box>
            
            
            <List>
                {Sidebar2Data.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{
                            gap: 0,
                                '&:hover': {
                                    backgroundColor: '#252831',
                                    borderLeft: '4px solid #00853C',
                                    cursor: 'pointer',
                                    borderRadius: '40px',
                                },
                            }}button onClick={() => {
                                if (item.action === 'logout') {
                                    handleLogoutClick(); // Apri il Dialog di conferma del logout
                                } else if (item.subNav) {
                                    handleClickSubmenu(index);
                                } else {
                                    navigate(item.path);
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '15%'}}>{item.icon}</ListItemIcon>
                            {open ? (
                                <ListItemText primary={item.title} />
                            ) : (
                                <ListItemText primary={item.title} sx={{ display: 'none' }} />
                            )}
                            {item.subNav ? open && (openSubmenus[index] ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItem>
                        {item.subNav && (
                            <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subNav.map((subItem, subIndex) => (
                                        <ListItem
                                        sx={{pl: 2.8,
                                            '&:hover': {
                                                backgroundColor: '#252831',
                                                borderLeft: '4px solid #00853C',
                                                cursor: 'pointer',
                                                borderRadius: '40px',
                                            },
                                        }}
                                        button key={subIndex} onClick={() => navigate(subItem.path)}>
                                            <ListItemIcon sx={{ minWidth: '15%'}}>{subItem.icon}</ListItemIcon>
                                            <ListItemText primary={subItem.title} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
        <Dialog
            open={isLogoutPopupOpen}
            onClose={closeLogoutPopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: { backgroundColor: 'black', color: 'white' },
            }}
        >
            <DialogTitle id="alert-dialog-title"
            sx={{
                color: 'white',
                fontSize: '24px',
                textAlign: 'center',
                fontWeight: 'bold',
            }}>
                {"Conferma Logout"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description"
                sx={{
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center',
                }}>
                    Sei sicuro di voler effettuare il logout?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: '10px' }}>
                <Button onClick={closeLogoutPopup}
                variant="outlined"
                sx={{
                    borderColor: "#00853C",
                    color: "#00853C",
                    marginRight: "5px",
                    marginTop: "10px",
                    "&:hover": {
                        transform: "scale(1.05)",
                        borderColor: "#00853C",
                    },
                    }}>Annulla</Button>
                <Button onClick={handleLogout}
                variant="contained"
                sx={{
                    backgroundColor: "#00853C",
                    marginLeft: "5px",
                    marginTop: "10px",
                    marginRight: '50px',
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#00853C",
                        transform: "scale(1.05)",
                    },
                    }}
                    autoFocus>
                    Conferma
                </Button>
                </Box>
            </DialogActions>
        </Dialog>
    </Box>
);
};

export default Sidebar;
