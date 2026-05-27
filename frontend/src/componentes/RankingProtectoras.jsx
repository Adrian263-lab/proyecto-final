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
            {/* Cabecera unificada usando clases globales */}
            <h3 className="fw-bold mb-4 text-dark">
                <span className="text-huellitas">🏆 Protectoras mejor valoradas</span>
            </h3>
            
            <div className="row g-3">
                {ranking.map((p, index) => (
                    /* Usamos tu clase custom de diseño responsive */
                    <div key={p.id} className="col-6 col-md-2-custom"> 
                        {/* Mapeada la tarjeta a .card-huellitas oficial para heredar sombras y el borde inferior */}
                        <div className="card card-huellitas h-100 p-3 text-center">
                            
                            {/* Posicionamiento del Badge de puesto en el ranking */}
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge rounded-pill bg-warning text-dark fw-bold">#{index + 1}</span>
                            </div>
                            
                            <img 
                                src={p.logo_url || 'https://via.placeholder.com/80'} 
                                className="rounded-circle mb-3 border border-2 border-white shadow-sm mx-auto" 
                                style={{width: '70px', height: '70px', objectFit: 'cover'}}
                                alt={p.name}
                            />
                            
                            <h6 className="fw-bold mb-1 text-truncate text-dark">{p.name}</h6>
                            
                            <div className="text-warning small mb-2">
                                {'⭐'.repeat(Math.round(p.media_puntuacion || 0))}
                            </div>
                            
                            {/* Botón de acción secundario estilizado de forma nativa */}
                            <Link to={`/protectora/${p.id}`} className="btn btn-sm btn-light border text-huellitas rounded-pill px-3 fw-bold">
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}