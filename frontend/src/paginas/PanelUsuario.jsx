import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import { Link } from 'react-router-dom';

/**
 * Componente funcional que administra el área privada del usuario particular (Panel de Control).
 * Muestra la información de identidad del usuario en formato de solo lectura y expone
 * las consultas asíncronas para el listado de eventos inscritos y protectoras favoritas.
 */
export default function PanelUsuario() {
    const { user } = useAuth();
    const [eventos, setEventos] = useState([]);
    const [favoritos, setFavoritos] = useState([]);

    /**
     * Ciclo de vida: Carga inicial de datos persistentes del usuario mediante peticiones HTTP concurrentes.
     */
    useEffect(() => {
        /** Recuperación de eventos vinculados al usuario autenticado */
        api.get('/mis-eventos-inscritos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error al cargar eventos:", err));

        /** Recuperación del conjunto de protectoras marcadas como favoritas */
        api.get('/favoritos')
            .then(res => setFavoritos(res.data))
            .catch(err => console.error("Error al cargar protectoras favoritas:", err));
    }, []);

    /**
     * Solicita la alternancia o baja de una entidad protectora de la tabla pivote de favoritos.
     * Modifica el estado reactivo local para evitar llamadas redundantes de refresco a la API.
     * @param {Event} e - Evento de interacción de la interfaz.
     * @param {number} id - Identificador único de la protectora seleccionada.
     */
    const eliminarFavorito = async (e, id) => {
        e.preventDefault(); 
        try {
            await api.post('/favoritos/toggle', { protectora_id: id });
            setFavoritos(favoritos.filter(fav => fav.id !== id));
        } catch (err) {
            console.error("Error al eliminar favorita:", err);
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="text-huellitas fw-bold mb-4">👤 Mi Perfil</h2>
            
            {/* Sección: Información de Identidad de Usuario (Solo Lectura) */}
            <div className="card card-huellitas p-4 mb-5 bg-white">
                <div className="row align-items-center">
                    <div className="col">
                        <span className="text-muted small d-block mb-1 fw-bold text-uppercase tracking-wider">
                            Nombre Completo
                        </span>
                        <h4 className="fw-bold text-dark mb-0">
                            {user?.name || 'Usuario Particular'}
                        </h4>
                    </div>
                    <div className="col-auto">
                        <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 fw-bold">
                            Cuenta Verificada
                        </span>
                    </div>
                </div>
            </div>

            {/* Sección del Historial de Eventos del Usuario */}
            <h3 className="text-huellitas fw-bold mb-4">📅 Mis Eventos Inscritos</h3>
            {eventos.length > 0 ? (
                <div className="row mb-5">
                    {eventos.map(e => (
                        <div key={e.id} className="col-md-4 mb-3">
                            <Link to={`/evento-detalle/${e.id}`} className="text-decoration-none">
                                <div className="card card-huellitas h-100 bg-white">
                                    <div className="card-body">
                                        <h5 className="fw-bold text-dark mb-2">{e.titulo}</h5>
                                        <p className="text-muted small mb-3">
                                            {new Date(e.fecha).toLocaleDateString()}
                                        </p>
                                        <span className="badge badge-huellitas">
                                            📍 {e.ubicacion}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted mb-5">No estás inscrito en ningún evento actualmente.</p>
            )}

            {/* Sección de Relaciones del Usuario con Entidades Protectoras */}
            <h3 className="text-huellitas fw-bold mb-4">🏢 Mis Protectoras Favoritas</h3>
            {favoritos.length > 0 ? (
                <div className="row">
                    {favoritos.map(p => (
                        <div key={p.id} className="col-md-4 mb-3">
                            <Link to={`/protectora/${p.id}`} className="text-decoration-none">
                                <div className="card card-huellitas h-100 bg-white">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-naranja-claro rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                                                <span style={{ fontSize: '1.2rem' }}>🏢</span>
                                            </div>
                                            <div>
                                                <h5 className="fw-bold text-dark mb-0">{p.name}</h5>
                                                <p className="text-muted small mb-0 mt-1">
                                                    📍 {p.direccion || 'Sin dirección registrada'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => eliminarFavorito(e, p.id)} 
                                            className="btn btn-link text-danger p-1 border-0" 
                                            title="Quitar de favoritas"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">No tienes ninguna protectora guardada en tus favoritas actualmente.</p>
            )}
        </div>
    );
}