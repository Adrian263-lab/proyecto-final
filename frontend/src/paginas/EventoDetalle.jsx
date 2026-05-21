import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
// Asegúrate de que la ruta coincida con la ubicación real de tu contexto
import { AuthContext } from '../contexto/AuthContext'; 

function EventoDetalle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Extraemos el usuario logueado desde el contexto
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    api.get(`/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al traer los detalles del evento:", error);
        setCargando(false);
      });
  }, [id]);

  // Función para manejar el borrado
  const handleDelete = async () => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y el evento se borrará permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, borrar evento',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/eventos/${id}`);
        
        Swal.fire({
          title: '¡Borrado!',
          text: 'El evento ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#6f42c1'
        });
        
        // Redirigir al inicio o al panel después de borrar
        navigate('/'); 
      } catch (error) {
        console.error("Error al borrar el evento:", error);
        Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
      }
    }
  };

  if (cargando) {
    return <div className="text-center p-5 text-xl font-semibold mt-5">Cargando detalles del evento...</div>;
  }

  if (!evento) {
    return (
      <div className="container text-center p-5 mt-5 border rounded bg-light">
        <p className="text-xl text-danger font-semibold fw-bold">El evento solicitado no existe.</p>
        <Link to="/" className="btn text-white mt-3" style={{ backgroundColor: '#6f42c1' }}>Volver a la Home</Link>
      </div>
    );
  }

  // Verificamos si el usuario actual tiene permisos para borrar
  const puedeBorrar = user && (user.id === evento.user_id || user.rol === 'admin');

  return (
    <div className="container mt-4 animate__animated animate__fadeIn" style={{ maxWidth: '900px' }}>
      <Link to="/" className="font-semibold hover:underline mb-4 inline-block fw-bold" style={{ color: '#6f42c1', textDecoration: 'none' }}>
        ← Volver al inicio
      </Link>

      <div className="card shadow-sm rounded-4 overflow-hidden border bg-white">
        <div style={{ width: '100%', height: '380px', backgroundColor: '#f3f0fc' }}>
          <img 
            src={evento.imagen_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200'} 
            alt={evento.titulo} 
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200';
            }}
          />
        </div>
        
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
            <span className="text-white px-3 py-1 rounded-pill text-sm fw-bold" style={{ backgroundColor: '#6f42c1' }}>
              🗓️ {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}
            </span>
            <span className="text-secondary fw-semibold">📍 {evento.ubicacion}</span>
          </div>

          <h1 className="card-title h2 fw-bold text-dark mb-4">{evento.titulo}</h1>
          
          <p className="card-text text-secondary leading-relaxed fs-5 mb-5" style={{ whiteSpace: 'pre-line' }}>
            {evento.descripcion}
          </p>

          <div className="border-top pt-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <p className="text-sm text-muted m-0">Organizado por:</p>
              <p className="fw-bold text-dark fs-5 m-0">{evento.protectora?.name || "Protectora Colaboradora"}</p>
            </div>
            
            <div className="d-flex gap-2">
              {/* Botón de Borrar (Renderizado Condicionalmente) */}
              {puedeBorrar && (
                <button 
                  onClick={handleDelete} 
                  className="btn btn-outline-danger px-4 py-2 rounded-pill fw-bold shadow-sm"
                >
                  <i className="bi bi-trash-fill me-1"></i> Eliminar Evento
                </button>
              )}

              <button className="btn text-white px-4 py-2 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: '#6f42c1' }}>
                Inscribirme / Contactar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetalle;