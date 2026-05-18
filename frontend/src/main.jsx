import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <--- AÑADE ESTA LÍNEA
import './App.css';

// 1. Base de estilos (Bootstrap primero)
import 'bootstrap/dist/css/bootstrap.min.css'

// 2. Tus personalizaciones (App.css después para que gane a Bootstrap)
import './App.css' 

// 3. index.css (Opcional: solo si lo has vaciado o tiene algo mínimo)
// import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
