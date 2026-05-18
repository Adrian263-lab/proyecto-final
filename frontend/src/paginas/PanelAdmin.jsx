import { useEffect, useState } from 'react';
import api from '../api/axios';

const PanelAdmin = () => {
    const [pendientes, setPendientes] = useState([]);

    const cargarPendientes = async () => {
        try {
            const res = await api.get('/admin/pendientes');
            setPendientes(res.data);
        } catch (error) {
            console.error("Error al cargar protectoras:", error);
        }
    };

    useEffect(() => {
        cargarPendientes();
    }, []);

    const validarProtectora = async (id) => {
        try {
            await api.put(`/admin/validar/${id}`);
            alert("Protectora validada correctamente");
            cargarPendientes(); // Recargamos la lista
        } catch (error) {
            alert("Error al validar");
        }
    };

    const rechazarProtectora = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres rechazar y eliminar esta solicitud?")) {
            try {
                // Usamos DELETE porque una solicitud rechazada suele borrarse
                await api.delete(`/admin/rechazar/${id}`);
                alert("Solicitud eliminada");
                cargarPendientes();
            } catch (error) {
                alert("Error al eliminar la solicitud");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Panel de Control: Administrador</h2>
            <hr />
            <h4 className="text-center text-muted">Solicitudes Pendientes</h4>
            
            {pendientes.length === 0 ? (
                <p className="text-center mt-4">No hay protectoras esperando validación.</p>
            ) : (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>CIF</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendientes.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.email}</td>
                                <td>{p.cif}</td>
                                <td>
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => validarProtectora(p.id)}
                                    >
                                        Validar
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() => rechazarProtectora(p.id)}
                                    >
                                        Rechazar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PanelAdmin;