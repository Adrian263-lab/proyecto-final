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
    const cargarEventos = () => api.get('/mis-eventos').then(res => {
        console.log("Eventos cargados:", res.data); // Para depurar
        setEventos(res.data);
    }).catch(console.error);

    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes').then(res => setSolicitudes(res.data)).catch(console.error);
        api.post('/notificaciones/marcar-leidas').then(() => setNotificaciones([]));
    };

    const verInforme = (s) => {
        Swal.fire({
            title: `Informe: ${s.animal?.nombre || 'Animal'}`,
            html: `<div class="text-start p-3">...</div>`, // (Mantén tu lógica original aquí)
            confirmButtonColor: '#6f42c1'
        });
    };

    const gestionarAdopcion = async (id, accion) => {
        try {
            await api.put(`/protectora/adopciones/${accion}/${id}`);
            Swal.fire('¡Procesado!', `Solicitud ${accion}ada`, 'success');
            cargarSolicitudes();
        } catch (err) { Swal.fire('Error', 'No se pudo procesar', 'error'); }
    };

    const eliminarAnimal = (id) => {
        Swal.fire({ title: '¿Borrar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })
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
                        <nav className="nav flex-column gap-2 text-start">
                            {['perfil', 'animales', 'eventos', 'adopciones'].map(s => (
                                <button key={s} onClick={() => setSeccion(s)} className={`btn text-start rounded-pill ${seccion === s ? 'btn-huellitas text-white' : 'btn-light'}`}>
                                    {s === 'perfil' ? '👤 Mi Perfil' : s === 'animales' ? '🐾 Mis Animales' : s === 'eventos' ? '📅 Mis Eventos' : '🐾 Solicitudes'}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="col-md-9">
                    {/* ... (Secciones de perfil y animales igual que antes) ... */}

                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <h3 className="fw-bold text-huellitas mb-4">Mis Eventos</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
                                <tbody>{eventos.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.titulo}</td>
                                        <td>{new Date(e.fecha).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => navigate(`/editar-evento/${e.id}`)} className="btn btn-sm btn-outline-primary rounded-pill">Editar</button>
                                        </td>
                                    </tr>
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
                                            <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success rounded-pill me-2">Aprobar</button>
                                            <button onClick={() => gestionarAdopcion(s.id, 'rechazar')} className="btn btn-sm btn-danger rounded-pill">Rechazar</button>
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