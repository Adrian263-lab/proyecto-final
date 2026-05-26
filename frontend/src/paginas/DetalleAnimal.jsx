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
  const [formAdopcion, setFormAdopcion] = useState({
    tipo_vivienda: 'Piso',
    tiene_jardin: false,
    otras_mascotas: '',
    horas_solo: 0,
    motivo: ''
  });

  useEffect(() => {
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error(err));
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
      await api.post('/adoptar', { ...formAdopcion, animal_id: parseInt(id) });
      setMostrarModal(false);
      Swal.fire({
        title: '¡Solicitud enviada! 🐾',
        text: 'La protectora revisará tu cuestionario.',
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });
    } catch (error) {
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
    // Reemplazada la clase de animación externa por tu .animate-up de App.css
    <div className="container mt-5 mb-5 animate-up">
      
      {/* Modal Cuestionario de Adopción */}
      {mostrarModal && (
        // Se añade una clase utilitaria de Bootstrap para el fondo oscuro (bg-dark bg-opacity-50) de forma nativa
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              {/* Encabezado del modal unificado con el degradado morado usando bg-huellitas */}
              <div className="modal-header bg-huellitas text-white border-0 p-4 rounded-top-4">
                <h5 className="modal-title fw-bold">📝 Cuestionario de Adopción</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)} aria-label="Cerrar"></button>
              </div>
              <div className="modal-body p-4 bg-white rounded-bottom-4">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Tipo de vivienda</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tipo_vivienda: e.target.value })}>
                      <option value="Piso">Piso</option>
                      <option value="Casa">Casa</option>
                      <option value="Chalet">Chalet</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Tienes otras mascotas?</label>
                    <input type="text" className="form-control rounded-pill" placeholder="Ej: Sí, un gato" onChange={(e) => setFormAdopcion({ ...formAdopcion, otras_mascotas: e.target.value })} required />
                  </div>
                  
                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Tienes jardín?</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tiene_jardin: e.target.value === 'true' })}>
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Horas que pasará solo al día</label>
                    <input type="number" className="form-control rounded-pill" min="0" max="24" onChange={(e) => setFormAdopcion({ ...formAdopcion, horas_solo: e.target.value })} required />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Motivo de adopción</label>
                    <textarea className="form-control rounded-4" rows="3" placeholder="Cuéntanos por qué quieres adoptar..." onChange={(e) => setFormAdopcion({ ...formAdopcion, motivo: e.target.value })} required />
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
          <img src={animal.imagen_url} className="img-fluid rounded-5 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt={animal.nombre} />
        </div>

        <div className="col-lg-6">
          {/* El badge de estado hereda las clases dinámicas de color */}
          <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 mb-3">
            {animal.estado}
          </span>
          <h1 className="display-4 fw-bold text-huellitas mb-2">{animal.nombre}</h1>
          <p className="lead text-secondary mb-4">{animal.descripcion}</p>

          <div className="card card-huellitas p-4 bg-white mb-4">
            <h5 className="fw-bold text-huellitas mb-3">Características</h5>
            <div className="row g-3 text-dark">
              <div className="col-6"><p className="mb-1"><strong>Especie:</strong> {animal.especie?.nombre || 'No especificada'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Raza:</strong> {animal.raza || 'Mestizo'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Sexo:</strong> {animal.sexo}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Protectora:</strong> {animal.user?.name}</p></div>
            </div>
          </div>

          <div className="d-flex gap-3">
            {animal.estado !== 'Adoptado' ? (
              <>
                {/* Botón principal unificado con .btn-huellitas para heredar el degradado naranja con volumen y hover */}
                <button onClick={() => setMostrarModal(true)} className="btn btn-huellitas text-white btn-lg px-5">
                  ¡Quiero adoptarlo!
                </button>
                {/* Botón secundario con el contorno morado estilizado mediante bootstrap-light y textos de marca */}
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