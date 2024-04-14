import React, {useState, useEffect}         from 'react';
import { useNavigate }                      from 'react-router-dom';
import EmailIcon                            from '@mui/icons-material/Email';
import BusinessCenterIcon                   from '@mui/icons-material/BusinessCenter';
import LocalPhoneIcon                       from '@mui/icons-material/LocalPhone';
import BusinessIcon                         from '@mui/icons-material/Business'; //azienda
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AutoModeIcon                         from '@mui/icons-material/AutoMode'; //stato
import ExploreIcon from '@mui/icons-material/Explore'; //need
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'; //azioni



import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    Modal,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Select,
    MenuItem,
    TextField
    } from '@mui/material';


const KeypeopleCardFlip = ({valori, onDelete}) => {

    const [ modalStorico,        setModalStorico      ] = useState(false);
    const [ modalAzioni,         setModalAzioni       ] = useState(false);
    const [ modalDelete,       setModalDelete     ] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const [ newAzione,          setNewAzione        ] = useState(valori.azione?.id); 
    const [ newData,          setNewData        ] = useState(valori.date);
    const [ newNota,          setNewNota        ] = useState(valori.note);




    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };


    const navigateToAggiorna = (id, event) => {
        event.stopPropagation();
        navigate(`/contacts/modifica/${valori.id}`, { state: { ...valori } });
    };

    const handleOpenModalStorico = () => {
        setModalStorico(true);
    };
    const handleCloseModalStorico = () => setModalStorico(false);

    const handleOpenModalAzioni = () => {
        setModalAzioni(true);
    };
    const handleCloseModalAzioni = () => setModalAzioni(false);

    const handleChangeAzione = (event) => {
        setNewAzione(event.target.value); 
    };

    const handleChangeData = (event) => {
        setNewData(event.target.value); 
    };

    const handleChangeNota = (event) => {
        setNewNota(event.target.value); 
    };


    const handleOpenModalDelete = (event) => {
        event.stopPropagation();
        setModalDelete(true);
    };

    const handleCloseModalDelete = (event) => {
        setModalDelete(false);
    };
    


    const confirmDelete = (id, event) => {
        onDelete();
        handleCloseModalDelete(true);
    };




    const cardContainerStyle = {
        width: '80%',
        borderRadius: '20px',
        marginLeft: '4em',
        marginRight: '2em',
        border: 'solid 2px #00B400',
            '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.05)',
        }
        
       
        
    };

    const cardStyle = {
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: isFlipped ? 'rotateY(180deg)' : 'none',
        width: '100%',
        perspective: '1000px',
        borderRadius: '20px',
        display: 'flex',

        minHeight: '16em',
        // border: 'solid 2px #00B401',
        
    };

    const cardFrontStyle = {
        backfaceVisibility: 'hidden',
    };

    const cardBackStyle = {
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    };


    const navigate = useNavigate();




    // const cardStyle = {
    //     borderRadius: '20px',
    //     maxWidth: '80%',
    //     justifyContent: 'center',
    //     margin: 'auto',
    //     cursor: 'pointer',
    //     height: 'auto',
    //     border: '2px solid', 
    //     transition: 'transform 0.3s ease, border-width 0.3s ease',
    //     ...getCardStyle(valori.tipologia) 
    // };


    const menuData = [
        {
            title: 'Azione',
            icon: <DoubleArrowIcon />,
            onClick: (event) => {
                handleOpenModalAzioni(event);
            }
        },
        {
            title: 'Need',
            icon : <ExploreIcon />,
        },
        
        {
            title: 'Storico',
            icon: <AutoStoriesIcon />,
            onClick: (event) => {
                handleOpenModalStorico(event);
            }
        },
        {
            title: 'Aggiorna Contatto',
            icon: <SettingsIcon />,
            onClick: (event) => {
                navigateToAggiorna(valori.id, event);
            }
        },
        {
            title: 'Elimina Contatto',
            icon: <DeleteIcon />,
            onClick: (event) => {
                handleOpenModalDelete(event);
            }
        }
    ];


    const azioniOptions = [
        { value: 1, label: 'Cold Call'},
        { value: 2, label: 'Call'},
        { value: 3, label: 'Messaggio'},
        { value: 4, label: 'Prospection '},
        { value: 5, label: 'Follow up'},
    ];
    

    return (
        <Card
            raised 
            sx={cardContainerStyle}
            onClick={toggleFlip}
            >
            <div style={cardStyle}>
            <div style={cardFrontStyle}>


        <CardContent sx={{ backfaceVisibility: 'hidden'}}>
            {/* Contenuto della Card */}
            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'column', mb: 1 }}>

            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 1 }}>
            <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                color: 'black',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%' 
                }}
            >
                {valori.nome} {valori.cognome}
            </Typography>
            

            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black' }}>
                {valori.citta}
            </Typography> */}


            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <BusinessIcon sx={{ color: '#00B401', mr: 1 }} />
                {valori.cliente.denominazione}
            </Typography>


            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <BusinessCenterIcon sx={{ color: '#00B401', mr: 1 }} />
                {valori.ruolo}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <AutoModeIcon sx={{ color: '#00B401', mr: 1 }} />
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                <AutoModeIcon sx={{ color: '#00B401', mr: 1 }} />
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: '#00B401', mr: 1 }} />
                    {valori.email}
            </Typography>

            <Typography variant='body2' color='text.secondary' sx={{ color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1}}>
                <LocalPhoneIcon sx={{ color: '#00B401', mr: 1}} />
                {valori.cellulare}
            </Typography>
                </Box>
                <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'end', 
            paddingRight: '16px', 
            paddingBottom: '16px' 
        }}>
                <img src={`data:image/png;base64,${valori.cliente.logo}`} alt="Logo" style={{width: '80px', height: '80px', borderRadius: '50%'}} />
        </Box>
                </Box>
        </CardContent>
        </div>



        <div style={cardBackStyle}>
        <CardContent sx={{ backfaceVisibility: 'hidden'}}>
            {/* Contenuto della Card */}
            <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                color: 'black',
                fontWeight: 'bold',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                
                }}
            >
                Menu
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', flexDirection: 'column', mb: 1 }}>
            <List>
                    {menuData.map((item, index) => (
                        <ListItem
                            key={item.title}
                            selected={activeLink === `/${item.title.toLowerCase()}`}
                            onClick={item.onClick}  
                            sx={{
                                gap: 0,
                                '&:hover, &.Mui-selected': {
                                    backgroundColor: '#00B401',
                                    cursor: 'pointer',
                                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                        color: 'white',
                                    },
                                    borderRadius: '10px',
                                },
                                borderRadius: '10px',
                                backgroundColor: activeLink === `/${item.title.toLowerCase()}` ? '#00B401' : '',
                                '& .MuiListItemIcon-root': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? '#00B400' : '#00B401',
                                    minWidth: '2.2em',
                                },
                                '& .MuiListItemText-primary': {
                                    color: activeLink === `/${item.title.toLowerCase()}` ? '#00B400' : 'black',
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Box
                            sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Sei sicuro di voler eliminare l'azienda?
                            </Typography>
                            <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 3
                            }}>
                                <Button
                                onClick={handleCloseModalDelete}
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: '5px',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                        transform: 'scale(1.05)'
                                    },
                                }}>
                                Indietro
                            </Button>
                            <Button
                            onClick={confirmDelete}
                            sx={{
                                backgroundColor: '#00B401',
                                color: 'white',
                                borderRadius: '5px',
                                '&:hover': {
                                    backgroundColor: '#00B401',
                                    color: 'white',
                                    transform: 'scale(1.05)'
                                },
                            }}>
                                Conferma
                            </Button>
                            </Box>
                            </Box>
                </Modal>



                <Modal
                open={modalStorico}
                onClose={handleCloseModalStorico}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClick={(event) => event.stopPropagation()}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <Box
                            sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '40vw',
                            height: 'auto',
                            border: 'solid 2px #00B400'
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.8em'}}>
                            Storico  
                            </Typography>
                            </Box>
                </Modal>



                <Modal
                        open={modalAzioni}
                        onClose={() => setModalAzioni(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        >
                        <Box
                            sx={{
                            backgroundColor: 'white',
                            p: 4,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            width: '80vw',
                            height: 'auto'
                            }}
                        >
                            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                            Cambia stato al need
                            </Typography> */}

                            <Select
                            fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={newAzione}
                                onChange={handleChangeAzione}
                                sx={{ width: '30%' }}
                            >
                                {azioniOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>


                            <TextField
                            fullWidth
                            label="Seleziona Data"
                            type="date"
                            defaultValue={""} // Puoi mettere una data di default se vuoi
                            sx={{ width: '30%', mt: 2 }} // Aggiungi un margine top per distanziarlo dalla select
                            InputLabelProps={{
                                shrink: true, // Questo fa in modo che l'etichetta non si sovrapponga al valore
                            }}
                            onChange={handleChangeData} // Assicurati di gestire il cambiamento della data
                            />

                            <TextField
                            fullWidth
                            label="Note"
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ width: '30%', mt: 2 }} // Aggiungi un margine top per distanziarlo dal campo data
                            onChange={handleChangeNota} // Assicurati di gestire il cambiamento del testo delle note
                            />


                            

                            <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                pt: 2,
                                gap: 3
                            }}
                            >
                            <Button
                                onClick={handleCloseModalAzioni}
                                sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                                }}
                            >
                                Indietro
                            </Button>

                            {/* <Button
                                onClick={handleUpdateStato}
                                sx={{
                                backgroundColor: '#00B401',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#006b2b',
                                },
                                }}
                            >
                                Salva
                            </Button> */}
                            </Box>
                        </Box>
                        </Modal>


    </Card>
    );
};

export default KeypeopleCardFlip;