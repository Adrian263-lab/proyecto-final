import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import GestionLogo from '../componentes/GestionLogo';
import Swal from 'sweetalert2';

export default function PanelProtectora() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState('perfil'); 
    const [datos, setDatos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]); // <--- ESTADO PARA SOLICITUDES

    useEffect(() => {
        if (seccion === 'animales') cargarAnimales();
        else if (seccion === 'eventos') cargarEventos();
        else if (seccion === 'adopciones') cargarSolicitudes(); // <--- LLAMADA
    }, [seccion]);

    const cargarAnimales = () => {
        api.get('/mis-animales').then(res => setDatos(res.data)).catch(err => console.error(err));
    };

    const cargarEventos = () => {
        api.get('/mis-eventos').then(res => setEventos(res.data)).catch(err => console.error(err));
    };

    // <--- FUNCIÓN PARA CARGAR SOLICITUDES
    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes').then(res => setSolicitudes(res.data)).catch(err => console.error(err));
    };

    const eliminarAnimal = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'Sí, borrar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/animales/${id}`).then(() => {
                    Swal.fire('Eliminado', 'El animal ha sido borrado', 'success');
                    cargarAnimales();
                });
            }
        });
    };

    const eliminarEvento = (id) => {
        Swal.fire({
            title: '¿Eliminar evento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/eventos/${id}`).then(() => {
                    Swal.fire('Eliminado', 'Evento borrado', 'success');
                    cargarEventos();
                });
            }
        });
    };

    // <--- FUNCIÓN PARA GESTIONAR ADOPCIONES
    const gestionarAdopcion = async (id, accion) => {
        try {
            await api.put(`/protectora/adopciones/${accion}/${id}`);
            Swal.fire('¡Procesado!', `Solicitud ${accion}ada correctamente`, 'success');
            cargarSolicitudes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 text-center rounded-4 bg-white">
                        <div className="mb-3 mt-2">
                            <img src={user?.logo_url || 'https://via.placeholder.com/100?text=LOGO'} alt="Logo" className="rounded-circle border border-3 border-huellitas shadow-sm" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            <h5 className="fw-bold mt-3 mb-1">{user?.name}</h5>
                            <span className="badge bg-success rounded-pill">Protectora Validada</span>
                        </div>
                        <hr />
                        <nav className="nav flex-column gap-2 text-start">
                            <button onClick={() => setSeccion('perfil')} className={`btn text-start rounded-pill ${seccion === 'perfil' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>👤 Mi Perfil</button>
                            <button onClick={() => setSeccion('animales')} className={`btn text-start rounded-pill ${seccion === 'animales' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>🐾 Mis Animales</button>
                            <button onClick={() => setSeccion('eventos')} className={`btn text-start rounded-pill ${seccion === 'eventos' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>📅 Mis Eventos</button>
                            <button onClick={() => setSeccion('adopciones')} className={`btn text-start rounded-pill ${seccion === 'adopciones' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>🐾 Solicitudes Adopción</button>
                        </nav>
                    </div>
                </div>

                <div className="col-md-9">
                    {/* SECCIÓN PERFIL */}
                    {seccion === 'perfil' && <div className="animate__animated animate__fadeIn"><GestionLogo /></div>}

                    {/* SECCIÓN ANIMALES */}
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 animate__animated animate__fadeIn bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={() => navigate('/nuevo-animal')}>+ Nuevo Animal</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>{datos.map(a => (
                                    <tr key={a.id}><td>{a.nombre}</td><td>{a.estado}</td>
                                    <td><button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
                                    <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger">Borrar</button></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* SECCIÓN EVENTOS */}
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 animate__animated animate__fadeIn bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Eventos</h3>
                                <button className="btn btn-huellitas rounded-pill px-4 shadow-sm" onClick={() => navigate('/nuevo-evento')}>+ Evento</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
                                <tbody>{eventos.map(e => (
                                    <tr key={e.id}><td>{e.titulo}</td><td>{e.fecha}</td>
                                    <td><button onClick={() => eliminarEvento(e.id)} className="btn btn-sm btn-outline-danger">Eliminar</button></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}

                    {/* SECCIÓN ADOPCIONES (NUEVA) */}
                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 animate__animated animate__fadeIn bg-white">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes de Adopción</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Animal</th><th>Usuario</th><th>Acciones</th></tr></thead>
                                <tbody>{solicitudes.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.animal.nombre}</td>
                                        <td>{s.user.name}</td>
                                        <td>
                                            <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success me-2 rounded-pill">Aprobar</button>
                                            <button onClick={() => gestionarAdopcion(s.id, 'rechazar')} className="btn btn-sm btn-danger rounded-pill">Rechazar</button>
                                        </td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .btn-huellitas { background-color: #6f42c1; color: white; }
                .btn-huellitas:hover { background-color: #5a32a3; color: white; }
                .text-huellitas { color: #6f42c1; }
                .border-huellitas { border-color: #6f42c1 !important; }
            `}</style>
        </div>
    );
}