    import React, { useState }                              from "react";
    import { Box, Container, Fab, Popover }                 from "@mui/material";
    import AddIcon                                          from '@mui/icons-material/Add'; //bottone per chatgpt
    import GptChat                                          from '../components/GptChat';
    import QuestionAnswerIcon                               from '@mui/icons-material/QuestionAnswer';
    import { useMediaQuery }                                from '@mui/material';

    const SchemePage = ({ children }) => {
         //stato di AddIcon
    const [anchorEl, setAnchorEl] = useState(null);
    const [isRotated, setIsRotated] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width: 800px)');

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
    const isBusinessUser = userHasRole('BUSINESS');

    return (
    <Container
        maxWidth={false}
        disableGutters
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            minHeight: "100dvh",
            width: "100%",
            p: 3
        }}
        >
        <Container
            maxWidth={false}
            disableGutters
            sx={{
            flexGrow: 1,
            ml: isSmallScreen ? "3.5em" : "11em",
            backgroundColor: "#FEFCFD",
            borderRadius: "20px",
            minHeight: "100dvh",
            mt: 1.5,
            p: 3,
            }}
        >
            {children}
        </Container>
    </Container>

    );
    };

    export default SchemePage;
