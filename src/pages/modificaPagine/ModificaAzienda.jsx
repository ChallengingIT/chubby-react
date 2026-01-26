import React, { useState, useEffect }                  from 'react';
import { useNavigate, useLocation }                    from 'react-router-dom';
import CircleOutlinedIcon                              from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import CustomAutocomplete                              from '../../components/fields/CustomAutocomplete';
import CustomTextFieldModifica                         from '../../components/fields/CustomTextFieldModifica';
import CustomImgFieldModifica                          from '../../components/fields/CustomImgFieldModifica';
import CustomNoteModifica                              from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                        from '../../components/fields/CustomDatePickerModifica';
import CustomMultipleSelectModificaAziende             from '../../components/fields/CustomMultipleSelectModificaAziende';
import { useTranslation }                              from 'react-i18next';
import ApiService                                      from "../../services/ApiService";
import AggiungiModificaSchemaPage                      from "../../components/AggiungiModificaSchemaPage";


import { 
  Box, 
  Alert, 
  Snackbar, 
  Skeleton, 
  Grid, 
  Slide
} from '@mui/material';



const ModificaAzienda = () => {
    const navigate             = useNavigate();
    const location             = useLocation();
    const valori               = location.state;
    const id                   = valori.id;
    const { t }                = useTranslation();



    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState(t("Profilo"));
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ imagePreviewUrl,    setImagePreviewUrl      ] = useState(null);
    const [ fileIMG,            setFileIMG              ] = useState(null);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);

    //stati per i valori
    const [ provinceOptions,    setProvinceOptions      ] = useState([]);
    const [ ownerOptions,       setOwnerOptions         ] = useState([]);
    const [ values,             setValues               ] = useState({});
    const [ aziendeOptions,     setAziendeOptions       ] = useState([]);
    const [ datiModifica,       setDatiModifica         ] = useState([]);
    const [ tipoServizioOptions,     setTipoServizioOptions       ] = useState([]);



    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchProvinceOptions = async () => {
        try {
            const responseProvince       = await ApiService.request("getAllProvinceSelect");
            const responseOwner          = await ApiService.request("getAllOwnerSelect");
            const responseAziende        = await ApiService.request("getAziendeSelect");
            const responseModifica       = await ApiService.request("aziendaByID", {id: id});
            const tipoServizioResponse   = await ApiService.request("serviziHiringSelect");
            

            if (Array.isArray(tipoServizioResponse.data)) {
            const tipoServizioOptions = tipoServizioResponse.data.map((tipoServizio) => ({
                label: tipoServizio.descrizione,
                value: tipoServizio.id,
            }));
            setTipoServizioOptions(tipoServizioOptions);
        }



            if (Array.isArray(responseAziende.data)) {
            const aziendeOptions = responseAziende.data.map((aziende) => ({
                label: aziende.denominazione,
                value: aziende.id,
            }));
            setAziendeOptions(aziendeOptions);
        }

        
            if (Array.isArray(responseOwner.data)) {
            const ownerOptions = responseOwner.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
        }


            if (Array.isArray(responseProvince.data)) {
                const provinceOptions = responseProvince.data.map((province) => ({
                label: province.nomeProvince,
                value: province.nomeProvince,
                }));
                setProvinceOptions(provinceOptions);
            }

            const modificaData = responseModifica.data;
            setDatiModifica(modificaData);
            setLoading(false);

        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };

        fetchProvinceOptions();
    }, []);

    const menu = [
        {
            title: t("Profilo"),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t("IDA"),
            icon: <CircleOutlinedIcon />
        },
        { 
            title: t("Contratti"),
            icon: <CircleOutlinedIcon />
        },
        {
            title: t("Documenti"),
            icon: <CircleOutlinedIcon />
        }
    ];

        //stato per verificare che tutti i campi obbligatori sono stati compilati e quindi sbloccare il menu di navigazione
        const [sectionCompleted, setSectionCompleted] = useState(new Array(menu.length).fill(true));


  //funzione per la navigazione dal menu laterale
  const handleMenuItemClick = (section, index) => {
    const allPreviousCompleted = sectionCompleted
    .slice(0, index)
    .every((x) => x);
    if (allPreviousCompleted) {
    setActiveSection(section);
    setCurrentPageIndex(index);
    } else {
    setAlert({
        open: true,
        message:
        t("Per cambiare sezione, completare tutti i campi obbligatori delle sezioni precedenti."),
    });
    }
  };

    const handleGoBack = () => {
        navigate(-1);
    };

       //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0: 
            return [ "denominazione", "settoreMercato", "citta" ]
            case 1:
                return [ "status", "potenzialita", "semplicita" ];
            case 2:
                return [ "idOwner", "tipologia" ];
            default: 
                return [];
        }
    };

    const validateFields = (values, mandatoryFields, index) => {
        let errors = {};
        let allFieldsValid = true;
    
        mandatoryFields.forEach(field => {
            if (!values[field]) {
                errors[field] = t('Questo campo è obbligatorio');
                allFieldsValid = false;
            }
        });
    
        // Aggiorna lo stato di completamento della sezione
        setSectionCompleted(prev => {
            const newSectionCompleted = [...prev];
            newSectionCompleted[index] = allFieldsValid;
            return newSectionCompleted;
        });
    
        return errors;
    };
    

    const handleChangeIMG = (file) => {
        if (file) {
            setFileIMG(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };


    //funzioni per cambiare pagina del form
    const handleBackButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex > 0) {
            setActiveSection(menu[currentIndex - 1].title);
            setCurrentPageIndex(currentIndex - 1);
        }
    };


    const handleNextButtonClick = () => {
      const currentIndex = menu.findIndex(
      (item) => item.title.toLowerCase() === activeSection.toLowerCase()
      );
      const mandatoryFields = getMandatoryFields(currentIndex);
      const errors = validateFields(values, mandatoryFields);
      const hasErrors = Object.keys(errors).length > 0;
  
      if (!hasErrors) {
      let newSectionCompleted = [...sectionCompleted];
      newSectionCompleted[currentIndex] = true; // Imposta la sezione corrente come completata
      setSectionCompleted(newSectionCompleted);
  
      if (currentIndex < menu.length - 1) {
          setActiveSection(menu[currentIndex + 1].title);
          setCurrentPageIndex(currentIndex + 1);
      }
      } else {
      setAlert({
          open: true,
          message:
          t("Compilare tutti i campi obbligatori presenti per poter avanzare"),
      });
      }
  };

    const handleChange = (fieldValue) => {
        setValues(prevValues => ({
            ...prevValues,
            ...fieldValue
        }));
    };


        //funzione per la chiusura dell'alert
        const handleCloseAlert = (reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({...alert, open: false});
        };

         //funzione per la transizione dell'alert
        function TransitionDown(props) {
            return <Slide {...props} direction="down" />;
        }



    const handleChangeMultipleTipoServizio = (fieldValue) => {
        setValues((prevValues) => ({
        ...prevValues,
        ...fieldValue,
        }));
    };





    //funzione per convertire le chiavi delle select da "idX" a "X"
    const replaceKeysInValues = (values, mapping) => {
    const newValues = { ...values };

    Object.keys(mapping).forEach(key => {
        if (key in newValues) {
            const newKey = mapping[key];
            if (key === 'idTipiServizio' && Array.isArray(newValues[key])) {
                if (newValues[key].length === 0) {
                    newValues[newKey] = null; 
                } else {
                    newValues[newKey] = newValues[key].join(',');
                }
            } else {
                newValues[newKey] = newValues[key];
            }
            
            delete newValues[key];
        }
    });

    return newValues;
};



        //funzione per il salvataggio
        const handleSubmit = async (values) => {
            const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
            const mandatoryFields = getMandatoryFields(currentIndex); 
            const errors = validateFields(values, mandatoryFields);
            const hasErrors = Object.keys(errors).length > 0;
        
            if (!hasErrors) {
                try {

            const fieldMapping = {
                idTipiServizio: "tipiServizio"
            };

            const transformedValues = replaceKeysInValues(values, fieldMapping);
            const valuesToSend = {
                ...transformedValues,
            };


                    Object.keys(values).forEach(key => {
                        if (!campiObbligatori.includes(key) && !values[key]) {
                            values[key] = null;
                        }
                    });
        
                    const userString = sessionStorage.getItem("user");
                    if (!userString) {
                        console.error("Nessun utente o token trovato in sessionStorage");
                        return;
                    }
                    const user = JSON.parse(userString);
                    const token = user?.token;
        
                    if (!token) {
                        console.error("Nessun token di accesso disponibile");
                        return;
                    }
        
                    const headers = {
                        Authorization: `Bearer ${token}`
                    };
                    delete values.image;
                    delete values.logo;

                    const response = await ApiService.request("salvaAzienda", {}, valuesToSend);
                    if (response.data === "DUPLICATO") {
                        setAlert({ open: true, message: t("azienda già esistente!") });
                        console.error("L'azienda è già stata salvata.");
                        return; 
                    }
                    if (response.data === "ERRORE") {
                        setAlert({ open: true, message: t("errore durante il salvataggio dell'azienda!") });
                        console.error("L'azienda non è stata salvata.");
                        return;
                    }
                    const aziendaID = response.data;
    
                    try {
                        if (fileIMG) {
                        const formDataIMG = new FormData();
                        formDataIMG.append('logo', fileIMG);
                    
                      const responseIMG = await ApiService.request(
                        "salvaLogoAzienda", 
                        { aziendaID },       
                        formDataIMG,        
                        { "Content-Type": "multipart/form-data" } 
                    );
                    
                        } else {
                            navigate("/business");
                        }
                    } catch (error) {
                        console.error("Errore nell'invio dell'immagine: ", error);
                    }
                    navigate("/business");
                } catch (error) {
                    console.error("Errore durante il salvataggio:", error);
                }
            } else {
                setErrors(errors);
                setAlert({ open: true, message: t("Compilare tutti i campi obbligatori presenti prima di avanzare") });
            }
        };
        



 
        const campiObbligatori = [ "denominazione", "ragioneSociale", "idOwner", "citta", "tipologia", "status", "potenzialita", "semplicita" ];

        const fields =[
            { type: "titleGroups",                label: t("Profilo")            },
            { label: t('Nome Azienda*'),                   name: 'denominazione',            type:'text', maxLength: 90                              },
            { label: t('Settore Mercato*'),                name: 'settoreMercato',           type:'text', maxLength: 255                             },
            { label: t("Partita IVA"),                     name: "pi",                       type: "text", maxLength: 45                             },
            { label: t("Codice Fiscale"),                  name: "cf",                       type: "text", maxLength: 45                             },
            { label: t("Pec"),                             name: "pec",                      type: "text", maxLength: 45                             },
            { label: t("Codice Destinatario"),             name: "codiceDestinatario",       type: "text", maxLength: 45                             },
            { label: t("Sito Web"),                        name: "sito",                     type: "text", maxLength: 90                             },
            { label: t("Sede Legale"),                      name: "sedeLegale",               type: "text", maxLength: 45                            },
            { label: t("Sede Operativa"),                   name: "sedeOperativa",            type: "text", maxLength: 45                            },
            { label: t("Città*"),                           name: "citta",                    type: "text", maxLength: 45                            },
            { label: t("Paese"),                            name: "paese",                    type: "text", maxLength: 255                           },


            { type: 'titleGroups',                label: t("IDA")     },
            { label: t("Potenzialità*"),                          name: "potenzialita",                  type: "select", options: [
                { value: 1, label: t("Basso") },
                { value: 2, label: t("Medio") },
                { value: 3, label: t("Alto") },
            ]  },
            { label: t("Semplicità*"),                            name: "semplicita",                    type: "select", options: [
                { value: 1, label: t("Basso") },
                { value: 2, label: t("Medio") },
                { value: 3, label: t("Alto") },
            ]  },
            { label: t("Complicità*"),                                 name: "status",                        type: "select", options: [
                { value: 1, label: t("Basso") },
                { value: 2, label: t("Medio") },
                { value: 3, label: t("Alto") },
            ]  },


            { type: "titleGroups",                label: t("Contratti")            },
            { label: t("Owner*"),                                name: "idOwner",                       type: "select", options: ownerOptions    },
            { label: t("Tipologia*"),                            name: "tipologia",                     type: "select", options: [
                { value: "Cliente", label: t("Cliente") },
                { value: "Prospect", label: t("Prospect") },
                { value: "EXCLIENTE", label: t("Ex Cliente") }
            ]  },
            { label: t('Scadenza Contratto'),              name: 'dataScadenzaContratto',    type: 'date'                                            },
            { label: t('Tipo di servizio'),                name: 'idTipiServizio',             type: 'multipleSelect', options: tipoServizioOptions         },
            { label: t('Note'),                            name: 'note',                     type: 'note', maxLength: 2000                           },


            { type: "titleGroups",   label: t("Documenti")                            },
            { label: t('Logo'),         name: 'logo',  type: 'aggiungiImmagine'  },
        ];



        useEffect(() => {
          if (Object.keys(datiModifica).length !== 0) {
              const updatedFormValues = {
                  ...values,
                  ...{
                      id:                           datiModifica.id,
                      denominazione:                datiModifica.denominazione                    || null,
                      pi:                           datiModifica.pi                               || null,
                      dataScadenzaContratto:        datiModifica.dataScadenzaContratto            || null,
                      cf:                           datiModifica.cf                               || null,
                      citta:                        datiModifica.citta                            || null,
                      cap:                          datiModifica.cap                              || null,
                      paese:                        datiModifica.paese                            || null,
                      provincia:                    datiModifica.provincia                        || null,
                      pec:                          datiModifica.pec                              || null,
                      sedeOperativa:                datiModifica.sedeOperativa                    || null,
                      sedeLegale:                   datiModifica.sedeLegale                       || null,
                      codicePa:                     datiModifica.codicePa                         || null,
                      codiceDestinatario:           datiModifica.codiceDestinatario               || null,
                      sito:                         datiModifica.sito                             || null,
                      settoreMercato:               datiModifica.settoreMercato                   || null,
                      tipologia:                    datiModifica.tipologia                        || null,
                      status:                       datiModifica.status                           || null,
                      semplicita:                   datiModifica.semplicita                       || null,
                      potenzialita:                 datiModifica.potenzialita                     || null,
                      idOwner:                      datiModifica?.owner?.id                       || null,
                      idTipiServizio:               datiModifica?.tipiServizio?.map(ts => ts?.id) || [],
                      note:                         datiModifica.note                             || null,
                      logo:                         datiModifica.logo                             || null
                  }
              };
              setValues(updatedFormValues);
          }
      }, [datiModifica]);
      

        //funzione per suddividere fields nelle varie pagine in base a titleGroups
        const groupFields = (fields) => {
            const groupedFields = [];
            let currentGroup = [];
            fields.forEach((field) => {
                if (field.type === 'titleGroups') {
                    if (currentGroup.length > 0) {
                        groupedFields.push([...currentGroup]);
                    }
                    currentGroup = [field];
                } else {
                    currentGroup.push(field);
                }
            });
            if (currentGroup.length > 0) {
                groupedFields.push([...currentGroup]); 
            }
            return groupedFields;
        };

        const groupedFields = groupFields(fields); //questo è l'array suddiviso



        const renderFieldSkeleton = (type) => {
            switch (type) {
                case 'text':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'date':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'decimalNumber':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'select':
                case 'multipleSelectSkill':
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

                case 'note':
                    return <Skeleton variant="text" width={710} height={120} />;
                default:
                    return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />

            }
        };

        //funzione per richiamare i vari campi
        const renderFields = (field) => {
            if (loading) {
                return renderFieldSkeleton(field.type);
            } else {
            const { type, ...otherProps } = field;
            // const errorMessage = errors[field.name];




            switch (type) {
                case 'text':
                    return (
                        <CustomTextFieldModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        maxLength={field.maxLength}
                        />
                    );

                    case 'select': {
                      const selectedValue = values?.[field.name] ?? null;
                      const initialValue = Array.isArray(field.options)
                          ? field.options.find(option => option.value === selectedValue)
                          : null;
                  
                      return (
                          <CustomAutocomplete
                              name={field.name}
                              label={field.label}
                              options={field.options || []}
                              value={selectedValue}
                              onChange={handleChange}
                              initialValue={initialValue}
                          />
                      );
                  }
                  
                
                case 'date':
                    return (
                        <CustomDatePickerModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        />
                    );

                    case 'multipleSelect':
                        return ( 
                        <CustomMultipleSelectModificaAziende
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChangeMultipleTipoServizio}
                            getOptionSelected={(option, value) => option.value === value.value}
                            tipiServizioOptions={tipoServizioOptions}
                        />
                        );




                case 'note':
                    return (
                        <CustomNoteModifica
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        values={values}
                        onChange={handleChange}
                        maxLength={field.maxLength}

                        />
                    );

                case 'aggiungiImmagine': 
                return (
                    <CustomImgFieldModifica
                    label={field.label}
                    imagePreviewUrl={imagePreviewUrl}
                    onChange={handleChangeIMG}
                    logo={values.logo}
                    />
                );
                    default:
                        return null;
            }
        }
        };


        return (
          <AggiungiModificaSchemaPage
              menuItems={menu}
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
              sectionCompleted={sectionCompleted}
              onMenuItemClick={handleMenuItemClick}
              onGoBack={handleGoBack}
              title={`${t("Aggiungi")} ${t("Azienda")}`}
              handleSubmit={handleSubmit}   
              handleNextButtonClick={handleNextButtonClick}
              handleBackButtonClick={handleBackButtonClick} 
              values={values}
          >
              {/* Contenuto della sezione corrente */}
              <Box sx={{ ml: 15, mr: 15 }}>
                  <Grid container spacing={2}>
                      {groupedFields[currentPageIndex].map((field, index) => {
                          if (field.type === "titleGroups") {
                              return <Grid item xs={12} key={index}></Grid>;
                          } else if (field.type === "note") {
                              return (
                                  <Grid item xs={12} key={index}>
                                      {renderFields(field)}
                                  </Grid>
                              );
                          } else {
                              return (
                                  <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                                      {renderFields(field)}
                                  </Grid>
                              );
                          }
                      })}
                  </Grid>
              </Box>
        
              <Snackbar
                open={alert.open}
                autoHideDuration={4000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        
              
          </AggiungiModificaSchemaPage>
        );
}

export default ModificaAzienda;