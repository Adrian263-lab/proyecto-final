import React from 'react';
import { FaInstagram, FaTiktok, FaHeart } from 'react-icons/fa'; // 👈 Limpiamos los imports para dejar solo estos dos

export default function Footer() {
    return (
        <footer className="bg-light text-center py-4 mt-5 border-top">
            <div className="container">
                <p className="mb-2 fw-bold text-huellitas">
                    Proyecto Huellitas <FaHeart className="text-danger" />
                </p>
                
                {/* SECCIÓN REESTRUCTURADA CON INSTAGRAM Y TIKTOK */}
                <div className="d-flex justify-content-center gap-4 mb-3">
                    
                    {/* 📸 Enlace de Instagram Oficial */}
                    <a 
                        href="https://www.instagram.com/huellitas_web/" 
                        className="text-dark fs-4 icon-instagram-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>

                    {/* 🎵 Enlace de TikTok */}
                    <a 
                        href="https://www.tiktok.com/@huellitas_web" 
                        className="text-dark fs-4 icon-tiktok-huellitas" 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaTiktok />
                    </a>
                    
                </div>
                
                <p className="text-muted small">
                    © {new Date().getFullYear()} Huellitas. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}