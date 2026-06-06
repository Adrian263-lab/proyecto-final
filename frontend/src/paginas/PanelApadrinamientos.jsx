import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente PanelApadrinamientos
 * Panel de usuario (Particular) para la gestión de donaciones recurrentes.
 * Permite visualizar el estado de los animales apadrinados y cancelar suscripciones activas.
 */
function PanelApadrinamientos() {
  const [apadrinados, setApadrinados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop';

  /**
   * Inicialización del componente.
   * Obtiene la relación de apadrinamientos del usuario autenticado.
   */
  useEffect(() => {
    const cargarApadrinamientos = async () => {
      try {
        const res = await api.get('/mis-apadrinamientos');
        setApadrinados(res.data);
      } catch (err) {
        console.error("Fallo al descargar el historial de apadrinamientos:", err);
      } finally {
        setCargando(false);
      }
    };

    cargarApadrinamientos();
  }, []);

  /**
   * Ejecuta la lógica de cancelación de una suscripción de apadrinamiento.
   * @param {number} id - Clave primaria del registro en la tabla pivote de apadrinamientos.
   * @param {string} nombreAnimal - Nombre del animal para feedback conversacional.
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
        
        // Actualización optimista de UI: retiramos el elemento de la lista local
        setApadrinados(prev => prev.filter(registro => registro.id !== id));

        Swal.fire({
          title: 'Cancelado correctamente',
          text: 'El apadrinamiento se ha dado de baja del sistema.',
          icon: 'success',
          confirmButtonColor: '#6f42c1'
        });
      } catch (error) {
        console.error("Fallo transaccional al cancelar apadrinamiento:", error);
        Swal.fire('Error', 'No se pudo procesar la baja. Inténtalo de nuevo.', 'error');
      }
    }
  };

  // Renderizado bloqueante durante la carga de red
  if (cargando) {
    return (
      <div className="text-center p-5 mt-5 text-huellitas" aria-label="Cargando apadrinamientos">
          <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
          </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 animate-up" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-huellitas mb-0">❤️ Mis Apadrinamientos</h2>
        <Link to="/" className="btn btn-sm btn-light border text-huellitas rounded-pill px-3 fw-bold">
          Explorar más animales →
        </Link>
      </div>

      {/* Renderizado de estado vacío (Empty State Pattern) */}
      {apadrinados.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 rounded-4 text-center bg-white text-muted">
          <i className="bi bi-heart-break text-huellitas display-4 mb-3" aria-hidden="true"></i>
          <p className="fs-5 mb-0">Aún no has apadrinado a ningún animal de forma activa.</p>
          <p className="small text-secondary mt-2">Visita la ficha de cualquier animal para brindarle tu apoyo mensual.</p>
        </div>
      ) : (
        <div className="row g-4">
          {apadrinados.map(registro => {
            // Desenvolvimiento adaptativo para mitigar diferencias en la estructura JSON devuelta por el ORM
            const animal = registro.animal || registro;
            
            return (
              <div key={registro.id} className="col-md-4 col-lg-3">
                <div className="card card-huellitas h-100 bg-white overflow-hidden d-flex flex-column border-0 shadow-sm">
                  
                  {/* Aspect Ratio persistente para el contenedor de imagen */}
                  <div style={{ height: '180px' }} className="position-relative">
                    <img 
                      src={animal?.imagen_url && !animal.imagen_url.includes('loremflickr') ? animal.imagen_url : FALLBACK_IMAGE} 
                      alt={`Fotografía de ${animal?.nombre || 'Animal apadrinado'}`} 
                      className="w-100 h-100 object-fit-cover"
                    />
                    {registro.cuota_mensual && (
                      <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark text-white rounded-pill px-3 py-2 bg-opacity-75 shadow-sm">
                        {parseFloat(registro.cuota_mensual)} €/mes
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 flex-grow-1 text-center">
                    <h4 className="fw-bold text-dark mb-1 text-truncate" title={animal?.nombre}>
                        {animal?.nombre || 'Animal'}
                    </h4>
                    <p className="text-muted small mb-3 text-truncate" title={animal?.user?.name}>
                        📍 {animal?.user?.name || 'Protectora Colaboradora'}
                    </p>
                    
                    <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-1 mb-3 shadow-sm">
                      {animal?.estado || 'En adopción'}
                    </span>
                  </div>

                  {/* Área de interacciones del Card */}
                  <div className="px-3 pb-3 mt-auto d-flex flex-column gap-2">
                    <Link to={`/animal/${animal?.id}`} className="btn btn-huellitas w-100 py-2 rounded-pill fw-bold shadow-sm text-white">
                      Ver ficha completa
                    </Link>
                    <button 
                      onClick={() => manejarCancelarApadrinamiento(registro.id, animal?.nombre)} 
                      className="btn btn-sm btn-outline-danger rounded-pill py-2 fw-bold"
                      aria-label={`Dejar de apadrinar a ${animal?.nombre}`}
                    >
                      <i className="bi bi-x-circle me-1" aria-hidden="true"></i> Cancelar donación
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