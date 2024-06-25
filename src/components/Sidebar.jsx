    import React, { useState, useEffect } from "react";
    import { useLocation, useNavigate } from "react-router-dom";
    import LogoBianco from "../images/logoTorchyChallengingBianco.png";
    import TorciaBianca from "../images/torciaBianca.svg";
    import axios from "axios";
    import DashboardIcon from "@mui/icons-material/Dashboard";
    import PersonIcon from "@mui/icons-material/Person";
    import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
    import ExitToAppIcon from "@mui/icons-material/ExitToApp";
    import ExploreIcon from "@mui/icons-material/Explore";
    import PersonSearchIcon from "@mui/icons-material/PersonSearch";
    import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
    import PersonAddIcon from "@mui/icons-material/PersonAdd"; // aggiungi candidato
    import AddCircleIcon from "@mui/icons-material/AddCircle"; // aggiungi need
    import AddIcCallIcon from "@mui/icons-material/AddIcCall"; // aggiungi appuntamento
    import EmailIcon from "@mui/icons-material/Email"; // email
    import SettingsIcon from '@mui/icons-material/Settings'; //impostazioni
    import AppuntamentoModal from "./AppuntamentoModal";
    import EmailModal from "./EmailModal";
    import GroupAddIcon from '@mui/icons-material/GroupAdd'; //aggiungi owner
    import { useUserTheme } from "./TorchyThemeProvider";
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
    Typography,
    } from "@mui/material";

    function Sidebar() {
    const theme = useUserTheme();
    const [activeLink, setActiveLink] = useState(null);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // Nuovo stato per l'ancoraggio del Popover
    const [appuntamentoModal, setAppuntamentoModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [companyLogo, setCompanyLogo] = useState(""); // Stato per il logo aziendale
    const [ roleBusiness, setRoleBusiness ] = useState(false); // Stato per il ruolo aziendale

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
        return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
        };

    const navigate = useNavigate();
    const location = useLocation();

    const handleSettingsClick = () => {
        navigate("/settings");
    };

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true);
    };

    const closeLogoutPopup = () => {
        setIsLogoutPopupOpen(false);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login", { replace: true });
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
        const userString = sessionStorage.getItem("user");
        const userObj = userString ? JSON.parse(userString) : null;
        if (userObj && userObj.roles.includes("ROLE_BUSINESS")) {
            setRoleBusiness(true);
        }
    }, [location.pathname]);

    const handleTorciaClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAdditionalDrawerClose = () => {
        setAnchorEl(null);
    };

    const handleAggiungiAziendaClick = () => {
        navigate("/business/aggiungi");
        handleAdditionalDrawerClose();
    };

    const handleAggiungiContattoClick = () => {
        navigate("/contacts/aggiungi");
        handleAdditionalDrawerClose();
    };



    const handleAggiungiCandidatoClick = () => {
        navigate("/recruiting/aggiungi");
        handleAdditionalDrawerClose();
    };


        const handleAggiungiOwner = () => {
        navigate("/owner/aggiungi");
        handleAdditionalDrawerClose();
    };

    const handleAggiungiNeedClick = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        if (userObj.roles.includes("ROLE_BUSINESS")) {
            const idAzienda = userObj.idAzienda;
            navigate(`/need/aggiungi/${idAzienda}`);
        } else {
            navigate("/need/aggiungi");
        }
        } else {
        navigate("/need/aggiungi");
        }
        handleAdditionalDrawerClose();
    };


    const handleNeedClick = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        if (userObj.roles.includes("ROLE_BUSINESS")) {
            const idAzienda = userObj.idAzienda;
            navigate(`/need/${idAzienda}`);
        } else {
            navigate("/need");
        }
        } else {
        navigate("/need");
        }
        handleAdditionalDrawerClose();
    };

    const ruolo = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        const rolesArray = userObj.roles;
        const rolesReadable = rolesArray.map((role, index) => {
            switch (role) {
            case "ROLE_ADMIN":
                return <span key={index}>Admin</span>;
            case "ROLE_BM":
                return (
                <React.Fragment key={index}>
                    Business
                    <br />
                    Manager
                </React.Fragment>
                );
            case "ROLE_RECRUITER":
                return <span key={index}>Recruiter</span>;
            case "ROLE_BUSINESS":
                return <span key={index}></span>;
            default:
                return <span key={index}>Utente</span>;
            }
        });
        return rolesReadable.reduce(
            (prev, curr, index) => (index === 0 ? [curr] : [...prev, ", ", curr]),
            []
        );
        } else {
        return "Utente";
        }
    };

    const nome = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        return userObj.nome || "Utente senza nome";
        } else {
        return "Utente senza nome";
        }
    };

    const cognome = () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        return userObj.cognome || "";
        } else {
        return "";
        }
    };

    const additionalDrawerContent = (
        <List>
        {!userHasRole("ROLE_BUSINESS") && (
            <ListItem button onClick={handleAggiungiAziendaClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
                Aggiungi azienda
            </ListItemText>
            <ListItemIcon>
                <BusinessCenterIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
            </ListItem>
        )}

        {!userHasRole("ROLE_BUSINESS") && (
            <ListItem button onClick={handleAggiungiContattoClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
                Aggiungi contatto
            </ListItemText>
            <ListItemIcon>
                <PersonIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
            </ListItem>
        )}

        {!userHasRole("ROLE_RECRUITER") && (
            <ListItem button onClick={handleAggiungiNeedClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
                Aggiungi need
            </ListItemText>
            <ListItemIcon>
                <ExploreIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
            </ListItem>
        )}

        {!userHasRole("ROLE_BUSINESS") && (
            <ListItem button onClick={handleAggiungiCandidatoClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
                Aggiungi candidato
            </ListItemText>
            <ListItemIcon>
                <PersonSearchIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
            </ListItem>
        )}
        
        {/* {!userHasRole("ROLE_BUSINESS") && (
        <ListItem button onClick={handleAppuntamentoClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
            Appuntamento
            </ListItemText>
            <ListItemIcon>
            <AddIcCallIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
        </ListItem>
        )} */}
        {userHasRole("ROLE_BUSINESS") && (
            <ListItem button onClick={handleAggiungiOwner}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
                Aggiungi owner
            </ListItemText>
            <ListItemIcon>
                <GroupAddIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
            </ListItem>
        )}
        {/* <ListItem button onClick={handleEmailClick}>
            <ListItemText sx={{ color: theme.palette.text.secondary }}>
            Email
            </ListItemText>
            <ListItemIcon>
            <EmailIcon sx={{ color: theme.palette.icon.main }} />
            </ListItemIcon>
        </ListItem> */}
        </List>
    );

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetchLogo = async () => {
        const userString = sessionStorage.getItem("user");
        if (userString) {
        const userObj = JSON.parse(userString);
        if (userObj.roles.includes("ROLE_BUSINESS")) {
            const idAziende = userObj.idAzienda;
            const parametroDaInviare = {
            idAzienda: idAziende
            };

            try {
            const response = await axios.get(`http://localhost:8080/aziende/react/logo`, {
                headers: headers,
                params: parametroDaInviare
            });
            if (response.data) {
                setCompanyLogo(response.data);
            }
            } catch (error) {
            console.error("Errore nel fetch del logo aziendale:", error);
            }
        }
        }
    };

    useEffect(() => {
        fetchLogo();
    }, []);

    const sidebarData = [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            onClick: () => navigate(roleBusiness ? "/homepage" : "/dashboard"),
        },
        {
        title: "Business",
        icon: <BusinessCenterIcon />,
        isVisible: !userHasRole("ROLE_RECRUITER") && !userHasRole("ROLE_BUSINESS"),
        onClick: () => navigate("/business"),
        },
        {
        title: "Contacts",
        icon: <PersonIcon />,
        isVisible: !userHasRole("ROLE_RECRUITER") && !userHasRole("ROLE_BUSINESS"),
        onClick: () => navigate("/contacts"),
        },
        {
        title: "Need",
        icon: <ExploreIcon />,
        onClick: handleNeedClick,
        },
        {
        title: "Recruiting",
        icon: <PersonSearchIcon />,
        isVisible: !userHasRole("ROLE_BUSINESS"),
        onClick: () => navigate("/recruiting"),
        },
        {
        title: "Hiring",
        icon: <ChecklistRtlIcon />,
        isVisible: !userHasRole("ROLE_USER") && !userHasRole("ROLE_RECRUITER") && !userHasRole("ROLE_BUSINESS"),
        onClick: () => navigate("/hiring"),
        },
    ];

    return (
        <Box sx={{ display: "flex" }}>
        <Drawer
            variant="permanent"
            sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                ml: 1,
                mt: 1,
                mb: 1,
                height: "98vh",
                boxSizing: "border-box",
                backgroundColor: theme.palette.sidebar.background,
                borderRadius: "22px 22px 22px 22px",
                overflow: "hidden",
                padding: "1em",
                display: "flex",
                flexDirection: "column",
            },
            }}
        >
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // padding: "1em",
                flexDirection: "column",
            }}
            >
            <img
                src={LogoBianco}
                alt="Logo"
                style={{ width: "8vw", marginTop: "1em", marginBottom: "1em" }}
            />
            <IconButton
                onClick={handleTorciaClick}
                sx={{ padding: 0, "&:hover": { transform: "scale(1.1)" } }}
            >
                <img
                src={TorciaBianca}
                alt="Torcia"
                style={{ width: "3.5vw", marginBottom: '1em' }}
                />
            </IconButton>
            </Box>
            <List>
            {sidebarData
                .filter((item) => item.isVisible !== false)
                .map((item, index) => (
                <ListItem
                    key={item.title}
                    selected={activeLink === `/${item.title.toLowerCase()}`}
                    onClick={item.onClick}
                    sx={{
                    gap: 0,
                    "&:hover, &.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        cursor: "pointer",
                        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                        color: theme.palette.text2.primary,
                        },
                        borderRadius: "10px",
                    },
                    borderRadius: "10px",
                    backgroundColor:
                        activeLink === `/${item.title.toLowerCase()}`
                        ? theme.palette.primary.main
                        : "",
                    "& .MuiListItemIcon-root": {
                        color:
                        activeLink === `/${item.title.toLowerCase()}`
                            ? "white"
                            : theme.palette.primary.main,
                        minWidth: "2.2em",
                    },
                    "& .MuiListItemText-primary": {
                        color:
                        activeLink === `/${item.title.toLowerCase()}`
                            ? "white"
                            : "white",
                    },
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItem>
                ))}
            </List>
            <List sx={{ marginTop: "auto" }}>
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mb: 1,
                flexDirection: "column",
                }}
            >
                {companyLogo && (
                <Box
                    component="img"
                    src={`data:image/png;base64,${companyLogo}`}
                    alt="Company Logo"
                    sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    marginBottom: 1,
                    }}
                />
                )}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: "#EDEDED", fontSize: "0.9em" }}> {nome()} {cognome()}</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: "#EDEDED", fontSize: "1em" }}>
                {ruolo()}
                </Typography>
            </Box>
            <ListItem
                selected={activeLink === "/settings"}
                onClick={handleSettingsClick}
                sx={{
                "&:hover, &.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    cursor: "pointer",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: theme.palette.icon.secondary,
                    },
                    borderRadius: "10px",
                },
                borderRadius: "10px",
                "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                    minWidth: "2.2em",
                },
                "& .MuiListItemText-primary": {
                    color: "white",
                },
                }}
            >
                <ListItemIcon>
                <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItem>
           
            <ListItem
                selected={activeLink === "/logout"}
                onClick={handleLogoutClick}
                sx={{
                "&:hover, &.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    cursor: "pointer",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                    color: theme.palette.icon.secondary,
                    },
                    borderRadius: "10px",
                },
                borderRadius: "10px",
                "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                    minWidth: "2.2em",
                },
                "& .MuiListItemText-primary": {
                    color: "white",
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
            vertical: 'bottom',
            horizontal: 'right',
            }}
            transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
            }}
        >
            <Box sx={{ width: 250 }}>{additionalDrawerContent}</Box>
        </Popover>

        <Dialog
            open={isLogoutPopupOpen}
            onClose={closeLogoutPopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
            style: {
                backgroundColor: "#FEFCFD",
                color: theme.palette.primary.main,
                borderRadius: '20px'
            },
            }}
        >
            <DialogTitle
            id="alert-dialog-title"
            sx={{
                color: theme.palette.icon.main,
                fontSize: "24px",
                textAlign: "center",
                fontWeight: "bold",
            }}
            >
            {"Conferma Logout"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText
                id="alert-dialog-description"
                sx={{
                color: theme.palette.text.secondary,
                fontSize: "18px",
                textAlign: "center",
                }}
            >
                Sei sicuro di voler effettuare il logout?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: "1em",
                }}
            >
                <Button
                onClick={closeLogoutPopup}
                variant="contained"
                sx={{
                    borderRadius: '10px',
                    width: '8em',
                    bgcolor: theme.palette.button.secondary,
                    color: theme.palette.textButton.secondary,
                    marginRight: "5px",
                    marginTop: "10px",
                    "&:hover": {
                    transform: "scale(1.05)",
                    bgcolor: theme.palette.button.secondary,
                    color: theme.palette.textButton.secondary,
                    },
                }}
                >
                Annulla
                </Button>
                <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                    borderRadius: '10px',
                    width: '8em',
                    bgcolor: theme.palette.button.main,
                    marginLeft: "5px",
                    marginTop: "10px",
                    marginRight: "50px",
                    color: theme.palette.textButton.main,
                    "&:hover": {
                    bgcolor: theme.palette.button.mainHover,
                    color: theme.palette.textButton.main,
                    transform: "scale(1.05)",
                    },
                }}
                autoFocus
                >
                Conferma
                </Button>
            </Box>
            </DialogActions>
        </Dialog>

        <AppuntamentoModal
            open={appuntamentoModal}
            handleClose={closeAppuntamentoModal}
        />

        <EmailModal open={emailModal} handleClose={closeEmailModal} />
        </Box>
    );
    }

    export default Sidebar;
