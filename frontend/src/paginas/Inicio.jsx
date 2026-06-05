import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import RankingProtectoras from '../componentes/RankingProtectoras'; 
import MapaProtectoras from '../componentes/MapaProtectoras';

/**
 * Componente Inicio: Página principal que muestra un resumen de la plataforma,
 * incluyendo ranking de protectoras, próximos eventos y mapa interactivo.
 */
export default function Inicio() {
  const [protectoras, setProtectoras] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);

  // URLs de respaldo para imágenes con fuentes externas no válidas
  const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop';
  const DEFAULT_PROTECTORA_IMAGE = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop';

  /**
   * Maneja errores de carga de imágenes reemplazando el src por un fallback.
   */
  const handleImageError = (e, type) => {
    e.target.onerror = null;
    e.target.src = type === 'event' ? DEFAULT_EVENT_IMAGE : DEFAULT_PROTECTORA_IMAGE;
  };

  /**
   * Valida que la URL de imagen no provenga de servicios bloqueados o no deseados.
   */
  const sanearUrlImagen = (url, fallback) => {
    if (!url || url.includes('loremflickr.com')) return fallback;
    return url;
  };

  // Carga inicial de datos de protectoras y eventos
  useEffect(() => {
    api.get('/protectoras')
      .then(res => setProtectoras(Array.isArray(res.data) ? res.data : (res.data?.data || [])))
      .catch(err => { console.error("Error al cargar protectoras", err); setProtectoras([]); });

    api.get('/eventos')
      .then(res => {
        const eventosRaw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        // Filtrado de eventos futuros y limitación a los 3 próximos
        setProximosEventos(eventosRaw.filter(e => e && e.fecha && new Date(e.fecha) >= hoy).slice(0, 3));
      })
      .catch(err => { console.error("Error al cargar eventos", err); setProximosEventos([]); });
  }, []);

  return (
    <div className="container py-5 animate-up">

      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-huellitas display-3 mb-3">🐾 Bienvenido a Huellitas</h1>
        <p className="fs-4 text-dark mx-auto" style={{ maxWidth: '600px' }}>
          Tu plataforma de confianza para la adopción y el apoyo a las protectoras de España.
        </p>
      </div>

      {/* Ranking de mejores protectoras */}
      <div className="mb-5">
        <RankingProtectoras />
      </div>

      {/* Sección de Eventos */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-huellitas">Próximos Eventos 📅</h2>
        <Link to="/calendario" className="btn btn-huellitas">Ver calendario →</Link>
      </div>

      <div className="row g-4 mb-5">
        {proximosEventos.length === 0 ? (
          <p className="text-center text-muted">No hay eventos próximos actualmente.</p>
        ) : (
          proximosEventos.map(evento => (
            <div key={evento.id} className="col-md-4">
              <div className="card card-huellitas h-100 d-flex flex-column border-0 shadow-sm">
                <div style={{ height: '200px' }}>
                  <img src={sanearUrlImagen(evento.imagen_url, DEFAULT_EVENT_IMAGE)} className="w-100 h-100 object-fit-cover rounded-top" onError={(e) => handleImageError(e, 'event')} alt={evento.titulo} />
                </div>
                <div className="p-4 flex-grow-1">
                  <span className="badge badge-huellitas mb-2">{evento.fecha ? new Date(evento.fecha).toLocaleDateString() : 'S/F'}</span>
                  <h4 className="fw-bold text-dark">{evento.titulo}</h4>
                  <p className="text-muted small">{evento.descripcion}</p>
                </div>
                <div className="px-4 pb-4">
                  <Link to={`/evento-detalle/${evento.id}`} className="btn btn-huellitas w-100">Ver más</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mapa interactivo de ubicación */}
      <div className="mb-5">
        <MapaProtectoras />
      </div>

      {/* Listado de todas las protectoras */}
      <div className="mb-5">
        <h2 className="fw-bold mb-4 text-huellitas text-center">Todas las Protectoras</h2>
        <div className="row g-4">
          {protectoras.map(p => (
            <div key={p.id} className="col-md-3">
              <Link to={`/protectora/${p.id}`} className="text-decoration-none">
                <div className="card card-huellitas h-100 text-center border-0 shadow-sm">
                  <div style={{ height: '150px' }} className="d-flex align-items-center justify-content-center overflow-hidden rounded-top">
                    <img src={sanearUrlImagen(p.logo_url, DEFAULT_PROTECTORA_IMAGE)} className="w-100 h-100 object-fit-cover" onError={(e) => handleImageError(e, 'shelter')} alt={p.name} />
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-dark mb-1">{p.name}</h6>
                    <small className="text-muted">📍 {p.direccion || 'Sin dirección'}</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}