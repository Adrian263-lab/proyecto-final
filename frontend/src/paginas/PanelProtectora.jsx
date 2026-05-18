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
    const [eventos, setEventos] = useState([]); // <--- NUEVO ESTADO PARA EVENTOS

    // Cargar datos según la sección
    useEffect(() => {
        if (seccion === 'animales') {
            cargarAnimales();
        } else if (seccion === 'eventos') {
            cargarEventos(); // <--- LLAMADA A CARGAR EVENTOS
        }
    }, [seccion]);

    const cargarAnimales = () => {
        api.get('/mis-animales')
            .then(res => setDatos(res.data))
            .catch(err => console.error("Error cargando animales:", err));
    };

    // <--- NUEVA FUNCIÓN PARA CARGAR EVENTOS
    const cargarEventos = () => {
        api.get('/mis-eventos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error cargando eventos:", err));
    };

    const eliminarAnimal = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6f42c1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/animales/${id}`)
                    .then(() => {
                        Swal.fire('Eliminado', 'El animal ha sido borrado', 'success');
                        cargarAnimales();
                    })
                    .catch(() => Swal.fire('Error', 'No se pudo eliminar', 'error'));
            }
        });
    };

    // <--- NUEVA FUNCIÓN PARA ELIMINAR EVENTOS
    const eliminarEvento = (id) => {
        Swal.fire({
            title: '¿Eliminar evento?',
            text: "El evento desaparecerá del calendario de inicio",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6f42c1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/eventos/${id}`)
                    .then(() => {
                        Swal.fire('Eliminado', 'Evento borrado correctamente', 'success');
                        cargarEventos();
                    })
                    .catch(() => Swal.fire('Error', 'No se pudo eliminar el evento', 'error'));
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar (Sin cambios) */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 text-center rounded-4 bg-white">
                        <div className="mb-3 mt-2">
                            <img 
                                src={user?.logo_url || 'https://via.placeholder.com/100?text=LOGO'} 
                                alt="Logo" 
                                className="rounded-circle border border-3 border-huellitas shadow-sm"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <h5 className="fw-bold mt-3 mb-1">{user?.name}</h5>
                            <span className="badge bg-success rounded-pill">Protectora Validada</span>
                        </div>
                        <hr />
                        <nav className="nav flex-column gap-2 text-start">
                            <button onClick={() => setSeccion('perfil')} className={`btn text-start rounded-pill ${seccion === 'perfil' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>
                                👤 Mi Perfil
                            </button>
                            <button onClick={() => setSeccion('animales')} className={`btn text-start rounded-pill ${seccion === 'animales' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>
                                🐾 Mis Animales
                            </button>
                            <button onClick={() => setSeccion('eventos')} className={`btn text-start rounded-pill ${seccion === 'eventos' ? 'btn-huellitas shadow-sm' : 'btn-light'}`}>
                                📅 Mis Eventos
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Contenido dinámico */}
                <div className="col-md-9">
                    {/* SECCIÓN PERFIL (Tu código actual) */}
                    {seccion === 'perfil' && (
                        <div className="animate__animated animate__fadeIn">
                            <GestionLogo />
                            <div className="card shadow-sm border-0 p-4 mt-4 bg-white rounded-4">
                                <h3 className="fw-bold text-huellitas mb-4">Datos de la Protectora</h3>
                                <form className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Nombre de la Entidad</label>
                                        <input type="text" className="form-control" defaultValue={user?.name} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">CIF</label>
                                        <input type="text" className="form-control bg-light" defaultValue={user?.cif} disabled />
                                    </div>
                                    <div className="col-12 mt-4 text-end">
                                        <button type="submit" className="btn btn-huellitas px-5 rounded-pill shadow-sm">Guardar Cambios</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN ANIMALES (Tu código actual) */}
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 animate__animated animate__fadeIn bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Animales en Adopción</h3>
                                <button className="btn btn-success rounded-pill px-4 shadow-sm fw-bold" onClick={() => navigate('/nuevo-animal')}>
                                    + Nuevo Animal
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Animal</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datos.map(a => (
                                            <tr key={a.id}>
                                                <td className="fw-bold">{a.nombre}</td>
                                                <td><span className="badge bg-info text-white">{a.estado}</span></td>
                                                <td className="text-center">
                                                    <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary me-2 rounded-pill px-3">Editar</button>
                                                    <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3">Borrar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {/* SECCIÓN EVENTOS (LO QUE FALTABA) */}
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 animate__animated animate__fadeIn bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Eventos Próximos</h3>
                                <button 
                                    className="btn btn-huellitas rounded-pill px-4 shadow-sm fw-bold"
                                    onClick={() => navigate('/nuevo-evento')}
                                >
                                    📅 Publicar Evento
                                </button>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Evento</th>
                                            <th>Fecha</th>
                                            <th>Ubicación</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventos.length > 0 ? eventos.map(e => (
                                            <tr key={e.id}>
                                                <td className="fw-bold">{e.titulo}</td>
                                                <td>{new Date(e.fecha).toLocaleDateString()}</td>
                                                <td>{e.ubicacion}</td>
                                                <td className="text-center">
                                                    <button 
                                                        onClick={() => eliminarEvento(e.id)} 
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                    >
                                                        <i className="bi bi-trash"></i> Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">
                                                    No has publicado eventos todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
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