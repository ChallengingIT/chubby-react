import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useParams } from 'react-router-dom';
import { useUserTheme } from "../TorchyThemeProvider";
import DataGridClienti from './DataGridClienti';

const TabellaCandidati = ({ idNeed }) => {
    const theme = useUserTheme();

    const params = useParams();
    const { id } = params;

    const [originalCandidati, setOriginalCandidati] = useState([]);
    const [paginaCandidati, setPaginaCandidati] = useState(0);
    const [righeTotCandidati, setRigheTotCandidati] = useState(0);
    const quantita = 10;

    const [filtri, setFiltri] = useState(() => {
        const filtriSalvati = sessionStorage.getItem("filtriRicercaNeedMatch");
        return filtriSalvati
            ? JSON.parse(filtriSalvati)
            : {
                nome: '',
                cognome: '',
                tipologia: '',
                tipo: '',
                seniority: '',
            };
    });

    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;
    const username = user.username;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const fetchData = async (filters = filtri) => {
        const paginazione = {
            ...filters,
            pagina: 0,
            quantita: 10,
        };
        try {
            const candidatiResponse = await axios.get(
                `http://localhost:8080/staffing/react/mod`,
                { headers: headers, params: paginazione }
            );

            const { data: candidatiData } = candidatiResponse;

            const recordCandidati = candidatiData.record;
            const candidati = candidatiData.candidati;

            setRigheTotCandidati(recordCandidati);
            setOriginalCandidati(candidati);

            if (!setOriginalCandidati) {
                console.log("errore nel recupero dei candidati");
            }
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchMoreDataCandidati = async (paginaCandidati, filters = filtri) => {
        const url = `http://localhost:8080/need/react/match/associabili/ricerca/mod/${id}`

        const filtriCandidati = {
            ...filters,
            pagina: paginaCandidati,
            quantita: 10,
        };
        try {
            const candidatiResponse = await axios.get(url, {
                headers: headers,
                params: filtriCandidati,
            });
            const { data: candidatiData } = candidatiResponse;
            const recordCandidati = candidatiData.record;
            const candidati = candidatiData.candidati;

            setRigheTotCandidati(recordCandidati);
            setOriginalCandidati(candidati);
        } catch (error) {
            console.error("Errore durante il recupero dei dati: ", error);
        }
    };

    const handlePageChangeCandidati = (newPage) => {
        setPaginaCandidati(newPage);
        fetchMoreDataCandidati(newPage);
    };

    const handleAssocia = async (row) => {
        try {
            const idCandidato = row.id;
            const url = `http://localhost:8080/need/add/shortlist?id=${idNeed}&idCandidato=${idCandidato}&username=${username}`;
            const responseAssocia = await axios.post(url, { headers: headers });
            if (responseAssocia.data === "OK") {
                setOriginalCandidati((prevCandidati) => prevCandidati.filter(candidato => candidato.id !== idCandidato));
                setRigheTotCandidati((prevRighe) => prevRighe - 1);
            }
        } catch (error) {
            console.error("Errore durante il recuper dei dati: ", error);
        }
    };

    const handleFilterChange = (filters) => {
        setFiltri(filters);
        fetchData(filters);
    };

    const tabellaCandidati = [
        {
            field: "nome",
            headerName: "",
            flex: 1,
            sortable: false, filterable: true, disableColumnMenu: true,
            renderCell: (params) => (
                <div style={{ textAlign: "left" }}>
                    <div>
                        {params.row.nome} {params.row.cognome}
                    </div>
                </div>
            ),
        },
        { field: "email", headerName: "", flex: 1.4, sortable: false, filterable: true, disableColumnMenu: true, },
        {
            field: "azioni",
            headerName: "",
            flex: 0.4, sortable: false, filterable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleAssocia(params.row)}>
                        <AddCircleIcon sx={{ color: theme.palette.button.main }} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <Box sx={{ height: "auto", mt: 3, width: "100%", mb: 3 }}>
            <DataGridClienti
                data={originalCandidati}
                columns={tabellaCandidati}
                title=""
                getRowId={(row) => row.id}
                pagina={paginaCandidati}
                quantita={quantita}
                righeTot={righeTotCandidati}
                onPageChange={handlePageChangeCandidati}
                onFilterChange={handleFilterChange}
            />
        </Box>
    )
}

export default TabellaCandidati;
