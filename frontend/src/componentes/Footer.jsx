import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-light text-center py-4 mt-5 border-top">
            <div className="container">
                <p className="mb-2 fw-bold text-huellitas">
                    Proyecto Huellitas <FaHeart className="text-danger" />
                </p>
                
                <div className="d-flex justify-content-center gap-3 mb-3">
                    <a href="https://facebook.com" className="text-dark fs-4" target="_blank" rel="noopener noreferrer">
                        <FaFacebook />
                    </a>
                    
                    <a 
                        href="https://www.instagram.com/huellitas_web/" 
                        className="text-dark fs-4 icon-instagram-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>
                    
                    <a href="https://twitter.com" className="text-dark fs-4" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                </div>
                
                <p className="text-muted small">
                    © {new Date().getFullYear()} Huellitas. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}