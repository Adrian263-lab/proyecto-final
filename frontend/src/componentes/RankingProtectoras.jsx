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
            <h3 className="fw-bold mb-4 text-huellitas text-center">🏆 Protectoras mejor valoradas</h3>

            <div className="row g-3 justify-content-center">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom">
                        <div className="card card-huellitas h-100 p-3 text-center border-0 shadow-sm">

                            <div className="mb-3">
                                <span className="badge rounded-pill bg-huellitas text-white px-3">#{index + 1}</span>
                            </div>

                            <img
                                src={p.logo_url || 'https://via.placeholder.com/80'}
                                className="rounded-circle mb-3 border border-3 border-white shadow-sm mx-auto"
                                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                alt={p.name}
                            />

                            <h6 className="fw-bold mb-1 text-dark text-truncate">{p.name}</h6>

                            <div className="text-warning small mb-3">
                                {'⭐'.repeat(Math.round(p.media_puntuacion || 0))}
                            </div>

                            {/* BOTÓN ACTUALIZADO AL ESTILO SOLICITADO */}
                            // ... (resto del código igual)

                            {/* BOTÓN LIMPIO Y ESTILIZADO VÍA CSS */}
                            <Link
                                to={`/protectora/${p.id}`}
                                className="btn btn-sm w-100 rounded-pill fw-bold btn-ver-perfil"
                            >
                                Ver perfil
                            </Link>

// ... (resto del código igual)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}