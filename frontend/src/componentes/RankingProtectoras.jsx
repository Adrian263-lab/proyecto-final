import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

/**
 * Componente RankingProtectoras
 * Muestra un top de entidades basado en la media de sus valoraciones.
 * Implementa consumo asíncrono y protección contra fallos en carga de assets.
 */
export default function RankingProtectoras() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        /**
         * Función asíncrona encapsulada para cumplir con la firma del hook useEffect.
         * Recupera el listado ordenado directamente desde el backend para delegar
         * la carga de procesamiento (ordenación y cálculo de medias) a la base de datos.
         */
        const cargarRanking = async () => {
            try {
                const res = await api.get('/protectoras/ranking');
                setRanking(res.data);
            } catch (err) {
                console.error("Fallo al cargar los datos del ranking:", err);
            }
        };

        cargarRanking();
    }, []);

    /**
     * Interceptor de errores de imagen en tiempo de ejecución.
     * Garantiza que el ranking mantenga su consistencia visual si un logotipo externo falla.
     */
    const manejarErrorImagen = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop';
        e.target.onerror = null;
    };

    // Patrón Early Return: Si no hay datos, el componente no ensucia el DOM
    if (ranking.length === 0) return null;

    return (
        <div className="my-5 animate-up" aria-label="Ranking de protectoras mejor valoradas">
            <h3 className="fw-bold mb-4 text-huellitas text-center">🏆 Protectoras mejor valoradas</h3>

            <div className="row g-3 justify-content-center">
                {ranking.map((p, index) => (
                    <div key={p.id} className="col-6 col-md-2-custom">
                        <div className="card card-huellitas h-100 p-3 text-center border-0 shadow-sm">
                            
                            <div className="mb-3">
                                <span 
                                    className="badge rounded-pill bg-huellitas text-white px-3"
                                    aria-label={`Posición número ${index + 1}`}
                                >
                                    {/* El índice del array (0-based) se ajusta para mostrar un ranking humano (1-based) */}
                                    #{index + 1}
                                </span>
                            </div>

                            <img
                                src={p.logo_url || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop'}
                                className="rounded-circle mb-3 border border-3 border-white shadow-sm mx-auto"
                                style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                alt={`Logo corporativo de ${p.name}`}
                                onError={manejarErrorImagen}
                            />

                            <h6 className="fw-bold mb-1 text-dark text-truncate" title={p.name}>
                                {p.name}
                            </h6>

                            <div 
                                className="text-warning small mb-3"
                                aria-label={`Valoración media de ${Math.round(p.media_puntuacion || 0)} estrellas sobre 5`}
                            >
                                {/* Conversión de la media matemática a representación visual iterativa */}
                                {'⭐'.repeat(Math.round(p.media_puntuacion || 0))}
                            </div>

                            <Link
                                to={`/protectora/${p.id}`}
                                className="btn btn-sm w-100 rounded-pill fw-bold btn-ver-perfil"
                            >
                                Ver perfil
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}