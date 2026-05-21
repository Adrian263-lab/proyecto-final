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

    useEffect(() => {
        if (seccion === 'animales') cargarAnimales();
        else if (seccion === 'eventos') cargarEventos();
        else if (seccion === 'adopciones') cargarSolicitudes();
    }, [seccion]);

    const cargarAnimales = () => api.get('/mis-animales').then(res => setDatos(res.data)).catch(err => console.error(err));
    const cargarEventos = () => api.get('/mis-eventos').then(res => setEventos(res.data)).catch(err => console.error(err));
    const cargarSolicitudes = () => api.get('/protectora/solicitudes').then(res => setSolicitudes(res.data)).catch(err => console.error(err));

    const verInforme = (s) => {
        Swal.fire({
            title: `Informe: ${s.animal.nombre}`,
            html: `<div class="text-start p-3">
                    <p><b>Adoptante:</b> ${s.user.name}</p>
                    <p><b>Vivienda:</b> ${s.tipo_vivienda} (Jardín: ${s.tiene_jardin ? 'Sí' : 'No'})</p>
                    <p><b>Horas solo:</b> ${s.horas_solo}h</p>
                    <p><b>Otras mascotas:</b> ${s.otras_mascotas}</p>
                    <p><b>Motivo:</b> ${s.motivo}</p>
                </div>`,
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'Cerrar'
        });
    };

    const actualizarPerfil = async (e) => {
        e.preventDefault();
        try {
            await api.put('/perfil/update', { name: e.target.name.value });
            setUser({ ...user, name: e.target.name.value });
            Swal.fire('Guardado', 'Perfil actualizado', 'success');
        } catch (err) { Swal.fire('Error', 'No se pudo guardar', 'error'); }
    };

    const gestionarAdopcion = async (id, accion) => {
        try {
            await api.put(`/protectora/adopciones/${accion}/${id}`);
            Swal.fire('¡Procesado!', `Solicitud ${accion}ada correctamente`, 'success');
            cargarSolicitudes();
        } catch (error) { Swal.fire('Error', 'No se pudo procesar', 'error'); }
    };

    const eliminarAnimal = (id) => {
        Swal.fire({ title: '¿Estás seguro?', text: "No se puede deshacer", icon: 'warning', showCancelButton: true, confirmButtonColor: '#6f42c1', confirmButtonText: 'Sí, borrar' })
            .then((result) => { if (result.isConfirmed) api.delete(`/animales/${id}`).then(() => { cargarAnimales(); Swal.fire('Eliminado', '', 'success'); }); });
    };

    const revertirEstado = (id) => {
        Swal.fire({ title: '¿Marcar como disponible?', icon: 'question', showCancelButton: true, confirmButtonColor: '#f0ad4e', confirmButtonText: 'Sí, disponible' })
            .then((result) => { if (result.isConfirmed) api.put(`/animales/revertir/${id}`).then(() => { cargarAnimales(); Swal.fire('Actualizado', 'Animal disponible de nuevo', 'success'); }); });
    };

    const eliminarEvento = (id) => {
        Swal.fire({ title: '¿Eliminar evento?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#6f42c1', confirmButtonText: 'Sí' })
            .then((result) => { if (result.isConfirmed) api.delete(`/eventos/${id}`).then(() => { cargarEventos(); Swal.fire('Eliminado', '', 'success'); }); });
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 text-center rounded-4 bg-white">
                        <img src={user?.logo_url || 'https://via.placeholder.com/100?text=LOGO'} alt="Logo" className="rounded-circle border border-3 border-huellitas shadow-sm" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <h5 className="fw-bold mt-3 mb-1">{user?.name}</h5>
                        <span className="badge bg-success rounded-pill">Protectora Validada</span>
                        <hr />
                        <nav className="nav flex-column gap-2 text-start">
                            {['perfil', 'animales', 'eventos', 'adopciones'].map(s => (
                                <button key={s} onClick={() => setSeccion(s)} className={`btn text-start rounded-pill ${seccion === s ? 'btn-huellitas shadow-sm text-white' : 'btn-light'}`}>
                                    {s === 'perfil' ? '👤 Mi Perfil' : s === 'animales' ? '🐾 Mis Animales' : s === 'eventos' ? '📅 Mis Eventos' : '🐾 Solicitudes Adopción'}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="col-md-9">
                    {seccion === 'perfil' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <GestionLogo />
                            <h3 className="fw-bold text-huellitas mt-4 mb-3">Datos de la Protectora</h3>
                            <form onSubmit={actualizarPerfil}>
                                <label className="form-label fw-bold">Nombre de la Entidad</label>
                                <input type="text" name="name" className="form-control mb-3" defaultValue={user?.name} required />
                                <button type="submit" className="btn btn-huellitas text-white rounded-pill px-5 shadow-sm">Guardar Cambios</button>
                            </form>
                        </div>
                    )}

                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={() => navigate('/nuevo-animal')}>+ Nuevo Animal</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>{datos.map(a => (
                                    <tr key={a.id}><td>{a.nombre}</td><td>{a.estado}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary me-2 rounded-pill">Editar</button>
                                        {a.estado === 'Adoptado' && <button onClick={() => revertirEstado(a.id)} className="btn btn-sm btn-outline-warning me-2 rounded-pill">Revertir</button>}
                                        <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill">Borrar</button>
                                    </td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}
                    
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Eventos</h3>
                                <button className="btn btn-huellitas text-white rounded-pill px-4 shadow-sm" onClick={() => navigate('/nuevo-evento')}>+ Evento</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
                                <tbody>{eventos.map(e => (
                                    <tr key={e.id}><td>{e.titulo}</td><td>{e.fecha}</td>
                                    <td><button onClick={() => eliminarEvento(e.id)} className="btn btn-sm btn-outline-danger rounded-pill">Eliminar</button></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}

                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white animate__animated animate__fadeIn">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes de Adopción</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Animal</th><th>Usuario</th><th>Acciones</th></tr></thead>
                                <tbody>{solicitudes.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.animal.nombre}</td>
                                        <td>{s.user.name}</td>
                                        <td>
                                            <button onClick={() => verInforme(s)} className="btn btn-sm btn-info text-white me-2 rounded-pill">Ver Informe</button>
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
            <style>{`.btn-huellitas { background-color: #6f42c1; } .text-huellitas { color: #6f42c1; } .border-huellitas { border-color: #6f42c1 !important; }`}</style>
        </div>
    );
}