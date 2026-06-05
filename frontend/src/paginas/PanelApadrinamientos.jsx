import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelApadrinamientos: Muestra al usuario todos los animales que tiene apadrinados.
 * Permite la gestión de estos apadrinamientos, incluyendo la posibilidad de cancelar la ayuda mensual.
 */
function PanelApadrinamientos() {
  const [apadrinados, setApadrinados] = useState([]);
  const [cargando, setCargando] = useState(true);

  /**
   * Obtiene la lista de apadrinamientos activos del usuario autenticado.
   */
  const cargarApadrinamientos = () => {
    api.get('/mis-apadrinamientos')
      .then(res => {
        setApadrinados(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar tus apadrinamientos:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarApadrinamientos();
  }, []);

  /**
   * Gestiona la cancelación de un apadrinamiento tras confirmación del usuario.
   * @param {number} id - Identificador del registro de apadrinamiento.
   * @param {string} nombreAnimal - Nombre del animal para mostrar en la alerta.
   */
  const manejarCancelarApadrinamiento = async (id, nombreAnimal) => {
    const confirm = await Swal.fire({
      title: '¿Dejar de apadrinar?',
      text: `¿Seguro que deseas cancelar tu ayuda mensual para ${nombreAnimal}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar apadrinamiento',
      cancelButtonText: 'Mantener ayuda',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    });

    if (confirm.isConfirmed) {
      try {
        await api.post(`/apadrinar/${id}/cancelar`);
        
        await Swal.fire({
          title: 'Cancelado correctamente',
          text: 'El apadrinamiento se ha dado de baja.',
          icon: 'success',
          confirmButtonColor: '#6f42c1'
        });
        
        // Recarga la lista tras la cancelación exitosa
        cargarApadrinamientos();
      } catch (error) {
        Swal.fire('Error', 'No se pudo procesar la baja del apadrinamiento.', 'error');
      }
    }
  };

  if (cargando) return (
    <div className="text-center p-5 mt-5 text-huellitas">
        <div className="spinner-border"></div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5 animate-up" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-huellitas mb-0">❤️ Mis Apadrinamientos</h2>
        <Link to="/" className="btn btn-sm btn-light border text-huellitas rounded-pill px-3 fw-bold">
          Ver más animales →
        </Link>
      </div>

      {/* Renderizado condicional si no hay apadrinamientos activos */}
      {apadrinados.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-4 text-center bg-white text-muted">
          <i className="bi bi-heart-break text-huellitas display-4 mb-3"></i>
          <p className="fs-5 mb-0">Aún no has apadrinado a ningún animal de forma activa.</p>
          <p className="small text-secondary">¡Entra en la ficha de cualquier animal para apoyarlo!</p>
        </div>
      ) : (
        <div className="row g-4">
          {apadrinados.map(registro => {
            const animal = registro.animal || registro;
            
            return (
              <div key={registro.id} className="col-md-4 col-lg-3">
                <div className="card card-huellitas h-100 bg-white overflow-hidden d-flex flex-column">
                  {/* Contenedor de imagen */}
                  <div style={{ height: '180px' }} className="position-relative">
                    <img 
                      src={animal?.imagen_url || 'https://via.placeholder.com/400x300?text=🐱'} 
                      alt={animal?.nombre || 'Animal'} 
                      className="w-100 h-100 object-fit-cover"
                    />
                    {registro.cuota_mensual && (
                      <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark text-white rounded-pill px-3 py-2 bg-opacity-75">
                        {parseFloat(registro.cuota_mensual)} €/mes
                      </span>
                    )}
                  </div>
                  
                  {/* Detalles del animal */}
                  <div className="p-3 flex-grow-1 text-center">
                    <h4 className="fw-bold text-dark mb-1">{animal?.nombre || 'Animal'}</h4>
                    <p className="text-muted small mb-3">📍 {animal?.user?.name || 'Protectora Colaboradora'}</p>
                    
                    <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-1 mb-3">
                      {animal?.estado || 'En adopción'}
                    </span>
                  </div>

                  {/* Acciones del registro */}
                  <div className="px-3 pb-3 mt-auto d-flex flex-column gap-2">
                    <Link to={`/animal/${animal?.id}`} className="btn btn-huellitas w-100 py-2">
                      Ver ficha completa
                    </Link>
                    <button 
                      onClick={() => manejarCancelarApadrinamiento(registro.id, animal?.nombre)} 
                      className="btn btn-sm btn-outline-danger rounded-pill py-1 fw-bold"
                    >
                      ❌ Quitar apadrinamiento
                    </button>
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