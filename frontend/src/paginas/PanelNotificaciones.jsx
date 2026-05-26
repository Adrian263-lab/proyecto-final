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
        } catch (error) {
            console.error("Error al marcar como leídas", error);
        }
    };

    const marcarLeidas = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            setNotificaciones([]);
            Swal.fire({
                title: '¡Hecho!',
                text: 'Notificaciones marcadas como leídas',
                icon: 'success',
                confirmButtonColor: '#6f42c1' // Personalizado con tu morado de marca
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
                {/* Unificado con la gama de colores y estilo de cabeceras de Huellitas */}
                <h2 className="text-huellitas fw-bold mb-0">🔔 Mis Notificaciones</h2>
                {notificaciones.length > 0 && (
                    <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={marcarLeidas}>
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {notificaciones.length === 0 ? (
                // Reemplazado por tu clase de badge suavizado y un diseño más limpio
                <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white text-muted">
                    No tienes notificaciones nuevas actualmente.
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notificaciones.map((n) => (
                        /* Sustituido list-group por tus card-huellitas para heredar la elevación y el borde inferior */
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