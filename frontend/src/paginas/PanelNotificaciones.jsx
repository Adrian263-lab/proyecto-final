import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function PanelNotificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    const cargarNotificaciones = async () => {
        try {
            const res = await api.get('/notificaciones');
            setNotificaciones(res.data);
        } catch (error) {
            console.error("Error al cargar notificaciones", error);
        }
    };

    const marcarLeidas = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            setNotificaciones([]);
            Swal.fire('¡Hecho!', 'Todas las notificaciones marcadas como leídas', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudieron marcar como leídas', 'error');
        }
    };

    useEffect(() => {
        cargarNotificaciones();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Mis Notificaciones</h2>
                {notificaciones.length > 0 && (
                    <button className="btn btn-outline-secondary btn-sm" onClick={marcarLeidas}>
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {notificaciones.length === 0 ? (
                <div className="alert alert-info text-center">No tienes notificaciones nuevas.</div>
            ) : (
                <div className="list-group">
                    {notificaciones.map((n) => (
                        <div key={n.id} className="list-group-item list-group-item-action shadow-sm border-0 mb-2 rounded-3 p-3">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 text-huellitas fw-bold">Nueva notificación</h5>
                                <small>{new Date(n.created_at).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-1">{n.data.mensaje}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}