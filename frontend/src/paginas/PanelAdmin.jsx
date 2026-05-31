import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2'; 

const PanelAdmin = () => {
    const [pendientes, setPendientes] = useState([]);

    const cargarPendientes = async () => {
        try {
            const res = await api.get('/admin/pendientes');
            setPendientes(res.data);
        } catch (error) {
            console.error("Error al cargar protectoras pendientes:", error);
        }
    };

    useEffect(() => {
        cargarPendientes();
    }, []);

    const validarProtectora = async (id) => {
        try {
            await api.put(`/admin/validar/${id}`);
            Swal.fire('Éxito', 'Protectora validada correctamente', 'success');
            cargarPendientes();
        } catch (error) { 
            Swal.fire('Error', 'No se pudo validar la protectora', 'error'); 
        }
    };

    const rechazarProtectora = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará permanentemente la solicitud y todos sus datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, rechazar'
        });
        
        if (result.isConfirmed) {
            try {
                // LLAMADA POST PARA COINCIDIR CON LA RUTA Y EVITAR ERRORES DE MÉTODO
                await api.post(`/admin/rechazar/${id}`);
                Swal.fire('Rechazado', 'Solicitud eliminada correctamente', 'success');
                cargarPendientes();
            } catch (error) { 
                Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error'); 
                console.error(error);
            }
        }
    };

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Panel Administrador</h2>
                <Link to="/admin/usuarios" className="btn btn-outline-dark rounded-pill px-4">
                    Gestión Usuarios
                </Link>
            </div>
            
            <h4 className="text-secondary mb-3">Protectoras Pendientes de Validación</h4>
            <div className="table-responsive shadow-sm border rounded-4 bg-white">
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>CIF</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendientes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No hay protectoras pendientes.</td>
                            </tr>
                        ) : (
                            pendientes.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.email}</td>
                                    <td>{p.cif}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-success rounded-pill px-3 me-2" onClick={() => validarProtectora(p.id)}>
                                            Validar
                                        </button>
                                        <button className="btn btn-sm btn-danger rounded-pill px-3" onClick={() => rechazarProtectora(p.id)}>
                                            Rechazar
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
};

export default PanelAdmin;