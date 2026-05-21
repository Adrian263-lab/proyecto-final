import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

export default function DetalleAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Estado completo que coincide con la validación de tu AdopcionController
  const [formAdopcion, setFormAdopcion] = useState({
    tipo_vivienda: 'Piso',
    tiene_jardin: false,
    otras_mascotas: '',
    horas_solo: '',
    motivo: ''
  });

  useEffect(() => {
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error("Error cargando animal:", err));
  }, [id]);

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      // Enviamos el objeto completo incluyendo animal_id
      await api.post('/adoptar', { 
        ...formAdopcion, 
        animal_id: parseInt(id),
        tiene_jardin: Boolean(formAdopcion.tiene_jardin),
        horas_solo: Number(formAdopcion.horas_solo)
      });
      
      setMostrarModal(false);
      Swal.fire('¡Solicitud enviada! 🐾', 'La protectora revisará tu cuestionario.', 'success');
    } catch (error) {
      console.error("Error detallado:", error.response?.data);
      Swal.fire('Error', 'No se pudo enviar. Revisa que todos los campos estén completos.', 'error');
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      {/* Modal de Adopción */}
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
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tipo_vivienda: e.target.value })}>
                      <option value="Piso">Piso</option><option value="Casa">Casa</option><option value="Chalet">Chalet</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">¿Tienes jardín?</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tiene_jardin: e.target.value === 'true' })}>
                      <option value="false">No</option><option value="true">Sí</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">Otras mascotas</label>
                    <input type="text" className="form-control rounded-pill" placeholder="Ej: Sí, un gato" required onChange={(e) => setFormAdopcion({ ...formAdopcion, otras_mascotas: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">Horas que pasará solo al día</label>
                    <input type="number" className="form-control rounded-pill" placeholder="Ej: 4" required onChange={(e) => setFormAdopcion({ ...formAdopcion, horas_solo: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold">Motivo de adopción</label>
                    <textarea className="form-control rounded-4" placeholder="¿Por qué quieres adoptar?" required onChange={(e) => setFormAdopcion({ ...formAdopcion, motivo: e.target.value })} />
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

      {/* Contenido principal del animal (sin cambios...) */}
      <div className="row g-5 align-items-start">
         <div className="col-lg-6">
           <img src={animal.imagen_url} className="img-fluid rounded-5 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt={animal.nombre} />
         </div>
         <div className="col-lg-6">
           <h1 className="display-4 fw-bold text-huellitas">{animal.nombre}</h1>
           <p className="lead text-muted">{animal.descripcion}</p>
           <button onClick={() => setMostrarModal(true)} className="btn btn-naranja text-white btn-lg rounded-pill px-5">¡Quiero adoptarlo!</button>
         </div>
      </div>
      <style>{`.text-huellitas { color: #6f42c1; } .btn-huellitas { background-color: #6f42c1; color: white; } .btn-naranja { background-color: #fd7e14; }`}</style>
    </div>
  );
}