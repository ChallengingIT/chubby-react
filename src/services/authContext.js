// authContext.js
import React, { createContext, useContext, useState } from 'react';

// Crea il contesto di autenticazione
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Aggiorna lo stato dell'utente e salva i dati nel sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Rimuove i dati dell'utente dallo stato e dal sessionStorage
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
