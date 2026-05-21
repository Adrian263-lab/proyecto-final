import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

const PanelAdmin = () => {
    const [pendientes, setPendientes] = useState([]);
    const [adopciones, setAdopciones] = useState([]);

    const cargarDatos = async () => {
        try {
            const [resProt, resAdop] = await Promise.all([
                api.get('/admin/pendientes'),
                api.get('/admin/adopciones/pendientes')
            ]);
            setPendientes(resProt.data);
            setAdopciones(resAdop.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // --- ACCIONES PROTECTORAS ---
    const validarProtectora = async (id) => {
        try {
            await api.put(`/admin/validar/${id}`);
            Swal.fire('Éxito', 'Protectora validada', 'success');
            cargarDatos();
        } catch (error) { Swal.fire('Error', 'No se pudo validar', 'error'); }
    };

    const rechazarProtectora = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará la solicitud.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, rechazar'
        });
        
        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/rechazar/${id}`);
                cargarDatos();
            } catch (error) { Swal.fire('Error', 'No se pudo rechazar', 'error'); }
        }
    };

    // --- ACCIONES ADOPCIONES ---
    const verCuestionario = (adopcion) => {
        Swal.fire({
            title: `Adopción de ${adopcion.animal?.nombre || 'Desconocido'}`,
            html: `
                <div class="text-start">
                    <p><b>Usuario:</b> ${adopcion.user?.name || 'N/A'}</p>
                    <p><b>Vivienda:</b> ${adopcion.tipo_vivienda} (Jardín: ${adopcion.tiene_jardin ? 'Sí' : 'No'})</p>
                    <p><b>Horas solo:</b> ${adopcion.horas_solo} horas</p>
                    <p><b>Otras mascotas:</b> ${adopcion.otras_mascotas}</p>
                    <p><b>Motivo:</b> ${adopcion.motivo}</p>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Rechazar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#dc3545'
        }).then(async (result) => {
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel) {
                const accion = result.isConfirmed ? 'aprobar' : 'rechazar';
                try {
                    await api.put(`/admin/adopciones/${accion}/${adopcion.id}`);
                    Swal.fire('¡Procesado!', `Adopción ${accion}ada.`, 'success');
                    cargarDatos();
                } catch (e) { Swal.fire('Error', 'Fallo al procesar.', 'error'); }
            }
        });
    };

    return (
        <div className="container mt-5 animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Panel Administrador</h2>
                <Link to="/admin/usuarios" className="btn btn-outline-dark rounded-pill px-4">Gestión Usuarios</Link>
            </div>
            
            {/* TABLA PROTECTORAS */}
            <h4 className="text-secondary mb-3">Protectoras Pendientes</h4>
            <div className="table-responsive shadow-sm border rounded-4 bg-white mb-5">
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr><th>Nombre</th><th>Email</th><th>CIF</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {pendientes.length === 0 ? <tr><td colSpan="4" className="text-center py-4">Sin solicitudes.</td></tr> : 
                         pendientes.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td><td>{p.email}</td><td>{p.cif}</td>
                                <td>
                                    <button className="btn btn-sm btn-success me-2" onClick={() => validarProtectora(p.id)}>Validar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => rechazarProtectora(p.id)}>Rechazar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TABLA ADOPCIONES */}
            <h4 className="text-secondary mb-3">Solicitudes de Adopción</h4>
            <div className="table-responsive shadow-sm border rounded-4 bg-white mb-5">
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr><th>Animal</th><th>Usuario</th><th>Fecha</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {adopciones.length === 0 ? <tr><td colSpan="4" className="text-center py-4">Sin solicitudes pendientes.</td></tr> : 
                         adopciones.map(adop => (
                            <tr key={adop.id}>
                                <td className="fw-bold">{adop.animal?.nombre}</td>
                                <td>{adop.user?.name}</td>
                                <td>{new Date(adop.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => verCuestionario(adop)}>Revisar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PanelAdmin;