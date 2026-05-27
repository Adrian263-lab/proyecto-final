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
            <h3 className="fw-bold mb-4 text-dark d-flex align-items-center">
                <span className="me-2">🏆</span> Protectoras mejor valoradas
            </h3>
            
            <div className="row g-4">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom"> 
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center ranking-card">
                            {/* Medalla de posición */}
                            <div className="ranking-badge">#{index + 1}</div>
                            
                            {/* Logo protectora */}
                            <div className="position-relative mb-3">
                                <img 
                                    src={p.logo_url || 'https://via.placeholder.com/80'} 
                                    className="rounded-circle border border-4 border-light shadow-sm" 
                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                    alt={p.name}
                                />
                            </div>
                            
                            <h6 className="fw-bold mb-1 text-dark text-truncate">{p.name}</h6>
                            
                            {/* Estrellas con color mejorado */}
                            <div className="mb-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <i key={i} className={`bi ${i < Math.round(p.media_puntuacion) ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`} style={{ fontSize: '0.8rem' }}></i>
                                ))}
                            </div>

                            <Link to={`/protectora/${p.id}`} className="btn btn-sm btn-outline-dark rounded-pill px-4">
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .ranking-card {
                    transition: all 0.3s ease;
                    background: #ffffff;
                }
                .ranking-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .ranking-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #ffc107;
                    color: #000;
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.8rem;
                }
                @media (min-width: 768px) {
                    .col-md-2-custom { flex: 0 0 20%; max-width: 20%; }
                }
            `}</style>
        </div>
    );
}