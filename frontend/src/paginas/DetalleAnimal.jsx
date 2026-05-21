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
      Swal.fire('¡Gracias!', 'Has apadrinado a este peludito.', 'success');
    } catch (error) {
      Swal.fire('Atención', error.response?.data?.message || 'Error al apadrinar', 'info');
    }
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/adoptar', { ...formAdopcion, animal_id: parseInt(id) });
      setMostrarModal(false);
      Swal.fire('¡Solicitud enviada! 🐾', 'La protectora revisará tu cuestionario.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      {/* Modal */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-huellitas text-white rounded-top-4">
                <h5 className="modal-title fw-bold">Cuestionario de Adopción</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="mb-3">
                    <label className="fw-bold">Tipo de vivienda</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({...formAdopcion, tipo_vivienda: e.target.value})}>
                      <option>Piso</option><option>Casa</option><option>Chalet</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">¿Tienes otras mascotas?</label>
                    <input type="text" className="form-control rounded-pill" placeholder="Ej: Sí, un gato" onChange={(e) => setFormAdopcion({...formAdopcion, otras_mascotas: e.target.value})} required />
                  </div>
                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-huellitas rounded-pill px-4">Enviar Solicitud</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="row g-5 align-items-start">
        <div className="col-lg-6">
          <img src={animal.imagen_url} className="img-fluid rounded-5 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt={animal.nombre} />
        </div>
        
        <div className="col-lg-6">
          <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 mb-2">{animal.estado}</span>
          <h1 className="display-4 fw-bold text-huellitas">{animal.nombre}</h1>
          <p className="lead text-muted">{animal.descripcion}</p>
          
          {/* Información Detallada Completa */}
          <div className="mt-4">
            <h5 className="fw-bold text-huellitas mb-3">Características</h5>
            <div className="row g-3">
              <div className="col-6"><p className="mb-1"><strong>Especie:</strong> {animal.especie?.nombre}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Raza:</strong> {animal.raza || 'No especificada'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Sexo:</strong> {animal.sexo}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Protectora:</strong> {animal.user?.name}</p></div>
            </div>
          </div>

          <div className="mt-4 d-flex gap-3">
            {animal.estado !== 'Adoptado' ? (
              <>
                <button onClick={() => setMostrarModal(true)} className="btn btn-naranja text-white btn-lg rounded-pill px-5 shadow">¡Quiero adoptarlo!</button>
                <button onClick={handleApadrinar} className="btn btn-outline-huellitas btn-lg rounded-pill px-4">Apadrinar</button>
              </>
            ) : <div className="alert alert-success rounded-pill fw-bold w-100 text-center">¡Ya tiene familia!</div>}
          </div>
        </div>
      </div>

      <style>{`
        .text-huellitas { color: #6f42c1; }
        .btn-huellitas { background-color: #6f42c1; color: white; }
        .btn-outline-huellitas { border: 2px solid #6f42c1; color: #6f42c1; }
        .btn-naranja { background-color: #fd7e14; }
        .bg-naranja-claro { background-color: #ffe8cc; }
        .text-naranja { color: #d67115; }
      `}</style>
    </div>
  );
}