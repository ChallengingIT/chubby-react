import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://localhost:8080/csrf');
        const data = await response.json();
        setCsrfToken(data['XSRF-TOKEN']); 
      } catch (error) {
        console.error('Errore durante il recupero del token CSRF', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Errore durante il login');
      }

      // Gestisci la risposta JSON o esegui altre azioni necessarie
      const data = await response.json();

      // Esegui la tua richiesta successiva qui
      await fetch('https://localhost:8080/home', {
        method: 'GET', // o 'POST' o qualsiasi altro metodo
        headers: {
          'XSRF-TOKEN': csrfToken,
        },
      });

      // Puoi anche navigare a una nuova pagina dopo il login
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il login', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
