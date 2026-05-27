import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from "../contexto/AuthContext"; // Asegúrate de tener esta importación

export default function DetalleProtectora() {
  const { id } = useParams();
  const { user } = useAuth(); // Para verificar si está logueado y mostrar el formulario
  const [protectora, setProtectora] = useState(null);
  const [pestana, setPestana] = useState('adopcion');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para valoración
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');

  const fetchProtectora = () => {
    api.get(`/protectoras/${id}`)
      .then(res => setProtectora(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProtectora();
  }, [id]);

  const handleValorar = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/protectoras/${id}/valorar`, { puntuacion, comentario });
      Swal.fire('¡Gracias!', 'Tu valoración ha sido registrada.', 'success');
      setComentario('');
      fetchProtectora(); 
    } catch (err) {
      Swal.fire('Error', 'No se pudo enviar la valoración.', 'error');
    }
  };

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
      
      {/* CABECERA */}
      <div className="card card-huellitas p-4 my-4 bg-white">
        <div className="row align-items-center">
          <div className="col-auto">
            {protectora.logo_url ? (
              <img src={protectora.logo_url} alt={protectora.name} className="rounded-circle shadow-sm border border-3 border-light" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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

      {/* TABS (AÑADIDA PESTAÑA DE VALORACIONES) */}
      <div className="row align-items-center mb-4 border-bottom g-0">
        <div className="col-md-6 d-flex">
          <button onClick={() => { setPestana('adopcion'); setBusqueda(''); }} className={`btn btn-lg px-4 py-3 border-0 rounded-0 ${pestana === 'adopcion' ? 'text-huellitas border-bottom border-purple-custom border-3 fw-bold' : 'text-muted'}`}>🐾 Adopción ({enAdopcion.length})</button>
          <button onClick={() => { setPestana('historial'); setBusqueda(''); }} className={`btn btn-lg px-4 py-3 border-0 rounded-0 ${pestana === 'historial' ? 'text-success border-bottom border-success border-3 fw-bold' : 'text-muted'}`}>📜 Historial ({historialAdoptados.length})</button>
          <button onClick={() => { setPestana('valoraciones'); setBusqueda(''); }} className={`btn btn-lg px-4 py-3 border-0 rounded-0 ${pestana === 'valoraciones' ? 'text-warning border-bottom border-warning border-3 fw-bold' : 'text-muted'}`}>⭐ Opiniones</button>
        </div>
        <div className="col-md-6 p-2">
          <div className="input-group rounded-pill border px-3 bg-white shadow-sm">
            <span className="border-0 bg-transparent py-2"><i className="bi bi-search text-muted"></i></span>
            <input type="text" className="form-control border-0 shadow-none" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA */}
      <div className="row g-4">
        {pestana === 'valoraciones' ? (
          <div className="row w-100">
            <div className="col-md-6">
              <h4 className="fw-bold mb-3">Valoraciones de usuarios</h4>
              {protectora.valoraciones?.length > 0 ? protectora.valoraciones.map(v => (
                <div key={v.id} className="card p-3 mb-2 border-0 shadow-sm rounded-3">
                  <div className="d-flex justify-content-between"><strong className="text-huellitas">{v.user?.name}</strong><span className="text-warning">{'⭐'.repeat(v.puntuacion)}</span></div>
                  <p className="small text-muted">{v.comentario}</p>
                </div>
              )) : <p>No hay valoraciones aún.</p>}
            </div>
            <div className="col-md-6">
              {user ? (
                <form onSubmit={handleValorar} className="card p-4 shadow-sm border-0 rounded-4">
                  <h5 className="fw-bold">Deja tu valoración</h5>
                  <select className="form-select mb-3" onChange={(e) => setPuntuacion(e.target.value)}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrellas</option>)}</select>
                  <textarea className="form-control mb-3" rows="3" placeholder="Tu comentario..." value={comentario} onChange={(e) => setComentario(e.target.value)}></textarea>
                  <button className="btn btn-huellitas w-100">Enviar Opinión</button>
                </form>
              ) : <p className="text-center text-muted">Inicia sesión para valorar.</p>}
            </div>
          </div>
        ) : (
          /* TU LÓGICA DE ANIMALES ORIGINAL */
          pestana === 'adopcion' ? (
            enAdopcion.length > 0 ? enAdopcion.map(animal => (
              <div className="col-md-4 col-lg-3" key={animal.id}>
                <Link to={`/animal/${animal.id}`} className="card card-huellitas h-100 text-center p-3 text-decoration-none bg-white">
                  <div className="mb-3 mx-auto overflow-hidden rounded-circle border border-3 border-light shadow-sm" style={{ width: '120px', height: '120px' }}>
                    <img src={animal.imagen_url || 'https://via.placeholder.com/150?text=🐶'} alt={animal.nombre} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <h4 className="fw-bold text-dark mb-1">{animal.nombre}</h4>
                  <p className="text-muted small mb-3">{animal.raza || 'Mestizo'}</p>
                  <span className="badge badge-huellitas py-2 w-100">Ver ficha</span>
                </Link>
              </div>
            )) : <p className="text-center text-muted my-5">No hay animales disponibles.</p>
          ) : (
            historialAdoptados.length > 0 ? historialAdoptados.map(animal => (
              <div className="col-md-4 col-lg-3" key={animal.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3 bg-white opacity-75">
                  <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{ width: '100px', height: '100px' }}>
                    <img src={animal.imagen_url || 'https://via.placeholder.com/150?text=🏠'} alt={animal.nombre} className="w-100 h-100 object-fit-cover filter-grayscale" />
                  </div>
                  <h5 className="fw-bold text-muted mb-1">{animal.nombre}</h5>
                  <span className="badge bg-success rounded-pill small py-1 px-3">¡Adoptado!</span>
                </div>
              </div>
            )) : <p className="text-center text-muted my-5">Aún no hay historial de adoptados.</p>
          )
        )}
      </div>
    </div>
  );
}