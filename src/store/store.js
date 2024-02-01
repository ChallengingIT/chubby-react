// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import intervisteReducer from './slices/intervisteSlice';
import recruitingReducer from './slices/recruitingSlice';

const store = configureStore({
  reducer: {
    interviste: intervisteReducer,
    recruiting: recruitingReducer,
    // Qui potresti aggiungere altri slice del reducer se necessario
  },
});

export default store;
