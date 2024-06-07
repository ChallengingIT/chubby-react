//   // src/hooks/useDropdownOptions.js
//     import { useState, useEffect } from 'react';
//     import { fetchTipologia, fetchTipo, fetchStatoCandidato } from '../api/recruitingService';

//     const useDropdownOptions = (headers) => {
//     const [tipologiaOptions, setTipologiaOptions] = useState([]);
//     const [tipoOptions, setTipoOptions] = useState([]);
//     const [statoOptions, setStatoOptions] = useState([]);

//     useEffect(() => {
//         const fetchOptions = async () => {
//         try {
//             const responseTipologia = await fetchTipologia(headers);
//             setTipologiaOptions(responseTipologia.data.map(t => ({
//             label: t.descrizione,
//             value: t.id,
//             })));

//             const responseTipo = await fetchTipo(headers);
//             setTipoOptions(responseTipo.data.map(t => ({
//             label: t.descrizione,
//             value: t.id,
//             })));

//             const responseStato = await fetchStatoCandidato(headers);
//             setStatoOptions(responseStato.data.map(s => ({
//             label: s.descrizione,
//             value: s.id,
//             })));
//         } catch (error) {
//             console.error('Errore durante il recupero delle opzioni dei dropdown: ', error);
//         }
//         };

//         fetchOptions();
//     }, []);

//     return { tipologiaOptions, tipoOptions, statoOptions };
//     };

//     export default useDropdownOptions;
