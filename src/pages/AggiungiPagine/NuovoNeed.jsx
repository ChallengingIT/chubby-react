import React, { useState } from 'react';

import { Box, Typography, Checkbox, TextField, Select, MenuItem, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; //cerchio vuoto

function NuovoNeed() {
    const [activeSection, setActiveSection] = useState('Informazioni Generali');

    const menu = [
        { 
            title: 'Informazioni Generali',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Locazione',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Competenze',
            icon: <CircleOutlinedIcon />
        }
    ];

    const renderFormFields = () => {
        switch (activeSection) {
            case 'Informazioni Generali':
                return (
                    <Box sx={{ display: 'grid',  gridTemplateColumns: 'repeat(3, 1fr)', gap: '5em', width: '100%' }}>
                        {/* Campi per Informazioni Generali */}
                        <Select fullWidth type="text" placeholder="Campo 1" />
                        <TextField fullWidth type="text" placeholder="Campo 2" />
                    </Box>
                );
            case 'Locazione':
                return (
                    <Box>
                        {/* Campi per Locazione */}
                        <Select type="text" placeholder="Campo 3" />
                        <Select type="text" placeholder="Campo 4" />
                    </Box>
                );
            case 'Competenze':
                return (
                    <Box>
                        {/* Campi per Competenze */}
                        <Select type="text" placeholder="Campo 5" />
                        <Select type="text" placeholder="Campo 6" />
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
            <Box sx={{ flexGrow: 1, p: 3, ml: '12.2em', mt: '0.5em', mb: '0.8em', mr: '0.8em', borderRadius: '20px', display: 'flex', justifyContent: 'flex-start', background: 'linear-gradient(to right, #191919 20%, #FEFCFD 20%)' }}>
                {/* Box con gradiente lineare */}
                <Box sx={{ height: '100%', display: 'flex', mt: 4, justifyContent: 'flex-start', alignItems: 'start', flexDirection: 'column', gap: 5, overflow: 'hidden', width: '20%' }}>
                    {/* Menu */}
                    <Button
                        style={{
                            color: 'white',
                            border: 'none',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem 1rem',
                            outline: 'none',
                            borderRadius: '10px',
                        }}
                    >
                        <span style={{ marginRight: '0.5rem' }}>{"<"}</span>
                        Indietro
                    </Button>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5, overflow: 'hidden', width: '100%', mr: 5 }}>
                        <List sx={{ display: 'flex', flexDirection: 'column', width: '90%'}}>
                            {menu.map((item) => (
                                <ListItem
                                    key={item.title}
                                    selected={activeSection === item.title}
                                    onClick={() => setActiveSection(item.title)}
                                    sx={{
                                        gap: 0,
                                        mb: 4,
                                        '&:hover, &.Mui-selected': {
                                            backgroundColor: '#00853C',
                                            cursor: 'pointer',
                                            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                                color: 'white',
                                            },
                                            borderRadius: '10px',
                                        },
                                        borderRadius: '10px',
                                        backgroundColor: activeSection === `/${item.title.toLowerCase()}` ? '#00853C' : '',
                                        '& .MuiListItemIcon-root': {
                                            color: activeSection === `/${item.title.toLowerCase()}` ? 'white' : '#00853C',
                                            minWidth: '2.2em',
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: activeSection === `/${item.title.toLowerCase()}` ? 'white' : 'white',
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
                        
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4}}>
                            <Button
                                style={{
                                    backgroundColor: '#00853C',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.5rem 1rem',
                                    outline: 'none',
                                    borderRadius: '10px',
                                }}
                            >
                                Salva
                            </Button>
                            </Box>
                </Box>
                <Box sx={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: '2em' }}>
                    {/* Form di inserimento dati */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '25%' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5em' }}>
                            {renderFormFields()}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default NuovoNeed;
