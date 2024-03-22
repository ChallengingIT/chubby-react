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
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2em', justifyContent:'space-between', alignItems: 'center' }}>
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
            <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', ml: '12.5em', mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden' }}>
                <Box sx={{ width: '22%', height: '100%', background: '#B2C5BB', p:2, overflow: 'hidden' }}>
                    {/* Contenuto della prima Box */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: '100%'
                    }}>
                        <Button sx={{
                            color: 'black',
                            border:'none',
                            fontSize: '0.8em',
                            cursor: 'pointer',
                            outline: 'none',
                            borderRadius: '10px',
                            mt: 4,
                            ml: 2
                        }}
                        >
                            <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                            Indietro
                        </Button>
                    </Box>


                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    width: '100%',
                    ml: 2,
                    mt: 5
                }}>
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
                                    backgroundColor: 'trasparent',
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: '#00853C',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeSection === `/${item.title.toLowerCase()}` ? 'trasparent' : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeSection === `/${item.title.toLowerCase()}` ? 'black' : 'black',
                                    minWidth: '2.2em',
                                },
                                '& .MuiListItemText-primary': {
                                    color: activeSection === `/${item.title.toLowerCase()}` ? '#00853C' : 'black',
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

                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    <Button sx={{
                        color:'black',
                        '&:hover': {
                            transform:'scale(1.1)',
                        },
                    }}>
                        Salva
                    </Button>
                </Box>



                </Box>
                <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD', p: 2,  display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    {/* Contenuto della seconda Box */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5em' }}>
                            {renderFormFields()}
                        </Box>
                    </Box>
                

                </Box>

        </Box>
    )
}

export default NuovoNeed;






// <Box sx={{ flexGrow: 1, p: 3, ml: '12.2em', mt: '0.5em', mb: '0.8em', mr: '0.8em', borderRadius: '20px', display: 'flex', justifyContent: 'center', background: 'linear-gradient(to right, #80b791 22%, #FEFCFD 22%)' }}>
// <Box sx={{ height: '100%', display: 'flex', mt: 4, flexDirection: 'column', gap: 5, overflow: 'hidden', width: '17%', pb: 5 }}>
//     <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
//         <Button
//         sx={{
//             color: 'black',
//             border: 'none',
//             fontSize: '0.8rem',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.5rem 1rem',
//             outline: 'none',
//             borderRadius: '10px',
//         }}
//         >
//             <span style={{ marginRight: '0.5em' }}>{"<"}</span>
//             Indietro
//         </Button>
//     </Box>

// +
//     <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%', mr: 5 }}>
//         <List sx={{ display: 'flex', flexDirection: 'column', width: '90%'}}>
//             {menu.map((item) => (
//                 <ListItem
//                     key={item.title}
//                     selected={activeSection === item.title}
//                     onClick={() => setActiveSection(item.title)}
//                     sx={{
//                         gap: 0,
//                         mb: 4,
//                         '&:hover, &.Mui-selected': {
//                             backgroundColor: 'trasparent',
//                             cursor: 'pointer',
//                             '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//                                 color: '#00853C',
//                             },
//                             borderRadius: '10px',
//                         },
//                         borderRadius: '10px',
//                         backgroundColor: activeSection === `/${item.title.toLowerCase()}` ? 'trasparent' : '',
//                         '& .MuiListItemIcon-root': {
//                             color: activeSection === `/${item.title.toLowerCase()}` ? 'black' : 'black',
//                             minWidth: '2.2em',
//                         },
//                         '& .MuiListItemText-primary': {
//                             color: activeSection === `/${item.title.toLowerCase()}` ? '#00853C' : 'black',
//                         },
//                     }}
//                 >
//                     <ListItemIcon>
//                         {item.icon}
//                     </ListItemIcon>
//                     <ListItemText primary={item.title} />
//                 </ListItem>
//             ))}
//         </List>
        
//     </Box>
//     <Box sx={{ display: 'flex', justifyContent: 'center', mr: 2}}>
//             <Button
//                 style={{
//                     backgroundColor: 'trasparent',
//                     color: 'black',
//                     border: 'none',
//                     fontSize: '0.8rem',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     padding: '0.5rem 1rem',
//                     outline: 'none',
//                     borderRadius: '10px',
                    
//                 }}
//             >
//                 Salva
//             </Button>
//             </Box>
//             </Box>

// <Box sx={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column', pl: 2, left: '5em' }}>
//     {/* Form di inserimento dati */}
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '25%' }}>
//         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5em' }}>
//             {renderFormFields()}
//         </Box>
//     </Box>
// </Box>
// </Box>
