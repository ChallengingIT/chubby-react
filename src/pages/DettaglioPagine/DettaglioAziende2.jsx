import React, { useState, useEffect }                                                             from "react";
import { useNavigate, useLocation }                                                               from "react-router-dom";
import Sidebar                                                                                    from "../../components/Sidebar";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid }                   from "@mui/material";
import { useParams }                                                                              from "react-router-dom";
import FeedIcon                                                                                   from "@mui/icons-material/Feed";
import EmailIcon                                                                                  from "@mui/icons-material/Email";
import LocalPhoneIcon                                                                             from "@mui/icons-material/LocalPhone";
import dayjs                                                                                      from 'dayjs';
import axios                                                                                      from 'axios';
import AttivitaCard                                                                               from "../../components/card/AttivitaCard";
import InformazioniAziendaCard                                                                    from "../../components/card/InformazioniAziendaCard";
import ComunicazioniCard                                                                          from "../../components/card/ComunicazioniCard";
import NeedCard                                                                                   from "../../components/card/NeedCard";
import ContattiCard                                                                               from "../../components/card/ContattiCard";
import ReusablePopup                                                                              from "../../components/ReusablePopup";
import "../../styles/DettaglioAziende.css"



function DettaglioAziende2() {
        const navigate = useNavigate();
        const location = useLocation();
        const params   = useParams();

        const { aziendaData = {} }  = location.state || {};
        const { id }                = params;
        const idAzienda             = aziendaData.id;
        const nomeAzienda           = aziendaData.denominazione;

        const handleGoBack = () => {
        window.history.back();
        };


        const [ isFeedPopupOpen,    setFeedPopupOpen      ] = useState(false);
        const [ isEmailPopupOpen,   setEmailPopupOpen     ] = useState(false);
        const [ isPhonePopupOpen,   setPhonePopupOpen     ] = useState(false);
        const [ ownerOptions,       setOwnerOptions       ] = useState([]);
        const [ keyPeopleOptions,   setKeyPeopleOptions   ] = useState([]);
        const [ needOptions,        setNeedOptions        ] = useState([]);
        const [ attivitaOptions,    setAttivitaOptions    ] = useState([]);
        const [ statoNeedOptions,   setStatoNeedOptions   ] = useState([]);
        const initialState = {
        idOwner: '',
        idKeyPeople: '',
        note: ''
        };
        const [ popupData,          setPopupData          ] = useState(initialState);

    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const fetchAttivita = async () => {
        try {
        const responseAttivita = await axios.get(`http://89.46.67.198:8443/aziende/react/attivita/${id}`, { headers: headers });
        console.log(responseAttivita.data);

        if (Array.isArray(responseAttivita.data)) {
            const attivitaOptions = responseAttivita.data.map((attivita) => ({
            note: attivita.note,
            owner: `${attivita.owner.nome} ${attivita.owner.cognome}`,
            data: attivita.data,
            keyPeople: attivita.keyPeople ? attivita.keyPeople.nome : '' 
            }));
            setAttivitaOptions(attivitaOptions);
        }
        } catch (error) {
        console.error("Errore durante il recupero delle attività:", error);
        }
    };



    useEffect(() => {
    const fetchOptions = async () => {
        try {
        const responseOwner            = await axios.get("http://89.46.67.198:8443/aziende/react/owner"             , { headers: headers });
        const responseKeyPeople        = await axios.get(`http://89.46.67.198:8443/aziende/react/keypeople/${id}`   , { headers: headers });
        const responseNeed             = await axios.get(`http://89.46.67.198:8443/need/react/cliente/priorita/${id}`        , { headers: headers });
        const responseStatoNeed        = await axios.get(`http://89.46.67.198:8443/need/react/cliente/modificato/${id}`        , { headers: headers });
                // const responseAttivita        = await axios.get(`http://89.46.67.198:8443/aziende/react/attivita/${id}`    , { headers: headers });


        if (Array.isArray(responseStatoNeed.data)) {
            const statoNeedOptions = responseStatoNeed.data.map((statoNeed) => ({

            label:         statoNeed.descrizione,
            statoNeed:     statoNeed.stato && statoNeed.stato.descrizione,
            data:          statoNeed.data,
            ownerNome:     statoNeed.owner && statoNeed.owner.nome,
            ownerCognome:  statoNeed.owner && statoNeed.owner.cognome,

            }));
            setStatoNeedOptions(statoNeedOptions);
        }

        if (Array.isArray(responseNeed.data)) {
            const needOptions = responseNeed.data.map((need) => ({

            descrizione: need.descrizione,
            priorita:    need.priorita

            }));
            setNeedOptions(needOptions);
        }

        if (Array.isArray(responseKeyPeople.data)) {
            const keyPeopleOptions = responseKeyPeople.data.map((keyPeople) => ({

            nome:       keyPeople.nome,
            ruolo:      keyPeople.ruolo,
            email:      keyPeople.email,
            cellulare:  keyPeople.cellulare,
            value:      keyPeople.id,
            label:      keyPeople.nome

            }));
            setKeyPeopleOptions(keyPeopleOptions);
        }

        if (Array.isArray(responseOwner.data)) {
            const ownerOptions = responseOwner.data.map((owner) => ({
            label: owner.descrizione,
            value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
        }
        
        } catch (error) {
        console.error("Errore durante il recupero delle province:", error);
        }
    };
    fetchOptions();
    fetchAttivita();
    
    }, []);



    const countVintoStatus = (statoNeedOptions) => {
        return statoNeedOptions.filter(option => option.statoNeed === 'Vinto').length;
    };
    
    const totalVinto = countVintoStatus(statoNeedOptions);

    const totalStatus = statoNeedOptions.length;

    const getUltimaAttivita = (attivitaOptions) => {
    let ultimaData = "";

    attivitaOptions.forEach(attivita => {
        if (attivita.data && dayjs(attivita.data).isValid()) {
        if (ultimaData === "" || dayjs(attivita.data).isAfter(dayjs(ultimaData))) {
            ultimaData = attivita.data;
        }
        }
    });

    return ultimaData; 
    };

        //apertura e chiusura dei popup
        const handleFeedIconClick = () => {
            setFeedPopupOpen(true);
            setEmailPopupOpen(false);
            setPhonePopupOpen(false);
        };
        
        const handleCloseFeedPopup = () => {
            setFeedPopupOpen(false);
        };
        
        const handleEmailIconClick = () => {
            setEmailPopupOpen(true);
            setFeedPopupOpen(false);
            setPhonePopupOpen(false);
        };
        
        const handleCloseEmailPopup = () => {
            setEmailPopupOpen(false);
        };
        
        const handlePhoneIconClick = () => {
            setPhonePopupOpen(true);
            setFeedPopupOpen(false);
            setEmailPopupOpen(false);
        };
        
        const handleClosePhonePopup = () => {
            setPhonePopupOpen(false);
        };


        //salvataggio dei popup
            const handleSaveFeedPopup = async (popupData) => {
                const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
                const params = new URLSearchParams({
                idTipoAttivita: 1, 
                idAzienda,
                idOwner,
                idKeyPeople: idKeyPeople !== undefined && idKeyPeople !== null ? idKeyPeople : '', // Converte null in stringa vuota
                }).toString();
            
                try {
                const responseFeed = await axios.post(`http://89.46.67.198:8443/aziende/react/attivita/salva?${params}`, attivitaMap, { headers });
                setPopupData(initialState);
                setTimeout(fetchAttivita, 500); 
                } catch (error) {
                console.error("Errore durante il salvataggio dell'email:", error);
                }
            };
            
            
            
            const handleSaveEmailPopup = async (popupData) => {
                const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
                const params = {
                idTipoAttivita: 2, 
                idAzienda,
                idOwner,
                idKeyPeople: idKeyPeople || null,
                };
                
                try {
                await axios.post('http://89.46.67.198:8443/aziende/react/attivita/salva', attivitaMap, { params });
                setTimeout(fetchAttivita, 500); 
                } catch (error) {
                console.error("Errore durante il salvataggio dell'email:", error);
                }
                };
            
            const handleSavePhonePopup = async (popupData) => {
                const { idOwner, idKeyPeople, ...attivitaMap } = popupData;
                const params = {
                idTipoAttivita: 3, 
                idAzienda,
                idOwner,
                idKeyPeople: idKeyPeople || null,
                };
                
            try{
                await axios.post('http://89.46.67.198:8443/aziende/react/attivita/salva', attivitaMap, { params });
                setTimeout(fetchAttivita, 500); 
                } catch (error) {
                console.error("Errore durante il salvataggio dell'email:", error);
                }
            };


            //dati di "Informazioni Azienda"
                const fieldsInformazioniAzienda = [
                    { label: "Nome",          name: "denominazione"         },
                    { label: "Settore",       name: "settoreMercato"        },
                    { label: "Email",         name: "email"                 },
                    { label: "Pec",           name: "pec"                   },
                    { label: "Owner",         name: "owner"                 },
                    { label: "Tipologia",     name: "tipologia"             },
                    { label: "PI",            name: "pi"                    },
                    { label: "Paese",         name: "paese"                 },
                    { label: "Citta",         name: "citta"                 },
                ];
                
                const initialValuesInformazioniAzienda = {
                    denominazione:            aziendaData.denominazione                                       || "",
                    settoreMercato:           aziendaData.settoreMercato                                      || "",
                    email:                    aziendaData.email                                               || "",
                    pec:                      aziendaData.pec                                                 || "",
                    owner:                    aziendaData.owner && aziendaData.owner.descrizione              || "",
                    tipologia:                aziendaData.tipologia                                           || "",
                    pi:                       aziendaData.pi                                                  || "",
                    paese:                    aziendaData.paese                                               || "",
                    citta:                    aziendaData.citta                                               || "",
                };

                const tableAttivita = [
                    { label: "Owner", name: "owner"},
                    { label: "Data", name: "data"},
                    { label: "Note", name: "note"},
                    { label: "Contatto", name: "keyPeople"}
                ];

                const initialValuesAttivita = attivitaOptions.map(attivita => ({
                    owner: attivita.owner || "",
                    data: attivita.data || "",
                    note: attivita.note || "",
                    keyPeople: attivita.keyPeople || ""
                }));


                    //dati di "Need"
                        const tableNeed = [
                            { label: "Priorità",        name: "priorita" },
                            { label: "Nome",            name: "nome"     }
                        ];
                        
                        const initialValuesNeed = needOptions.map(need => ({
                            priorita:                   need.priorita     || "",
                            nome:                       need.descrizione  || ""
                        }));

                        //dati di "Comunicazioni"
                            const fieldsComunicazioni = [
                                { label: "Need Aperti",     name: "needAperti"     },
                                { label: "Need Vinti",      name: "needVinti"      },
                                { label: "Ultime Attività", name: "ultimeAttivita" },
                            ];
                            
                            const ultimaData = getUltimaAttivita(attivitaOptions);
                            
                            const initialValuesComunicazioni = {
                                needAperti:                 totalStatus                       || "",
                                needVinti:                  totalVinto                        || "",
                                ultimeAttivita:             ultimaData                        || "", 
                            };

                            //dati di "Contatti"
                                const tableContatti = [
                                    { label: "Nome",                      name: "nome"      },
                                    { label: "Ruolo",                     name: "ruolo"     },
                                    { label: "Email",                     name: "email"     },
                                    { label: "Cellulare",                 name: "cellulare" },
                                    ];
                                    
                                    
                                    const initialValuesContatti = keyPeopleOptions.map(keyPeople => ({
                                        nome:                            keyPeople.nome       || "",
                                        ruolo:                           keyPeople.ruolo      || "",
                                        email:                           keyPeople.email      || "",
                                        cellulare:                       keyPeople.cellulare  || ""
                                    }));

                                    //dati dentro i popup
                                    const popupFields = [
                                        { label: 'Owner',                 name: 'idOwner',                type: "select",                 options: ownerOptions    },
                                        { label: 'Contatto',              name: 'idKeyPeople',            type: "select",                 options: keyPeopleOptions },
                                        { label: 'Commento',              name: 'note',                   type: "note"                                             },
                                        ];


    return (
        <div className="containerDettaglioAziende" >
        <div className="bar" style={{ height: '100vh', overflowY: 'hidden'}}>
        <Sidebar />
        </div>

        <div className="contentDettaglioAziende" >
            <div className="Title" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', height: '50px', marginLeft: '35px', marginTop: '35px', marginBottom: '20px'}}>
                <h1>{`Visualizzazione ${nomeAzienda}`}</h1>
        </div>
        { /* bottoni del menu dei popup */ }
        <div className="buttonRow" style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '30px',  }}>
        <Button
            variant="contained"
            startIcon={<FeedIcon />}
            onClick={handleFeedIconClick}
            sx={{
            backgroundColor: "black",
            color: "white",
            margin: "10px",
            borderRadius: "40px",
            justifyContent: "flex-end",
            "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
            },
            }}
        ></Button>
        <ReusablePopup
            fields={popupFields}
            open={isFeedPopupOpen}
            onClose={handleCloseFeedPopup}
            onSave={handleSaveFeedPopup}
            title="Inserimento nota Attività"
            popupData={popupData}
        />
            

        <Button
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={handleEmailIconClick}
            sx={{
            backgroundColor: "black",
            color: "white",
            margin: "10px",
                borderRadius: "40px",
                justifyContent: "flex-end",
            "&:hover": {
            backgroundColor: "black",
            transform: "scale(1.05)",
            },
        }}
        ></Button>
        <ReusablePopup
            fields={popupFields}
            open={isEmailPopupOpen}
            onClose={handleCloseEmailPopup}
            onSave={handleSaveEmailPopup}
            title="Registrazione Email inviata"
        />


        <Button
                variant="contained"
                startIcon={<LocalPhoneIcon />}
                onClick={handlePhoneIconClick}
                sx={{
                backgroundColor: "black",
                color: "white",
                margin: "10px",
                borderRadius: "40px",
                justifyContent: "flex-end",
                "&:hover": {
                backgroundColor: "black",
                transform: "scale(1.05)",
                },
            }}
            ></Button>
            <ReusablePopup
                fields={popupFields}
                open={isPhonePopupOpen}
                onClose={handleClosePhonePopup}
                onSave={handleSavePhonePopup}
                title="Registrazione Chiamata effettuata"
            />
        </div>

        { /* chiusura menu dei bottoni */}

            { /* grid delle card */ }
            <Grid container spacing={2} sx={{ padding: "20px"}}>
                <Grid item xs={12} md={6}>
                <InformazioniAziendaCard
                    fields={fieldsInformazioniAzienda}
                    initialValues={initialValuesInformazioniAzienda}
                    tableTitle="Informazioni Azienda"
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <AttivitaCard
                    columns={tableAttivita}
                    initialValues={initialValuesAttivita}
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <NeedCard
                    columns={tableNeed}
                    initialValues={initialValuesNeed}
                    tableTitle="Need"
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <ComunicazioniCard
                    fields={fieldsComunicazioni}
                    initialValues={initialValuesComunicazioni}
                    tableTitle="Comunicazioni"
                />
                </Grid>

                <Grid item xs={12} md={6}>
                <ContattiCard
                    fields={tableContatti}
                    initialValues={initialValuesContatti}
                    tableTitle="Contatti"
                />
                </Grid> 
            </Grid>
            { /* chiusura grid delle card */}

                <Button
                color="primary"
                onClick={handleGoBack}
                sx={{
                backgroundColor: "black",
                borderRadius: "40px",
                color: "white",
                width: "250px",
                height: "30px",
                margin: "auto",
                marginTop: "auto",
                marginBottom: "20px",
                "&:hover": {
                    backgroundColor: "black",
                    transform: "scale(1.05)",
                },
                }}
            >
                Indietro
            </Button>
        </div>
        </div>




    )
    };

export default DettaglioAziende2;