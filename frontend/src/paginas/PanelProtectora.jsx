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
        api.get('/protectora/solicitudes')
           .then(res => {
               // DEPURACIÓN: Si aquí en la consola no ves 'telefono', el backend no lo envía.
               console.log("Solicitudes cargadas:", res.data);
               setSolicitudes(res.data);
           })
           .catch(console.error);
        api.post('/notificaciones/marcar-leidas').then(() => setNotificaciones([]));
    };

    const verInforme = (s) => {
        // Protección contra undefined para evitar "undefinedh"
        const horasDisplay = (s.horas_solo != null) ? `${s.horas_solo}h` : '0h';
        
        Swal.fire({
            title: `Informe: ${s.animal?.nombre || 'Animal'}`,
            html: `
                <div class="text-start p-3" style="font-size: 0.95rem;">
                    <p><b>Adoptante:</b> ${s.user?.name || 'Anónimo'}</p>
                    <p><b>Teléfono:</b> ${s.telefono || 'No indicado'}</p>
                    <hr>
                    <p><b>Vivienda:</b> ${s.tipo_vivienda || 'No indicado'}</p>
                    <p><b>Otras mascotas:</b> ${s.otras_mascotas || 'Ninguna'}</p>
                    <p><b>Horas solo:</b> ${horasDisplay}</p>
                    <p><b>Experiencia:</b> ${s.experiencia || 'Sin especificar'}</p>
                    <hr>
                    <p><b>Motivo:</b><br/><i>${s.motivo || 'Sin motivo'}</i></p>
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
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white text-center">
                        <img src={user?.logo_url || 'https://via.placeholder.com/100'} className="rounded-circle border border-3 border-huellitas shadow-sm mx-auto" style={{ width: '80px', height: '80px', objectFit: 'cover' }} alt="Logo" />
                        <h5 className="fw-bold mt-3">{user?.name}</h5>
                        <nav className="nav flex-column gap-2 text-start">
                            {['perfil', 'animales', 'eventos', 'adopciones'].map(s => (
                                <button key={s} onClick={() => setSeccion(s)} className={`btn text-start rounded-pill ${seccion === s ? 'bg-huellitas text-white' : 'btn-light'}`}>
                                    {s === 'perfil' ? '👤 Mi Perfil' : s === 'animales' ? '🐾 Mis Animales' : s === 'eventos' ? '📅 Mis Eventos' : '🐾 Solicitudes'}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="col-md-9">
                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Animal</th><th>Adoptante</th><th>Acciones</th></tr></thead>
                                <tbody>{solicitudes.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.animal?.nombre || 'Animal'}</td>
                                        <td>{s.user?.name || 'Usuario'}</td>
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
        </div>
    );
}