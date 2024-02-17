import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo       from "../../images/innotek.svg";
import authService from "../../services/auth.service";
import { Button, Dialog, DialogActions, DialogContent,DialogContentText,DialogTitle, LogoutIcon, Typography } from "@mui/material";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Collapse } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ListItemIcon as MuiListItemIcon } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 







const drawerWidth = "14vw";
const drawerCollapsed = "3.5vw";

const UserSidebar = () => {
    const [sidebarcollapsed, setSidebarcollapsed] = useState(true);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        setSidebarcollapsed(true);
        setSubmenuOpen(false);
    }, [location.pathname]);

    const toglleSidebar = () => {
        const newSidebarcollapsed =!sidebarcollapsed;
        setSidebarcollapsed(newSidebarcollapsed);
        setIsSidebarOpen(!isSidebarOpen);
        if (newSidebarcollapsed) {
            setSubmenuOpen(false);
        }
    };

    const toggleSubMenu = (index) => {
        if (sidebarcollapsed) {
            setSidebarcollapsed(false);
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




const sidebarData = [
    {
        title: 'Timesheet',
        icon: <AccessTimeIcon style={{ color: '#14D928' }}/>,
        path: '/userTimesheet',
        sidebarcollapsed: true,
    },
    {
      title: 'Logout',
      icon: <ExitToAppIcon style={{ color: '#14D928' }}/>,
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
                overflowX: 'hidden', 
            },
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '8px', flexDirection: 'row' }}>
            {open && ( 
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px', flexDirection: 'column' }}>
                    <Typography sx={{ color: 'white', display: 'flex', alignItems: 'flex-start', fontWeight: 'bold', fontSize: '30px' }}>
                        WE-HUB
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
                {sidebarData.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem sx={{
                                '&:hover': {
                                    backgroundColor: '#252831',
                                    borderLeft: '4px solid #14D928',
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
                            <ListItemIcon >{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                            {item.subNav ? (openSubmenus[index] ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItem>
                        {item.subNav && (
                            <Collapse in={openSubmenus[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subNav.map((subItem, subIndex) => (
                                        <ListItem
                                        sx={{pl: 4,
                                            '&:hover': {
                                                backgroundColor: '#252831',
                                                borderLeft: '4px solid #14D928',
                                                cursor: 'pointer',
                                                borderRadius: '40px',
                                            },
                                        }}
                                        button key={subIndex} onClick={() => navigate(subItem.path)}>
                                            <ListItemIcon>{subItem.icon}</ListItemIcon>
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
                    borderColor: "#14D928",
                    color: "#14D928",
                    marginRight: "5px",
                    marginTop: "10px",
                    "&:hover": {
                        transform: "scale(1.05)",
                        borderColor: "#14D928",
                    },
                    }}>Annulla</Button>
                <Button onClick={handleLogout}
                variant="contained"
                sx={{
                    backgroundColor: "#14D928",
                    marginLeft: "5px",
                    marginTop: "10px",
                    marginRight: '50px',
                    color: "black",
                    "&:hover": {
                        backgroundColor: "#14D928",
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

export default UserSidebar;
