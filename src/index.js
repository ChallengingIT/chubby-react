// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Importa il componente Provider
import store from './store/store'; // Importa lo store che hai configurato

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Avvolgi l'App con Provider e passa lo store */}
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
