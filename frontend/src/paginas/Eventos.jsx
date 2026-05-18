import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom'; 
import api from '../api/axios';
import 'react-calendar/dist/Calendar.css';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    api.get('/eventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al cargar eventos:", err));
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const tieneEvento = eventos.some(evento => {
        const fechaEv = new Date(evento.fecha);
        return fechaEv.getDate() === date.getDate() &&
               fechaEv.getMonth() === date.getMonth() &&
               fechaEv.getFullYear() === date.getFullYear();
      });
      return tieneEvento ? 'dia-resaltado' : null;
    }
  };

  const eventosDelDia = eventos.filter(evento => {
    const fechaEv = new Date(evento.fecha);
    return fechaEv.getDate() === fechaSeleccionada.getDate() &&
           fechaEv.getMonth() === fechaSeleccionada.getMonth() &&
           fechaEv.getFullYear() === fechaSeleccionada.getFullYear();
  });

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <h2 className="fw-bold text-huellitas text-center mb-5">📅 Calendario de Eventos Benéficos</h2>
      
      <div className="row g-4">
        {/* Columna del Calendario */}
        <div className="col-md-5 d-flex justify-content-center">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white w-100" style={{ maxWidth: '450px', height: 'fit-content' }}>
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              tileClassName={tileClassName}
              className="border-0 w-100"
            />
          </div>
        </div>

        {/* Columna de eventos del día */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
            <h4 className="fw-bold text-secondary mb-4">
              Eventos para el {fechaSeleccionada.toLocaleDateString()}
            </h4>
            
            {eventosDelDia.length === 0 ? (
              <p className="text-muted">No hay eventos programados para este día. ¡Elige otra fecha!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {eventosDelDia.map(evento => (
                  <div key={evento.id} className="p-0 rounded-3 overflow-hidden border-start border-4 border-huellitas bg-light shadow-sm d-flex flex-column flex-sm-row">
                    
                    <div style={{ width: '100%', maxWidth: '140px', minHeight: '120px' }} className="position-relative bg-secondary-subtle flex-shrink-0">
                      <img 
                        src={evento.imagen_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'} 
                        alt={evento.titulo} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'; 
                        }}
                      />
                    </div>

                    <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="fw-bold text-dark m-0">{evento.titulo}</h5>
                        <small className="text-muted d-block mb-2">
                          📍 {evento.ubicacion} | 🕒 {new Date(evento.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                        <p className="text-secondary m-0 small text-truncate-2">{evento.descripcion}</p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        {evento.protectora ? (
                          <span className="badge bg-huellitas">Organiza: {evento.protectora.name}</span>
                        ) : (
                          <span></span>
                        )}
                        
                        {/* ACTUALIZADO: Enlace definitivo absoluto */}
                        <Link 
                          to={`/ver-evento/${evento.id}`} 
                          className="btn btn-sm text-white px-3 py-1 rounded-pill fw-bold"
                          style={{ backgroundColor: '#6f42c1' }}
                        >
                          Ver más →
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dia-resaltado {
          background-color: #6f42c1 !important;
          color: white !important;
          border-radius: 50%;
          font-weight: bold;
        }
        .bg-huellitas { background-color: #6f42c1; }
        .border-huellitas { border-color: #6f42c1 !important; }
        .text-huellitas { color: #6f42c1; }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}