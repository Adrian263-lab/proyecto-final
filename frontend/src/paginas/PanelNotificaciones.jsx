import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelNotificaciones: Lista y gestiona las notificaciones del usuario.
 * Marca automáticamente las notificaciones como leídas al acceder al panel.
 */
export default function PanelNotificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    /**
     * Recupera las notificaciones de la API y dispara la marcación de leídas automáticamente.
     */
    const cargarNotificaciones = async () => {
        try {
            const res = await api.get('/notificaciones');
            setNotificaciones(res.data);
            
            // Si hay elementos, se marcan como leídos automáticamente al entrar
            if (res.data.length > 0) {
                marcarLeidasSinAlerta();
            }
        } catch (error) {
            console.error("Error al cargar notificaciones", error);
        }
    };

    /**
     * Procesa la marcación de leídas sin disparar alertas para mejorar la UX.
     */
    const marcarLeidasSinAlerta = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
        } catch (error) {
            console.error("Error al marcar como leídas", error);
        }
    };

    /**
     * Acción manual para marcar todas las notificaciones como leídas con confirmación visual.
     */
    const marcarLeidas = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            setNotificaciones([]);
            Swal.fire({
                title: '¡Hecho!',
                text: 'Notificaciones marcadas como leídas',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron marcar como leídas',
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    useEffect(() => {
        cargarNotificaciones();
    }, []);

    return (
        <div className="container mt-5 mb-5 animate-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-huellitas fw-bold mb-0">🔔 Mis Notificaciones</h2>
                {notificaciones.length > 0 && (
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={marcarLeidas}>
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {notificaciones.length === 0 ? (
                <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white text-muted">
                    No tienes notificaciones nuevas actualmente.
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notificaciones.map((n) => (
                        <div key={n.id} className="card card-huellitas p-3 bg-white">
                            <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                                <h5 className="mb-0 text-huellitas fw-bold">
                                    {n.data.titulo || 'Nueva notificación'}
                                </h5>
                                <span className="badge badge-huellitas small">
                                    {new Date(n.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mb-0 text-secondary">{n.data.mensaje}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}