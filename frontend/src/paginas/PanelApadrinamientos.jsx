import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function PanelApadrinamientos() {
  const [apadrinados, setApadrinados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/mis-apadrinamientos')
      .then(res => {
        setApadrinados(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar tus apadrinamientos:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <div className="text-center p-5 mt-5 text-huellitas"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5 mb-5 animate-up" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-huellitas mb-0">❤️ Mis Apadrinamientos</h2>
        <Link to="/" className="btn btn-sm btn-light border text-huellitas rounded-pill px-3 fw-bold">
          Ver más peluditos →
        </Link>
      </div>

      {apadrinados.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-4 text-center bg-white text-muted">
          <i className="bi bi-heart-break text-huellitas display-4 mb-3"></i>
          <p className="fs-5 mb-0">Aún no has apadrinado a ningún animal.</p>
          <p className="small text-secondary">¡Entra en la ficha de cualquier peludito para apoyarlo!</p>
        </div>
      ) : (
        <div className="row g-4">
          {apadrinados.map(registro => {
            // Evaluamos si el backend devuelve la relación del animal cargada o el objeto directo
            const animal = registro.animal || registro;
            
            return (
              <div key={registro.id} className="col-md-4 col-lg-3">
                {/* Tarjeta corporativa oficial integrada con tu sistema de diseño */}
                <div className="card card-huellitas h-100 bg-white overflow-hidden d-flex flex-column">
                  <div style={{ height: '180px' }} className="position-relative">
                    <img 
                      src={animal?.imagen_url || 'https://via.placeholder.com/400x300?text=🐱'} 
                      alt={animal?.nombre || 'Peludito'} 
                      className="w-100 h-100 object-fit-cover"
                    />
                    {/* Sincronizado con la columna 'cuota_mensual' de tu base de datos en Laravel */}
                    {registro.cuota_mensual && (
                      <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark text-white rounded-pill px-3 py-2 bg-opacity-75">
                        {parseFloat(registro.cuota_mensual)} €/mes
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 flex-grow-1 text-center">
                    <h4 className="fw-bold text-dark mb-1">{animal?.nombre || 'Peludito'}</h4>
                    <p className="text-muted small mb-3">📍 {animal?.user?.name || 'Protectora Colaboradora'}</p>
                    
                    <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-1 mb-3">
                      {animal?.estado || 'En adopción'}
                    </span>
                  </div>

                  <div className="px-3 pb-3 mt-auto">
                    <Link to={`/animal/${animal?.id}`} className="btn btn-huellitas w-100 py-2">
                      Ver ficha completa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PanelApadrinamientos;