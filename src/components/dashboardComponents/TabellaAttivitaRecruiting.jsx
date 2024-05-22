import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Collapse, Checkbox, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TabellaAttivitaBusiness = ({ data = [] }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const initializedData = data.map(item => ({
            ...item,
            completed: item.completed || false 
        }));
        setActivities(initializedData);
    }, [data]); 

    const [expandedId, setExpandedId] = useState(null);

    const handleToggleExpanded = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleToggleCompleted = (id) => {
        const updatedActivities = activities.map(item =>
            item.idAzione === id ? { ...item, completed: !item.completed } : item
        );
        setActivities(updatedActivities);
    };



    const hideScrollbarStyle = {
        width: '100%',
        maxHeight: 280,
        overflow: 'auto',
        bgcolor: 'transparent',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    };

    return (
        <List sx={hideScrollbarStyle}>
            {activities.map((item, index) => (
                <React.Fragment key={item.idAzione || index}>
                    <ListItem 
                        sx={{ bgcolor: 'transparent', borderBottom: '2px solid #ccc7c7' }} 
                        secondaryAction={
                            <Checkbox 
                                edge="end"
                                checked={item.completed}
                                onChange={() => handleToggleCompleted(item.idAzione)}
                                inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.idAzione}` }}
                            />
                        }
                    >
                        <ListItemText 
                            id={`checkbox-list-label-${item.idAzione}`}
                            primary={
                                <Typography style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                                    <span style={{ color: '#808080', fontWeight: 300}}>{(item.data && item.data.slice(11, 16))  || null} </span> 
                                    <span style={{ color: '#00B400', fontWeight: 'bolder'}}> | </span>
                                    <span style={{ fontWeight: 'bold' }}>{item.azione}</span>
                                </Typography>  
                            }
                        />
                        <IconButton
                            onClick={() => handleToggleExpanded(item.idAzione)}
                            aria-label="show more"
                        >
                            {expandedId === item.idAzione ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </ListItem>
                    <Collapse in={expandedId === item.idAzione} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem sx={{ pl: 4 }}>
                                <ListItemText 
                                    primary={
                                        <Typography>
                                            <span style={{ fontWeight: 'bold' }}>Owner:</span> {item.siglaOwner}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem sx={{ pl: 4 }}>
                                <ListItemText 
                                    primary={
                                        <Typography>
                                            <span style={{ fontWeight: 'bold' }}>Candidato:</span> {item.nomeCandidato} {item.cognomeCandidato}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Collapse>
                </React.Fragment>
            ))}
        </List>
    );
};

export default TabellaAttivitaBusiness;
