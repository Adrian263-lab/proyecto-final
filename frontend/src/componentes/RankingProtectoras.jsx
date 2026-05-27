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
        <div className="my-5 animate-up">
            <h3 className="fw-bold mb-4 text-dark">
                <span className="text-huellitas">🏆</span> Protectoras mejor valoradas
            </h3>
            <div className="row g-3">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom"> 
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-3 text-center transition-hover">
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge rounded-pill bg-warning text-dark fw-bold">#{index + 1}</span>
                            </div>
                            <img 
                                src={p.logo_url || 'https://via.placeholder.com/80'} 
                                className="rounded-circle mb-3 border border-2 border-white shadow-sm" 
                                style={{width: '70px', height: '70px', objectFit: 'cover'}}
                                alt={p.name}
                            />
                            <h6 className="fw-bold mb-1 text-truncate">{p.name}</h6>
                            <div className="text-warning small mb-2">
                                {'⭐'.repeat(Math.round(p.media_puntuacion || 0))}
                            </div>
                            <Link to={`/protectora/${p.id}`} className="btn btn-sm btn-outline-huellitas rounded-pill px-3">
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .btn-outline-huellitas { border: 1px solid #6f42c1; color: #6f42c1; }
                .btn-outline-huellitas:hover { background-color: #6f42c1; color: white; }
                .transition-hover { transition: transform 0.2s; }
                .transition-hover:hover { transform: translateY(-5px); }
                
                /* Forzamos el ancho para que quepan 5 en escritorio */
                @media (min-width: 768px) {
                    .col-md-2-custom { flex: 0 0 20%; max-width: 20%; }
                }
            `}</style>
        </div>
    );
}