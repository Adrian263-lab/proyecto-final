import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelAdmin
 * Dashboard principal para administradores.
 * Gestiona el flujo de aprobación (validación o rechazo) de las protectoras recién registradas.
 */
function PanelAdmin() {
    const [pendientes, setPendientes] = useState([]);

    /**
     * Recupera el listado de protectoras con estado 'pendiente'.
     */
    const cargarPendientes = async () => {
        try {
            const res = await api.get('/admin/pendientes');
            setPendientes(res.data);
        } catch (error) {
            console.error("Error de red al obtener solicitudes pendientes:", error);
        }
    };

    // Inicialización de la vista
    useEffect(() => {
        cargarPendientes();
    }, []);

    /**
     * Aprueba la solicitud de una protectora, otorgándole acceso a la plataforma.
     * @param {number} id - Identificador de la protectora.
     */
    const validarProtectora = async (id) => {
        try {
            await api.put(`/admin/validar/${id}`);
            
            // Actualización optimista del DOM: se elimina el registro del array local 
            // para evitar una recarga completa desde el servidor.
            setPendientes(prev => prev.filter(p => p.id !== id));
            
            Swal.fire('Éxito', 'Protectora validada correctamente y notificada.', 'success');
        } catch (error) {
            console.error("Fallo al validar la protectora:", error);
            Swal.fire('Error', 'No se pudo procesar la validación en el servidor.', 'error');
        }
    };

    /**
     * Deniega y elimina el registro de una protectora previa confirmación de seguridad.
     * @param {number} id - Identificador de la protectora.
     */
    const rechazarProtectora = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Rechazar solicitud?',
            text: "Esta acción denegará el acceso y eliminará los datos de registro permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, rechazar y borrar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            try {
                await api.delete(`/admin/rechazar/${id}`);
                
                // Sincronización del estado local
                setPendientes(prev => prev.filter(p => p.id !== id));
                
                Swal.fire('Rechazado', 'La solicitud ha sido eliminada del sistema.', 'success');
            } catch (error) {
                console.error("Fallo al eliminar la solicitud:", error);
                Swal.fire('Error', 'No se pudo completar el rechazo de la solicitud.', 'error');
            }
        }
    };

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            {/* Cabecera del panel */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Panel Administrador</h2>
                <Link to="/admin/usuarios" className="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm">
                    Gestión General de Usuarios
                </Link>
            </div>

            {/* Tabla de revisión de cuentas */}
            <h4 className="text-secondary mb-3">Protectoras Pendientes de Validación</h4>
            
            <div className="table-responsive shadow-sm border-0 rounded-4 bg-white">
                <table className="table align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" className="px-4 py-3">Nombre</th>
                            <th scope="col" className="py-3">Email</th>
                            <th scope="col" className="py-3">CIF</th>
                            <th scope="col" className="px-4 py-3 text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendientes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    No hay solicitudes de protectoras pendientes de revisión en este momento.
                                </td>
                            </tr>
                        ) : (
                            pendientes.map(p => (
                                <tr key={p.id}>
                                    <td className="px-4 py-3 fw-semibold">{p.name}</td>
                                    <td className="py-3 text-secondary">{p.email}</td>
                                    <td className="py-3 text-secondary">{p.cif}</td>
                                    <td className="px-4 py-3 text-end">
                                        <button 
                                            className="btn btn-sm btn-success rounded-pill px-3 me-2 shadow-sm fw-bold" 
                                            onClick={() => validarProtectora(p.id)}
                                        >
                                            <i className="bi bi-check-lg me-1"></i> Aprobar
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm fw-bold" 
                                            onClick={() => rechazarProtectora(p.id)}
                                        >
                                            <i className="bi bi-x-lg me-1"></i> Denegar
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

export default PanelAdmin;