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
    const [solicitudes, setSolicitudes] = useState([]); // <--- NUEVO ESTADO PARA ADOPCIONES

    useEffect(() => {
        if (seccion === 'animales') {
            cargarAnimales();
        } else if (seccion === 'eventos') {
            cargarEventos();
        } else if (seccion === 'adopciones') {
            cargarSolicitudes(); // <--- LLAMADA A CARGAR ADOPCIONES
        }
    }, [seccion]);

    const cargarAnimales = () => {
        api.get('/mis-animales')
            .then(res => setDatos(res.data))
            .catch(err => console.error("Error:", err));
    };

    const cargarEventos = () => {
        api.get('/mis-eventos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error:", err));
    };

    // <--- NUEVA FUNCIÓN CARGAR SOLICITUDES
    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes')
            .then(res => setSolicitudes(res.data))
            .catch(err => console.error("Error:", err));
    };

    const eliminarAnimal = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'Sí, borrar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/animales/${id}`).then(() => {
                    Swal.fire('Eliminado', '', 'success');
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
            confirmButtonText: 'Sí'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/eventos/${id}`).then(() => {
                    cargarEventos();
                });
            }
        });
    };

    // <--- NUEVA FUNCIÓN GESTIONAR ADOPCIONES
    const gestionarAdopcion = async (id, accion) => {
        try {
            await api.put(`/protectora/adopciones/${accion}/${id}`);
            Swal.fire('¡Éxito!', `Solicitud ${accion}ada`, 'success');
            cargarSolicitudes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 text-center rounded-4 bg-white">
                        <img src={user?.logo_url || 'https://via.placeholder.com/100'} className="rounded-circle border border-3 border-huellitas" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <h5 className="fw-bold mt-3">{user?.name}</h5>
                        <nav className="nav flex-column gap-2 text-start mt-3">
                            <button onClick={() => setSeccion('perfil')} className={`btn text-start rounded-pill ${seccion === 'perfil' ? 'btn-huellitas text-white' : 'btn-light'}`}>👤 Mi Perfil</button>
                            <button onClick={() => setSeccion('animales')} className={`btn text-start rounded-pill ${seccion === 'animales' ? 'btn-huellitas text-white' : 'btn-light'}`}>🐾 Mis Animales</button>
                            <button onClick={() => setSeccion('eventos')} className={`btn text-start rounded-pill ${seccion === 'eventos' ? 'btn-huellitas text-white' : 'btn-light'}`}>📅 Mis Eventos</button>
                            <button onClick={() => setSeccion('adopciones')} className={`btn text-start rounded-pill ${seccion === 'adopciones' ? 'btn-huellitas text-white' : 'btn-light'}`}>🐾 Solicitudes Adopción</button>
                        </nav>
                    </div>
                </div>

                <div className="col-md-9">
                    {/* SECCIÓN ADOPCIONES */}
                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes Recibidas</h3>
                            <table className="table">
                                <thead><tr><th>Animal</th><th>Usuario</th><th>Acciones</th></tr></thead>
                                <tbody>
                                    {solicitudes.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.animal.nombre}</td>
                                            <td>{s.user.name}</td>
                                            <td>
                                                <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success me-2">Aprobar</button>
                                                <button onClick={() => gestionarAdopcion(s.id, 'rechazar')} className="btn btn-sm btn-danger">Rechazar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* ... (aquí mantendrías tus secciones de perfil, animales y eventos) ... */}
                </div>
            </div>
            <style>{`.btn-huellitas { background-color: #6f42c1; } .text-huellitas { color: #6f42c1; }`}</style>
        </div>
    );
}