import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelAdopciones: Interfaz administrativa para la gestión de solicitudes de adopción.
 * Permite listar solicitudes pendientes y realizar operaciones de aprobación o rechazo.
 */
export default function PanelAdopciones() {
    const [solicitudes, setSolicitudes] = useState([]);

    /**
     * Obtiene la lista de solicitudes de adopción pendientes desde el endpoint administrativo.
     */
    const cargarSolicitudes = async () => {
        try {
            const res = await api.get('/admin/adopciones/pendientes');
            setSolicitudes(res.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
        }
    };

    // Efecto de carga inicial
    useEffect(() => {
        cargarSolicitudes();
    }, []);

    /**
     * Gestiona la aprobación o rechazo de una solicitud.
     * @param {Object} solicitud - Objeto con los datos de la solicitud.
     * @param {string} accion - Acción a realizar ('aprobar' o 'rechazar').
     */
    const gestionarAdopcion = (solicitud, accion) => {
        const url = accion === 'aprobar' 
            ? `/admin/adopciones/aprobar/${solicitud.id}` 
            : `/admin/adopciones/rechazar/${solicitud.id}`;

        api.put(url)
            .then(() => {
                Swal.fire('¡Hecho!', `Solicitud ${accion}ada correctamente`, 'success');
                cargarSolicitudes(); // Recarga la tabla tras el cambio
            })
            .catch(() => Swal.fire('Error', 'No se pudo completar la acción', 'error'));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Gestión de Adopciones Pendientes</h2>
            <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Usuario</th>
                            <th>Motivo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map(sol => (
                            <tr key={sol.id}>
                                <td>{sol.animal.nombre}</td>
                                <td>{sol.user.name}</td>
                                <td>{sol.motivo}</td>
                                <td>
                                    <button 
                                        className="btn btn-success btn-sm me-2" 
                                        onClick={() => gestionarAdopcion(sol, 'aprobar')}
                                    >
                                        Aprobar
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => gestionarAdopcion(sol, 'rechazar')}
                                    >
                                        Rechazar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}