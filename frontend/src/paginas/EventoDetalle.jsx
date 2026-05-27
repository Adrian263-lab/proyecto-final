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
  const [inscrito, setInscrito] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => { console.error(error); setCargando(false); });

    if (user && user.rol === 'particular') {
      api.get(`/eventos/${id}/check-inscripcion`)
        .then(res => setInscrito(res.data.inscrito))
        .catch(() => { });
    }
  }, [id, user]);

  // Función para manejar la eliminación
  const manejarEliminacion = async () => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y borrará el evento definitivamente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar evento',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/eventos/${id}`);
        await Swal.fire('¡Eliminado!', 'El evento ha sido borrado.', 'success');
        navigate('/panel-protectora');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
      }
    }
  };

  const manejarInscripcion = async () => {
    if (!user) {
      Swal.fire({ title: 'Atención', text: 'Debes iniciar sesión', icon: 'warning', confirmButtonColor: '#6f42c1' });
      navigate('/login');
      return;
    }

    try {
      if (inscrito) {
        await api.delete(`/eventos/${id}/desinscribirse`);
        setInscrito(false);
        setEvento(prev => ({ ...prev, inscritos_count: prev.inscritos_count - 1 }));
        Swal.fire({ title: 'Desinscrito', text: 'Has cancelado tu inscripción.', icon: 'info', confirmButtonColor: '#6f42c1' });
      } else {
        await api.post(`/eventos/${id}/inscribirse`);
        setInscrito(true);
        setEvento(prev => ({ ...prev, inscritos_count: (prev.inscritos_count || 0) + 1 }));
        Swal.fire({ title: '¡Éxito!', text: 'Te has inscrito correctamente.', icon: 'success', confirmButtonColor: '#6f42c1' });
      }
    } catch (error) { 
      Swal.fire({ title: 'Error', text: 'No se pudo procesar la solicitud.', icon: 'error', confirmButtonColor: '#6f42c1' }); 
    }
  };

  if (cargando) return <div className="text-center p-5 mt-5 text-huellitas"><div className="spinner-border"></div></div>;
  if (!evento) return <div className="container text-center p-5 mt-5">Evento no encontrado.</div>;

  const puedeBorrar = user && (user.id === evento.user_id || user.rol === 'admin');

  return (
    <div className="container mt-4 mb-5 animate-up" style={{ maxWidth: '900px' }}>
      <Link to="/" className="fw-bold mb-4 d-block text-huellitas text-decoration-none">← Volver al inicio</Link>

      <div className="card shadow-lg rounded-4 border-0 overflow-hidden bg-white">
        <div className="position-relative" style={{ width: '100%', height: '350px' }}>
          <img src={evento.imagen_url} alt={evento.titulo} className="w-100 h-100 object-fit-cover" />
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap gap-2 mb-4">
            <span className="badge badge-huellitas px-3 py-2 shadow-sm">🗓️ {new Date(evento.fecha).toLocaleDateString()}</span>
            <span className="badge badge-huellitas px-3 py-2 shadow-sm">📍 {evento.ubicacion}</span>
            <span className="badge bg-light text-muted px-3 py-2 rounded-3 shadow-sm border">👥 {evento.inscritos_count || 0} inscritos</span>
          </div>

          <h1 className="h2 fw-bold text-dark mb-4">{evento.titulo}</h1>
          <p className="text-secondary fs-5 mb-5" style={{ lineHeight: '1.8' }}>{evento.descripcion}</p>

          <div className="border-top pt-4 d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted m-0 small">Organizado por:</p>
              <p className="fw-bold fs-5 m-0 text-huellitas">{evento.protectora?.name || "Protectora"}</p>
            </div>

            <div className="d-flex gap-2">
              {puedeBorrar && (
                <button onClick={manejarEliminacion} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
                  Eliminar
                </button>
              )}
              {user?.rol === 'particular' && (
                <button onClick={manejarInscripcion} className={`btn ${inscrito ? 'btn-outline-danger' : 'btn-huellitas'} rounded-pill px-4`}>
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