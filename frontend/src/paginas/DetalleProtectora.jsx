import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from "../contexto/AuthContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // 🚀 Importamos los corazones para el botón

export default function DetalleProtectora() {
  const { id } = useParams();
  const { user } = useAuth();
  const [protectora, setProtectora] = useState(null);
  const [pestana, setPestana] = useState('adopcion');
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para valoración
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 🚀 NUEVOS ESTADOS para el sistema de favoritos
  const [isFavorito, setIsFavorito] = useState(false);
  const [cargandoFav, setCargandoFav] = useState(false);

  // 🛡️ Imágenes sustitutas por si el seeder o registros viejos traen loremflickr
  const FALLBACK_ANIMAL = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop';
  const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop';

  const sanearUrl = (url, fallback) => {
    if (!url || url.includes('loremflickr.com')) {
      return fallback;
    }
    return url;
  };

  const fetchProtectora = () => {
    api.get(`/protectoras/${id}`)
      .then(res => setProtectora(res.data))
      .catch(err => console.error(err));
  };

  // Comprobar si esta protectora es favorita del usuario al cargar
  useEffect(() => {
    fetchProtectora();

    if (user && user.rol === 'particular') {
      api.get('/favoritos')
        .then(res => {
          const esFav = res.data.some(fav => fav.id === parseInt(id));
          setIsFavorito(esFav);
        })
        .catch(err => console.error("Error al verificar favorita:", err));
    }
  }, [id, user]);

  // 🚀 NUEVA FUNCIÓN: Manejar el alta/baja de la protectora favorita
  const manejarFavorito = async () => {
    if (!user) {
      Swal.fire({
        title: '¡Acción Restringida! 🔒',
        text: 'Debes iniciar sesión con tu cuenta para añadir protectoras a tus favoritas.',
        icon: 'warning',
        confirmButtonColor: '#6f42c1'
      });
      return;
    }

    setCargandoFav(true);
    try {
      const res = await api.post('/favoritos/toggle', { protectora_id: id });
      setIsFavorito(res.data.is_favorito);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: res.data.message,
        showConfirmButton: false,
        timer: 2500
      });
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
      Swal.fire('Error', 'No se pudo actualizar tus favoritos.', 'error');
    } finally {
      setCargandoFav(false);
    }
  };

  const handleValorar = async (e) => {
    e.preventDefault();
    try {
      const datosPayload = { 
        puntuacion: parseInt(puntuacion), 
        comentario 
      };

      if (editingId) {
        await api.put(`/valoraciones/${editingId}`, datosPayload);
        Swal.fire('¡Éxito!', 'Valoración actualizada.', 'success');
      } else {
        await api.post(`/protectoras/${id}/valorar`, datosPayload);
        Swal.fire('¡Gracias!', 'Tu valoración ha sido registrada.', 'success');
      }
      setComentario('');
      setEditingId(null);
      fetchProtectora(); 
    } catch (err) {
      Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
    }
  };

  const borrarValoracion = async (valId) => {
    const result = await Swal.fire({ title: '¿Borrar comentario?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) {
      try {
        await api.delete(`/valoraciones/${valId}`);
        fetchProtectora();
      } catch (err) { Swal.fire('Error', 'No se pudo borrar.', 'error'); }
    }
  };

  const prepararEdicion = (v) => {
    setEditingId(v.id);
    setPuntuacion(v.puntuacion);
    setComentario(v.comentario);
  };

  const compartirPerfil = () => {
    if (navigator.share) {
      navigator.share({ title: `Conoce a ${protectora.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({ title: '¡Enlace copiado!', icon: 'success', timer: 2000, showConfirmButton: false });
    }
  };

  if (!protectora) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-huellitas" role="status"></div>
    </div>
  );

  const enAdopcion = protectora.animales?.filter(a => a.estado !== 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || [];
  const historialAdoptados = protectora.animales?.filter(a => a.estado === 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || [];

  return (
    <div className="container mt-4 mb-5 animate-up">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="text-decoration-none fw-medium text-secondary"><i className="bi bi-arrow-left me-2"></i>Volver al inicio</Link>
        <button onClick={compartirPerfil} className="btn btn-sm btn-light border rounded-pill px-3 shadow-sm text-dark"><i className="bi bi-share me-2 text-huellitas"></i>Compartir perfil</button>
      </div>
      
      <div className="card card-huellitas p-4 my-4 bg-white">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto d-flex align-items-center gap-3 flex-wrap">
            <img 
              src={sanearUrl(protectora.logo_url, FALLBACK_LOGO)} 
              className="rounded-circle shadow-sm" 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              alt={protectora.name}
            />
            <div>
              <h1 className="fw-bold mb-1 text-huellitas">{protectora.name}</h1>
              <p className="text-muted mb-0 Whitehead-small"><i className="bi bi-geo-alt-fill me-1 text-huellitas"></i>{protectora.direccion} | <i className="bi bi-envelope-fill me-1 text-huellitas"></i>{protectora.email}</p>
            </div>
          </div>

          {/* 🚀 BOTÓN INTEGRADO: Solo visible para usuarios no logueados o particulares normales */}
          {(!user || user.rol === 'particular') && (
            <div className="col-12 col-md-auto mt-3 mt-md-0">
              <button
                onClick={manejarFavorito}
                disabled={cargandoFav}
                className={`btn ${isFavorito ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2`}
              >
                {isFavorito ? <FaHeart /> : <FaRegHeart />}
                {isFavorito ? 'Quitar de favoritas' : 'Añadir a favoritas'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row align-items-center mb-4 border-bottom g-0">
        <div className="col-md-6 d-flex">
          <button onClick={() => setPestana('adopcion')} className={`btn btn-lg px-4 py-3 border-0 ${pestana === 'adopcion' ? 'text-huellitas border-bottom border-3 fw-bold' : 'text-muted'}`}>🐾 Adopción ({enAdopcion.length})</button>
          <button onClick={() => setPestana('historial')} className={`btn btn-lg px-4 py-3 border-0 ${pestana === 'historial' ? 'text-success border-bottom border-3 fw-bold' : 'text-muted'}`}>📜 Historial ({historialAdoptados.length})</button>
          <button onClick={() => setPestana('valoraciones')} className={`btn btn-lg px-4 py-3 border-0 ${pestana === 'valoraciones' ? 'text-warning border-bottom border-3 fw-bold' : 'text-muted'}`}>⭐ Opiniones</button>
        </div>
        <div className="col-md-6 p-2">
           <input className="form-control rounded-pill border px-3" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </div>

      <div className="row g-4">
        {pestana === 'valoraciones' ? (
          <div className="row w-100">
            <div className="col-md-6">
              {protectora.valoraciones?.map(v => (
                <div key={v.id} className="card p-3 mb-2 border-0 shadow-sm rounded-3">
                  <div className="d-flex justify-content-between"><strong>{v.user?.name}</strong><span>{'⭐'.repeat(v.puntuacion)}</span></div>
                  <p className="text-muted">{v.comentario}</p>
                  {user && user.id === v.user_id && (
                    <div className="d-flex gap-2"><button onClick={() => prepararEdicion(v)} className="btn btn-sm btn-outline-primary">Editar</button><button onClick={() => borrarValoracion(v.id)} className="btn btn-sm btn-outline-danger">Borrar</button></div>
                  )}
                </div>
              ))}
            </div>
            <div className="col-md-6">
              {user ? (
                <form onSubmit={handleValorar} className="card p-4 shadow-sm">
                  <h5>{editingId ? 'Editar valoración' : 'Deja tu valoración'}</h5>
                  <select className="form-select mb-2" value={puntuacion} onChange={(e) => setPuntuacion(e.target.value)}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} estrellas</option>)}</select>
                  <textarea className="form-control mb-2" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Tu opinión..."></textarea>
                  <button className="btn btn-huellitas w-100">{editingId ? 'Actualizar' : 'Enviar'}</button>
                </form>
              ) : <p>Inicia sesión para valorar.</p>}
            </div>
          </div>
        ) : (
          pestana === 'adopcion' ? enAdopcion.map(a => (
            <div className="col-md-3" key={a.id}>
              <Link to={`/animal/${a.id}`} className="card card-huellitas h-100 p-3 text-decoration-none bg-white">
                <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{width:'120px',height:'120px'}}>
                  <img src={sanearUrl(a.imagen_url, FALLBACK_ANIMAL)} className="w-100 h-100 object-fit-cover" alt={a.nombre} />
                </div>
                <h4 className="fw-bold text-dark text-center">{a.nombre}</h4>
                <span className="badge badge-huellitas py-2 w-100">Ver ficha</span>
              </Link>
            </div>
          )) : historialAdoptados.map(a => (
            <div className="col-md-3" key={a.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3 opacity-75">
                <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{width:'100px',height:'100px'}}>
                  <img src={sanearUrl(a.imagen_url, FALLBACK_ANIMAL)} className="w-100 h-100 object-fit-cover filter-grayscale" alt={a.nombre} />
                </div>
                <h5>{a.nombre}</h5>
                <span className="badge bg-success">Adoptado!</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}