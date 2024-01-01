// src/store/slices/recruitingSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const recruitingSlice = createSlice({
  name: 'recruiting',
  initialState: {
    recruiting: [],
    originalRecruiting: [],
    filteredRecruiting: [],
  },
  reducers: {
    setRecruiting: (state, action) => {

      state.recruiting = action.payload;
    },
    setOriginalRecruiting: (state, action) => {
        
      state.originalRecruiting = action.payload;
    },
    setFilteredRecruiting: (state, action) => {
      state.filteredRecruiting = action.payload;
    },
    deleteRecruiting: (state, action) => {
      const id = action.payload;
      state.recruiting = state.recruiting.filter(item => item.id !== id);
      state.originalRecruiting = state.originalRecruiting.filter(item => item.id !== id);
      state.filteredRecruiting = state.filteredRecruiting.filter(item => item.id !== id);
    },
    // Aggiungi altri reducer necessari qui
  },
});

export const { setRecruiting, setOriginalRecruiting, setFilteredRecruiting, deleteRecruiting } = recruitingSlice.actions;

export default recruitingSlice.reducer;
