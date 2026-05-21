import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function PanelNotificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    const cargarNotificaciones = async () => {
        try {
            const res = await api.get('/notificaciones');
            setNotificaciones(res.data);
            
            // Si hay notificaciones, marcarlas como leídas automáticamente al entrar
            if (res.data.length > 0) {
                marcarLeidasSinAlerta();
            }
        } catch (error) {
            console.error("Error al cargar notificaciones", error);
        }
    };

    // Función interna para marcar como leídas sin mostrar el Swal (para que sea automático)
    const marcarLeidasSinAlerta = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            // No reseteamos el estado aquí para que el usuario pueda seguir viendo lo que leyó
        } catch (error) {
            console.error("Error al marcar como leídas", error);
        }
    };

    const marcarLeidas = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            setNotificaciones([]);
            Swal.fire('¡Hecho!', 'Notificaciones marcadas como leídas', 'success');
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
                        Limpiar lista
                    </button>
                )}
            </div>

            {notificaciones.length === 0 ? (
                <div className="alert alert-info text-center">No tienes notificaciones nuevas.</div>
            ) : (
                <div className="list-group">
                    {notificaciones.map((n) => (
                        <div key={n.id} className="list-group-item shadow-sm border-0 mb-2 rounded-3 p-3">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 text-huellitas fw-bold">
                                    {n.data.titulo || 'Nueva notificación'}
                                </h5>
                                <small className="text-muted">{new Date(n.created_at).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-1">{n.data.mensaje}</p>
                        </div>
                    ))}
                </div>
            )}
            <style>{`.text-huellitas { color: #6f42c1; }`}</style>
        </div>
    );
}