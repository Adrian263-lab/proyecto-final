import React from 'react';
import { FaInstagram, FaHeart } from 'react-icons/fa';

/**
 * Componente Footer para la aplicación Huellitas.
 */
export default function Footer() {
    // Generación dinámica del año para el copyright.
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-light text-center py-4 mt-5 border-top" role="contentinfo">
            <div className="container">
                <p className="mb-2 fw-bold text-huellitas">
                    Proyecto Huellitas 
                    <FaHeart className="text-danger" aria-hidden="true" />
                </p>
                
                <div className="d-flex justify-content-center mb-3">
                    <a 
                        href="https://www.instagram.com/huellitas_web/" 
                        className="text-dark fs-4 icon-instagram-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
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