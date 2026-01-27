    // import React, { useState } from "react";
    // import SchemePage from "../components/SchemePage";
    // import {
    // Box,
    // Container,
    // Paper,
    // Typography,
    // Avatar,
    // Stack,
    // IconButton
    // } from "@mui/material";
    // import CallIcon from '@mui/icons-material/Call'; //chiama
    // import CallEndIcon from '@mui/icons-material/CallEnd'; //termina chiamata
    // import MicIcon from '@mui/icons-material/Mic'; //attivo
    // import MicOffIcon from '@mui/icons-material/MicOff'; //disattivato
    // import VideocamIcon from '@mui/icons-material/Videocam'; //attiva
    // import VideocamOffIcon from '@mui/icons-material/VideocamOff'; //disattivata

    // const Videocall = () => {
    // const [callActive, setCallActive] = useState(false); 
    // const [micActive, setMicActive ] = useState(false);
    // const [videoActive, setVideoActive] = useState(false);

    
    // const toggleCall = () => {
    //     setCallActive(!callActive);
    // };

    //     const toggleMic = () => {
    //     setMicActive(!micActive);
    // };

    //     const toggleVideo = () => {
    //     setVideoActive(!videoActive);
    // };

    // return (
    //     <SchemePage>
    //     <Container
    //         maxWidth="xl"
    //         sx={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: 'center',
    //         flexDirection: 'column',
    //         gap: 4
    //         }}
    //     >
    //         <Avatar
    //         src="/broken-image.jpg"
    //         sx={{
    //             bgcolor: "#00B400",
    //             mt: 2,
    //             width: 56,
    //             height: 56,
    //         }}
    //         />
    //         <Typography 
    //         sx={{
    //             fontWeight: "bold",
    //             fontSize: "1rem",
    //             color: "#00B401",
    //         }}
    //         >
    //         NOME COGNOME
    //         </Typography>
    //         <Paper
    //         elevation={6}
    //         sx={{
    //             position: "relative",
    //             width: "80%",
    //             height: "80%",
    //             backgroundColor: "#EDEDED",
    //             borderRadius: '20px'
    //         }}
    //         >
    //         <Box
    //             sx={{
    //             width: "100%",
    //             minHeight: "600px",
    //             backgroundColor: "#EDEDED",
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             border: '2px solid #00B400',
    //             borderRadius: '20px'               
    //             }}
    //         >
    //             <Typography sx={{ color: "black" }}>Video del destinatario</Typography>
    //         </Box>
    //         <Box
    //             sx={{
    //             position: "absolute",
    //             bottom: 20,
    //             right: 20,
    //             width: "20%",
    //             height: "20%",
    //             backgroundColor: "#666",
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             border: "2px solid #00B400",
    //             }}
    //         >
    //             <Typography sx={{ color: "black" }}>Il tuo video</Typography>
    //         </Box>
    //         </Paper>
    //         <Stack
    //         direction={{ xs: 'column', sm: 'row' }}
    //         spacing={{ xs: 1, sm: 2, md: 4 }}
    //         >
    //         {micActive ? (
    //             <IconButton size='large' color="#35383D" onClick={toggleMic} sx={{bgcolor: '#EDEDED', }}>
    //             <MicOffIcon />
    //             </IconButton>
    //         ) : (
    //             <IconButton size='large' color="success" onClick={toggleMic} sx={{bgcolor: '#EDEDED', }}>
    //             <MicIcon />
    //             </IconButton>
    //         )}
    //         {callActive ? (
    //             <IconButton size='large' color="white" onClick={toggleCall} sx={{bgcolor: 'red', '&:hover': {bgcolor: 'red', }}}>
    //             <CallEndIcon sx={{ color: 'white'}}/>
    //             </IconButton>
    //         ) : (
    //             <IconButton size='large' color="success" onClick={toggleCall} sx={{bgcolor: '#EDEDED', }}>
    //             <CallIcon />
    //             </IconButton>
    //         )}
    //         {videoActive ? (
    //             <IconButton size='large' color="#35383D" onClick={toggleVideo} sx={{bgcolor: '#EDEDED', }}>
    //             <VideocamOffIcon />
    //             </IconButton>
    //         ) : (
    //             <IconButton size='large' color="success" onClick={toggleVideo} sx={{bgcolor: '#EDEDED', }}>
    //             <VideocamIcon />
    //             </IconButton>
    //         )}
    //         </Stack>
    //     </Container>
    //     </SchemePage>
    // );
    // };

    // export default Videocall;
