import BASE_URL from '../../api/apiConfig';
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Skeleton,
    Snackbar,
    Grid,
    Slide,
    Container,
    IconButton,
    Dialog,
    } from '@mui/material';

    import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'; // cerchio vuoto
    import CloudUploadIcon from "@mui/icons-material/CloudUpload";
    import CheckCircleIcon from '@mui/icons-material/CheckCircle';
    import CloseIcon from "@mui/icons-material/Close";

    import axios from 'axios';
    import { useTranslation } from 'react-i18next';
    import { useMediaQuery } from '@mui/material';
    import { useUserTheme } from "../../components/TorchyThemeProvider";

    import CustomAutocomplete from '../../components/fields/CustomAutocomplete';
    import CustomTextFieldAggiungi from '../../components/fields/CustomTextFieldAggiungi';
    import CustomNoteAggiungi from '../../components/fields/CustomNoteAggiungi';
    import CustomDatePickerAggiungi from '../../components/fields/CustomDatePickerAggiungi';
    import CustomDecimalNumberAggiungi from '../../components/fields/CustomDecimalNumberAggiungi';
    import CustomMultipleSelectAggiunta from '../../components/fields/CustomMultipleSelectAggiunta';

    const AggiungiRecruitingGrafica = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useUserTheme();
    const isSmallScreen = useMediaQuery('(max-width: 800px)');

    const createEmptyIntervista = () => ({
        valutazione: null,
        dataIntervista: null,
        intervistatore: null,
        descrizioneIntervista: "",
    });

    const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null });

    // stati della pagina
    const [activeSection, setActiveSection] = useState(t('Profilo Candidato'));
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [alert, setAlert] = useState({ open: false, message: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // stati per i valori
    const [idCandidato, setIdCandidato] = useState([]);
    const [fileCV, setFileCV] = useState(null);
    const [fileCF, setFileCF] = useState(null);
    const [jobTitleOptions, setJobTitleOptions] = useState([]);
    const [tipologiaOptions, setTipologiaOptions] = useState([]);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [facoltaOptions, setFacoltaOptions] = useState([]);
    const [jobTitleEnable, setJobTitleEnable] = useState(false);
    const [livelloScolasticoOptions, setLivelloScolasticoOptions] = useState([]);
    const [funzioniAziendaliOptions, setFunzioniAziendaliOptions] = useState([]);
    const [ricercaOptions, setRicercaOptions] = useState([]);
    const [tipoOptions, setTipoOptions] = useState([]);

    const [values, setValues] = useState({
        interviste: [createEmptyIntervista()],
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        const fetchAziendeOptions = async () => {
        try {
            const responseTipologia = await axios.get(`${BASE_URL}staffing/react/tipo/candidatura`, { headers: headers });
            const facoltaResponse = await axios.get(`${BASE_URL}staffing/react/facolta`, { headers: headers });
            const livelloScolasticoResponse = await axios.get(`${BASE_URL}staffing/react/livello`, { headers: headers });
            const funzioniAziendaliResponse = await axios.get(`${BASE_URL}staffing/react/funzioni`, { headers: headers });
            const ricercaResponse = await axios.get(`${BASE_URL}staffing/react/tipo/ricerca`, { headers: headers });
            const tipoResponse = await axios.get(`${BASE_URL}staffing/react/tipo`, { headers: headers });
            const responseAree = await axios.get(`${BASE_URL}staffing/react/areas`, { headers: headers });

            let groupedSkills = [];

            if (Array.isArray(tipoResponse.data)) {
            const tipoOptions = tipoResponse.data.map((tipo) => ({
                label: tipo.descrizione,
                value: tipo.id,
            }));
            setTipoOptions(tipoOptions);
            }

            if (Array.isArray(ricercaResponse.data)) {
            const ricercaOptions = ricercaResponse.data.map((ricerca) => ({
                label: ricerca.descrizione,
                value: ricerca.id,
            }));
            setRicercaOptions(ricercaOptions);
            }

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

            const userString = sessionStorage.getItem("user");
            const user = userString ? JSON.parse(userString) : null;
            const username = user?.username;

            const ownerResponse = await axios.get(
            `${BASE_URL}owner/${username}`,
            { headers: headers }
            );

            if (Array.isArray(ownerResponse.data)) {
            const ownerOptions = ownerResponse.data.map(owner => ({
                label: owner.descrizione,
                value: owner.id,
            }));
            setOwnerOptions(ownerOptions);
            }

            if (Array.isArray(responseAree.data)) {
            for (const area of responseAree.data) {
                groupedSkills.push({
                label: area.descrizione,
                value: `__header_${area.id}__`,
                isHeader: true,
                });

                try {
                const responseSkillByArea = await axios.get(
                    `${BASE_URL}staffing/react/skill/${area.id}`,
                    { headers: headers }
                );

                if (Array.isArray(responseSkillByArea.data)) {
                    const skills = responseSkillByArea.data.map(skill => ({
                    label: skill.descrizione,
                    value: skill.id,
                    }));
                    groupedSkills = [...groupedSkills, ...skills];
                }
                } catch (err) {
                console.error(`Errore durante il recupero delle skill per l'area ${area.descrizione}:`, err);
                }
            }

            setSkillsOptions(groupedSkills);
            }

            if (Array.isArray(responseTipologia.data)) {
            const tipologiaOptions = responseTipologia.data.map((tipologia) => ({
                label: tipologia.descrizione,
                value: tipologia.id,
            }));
            setTipologiaOptions(tipologiaOptions);
            }

            if (Array.isArray(funzioniAziendaliResponse.data)) {
            const funzioneAziendaleOptions = funzioniAziendaliResponse.data.map((funzioni) => ({
                label: funzioni.descrizione,
                value: funzioni.id,
            }));
            setFunzioniAziendaliOptions(funzioneAziendaleOptions);
            }

        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        setLoading(false);
        };

        fetchAziendeOptions();
    }, []);

    const menu = [
        { title: t('Profilo Candidato'), icon: <CircleOutlinedIcon /> },
        { title: t('Esperienza'), icon: <CircleOutlinedIcon /> },
        { title: t('Posizione Lavorativa'), icon: <CircleOutlinedIcon /> },
        { title: t('Intervista'), icon: <CircleOutlinedIcon /> },
        { title: t('Allegati'), icon: <CircleOutlinedIcon /> }
    ];

    const [sectionCompleted, setSectionCompleted] = useState(new Array(menu.length).fill(false));

    const handleMenuItemClick = (section, index) => {
        const allPreviousCompleted = sectionCompleted.slice(0, index).every(x => x);
        if (allPreviousCompleted) {
        setActiveSection(section);
        setCurrentPageIndex(index);
        } else {
        setAlert({ open: true, message: t('Per cambiare sezione, completare tutti i campi obbligatori delle sezioni precedenti.') });
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getMandatoryFields = (index) => {
        switch (index) {
        case 0:
            return ["nome", "cognome", "dataNascita", "email"];
        case 1:
            return ["anniEsperienzaRuolo", "livelloScolastico"];
        case 2:
            return ["candidatura", "tipologia", "dataUltimoContatto", "funzioneAziendale"];
        default:
            return [];
        }
    };

    const validateFields = (values, mandatoryFields) => {
        let errors = {};
        mandatoryFields.forEach(field => {
        if (!values[field]) {
            errors[field] = t('Questo campo è obbligatorio');
        }
        });
        return errors;
    };

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

    const handleChange = (fieldValue) => {
        setValues(prevValues => ({
        ...prevValues,
        ...fieldValue
        }));
    };

    const handleChangeSkill = (fieldValue) => {
        const fieldName = Object.keys(fieldValue)[0];
        const newValues = fieldValue[fieldName];

        setValues(prevValues => ({
        ...prevValues,
        [fieldName]: [...newValues]
        }));
    };

    const handleBackButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        if (currentIndex > 0) {
        setActiveSection(menu[currentIndex - 1].title);
        setCurrentPageIndex(currentIndex - 1);
        }
    };

    const handleNextButtonClick = () => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(values, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;

        if (!hasErrors) {
        let newSectionCompleted = [...sectionCompleted];
        newSectionCompleted[currentIndex] = true;
        setSectionCompleted(newSectionCompleted);

        if (currentIndex < menu.length - 1) {
            setActiveSection(menu[currentIndex + 1].title);
            setCurrentPageIndex(currentIndex + 1);
        }
        } else {
        setAlert({ open: true, message: t('Compilare tutti i campi obbligatori presenti per poter avanzare') });
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') return;
        setAlert({ ...alert, open: false });
    };

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const isIntervistaComplete = (i) => {
        return (
        i &&
        i.intervistatore != null &&
        i.dataIntervista != null &&
        i.valutazione != null &&
        String(i.descrizioneIntervista ?? "").trim().length > 0
        );
    };

    const handleChangeIntervista = (index) => (fieldValue) => {
        // fieldValue è del tipo { nomeCampo: valore }
        setValues((prev) => {
        const current = Array.isArray(prev.interviste) ? prev.interviste : [];
        const next = [...current];
        next[index] = { ...next[index], ...fieldValue };
        return { ...prev, interviste: next };
        });
    };

    const canAddIntervista = () => {
        const list = Array.isArray(values.interviste) ? values.interviste : [];
        if (list.length === 0) return false;
        return isIntervistaComplete(list[list.length - 1]);
    };

    const handleAddIntervista = () => {
        if (!canAddIntervista()) return;
        setValues((prev) => ({
        ...prev,
        interviste: [...prev.interviste, createEmptyIntervista()],
        }));
    };

    const openDeleteDialog = (index) => setDeleteDialog({ open: true, index });
    const closeDeleteDialog = () => setDeleteDialog({ open: false, index: null });

    const confirmDeleteIntervista = () => {
        const idx = deleteDialog.index;
        setValues((prev) => {
        const current = Array.isArray(prev.interviste) ? prev.interviste : [];
        const next = current.filter((_, i) => i !== idx);
        return { ...prev, interviste: next };
        });
        closeDeleteDialog();
    };

    const fieldObbligatori = ["nome", "cognome", "dataNascita", "email", "anniEsperienzaRuolo", "tipologia", "dataUltimoContatto", "livelloScolastico", "funzioneAziendale"];

    const handleSubmit = async (valuesToSave) => {
        const currentIndex = menu.findIndex(item => item.title.toLowerCase() === activeSection.toLowerCase());
        const mandatoryFields = getMandatoryFields(currentIndex);
        const errors = validateFields(valuesToSave, mandatoryFields);
        const hasErrors = Object.keys(errors).length > 0;

        const list = Array.isArray(valuesToSave.interviste) ? valuesToSave.interviste : [];
        const hasIncompleteInterviews = list.some((i) => !isIntervistaComplete(i));
        if (list.length > 0 && hasIncompleteInterviews) {
        setAlert({ open: true, message: t("Completa tutti i campi di tutte le interviste prima di salvare") });
        return;
        }

        if (!hasErrors) {
        try {
            const payload = { ...valuesToSave };

            Object.keys(payload).forEach(key => {
            if (!fieldObbligatori.includes(key) && !payload[key]) {
                payload[key] = null;
            }
            });

            const skills = payload.skills ? payload.skills.join(',') : '';
            delete payload.skills;

            payload.interviste = (payload.interviste || []).map((i) => ({
            valutazione: i.valutazione,
            dataIntervista: i.dataIntervista,
            intervistatore: i.intervistatore != null ? { id: i.intervistatore } : null,
            descrizioneIntervista: i.descrizioneIntervista,
            }));

            delete payload.cv;
            delete payload.cf;

            const datiResponse = await axios.post(`${BASE_URL}staffing/salva`, payload, {
            params: { skill: skills },
            headers: headers,
            });

            if (datiResponse.data === "DUPLICATO") {
            setAlert({ open: true, message: t("email già esistente!") });
            console.error("il candidato è già stato salvato.");
            return;
            }
            if (datiResponse.data === "ERRORE") {
            setAlert({ open: true, message: t("errore durante il salvataggio del candidato!") });
            console.error("Il candidato non è stata salvata.");
            return;
            }

            const candidatoId = datiResponse.data;
            setIdCandidato(candidatoId);

            try {
            if (fileCV) {
                const formDataCV = new FormData();
                formDataCV.append('file', fileCV);
                formDataCV.append('tipo', 1);

                await axios.post(
                `${BASE_URL}staffing/react/staff/salva/file/${candidatoId}`,
                formDataCV,
                { headers: headers }
                );
            }
            } catch (error) {
            console.error("Errore nell'invio del CV", error);
            }

            try {
            if (fileCF) {
                const formDataCF = new FormData();
                formDataCF.append('file', fileCF);
                formDataCF.append('tipo', 2);

                await axios.post(
                `${BASE_URL}staffing/react/staff/salva/file/${candidatoId}`,
                formDataCF,
                { headers: headers }
                );
            }
            } catch (error) {
            console.error("errore nell'invio del CF", error);
            }

            navigate("/recruiting");
        } catch (error) {
            console.error("Errore durante il salvataggio:", error);
        }
        } else {
        setErrors(errors);
        setAlert({ open: true, message: t("Compilare tutti i field obbligatori presenti prima di avanzare") });
        }
    };

    useEffect(() => {
        if (values.funzioneAziendale && values.funzioneAziendale.length !== 0) {
        const funzioneAziendaleId = values.funzioneAziendale;
        setJobTitleEnable(true);
        fetchJobTitleOptions(funzioneAziendaleId);
        } else {
        setJobTitleEnable(false);
        setJobTitleOptions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.funzioneAziendale]);

    const fetchJobTitleOptions = async (funzioneAziendaleId) => {
        try {
        const response = await axios.get(`${BASE_URL}aziende/react/tipologia/${funzioneAziendaleId}`, { headers: headers });
        const jobTitleOptions = response.data.map(jobTitle => ({
            label: jobTitle.descrizione,
            value: jobTitle.id,
        }));
        setJobTitleOptions(jobTitleOptions);
        } catch (error) {
        console.error("Errore nel caricamento dei jobTitle:", error);
        }
    };

    const fields = [
        { type: "titleGroups", label: t("Profilo Candidato") },
        { label: t("Nome*"), name: "nome", type: "text", maxLength: 45 },
        { label: t("Cognome*"), name: "cognome", type: "text", maxLength: 45 },
        { label: t("Data Di Nascita*"), name: "dataNascita", type: "date" },
        { label: t("Email*"), name: "email", type: "text", maxLength: 45 },
        { label: t("Cellulare"), name: "cellulare", type: "text", maxLength: 20 },
        { label: t("Residenza"), name: "citta", type: "text", maxLength: 45 },

        { type: "titleGroups", label: t("Esperienza") },
        { label: t("Anni Di Esperienza"), name: "anniEsperienza", type: "decimalNumber" },
        { label: t("Anni Di Esperienza Nel Ruolo*"), name: "anniEsperienzaRuolo", type: "decimalNumber" },
        { label: t("Livello Scolastico*"), name: "livelloScolastico", type: "select", options: livelloScolasticoOptions },
        { label: t("Facoltà"), name: "facolta", type: "select", options: facoltaOptions },

        { type: "titleGroups", label: t("Posizione Lavorativa") },
        { label: t('Tipo Ingaggio*'), name: 'tipo', type: 'select', options: tipoOptions },
        { label: t("Tipo Candidatura*"), name: "candidatura", type: "select", options: tipologiaOptions },
        {
        label: t("Modalità Di Lavoro"), name: "modalita", type: "select", options: [
            { value: 1, label: t("Full Remote") },
            { value: 2, label: t("Ibrido") },
            { value: 3, label: t("On Site") },
        ]
        },
        { label: t("Funzione Aziendale*"), name: "funzioneAziendale", type: "select", options: funzioniAziendaliOptions },
        { label: t("Job Title*"), name: "tipologia", type: "select", options: jobTitleOptions },
        { label: t("Data Inserimento*"), name: "dataUltimoContatto", type: "date" },
        { label: t("Owner"), name: "owner", type: "select", options: ownerOptions },
        { label: "Skills", name: "skills", type: "multipleSelect", options: skillsOptions },
        { label: t("RAL/Tariffa"), name: "ral", type: "text", maxLength: 100 },
        { label: t("Disponibilità"), name: "disponibilita", type: "text", maxLength: 45 },
        { label: t("Note"), name: "note", type: "note", maxLength: 8000 },

        { type: "titleGroups", label: t("Interviste") },
        { type: "interviewList", name: "interviste" },

        { type: "titleGroups", label: t("Allegati") },
        { label: "Curriculim Vitae", name: "cv", type: "modificaFileCV" },
        { label: "Consultant File", name: "cf", type: "modificaFileCF" },
    ];

    const groupFields = (fields) => {
        const groupedFields = [];
        let currentGroup = [];
        fields.forEach((field) => {
        if (field.type === 'titleGroups') {
            if (currentGroup.length > 0) groupedFields.push([...currentGroup]);
            currentGroup = [field];
        } else {
            currentGroup.push(field);
        }
        });
        if (currentGroup.length > 0) groupedFields.push([...currentGroup]);
        return groupedFields;
    };

    const groupedFields = groupFields(fields);

    const renderFieldSkeleton = (type) => {
        switch (type) {
        case 'text':
        case 'date':
        case 'decimalNumber':
        case 'select':
        case 'multipleSelect':
            return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
        case 'note':
            return <Skeleton variant="text" width={710} height={120} />;
        case 'interviewList':
            return <Skeleton variant="rectangular" height={260} />;
        default:
            return <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
        }
    };

    const renderFields = (field) => {
        if (loading) return renderFieldSkeleton(field.type);

        const { type } = field;

        switch (type) {
        case 'text':
            return (
            <CustomTextFieldAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                maxLength={field.maxLength}
            />
            );

        case 'note':
            return (
            <CustomNoteAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
                maxLength={field.maxLength}
            />
            );

        case 'select':
            if (field.name === 'tipologia') {
            return (
                <CustomAutocomplete
                name={field.name}
                label={field.label}
                options={field.options || []}
                value={values[field.name] || null}
                onChange={handleChange}
                getOptionSelected={(option, value) => option.value === value.value}
                disabled={!jobTitleEnable}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                />
            );
            }
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

        case 'date':
            return (
            <CustomDatePickerAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
            />
            );

        case 'decimalNumber':
            return (
            <CustomDecimalNumberAggiungi
                name={field.name}
                label={field.label}
                type={field.type}
                values={values}
                onChange={handleChange}
            />
            );

        case 'multipleSelect':
            return (
            <CustomMultipleSelectAggiunta
                name={field.name}
                label={field.label}
                options={field.options}
                value={values[field.name] || null}
                onChange={handleChangeSkill}
                getOptionSelected={(option, value) => option.value === value.value}
                skillsOptions={skillsOptions}
            />
            );

        case 'interviewList': {
            const interviste = Array.isArray(values.interviste) ? values.interviste : [];

            return (
            <Box sx={{ width: "100%" }}>
                <Box
                    sx={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    pr: 1,
                    }}
                >
                {interviste.map((intervista, idx) => (
                <Box
                    key={idx}
                    sx={{
                    position: "relative",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    backgroundColor: "white",
                    }}
                >
                    <IconButton
                    aria-label="delete"
                    onClick={() => openDeleteDialog(idx)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                    <CloseIcon />
                    </IconButton>

                    <Typography sx={{ fontWeight: 700, mb: 2 }}>
                    {t("Intervista")} #{idx + 1}
                    </Typography>

                    <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <CustomAutocomplete
                        name="intervistatore"
                        label={t("Intervistatore")}
                        options={ownerOptions || []}
                        value={intervista.intervistatore || null}
                        onChange={handleChangeIntervista(idx)}
                        getOptionSelected={(option, value) => option.value === value.value}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomDatePickerAggiungi
                        name="dataIntervista"
                        label={t("Data Intervista")}
                        type="date"
                        values={intervista}
                        onChange={handleChangeIntervista(idx)}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <CustomAutocomplete
                        name="valutazione"
                        label={t("Valutazione")}
                        options={[
                            { value: 1, label: t("1 - KO") },
                            { value: 2, label: t("2") },
                            { value: 3, label: t("3") },
                            { value: 4, label: t("4") },
                            { value: 5, label: t("5") },
                        ]}
                        value={intervista.valutazione || null}
                        onChange={handleChangeIntervista(idx)}
                        getOptionSelected={(option, value) => option.value === value.value}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomNoteAggiungi
                        name="descrizioneIntervista"
                        label={t("Descrizione")}
                        type="note"
                        values={intervista}
                        onChange={handleChangeIntervista(idx)}
                        maxLength={8000}
                        />
                    </Grid>
                    </Grid>
                </Box>
                ))}

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    onClick={handleAddIntervista}
                    disabled={!canAddIntervista()}
                    sx={{
                    backgroundColor: "#00B400",
                    color: "white",
                    borderRadius: '10px',
                    mb: 2,
                    ':hover': { backgroundColor: "#00B400", transform: "scale(1.05)" }
                    }}
                >
                    {t("Aggiungi intervista")}
                </Button>
                </Box>

                <Dialog
                    open={deleteDialog.open}
                    onClose={closeDeleteDialog}
                    onClick={(event) => event.stopPropagation()}
                    PaperProps={{
                        sx: {
                        backgroundColor: "white",
                        p: 4,
                        borderRadius: 4,
                        width: { xs: "90vw", sm: "70vw", md: "40vw" },
                        position: "relative",
                        },
                    }}
                    >
                    <IconButton
                        onClick={closeDeleteDialog}
                        sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#8e8e8e",
                        bgcolor: "transparent",
                        "&:hover": {
                            color: "#db000e",
                            bgcolor: "transparent",
                        },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box
                        sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 2,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                        {t("Sei sicuro di voler eliminare l'intervista?")}
                        </Typography>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: 3,
                        }}
                        >
                        <Button
                            onClick={closeDeleteDialog}
                            sx={{
                            width: "10em",
                            backgroundColor: "#bfbfbf",
                            color: "white",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "#8e8e8e",
                                color: "white",
                                transform: "scale(1.01)",
                            },
                            }}
                        >
                            {t("Indietro")}
                        </Button>

                        <Button
                            onClick={confirmDeleteIntervista}
                            sx={{
                            width: "10em",
                            backgroundColor: "#ea333f",
                            color: "white",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "#db000e",
                                color: "white",
                                transform: "scale(1.01)",
                            },
                            }}
                        >
                            {t("Conferma")}
                        </Button>
                        </Box>
                    </Box>
                    </Dialog>
            </Box>
            </Box>
            );
        }

        case "modificaFileCV":
            return (
            <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <Typography variant="body2">
                    {values.cv?.descrizione || t('Nessun file selezionato')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mr: 0.5 }}>
                    <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#00B400',
                        marginLeft: '10px',
                        marginBottom: "10px",
                        marginTop: "10px",
                        justifyContent: "flex-end",
                        color: 'white',
                        ':hover': {
                        backgroundColor: '#00B400',
                        color: 'white',
                        transform: 'scale(1.1)'
                        }
                    }}
                    startIcon={<CloudUploadIcon sx={{ color: 'white' }} />}
                    component="label"
                    >
                    <input
                        type="file"
                        hidden
                        onChange={handleChangeCV(field.name)}
                    />
                    </Button>
                </Box>
                </Box>
            </Box>
            );

        case "modificaFileCF":
            return (
            <Box sx={{ width: '25em', overflow: 'hidden', mr: 10, mt: 4, ml: 10 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <Typography variant="subtitle1" gutterBottom>{field.label}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0' }}>
                <Typography variant="body2" >
                    {values.cf?.descrizione || 'Nessun file selezionato'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mr: 0.5 }}>
                    <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        marginLeft: '10px',
                        marginBottom: "10px",
                        marginTop: "10px",
                        justifyContent: "flex-end",
                        backgroundColor: '#00B400',
                        color: 'white',
                        ':hover': {
                        backgroundColor: '#00B400',
                        color: 'white',
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
                </Box>
                </Box>
            </Box>
            );

        default:
            return null;
        }
    };

    const renderFieldsGroups = () => {
        return (
        <Box sx={{ ml: 15, mr: 15 }}>
            <Grid container spacing={2}>
            {groupedFields[currentPageIndex].map((field, index) => {
                if (field.type === 'titleGroups') {
                return (
                    <Grid item xs={12} key={index}>
                    </Grid>
                );
                } else if (field.type === 'note' || field.type === 'interviewList') {
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
        );
    };

    return (
        <Container
        maxWidth={false}
        disableGutters
        sx={{
            display: "flex",
            backgroundColor: "#EEEDEE",
            maxHeight: "100dvh",
            width: "100%",
            overflowX: "hidden",
        }}
        >
        <Box
            sx={{
            display: "flex",
            flex: 1,
            width: "100%",
            flexDirection: "row",
            mt: "0.5em",
            mb: 2,
            mr: "0.8em",
            ml: isSmallScreen ? "3.5em" : "12.8em",
            borderRadius: "20px",
            overflow: "hidden",
            transition: "margin-left 0.3s ease",
            }}
        >
            <Box
            sx={{
                width: { xs: "70px", sm: "150px", md: "220px", lg: "280px" },
                background: theme.palette.aggiungiSidebar.bg,
                p: 2,
                borderRadius: "20px 0px 0px 20px",
                transition: "width 0.3s ease",
                position: "sticky",
                top: 0,
                alignSelf: "flex-start",
                height: "100dvh",
                overflow: "hidden",
                flexShrink: 0,
            }}
            >
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <Button
                onClick={handleGoBack}
                sx={{
                    color: '#EDEDED',
                    border: 'none',
                    fontSize: '0.8em',
                    cursor: 'pointer',
                    outline: 'none',
                    borderRadius: '10px',
                    mt: 4,
                    ml: 2,
                    '&:hover': { color: 'black' }
                }}
                >
                <span style={{ marginRight: '0.5em' }}>{"<"}</span>
                {t('Indietro')}
                </Button>
            </Box>

            <Typography
                variant="h6"
                sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontWeight: 'bold',
                mt: 4,
                ml: 3,
                mb: 8,
                fontSize: { xs: "1.2em", sm: "1.5em", md: "1.8em" },
                transition: 'fontSize 0.3s ease',
                color: 'black'
                }}
            >
                {t('Aggiungi')} <br /> {t('Candidato')}
            </Typography>

            <List sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {menu.map((item, index) => (
                <ListItem
                    key={item.title}
                    selected={activeSection === item.title}
                    onClick={() => handleMenuItemClick(item.title, index)}
                    sx={{
                    mb: 4,
                    cursor: sectionCompleted[index] ? 'pointer' : 'not-allowed',
                    '&.Mui-selected, &:hover': {
                        backgroundColor: sectionCompleted[index] ? 'black' : 'black',
                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: sectionCompleted[index] ? '#EDEDED' : '#EDEDED'
                        },
                        borderRadius: '10px',
                    }
                    }}
                >
                    <ListItemIcon
                    sx={{
                        color: theme.palette.aggiungiSidebar.text,
                        mr: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 },
                        display: { xs: 'none', sm: 'none', md: 'block' },
                    }}
                    >
                    {sectionCompleted[index] ? <CheckCircleIcon /> : item.icon}
                    </ListItemIcon>
                    <ListItemText
                    primary={item.title}
                    sx={{
                        color: theme.palette.aggiungiSidebar.text,
                        fontSize: { xs: "0.7em", sm: "0.8em", md: "1em" },
                        ml: { xs: 0.01, sm: 0.01, md: 1.5, lg: 2 }
                    }}
                    />
                </ListItem>
                ))}
            </List>
            </Box>

            <Box sx={{ flexGrow: 1, height: '100%', background: '#FEFCFD', display: 'flex', flexDirection: 'column', minHeight: "100dvh" }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 3 }}>
                <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={TransitionDown}
                >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
                </Snackbar>
                <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 'bold', fontSize: '1.8' }}>
                {activeSection}
                </Typography>
            </Box>

            <Box
                sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                pl: { xs: 1, sm: 2, md: 3, lg: 5 },
                pr: { xs: 1, sm: 2, md: 3, lg: 5 },
                overflow: "auto",
                }}
            >
                {renderFieldsGroups(groupedFields)}
            </Box>

            <Typography variant="h6" sx={{ mt: 2, color: '#666565', fontSize: '1em', ml: 16 }}>
                {t('* Campo Obbligatorio')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5, gap: 2, flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'row' } }}>
                {currentPageIndex > 0 && (
                <Button
                    onClick={handleBackButtonClick}
                    sx={{
                    mb: 6,
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%' },
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                    "&:hover": {
                        backgroundColor: "black",
                        transform: "scale(1.05)",
                        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                    },
                    }}
                >
                    {t('Indietro')}
                </Button>
                )}

                {currentPageIndex < groupedFields.length - 1 && (
                <Button
                    onClick={handleNextButtonClick}
                    sx={{
                    mb: 6,
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%' },
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                    "&:hover": {
                        backgroundColor: "black",
                        color: "white",
                        transform: "scale(1.05)",
                        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                    },
                    }}
                >
                    {t('Avanti')}
                </Button>
                )}

                {currentPageIndex === groupedFields.length - 1 && (
                <Button
                    onClick={() => handleSubmit(values)}
                    type="submit"
                    sx={{
                    mb: 6,
                    width: { xs: '5%', sm: '10%', md: '15%', lg: '15%' }, 
                    backgroundColor: "#00B400",
                    color: "#EDEDED",
                    fontWeight: "bold",
                    boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    fontSize: { xs: "0.5em", sm: "0.7em", md: "0.9em" },
                    "&:hover": {
                        backgroundColor: "#019301",
                        color: "#EDEDED",
                        transform: "scale(1.05)",
                        boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                    },
                    }}
                >
                    {t('Salva')}
                </Button>
                )}
            </Box>
            </Box>
        </Box>
        </Container>
    );
    };

    export default AggiungiRecruitingGrafica;
