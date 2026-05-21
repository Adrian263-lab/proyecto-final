import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import GestionLogo from '../componentes/GestionLogo';
import Swal from 'sweetalert2';

export default function PanelProtectora() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState('perfil'); 
    const [datos, setDatos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    // Imagen por defecto temática
    const DEFAULT_IMG = 'https://loremflickr.com/400/400/animal,dog,cat';
    const handleImageError = (e) => { e.target.src = DEFAULT_IMG; };

    useEffect(() => {
        if (seccion === 'animales') cargarAnimales();
        else if (seccion === 'eventos') cargarEventos();
        else if (seccion === 'adopciones') cargarSolicitudes();
        
        api.get('/notificaciones').then(res => setNotificaciones(res.data)).catch(() => {});
    }, [seccion]);

    const cargarAnimales = () => {
        api.get('/mis-animales')
            .then(res => { console.log("Animales:", res.data); setDatos(res.data); })
            .catch(err => console.error("Error mis-animales:", err));
    };

    const cargarEventos = () => {
        api.get('/mis-eventos')
            .then(res => { console.log("Eventos:", res.data); setEventos(res.data); })
            .catch(err => console.error("Error mis-eventos:", err));
    };

    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes')
            .then(res => setSolicitudes(res.data))
            .catch(err => console.error(err));
        api.post('/notificaciones/marcar-leidas').then(() => setNotificaciones([]));
    };

    // ... (Mantén aquí tus funciones: verInforme, actualizarPerfil, gestionarAdopcion, eliminarAnimal, revertirEstado, eliminarEvento) ...
    // Asegúrate de incluir las funciones que ya tenías definidas en tu archivo anterior.

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 text-center rounded-4 bg-white">
                        <img src={user?.logo_url || DEFAULT_IMG} onError={handleImageError} className="rounded-circle border border-3 border-huellitas shadow-sm" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <h5 className="fw-bold mt-3 mb-1">{user?.name}</h5>
                        <span className="badge bg-success rounded-pill">Protectora Validada</span>
                        <hr />
                        <nav className="nav flex-column gap-2 text-start">
                            {['perfil', 'animales', 'eventos', 'adopciones'].map(s => (
                                <button key={s} onClick={() => setSeccion(s)} className={`btn text-start rounded-pill position-relative ${seccion === s ? 'btn-huellitas shadow-sm text-white' : 'btn-light'}`}>
                                    {s === 'perfil' ? '👤 Mi Perfil' : s === 'animales' ? '🐾 Mis Animales' : s === 'eventos' ? '📅 Mis Eventos' : '🐾 Solicitudes'}
                                    {s === 'adopciones' && notificaciones.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{notificaciones.length}</span>}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="col-md-9">
                    {/* SECCIÓN ANIMALES */}
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill px-4" onClick={() => navigate('/nuevo-animal')}>+ Nuevo Animal</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>{datos.map(a => (
                                    <tr key={a.id}><td>{a.nombre}</td><td>{a.estado}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary me-2 rounded-pill">Editar</button>
                                        <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill">Borrar</button>
                                    </td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* SECCIÓN EVENTOS */}
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Eventos</h3>
                                <button className="btn btn-huellitas text-white rounded-pill px-4" onClick={() => navigate('/nuevo-evento')}>+ Evento</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
                                <tbody>{eventos.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.titulo}</td>
                                        <td>{new Date(e.fecha).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => navigate(`/editar-evento/${e.id}`)} className="btn btn-sm btn-outline-primary me-2 rounded-pill">Editar</button>
                                            <button onClick={() => eliminarEvento(e.id)} className="btn btn-sm btn-outline-danger rounded-pill">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <style>{`.btn-huellitas { background-color: #6f42c1; } .text-huellitas { color: #6f42c1; }`}</style>
        </div>
    );
}