import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Torcia from '../images/LogoBianco.png'; 
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    DialogContentText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExploreIcon from '@mui/icons-material/Explore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

function Sidebar() {
    const [activeLink, setActiveLink] = useState(null);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true);
    };

    const closeLogoutPopup = () => {
        setIsLogoutPopupOpen(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
        closeLogoutPopup();
    };

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const sidebarData = [
        {
            title: 'Dashboard',
            icon: <DashboardIcon />,
        },
        {
            title: 'Aziende',
            icon: <BusinessCenterIcon />,
        },
        {
            title: 'Keypeople',
            icon: <PersonIcon />,
        },
        {
            title: 'Need',
            icon: <ExploreIcon />,
        },
        {
            title: 'Recruiting',
            icon: <PersonSearchIcon />,
        },
        { 
            title: 'Hiring',
            icon: <ChecklistRtlIcon />,
        }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        ml: 1,
                        mt: 1,
                        mb: 1,
                        height: '98vh',
                        boxSizing: 'border-box',
                        backgroundColor: '#191919',
                        borderRadius: '22px 22px 22px 22px',
                        overflow: 'hidden',
                        padding: '1em',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', flexDirection: 'row' }}>
                <IconButton onClick={() => navigate('/dashboard')} style={{ padding: 0 }}>
                    <img src={Torcia} alt="Torcia" style={{ width: '6vw', marginTop: '1em' }} />
                    </IconButton>
                </Box>
                <List>
                    {sidebarData.map((item, index) => (
                        <ListItem
                            key={item.title}
                            selected={activeLink === `/${item.title.toLowerCase()}`}
                            onClick={() => navigate(`/${item.title.toLowerCase()}`)}
                            sx={{
                                gap: 0,
                                '&:hover, &.Mui-selected': {
                                    backgroundColor: '#00853C',
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: 'white',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeLink === `/${item.title.toLowerCase()}` ? '#00853C' : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? 'white' : '#00853C',
                                    minWidth: '2.2em',
                                },
                                '& .MuiListItemText-primary': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? 'white' : 'white',
                                },
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
                <List sx={{ marginTop: 'auto' }}> {/* Questo List contiene solo l'elemento di logout e ha margin-top auto */}
                    <ListItem
                        selected={activeLink === '/logout'}
                        onClick={handleLogoutClick}
                        sx={{
                            '&:hover, &.Mui-selected': {
                                backgroundColor: '#00853C',
                                cursor: 'pointer',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                    color: 'white',
                                },
                                borderRadius: '10px',
                            },
                            borderRadius: '10px',
                            '& .MuiListItemIcon-root': {
                                color: '#00853C',
                                minWidth: '2.2em',
                            },
                            '& .MuiListItemText-primary': {
                                color: 'white',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <Dialog
                    open={isLogoutPopupOpen}
                    onClose={closeLogoutPopup}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        style: { backgroundColor: '#FEFCFD', color: '#00853C' },
                    }}
                >
                    <DialogTitle id="alert-dialog-title"
                    sx={{
                        color: '#00853C',
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
                            color: 'black'
                        }}>
                            Sei sicuro di voler effettuare il logout?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            flexDirection: 'row', 
                            marginBottom: '10px' 
                            }}>
                        <Button onClick={closeLogoutPopup}
                        variant="contained"
                        sx={{
                            backgroundColor: "#000000",
                            color: "#white",
                            marginRight: "5px",
                            marginTop: "10px",
                            "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: '#000000',
                                color: 'white'
                            },
                            }}>Annulla</Button>
                        <Button onClick={handleLogout}
                        variant="contained"
                        sx={{
                            backgroundColor: "#00853C",
                            marginLeft: "5px",
                            marginTop: "10px",
                            marginRight: '50px',
                            color: "white",
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
}

export default Sidebar;
