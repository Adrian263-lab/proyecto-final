import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

export default function DetalleAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado completo que coincide exactamente con los campos de la base de datos
  const [formAdopcion, setFormAdopcion] = useState({
    tipo_vivienda: 'Piso',
    tiene_jardin: false,
    otras_mascotas: '',
    horas_solo: '',
    motivo: '',
    telefono: '',
    experiencia: ''
  });

  useEffect(() => {
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error("Error al obtener los detalles del animal:", err));
  }, [id]);

  const handleApadrinar = async () => {
    try {
      await api.post('/apadrinar', { animal_id: id });
      Swal.fire({
        title: '¡Gracias!',
        text: 'Has apadrinado a este peludito.',
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });
    } catch (error) {
      Swal.fire({
        title: 'Atención',
        text: error.response?.data?.message || 'Error al apadrinar',
        icon: 'info',
        confirmButtonColor: '#6f42c1'
      });
    }
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formAdopcion,
        animal_id: parseInt(id),
        horas_solo: parseInt(formAdopcion.horas_solo) // Asegura transferencia de tipo numérico
      };
      
      await api.post('/adoptar', payload);
      setMostrarModal(false);
      Swal.fire({
        title: '¡Éxito! 🐾',
        text: 'Solicitud enviada correctamente. La protectora revisará tu cuestionario.',
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar la solicitud. Revisa que todos los campos estén completos.',
        icon: 'error',
        confirmButtonColor: '#6f42c1'
      });
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  return (
    <div className="container mt-5 mb-5 animate-up">
      
      {/* Modal Cuestionario Extendida */}
      {mostrarModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-huellitas text-white border-0 p-4 rounded-top-4">
                <h5 className="modal-title fw-bold">📝 Cuestionario de Adopción</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body p-4 bg-white rounded-bottom-4">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Tipo de vivienda</label>
                    <select className="form-select rounded-pill" value={formAdopcion.tipo_vivienda} onChange={(e) => setFormAdopcion({ ...formAdopcion, tipo_vivienda: e.target.value })}>
                      <option value="Piso">Piso</option>
                      <option value="Casa">Casa</option>
                      <option value="Chalet">Chalet</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Teléfono de contacto</label>
                    <input type="tel" className="form-control rounded-pill" placeholder="Ej: 600123456" onChange={(e) => setFormAdopcion({ ...formAdopcion, telefono: e.target.value })} required />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Otras mascotas en casa?</label>
                    <input type="text" className="form-control rounded-pill" placeholder="Ej: Sí, un perro de 3 años" onChange={(e) => setFormAdopcion({ ...formAdopcion, otras_mascotas: e.target.value })} required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Tienes jardín o patio exterior?</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tiene_jardin: e.target.value === 'true' })}>
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Horas que pasará solo al día</label>
                    <input type="number" className="form-control rounded-pill" min="0" max="24" placeholder="Ej: 4" onChange={(e) => setFormAdopcion({ ...formAdopcion, horas_solo: e.target.value })} required />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Experiencia previa con animales</label>
                    <textarea className="form-control rounded-4" rows="2" placeholder="Cuéntanos si has tenido animales antes..." onChange={(e) => setFormAdopcion({ ...formAdopcion, experiencia: e.target.value })} required />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Por qué deseas adoptar a este peludito?</label>
                    <textarea className="form-control rounded-4" rows="2" placeholder="Escribe aquí tus motivos..." onChange={(e) => setFormAdopcion({ ...formAdopcion, motivo: e.target.value })} required />
                  </div>

                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-huellitas text-white rounded-pill px-4">Enviar Cuestionario</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal de la Ficha */}
      <div className="row g-5 align-items-start">
        <div className="col-lg-6">
          <img 
            src={animal.imagen_url || 'https://via.placeholder.com/500x500?text=Huellitas'} 
            className="img-fluid rounded-5 shadow-lg w-100" 
            style={{ maxHeight: '500px', objectFit: 'cover' }} 
            alt={animal.nombre || 'Peludito'} 
          />
        </div>

        <div className="col-lg-6">
          {/* Badge del estado recuperado con estilos globales */}
          <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 mb-3 d-inline-block">
            {animal.estado || 'En adopción'}
          </span>
          
          <h1 className="display-4 fw-bold text-huellitas mb-2">{animal.nombre}</h1>
          <p className="lead text-secondary mb-4">{animal.descripcion || 'Sin descripción disponible.'}</p>

          {/* Tarjeta de Características Blindada */}
          <div className="card card-huellitas p-4 bg-white mb-4 shadow-sm">
            <h5 className="fw-bold text-huellitas mb-3">Características</h5>
            <div className="row g-3 text-dark">
              <div className="col-6">
                <p className="mb-1">
                  <strong>Especie:</strong> {animal.especie?.nombre || animal.especie_nombre || 'No especificada'}
                </p>
              </div>
              <div className="col-6">
                <p className="mb-1">
                  <strong>Raza:</strong> {animal.raza || 'Mestizo'}
                </p>
              </div>
              <div className="col-6">
                <p className="mb-1">
                  <strong>Sexo:</strong> {animal.sexo || 'No especificado'}
                </p>
              </div>
              <div className="col-6">
                <p className="mb-1">
                  <strong>Protectora:</strong> {animal.user?.name || animal.protectora_nombre || 'Protectora Huellitas'}
                </p>
              </div>
            </div>
          </div>

          {/* Botonera de acciones unificada */}
          <div className="d-flex gap-3 mt-4">
            {animal.estado !== 'Adoptado' ? (
              <>
                <button onClick={() => setMostrarModal(true)} className="btn btn-huellitas text-white btn-lg px-5">
                  ¡Quiero adoptarlo!
                </button>
                <button onClick={handleApadrinar} className="btn btn-lg btn-light border text-huellitas rounded-pill px-4 fw-bold">
                  Apadrinar
                </button>
              </>
            ) : (
              <div className="alert alert-success rounded-pill fw-bold w-100 text-center shadow-sm m-0">
                🎉 ¡Ya tiene familia!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}