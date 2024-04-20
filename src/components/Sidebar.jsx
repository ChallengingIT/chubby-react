import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoBianco from "../images/logoTorchyChallengingBianco.png";
import TorciaBianca from '../images/torciaBianca.svg';

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
    DialogContentText,
    Popover,
    Modal,
    Typography,
    Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExploreIcon from '@mui/icons-material/Explore';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; //aggiungi candidato
import AddCircleIcon from '@mui/icons-material/AddCircle'; //aggiungi need
import AddIcCallIcon from '@mui/icons-material/AddIcCall'; //aggiungi appuntamento
import EmailIcon from '@mui/icons-material/Email'; //email
import AppuntamentoModal from './AppuntamentoModal';
import EmailModal from './EmailModal';




function Sidebar() {
    const [activeLink, setActiveLink] = useState(null);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Nuovo stato per l'ancoraggio del Popover
    const [appuntamentoModal,  setAppuntamentoModal ] = useState(false);
    const [emailModal, setEmailModal ] = useState(false);


    //genera colori random per l'avata
    const generateRandomColor = () => {
        const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        return randomColor;
    };

    const [avatarColor, setAvatarColor] = useState(generateRandomColor());

    


    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem('user');
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true);
    };

    const closeLogoutPopup = () => {
        setIsLogoutPopupOpen(false);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login', { replace: true });
        closeLogoutPopup();
    };

    const handleAppuntamentoClick = () => {
        setAppuntamentoModal(true);
    };

    const closeAppuntamentoModal = () => {
        setAppuntamentoModal(false);
    };

    
    const handleEmailClick = () => {
        setEmailModal(true);
    };

    const closeEmailModal = () => {
        setEmailModal(false);
    };


    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const handleTorciaClick = (event) => {
        setAnchorEl(event.currentTarget); 
    };

    const handleAdditionalDrawerClose = () => {
        setAnchorEl(null);
    };

    const handleAggiungiCandidatoClick = () => {
        navigate('/recruiting/aggiungi');
        handleAdditionalDrawerClose(); // Chiudi il drawer aggiuntivo dopo la navigazione
    };

    const handleAggiungiNeedClick = () => {
        navigate('/need/aggiungi');
        handleAdditionalDrawerClose();
    };

    const ruolo = () => {
        const userString = sessionStorage.getItem('user');
        if (userString) {
            const userObj = JSON.parse(userString);
            const rolesArray = userObj.roles;
            const rolesReadable = rolesArray.map((role, index) => {
                switch (role) {
                    case 'ROLE_ADMIN':
                        return <span key={index}>Admin</span>;
                    case 'ROLE_BM':
                        return <React.Fragment key={index}>Business<br />Manager</React.Fragment>;
                    default:
                        return <span key={index}>Utente</span>;
                }
            });
                return rolesReadable.reduce((prev, curr, index) => index === 0 ? [curr] : [...prev, ', ', curr], []);
        } else {
            return 'Utente';
        }
    };
    


    const nome = () => {
        const userString = sessionStorage.getItem('user');
        if(userString) {
            const userObj = JSON.parse(userString);
            return userObj.nome;
        } else {
            return '';
        }
    };

    const cognome = () => {
        const userString = sessionStorage.getItem('user');
        if(userString) {
            const userObj = JSON.parse(userString);
            return userObj.cognome;
        } else {
            return '';
        }
    };
    


    const additionalDrawerContent = (
        <List>
            <ListItem button onClick={handleAggiungiCandidatoClick}>
                <ListItemText primary="Aggiungi candidato" />
                <ListItemIcon>
                    <PersonAddIcon sx={{ color: '#00B401'}} />
                </ListItemIcon>
            </ListItem>
            <ListItem button onClick={handleAggiungiNeedClick}>
                <ListItemText primary="Aggiungi need" />
                <ListItemIcon>
                    <AddCircleIcon sx={{ color: '#00B401'}} />
                </ListItemIcon>
            </ListItem>
            <ListItem button onClick={handleAppuntamentoClick}>
                <ListItemText primary="Appuntamento" />
                <ListItemIcon>
                    <AddIcCallIcon sx={{ color: '#00B401'}} />
                </ListItemIcon>
            </ListItem>
            <ListItem button onClick={handleEmailClick}>
                <ListItemText primary="Email" />
                <ListItemIcon>
                    <EmailIcon sx={{ color: '#00B401'}} />
                </ListItemIcon>
            </ListItem>
        </List>
    );

    const sidebarData = [
        {
            title: 'Dashboard',
            icon: <DashboardIcon />,
        },
        {
            title: 'Business',
            icon: <BusinessCenterIcon />,
        },
        {
            title: 'Contacts',
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
            isVisible: !userHasRole('ROLE_USER'),
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', flexDirection: 'column' }}>
                    {/* <IconButton  style={{ padding: 0 }}> */}
                        <img src={LogoBianco} alt="Logo" style={{ width: '6.5vw', marginTop: '1em' }} />
                    {/* </IconButton> */}

                    <IconButton onClick={handleTorciaClick} sx={{ padding: 0, '&:hover': { transform: 'scale(1.1)'}  }}> 
                        <img src={TorciaBianca} alt="Torcia" style={{ width: '3vw', marginTop: '1em', marginBottom: '1em' }} />
                    </IconButton>
                </Box>
                <List>
                    {sidebarData
                        .filter(item => item.isVisible !== false)
                        .map((item, index) => (
                        <ListItem
                            key={item.title}
                            selected={activeLink === `/${item.title.toLowerCase()}`}
                            onClick={() => navigate(`/${item.title.toLowerCase()}`)}
                            sx={{
                                gap: 0,
                                '&:hover, &.Mui-selected': {
                                    backgroundColor: '#00B401',
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: 'white',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeLink === `/${item.title.toLowerCase()}` ? '#00B401' : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? 'white' : '#00B401',
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
                <List sx={{ marginTop: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, padding: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#EDEDED', fontSize: '1em' }}>
                    {ruolo()}:
                </Typography>
                <Avatar sx={{ bgcolor: avatarColor }}>{nome()[0] + cognome()[0]}</Avatar>
            </Box>  
                    <ListItem
                        selected={activeLink === '/logout'}
                        onClick={handleLogoutClick}
                        sx={{
                            '&:hover, &.Mui-selected': {
                                backgroundColor: '#00B401',
                                cursor: 'pointer',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                    color: 'white',
                                },
                                borderRadius: '10px',
                            },
                            borderRadius: '10px',
                            '& .MuiListItemIcon-root': {
                                color: '#00B401',
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


            
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleAdditionalDrawerClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right 10px',
                }}
            >
                <Box sx={{ width: 250 }}>
                    {additionalDrawerContent}
                </Box>
            </Popover>



            <Dialog
                open={isLogoutPopupOpen}
                onClose={closeLogoutPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: { backgroundColor: '#FEFCFD', color: '#00B401' },
                }}
            >
                <DialogTitle id="alert-dialog-title"
                    sx={{
                        color: '#00B401',
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
                                backgroundColor: "#00B401",
                                marginLeft: "5px",
                                marginTop: "10px",
                                marginRight: '50px',
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#00B401",
                                    transform: "scale(1.05)",
                                },
                            }}
                            autoFocus>
                            Conferma
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>


            <AppuntamentoModal
        open={appuntamentoModal}
        handleClose={closeAppuntamentoModal}
      />
      

      <EmailModal
      open={emailModal}
      handleClose={closeEmailModal}
      />



        </Box>
    );
}

export default Sidebar;
