    // // src/hooks/useRecruitingData.js
    // import { useState, useEffect } from 'react';
    // import {
    // fetchCandidati,
    // deleteCandidato,
    // fetchTipologia,
    // fetchTipo,
    // fetchStatoCandidato,
    // } from '../api/recruitingService';

    // const useRecruitingData = (headers) => {
    // const [recruitingData, setRecruitingData] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [pagina, setPagina] = useState(0);
    // const [righeTot, setRigheTot] = useState(0);
    // const [filtri, setFiltri] = useState(() => {
    //     const filtriSalvati = sessionStorage.getItem('filtriRicercaRecruiting');
    //     return filtriSalvati ? JSON.parse(filtriSalvati) : {
    //     nome: null,
    //     cognome: null,
    //     tipologia: null,
    //     stato: null,
    //     tipo: null,
    //     };
    // });


    //     const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetchCandidati({
    //         ...filtri,
    //         pagina,
    //         quantita: 10,
    //         }, headers);
    //         const { record, candidati } = response.data;
    //         setRecruitingData(candidati);
    //         setRigheTot(record);
    //     } catch (error) {
    //         console.error('Errore durante il recupero dei dati: ', error);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };
    // useEffect(() => {
    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     sessionStorage.setItem('filtriRicercaRecruiting', JSON.stringify(filtri));
    // }, [filtri]);

    // const fetchMoreData = async (newPage) => {
    //     setPagina(newPage);
    //     const response = await fetchCandidati({
    //     ...filtri,
    //     pagina: newPage,
    //     quantita: 10,
    //     }, headers);
    //     const { record, candidati } = response.data;
    //     setRecruitingData(candidati);
    //     setRigheTot(record);
    // };

    // return { recruitingData, loading, fetchMoreData, filtri, setFiltri, pagina, righeTot };
    // };

    // export default useRecruitingData;

