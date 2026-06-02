import React from 'react';
import { FaInstagram, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-light text-center py-4 mt-5 border-top">
            <div className="container">
                <p className="mb-2 fw-bold text-huellitas">
                    Proyecto Huellitas <FaHeart className="text-danger" />
                </p>
                
                
                <div className="d-flex justify-content-center mb-3">
                    <a 
                        href="https://www.instagram.com/huellitas_web/" 
                        className="text-dark fs-4 icon-instagram-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>
                </div>
                
                <p className="text-muted small">
                    © {new Date().getFullYear()} Huellitas. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}