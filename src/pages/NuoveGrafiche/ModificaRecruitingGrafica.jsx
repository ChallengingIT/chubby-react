import React, { useState, useEffect }                                                                               from 'react';
import { useNavigate, useParams }                                                                                   from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Alert, Skeleton, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import CircleOutlinedIcon                                                                                           from '@mui/icons-material/CircleOutlined'; //cerchio vuoto
import axios                                                                                                        from 'axios';
import CustomTextFieldModifica                                                                                      from '../../components/fields/CustomTextFieldModifica';
import CustomNoteModifica                                                                                           from '../../components/fields/CustomNoteModifica';
import CustomDatePickerModifica                                                                                     from '../../components/fields/CustomDatePickerModifica';
import CustomDecimalNumberModifica                                                                                  from '../../components/fields/CustomDecimalNumberModifica';
import CloudUploadIcon                                                                                              from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon                                                                                            from "@mui/icons-material/CloudDownload";
import DeleteIcon                                                                                                   from "@mui/icons-material/Delete";
import CustomMultipleSelectModifica                                                                                 from '../../components/fields/CustomMultipleSelectModifica';
import CustomAutocomplete                                                                                           from '../../components/fields/CustomAutocomplete';

const ModificaRecruitingGrafica = () => {
    const navigate = useNavigate();
    const {id}                    = useParams();


    //stati della pagina
    const [ activeSection,      setActiveSection        ] = useState('Profilo Candidato');
    const [ currentPageIndex,   setCurrentPageIndex     ] = useState(0);
    const [ alert,              setAlert                ] = useState({ open: false, message: ''});
    const [ errors,             setErrors               ] = useState({});
    const [ loading,            setLoading              ] = useState(true);  
    const [ openDialog,           setOpenDialog         ] = useState(false);
    const [ selectedFileId,       setSelectedFileId     ] = useState(null);  

    //stati per i valori
    const [ datiModifica,       setDatiModifica         ] = useState([]);
    const [ idCandidato,        setIdCandidato          ] = useState([]);
    const [ fileCV,             setFileCV               ] = useState(null);
    const [ fileCF,             setFileCF               ] = useState(null);
    const [ statoOptions,       setStatoOptions         ] = useState([]);
    const [ jobTitleOptions,    setJobTitleOptions      ] = useState([]);
    const [ tipologiaOptions,   setTipologiaOptions     ] = useState([]);
    const [ skillsOptions,      setSkillsOptions        ] = useState([]);
    const [ ownerOptions,       setOwnerOptions         ] = useState([]);
    const [ facoltaOptions,     setFacoltaOptions       ] = useState([]);
    const [ values,             setValues               ] = useState([]);
    const [ jobTitleEnable,     setJobTitleEnable       ] = useState(false);    
    const [ livelloScolasticoOptions, setLivelloScolasticoOptions ] = useState([]);
    const [ funzioniAziendaliOptions, setFunzioniAziendaliOptions ] = useState([]);







    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    //chiamata per ricevere i dati dal db
    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const responseStaffing            = await axios.get(`http://89.46.196.60:8443/staffing/react/${id}`,           { headers: headers });
            const responseStato               = await axios.get("http://89.46.196.60:8443/staffing/react/stato/candidato", { headers: headers });
            const responseJobTitle            = await axios.get("http://89.46.196.60:8443/aziende/react/tipologia"       , { headers: headers });
            const responseTipologia           = await axios.get("http://89.46.196.60:8443/staffing/react/tipo"           , { headers: headers });
            const responseNeedSkills          = await axios.get("http://89.46.196.60:8443/staffing/react/skill"          , { headers: headers });
            const ownerResponse               = await axios.get("http://89.46.196.60:8443/aziende/react/owner"           , { headers: headers });
            const facoltaResponse             = await axios.get("http://89.46.196.60:8443/staffing/react/facolta"        , { headers: headers });
            const livelloScolasticoResponse   = await axios.get("http://89.46.196.60:8443/staffing/react/livello"        , { headers: headers });
            const funzioniAziendaliResponse   = await axios.get("http://89.46.196.60:8443/staffing/react/funzioni"         , { headers: headers });



            

    
            if (Array.isArray(livelloScolasticoResponse.data)) {
            const livelloScolasticoOptions = livelloScolasticoResponse.data.map((livelloScolastico) => ({
                label: livelloScolastico.descrizione,
                value: livelloScolastico.id,
            }));
            setLivelloScolasticoOptions(livelloScolasticoOptions);
        }
    
    
            if (Array.isArray(facoltaResponse.data)) {
            const facoltaOptions = facoltaResponse.data.map((facolta) => ({
                label: facolta.descrizione,
                value: facolta.id,
            }));
            setFacoltaOptions(facoltaOptions);
        }
    
            if (Array.isArray(ownerResponse.data)) {
        const ownerOptions = ownerResponse.data.map((owner) => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
        }
            
            if (Array.isArray(responseNeedSkills.data)) {
            const skillsOptions = responseNeedSkills.data.map((skills) => ({
                label: skills.descrizione,
                value: skills.id,
            }));
            setSkillsOptions(skillsOptions);
        }
    
            if (Array.isArray(responseTipologia.data)) {
                const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
                }));
                setTipologiaOptions(tipologiaOptions);
            }
    
    
                if (Array.isArray(responseJobTitle.data)) {
                const jobTitleOptions = responseJobTitle.data.map((jobTitle) => ({
                    label: jobTitle.descrizione,
                    value: jobTitle.id,
                }));
                setJobTitleOptions(jobTitleOptions);
            }
    
                    if (Array.isArray(responseStato.data)) {
                    const statoOptions = responseStato.data.map((stato) => ({
                        label: stato.descrizione,
                        value: stato.id,
                    }));
                    setStatoOptions(statoOptions);
                }

                if (Array.isArray(funzioniAziendaliResponse.data)) {
                    const funzioneAziendaleOptions = funzioniAziendaliResponse.data.map((funzioni) => ({
                        label: funzioni.descrizione,
                        value: funzioni.id,
                    }));
                    setFunzioniAziendaliOptions(funzioneAziendaleOptions);
                }
            

                const modificaData = responseStaffing.data;
                setDatiModifica(modificaData);
                setLoading(false);

            
            } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };
    
        fetchAziendeOptions();
    }, []);


    


    //useEffect che controlla il cambiamento di stato di funzioneAziendale, abilita la select di jobTitle e attiva la chiamata per popolarlo correttamente
    useEffect(() => {
        if (values.idFunzioneAziendale && values.idFunzioneAziendale.length !== 0) {
            const funzioneAziendaleId = values.idFunzioneAziendale; 

    
            setJobTitleEnable(true);
            fetchJobTitleOptions(funzioneAziendaleId);
        } else {
            setJobTitleEnable(false);
            setJobTitleOptions([]);
        }
    }, [values.idFunzioneAziendale]); 




    const fetchJobTitleOptions = async (funzioneAziendaleId) => {
        try {
            const response = await axios.get(`http://89.46.196.60:8443/aziende/react/tipologia/${funzioneAziendaleId}`, { headers: headers });
            const jobTitleOptions = response.data.map(jobTitle => ({
                label: jobTitle.descrizione,
                value: jobTitle.id,
            }));
            setJobTitleOptions(jobTitleOptions);
        } catch (error) {
            console.error("Errore nel caricamento dei jobTitle:", error);
        }
    };




    const menu = [
        {
            title: 'Profilo Candidato',
            icon: <CircleOutlinedIcon />
        },
        { 
            title: 'Esperienza',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Posizione Lavorativa',
            icon: <CircleOutlinedIcon />
        },
        {
            title: 'Allegati',
            icon: <CircleOutlinedIcon />
        }
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    //funzione per campire quali campi sono obbligatori nel form corrente
    const getMandatoryFields = (index) => {
        switch (index) {
            case 0:
                return ["nome", "cognome", "email"]; 
            case 1:
                return [ "anniEsperienzaRuolo", "idLivelloScolastico"]; 
            case 2: 
                return ["idTipo", "idTipologia", "dataUltimoContatto", "idStato", "idFunzioneAziendale"];
            default:
                return [];
        }
    };


    //funzione per la validazione dei campi
    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach(field => {
            if (!values[field]) {
                errors[field] = 'Questo campo è obbligatorio';
            }
        });
        return errors;
    };

    //funzioni per il cambio di CV e CF
    const handleChangeCV = (name) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileCV(file);
            setValues({ ...values, cv: { descrizione: file.name } });
        }
    };
    
    const handleChangeCF = (name) => (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileCF(file);
            setValues({ ...values, cf: { descrizione: file.name } });
        }
    };


     // Funzione per il cambio stato degli input
    const handleChange = (fieldValue) => {
        setValues(prevValues => ({
            ...prevValues,
            ...fieldValue
        }));
        };


        //funzione per il cambio stato delle skill
        const handleChangeSkill = (fieldValue) => {
            const fieldName = Object.keys(fieldValue)[0];
            const newSelections = fieldValue[fieldName]; 
        
            setValues(prevValues => {
                const currentSelections = prevValues[fieldName] || []; 
        
                const selectionsToAdd = newSelections.filter(selection => !currentSelections.includes(selection));
        
                const selectionsToRemove = currentSelections.filter(selection => !newSelections.includes(selection));
        
                const updatedSelections = currentSelections
                    .filter(selection => !selectionsToRemove.includes(selection))
                    .concat(selectionsToAdd);
        
                return {
                    ...prevValues,
                    [fieldName]: updatedSelections
                };
            });
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
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex < menu.length - 1) {
            const mandatoryFields = getMandatoryFields(currentIndex);
            const errors = validateFields(values, mandatoryFields);
            const hasErrors = Object.keys(errors).length > 0;

            if (!hasErrors) {
                setActiveSection(menu[currentIndex + 1].title);
                setCurrentPageIndex(currentIndex + 1);
            } else {
                setAlert({ open: true, message: 'Compilare tutti i campi obbligatori presenti per poter avanzare'});
            }
        }
    };



        //funzione per la chiusura dell'alert
        const handleCloseAlert = (reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setAlert({...alert, open: false});
        };


            
    //apertura popup eliminazione cv e cf
    const handleOpenDeleteDialogCVCF = (fileId, fileType) => {
        setSelectedFileId({ id: fileId, type: fileType });
        setOpenDialog(true);
    };



        //funzione per scaricare il CV o il CF
        const handleDownloadCVCF = async (fileId, fileDescrizione) => {
            const url = `http://89.46.196.60:8443/files/react/download/file/${fileId}`;
            try {
                const response = await axios({
                    method: 'GET',
                    url: url,
                    responseType: 'blob', 
                    headers: headers
                });
        
                const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', `${fileDescrizione}.pdf`); 
                document.body.appendChild(link);
            
                link.click();
                document.body.removeChild(link);
                } catch (error) {
                console.error('Si è verificato un errore durante il download del file:', error);
                }
            };


        //funzione per il salvataggio

    const handleSubmit = async (values) => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        const mandatoryFields = getMandatoryFields(currentIndex); 
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;
    
        if (!hasErrors) {
            try {
                Object.keys(values).forEach(key => {
                    if (!campiObbligatori.includes(key) && !values[key]) {
                        values[key] = null;
                    }
                });

                const skills = values.idSkills ? values.idSkills.join(',') : '';


                delete values.idSkills;
                delete values.cv;
                delete values.cf;

                const datiResponse = await axios.post("http://89.46.196.60:8443/staffing/salva", values, {
                params: { skill: skills },
                headers: headers,
                });
                if (datiResponse.data === "DUPLICATO") {
                    setAlert({ open: true, message: "email già esistente!" });
                    console.error("il candidato è già stato salvato.");
                    return; 
                }
                const candidatoId = datiResponse.data;
                setIdCandidato(candidatoId);

                try{
                    if (fileCV) {
                        const formDataCV = new FormData();
                        formDataCV.append('file', fileCV);
                        formDataCV.append('tipo', 1);
                
                        const responseCV = await axios.post(`http://89.46.196.60:8443/staffing/react/staff/salva/file/${candidatoId}`, formDataCV,
                        {headers: headers});
                    } 
                } catch(error) {
                        console.error("Errore nell'invio del CV", error);
                    }
                
                    try{
                        if (fileCF) {
                        const formDataCF = new FormData();
                        formDataCF.append('file', fileCF);
                        formDataCF.append('tipo', 2);
                        const responseCF = await axios.post(`http://89.46.196.60:8443/staffing/react/staff/salva/file/${candidatoId}`, formDataCF, {headers: headers});
                    }
                } catch(error) {
                    console.error("errore nell'invio del CF", error);
                }
                navigate("/recruiting");
            } catch (error) {
                console.error("Errore durante il salvataggio:", error);
            }
        } else {
            setErrors(errors);
            setAlert({ open: true, message: "Compilare tutti i campi obbligatori presenti prima di avanzare" });
        }
    };




    const handleDeleteCVCF = async (fileId, fileType) => {

        try {
        const response = await axios.delete(`http://89.46.196.60:8443/files/react/elimina/file/candidato/${fileId}/${id}`, { headers: headers })
        if(response.data === "OK") {
        } else {
            console.error("Errore dal server: ", response.data);
        }
        if (fileType === 'cv') {
            setValues({ ...values, cv: null });
        } else if (fileType === 'cf') {
            setValues({ ...values, cf: null });
        }
        setOpenDialog(false); 
        setSelectedFileId(null);  
        } catch (error) {
        console.error("Si è verificato un errore durante l'eliminazione del file:", error);
        }
    };
    

        



        const campiObbligatori = [ "nome", "cognome", "email", "anniEsperienzaRuolo", "idTipologia", "dataUltimoContatto", "idTipo", "idStato", "idLivelloScolastico", "idFunzioneAziendale" ];

        const fields =[
            { type: "titleGroups",                label: "Profilo Candidato"            },
            { label: "Nome*",                         name: "nome",                     type: "text"                                                            },
            { label: "Cognome*",                      name: "cognome",                  type: "text"                                                            },
            { label: "Data di Nascita",               name: "dataNascita",              type: "date"                                                            },
            { label: "Email*",                        name: "email",                    type: "text"                                                            },
            { label: "Cellulare",                     name: "cellulare",                type: "text"                                                            },
            { label: "Residenza",                     name: "citta",                    type: "text"                                                            },

    
    
            { type: "titleGroups",                label: "Esperienza"            },
            { label: "Anni di Esperienza",              name: "anniEsperienza",           type: "decimalNumber"                                                            },
            { label: "Anni di Esperienza nel Ruolo*",   name: "anniEsperienzaRuolo",      type: "decimalNumber"                                                            },
            { label: "Livello Scolastico*",             name: "idLivelloScolastico",        type: "select",               options: livelloScolasticoOptions         },
            { label: "Facoltà",                         name: "idFacolta",                  type: "select",               options: facoltaOptions                   },
    
            { type: "titleGroups",                label: "Posizione Lavorativa"            },
            { label: "Tipologia*",                     name: "idTipo",                     type: "select",          options: tipologiaOptions                      },
            { label: "Tipo Ricerca",                   name: "ricerca",                  type: "select",          options: [
                { value: "C", label: "C"},
                { value: "R", label: "R" },
                { value: "C-R", label: "C-R" },
            ]},
            { label: "Modalità di lavoro",             name: "modalita",                 type: "select",          options: [ 
                { value: 1, label: "Full Remote" },
                { value: 2, label: "Ibrido" },
                { value: 3, label: "On Site"},
            ] },
        { label: "Funzione Aziendale*",                name: "idFunzioneAziendale",        type: "select",               options: funzioniAziendaliOptions         },
        { label: "Job Title*",                         name: "idTipologia",                type: "select",               options: jobTitleOptions                  },
        { label: "Data Inserimento*",                  name: "dataUltimoContatto",         type: "date"                                                            },
        { label: "Stato*",                             name: "idStato",                    type: "select",               options: statoOptions                     },
        { label: "Owner",                              name: "idOwner",                    type: "select",               options: ownerOptions                     },
        { label: "Skills",                             name: "idSkills",                   type: "multipleSelect",  options: skillsOptions                    },
        { label: "RAL/Tariffa",                        name: "ral",                        type: "text"                                                            },
        { label: "Disponibilità",                      name: "disponibilita",              type: "text"                                                            },
        { label: "Note",                               name: "note",                       type: "note"                                                            },
    
    
            { type: "titleGroups",                label: "Allegati"            },
            { label: "Curriculim Vitae",                name: "cv",                       type: "modificaFileCV"                                                  },
            { label: "Consultant File",                 name: "cf",                       type: "modificaFileCF"                                                  }, 
        ];



        const initialValues = {

            id:                                 datiModifica.id                                                                   ,
            idTipo:                            (datiModifica.tipo && datiModifica.tipo.id)                                       || null,
            ricerca:                            datiModifica.ricerca                                                              || null,
            nome:                               datiModifica.nome                                                                 || null,
            cognome:                            datiModifica.cognome                                                              || null,
            dataNascita:                        datiModifica.dataNascita                                                          || null,
            email:                              datiModifica.email                                                                || null,
            cellulare:                          datiModifica.cellulare                                                            || null,
            anniEsperienza:                     datiModifica.anniEsperienza                                                       || null,
            citta:                              datiModifica.citta                                                                || null,
            modalita:                           datiModifica.modalita                                                             || null,
            anniEsperienzaRuolo:                datiModifica.anniEsperienzaRuolo                                                  || null,
            idLivelloScolastico:               (datiModifica.livelloScolastico && datiModifica.livelloScolastico.id)             || null,
            idFacolta:                         (datiModifica.facolta && datiModifica.facolta.id)                                 || null,
            idFunzioneAziendale:               (datiModifica.tipologia?.funzione && datiModifica.tipologia.funzione?.id)             || null,
            idTipologia:                       (datiModifica.tipologia && datiModifica.tipologia.id)                             || null,
            dataUltimoContatto:                 datiModifica.dataUltimoContatto                                                   || null,
            idStato:                           (datiModifica.stato && datiModifica.stato.id)                                     || null,
            idOwner:                           (datiModifica.owner && datiModifica.owner.id) || null,
            idSkills:                           datiModifica.skills ? datiModifica.skills.map((skills) => skills.id) :               [],
            ral:                                datiModifica.ral                                                                  || null,
            disponibilita:                      datiModifica.disponibilita                                                        || null,
            cv:                                 datiModifica.files ? datiModifica.files.find(file => file && file.tipologia && file.tipologia.descrizione === 'CV') || null : null,
            cf:                                 datiModifica.files ? datiModifica.files.find(file => file && file.tipologia && file.tipologia.descrizione === 'CF') || null : null,
            note:                               datiModifica.note                                                                 || null,
        };


         //funzione per caricare i dati nei campi solo dopo aver terminato la chiamata
        useEffect(() => {
            if (Object.keys(datiModifica).length !== 0) {
                const updatedvalues = { ...initialValues };
        
                Object.keys(datiModifica).forEach(key => {
                    if (initialValues.hasOwnProperty(key)) {
                        updatedvalues[key] = datiModifica[key];
                    }
                });
        
                setValues(updatedvalues);
            }
        }, [datiModifica]); 


        useEffect(() => {
            if (Object.keys(values).length > 0) {
                setLoading(false);
            }
        }, [values]); 

    

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
                        initialValues={initialValues}
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
                        initialValues={initialValues}
                        />
                    );

                    case 'select': 
                    if ( field.name === 'tipologia' ) {
                    return (
                        <CustomAutocomplete
                        name={field.name}
                        label={field.label}
                        options={field.options || []}
                        value={values[field.name] || null}
                        onChange={handleChange}
                        getOptionSelected={(option, value) => option.value === value.value}
                        disabled={!jobTitleEnable}
                        />
                    );
                    } else {
                        return (
                            <CustomAutocomplete
                                name={field.name}
                                label={field.label}
                                options={field.options || []}
                                value={values[field.name] || null}
                                onChange={handleChange}
                                getOptionSelected={(option, value) => option.value === value.value}
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
                        initialValues={initialValues}
                        />
                    );


                case 'decimalNumber':
                return (
                    <CustomDecimalNumberModifica
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    values={values}
                    onChange={handleChange}
                    initialValues={initialValues}
                    />
                );   


                case 'multipleSelect':
                    return ( 
                        <CustomMultipleSelectModifica
                            name={field.name}
                            label={field.label}
                            options={field.options}
                            value={values[field.name] || null}
                            onChange={handleChangeSkill}
                            getOptionSelected={(option, value) => option.value === value.value}
                            skillsOptions={skillsOptions}
                            initialValues={initialValues}
                        />
                    );


                    case "modificaFileCV":
                        return(
                            <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4}}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                                <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ 
                                    backgroundColor: 'black',
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    justifyContent:"flex-end",
                                    mr: 0.5,
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                startIcon={<CloudDownloadIcon />}
                                disabled={!values[field.name]}
                                component="label"
                                onClick={() => handleDownloadCVCF(values.cv.id, values.cv.descrizione)}
                                >

                                </Button>
                                        </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0'}}>
                                <Typography variant="body2">
                                {values.cv?.descrizione || 'Nessun file selezionato'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                        <Button
                                            variant="contained"
                                            sx={{ 
                                            backgroundColor: '#00B400',
                                            marginLeft: '10px', 
                                            marginBottom: "10px", 
                                            marginTop: "10px", 
                                            justifyContent:"flex-end", 
                                            color: 'black',
                                            ':hover': {
                                                backgroundColor: '#00B400',
                                                color: 'black',
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                            startIcon={<CloudUploadIcon />}
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleChangeCV(field.name)}
                                            />
                                        </Button>
                                        <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        marginLeft: '10px', 
                                        marginBottom: "10px", 
                                        marginTop: "10px", 
                                        justifyContent:"flex-end", 
                                        backgroundColor: 'black', 
                                        color: 'white',
                                        ':hover': {
                                            backgroundColor: 'red',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    startIcon={<DeleteIcon />}
                                    component="label"
                                    disabled={!values[field.name]}
                                    // onClick={() => handleDeleteCVCF(values.cv.id, idCandidato, 'cv')}
                                    onClick={() => handleOpenDeleteDialogCVCF(values.cv.id, 'cv')}
                                >
                                </Button>
                                        </Box>
                                </Box>
                            </Box>
                        );
                    
        
        
        
                        case "modificaFileCF":
                            return(
                                <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4, ml: 10}}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',margin: '10px 0'}}>
                                    <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                                    <Button
                                    variant="contained"
                                    sx={{ 
                                    backgroundColor: 'black',
                                    marginLeft: '10px', 
                                    marginBottom: "10px", 
                                    marginTop: "10px", 
                                    mr: 0.5,
                                    justifyContent:"flex-end", 
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        transform: 'scale(1.1)'
                                    }
                                }}
                                    startIcon={<CloudDownloadIcon />}
                                    disabled={!values[field.name]}
                                    component="label"
                                    onClick={() => handleDownloadCVCF(values.cf.id, values.cf.descrizione)}
                                    >

                                </Button>
                                        </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', margin: '10px 0'}}>
                                    <Typography variant="body2" >
                                    {values.cf?.descrizione || 'Nessun file selezionato'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, mr: 0.5}}>
                                        
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ 
                                            marginLeft: '10px', 
                                            marginBottom: "10px", 
                                            marginTop: "10px", 
                                            justifyContent:"flex-end", 
                                            backgroundColor: '#00B400', 
                                            color: 'black',
                                            ':hover': {
                                                backgroundColor: '#00B400',
                                                color: 'black',
                                                transform: 'scale(1.1)'
        
                                            }
                                        }}
                                            startIcon={<CloudUploadIcon />}
                                            component="label"
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleChangeCF(field.name)}
                                            />
                                        </Button>
                                        <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ 
                                        marginLeft: '10px', 
                                        marginBottom: "10px", 
                                        marginTop: "10px", 
                                        justifyContent:"flex-end", 
                                        backgroundColor: 'black', 
                                        color: 'white',
                                        ':hover': {
                                            backgroundColor: 'red',
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                    startIcon={<DeleteIcon />}
                                    component="label"
                                    disabled={!values[field.name]}
                                    // onClick={() => handleDeleteCVCF(values.cf.id, idCandidato, 'cf')}
                                    onClick={() => handleOpenDeleteDialogCVCF(values.cf.id, 'cf')}

                                >
                                </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            );



                

                
                    default:
                        return null;
            }
        }
        };


        const renderFieldsGroups = () => {
            return (
                <Box sx={{ ml: 15, mr: 15}}>
                    <Grid container spacing={2}> 
                        {groupedFields[currentPageIndex].map((field, index) => {
                            if (field.type === 'titleGroups') {
                                return (
                                    <Grid item xs={12} key={index}>
                                        {/* <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>{field.label}</Typography> */}
                                    </Grid>
                                );
                            } else if (field.type === 'note') {
                                return (
                                    <Grid item xs={12} key={index}>
                                        {renderFields(field)}
                                        {/* <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2}}>{field.label}</Typography> */}
                                    </Grid>
                                );
                            } else {
                                return (
                                    <Grid item xs={12} sm={6} key={index}> 
                                        {renderFields(field)}
                                    </Grid>
                                );
                            }
                        })}
                    </Grid>
                </Box>
            );
        };


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
        <Box sx={{ display: 'flex', height: '98%', width: '100vw', flexDirection: 'row', ml: '12.5em', mt: '0.5em', mb: '0.5em', mr: '0.8em', borderRadius: '20px', overflow: 'hidden' }}>
        <Box sx={{ width: '280px', height: '98%', background: '#00B400', p:2, overflow: 'hidden', position: 'fixed', borderRadius: '20px 0px 0px 20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                    <Button
                    onClick={handleGoBack}
                    sx={{
                        color: 'black',
                        border:'none',
                        fontSize: '0.8em',
                        cursor: 'pointer',
                        outline: 'none',
                        borderRadius: '10px',
                        mt: 4,
                        ml: 2,
                        '&:hover': {
                            color: '#EDEDED'
                        }
                    }}
                    >
                        <span style={{ marginRight: '0.5em'}}>{"<"}</span>
                        Indietro
                    </Button>
                </Box>
                <Typography variant="h6" sx={{display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', mt: 4, ml: 3, mb: 8, fontSize: '1.8em', color: 'black'}}>  Aggiorna <br /> Candidato </Typography>
                <List sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                            {menu.map((item) => (
                                <ListItem
                                key={item.title}
                                selected={activeSection === item.title}
                                sx={{
                                    mb: 4,
                                    '&.Mui-selected': {
                                        backgroundColor: activeSection === item.title ? 'black' : 'trasparent',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: activeSection === item.title ? '#EDEDED' : '#EDEDED'
                                        },
                                        borderRadius: '10px',
                                    }
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
            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD',  display: 'flex', flexDirection: 'column', ml: '280px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3}}>
                <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" component="h1" sx={{ mt:1, fontWeight: 'bold', fontSize: '1.8'}}>{activeSection}</Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', height: '100%', flexDirection: 'column', pl: 5, pr: 5, overflow: 'auto'}}>
                {renderFieldsGroups(groupedFields)}
                </Box>   
                <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16}}>* Campo Obbligatorio</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 6 }}>
                {currentPageIndex > 0 && (
                        <Button onClick={handleBackButtonClick}
                            sx={{
                            mb: 4,
                            width: '250px',
                            backgroundColor: "black",
                            color: "white",
                            fontWeight:"bold",
                            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            "&:hover": {
                                backgroundColor: "black",
                                transform: "scale(1.05)",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                },
                            }}>Indietro</Button>
                        )}
                        {currentPageIndex < groupedFields.length - 1 && (
                            <Button onClick={handleNextButtonClick}
                                sx={{ 
                                mb: 4,
                                width: '250px',
                                backgroundColor: "black",
                                color: "white",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white",
                                    transform: "scale(1.05)",
                                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                },}}>Avanti</Button>
                        )}
                        {currentPageIndex === groupedFields.length - 1 && (
                            <Button 
                            onClick={() => handleSubmit(values)}
                            type="submit"
                            sx={{
                                width: '250px',
                                mb: 4,
                                backgroundColor: "#00B400",
                                color: "#EDEDED",
                                fontWeight:"bold",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                
                                "&:hover": {
                                backgroundColor: "#00B400",
                                color: "#EDEDED",
                                transform: "scale(1.05)",
                                boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                },
                            }}>Salva</Button>
                        )}
                </Box>
            </Box>
        </Box>


        <Dialog
    open={openDialog}
    onClose={() => setOpenDialog(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        {"Conferma Eliminazione"}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler eliminare questo file?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenDialog(false)}
        sx={{
            backgroundColor: 'black',
            color: 'white',
            "&:hover": {
                backgroundColor: 'black'
            }
            
            }}>
            Annulla
            </Button>
        <Button onClick={() => {
            if (selectedFileId.type === 'cv') {
                handleDeleteCVCF(selectedFileId.id, idCandidato, 'cv');
            } else if (selectedFileId.type === 'cf') {
                handleDeleteCVCF(selectedFileId.id, idCandidato, 'cf');
            }
            setOpenDialog(false);
        }} 
        autoFocus 
        sx={{
            backgroundColor: '#5F8671',
            color: 'black',
            "&:hover": {
                backgroundColor: '#5F8671',
                color: 'black'
            }
        }}>
            Elimina
        </Button>
    </DialogActions>
</Dialog>
    </Box>
    )
}

export default ModificaRecruitingGrafica;