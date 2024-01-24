import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import authService                              from "../services/auth.service";

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #343333;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
`;

const StyledH2 = styled.h2`
  color: #dfa330; /* Testo giallo */
`;

const LogoutButton = ({ onLogout, onCancel }) => {
  return (
    <div>
      <button onClick={onLogout}>Conferma</button>
      <button onClick={onCancel}>Annulla</button>
    </div>
  );
};

const LogoutComponent = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    // Chiamare il metodo logout per rimuovere l'utente dallo storage locale
  authService.logout();

  // Aggiornare lo stato dell'applicazione, ad esempio, impostando l'utente corrente su null
  setCurrentUser(null);
  
    console.log("User logged out");

    navigate("/login");
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContainer>
        <StyledH2>Sicuro di voler uscire?</StyledH2>
        <LogoutButton onLogout={handleLogout} onCancel={handleCancel} />
      </ModalContainer>
    </ModalBackground>
  );
};

export default LogoutComponent;
