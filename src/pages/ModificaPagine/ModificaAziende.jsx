import React, { useState, useEffect }         from "react";
import { useNavigate, useLocation }           from "react-router-dom";
import axios                                  from "axios";
import { Box, Typography } from "@mui/material";
import FieldBoxFile from "../../components/FieldBoxFile";



const ModificaAziende = () => {

console.log("localStorageAziende: ", localStorage.getItem("searchTermsAzienda"));


const navigate             = useNavigate();
const location             = useLocation();
const valori               = location.state;

console.log("VALORI: ", valori);


const [ provinceOptions, setProvinceOptions] = useState([]);
const [ ownerOptions,    setOwnerOptions   ] = useState([]);
const [ aziendeOptions,  setAziendeOptions ] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

const headers = {
    Authorization: `Bearer ${accessToken}`
};



    const navigateBack = () => {
        navigate(-1); 
    };




    useEffect(() => {
        const fetchProvinceOptions = async () => {
        try {
            const responseProvince = await axios.get("http://89.46.196.60:8443/aziende/react/province", { headers: headers });
            const responseOwner    = await axios.get("http://89.46.196.60:8443/aziende/react/owner", { headers: headers });
            const responseAziende  = await axios.get("http://89.46.196.60:8443/aziende/react/select", { headers: headers });

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
        } catch (error) {
            console.error("Errore durante il recupero delle province:", error);
        }
        };

        fetchProvinceOptions();
    }, []);

const campiObbligatori = [ "denominazione", "email", "idOwner", "status", "citta", "provincia" ];

const fields = [
    { label: "Nome Azienda*",           name: "denominazione",        type: "text",       disabled: true                                  },
    { label: "Ragione Sociale*",        name: "ragioneSociale",       type: "text",                                                       },
    { label: "Email*",                  name: "email",                type: "text"                                                        },
    { label: "Partita IVA",             name: "pi",                   type: "text"                                                        },
    { label: "Codice Fiscale",          name: "cf",                   type: "text"                                                        },
    { label: "Città*",                  name: "citta",                type: "text"                                                        },
    { label: "CAP",                     name: "cap",                  type: "text"                                                        },
    { label: "Paese",                   name: "paese",                type: "text"                                                        },
    { label: "Provincia*",              name: "provincia",            type: "select",     options: provinceOptions                        },
    { label: "Pec",                     name: "pec",                  type: "text"                                                        },
    { label: "Sede Operativa",          name: "sedeOperativa",        type: "text"                                                        },
    { label: "Sede Legale",             name: "sedeLegale",           type: "text"                                                        },
    { label: "Codice Destinatario",     name: "codiceDestinatario",   type: "text"                                                        },
    { label: "Sito Web",                name: "sito",                 type: "text"                                                        },
    { label: "Settore di mercato",      name: "settoreMercato",       type: "text"                                                        },
    { label: "Owner*",                  name: "idOwner",              type: "select",      options: ownerOptions                          },
    { label: "Tipologia",               name: "tipologia",            type: "select",      options: [ 
        { label: "Cliente",    value: "Cliente" },
        { label: "Prospect",   value: "Prospect" },
        { label: "Consulenza", value: "Consulenza" },
    ] },
    { label: "Stato*",                  name: "status",               type: "selectValue", options: [
        { value: 1, label: "Verde" },
        { value: 2, label: "Giallo" },
        { value: 3, label: "Rosso" },
    ] },
    { label: "Note",                    name: "note",                 type: "note" },
];

const initialValues = {
    id:                           valori.id                              ,
    denominazione:                valori.denominazione                   || null,
    email:                        valori.email                           || null,
    pi:                           valori.pi                              || null,
    cf:                           valori.cf                              || null,
    citta:                        valori.citta                           || null,
    cap:                          valori.cap                             || null,
    paese:                        valori.paese                           || null,
    provincia:                    valori.provincia                       || null,
    pec:                          valori.pec                             || null,
    sedeOperativa:                valori.sedeOperativa                   || null,
    sedeLegale:                   valori.sedeLegale                      || null,
    codicePa:                     valori.codicePa                        || null,
    codiceDestinatario:           valori.codiceDestinatario              || null,
    sito:                         valori.sito                            || null,
    settoreMercato:               valori.settoreMercato                  || null,
    tipologia:                    valori.tipologia                       || null,
    status:                       valori.status                          || null,
    idOwner:                     (valori.owner && valori.owner.id)       || null,
    note:                         valori.note                            || null,
};


    const handleSubmit = async (values) => {
        const errors = validateFields(values);
        const hasErrors = Object.keys(errors).length > 0;
    
        if (!hasErrors) {
        try {

        Object.keys(values).forEach(key => {
            if (!campiObbligatori.includes(key) && !values[key]) {
            values[key] = null;
            }
        });

        const response = await axios.post("http://89.46.196.60:8443/aziende/react/salva", values, {
            headers: headers
        });
        navigateBack();
        } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        }
    }
    };

    const validateFields = (values) => {
        let errors = {};
        campiObbligatori.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Questo campo è obbligatorio';
        }
        });
        return errors;
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#EEEDEE', height: '100vh', width: '100vw', flexDirection: 'row' }}>
            <Box sx={{ flexGrow: 1, p: 3, marginLeft: '12.2em', marginTop: '0.5em', marginBottom: '0.8em', marginRight: '0.8em', backgroundColor: '#FEFCFD', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" sx={{ mt:3, fontWeight: 'bold', fontSize: '1.8rem', color: '#00853C'}}>Modifica Azienda {valori.denominazione}</Typography>
        
            <FieldBoxFile
            fields={fields}
            initialValues={initialValues}
            campiObbligatori={campiObbligatori}
            onSubmit={handleSubmit}
            title=""
            />
            </Box>
        </Box>
    
    );
};

export default ModificaAziende;
