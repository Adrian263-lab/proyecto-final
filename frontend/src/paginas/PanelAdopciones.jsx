import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function PanelAdopciones() {
    const [solicitudes, setSolicitudes] = useState([]);

    const cargarSolicitudes = async () => {
        try {
            const res = await api.get('/admin/adopciones/pendientes');
            setSolicitudes(res.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const gestionarAdopcion = (solicitud, accion) => {
        const url = accion === 'aprobar' 
            ? `/admin/adopciones/aprobar/${solicitud.id}` 
            : `/admin/adopciones/rechazar/${solicitud.id}`;

        api.put(url)
            .then(() => {
                Swal.fire('¡Hecho!', `Solicitud ${accion}ada correctamente`, 'success');
                cargarSolicitudes();
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
                            <th>Animal</th><th>Usuario</th><th>Motivo</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map(sol => (
                            <tr key={sol.id}>
                                <td>{sol.animal.nombre}</td>
                                <td>{sol.user.name}</td>
                                <td>{sol.motivo}</td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => gestionarAdopcion(sol, 'aprobar')}>Aprobar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => gestionarAdopcion(sol, 'rechazar')}>Rechazar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}