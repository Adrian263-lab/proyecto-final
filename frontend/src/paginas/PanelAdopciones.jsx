import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelAdopciones
 * Interfaz administrativa para gestionar solicitudes de adopción pendientes.
 * Implementa control de estado asíncrono y actualizaciones optimistas del DOM.
 */
function PanelAdopciones() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);

    /**
     * Efecto de inicialización.
     * Recupera el listado de adopciones encoladas desde el servidor.
     */
    useEffect(() => {
        const cargarSolicitudes = async () => {
            try {
                const res = await api.get('/admin/adopciones/pendientes');
                setSolicitudes(res.data);
            } catch (error) {
                console.error("Fallo de red al obtener el listado de adopciones:", error);
                Swal.fire('Error', 'No se pudieron cargar las solicitudes pendientes.', 'error');
            } finally {
                setCargando(false);
            }
        };

        cargarSolicitudes();
    }, []);

    /**
     * Procesa la resolución de una solicitud de adopción.
     * @param {Object} solicitud - Instancia de la solicitud seleccionada.
     * @param {string} accion - Tipo de transacción ('aprobar' o 'rechazar').
     */
    const gestionarAdopcion = async (solicitud, accion) => {
        const endpoint = accion === 'aprobar' 
            ? `/admin/adopciones/aprobar/${solicitud.id}` 
            : `/admin/adopciones/rechazar/${solicitud.id}`;

        try {
            await api.put(endpoint);
            
            // Actualización optimista: se elimina el registro del array local 
            // ahorrando una petición HTTP de recarga y mejorando la fluidez de la UI.
            setSolicitudes(prev => prev.filter(s => s.id !== solicitud.id));
            
            Swal.fire('¡Procesado!', `La solicitud ha sido ${accion}ada correctamente.`, 'success');
        } catch (error) {
            console.error(`Error transaccional al intentar ${accion} la solicitud:`, error);
            Swal.fire('Error', 'El servidor no pudo procesar la acción solicitada.', 'error');
        }
    };

    // Bloqueo de renderizado durante la hidratación de datos
    if (cargando) {
        return (
            <div className="d-flex justify-content-center mt-5" aria-label="Cargando solicitudes pendientes">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark m-0">Gestión de Adopciones Pendientes</h2>
                <span className="badge bg-primary px-3 py-2 rounded-pill fs-6 shadow-sm">
                    {solicitudes.length} Pendientes
                </span>
            </div>
            
            <div className="table-responsive bg-white shadow-sm border-0 rounded-4">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" className="px-4 py-3">Animal</th>
                            <th scope="col" className="py-3">Usuario Solicitante</th>
                            <th scope="col" className="py-3">Motivo Declarado</th>
                            <th scope="col" className="px-4 py-3 text-end">Acciones de Resolución</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    No hay solicitudes de adopción pendientes en la cola.
                                </td>
                            </tr>
                        ) : (
                            solicitudes.map(sol => (
                                <tr key={sol.id}>
                                    <td className="px-4 py-3 fw-semibold text-primary">{sol.animal?.nombre || 'Desconocido'}</td>
                                    <td className="py-3 text-secondary">{sol.user?.name || 'Usuario eliminado'}</td>
                                    <td className="py-3">
                                        <p className="text-muted m-0 small text-truncate" style={{ maxWidth: '300px' }} title={sol.motivo}>
                                            {sol.motivo}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <button 
                                            className="btn btn-success btn-sm me-2 rounded-pill px-3 shadow-sm fw-bold" 
                                            onClick={() => gestionarAdopcion(sol, 'aprobar')}
                                            aria-label={`Aprobar solicitud de ${sol.user?.name}`}
                                        >
                                            <i className="bi bi-check-lg me-1"></i> Aprobar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm rounded-pill px-3 shadow-sm fw-bold" 
                                            onClick={() => gestionarAdopcion(sol, 'rechazar')}
                                            aria-label={`Rechazar solicitud de ${sol.user?.name}`}
                                        >
                                            <i className="bi bi-x-lg me-1"></i> Rechazar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PanelAdopciones;