import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';
import { Link } from 'react-router-dom';

/**
 * Componente funcional que administra el área privada del usuario particular (Panel de Control).
 * Centraliza la actualización de los datos del perfil de usuario y expone las consultas
 * asíncronas para el listado correlativo de eventos inscritos y entidades protectoras favoritas.
 */
export default function PanelUsuario() {
    const { user, updateUser } = useAuth();
    const [nombre, setNombre] = useState(user?.name || '');
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
     * Procesa la solicitud asíncrona de actualización del perfil del usuario en la base de datos.
     * Sincroniza tanto el backend como el estado del contexto global una vez resuelta la promesa.
     * @param {Event} e - Evento de sumisión del formulario.
     */
    const guardarPerfil = async (e) => {
        e.preventDefault();
        try {
            await api.put('/perfil/update', { name: nombre });
            updateUser({ ...user, name: nombre }); 
            Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
        } catch (err) { 
            Swal.fire('Error', 'No se pudo guardar el perfil', 'error'); 
        }
    };

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
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Eliminada de tus favoritos',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (err) {
            console.error("Error al eliminar favorita:", err);
            Swal.fire('Error', 'No se pudo eliminar de favoritos', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="text-huellitas fw-bold mb-4">👤 Mi Perfil</h2>
            
            {/* Sección de Gestión de Identidad de Usuario */}
            <div className="card card-huellitas p-4 mb-5 bg-white">
                <form onSubmit={guardarPerfil}>
                    <label className="fw-bold mb-2">Nombre Completo</label>
                    <div className="d-flex gap-2">
                        <input 
                            className="form-control rounded-pill" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                        />
                        <button className="btn btn-huellitas text-white px-4">Guardar</button>
                    </div>
                </form>
            </div>

            {/* Sección del Historial de Eventos del Usuario */}
            <h3 className="text-huellitas fw-bold mb-4">📅 Mis Eventos Inscritos</h3>
            {eventos.length > 0 ? (
                <div className="row mb-5">
                    {eventos.map(e => (
                        <div key={e.id} className="col-md-4 mb-3">
                            {/* Enrutamiento dinámico hacia los detalles específicos del evento */}
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
                            {/* Enrutamiento dinámico hacia el perfil detallado de la protectora */}
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