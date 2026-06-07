import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axios';

// El componente CalendarioEvento muestra un calendario interactivo con los eventos programados. Permite a los usuarios seleccionar una fecha y ver los eventos asociados a esa fecha, con enlaces para ver detalles adicionales.
function CalendarioEvento() {
    // Estado para almacenar la lista completa de eventos del backend
    const [eventos, setEventos] = useState([]);
    
    // Estado para gestionar la fecha activa; se inicializa con la fecha actual del sistema del cliente
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    useEffect(() => {
        // Función asíncrona para cargar los eventos desde la API. Se ejecuta una sola vez al montar el componente.
        const cargarEventos = async () => {
            try {
                const res = await api.get('/eventos');
                setEventos(res.data);
            } catch (error) {
                console.error("Fallo de red al intentar sincronizar los eventos:", error);
            }
        };

        cargarEventos();
    }, []);

    // Función de utilidad para determinar si una fecha dada tiene eventos asociados. Se utiliza para aplicar estilos condicionales en el calendario.
    const tieneEventoEnFecha = (date) => {
        // Se usa .some() en lugar de .filter() por eficiencia (cortocircuita en cuanto encuentra el primer true)
        return eventos.some(evento => {
            const fechaEv = new Date(evento.fecha);
            // Comparación estricta de componentes de fecha ignorando la hora (Timezone safe loop)
            return fechaEv.getDate() === date.getDate() &&
                   fechaEv.getMonth() === date.getMonth() &&
                   fechaEv.getFullYear() === date.getFullYear();
        });
    };

    // Filtrado de eventos para la fecha actualmente seleccionada. Se ejecuta en cada renderizado, pero es eficiente debido a la cantidad limitada de eventos y la naturaleza reactiva del estado.
    const eventosDelDia = eventos.filter(e => {
        const f = new Date(e.fecha);
        return f.getDate() === fechaSeleccionada.getDate() &&
               f.getMonth() === fechaSeleccionada.getMonth() &&
               f.getFullYear() === fechaSeleccionada.getFullYear();
    });

    return (
        <div className="container mt-4 mb-5 animate-up" style={{ maxWidth: '1000px' }}>
            <Link to="/" className="fw-bold mb-3 d-inline-block text-decoration-none text-huellitas" aria-label="Volver a la página principal">
                ← Volver al inicio
            </Link>

            <div className="card border-0 border-bottom border-purple-custom border-4 shadow-sm rounded-4 p-4 bg-white">
                <h2 className="fw-bold mb-4 text-center text-dark">📅 Agenda Completa de Huellitas</h2>
                
                <div className="row g-4">
                    
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <Calendar 
                                onChange={setFechaSeleccionada} 
                                value={fechaSeleccionada}
                                locale="es-ES"
                                // Inyección condicional de clases (CSS-in-JS pattern) para marcadores visuales
                                tileClassName={({ date }) => tieneEventoEnFecha(date) ? 'dia-resaltado' : null}
                            />
                        </div>
                    </div>

                    
                    <div className="col-md-6" aria-live="polite">
                        <h4 className="fw-bold mb-3 fs-5 text-huellitas">
                            Eventos para el {fechaSeleccionada.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                        </h4>
                        
                        
                        {eventosDelDia.length === 0 ? (
                            <p className="text-muted fst-italic">No hay eventos agendados para este día.</p>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {eventosDelDia.map(evento => (
                                    <div key={evento.id} className="card card-huellitas p-3 bg-white">
                                        <h5 className="fw-bold m-0 text-dark">{evento.titulo}</h5>
                                        <p className="text-muted small my-2">📍 {evento.ubicacion}</p>
                                        <div>
                                            <Link 
                                                to={`/evento-detalle/${evento.id}`} 
                                                className="btn btn-huellitas text-white"
                                                aria-label={`Ver detalles del evento ${evento.titulo}`}
                                            >
                                                Ver detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarioEvento;