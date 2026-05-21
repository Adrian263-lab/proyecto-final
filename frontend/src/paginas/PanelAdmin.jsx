import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ AÑADIDO: Importamos Link para navegar
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
        <div className="container mt-5 animate__animated animate__fadeIn">
            {/* ✅ AÑADIDO: Contenedor flex para alinear el título y el botón */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0 fw-bold">Panel de Control: Administrador</h2>
                
                <Link to="/admin/usuarios" className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#6f42c1' }}>
                    <i className="bi bi-people-fill me-2"></i> Gestión de Usuarios
                </Link>
            </div>
            
            <hr />
            <h4 className="text-center text-muted mt-4">Solicitudes Pendientes</h4>
            
            {pendientes.length === 0 ? (
                <div className="alert alert-success text-center mt-4 rounded-4 shadow-sm">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    No hay protectoras esperando validación. ¡Todo al día!
                </div>
            ) : (
                <div className="table-responsive mt-4 shadow-sm rounded-4 border">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3 px-4">Nombre</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">CIF</th>
                                <th className="py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendientes.map(p => (
                                <tr key={p.id}>
                                    <td className="py-3 px-4 fw-semibold">{p.name}</td>
                                    <td className="py-3 text-secondary">{p.email}</td>
                                    <td className="py-3 text-secondary">{p.cif}</td>
                                    <td className="py-3 text-center">
                                        <button 
                                            className="btn btn-outline-success btn-sm rounded-pill px-3 me-2 fw-bold"
                                            onClick={() => validarProtectora(p.id)}
                                        >
                                            <i className="bi bi-check-lg me-1"></i> Validar
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold"
                                            onClick={() => rechazarProtectora(p.id)}
                                        >
                                            <i className="bi bi-x-lg me-1"></i> Rechazar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PanelAdmin;