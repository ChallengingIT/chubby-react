// intervisteSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const intervisteSlice = createSlice({
  name: 'interviste',
  initialState: {
    interviste: [],
    originalInterviste: [],
    filteredInterviste: [],
    // Altri stati specifici per interviste se necessario
  },
  reducers: {
    setInterviste: (state, action) => {
      state.interviste = action.payload;
    },
    setOriginalInterviste: (state, action) => {
      state.originalInterviste = action.payload;
    },
    setFilteredInterviste: (state, action) => {
      state.filteredInterviste = action.payload;
    },
    deleteIntervista: (state, action) => {
      const id = action.payload; // id dell'intervista da eliminare
      state.filteredInterviste = state.filteredInterviste.filter(intervista => intervista.id !== id);
      state.originalInterviste = state.originalInterviste.filter(intervista => intervista.id !== id);
    },
    addNewIntervista: (state, action) => {
      const newIntervista = action.payload;
      // Aggiunge la nuova intervista agli array di interviste
      state.originalInterviste = [...state.originalInterviste, newIntervista];
      state.filteredInterviste = [...state.filteredInterviste, newIntervista];
    },
    // Aggiungi altre azioni se necessario
  },
});

export const { setInterviste, setOriginalInterviste, setFilteredInterviste, deleteIntervista, addNewIntervista } = intervisteSlice.actions;

export default intervisteSlice.reducer;
