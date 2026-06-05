import React from 'react';
import { FaInstagram, FaHeart } from 'react-icons/fa';

/**
 * Componente funcional Footer.
 * Representa el pie de página global de la aplicación.
 * Implementa estándares de accesibilidad (ARIA) y dinamismo en el copyright.
 */
function Footer() {
    // Definimos el año dinámicamente para asegurar vigencia legal sin intervención manual.
    const currentYear = new Date().getFullYear();

    return (
        // El atributo role="contentinfo" ayuda a las tecnologías de asistencia 
        // a identificar que este es el pie de página del documento.
        <footer className="bg-light text-center py-4 mt-5 border-top" role="contentinfo">
            <div className="container">
                <p className="mb-2 fw-bold text-huellitas">
                    Proyecto Huellitas 
                    {/* aria-hidden="true" evita que lectores de pantalla lean decoraciones visuales redundantes */}
                    <FaHeart className="text-danger" aria-hidden="true" />
                </p>
                
                <div className="d-flex justify-content-center mb-3">
                    <a 
                        href="https://www.instagram.com/huellitas_web/" 
                        className="text-dark fs-4 icon-instagram-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        // aria-label mejora la accesibilidad indicando el destino del enlace
                        aria-label="Síguenos en Instagram"
                    >
                        <FaInstagram aria-hidden="true" />
                    </a>
                </div>
                
                <p className="text-muted small">
                    © {currentYear} Huellitas. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}


export default Footer;