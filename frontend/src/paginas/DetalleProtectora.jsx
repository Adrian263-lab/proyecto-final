import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from "../contexto/AuthContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 
import MapaUbicacion from '../componentes/MapaUbicacion';

/**
 * Componente DetalleProtectora
 * Muestra la ficha pública de una protectora de animales.
 * Gestiona un sistema de pestañas para visualizar animales en adopción, 
 * historial de éxito, valoraciones CRUD y geolocalización.
 */
function DetalleProtectora() {
  const { id } = useParams();
  const { user } = useAuth();
  const [protectora, setProtectora] = useState(null);
  
  // Estado para el enrutamiento interno basado en UI (Pestañas)
  const [pestana, setPestana] = useState('adopcion');
  
  // Estado para el filtrado en tiempo real (Búsqueda por nombre)
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para gestión completa del CRUD de valoraciones
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Estados para el sistema de favoritos (Relación N:M)
  const [isFavorito, setIsFavorito] = useState(false);
  const [cargandoFav, setCargandoFav] = useState(false);

  // Imágenes de respaldo (Fallbacks) para recursos externos rotos o ausentes
  const FALLBACK_ANIMAL = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop';
  const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop';

  /**
   * Saneamiento preventivo de URLs.
   * Evita inyección de imágenes no deseadas o servicios de placeholder bloqueados por CORS.
   */
  const sanearUrl = (url, fallback) => {
    if (!url || url.includes('loremflickr.com')) {
      return fallback;
    }
    return url;
  };

  /**
   * Obtiene la información completa del grafo de la protectora (Incluyendo relaciones).
   */
  const fetchProtectora = async () => {
    try {
        const res = await api.get(`/protectoras/${id}`);
        setProtectora(res.data);
    } catch (err) {
        console.error("Fallo de red al obtener la ficha de la protectora:", err);
    }
  };

  /**
   * Efecto de inicialización.
   * Carga el perfil y comprueba la persistencia del estado "Favorito" si hay sesión activa.
   */
  useEffect(() => {
    fetchProtectora();

    const comprobarFavorito = async () => {
        try {
            const res = await api.get('/favoritos');
            // Verificación funcional del array de relaciones
            const esFav = res.data.some(fav => fav.id === parseInt(id));
            setIsFavorito(esFav);
        } catch (err) {
            console.error("Error al verificar el estado de favoritos:", err);
        }
    };

    // Validación de seguridad de capa 1: Solo perfiles 'particular' manejan favoritos
    if (user && user.rol === 'particular') {
        comprobarFavorito();
    }
  }, [id, user]);

  /**
   * Mutador asíncrono para la tabla pivot de favoritos.
   */
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
      console.error("Fallo de integridad al actualizar favoritos:", err);
      Swal.fire('Error', 'No se pudo actualizar tus favoritos.', 'error');
    } finally {
      setCargandoFav(false);
    }
  };

  /**
   * Procesamiento transaccional de valoraciones (Creación o Actualización).
   */
  const handleValorar = async (e) => {
    e.preventDefault();
    try {
      const datosPayload = { 
        puntuacion: parseInt(puntuacion), 
        comentario 
      };

      // Enrutamiento condicional de la petición HTTP según el estado del componente
      if (editingId) {
        await api.put(`/valoraciones/${editingId}`, datosPayload);
        Swal.fire('¡Éxito!', 'Valoración actualizada.', 'success');
      } else {
        await api.post(`/protectoras/${id}/valorar`, datosPayload);
        Swal.fire('¡Gracias!', 'Tu valoración ha sido registrada.', 'success');
      }
      
      // Limpieza de estado y sincronización manual de datos
      setComentario('');
      setEditingId(null);
      fetchProtectora(); 
    } catch (err) {
      Swal.fire('Error', 'No se pudo procesar la solicitud.', 'error');
    }
  };

  /**
   * Acción destructiva para valoraciones propias.
   */
  const borrarValoracion = async (valId) => {
    const result = await Swal.fire({ title: '¿Borrar comentario?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) {
      try {
        await api.delete(`/valoraciones/${valId}`);
        fetchProtectora();
      } catch (err) { 
        Swal.fire('Error', 'No se pudo borrar la valoración.', 'error'); 
      }
    }
  };

  /**
   * Prepara el formulario de valoraciones para modo edición.
   */
  const prepararEdicion = (v) => {
    setEditingId(v.id);
    setPuntuacion(v.puntuacion);
    setComentario(v.comentario);
  };

  /**
   * Uso avanzado de APIs nativas del navegador (Web Share API).
   */
  const compartirPerfil = () => {
    if (navigator.share) {
      navigator.share({ title: `Conoce a ${protectora.name}`, url: window.location.href });
    } else {
      // Fallback seguro al portapapeles si el navegador (ej. desktop) no soporta Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({ title: '¡Enlace copiado al portapapeles!', icon: 'success', timer: 2000, showConfirmButton: false });
    }
  };

  // Patrón Guard: Previene renderizados con datos vacíos y muestra estado de carga
  if (!protectora) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-huellitas" role="status">
         <span className="visually-hidden">Cargando perfil...</span>
      </div>
    </div>
  );

  // Memoria en Renderizado: Filtrado reactivo local O(n) que evita recargas al servidor
  const enAdopcion = protectora.animales?.filter(a => a.estado !== 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || [];
  const historialAdoptados = protectora.animales?.filter(a => a.estado === 'Adoptado' && a.nombre.toLowerCase().includes(busqueda.toLowerCase())) || [];

  return (
    <div className="container mt-4 mb-5 animate-up">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="text-decoration-none fw-medium text-secondary">
            <i className="bi bi-arrow-left me-2"></i>Volver al inicio
        </Link>
        <button onClick={compartirPerfil} className="btn btn-sm btn-light border rounded-pill px-3 shadow-sm text-dark">
            <i className="bi bi-share me-2 text-huellitas"></i>Compartir perfil
        </button>
      </div>
      
      {/* Header de la Protectora */}
      <div className="card card-huellitas p-4 my-4 bg-white">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto d-flex align-items-start gap-4 flex-wrap">
            <img 
              src={sanearUrl(protectora.logo_url, FALLBACK_LOGO)} 
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_LOGO; }} // 🚀 FIX LOGOTIPO
              className="rounded-circle shadow-sm mt-2" 
              style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
              alt={`Logotipo de ${protectora.name}`}
            />
            <div style={{ maxWidth: '600px' }}>
              <h1 className="fw-bold mb-1 text-huellitas">{protectora.name}</h1>
              <p className="text-muted mb-3 small">
                <i className="bi bi-geo-alt-fill me-1 text-huellitas"></i>{protectora.direccion || 'Sin dirección'} | 
                <i className="bi bi-envelope-fill me-1 ms-2 text-huellitas"></i>{protectora.email}
              </p>
              
              {/* DESCRIPCIÓN RENDERIZADA AQUÍ */}
              {protectora.descripcion && (
                <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: '0.95rem' }}>
                  {protectora.descripcion}
                </p>
              )}
            </div>
          </div>

          {(!user || user.rol === 'particular') && (
            <div className="col-12 col-md-auto mt-3 mt-md-0">
              <button
                onClick={manejarFavorito}
                disabled={cargandoFav}
                className={`btn ${isFavorito ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2`}
                aria-pressed={isFavorito}
              >
                {isFavorito ? <FaHeart aria-hidden="true"/> : <FaRegHeart aria-hidden="true"/>}
                {isFavorito ? 'Quitar de favoritas' : 'Añadir a favoritas'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="row align-items-center mb-4 border-bottom g-0" role="tablist">
        <div className="col-md-8 d-flex flex-wrap">
          <button 
             role="tab"
             aria-selected={pestana === 'adopcion'}
             onClick={() => setPestana('adopcion')} 
             className={`btn btn-lg px-3 py-3 border-0 ${pestana === 'adopcion' ? 'text-huellitas border-bottom border-3 fw-bold' : 'text-muted'}`}>🐾 Adopción ({enAdopcion.length})</button>
          <button 
             role="tab"
             aria-selected={pestana === 'historial'}
             onClick={() => setPestana('historial')} 
             className={`btn btn-lg px-3 py-3 border-0 ${pestana === 'historial' ? 'text-success border-bottom border-3 fw-bold' : 'text-muted'}`}>📜 Historial ({historialAdoptados.length})</button>
          <button 
             role="tab"
             aria-selected={pestana === 'valoraciones'}
             onClick={() => setPestana('valoraciones')} 
             className={`btn btn-lg px-3 py-3 border-0 ${pestana === 'valoraciones' ? 'text-warning border-bottom border-3 fw-bold' : 'text-muted'}`}>⭐ Opiniones</button>
          
          {protectora.latitud && protectora.longitud && (
            <button 
               role="tab"
               aria-selected={pestana === 'ubicacion'}
               onClick={() => setPestana('ubicacion')} 
               className={`btn btn-lg px-3 py-3 border-0 ${pestana === 'ubicacion' ? 'text-info border-bottom border-3 fw-bold' : 'text-muted'}`}>📍 Ubicación</button>
          )}
        </div>
        
        {/* Barra de búsqueda integrada y oculta si estamos en mapa o comentarios */}
        {(pestana === 'adopcion' || pestana === 'historial') && (
            <div className="col-md-4 p-2">
               <input 
                  type="search"
                  className="form-control rounded-pill border px-3" 
                  placeholder="Buscar animal..." 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)} 
                  aria-label="Buscar animales de esta protectora"
               />
            </div>
        )}
      </div>

      {/* Renderizado dinámico de contenido por pestaña (Enrutamiento UI Virtual) */}
      <div className="row g-4" role="tabpanel">
        {pestana === 'ubicacion' ? (
          <div className="col-12 animate-up">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
               <h4 className="fw-bold text-huellitas mb-3">Dónde encontrarnos</h4>
               <p className="text-muted mb-4"><i className="bi bi-geo-alt-fill me-2 text-huellitas"></i>{protectora.direccion}</p>
               
               <MapaUbicacion 
                  latitud={protectora.latitud} 
                  longitud={protectora.longitud} 
                  nombre={protectora.name} 
               />
            </div>
          </div>
        ) : pestana === 'valoraciones' ? (
          <div className="row w-100 animate-up m-0">
            <div className="col-md-6 px-0 pe-md-3">
              {protectora.valoraciones?.length === 0 ? (
                 <p className="text-muted fst-italic">Aún no hay valoraciones. ¡Sé el primero en opinar!</p>
              ) : (
                protectora.valoraciones?.map(v => (
                  <div key={v.id} className="card p-3 mb-2 border-0 shadow-sm rounded-3">
                    <div className="d-flex justify-content-between">
                        <strong>{v.user?.name}</strong>
                        <span aria-label={`${v.puntuacion} estrellas`}>{'⭐'.repeat(v.puntuacion)}</span>
                    </div>
                    <p className="text-muted mt-2">{v.comentario}</p>
                    {user && user.id === v.user_id && (
                      <div className="d-flex gap-2 mt-2">
                          <button onClick={() => prepararEdicion(v)} className="btn btn-sm btn-outline-primary">Editar</button>
                          <button onClick={() => borrarValoracion(v.id)} className="btn btn-sm btn-outline-danger">Borrar</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="col-md-6 mt-4 mt-md-0 px-0 ps-md-3">
              {user ? (
                <form onSubmit={handleValorar} className="card p-4 shadow-sm border-0 rounded-4">
                  <h5 className="fw-bold text-huellitas mb-3">{editingId ? 'Editar valoración' : 'Deja tu valoración'}</h5>
                  <label htmlFor="puntos" className="visually-hidden">Puntuación</label>
                  <select id="puntos" className="form-select mb-3 rounded-3" value={puntuacion} onChange={(e) => setPuntuacion(e.target.value)}>
                      {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} estrellas</option>)}
                  </select>
                  <label htmlFor="resena" className="visually-hidden">Comentario</label>
                  <textarea id="resena" className="form-control mb-3 rounded-3" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Tu opinión sobre esta protectora..." required></textarea>
                  <button type="submit" className="btn btn-huellitas w-100 py-2 fw-bold">{editingId ? 'Actualizar' : 'Enviar Valoración'}</button>
                </form>
              ) : <p className="text-muted alert alert-light text-center border">Inicia sesión para dejar una valoración.</p>}
            </div>
          </div>
        ) : (
          pestana === 'adopcion' ? (
              enAdopcion.length > 0 ? (
                  enAdopcion.map(a => (
                    <div className="col-md-3 animate-up" key={a.id}>
                      <Link to={`/animal/${a.id}`} className="card card-huellitas h-100 p-3 text-decoration-none bg-white">
                        <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{width:'120px',height:'120px'}}>
                          <img 
                            src={sanearUrl(a.imagen_url, FALLBACK_ANIMAL)} 
                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_ANIMAL; }} // 🚀 FIX ANIMAL
                            className="w-100 h-100 object-fit-cover" 
                            alt={`Foto de ${a.nombre}`} 
                          />
                        </div>
                        <h4 className="fw-bold text-dark text-center">{a.nombre}</h4>
                        <span className="badge badge-huellitas py-2 w-100 mt-auto">Ver ficha</span>
                      </Link>
                    </div>
                  ))
              ) : (
                  <p className="text-muted text-center w-100 mt-4">No se han encontrado animales en adopción.</p>
              )
          ) : (
              historialAdoptados.length > 0 ? (
                  historialAdoptados.map(a => (
                    <div className="col-md-3 animate-up" key={a.id}>
                      <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3 opacity-75">
                        <div className="mb-3 mx-auto overflow-hidden rounded-circle" style={{width:'100px',height:'100px'}}>
                          <img 
                            src={sanearUrl(a.imagen_url, FALLBACK_ANIMAL)} 
                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_ANIMAL; }} // 🚀 FIX ANIMAL HISTORIAL
                            className="w-100 h-100 object-fit-cover filter-grayscale" 
                            alt={`Foto de ${a.nombre}`} 
                          />
                        </div>
                        <h5 className="fw-bold text-dark">{a.nombre}</h5>
                        <span className="badge bg-success mt-auto">Adoptado!</span>
                      </div>
                    </div>
                  ))
              ) : (
                  <p className="text-muted text-center w-100 mt-4">Aún no hay registro de animales adoptados.</p>
              )
          )
        )}
      </div>
    </div>
  );
}

export default DetalleProtectora;