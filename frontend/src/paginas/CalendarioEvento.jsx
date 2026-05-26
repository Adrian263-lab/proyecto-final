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

  // Función para evaluar si una celda del calendario coincide con algún evento del backend
  const tieneEventoEnFecha = (date) => {
    return eventos.some(evento => {
      const fechaEv = new Date(evento.fecha);
      return fechaEv.getDate() === date.getDate() &&
             fechaEv.getMonth() === date.getMonth() &&
             fechaEv.getFullYear() === date.getFullYear();
    });
  };

  return (
    // Reemplazada la clase de animación externa por tu .animate-up de App.css
    <div className="container mt-4 mb-5 animate-up" style={{ maxWidth: '1000px' }}>
      <Link to="/" className="fw-bold mb-4 inline-block text-decoration-none text-huellitas">
        ← Volver al inicio
      </Link>

      {/* Aplicada la tarjeta del sistema de diseño oficial de Huellitas */}
      <div className="card card-huellitas p-4 bg-white">
        <h2 className="fw-bold mb-4 text-center text-dark">📅 Agenda Completa de Huellitas</h2>
        
        <div className="row g-4">
          {/* Columna del Widget del Calendario */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Calendar 
                onChange={setFechaSeleccionada} 
                value={fechaSeleccionada}
                locale="es-ES"
                /* Mapeado directamente a .dia-resaltado, la clase que centralizamos en tu App.css */
                tileClassName={({ date }) => tieneEventoEnFecha(date) ? 'dia-resaltado' : null}
              />
            </div>
          </div>

          {/* Columna de Eventos Filtrados o Información del día */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-3 fs-5 text-huellitas">
              Eventos para el {fechaSeleccionada.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </h4>
            
            {/* Buscamos si hay algún evento que coincida con el día seleccionado en el widget */}
            {eventos.filter(e => {
              const f = new Date(e.fecha);
              return f.getDate() === fechaSeleccionada.getDate() &&
                     f.getMonth() === fechaSeleccionada.getMonth() &&
                     f.getFullYear() === fechaSeleccionada.getFullYear();
            }).length === 0 ? (
              <p className="text-muted fst-italic">No hay eventos agendados para este día.</p>
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
                    /* Encajamos las sub-tarjetas de la agenda con el diseño unificado de Huellitas */
                    <div key={evento.id} className="card p-3 border shadow-sm rounded-4 bg-white">
                      <h5 className="fw-bold m-0 text-dark">{evento.titulo}</h5>
                      <p className="text-muted small my-2">📍 {evento.ubicacion}</p>
                      <div>
                        {/* El enlace de redirección recupera tu .btn-huellitas original con degradado naranja */}
                        <Link to={`/evento-detalle/${evento.id}`} className="btn btn-huellitas py-2 text-white">
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}