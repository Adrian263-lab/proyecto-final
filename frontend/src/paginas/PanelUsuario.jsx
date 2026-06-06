import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import { Link } from 'react-router-dom';

/**
 * Componente PanelUsuario
 * Dashboard principal para el usuario de tipo "Particular".
 * Centraliza la información de perfil, historial de eventos y entidades favoritas.
 */
function PanelUsuario() {
    const { user } = useAuth();
    const [eventos, setEventos] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);

    /**
     * Efecto de inicialización.
     * Ejecuta solicitudes asíncronas concurrentes para poblar la vista rápidamente.
     */
    useEffect(() => {
        const inicializarPanel = async () => {
            try {
                // Ejecución en paralelo para minimizar la latencia de red
                const [resEventos, resFavoritos] = await Promise.all([
                    api.get('/mis-eventos-inscritos'),
                    api.get('/favoritos')
                ]);
                
                setEventos(resEventos.data);
                setFavoritos(resFavoritos.data);
            } catch (error) {
                console.error("Fallo de red al inicializar el panel de usuario:", error);
            } finally {
                setCargando(false);
            }
        };

        inicializarPanel();
    }, []);

    /**
     * Elimina una protectora de la lista de favoritas.
     * @param {Event} e - Evento sintético de React.
     * @param {number} id - Clave primaria de la entidad protectora.
     */
    const eliminarFavorito = async (e, id) => {
        e.preventDefault(); 
        e.stopPropagation(); // Previene la activación accidental del <Link> contenedor
        
        try {
            await api.post('/favoritos/toggle', { protectora_id: id });
            
            // Sincronización optimista del DOM
            setFavoritos(prev => prev.filter(fav => fav.id !== id));
        } catch (error) {
            console.error("Error transaccional al eliminar la entidad favorita:", error);
        }
    };

    if (cargando) {
        return (
            <div className="d-flex justify-content-center mt-5" aria-label="Cargando panel de usuario">
                <div className="spinner-border text-huellitas" role="status">
                    <span className="visually-hidden">Cargando datos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="text-huellitas fw-bold mb-4">👤 Mi Perfil</h2>
            
            {/* Sección: Información de Identidad de Usuario */}
            <div className="card card-huellitas p-4 mb-5 bg-white border-0 shadow-sm rounded-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-md-5">
                        <span className="text-muted small d-block mb-1 fw-bold text-uppercase tracking-wider">
                            Nombre Completo
                        </span>
                        <h4 className="fw-bold text-dark mb-0 text-break">
                            {user?.name || 'Usuario Particular'}
                        </h4>
                    </div>

                    <div className="col-12 col-md-5 border-start-md">
                        <span className="text-muted small d-block mb-1 fw-bold text-uppercase tracking-wider">
                            Correo Electrónico
                        </span>
                        <h4 className="fw-bold text-dark mb-0 text-break">
                            {user?.email || 'sin-correo@test.com'}
                        </h4>
                    </div>

                    <div className="col-12 col-md-2 text-start text-md-end">
                        <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 fw-bold d-inline-block shadow-sm">
                            Verificada
                        </span>
                    </div>
                </div>
            </div>

            {/* Sección: Historial de Eventos del Usuario */}
            <h3 className="text-huellitas fw-bold mb-4">📅 Mis Eventos Inscritos</h3>
            {eventos.length > 0 ? (
                <div className="row mb-5">
                    {eventos.map(e => (
                        <div key={e.id} className="col-12 col-md-4 mb-3">
                            <Link to={`/evento-detalle/${e.id}`} className="text-decoration-none">
                                <div className="card card-huellitas h-100 bg-white border-0 shadow-sm rounded-4 transition-hover">
                                    <div className="card-body">
                                        <h5 className="fw-bold text-dark mb-2">{e.titulo}</h5>
                                        <p className="text-muted small mb-3">
                                            {new Date(e.fecha).toLocaleDateString()}
                                        </p>
                                        <span className="badge badge-huellitas shadow-sm">
                                            📍 {e.ubicacion}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white text-muted mb-5">
                    No estás inscrito en ningún evento actualmente.
                </div>
            )}

            {/* Sección: Entidades Protectoras Favoritas */}
            <h3 className="text-huellitas fw-bold mb-4">🏢 Mis Protectoras Favoritas</h3>
            {favoritos.length > 0 ? (
                <div className="row">
                    {favoritos.map(p => (
                        <div key={p.id} className="col-12 col-md-4 mb-3">
                            <Link to={`/protectora/${p.id}`} className="text-decoration-none">
                                <div className="card card-huellitas h-100 bg-white border-0 shadow-sm rounded-4 transition-hover">
                                    <div className="card-body d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-naranja-claro rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                                                <span style={{ fontSize: '1.2rem' }} aria-hidden="true">🏢</span>
                                            </div>
                                            <div>
                                                <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '150px' }} title={p.name}>
                                                    {p.name}
                                                </h5>
                                                <p className="text-muted small mb-0 mt-1 text-truncate" style={{ maxWidth: '150px' }} title={p.direccion}>
                                                    📍 {p.direccion || 'Sin dirección'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => eliminarFavorito(e, p.id)} 
                                            className="btn btn-light text-danger p-2 border-0 rounded-circle shadow-sm" 
                                            title="Quitar de favoritas"
                                            aria-label={`Eliminar a ${p.name} de favoritas`}
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white text-muted">
                    No tienes ninguna protectora guardada en tus favoritas actualmente.
                </div>
            )}
        </div>
    );
}

export default PanelUsuario;