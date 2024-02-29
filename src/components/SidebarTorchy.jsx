import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from'react-router-dom';
import Logo from '../images/LogoTorchy.svg';
import Torcia from '../images/LogoBianco.png';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, DialogContentText} from '@mui/material';
import { ListItemIcon as MuiListItemIcon } from '@mui/material';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";

//icone
import DashboardIcon from '@mui/icons-material/Dashboard'; //home
import PersonIcon from '@mui/icons-material/Person'; //Keypeople
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; //aziende
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; //logout
import ExploreIcon from '@mui/icons-material/Explore'; //need
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; //recruiting

function SidebarTorchy() {

    const [ activeLink, setActiveLink ] = useState(null);
    const [ isLogoutPopupOpen, setIsLogoutPopupOpen ] = useState(false);

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
        console.log("Logout da confirmLogout");
        navigate('/login', { replace: true });
        // window.location.reload();
        closeLogoutPopup();
    };

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);



    const sidebarData = [
        // {
        //     title: 'Dashboard',
        //     icon: <DashboardIcon />,
        // },
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
            title: 'Logout',
            icon: <ExitToAppIcon />,
        },
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
                        // width: '10vw',
                        boxSizing: 'border-box',
                        backgroundColor: '#191919',
                        borderRadius: '22px 22px 22px 22px',
                        overflow: 'hidden', 
                        padding: '1em',
                    },
                }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', flexDirection: 'row' }}>
                <img src={Torcia} alt="Torcia" style={{ width: '6vw', marginTop: '1em' }} />
                {/* <img src={Logo} alt="Logo" style={{ width: '4vw', marginTop: '0.6em', marginRight: '0.4em' }} /> */}
                </Box>
                <IconButton
                sx={{
                    marginLeft: '1em',
                    color: '#00853C'
                }}
                />
               <List>
  {sidebarData.map((item, index) => (
    <ListItem
      button
      key={item.title}
      selected={activeLink === `/${item.title.toLowerCase()}`}
      onClick={item.title === 'Logout' ? handleLogoutClick : () => navigate(`/${item.title.toLowerCase()}`)}
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
                color: 'white',
                fontSize: '24px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'white'
            }}>
                {"Conferma Logout"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description"
                sx={{
                    color: 'white',
                    fontSize: '18px',
                    textAlign: 'center',
                    color: '#535353'
                }}>
                    Sei sicuro di voler effettuare il logout?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: '10px' }}>
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













};

export default SidebarTorchy;