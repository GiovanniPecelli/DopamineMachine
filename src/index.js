import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.scss'; // Questo import gestisce automaticamente la compilazione
import DopamineMachine from './components/dopamineMachine';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DopamineMachine />
  </React.StrictMode>
);

