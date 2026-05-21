import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function PanelNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const response = await api.get('/notificaciones');
      setNotificaciones(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setCargando(false);
    }
  };

  const marcarComoLeidas = async () => {
    try {
      await api.post('/notificaciones/marcar-leidas');
      setNotificaciones([]); // Las borramos de la vista
      Swal.fire('¡Listo!', 'Notificaciones marcadas como leídas.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudieron actualizar las notificaciones.', 'error');
    }
  };

  if (cargando) {
    return <div className="text-center mt-5"><div className="spinner-border" style={{ color: '#6f42c1' }}></div></div>;
  }

  return (
    <div className="container mt-4 animate__animated animate__fadeIn" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-dark"><i className="bi bi-bell-fill text-warning me-2"></i> Mis Notificaciones</h2>
        {notificaciones.length > 0 && (
          <button onClick={marcarComoLeidas} className="btn btn-sm btn-outline-secondary rounded-pill">
            <i className="bi bi-check2-all me-1"></i> Marcar todas como leídas
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="alert alert-light text-center py-5 border rounded-4 shadow-sm">
          <i className="bi bi-bell-slash text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3 text-secondary">No tienes notificaciones nuevas</h5>
          <p className="text-muted small">Te avisaremos cuando haya novedades de tus ahijados.</p>
        </div>
      ) : (
        <div className="list-group shadow-sm rounded-4">
          {notificaciones.map((notif) => (
            <div key={notif.id} className="list-group-item list-group-item-action d-flex gap-3 py-4 border-0 border-bottom">
              <img 
                src={notif.data.imagen_url || 'https://via.placeholder.com/150'} 
                alt="Animal" 
                className="rounded-circle object-fit-cover shadow-sm" 
                style={{ width: '60px', height: '60px' }} 
              />
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-1 fw-bold text-success">¡{notif.data.nombre} ha sido adoptado! 🎉</h6>
                  <p className="mb-1 text-secondary">{notif.data.mensaje}</p>
                  <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                </div>
                <div>
                  <Link to={`/animal/${notif.data.animal_id}`} className="btn btn-sm btn-light rounded-pill">Ver</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}