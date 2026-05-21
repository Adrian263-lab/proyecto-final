import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Inicio.css'; 

export default function Inicio() {
  const [protectoras, setProtectoras] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);

  // --- CONFIGURACIÓN DE IMÁGENES POR DEFECTO ---
  // Usamos loremflickr.com para asegurar que siempre haya fotos de animales.
  const DEFAULT_EVENT_IMAGE = 'https://loremflickr.com/600/400/dogs,cats,pets/all';
  const DEFAULT_PROTECTORA_IMAGE = 'https://loremflickr.com/400/400/animal,shelter/all';

  // Función para manejar errores de carga de imágenes (Fallback)
  const handleImageError = (e, type) => {
    e.target.onerror = null; // Evita bucles infinitos
    e.target.src = type === 'event' ? DEFAULT_EVENT_IMAGE : DEFAULT_PROTECTORA_IMAGE;
  };

  useEffect(() => {
    // Carga de protectoras
    api.get('/protectoras')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setProtectoras(data);
      })
      .catch(err => { console.error("Error al cargar protectoras", err); setProtectoras([]); });

    // Carga de eventos
    api.get('/eventos')
      .then(res => {
        const eventosRaw = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const futuros = eventosRaw.filter(evento => evento && evento.fecha && new Date(evento.fecha) >= hoy);
        setProximosEventos(futuros.slice(0, 3));
      })
      .catch(err => { console.error("Error al cargar eventos próximos", err); setProximosEventos([]); });
  }, []);

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      
      {/* SECCIÓN BIENVENIDA */}
      <div className="text-center mb-5 py-4">
        <h1 className="fw-bold text-huellitas display-4 mb-3">🐾 Bienvenido a Huellitas</h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
          Encuentra a tu compañero ideal y apoya a las protectoras locales en su labor diaria.
        </p>
      </div>

      {/* SECCIÓN EVENTOS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Próximos Eventos 📅</h2>
        <Link to="/calendario" className="btn btn-outline-huellitas rounded-pill px-4 fw-bold">
          Ver calendario →
        </Link>
      </div>

      <div className="row g-4 mb-5">
        {proximosEventos.length === 0 ? (
          <div className="col-12 text-center py-4 text-muted fst-italic">
            No hay eventos programados para las próximas fechas.
          </div>
        ) : (
          proximosEventos.map(evento => (
            <div key={evento.id} className="col-md-4">
              <div className="tarjeta-evento-home h-100 bg-white border-0 rounded-4 shadow-sm d-flex flex-column overflow-hidden">
                <div style={{ height: '180px' }}>
                  {/* Imagen de Evento - Fallback Temático */}
                  <img 
                    src={evento.imagen_url || DEFAULT_EVENT_IMAGE} 
                    alt={evento.titulo} 
                    className="w-100 h-100 object-fit-cover" 
                    onError={(e) => handleImageError(e, 'event')}
                  />
                </div>
                <div className="p-4 flex-grow-1">
                  <span className="badge bg-naranja-claro text-naranja mb-2">
                    {evento.fecha ? new Date(evento.fecha).toLocaleDateString([], { day: 'numeric', month: 'short' }) : 'S/F'}
                  </span>
                  <h4 className="fw-bold">{evento.titulo}</h4>
                  <p className="text-muted small">{evento.descripcion}</p>
                </div>
                <div className="px-4 pb-4">
                  <Link to={`/evento-detalle/${evento.id}`} className="btn btn-huellitas w-100 rounded-pill fw-bold">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="my-5" />

      {/* SECCIÓN PROTECTORAS */}
      <div className="mb-5">
        <h2 className="fw-bold mb-4">Protectoras Colaboradoras</h2>
        <div className="row g-4">
          {protectoras.map(p => (
            <div key={p.id} className="col-md-3">
              <Link to={`/protectora/${p.id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-lift">
                  <div style={{ height: '140px' }} className="bg-light d-flex align-items-center justify-content-center overflow-hidden">
                    {/* Imagen de Protectora (Logo) - Fallback Temático */}
                    <img 
                      src={p.logo_url || DEFAULT_PROTECTORA_IMAGE} 
                      alt={p.name} 
                      className="w-100 h-100 object-fit-cover" 
                      onError={(e) => handleImageError(e, 'shelter')}
                    />
                  </div>
                  <div className="p-3">
                    <h5 className="fw-bold text-dark">{p.name}</h5>
                    <p className="text-muted small mb-0">📍 {p.direccion || 'Sin dirección'}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .text-huellitas { color: #6f42c1; }
        .text-naranja { color: #d67115; }
        .bg-naranja-claro { background-color: #ffe8cc; }
        .btn-huellitas { background-color: #6f42c1; color: white; }
        .btn-huellitas:hover { background-color: #5a359d; color: white; }
        .btn-outline-huellitas { border: 2px solid #6f42c1; color: #6f42c1; }
        .btn-outline-huellitas:hover { background-color: #6f42c1; color: white; }
        .hover-lift { transition: transform 0.2s; }
        .hover-lift:hover { transform: translateY(-5px); }
        .tarjeta-evento-home { transition: transform 0.2s; }
        .tarjeta-evento-home:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
}