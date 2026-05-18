import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios'; // Usamos tu Axios configurado

function EventoDetalle() {
  const { id } = useParams(); 
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorDiagnostico, setErrorDiagnostico] = useState(null); // Para ver el error real en pantalla

  useEffect(() => {
    console.log("[DIAGNÓSTICO] Solicitando detalles para el ID de evento:", id);
    
    api.get(`/eventos/${id}`)
      .then(response => {
        // AQUÍ VERÁS EN LA CONSOLA TODO LO QUE TE ENVÍA LARAVEL
        console.log("[DIAGNÓSTICO] Datos recibidos del servidor con éxito:", response.data);
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("[DIAGNÓSTICO] Error crítico al hacer la petición a la API:", error);
        setErrorDiagnostico(error.message || "Error desconocido de red");
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="text-center p-10 text-xl font-semibold mt-5">Cargando detalles del evento... (ID: {id})</div>;
  }

  // Si hubo un error en la petición HTTP o el evento vino vacío, mostramos el diagnóstico en pantalla
  if (errorDiagnostico || !evento) {
    return (
      <div className="container mt-5 p-5 border border-danger bg-danger-subtle rounded-4 text-center">
        <h4 className="text-danger fw-bold">❌ Error en la Vista de Detalles</h4>
        <p className="mt-3">El componente no ha podido cargar el evento.</p>
        <div className="text-start bg-dark text-white p-3 rounded-3 my-3 font-monospace small">
          <strong>ID buscado:</strong> {id} <br />
          <strong>Causa:</strong> {errorDiagnostico ? `Error de red/servidor (${errorDiagnostico})` : "El servidor respondió con un objeto vacío o nulo."}
        </div>
        <p className="small text-muted">Abre la Consola del Desarrollador (F12) para ver más detalles.</p>
        <Link to="/" className="btn btn-purple mt-2 text-white" style={{ backgroundColor: '#6f42c1' }}>Volver a la Home</Link>
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
              e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200';
            }}
          />
        </div>
        
        <div className="p-4 p-md-5">
          <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
            <span className="text-white px-3 py-1 rounded-pill text-sm fw-bold" style={{ backgroundColor: '#6f42c1' }}>
              🗓️ {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}
            </span>
            <span className="text-secondary fw-semibold">📍 {evento.ubicacion || 'Sin ubicación'}</span>
          </div>

          <h1 className="display-6 fw-bold text-dark mb-4">{evento.titulo || 'Sin título'}</h1>
          
          <p className="text-secondary leading-relaxed fs-5 mb-5" style={{ whiteSpace: 'pre-line' }}>
            {evento.descripcion || 'Sin descripción'}
          </p>

          <div className="border-top pt-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <p className="text-sm text-muted m-0">Organizado por:</p>
              {/* Usamos encadenamiento opcional (?.) para evitar que se rompa si protectora no viene */}
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