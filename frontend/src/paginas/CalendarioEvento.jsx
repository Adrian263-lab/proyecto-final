import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axios';

/**
 * Componente CalendarioEvento: visualiza eventos programados mediante un calendario interactivo.
 * Filtra y muestra detalles de eventos según la fecha seleccionada por el usuario.
 */
export default function CalendarioEvento() {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    api.get('/eventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al cargar eventos:", err));
  }, []);

  /**
   * Determina si una fecha específica posee eventos asociados.
   */
  const tieneEventoEnFecha = (date) => {
    return eventos.some(evento => {
      const fechaEv = new Date(evento.fecha);
      return fechaEv.getDate() === date.getDate() &&
             fechaEv.getMonth() === date.getMonth() &&
             fechaEv.getFullYear() === date.getFullYear();
    });
  };

  /**
   * Filtra los eventos que coinciden con la fecha seleccionada en el estado.
   */
  const eventosDelDia = eventos.filter(e => {
    const f = new Date(e.fecha);
    return f.getDate() === fechaSeleccionada.getDate() &&
           f.getMonth() === fechaSeleccionada.getMonth() &&
           f.getFullYear() === fechaSeleccionada.getFullYear();
  });

  return (
    <div className="container mt-4 mb-5 animate-up" style={{ maxWidth: '1000px' }}>
      <Link to="/" className="fw-bold mb-3 d-inline-block text-decoration-none text-huellitas">
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
                tileClassName={({ date }) => tieneEventoEnFecha(date) ? 'dia-resaltado' : null}
              />
            </div>
          </div>

          <div className="col-md-6">
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
                      <Link to={`/evento-detalle/${evento.id}`} className="btn btn-huellitas text-white">
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