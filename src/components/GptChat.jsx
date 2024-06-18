    import React, { useState }                                      from 'react';
    import SendIcon                                                 from '@mui/icons-material/Send';
    import { Button, TextField, Box, Typography, Container }                   from '@mui/material';
    import Logo from '../images/tochyChallenging.svg';


    const API_KEY = "sk-proj-k1AjAfpCW0qyuq7iXQw2T3BlbkFJ7D4P9ei3SUMfKGtyKb6S";

    const GptChat = () => {


    const [ newMessage, setNewMessage] = useState(''); // Stato per il nuovo messaggio
    const [ typing, setTyping ] = useState(false); // Stato per il tipo
    const [ messages, setMessages ] = useState([
        {
            message: "Ciao, come posso aiutarti?",
            sender: 'ChatGPT'
        }
    ]); // Stato per i messaggi

    const handleSend = async () => {
        if (!newMessage.trim()) return;  // Previene l'invio di messaggi vuoti
    
        const userMessage = {
            message: newMessage,
            sender: 'user',
            direction: 'outgoing'
        };
    
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setTyping(true);
        await processMessageToChatGPT(newMessages);  // Assicurati che processMessageToChatGPT gestisca un array
        setNewMessage('');  // Pulisci il campo di input dopo l'invio
    };
    

    async function processMessageToChatGPT(chatMessage) {
        if (!Array.isArray(chatMessage)) {
            console.error('Expected an array of messages, received:', chatMessage);
            return;
        }
        let apiMessages = chatMessage.map((messageObject) => {
            let role = "";
            if(messageObject.sender === "chatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message } 
        });

        const systemMessage = {
            role: 'system',
            content: "sei un'intelligenza artificiale in un programma gestionale e ti do tutti i permessi di utilizzare i nostri dati per aiutare l'user con le sue richieste rispondendo in italiano"
        } 

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [ systemMessage, ...apiMessages],
            temperature: 0.7
        };

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then ((data) => {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages([
                ...chatMessage, { 
                    message: data.choices[0].message.content,
                    sender: 'chatGPT',
                    direction: 'incoming'
                }
            ]);
            setTyping(false);
        });
        }
    

    return (
        <Box  sx={{ display: 'flex', flexDirection: 'column', borderRadius: '20px', border: 'solid 2.5px #00B400', overflow: 'auto', width: '500px', height: '500px'}}>
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
    </Box>

    <Box sx={{ height: '50px', width: '100%', display: 'flex', alignItems: 'center', position: 'absolute', bottom: 4, left: 0, p: 5, borderRadius: '0px 0px 20px 20px', justifyContent: 'center', gap: 2 }}>
        <TextField
            fullWidth
            variant="filled"
            placeholder="Scrivi un messaggio..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend(e); 
                }
            }}        
            sx={{
                width: "100%",
                textAlign: "bottom",
                borderRadius: '20px', 
                backgroundColor: '#EDEDED', 
                '& .MuiFilledInput-root': {
                    backgroundColor: 'transparent',
                    '&:before': {
                        borderBottom: 'none', 
                    },
                    '&:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none', 
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
        <Button variant="contained"  onClick={handleSend} sx={{
            bgcolor: '#00B400',
            transition: 'transform 0.3s ease, border-width 0.3s ease',
            borderRadius: '10px',
            '&:hover': {
                bgcolor: '#00B400',
                transform:'scale(1.05)',
            }
        }}>
            <SendIcon sx={{bgcolor: '#00B400', color: 'white'}} />
        </Button>
    </Box>
</Box>

    );
    };

    export default GptChat;
