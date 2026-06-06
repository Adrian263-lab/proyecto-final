import { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelNotificaciones
 * Interfaz para la visualización del buzón de notificaciones.
 * Implementa sincronización asíncrona y limpieza optimista del DOM.
 */
function PanelNotificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    /**
     * Efecto de montaje.
     * Recupera el payload de notificaciones y ejecuta una actualización silenciosa 
     * en segundo plano para marcarlas como leídas en la base de datos.
     */
    useEffect(() => {
        const inicializarBandeja = async () => {
            try {
                const res = await api.get('/notificaciones');
                setNotificaciones(res.data);
                
                // Ejecución condicional en background si existen registros sin leer
                if (res.data.length > 0) {
                    await api.post('/notificaciones/marcar-leidas');
                }
            } catch (error) {
                console.error("Fallo de red al sincronizar el buzón de notificaciones:", error);
            }
        };

        inicializarBandeja();
    }, []);

    /**
     * Acción manual desencadenada por el usuario.
     * Purga visualmente la bandeja de entrada y asegura la sincronización del estado en el backend.
     */
    const limpiarBandeja = async () => {
        try {
            await api.post('/notificaciones/marcar-leidas');
            
            // Actualización optimista: vaciado inmediato del estado local
            setNotificaciones([]); 
            
            Swal.fire({
                title: '¡Hecho!',
                text: 'Bandeja de notificaciones limpia.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
        } catch (error) {
            console.error("Error transaccional al limpiar la bandeja:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo completar la limpieza del buzón.',
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-huellitas fw-bold mb-0">🔔 Mis Notificaciones</h2>
                {notificaciones.length > 0 && (
                    <button 
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold" 
                        onClick={limpiarBandeja}
                    >
                        Limpiar bandeja
                    </button>
                )}
            </div>

            {/* Renderizado condicional basado en la disponibilidad de datos */}
            {notificaciones.length === 0 ? (
                <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white text-muted">
                    No tienes notificaciones nuevas actualmente.
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {notificaciones.map((n) => (
                        <div key={n.id} className="card card-huellitas p-3 bg-white shadow-sm border-0 rounded-4">
                            <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                                <h5 className="mb-0 text-huellitas fw-bold">
                                    {n.data.titulo || 'Nueva notificación'}
                                </h5>
                                <span className="badge badge-huellitas small shadow-sm">
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

export default PanelNotificaciones;