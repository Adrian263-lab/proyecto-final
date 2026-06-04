import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import GestionLogo from '../componentes/GestionLogo';
import Swal from 'sweetalert2';
import PanelRecaudacion from './PanelRecaudacion'; 

/**
 * Componente principal del panel de gestion para las entidades protectoras.
 * Centraliza la administracion del perfil, catalogo de animales, eventos institucionales,
 * resolucion de solicitudes de adopcion y visualizacion de graficos de recaudacion analitica.
 */
export default function PanelProtectora() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState('perfil');
    const [datos, setDatos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        if (seccion === 'animales') {
            cargarAnimales();
        } else if (seccion === 'eventos') {
            cargarEventos();
        } else if (seccion === 'adopciones') {
            cargarSolicitudes();
        }
        
        api.get('/notificaciones')
            .then(res => setNotificaciones(res.data))
            .catch(console.error);
    }, [seccion]);

    const cargarAnimales = () => {
        api.get('/mis-animales')
            .then(res => setDatos(res.data))
            .catch(console.error);
    };

    const cargarEventos = () => {
        api.get('/mis-eventos')
            .then(res => setEventos(res.data))
            .catch(console.error);
    };

    const cargarSolicitudes = () => {
        api.get('/protectora/solicitudes')
            .then(res => {
                /** Asegura el almacenamiento de la coleccion JSON indexada por el backend */
                setSolicitudes(Array.isArray(res.data) ? res.data : []);
            })
            .catch(console.error);
            
        api.post('/notificaciones/marcar-leidas')
            .then(() => setNotificaciones([]))
            .catch(console.error);
    };

    /**
     * Despliega un cuadro de dialogo modal interactivo con el informe detallado del adoptante.
     * @param {Object} s Objeto de solicitud de adopcion con relaciones inyectadas.
     */
    const verInforme = (s) => {
        const horas = (s.horas_solo != null) ? `${s.horas_solo}h` : '0h';
        Swal.fire({
            title: `Informe: ${s.animal?.nombre || 'Animal'}`,
            html: `
                <div class="text-start p-3" style="font-size: 0.95rem;">
                    <p><b>Adoptante:</b> ${s.user?.name || 'Anonimo'}</p>
                    <p><b>Telefono:</b> ${s.telefono || 'No indicado'}</p>
                    <hr>
                    <p><b>Vivienda:</b> ${s.tipo_vivienda || 'No indicado'}</p>
                    <p><b>Otras mascotas:</b> ${s.otras_mascotas || 'Ninguna'}</p>
                    <p><b>Horas solo:</b> ${horas}</p>
                    <p><b>Experiencia:</b> ${s.experiencia || 'Sin especificar'}</p>
                    <hr>
                    <p><b>Motivo:</b><br/><i>${s.motivo || 'Sin motivo'}</i></p>
                </div>`,
            confirmButtonColor: '#6f42c1'
        });
    };

    /**
     * Resuelve de forma transaccional una solicitud de adopcion (Aprobacion / Rechazo).
     * @param {number} id Identificador unico de la adopcion.
     * @param {string} accion Cadena semantica de accion ('aprobar' o 'rechazar').
     */
    const gestionarAdopcion = async (id, accion) => {
        try {
            /** * 🔄 CORRECCIÓN DEL ENDPOINT ASÍNCRONO:
             * Se adapta la estructura de la URL mapeada para que coincida exactamente con las rutas nativas 
             * del backend de Laravel, evitando disparar errores 404 o 405 en el servidor.
             */
            if (accion === 'aprobar') {
                await api.put(`/protectora/adopciones/${id}/aprobar`);
            } else if (accion === 'rechazar') {
                await api.put(`/protectora/adopciones/${id}/rechazar`);
            }
            
            Swal.fire('Procesado', `Solicitud tramitada correctamente`, 'success');
            cargarSolicitudes();
        } catch (err) { 
            Swal.fire('Error', 'No se pudo procesar la solicitud de adopcion', 'error'); 
        }
    };

    /**
     * Remueve de forma logica o fisica un especimen del catalogo de la protectora previa confirmacion.
     * @param {number} id Identificador unico del animal.
     */
    const eliminarAnimal = (id) => {
        Swal.fire({ 
            title: '¿Desea eliminar el registro del animal?', 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#d33', 
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar' 
        }).then((res) => { 
            if (res.isConfirmed) {
                api.delete(`/animales/${id}`).then(cargarAnimales).catch(console.error); 
            }
        });
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                {/* Sidebar de Navegacion */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white text-center">
                        <img 
                            src={user?.logo_url || 'https://via.placeholder.com/100'} 
                            className="rounded-circle border border-3 shadow-sm mx-auto" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                            alt="Logo Corporativo" 
                        />
                        <h5 className="fw-bold mt-3">{user?.name}</h5>
                        <nav className="nav flex-column gap-2 text-start mt-3">
                            {['perfil', 'animales', 'eventos', 'adopciones', 'recaudacion'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setSeccion(s)} 
                                    className={`btn text-start rounded-pill position-relative ${seccion === s ? 'bg-huellitas text-white' : 'btn-light'}`}
                                >
                                    {s === 'perfil' ? '👤 Mi Perfil' 
                                     : s === 'animales' ? '🐾 Mis Animales' 
                                     : s === 'eventos' ? '📅 Mis Eventos' 
                                     : s === 'adopciones' ? '🐾 Solicitudes' 
                                     : '📊 Recaudacion'}
                                    
                                    {s === 'adopciones' && notificaciones.length > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {notificaciones.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenedor de Vistas Dinamicas */}
                <div className="col-md-9">
                    
                    {/* Seccion Perfil */}
                    {seccion === 'perfil' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
                            <h3 className="fw-bold text-huellitas mb-4">Configuración de la Entidad</h3>
                            
                            {/* Mantenemos el gestor del logo intacto */}
                            <GestionLogo />
                            
                            <hr className="my-4 opacity-25" />
                            
                            {/* 🚀 NUEVO: Redirección al formulario completo de perfil y mapa */}
                            <div className="d-flex flex-column align-items-center bg-light p-4 rounded-4 border">
                                <h5 className="fw-bold text-dark mb-2">Datos y Ubicación en el Mapa</h5>
                                <p className="text-muted text-center mb-4" style={{ maxWidth: '600px' }}>
                                    Modifica la información pública de tu entidad, los datos de contacto y ajusta tu ubicación exacta en el mapa interactivo para que los futuros adoptantes puedan encontraros fácilmente.
                                </p>
                                <button 
                                    onClick={() => navigate('/panel-protectora/editar-perfil')} 
                                    className="btn btn-huellitas text-white rounded-pill px-5 py-2 shadow-sm"
                                >
                                    ⚙️ Editar Perfil Completo
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Seccion Catalogo de Animales */}
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <div className="d-flex justify-content-between mb-4">
                                <h3 className="fw-bold text-huellitas">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill" onClick={() => navigate('/nuevo-animal')}>+ Nuevo Animal</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>
                                    {datos.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.nombre}</td>
                                            <td>{a.estado}</td>
                                            <td>
                                                <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary rounded-pill me-2">Editar</button>
                                                <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill">Borrar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Seccion Registro de Eventos */}
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <div className="d-flex justify-content-between mb-4">
                                <h3 className="fw-bold text-huellitas">Mis Eventos</h3>
                                <button className="btn btn-success rounded-pill" onClick={() => navigate('/nuevo-evento')}>+ Nuevo Evento</button>
                            </div>
                            <table className="table align-middle">
                                <thead><tr><th>Titulo</th><th>Fecha</th><th>Acciones</th></tr></thead>
                                <tbody>
                                    {eventos.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.titulo}</td>
                                            <td>{new Date(e.fecha).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => navigate(`/editar-evento/${e.id}`)} className="btn btn-sm btn-outline-primary rounded-pill">Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Seccion Expedientes de Adopcion */}
                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes Recibidas</h3>
                            <table className="table align-middle">
                                <thead><tr><th>Animal</th><th>Adoptante</th><th>Acciones</th></tr></thead>
                                <tbody>
                                    {solicitudes.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.animal?.nombre || 'Cargando...'}</td>
                                            <td>{s.user?.name || 'Anonimo'}</td>
                                            <td>
                                                <button onClick={() => verInforme(s)} className="btn btn-sm btn-info text-white rounded-pill me-2">Info</button>
                                                <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success rounded-pill me-2">Aprobar</button>
                                                <button onClick={() => gestionarAdopcion(s.id, 'rechazar')} className="btn btn-sm btn-danger rounded-pill">Rechazar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Analitica y Recaudacion */}
                    {seccion === 'recaudacion' && (
                        <PanelRecaudacion />
                    )}
                </div>
            </div>
        </div>
    );
}