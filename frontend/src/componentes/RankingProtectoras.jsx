import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RankingProtectoras() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        api.get('/protectoras/ranking')
            .then(res => setRanking(res.data))
            .catch(err => console.error("Error al cargar ranking:", err));
    }, []);

    if (ranking.length === 0) return null;

    return (
        // Fondo sutil para separar el ranking visualmente
        <div className="py-5 px-3 rounded-4 mb-5" style={{ backgroundColor: '#fff5f2' }}>
            <h3 className="fw-bold mb-4 text-huellitas text-center">🏆 Protectoras mejor valoradas</h3>
            
            <div className="row g-3 justify-content-center">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom"> 
                        {/* Aplicamos la tarjeta con el borde superior de color */}
                        <div className="card card-huellitas h-100 p-3 text-center border-0 shadow-sm" 
                             style={{ borderTop: '5px solid var(--huellitas-purple)' }}>
                            
                            {/* Puesto del ranking */}
                            <div className="mb-3">
                                <span className="badge rounded-pill bg-huellitas text-white px-3">#{index + 1}</span>
                            </div>
                            
                            <img 
                                src={p.logo_url || 'https://via.placeholder.com/80'} 
                                className="rounded-circle mb-3 border border-3 border-white shadow-sm mx-auto" 
                                style={{width: '70px', height: '70px', objectFit: 'cover'}}
                                alt={p.name}
                            />
                            
                            <h6 className="fw-bold mb-1 text-dark text-truncate">{p.name}</h6>
                            
                            <div className="text-warning small mb-3">
                                {'⭐'.repeat(Math.round(p.media_puntuacion || 0))}
                            </div>
                            
                            <Link to={`/protectora/${p.id}`} className="btn btn-outline-huellitas btn-sm rounded-pill px-3 fw-bold">
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}