import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';
import { Link } from 'react-router-dom'; // 🚀 Importamos Link para poder navegar a la protectora pulsando su tarjeta

export default function PanelUsuario() {
    const { user, updateUser } = useAuth();
    const [nombre, setNombre] = useState(user?.name || '');
    const [eventos, setEventos] = useState([]);
    // 🚀 NUEVO ESTADO: Protectoras favoritas
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        // Cargar eventos a los que el usuario se ha inscrito
        api.get('/mis-eventos-inscritos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error al cargar eventos:", err));

        // 🚀 NUEVA PETICIÓN: Cargar las protectoras favoritas del usuario
        api.get('/favoritos')
            .then(res => setFavoritos(res.data))
            .catch(err => console.error("Error al cargar protectoras favoritas:", err));
    }, []);

    const guardarPerfil = async (e) => {
        e.preventDefault();
        try {
            await api.put('/perfil/update', { name: nombre });
            updateUser({ ...user, name: nombre }); // Actualiza el contexto global
            Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
        } catch (err) { 
            Swal.fire('Error', 'No se pudo guardar el perfil', 'error'); 
        }
    };

    // 🚀 NUEVA FUNCIÓN: Eliminar una protectora de favoritas desde el panel
    const eliminarFavorito = async (e, id) => {
        e.preventDefault(); // Evita que se dispare el Link si pinchan en el icono de borrar
        try {
            await api.post('/favoritos/toggle', { protectora_id: id });
            // Filtramos el estado para borrarla de la interfaz inmediatamente
            setFavoritos(favoritos.filter(fav => fav.id !== id));
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Eliminada de tus favoritos 💔',
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
            
            {/* Tarjeta de perfil estilizada con la clase del proyecto */}
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

            <h3 className="text-huellitas fw-bold mb-4">📅 Mis Eventos Inscritos</h3>
            {eventos.length > 0 ? (
                <div className="row mb-5">
                    {eventos.map(e => (
                        <div key={e.id} className="col-md-4 mb-3">
                            <div className="card card-huellitas h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold text-dark">{e.titulo}</h5>
                                    <p className="text-muted small">
                                        {new Date(e.fecha).toLocaleDateString()}
                                    </p>
                                    <span className="badge badge-huellitas">
                                        📍 {e.ubicacion}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted mb-5">No estás inscrito en ningún evento actualmente.</p>
            )}

            {/* 🚀 NUEVA SECCIÓN: MIS PROTECTORAS FAVORITAS */}
            <h3 className="text-huellitas fw-bold mb-4">🏢 Mis Protectoras Favoritas</h3>
            {favoritos.length > 0 ? (
                <div className="row">
                    {favoritos.map(p => (
                        <div key={p.id} className="col-md-4 mb-3">
                            {/* Enlazamos la tarjeta para que redirija a su perfil al pulsarla */}
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
                                        {/* Botón rápido con una cruz para desvincular directamente */}
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