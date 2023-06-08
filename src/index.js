import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ClienteNuevo from './components/ClienteNuevo/ClienteNuevo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/cliente/list" element={<App />} />
        <Route path="/cliente/create" element={<ClienteNuevo />} />
        {/* Agrega más rutas aquí */}
        <Route path="/" element={<Navigate to="/cliente/list" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
