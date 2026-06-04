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
        // HE QUITADO EL FONDO Y PADDING EXTRA
        <div className="my-5 animate-up">
            <h3 className="fw-bold mb-4 text-huellitas text-center">🏆 Protectoras mejor valoradas</h3>
            
            <div className="row g-3 justify-content-center">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom"> 
                        {/* Mantenemos tu clase card-huellitas para las sombras y el hover */}
                        <div className="card card-huellitas h-100 p-3 text-center border-0 shadow-sm">
                            
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