import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axios';

export default function CalendarioEvento() {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    // Cargamos todos los eventos para tener las fechas listas
    api.get('/eventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al cargar eventos en el calendario", err));
  }, []);

  // Función opcional por si quieres añadir puntitos o clases a los días que tienen eventos
  const tieneEventoEnFecha = (date) => {
    return eventos.some(evento => {
      const fechaEv = new Date(evento.fecha);
      return fechaEv.getDate() === date.getDate() &&
             fechaEv.getMonth() === date.getMonth() &&
             fechaEv.getFullYear() === date.getFullYear();
    });
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn" style={{ maxWidth: '1000px' }}>
      <Link to="/" className="fw-bold mb-4 inline-block text-decoration-none" style={{ color: '#6f42c1' }}>
        ← Volver al inicio
      </Link>

      <div className="card shadow-sm rounded-4 p-4 bg-white border">
        <h2 className="fw-bold mb-4 text-center text-dark">📅 Agenda Completa de Huellitas</h2>
        
        <div className="row g-4">
          {/* Columna del Widget del Calendario */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Calendar 
                onChange={setFechaSeleccionada} 
                value={fechaSeleccionada}
                locale="es-ES"
                tileClassName={({ date }) => tieneEventoEnFecha(date) ? 'dia-con-evento' : null}
              />
            </div>
          </div>

          {/* Columna de Eventos Filtrados o Información del día */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-3 fs-5" style={{ color: '#6f42c1' }}>
              Eventos para el {fechaSeleccionada.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </h4>
            
            {/* Buscamos si hay algún evento que coincida con el día seleccionado en el widget */}
            {eventos.filter(e => {
              const f = new Date(e.fecha);
              return f.getDate() === fechaSeleccionada.getDate() &&
                     f.getMonth() === fechaSeleccionada.getMonth() &&
                     f.getFullYear() === fechaSeleccionada.getFullYear();
            }).length === 0 ? (
              <p className="text-muted italic">No hay eventos agendados para este día.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {eventos
                  .filter(e => {
                    const f = new Date(e.fecha);
                    return f.getDate() === fechaSeleccionada.getDate() &&
                           f.getMonth() === fechaSeleccionada.getMonth() &&
                           f.getFullYear() === fechaSeleccionada.getFullYear();
                  })
                  .map(evento => (
                    <div key={evento.id} className="p-3 border rounded-3 bg-light">
                      <h5 className="fw-bold m-0 text-dark">{evento.titulo}</h5>
                      <p className="text-muted small my-1">📍 {evento.ubicacion}</p>
                      <Link to={`/evento-detalle/${evento.id}`} className="btn btn-sm text-white rounded-pill px-3 mt-2 fw-bold" style={{ backgroundColor: '#6f42c1', fontSize: '0.8rem' }}>
                        Ver detalles
                      </Link>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .react-calendar { width: 100% !important; border: none !important; font-family: inherit !important; }
        .react-calendar__tile--active { background: #6f42c1 !important; color: white !important; border-radius: 8px; }
        .react-calendar__tile--now { background: #f3f0fc !important; color: #6f42c1 !important; font-weight: bold; border-radius: 8px; }
        .dia-con-evento { border: 2px solid #6f42c1 !important; font-weight: bold; border-radius: 8px; }
      `}</style>
    </div>
  );
}