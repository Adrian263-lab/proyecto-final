import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios'; // CORREGIDO: Usamos tu instancia configurada de Axios

function EventoDetalle() {
  const { id } = useParams(); // Extrae el ID de la URL
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // CORREGIDO: Ahora usa la ruta relativa limpia heredando la IP de tu VPS automáticamente
    api.get(`/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al traer los detalles del evento:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="text-center p-10 text-xl font-semibold mt-5">Cargando detalles del evento...</div>;
  }

  if (!evento) {
    return (
      <div className="text-center p-10 mt-5">
        <p className="text-xl text-red-500 font-semibold">El evento no existe o se ha producido un error.</p>
        <Link to="/" className="text-purple-600 underline mt-4 inline-block fw-bold">Volver a la Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate__animated animate__fadeIn">
      <Link to="/eventos" className="font-semibold hover:underline mb-4 inline-block" style={{ color: '#6f42c1' }}>
        ← Volver al calendario
      </Link>

      <div className="bg-white rounded-4 shadow overflow-hidden border">
        {/* Contenedor de Imagen con el reparador de fallos onError */}
        <div style={{ width: '100%', height: '380px', backgroundColor: '#f3f0fc' }}>
          <img 
            src={evento.imagen_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200'} 
            alt={evento.titulo} 
            className="w-full h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200'; // Respaldo infalible
            }}
          />
        </div>
        
        <div className="p-4 p-md-5">
          <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
            <span className="text-white px-3 py-1 rounded-pill text-sm fw-bold" style={{ backgroundColor: '#6f42c1' }}>
              🗓️ {new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-secondary fw-semibold">📍 {evento.ubicacion}</span>
          </div>

          <h1 className="display-6 fw-bold text-dark mb-4">{evento.titulo}</h1>
          
          <p className="text-secondary leading-relaxed fs-5 mb-5" style={{ whiteSpace: 'pre-line' }}>
            {evento.descripcion}
          </p>

          <div className="border-top pt-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <p className="text-sm text-muted m-0">Organizado por:</p>
              {/* CORREGIDO: Cambiado .user por .protectora para coincidir con el backend */}
              <p className="fw-bold text-dark fs-5 m-0">{evento.protectora?.name || "Protectora Colaboradora"}</p>
            </div>
            
            <button 
              className="btn text-white px-4 py-2 rounded-pill fw-bold shadow-sm"
              style={{ backgroundColor: '#6f42c1' }}
            >
              Inscribirme / Contactar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetalle;