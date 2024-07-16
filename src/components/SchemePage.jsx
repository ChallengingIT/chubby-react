    import React, { useState } from "react";
    import { Box, Container, Fab, Popover } from "@mui/material";
    import AddIcon                                          from '@mui/icons-material/Add'; //bottone per chatgpt
    import GptChat                                          from '../components/GptChat';
    import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

    const SchemePage = ({ children }) => {
         //stato di AddIcon
    const [anchorEl, setAnchorEl] = useState(null);
    const [isRotated, setIsRotated] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const handleClick = (event) => {

    if (showChat) {
            handleClose();
        } else {
            setAnchorEl(event.currentTarget);
            setIsRotated(!isRotated);
            setShowChat(true);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsRotated(false);
        setShowChat(false);
    };


    const user = JSON.parse(sessionStorage.getItem("user"));


    const userHasRole = (roleToCheck) => {
        const userString = sessionStorage.getItem("user");
        if (!userString) {
            return false;
        }
        const userObj = JSON.parse(userString);
        return userObj.roles.includes(roleToCheck);
    };


    

    const open = Boolean(anchorEl);
    const isBusinessUser = userHasRole('ROLE_BUSINESS');

    return (
        <Container maxWidth="false"
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            height: "auto",
            width: "100vw",
        }}
        >
        {!isBusinessUser && (
            <Fab 
            aria-label="add"
            size="small" 
            sx={{
                    position: 'fixed',
                    bottom: 10,
                    right: 10,
                    bgcolor: '#00B400',
                    transition: 'transform 0.3s ease, border-width 0.3s ease',
                    '&:hover': {
                        bgcolor: '#00B400',
                        transform: 'scale(1.2)'
                    }
                }} onClick={handleClick}>
                    <QuestionAnswerIcon sx={{
                        color: 'white',
                        transition: 'transform 0.3s ease',
                    }} />
                </Fab>
                )}
                <Popover
                open={Boolean(anchorEl) && showChat}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                PaperProps={{ 
                    style: { 
                        borderRadius: '20px',
                        overflow: 'hidden' 
                    },
                    }}
            >
                <GptChat />
            </Popover>
        <Container
        maxWidth="xl"
            sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: 'column',
            p: 3,
            marginLeft: "12.8em",
            // marginTop: "0.5em",
            marginBottom: "0.8em",
            marginRight: "0.8em",
            backgroundColor: "#FEFCFD",
            borderRadius: "20px",
            minHeight: "97vh",
            mt: 1.5,
            }}
        >
            {children}
        </Container>
        </Container>
    );
    };

    export default SchemePage;
