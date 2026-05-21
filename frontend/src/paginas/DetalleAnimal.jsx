import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios' 
import Swal from 'sweetalert2'
import { useAuth } from '../contexto/AuthContext';

export default function DetalleAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const { user } = useAuth()

  const [mostrarModal, setMostrarModal] = useState(false);
  const [formAdopcion, setFormAdopcion] = useState({
    tipo_vivienda: 'Piso',
    tiene_jardin: false,
    otras_mascotas: '', // Campo necesario para el servidor
    horas_solo: 0,
    motivo: ''
  });

  useEffect(() => {
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error(err))
  }, [id])

  const handleApadrinar = async () => {
    try {
      await api.post('/apadrinar', { animal_id: id });
      Swal.fire('¡Gracias!', 'Has apadrinado a este peludito.', 'success');
    } catch (error) {
      if (error.response?.status === 401) Swal.fire('Error', 'Debes iniciar sesión.', 'error');
      else Swal.fire('Atención', error.response?.data?.message || 'Error al apadrinar', 'info');
    }
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formAdopcion, animal_id: parseInt(id) };
      await api.post('/adoptar', dataToSend);
      
      setMostrarModal(false);
      Swal.fire('¡Solicitud enviada! 🐾', 'El administrador revisará tu cuestionario.', 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo enviar la solicitud.', 'error');
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      {/* MODAL ADOPCIÓN */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header"><h5 className="fw-bold">Cuestionario de Adopción</h5></div>
              <div className="modal-body">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de vivienda</label>
                    <select className="form-select" onChange={(e) => setFormAdopcion({...formAdopcion, tipo_vivienda: e.target.value})}>
                      <option value="Piso">Piso</option><option value="Casa">Casa</option><option value="Chalet">Chalet</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">¿Jardín cerrado?</label>
                    <select className="form-select" onChange={(e) => setFormAdopcion({...formAdopcion, tiene_jardin: e.target.value === 'true'})}>
                      <option value="false">No</option><option value="true">Sí</option>
                    </select>
                  </div>
                  {/* --- CAMPO AÑADIDO --- */}
                  <div className="mb-3">
                    <label className="form-label">¿Tienes otras mascotas?</label>
                    <input type="text" className="form-control" onChange={(e) => setFormAdopcion({...formAdopcion, otras_mascotas: e.target.value})} required />
                  </div>
                  {/* --------------------- */}
                  <div className="mb-3">
                    <label className="form-label">Horas al día solo</label>
                    <input type="number" className="form-control" onChange={(e) => setFormAdopcion({...formAdopcion, horas_solo: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Motivo</label>
                    <textarea className="form-control" onChange={(e) => setFormAdopcion({...formAdopcion, motivo: e.target.value})} required></textarea>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setMostrarModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Enviar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6"><img src={animal.imagen_url} className="img-fluid rounded-4" alt={animal.nombre} /></div>
        <div className="col-lg-6">
          <h1>{animal.nombre}</h1>
          <p>{animal.descripcion}</p>
          <div className="mt-4">
            {animal.estado !== 'Adoptado' ? (
              <>
                <button onClick={() => setMostrarModal(true)} className="btn btn-primary w-100 mb-2">¡Quiero adoptarlo!</button>
                <button onClick={handleApadrinar} className="btn btn-outline-info w-100">Apadrinar</button>
              </>
            ) : <div className="alert alert-success">¡Ya tiene familia!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}