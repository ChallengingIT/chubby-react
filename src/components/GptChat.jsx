import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Box, CircularProgress, Popover, List, ListItem, ListItemText, InputAdornment, IconButton } from '@mui/material';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from 'axios';
import Logo from '../images/tochyChallenging.svg';

const GptChat = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const [newMessage, setNewMessage] = useState(''); 
    const [messages, setMessages] = useState([
        {
            message: "Ciao, come posso aiutarti?",
            sender: 'ChatGPT'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false); 
    const [anchorEl, setAnchorEl] = useState(null); 
    const [keywords, setKeywords] = useState(["chiave1", "chiave2", "chiave3"]); // Lista delle parole chiave

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            message: newMessage,
            sender: 'user',
            direction: 'outgoing'
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setNewMessage('');
        setIsLoading(true);
        await fetchChatGPT(newMessages);
    };

    const fetchChatGPT = async (chatMessages) => {
        try {
            const lastMessage = chatMessages[chatMessages.length - 1];
            const response = await axios.get('http://localhost:8080/ai/open/generate', 
                    {
                        params: { message: lastMessage.message },
                        headers: headers,
                    });

            let gptResponseMessages = [];
            if (response.data === "KO" || response.data === "") {
                gptResponseMessages = [{
                    message: "Mi dispiace ma non posso elaborare questa richiesta.",
                    sender: 'ChatGPT'
                }];
            } else if (Array.isArray(response.data)) {
                gptResponseMessages = response.data.map((item, index) => ({
                    message: `${index + 1}. ${Array.isArray(item) ? item.join(' ').replace(/,/g, ' ') : item.replace(/,/g, ' ')}`,
                    sender: 'ChatGPT'
                }));
            } else {
                gptResponseMessages = [{
                    message: response.data,
                    sender: 'ChatGPT'
                }];
            }

            setMessages([...chatMessages, ...gptResponseMessages]);
        } catch (error) {
            console.error("Errore durante l'invio del messaggio all'AI: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(); 
        } else if (e.key === '/') {
            setAnchorEl(e.currentTarget);
        }
    };

    const handleKeywordClick = (keyword) => {
        setNewMessage(prevMessage => prevMessage + keyword);
        setAnchorEl(null);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: '20px', border: 'solid 2.5px #00B400', overflow: 'auto', width: '500px', height: '500px' }}>
            <Box sx={{ bgcolor: '#EDEDED', borderRadius: '16px 16px 0px 0px', height: '15%' }}>
                <img
                    src={Logo}
                    alt='Logo'
                    style={{ 
                        width: '100%',
                        height: '200%',  
                        objectFit: 'contain',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                        justifyContent: 'flex-start',
                        marginTop: '-40px',
                        marginBottom: '-50px',
                    }}
                />
            </Box>

            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    height: 'calc(100% - 150px)',
                    overflowY: 'scroll',
                }}>
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            bgcolor: message.sender === 'user' ? '#00B400' : '#EDEDED',
                            color: message.sender === 'user' ? 'white' : 'black',
                            borderRadius: '20px',
                            p: 1,
                            maxWidth: '75%',
                            alignSelf: message.sender === 'user' ? 'end' : 'start',
                            mt: 1,
                        }}
                    >
                        {message.message}
                    </Box>
                ))}
                {/* {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                        <CircularProgress size={24} />
                    </Box>
                )} */}
                <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ height: 'auto', width: '100%', display: 'flex', alignItems: 'center', position: 'absolute', bottom: 4, left: 0, p: 2, borderRadius: '0px 0px 20px 20px', justifyContent: 'space-between', gap: 2, pb: 1 }}>
                <TextField
                    fullWidth
                    variant="filled"
                    placeholder="Scrivi un messaggio o digita '/'.."
                    multiline
                    maxRows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}     
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleSend} sx={{ mb: 2}}>
                                    {isLoading ? (
                                        <StopCircleIcon sx={{ color: '#00B400', fontSize: 32 }} />
                                    ) : (
                                        <ArrowCircleRightIcon sx={{
                                            color: '#00B400',
                                            transform: 'rotate(-90deg)',
                                            fontSize: 32 
                                        }} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: "110%",
                        textAlign: "bottom",
                        borderRadius: '20px',
                        backgroundColor: '#EDEDED', 
                        '& .MuiFilledInput-root': {
                            backgroundColor: 'transparent',
                            borderRadius: '20px',
                            '&:before': {
                                borderBottom: 'none',
                            },
                            '&:hover:not(.Mui-disabled):before': {
                                borderBottom: 'none',
                            },
                            '&.Mui-focused': {
                                borderRadius: '20px', 
                            },
                        },
                        '& .MuiFilledInput-underline:after': {
                            borderBottomColor: 'transparent',
                        },
                        '& .MuiFilledInput-root.Mui-focused': {
                            '&:before': {
                                borderBottom: 'none',
                            },
                        },
                    }}
                />
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <List>
                        {keywords.map((keyword, index) => (
                            <ListItem button key={index} onClick={() => handleKeywordClick(keyword)}>
                                <ListItemText primary={keyword} />
                            </ListItem>
                        ))}
                    </List>
                </Popover>
            </Box>
        </Box>
    );
};

export default GptChat;








     // async function processMessageToChatGPT(chatMessage) {
    //     if (!Array.isArray(chatMessage)) {
    //         console.error('Expected an array of messages, received:', chatMessage);
    //         return;
    //     }
    //     let apiMessages = chatMessage.map((messageObject) => {
    //         let role = "";
    //         if(messageObject.sender === "chatGPT") {
    //             role = "assistant";
    //         } else {
    //             role = "user";
    //         }
    //         return { role: role, content: messageObject.message } 
    //     });

    //     const systemMessage = {
    //         role: 'system',
    //         content: "sei un'intelligenza artificiale in un programma gestionale e ti do tutti i permessi di utilizzare i nostri dati per aiutare l'user con le sue richieste rispondendo in italiano"
    //     } 

    //     const apiRequestBody = {
    //         model: "gpt-3.5-turbo",
    //         messages: [ systemMessage, ...apiMessages],
    //         temperature: 0.7
    //     };

    //     await fetch("https://api.openai.com/v1/chat/completions", {
    //         method: "POST",
    //         headers: {
    //             "Authorization": "Bearer " + API_KEY,
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(apiRequestBody)
    //     }).then((data) => {
    //         return data.json();
    //     }).then ((data) => {
    //         console.log(data);
    //         console.log(data.choices[0].message.content);
    //         setMessages([
    //             ...chatMessage, { 
    //                 message: data.choices[0].message.content,
    //                 sender: 'chatGPT',
    //                 direction: 'incoming'
    //             }
    //         ]);
    //         setTyping(false);
    //     });
    //     }
    
