import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// 1. Frameworks y dependencias globales (UI)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 2. Hojas de estilo de dominio (Sobrescriben las reglas de Bootstrap)
import './App.css';

/**
 * Punto de entrada principal (Entry Point) de la aplicación React.
 * Instancia el Virtual DOM y monta el árbol de componentes sobre el DOM real del navegador.
 * Envuelve la aplicación en StrictMode para la detección de efectos secundarios en fase de desarrollo
 * y provee el contexto de enrutamiento global (BrowserRouter).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
