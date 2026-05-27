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

  // Estado completo que coincide con los campos de la base de datos
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
      .catch(err => console.error(err));
  }, [id]);

  const handleApadrinar = async () => {
    try {
      await api.post('/apadrinar', { animal_id: id });
      Swal.fire({ title: '¡Gracias!', text: 'Has apadrinado a este peludito.', icon: 'success', confirmButtonColor: '#6f42c1' });
    } catch (error) {
      Swal.fire({ title: 'Atención', text: error.response?.data?.message || 'Error al apadrinar', icon: 'info', confirmButtonColor: '#6f42c1' });
    }
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
        // Asegúrate de que los campos tienen los nombres correctos
        const payload = {
            ...formAdopcion,
            animal_id: parseInt(id),
            horas_solo: parseInt(formAdopcion.horas_solo) // Asegura que sea número
        };
        
        await api.post('/adoptar', payload);
        setMostrarModal(false);
        Swal.fire('¡Éxito!', 'Solicitud enviada.', 'success');
    } catch (error) {
        console.error(error.response?.data); // MIRA ESTO EN LA CONSOLA
        Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
    }
};

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  return (
    <div className="container mt-5 mb-5 animate-up">
      {/* Modal Cuestionario */}
      {mostrarModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-huellitas text-white p-4 rounded-top-4">
                <h5 className="modal-title fw-bold">📝 Cuestionario de Adopción</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body p-4 bg-white">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Tipo de vivienda</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tipo_vivienda: e.target.value })}>
                      <option value="Piso">Piso</option><option value="Casa">Casa</option><option value="Chalet">Chalet</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Teléfono</label>
                    <input type="tel" className="form-control rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, telefono: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">¿Otras mascotas?</label>
                    <input type="text" className="form-control rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, otras_mascotas: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">¿Tienes jardín?</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tiene_jardin: e.target.value === 'true' })}>
                      <option value="false">No</option><option value="true">Sí</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Horas que pasará solo</label>
                    <input type="number" className="form-control rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, horas_solo: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Experiencia previa</label>
                    <textarea className="form-control rounded-4" rows="2" onChange={(e) => setFormAdopcion({ ...formAdopcion, experiencia: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-1">Motivo</label>
                    <textarea className="form-control rounded-4" rows="2" onChange={(e) => setFormAdopcion({ ...formAdopcion, motivo: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-huellitas text-white w-100 rounded-pill">Enviar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ficha Animal */}
      <div className="row g-5">
        <div className="col-lg-6">
          <img src={animal.imagen_url} className="img-fluid rounded-5 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} />
        </div>
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold text-huellitas">{animal.nombre}</h1>
          <p className="lead text-secondary">{animal.descripcion}</p>
          <div className="d-flex gap-3 mt-4">
            {animal.estado !== 'Adoptado' ? (
              <>
                <button onClick={() => setMostrarModal(true)} className="btn btn-huellitas text-white btn-lg px-5">¡Quiero adoptarlo!</button>
                <button onClick={handleApadrinar} className="btn btn-lg btn-light border text-huellitas rounded-pill px-4 fw-bold">Apadrinar</button>
              </>
            ) : <div className="alert alert-success rounded-pill w-100 text-center">🎉 ¡Ya tiene familia!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}