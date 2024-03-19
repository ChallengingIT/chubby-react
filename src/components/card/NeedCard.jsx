import React, {useState, useEffect}                 from 'react';
import { useNavigate }                      from 'react-router-dom';
import ChecklistIcon                        from '@mui/icons-material/Checklist';
import WorkIcon                             from '@mui/icons-material/Work';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Torcia from "../../images/torciaSF.png";
import EditIcon from '@mui/icons-material/Edit'; //modifica
import JoinInnerIcon from '@mui/icons-material/JoinInner'; //match
import AutorenewIcon from '@mui/icons-material/Autorenew'; //stato
import DeleteIcon from '@mui/icons-material/Delete'; //cancella


import { 
    Card, 
    CardContent, 
    Box,
    Typography,
    Button,
    CardActions,
    Modal,
    Select,
    MenuItem,
    Popover,
    IconButton
    } from '@mui/material';


    const calculateDataDifference = (weekString) => {
        const [ year, week ] = weekString.split('-W');
        const firstDayOfYear = new Date(year, 0, 1);
        const weekDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + (week - 1) * 7));
        weekDate.setDate(weekDate.getDate() - weekDate.getDay());
        const currentDate = new Date();
        const diffInMs = currentDate - weekDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays < 7) {
            return `${Math.round(diffInDays)} giorn${Math.round(diffInDays) !== 1 ? 'i' : ''} fa`;
        } else {
            const diffInWeeks = diffInDays / 7;
            return `${Math.round(diffInWeeks)} settiman${Math.round(diffInWeeks) !== 1 ? 'e' : ''} fa`;
        }
    };


const NeedCard = ({valori, statoOptions, onDelete, onRefresh }) => {

    const navigate = useNavigate();
    const [ modalStato,        setModalStato      ] = useState(false);
    const [ modalDelete,       setModalDelete     ] = useState(false);
    const [ newStato,          setNewStato] = useState(valori.stato?.id); 
    const [ idNeed,            setIdNeed          ] = useState(null);


    const [anchorEl, setAnchorEl] = useState(null);

    const openPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closePopover = () => {
        setAnchorEl(null);
    };

    const isPopoverOpen = Boolean(anchorEl);

    const popoverId = isPopoverOpen ? 'popover-id' : undefined;



    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };


    useEffect(() => {
        setNewStato(valori.stato?.id);
    }, [valori.stato?.id]);
    






    // const [ setOpenStato        ] = useState(false);


    // const handleCardClick = (id) => {
    //     navigate(`/need/dettaglio/${valori.id}`, { state: { ...valori } });
    // };


    const navigateToAssocia = (id, event) => {
        // event.stopPropagation();
        navigate(`/need/match/${valori.id}`, { state: {...valori}});
    };

    const navigateToAggiorna = (id, event) => {
        // event.stopPropagation();
        navigate(`/need/modifica/${valori.id}`, { state: { ...valori } });
    };

    // const handleOpenStato = (event) => {
    //     event.stopPropagation();
    //     setOpenStato(true);
    // };

    // const handleCloseStato = (event) => {
    //     event.stopPropagation();
    //     setOpenStato(false);
    // };

    // const handleOpenSkillsDialog = (event) => {
    //     event.stopPropagation();
    //     setOpenSkillsDialog(true);
    // };

    const skillsToShow = valori.skills.slice(0, 3).map(skill => skill.descrizione).join(', ');
    const additionalSkillsCount = valori.skills.length > 3 ? `e altre ${valori.skills.length - 3}` : '';



    const timeDifference = calculateDataDifference(valori.week);



    const handleOpenModalStato = (id) => {
        setModalStato(true);
        setIdNeed(id);
    };
    const handleCloseModalStato = () => setModalStato(false);

    const handleChangeStato = (event) => {
        setNewStato(event.target.value); 
    };



      const handleUpdateStato = async () => {
        const idStato = newStato;
        const params = new URLSearchParams({ stato: idStato });


        try {
            const responseUpdateStato = await axios.post(`http://localhost:8080/need/react/salva/stato/${idNeed}?${params.toString()}`, { headers: headers});
            setModalStato(false);
            onRefresh();
        } catch(error) {
            console.error("Errore durante l'aggiornamento dello stato: ", error);
        }
      };




    const handleOpenModalDelete = () => setModalDelete(true);
    const handleCloseModalDelete = () => setModalDelete(false);

    const confirmDelete = () => {
        onDelete();
        handleCloseModalDelete(true);
    };







    


    return (
        <Card
        // onClick={handleCardClick}
        raised
        sx={{
            borderRadius: '20px', 
            maxWidth: '80%', 
            justifyContent: 'center', 
            margin: 'auto', 
            cursor: 'pointer', 
            height: 'auto', 
            border: '2px solid #00853C', 
            transition: 'transform 0.3s ease, border-width 0.3s ease', 
            '&:hover': {
            transform: 'scale(1.05)', 
            border: '4px solid #00853C',
            p: 1
        }}
    }
    >
        <CardContent sx={{ p: 1 }}>
            {/* Contenuto della Card */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                p: 1
                }}
            >
                {valori.descrizione}
            </Typography>
                    {/* <Button
                    onClick={handleOpenModalDelete}
                    size='small'
                    sx={{
                        color: '#000000',
                        minWidth: 'auto',
                        borderRadius:'50%',
                        '&:hover': {
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius:'50%',
                        },
                    }}
                    >
                        <CloseIcon />
                    </Button> */}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, color: 'black', pl: 1 }}>
                {valori.location}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, color: 'black', pl: 1 }}>
                {timeDifference}
            </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                    {valori.tipologia && valori.tipologia.descrizione
                    ? valori.tipologia.descrizione
                    : "N/A"}
                    </Typography>

            <Typography variant="body2" color="text.primary"  sx={{  color: 'black', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', mt: 1, mb: 1, pl: 1 }}>
                    <ChecklistIcon sx={{ color: '#00853C', mr: 1 }} />
                    Competenze: {skillsToShow} {additionalSkillsCount}
            </Typography>

            {/* <Typography variant="body2" color="text.primary"  sx={{ mt: 4, color: 'black' }}>
                <InputAdornment position="start">
                    <WorkIcon sx={{ color: '#00853C', mr: 1 }} />
                    Tipologia: {valori.tipo}
                </InputAdornment>
            </Typography> */}
        </CardContent>


         {/* Icona di torcia */}
         <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center',  width: 'auto', overflow: 'hidden', m: 0, pl: 1 }}>
                <Button
                    onClick={openPopover} 
                    disableTouchRipple 
                    sx={{ 
                    mb:1,
                    backgroundColor: 'transparent',
                    display: 'flex', 
                    justifyContent: 'flex-start',
                    width: 'auto',
                    m: 0,
                    p: 0,
                    '&:hover': {
                        backgroundColor: 'transparent',
                        transform: 'scaleY(1.1)'
                    },
                    '&:focus': {
                        outline: 'none',
                    },
                    '& .MuiTouchRipple-root': {
                        width: '20%', 
                    },
                    }}>
                    <img src={Torcia} alt="Torcia" style={{ width: '20%', height: '100%', display: 'flex', justifyContent: 'flex-start' }} />
                </Button>
               

            <Popover
                id={popoverId}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column' }}>
                    <Button 
                    onClick={() => navigateToAggiorna(valori.id)}
                    sx={{
                    m: 1,
                    color: 'black',
                    fontWeight: 'bold',
                    textTransform: 'lowercase',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    }}
                    >
                        Modifica
                        <IconButton>
                            <EditIcon sx={{color: '#00853C'}} />
                        </IconButton>
                    </Button>
                    <Button 
                    onClick={() => navigateToAssocia(valori.id)}
                    sx={{
                    m: 1,
                    color: 'black',
                    fontWeight: 'bold',
                    textTransform: 'lowercase',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    }}
                    >
                        Match
                        <IconButton>
                            <JoinInnerIcon sx={{color: '#00853C'}} />
                        </IconButton>
                    </Button>
                    <Button 
                    onClick={handleOpenModalStato}
                    sx={{
                    m: 1,
                    color: 'black',
                    fontWeight: 'bold',
                    textTransform: 'lowercase',
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    }}
                    >
                        Stato
                        <IconButton>
                            <AutorenewIcon sx={{color: '#00853C'}} />
                        </IconButton>
                    </Button>
                    <Button
                    onClick={handleOpenModalDelete}
                    sx={{
                        m: 1,
                        color: 'red',
                        fontWeight: 'bold',
                        textTransform: 'lowercase',
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                    }}
                    >
                        Cancella
                        <IconButton>
                        <DeleteIcon sx={{ color: 'red'}} />
                        </IconButton>
                    </Button>
                </Box>
            </Popover>
            </Box>


                <Modal
                open={modalDelete}
                onClose={handleCloseModalDelete}
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
                            width: '40vw',
                            }}
                            >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Sei sicuro di voler eliminare il need?
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
                                backgroundColor: '#00853C',
                                color: 'white',
                                borderRadius: '5px',
                                '&:hover': {
                                    backgroundColor: '#00853C',
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
                        open={modalStato}
                        onClose={() => setModalStato(false)}
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
                            width: '40vw',
                            }}
                        >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                            Cambia stato al need
                            </Typography>

                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={newStato}
                                onChange={handleChangeStato}
                                sx={{ width: '30%' }}
                            >
                                {statoOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                pt: 2,
                                gap: 3
                            }}
                            >
                            <Button
                                onClick={handleCloseModalStato}
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

                            <Button
                                onClick={handleUpdateStato}
                                sx={{
                                backgroundColor: '#00853C',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#006b2b',
                                },
                                }}
                            >
                                Salva
                            </Button>
                            </Box>
                        </Box>
                        </Modal>
    </Card>
    );
};

export default NeedCard;