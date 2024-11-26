import React, { useState, useEffect } from "react";
import { useNavigate }                from "react-router-dom";
import FactoryIcon                    from "@mui/icons-material/Factory";
import PlaceIcon                      from "@mui/icons-material/Place";
import TrendingDownIcon               from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon               from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon                 from "@mui/icons-material/TrendingUp";
import JoinInnerIcon                  from "@mui/icons-material/JoinInner";
import SettingsIcon                   from "@mui/icons-material/Settings";
import DeleteIcon                     from "@mui/icons-material/Delete";
import { useTranslation }             from "react-i18next"; 
import { motion }                     from "framer-motion"; 
import CloseIcon                      from "@mui/icons-material/Close"

import {
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    Modal,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";
import { useUserTheme } from "../TorchyThemeProvider";

const AziendeCardFlip = ({ valori, onDelete, isFirstCard }) => {
    const theme = useUserTheme();
    const { t } = useTranslation(); 
    const [modalDelete, setModalDelete] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [mezzoFlip, setMezzoFlip] = useState(false);
    const [activeLink] = useState(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isFirstCard && !hasAnimated) {
            setTimeout(() => {
                setMezzoFlip(true);
                setTimeout(() => {
                    setMezzoFlip(false);
                    setHasAnimated(true);
                }, 500); // Durata della rotazione (mezzo secondo)
            }, 500); // Attendere mezzo secondo prima di iniziare l'animazione
        }
    }, [isFirstCard, hasAnimated]);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };


    const getCardStyle = (tipologia) => {
        switch (tipologia) {
            case "PROSPECT":
            case "Prospect":
                return {
                    borderRadius: "20px",
                    maxWidth: "80%",
                    justifyContent: "center",
                    margin: "auto",
                    cursor: "pointer",
                    height: "auto",
                    transition: "transform 0.3s ease, border-width 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.02)",
                        border: "4px solid #ffae44",
                    },
                };
            case "EXCLIENTE":
            case "Ex cliente":
                return {
                    backgroundColor: "#f0f0f0", // Grigio Chiaro
                    borderColor: "#f0f0f0",
                    margin: "auto",
                };
            default:
                return {
                    borderRadius: "20px",
                    maxWidth: "80%",
                    justifyContent: "center",
                    margin: "auto",
                    cursor: "pointer",
                    height: "auto",
                    border: "5px solid",
                    borderColor: theme.palette.border.main,
                    transition: "transform 0.3s ease, border-width 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.02)",
                        border: "5px solid",
                        borderColor: theme.palette.border.main,
                    },
                };
        }
    };

    const cardContainerStyle = {
        width: "80%",
        borderRadius: "20px",
        marginLeft: "4em",
        marginRight: "2em",
        ...getCardStyle(valori.tipologia),
        "&:hover": {
            cursor: "pointer",
            transform: "scale(1.01)",
        },
    };

    const cardStyle = {
        transformStyle: "preserve-3d",
        transition: "transform 0.6s",
        transform: isFlipped ? "rotateY(180deg)" : mezzoFlip ? "rotateY(40deg)" : "none",
        width: "100%",
        perspective: "1000px",
        borderRadius: "20px",
        display: "flex",
        minHeight: "16em",
    };

    const cardFrontStyle = {
        backfaceVisibility: "hidden",
    };

    const cardBackStyle = {
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    };

    //animazione fade delle card
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 }, // L'elemento parte invisibile e spostato
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Fade-in con durata
    };


    const mediaIda = (ida) => {
        if (ida >= 0 && ida <= 1) {
            return {
                icon: <TrendingDownIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />,
                text: t("Basso"),
            };
        } else if (ida > 1 && ida <= 2) {
            return {
                icon: <TrendingFlatIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />,
                text: t("Medio"),
            };
        } else if (ida > 2) {
            return {
                icon: <TrendingUpIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />,
                text: t("Alto"),
            };
        } else {
            return { icon: null, text: "" };
        }
    };

    const { icon, text } = mediaIda(valori.ida);

    const navigateToAssocia = (id) => {
        navigate(`/need/${valori.id}`, { state: { ...valori } });
    };

    const navigateToAggiorna = (id, event) => {
        navigate(`/business/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalDelete = (event) => {
        setModalDelete(true);
    };

    const handleCloseModalDelete = (event) => {
        setModalDelete(false);
    };

    const confirmDelete = (id, event) => {
        onDelete();
        handleCloseModalDelete(true);
    };

    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };

    const menuData = [
        {
            title: t("Need Associati"),
            icon: <JoinInnerIcon />,
            onClick: () => {
                navigateToAssocia(valori.id);
            },
        },
        {
            title: t("Aggiorna Azienda"),
            icon: <SettingsIcon />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            },
        },
        {
            title: t("Elimina Azienda"),
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            },
            isVisible: userHasRole("ADMIN"),
        },
    ];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInVariants}
        >
        <Card raised sx={cardContainerStyle} onClick={toggleFlip}>
            <div style={cardStyle}>
                <div style={cardFrontStyle}>
                    <CardContent sx={{ backfaceVisibility: "hidden" }}>
                        {/* Contenuto della Card */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "space-between",
                                flexDirection: "column",
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "start",
                                    justifyContent: "flex-start",
                                    flexDirection: "column",
                                    mb: 1,
                                }}
                            >
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        color: "black",
                                        fontWeight: "bold",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        width: "100%",
                                    }}
                                >
                                    {valori.denominazione}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                    sx={{
                                        color: "black",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-end",
                                        mt: 1,
                                        mb: 1,
                                    }}
                                >
                                    <PlaceIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                    {valori.citta} - {valori.sedeOperativa}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        color: "black",
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-end",
                                        mt: 1,
                                        mb: 1,
                                    }}
                                >
                                    <FactoryIcon sx={{ color: theme.palette.icon.main, mr: 1 }} />
                                    {valori.settoreMercato}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: "black",
                                        mt: 1,
                                    }}
                                >
                                    {icon}
                                    IDA: {text}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "end",
                                    paddingRight: "16px",
                                    paddingBottom: "16px",
                                }}
                            >
                                <img
                                    src={`data:image/png;base64,${valori.logo}`}
                                    alt="Logo"
                                    style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </div>

                <div style={cardBackStyle}>
                    <CardContent sx={{ backfaceVisibility: "hidden" }}>
                        {/* Contenuto della Card */}
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                                color: "black",
                                fontWeight: "bold",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                width: "100%",
                            }}
                        >
                            {valori.denominazione}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "flex-start",
                                flexDirection: "column",
                                mb: 1,
                            }}
                        >
                            <List>
                                {menuData
                                    .filter((item) => item.isVisible !== false)
                                    .map((item, index) => (
                                        <ListItem
                                            key={item.title}
                                            selected={activeLink === `/${item.title.toLowerCase()}`}
                                            onClick={item.onClick}
                                            sx={{
                                                gap: 0,
                                                "&:hover, &.Mui-selected": {
                                                    backgroundColor: theme.palette.hover.main,
                                                    cursor: "pointer",
                                                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                                                        color: "white",
                                                    },
                                                    borderRadius: "10px",
                                                },
                                                borderRadius: "10px",
                                                backgroundColor:
                                                    activeLink === `/${item.title.toLowerCase()}`
                                                        ? theme.palette.icon.main
                                                        : "",
                                                "& .MuiListItemIcon-root": {
                                                    color:
                                                        activeLink === `/${item.title.toLowerCase()}`
                                                            ? theme.palette.icon.main
                                                            : theme.palette.icon.main,
                                                    minWidth: "2.2em",
                                                },
                                                "& .MuiListItemText-primary": {
                                                    color:
                                                        activeLink === `/${item.title.toLowerCase()}`
                                                            ? theme.palette.icon.main
                                                            : "black",
                                                },
                                            }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.title} />
                                        </ListItem>
                                    ))}
                            </List>
                        </Box>
                    </CardContent>
                </div>
            </div>

            <Modal
                open={modalDelete}
                onClose={handleCloseModalDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClick={(event) => event.stopPropagation()}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        p: 4,
                        borderRadius: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                        width: "40vw",
                        position: "relative",
                    }}
                >
                    <IconButton
                        onClick={handleCloseModalDelete}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "#8e8e8e",
                            bgcolor: 'transparent',
                            "&:hover": {
                                color: "#db000e",
                                bgcolor: 'transparent',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t('Sei sicuro di voler eliminare l\'azienda?')}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 3,
                        }}
                    >
                        <Button
                            onClick={handleCloseModalDelete}
                            sx={{
                                width: '10em',
                                backgroundColor: "#bfbfbf",
                                color: "white",
                                borderRadius: "10px",
                                "&:hover": {
                                    backgroundColor: "#8e8e8e",
                                    color: "white",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            {t('Indietro')}
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            sx={{
                                width: '10em',
                                backgroundColor: "#ea333f",
                                color: "white",
                                borderRadius: "10px",
                                "&:hover": {
                                    backgroundColor: "#db000e",
                                    color: "white",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            {t('Conferma')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
        </motion.div>

    );
};

export default AziendeCardFlip;
