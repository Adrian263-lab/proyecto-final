import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexto/AuthContext';
import GestionLogo from '../componentes/GestionLogo';
import Swal from 'sweetalert2';
import PanelRecaudacion from './PanelRecaudacion'; 

/**
 * Componente PanelProtectora
 * Dashboard principal para entidades protectoras.
 * Centraliza la gestión de perfil, inventario de animales, eventos, 
 * adopciones y visualización de métricas de recaudación.
 */
function PanelProtectora() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Estados de navegación interna y colecciones de datos
    const [seccion, setSeccion] = useState('perfil');
    const [datos, setDatos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [notificaciones, setNotificaciones] = useState([]);

    /**
     * Efecto controlador de enrutamiento virtual.
     * Carga los datos correspondientes según la pestaña activa.
     */
    useEffect(() => {
        const inicializarSeccion = async () => {
            if (seccion === 'animales') await cargarAnimales();
            else if (seccion === 'eventos') await cargarEventos();
            else if (seccion === 'adopciones') await cargarSolicitudes();
            
            try {
                const res = await api.get('/notificaciones');
                setNotificaciones(res.data);
            } catch (error) {
                console.error("Error al sincronizar notificaciones:", error);
            }
        };

        inicializarSeccion();
    }, [seccion]);

    const cargarAnimales = async () => {
        try {
            const res = await api.get('/mis-animales');
            setDatos(res.data);
        } catch (error) {
            console.error("Fallo de red al obtener el catálogo de animales:", error);
        }
    };

    const cargarEventos = async () => {
        try {
            const res = await api.get('/mis-eventos');
            setEventos(res.data);
        } catch (error) {
            console.error("Fallo de red al obtener eventos:", error);
        }
    };

    const cargarSolicitudes = async () => {
        try {
            // Ejecución paralela para optimización de tiempos de respuesta
            const [resSolicitudes] = await Promise.all([
                api.get('/protectora/solicitudes'),
                api.post('/notificaciones/marcar-leidas')
            ]);
            
            setSolicitudes(Array.isArray(resSolicitudes.data) ? resSolicitudes.data : []);
            setNotificaciones([]); // Sincronización del estado local tras lectura
        } catch (error) {
            console.error("Fallo transaccional al cargar solicitudes:", error);
        }
    };

    /**
     * Despliega un modal interactivo con el informe detallado del adoptante.
     * @param {Object} s - Objeto de solicitud con relaciones inyectadas.
     */
    const verInforme = (s) => {
        const horas = (s.horas_solo != null) ? `${s.horas_solo}h` : '0h';
        Swal.fire({
            title: `Informe: ${s.animal?.nombre || 'Animal'}`,
            html: `
                <div class="text-start p-3" style="font-size: 0.95rem;">
                    <p><b>Adoptante:</b> ${s.user?.name || 'Anónimo'}</p>
                    <p><b>Teléfono:</b> ${s.telefono || 'No indicado'}</p>
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
     * Resuelve una solicitud de adopción de forma transaccional.
     * @param {number} id - Identificador de la solicitud.
     * @param {string} accion - Operación solicitada ('aprobar' o 'rechazar').
     */
    const gestionarAdopcion = async (id, accion) => {
        try {
            const endpoint = accion === 'aprobar' 
                ? `/protectora/adopciones/${id}/aprobar` 
                : `/protectora/adopciones/${id}/rechazar`;
                
            await api.put(endpoint);
            
            // Actualización optimista de la UI
            setSolicitudes(prev => prev.filter(s => s.id !== id));
            Swal.fire('Procesado', `Solicitud tramitada correctamente`, 'success');
        } catch (error) { 
            console.error(`Error al procesar adopción (${accion}):`, error);
            Swal.fire('Error', 'No se pudo procesar la solicitud de adopción', 'error'); 
        }
    };

    /**
     * Ejecuta el borrado del registro de un animal previa confirmación.
     * @param {number} id - Identificador único del animal.
     */
    const eliminarAnimal = async (id) => {
        const confirmacion = await Swal.fire({ 
            title: '¿Desea eliminar el registro del animal?', 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#d33', 
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar' 
        });

        if (confirmacion.isConfirmed) {
            try {
                await api.delete(`/animales/${id}`);
                // Actualización optimista para evitar recargas desde servidor
                setDatos(prev => prev.filter(a => a.id !== id));
                Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
            } catch (error) {
                console.error("Error al ejecutar eliminación de animal:", error);
                Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
            }
        }
    };

    return (
        <div className="container mt-5 mb-5 animate__animated animate__fadeIn">
            <div className="row">
                {/* Sidebar de Navegación Estática */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white text-center">
                        <img 
                            src={user?.logo_url || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&auto=format&fit=crop'} 
                            className="rounded-circle border border-3 shadow-sm mx-auto" 
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                            alt="Logo Corporativo de la Protectora" 
                        />
                        <h5 className="fw-bold mt-3">{user?.name}</h5>
                        
                        <nav className="nav flex-column gap-2 text-start mt-3" aria-label="Menú de administración">
                            {['perfil', 'animales', 'eventos', 'adopciones', 'recaudacion'].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setSeccion(s)} 
                                    className={`btn text-start rounded-pill position-relative fw-semibold transition-hover ${seccion === s ? 'bg-huellitas text-white shadow-sm' : 'btn-light text-secondary'}`}
                                    aria-current={seccion === s ? 'page' : undefined}
                                >
                                    {s === 'perfil' ? '👤 Mi Perfil' 
                                     : s === 'animales' ? '🐾 Mis Animales' 
                                     : s === 'eventos' ? '📅 Mis Eventos' 
                                     : s === 'adopciones' ? '📩 Solicitudes' 
                                     : '📊 Recaudación'}
                                    
                                    {s === 'adopciones' && notificaciones.length > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                                            {notificaciones.length}
                                            <span className="visually-hidden">notificaciones no leídas</span>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenedor de Vistas Dinámicas (Virtual Routing) */}
                <div className="col-md-9">
                    
                    {/* Panel: Configuración de Perfil */}
                    {seccion === 'perfil' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white">
                            <h3 className="fw-bold text-huellitas mb-4">Configuración de la Entidad</h3>
                            
                            <GestionLogo />
                            
                            <hr className="my-4 opacity-25" />
                            
                            <div className="d-flex flex-column align-items-center bg-light p-4 rounded-4 border">
                                <h5 className="fw-bold text-dark mb-2">Datos y Ubicación en el Mapa</h5>
                                <p className="text-muted text-center mb-4" style={{ maxWidth: '600px' }}>
                                    Modifica la información pública de tu entidad, los datos de contacto y ajusta tu ubicación exacta en el mapa interactivo para que los futuros adoptantes puedan encontraros fácilmente.
                                </p>
                                <button 
                                    onClick={() => navigate('/panel-protectora/editar-perfil')} 
                                    className="btn btn-huellitas text-white rounded-pill px-5 py-2 shadow-sm fw-bold"
                                >
                                    ⚙️ Editar Perfil Completo
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Panel: Inventario de Animales */}
                    {seccion === 'animales' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Animales</h3>
                                <button className="btn btn-success rounded-pill fw-bold shadow-sm" onClick={() => navigate('/nuevo-animal')}>+ Nuevo Animal</button>
                            </div>
                            <table className="table align-middle table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col" className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.length === 0 ? (
                                        <tr><td colSpan="3" className="text-center py-4 text-muted">No tienes animales registrados.</td></tr>
                                    ) : (
                                        datos.map(a => (
                                            <tr key={a.id}>
                                                <td className="fw-semibold">{a.nombre}</td>
                                                <td><span className={`badge rounded-pill ${a.estado === 'Adoptado' ? 'bg-success' : 'bg-primary'}`}>{a.estado}</span></td>
                                                <td className="text-end">
                                                    <button onClick={() => navigate(`/editar-animal/${a.id}`)} className="btn btn-sm btn-outline-primary rounded-pill me-2 fw-bold">Editar</button>
                                                    <button onClick={() => eliminarAnimal(a.id)} className="btn btn-sm btn-outline-danger rounded-pill fw-bold">Borrar</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Panel: Registro de Eventos */}
                    {seccion === 'eventos' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold text-huellitas m-0">Mis Eventos</h3>
                                <button className="btn btn-success rounded-pill fw-bold shadow-sm" onClick={() => navigate('/nuevo-evento')}>+ Nuevo Evento</button>
                            </div>
                            <table className="table align-middle table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Título</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col" className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventos.length === 0 ? (
                                        <tr><td colSpan="3" className="text-center py-4 text-muted">No hay eventos planificados.</td></tr>
                                    ) : (
                                        eventos.map(e => (
                                            <tr key={e.id}>
                                                <td className="fw-semibold">{e.titulo}</td>
                                                <td className="text-secondary">{new Date(e.fecha).toLocaleDateString()}</td>
                                                <td className="text-end">
                                                    <button onClick={() => navigate(`/editar-evento/${e.id}`)} className="btn btn-sm btn-outline-primary rounded-pill fw-bold">Editar</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Panel: Expedientes de Adopción */}
                    {seccion === 'adopciones' && (
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-white table-responsive">
                            <h3 className="fw-bold text-huellitas mb-4">Solicitudes Recibidas</h3>
                            <table className="table align-middle table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Animal</th>
                                        <th scope="col">Adoptante</th>
                                        <th scope="col" className="text-end">Acciones operativas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.length === 0 ? (
                                        <tr><td colSpan="3" className="text-center py-4 text-muted">Bandeja de solicitudes vacía.</td></tr>
                                    ) : (
                                        solicitudes.map(s => (
                                            <tr key={s.id}>
                                                <td className="fw-semibold text-primary">{s.animal?.nombre || 'Desconocido'}</td>
                                                <td className="text-secondary">{s.user?.name || 'Anónimo'}</td>
                                                <td className="text-end">
                                                    <button onClick={() => verInforme(s)} className="btn btn-sm btn-info text-white rounded-pill me-2 fw-bold shadow-sm">Info</button>
                                                    <button onClick={() => gestionarAdopcion(s.id, 'aprobar')} className="btn btn-sm btn-success rounded-pill me-2 fw-bold shadow-sm">Aprobar</button>
                                                    <button onClick={() => gestionarAdopcion(s.id, 'rechazar')} className="btn btn-sm btn-danger rounded-pill fw-bold shadow-sm">Rechazar</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Panel: Analítica y Recaudación */}
                    {seccion === 'recaudacion' && (
                        <PanelRecaudacion />
                    )}
                </div>
            </div>
        </div>
    );
}

export default PanelProtectora;