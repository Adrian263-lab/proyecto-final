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
        <div className="my-5">
            <h3 className="fw-bold text-huellitas mb-4">🏆 Protectoras Destacadas</h3>
            <div className="row">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-md-2 mb-3">
                        <div className="card shadow-sm border-0 rounded-4 text-center p-3 h-100">
                            <span className="badge bg-warning text-dark mb-2">#{index + 1}</span>
                            <img src={p.logo_url || 'https://via.placeholder.com/60'} className="rounded-circle mb-2" style={{width: '60px', height: '60px', objectFit: 'cover'}} />
                            <h6 className="fw-bold">{p.name}</h6>
                            <p className="text-muted small">⭐ {parseFloat(p.media_puntuacion).toFixed(1)}</p>
                            <Link to={`/protectora/${p.id}`} className="btn btn-sm btn-outline-huellitas rounded-pill">Ver</Link>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .btn-outline-huellitas { border-color: #6f42c1; color: #6f42c1; }
                .btn-outline-huellitas:hover { background-color: #6f42c1; color: white; }
            `}</style>
        </div>
    );
}