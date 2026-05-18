import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
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

  // Función para resaltar los días que tienen eventos en el calendario
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

  // Filtrar eventos del día seleccionado
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
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white w-100" style={{ maxWidth: '450px' }}>
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              tileClassName={tileClassName}
              className="border-0 w-100"
            />
          </div>
        </div>

        {/* Columna de eventos del día */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 rounded-4 bg-white h-100">
            <h4 className="fw-bold text-secondary mb-4">
              Eventos para el {fechaSeleccionada.toLocaleDateString()}
            </h4>
            
            {eventosDelDia.length === 0 ? (
              <p className="text-muted">No hay eventos programados para este día. ¡Elige otra fecha!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {eventosDelDia.map(evento => (
                  <div key={evento.id} className="p-3 rounded-3 border-start border-4 border-huellitas bg-light shadow-sm">
                    <h5 className="fw-bold text-dark m-0">{evento.titulo}</h5>
                    <small className="text-muted d-block mb-2">📍 {evento.ubicacion} | 🕒 {new Date(evento.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                    <p className="text-secondary m-0 small">{evento.descripcion}</p>
                    {evento.protectora && (
                      <span className="badge bg-huellitas mt-2">Organiza: {evento.protectora.name}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos para el calendario */}
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
      `}</style>
    </div>
  );
}