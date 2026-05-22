import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

function EventoDetalle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [inscrito, setInscrito] = useState(false); // Estado para la inscripción
  
  const { user } = useAuth(); 

  useEffect(() => {
    // 1. Cargar detalles
    api.get(`/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al traer los detalles del evento:", error);
        setCargando(false);
      });

    // 2. Verificar si el usuario ya está inscrito (solo si hay usuario logueado)
    if (user && user.rol === 'particular') {
      api.get(`/eventos/${id}/check-inscripcion`)
        .then(res => setInscrito(res.data.inscrito))
        .catch(() => {});
    }
  }, [id, user]);

  // Función para manejar la inscripción/desinscripción
  const manejarInscripcion = async () => {
    if (!user) {
      Swal.fire('Atención', 'Debes iniciar sesión para inscribirte', 'warning');
      navigate('/login');
      return;
    }

    try {
      if (inscrito) {
        await api.delete(`/eventos/${id}/desinscribirse`);
        setInscrito(false);
        Swal.fire('Desinscrito', 'Has cancelado tu inscripción al evento.', 'info');
      } else {
        await api.post(`/eventos/${id}/inscribirse`);
        setInscrito(true);
        Swal.fire('¡Éxito!', 'Te has inscrito correctamente al evento.', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo procesar tu solicitud.', 'error');
    }
  };

  const handleDelete = async () => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Sí, borrar evento'
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/eventos/${id}`);
        Swal.fire('¡Borrado!', 'El evento ha sido eliminado.', 'success');
        navigate('/'); 
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
      }
    }
  };

  if (cargando) return <div className="text-center p-5 mt-5">Cargando detalles...</div>;
  if (!evento) return <div className="container text-center p-5 mt-5">Evento no encontrado.</div>;

  const puedeBorrar = user && (user.id === evento.user_id || user.rol === 'admin');

  return (
    <div className="container mt-4 animate__animated animate__fadeIn" style={{ maxWidth: '900px' }}>
      <Link to="/" className="fw-bold mb-4 d-block" style={{ color: '#6f42c1', textDecoration: 'none' }}>← Volver al inicio</Link>

      <div className="card shadow-sm rounded-4 border bg-white">
        <div style={{ width: '100%', height: '380px', backgroundColor: '#f3f0fc' }}>
          <img src={evento.imagen_url} alt={evento.titulo} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        </div>
        
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap gap-3 mb-4">
            <span className="text-white px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#6f42c1' }}>
              🗓️ {new Date(evento.fecha).toLocaleDateString()}
            </span>
            <span className="text-secondary fw-semibold">📍 {evento.ubicacion}</span>
          </div>

          <h1 className="h2 fw-bold text-dark mb-4">{evento.titulo}</h1>
          <p className="text-secondary fs-5 mb-5">{evento.descripcion}</p>

          <div className="border-top pt-4 d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted m-0">Organizado por:</p>
              <p className="fw-bold fs-5 m-0">{evento.protectora?.name || "Protectora"}</p>
            </div>
            
            <div className="d-flex gap-2">
              {puedeBorrar && (
                <button onClick={handleDelete} className="btn btn-outline-danger rounded-pill px-4">Eliminar</button>
              )}
              
              {/* Solo mostrar botón inscripción si el usuario es particular */}
              {user?.rol === 'particular' && (
                <button 
                  onClick={manejarInscripcion} 
                  className={`btn ${inscrito ? 'btn-outline-danger' : 'btn-success'} rounded-pill px-4`}>
                  {inscrito ? 'Cancelar Inscripción' : 'Inscribirse al Evento'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetalle;