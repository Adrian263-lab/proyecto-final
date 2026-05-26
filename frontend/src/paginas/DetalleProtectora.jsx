import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function DetalleProtectora() {
  const { id } = useParams();
  const [protectora, setProtectora] = useState(null);
  const [pestana, setPestana] = useState('adopcion');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api.get(`/protectoras/${id}`)
      .then(res => setProtectora(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const compartirPerfil = () => {
    if (navigator.share) {
      navigator.share({
        title: `Conoce a ${protectora.name}`,
        text: `Echa un vistazo a los animales de ${protectora.name} en Huellitas.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        title: '¡Enlace copiado!',
        text: 'El enlace se ha copiado al portapapeles.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  if (!protectora) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-huellitas" role="status"></div>
    </div>
  );

  const enAdopcion = protectora.animales?.filter(a => 
    a.estado !== 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  const historialAdoptados = protectora.animales?.filter(a => 
    a.estado === 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ) || [];

  return (
    <div className="container mt-4 mb-5 animate-up">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="text-decoration-none fw-medium text-secondary">
          <i className="bi bi-arrow-left me-2"></i>Volver al inicio
        </Link>
        <button onClick={compartirPerfil} className="btn btn-sm btn-light border rounded-pill px-3 shadow-sm text-dark">
          <i className="bi bi-share me-2 text-huellitas"></i>Compartir perfil
        </button>
      </div>
      
      {/* CABECERA CON ESTILO UNIFICADO */}
      <div className="card card-huellitas p-4 my-4 bg-white">
        <div className="row align-items-center">
          <div className="col-auto">
            {protectora.logo_url ? (
              <img 
                src={protectora.logo_url} 
                alt={protectora.name} 
                className="rounded-circle shadow-sm border border-3 border-light"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-huellitas text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '90px', height: '90px' }}>
                <i className="bi bi-house-heart fs-1"></i>
              </div>
            )}
          </div>
          <div className="col mt-3 mt-md-0">
            <h1 className="fw-bold mb-1 text-huellitas">{protectora.name}</h1>
            <p className="text-muted mb-0 small">
              <i className="bi bi-geo-alt-fill me-1 text-huellitas"></i>{protectora.direccion || 'Ubicación no disponible'} 
              <span className="mx-2 text-light">|</span>
              <i className="bi bi-envelope-fill me-1 text-huellitas"></i>{protectora.email}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="row align-items-center mb-4 border-bottom g-0">
        <div className="col-md-6 d-flex">
          <button 
            onClick={() => { setPestana('adopcion'); setBusqueda(''); }}
            className={`btn btn-lg px-4 py-3 border-0 rounded-0 ${pestana === 'adopcion' ? 'text-huellitas border-bottom border-purple-custom border-3 fw-bold' : 'text-muted'}`}
          >
            🐾 Adopción ({enAdopcion.length})
          </button>
          <button 
            onClick={() => { setPestana('historial'); setBusqueda(''); }}
            className={`btn btn-lg px-4 py-3 border-0 rounded-0 ${pestana === 'historial' ? 'text-success border-bottom border-success border-3 fw-bold' : 'text-muted'}`}
          >
            📜 Historial ({historialAdoptados.length})
          </button>
        </div>
        <div className="col-md-6 p-2">
          <div className="input-group rounded-pill border px-3 bg-white shadow-sm">
            <span className="border-0 bg-transparent py-2"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-0 shadow-none" 
              placeholder="Buscar peludito..." 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* GRID DE ANIMALES */}
      <div className="row g-4">
        {pestana === 'adopcion' ? (
          enAdopcion.length > 0 ? (
            enAdopcion.map(animal => (
              <div className="col-md-4 col-lg-3" key={animal.id}>
                <Link to={`/animal/${animal.id}`} className="card card-huellitas h-100 text-center p-3 text-decoration-none bg-white">
                  <div className="mb-3 mx-auto overflow-hidden rounded-circle border border-3 border-light shadow-sm" style={{ width: '120px', height: '120px' }}>
                    <img 
                      src={animal.imagen_url || 'https://via.placeholder.com/150?text=🐶'} 
                      alt={animal.nombre}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <h4 className="fw-bold text-dark mb-1">{animal.nombre}</h4>
                  <p className="text-muted small mb-3">{animal.raza || 'Mestizo'}</p>
                  <span className="badge badge-huellitas py-2 w-100">
                    Ver ficha
                  </span>
                </Link>
              </div>
            ))
          ) : <p className="text-center text-muted my-5">No hay animales disponibles en esta sección.</p>
        ) : (
          historialAdoptados.length > 0 ? (
            historialAdoptados.map(animal => (
              <div className="col-md-4 col-lg-3" key={animal.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3 bg-white opacity-75">
                  <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{ width: '100px', height: '100px' }}>
                    <img 
                      src={animal.imagen_url || 'https://via.placeholder.com/150?text=🏠'} 
                      alt={animal.nombre}
                      className="w-100 h-100 object-fit-cover filter-grayscale"
                    />
                  </div>
                  <h5 className="fw-bold text-muted mb-1">{animal.nombre}</h5>
                  <span className="badge bg-success rounded-pill small py-1 px-3">¡Adoptado!</span>
                </div>
              </div>
            ))
          ) : <p className="text-center text-muted my-5">Aún no hay historial de adoptados.</p>
        )}
      </div>
    </div>
  );
}