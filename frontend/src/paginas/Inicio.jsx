import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import RankingProtectoras from '../componentes/RankingProtectoras'; // Importa el ranking

export default function Inicio() {
  const [protectoras, setProtectoras] = useState([]);
  const [proximosEventos, setProximosEventos] = useState([]);

  // --- CONFIGURACIÓN DE IMÁGENES POR DEFECTO ---
  const DEFAULT_EVENT_IMAGE = 'https://loremflickr.com/600/400/dogs,cats,pets/all';
  const DEFAULT_PROTECTORA_IMAGE = 'https://loremflickr.com/400/400/animal,shelter/all';

  const handleImageError = (e, type) => {
    e.target.onerror = null;
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
    <div className="container mt-5 mb-5 animate-up">
      
      {/* SECCIÓN BIENVENIDA */}
      <div className="text-center mb-5 py-4">
        <h1 className="fw-bold text-huellitas display-4 mb-3">🐾 Bienvenido a Huellitas</h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
          Encuentra a tu compañero ideal y apoya a las protectoras locales en su labor diaria.
        </p>
      </div>

      {/* NUEVA SECCIÓN: RANKING DE PROTECTORAS */}
      <RankingProtectoras />

      {/* SECCIÓN EVENTOS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Próximos Eventos 📅</h2>
        <Link to="/calendario" className="btn btn-sm btn-light border text-huellitas rounded-pill px-4 fw-bold text-dark">
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
              <div className="card card-huellitas h-100 bg-white d-flex flex-column overflow-hidden">
                <div style={{ height: '180px' }}>
                  <img 
                    src={evento.imagen_url || DEFAULT_EVENT_IMAGE} 
                    alt={evento.titulo} 
                    className="w-100 h-100 object-fit-cover" 
                    onError={(e) => handleImageError(e, 'event')}
                  />
                </div>
                <div className="p-4 flex-grow-1">
                  <span className="badge badge-huellitas mb-2">
                    {evento.fecha ? new Date(evento.fecha).toLocaleDateString([], { day: 'numeric', month: 'short' }) : 'S/F'}
                  </span>
                  <h4 className="fw-bold text-dark">{evento.titulo}</h4>
                  <p className="text-muted small mb-0">{evento.descripcion}</p>
                </div>
                <div className="px-4 pb-4">
                  <Link to={`/evento-detalle/${evento.id}`} className="btn btn-huellitas w-100">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="my-5 opacity-25" />

      {/* SECCIÓN PROTECTORAS (Listado general) */}
      <div className="mb-5">
        <h2 className="fw-bold mb-4">Todas las Protectoras</h2>
        <div className="row g-4">
          {protectoras.map(p => (
            <div key={p.id} className="col-md-3">
              <Link to={`/protectora/${p.id}`} className="text-decoration-none">
                <div className="card card-huellitas h-100 bg-white overflow-hidden">
                  <div style={{ height: '140px' }} className="bg-light d-flex align-items-center justify-content-center overflow-hidden">
                    <img 
                      src={p.logo_url || DEFAULT_PROTECTORA_IMAGE} 
                      alt={p.name} 
                      className="w-100 h-100 object-fit-cover" 
                      onError={(e) => handleImageError(e, 'shelter')}
                    />
                  </div>
                  <div className="p-3">
                    <h5 className="fw-bold text-dark mb-1">{p.name}</h5>
                    <p className="text-muted small mb-0">📍 {p.direccion || 'Sin dirección'}</p>
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