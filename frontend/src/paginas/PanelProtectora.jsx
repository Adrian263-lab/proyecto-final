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

    useEffect(() => {
        if (seccion === 'animales') cargarAnimales();
        else if (seccion === 'eventos') cargarEventos();
        else if (seccion === 'adopciones') cargarSolicitudes();
        
        api.get('/notificaciones').then(res => setNotificaciones(res.data)).catch(() => {});
    }, [seccion]);

    const cargarAnimales = () => api.get('/mis-animales').then(res => setDatos(res.data)).catch(console.error);
    const cargarEventos = () => api.get('/mis-eventos').then(res => setEventos(res.data)).catch(console.error);
    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes').then(res => setSolicitudes(res.data)).catch(console.error);
        api.post('/notificaciones/marcar-leidas').then(() => setNotificaciones([]));
    };

    const verInforme = (s) => {
        Swal.fire({
            title: `Informe: ${s.animal?.nombre || 'Animal'}`,
            html: `
                <div class="text-start p-3">
                    <p><b>Adoptante:</b> ${s.user?.name}</p>
                    <p><b>Teléfono:</b> ${s.telefono || 'No indicado'}</p>
                    <hr>
                    <p><b>Vivienda:</b> ${s.tipo_vivienda}</p>
                    <p><b>Otras mascotas:</b> ${s.otras_mascotas || 'Ninguna'}</p>
                    <p><b>Horas solo:</b> ${s.tiempo_solo}h</p>
                    <p><b>Experiencia:</b> ${s.experiencia_previa || 'Sin especificar'}</p>
                    <hr>
                    <p><b>Motivo:</b><br/><i>${s.motivo}</i></p>
                </div>`,
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'Cerrar'
        });
    };

    const gestionarAdopcion = async (id, accion) => {
        try {
            await api.put(`/protectora/adopciones/${accion}/${id}`);
            Swal.fire('¡Procesado!', `Solicitud ${accion}ada correctamente`, 'success');
            cargarSolicitudes();
        } catch (err) { Swal.fire('Error', 'No se pudo procesar', 'error'); }
    };

    const eliminarAnimal = (id) => {
        Swal.fire({ title: '¿Borrar animal?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, borrar' })
            .then((res) => { if (res.isConfirmed) api.delete(`/animales/${id}`).then(cargarAnimales); });
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white text-center">
                        <img src={user?.logo_url || 'https://via.placeholder.com/100'} className="rounded-circle border border-3 border-huellitas shadow-sm mx-auto" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <h5 className="fw-bold mt-3">{user?.name}</h5>
                        <span className="badge bg-success rounded-pill mb-3">Protectora Validada</span>
                        <nav className="nav flex-column gap-2 text-start">
                            {['perfil', 'animales', 'eventos', 'adopciones'].map(s => (
                                <button key={s} onClick={() => setSeccion(s)} className={`btn text-start rounded-pill position-relative ${seccion === s ? 'btn-huellitas text-white' : 'btn-light'}`}>
                                    {s === 'perfil' ? '👤 Mi Perfil' : s === 'animales' ? '🐾 Mis Animales' : s === 'eventos' ? '📅 Mis Eventos' : '🐾 Solicitudes'}
                                    {s === 'adopciones' && notificaciones.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{notificaciones.length}</span>}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="col-md-9">
                    {seccion === 'perfil' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
                            <GestionLogo />
                            <form onSubmit={(e) => { e.preventDefault(); api.put('/perfil/update', { name: e.target.name.value }).then(() => Swal.fire('Guardado', '', 'success')); }}>
                                <label className="form-label fw-bold">Nombre Entidad</label>
                                <input type="text" name="name" className="form-control mb-3" defaultValue={user?.name} required />
                                <button type="submit" className="btn btn-huellitas text-white rounded-pill px-5">Guardar</button>
                            </form>
                        </div>
                    )}
                    
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <div className="d-flex justify-content-between mb-4">
                                <h3 className="fw-bold text-huellitas">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill" onClick={() => navigate('/nuevo-animal')}>+ Nuevo</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>{datos.map(a => (
                                    <tr key={a.id}><td>{a.nombre}</td><td>{a.estado}</td>
                                    <td>
                                        <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary rounded-pill me-2">Editar</button>
                                        <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill">Borrar</button>
                                    </td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}

                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Animal</th><th>Adoptante</th><th>Acciones</th></tr></thead>
                                <tbody>{solicitudes.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.animal?.nombre}</td>
                                        <td>{s.user?.name}</td>
                                        <td>
                                            <button onClick={() => verInforme(s)} className="btn btn-sm btn-info text-white rounded-pill me-2">Info</button>
                                            <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success rounded-pill">Aprobar</button>
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