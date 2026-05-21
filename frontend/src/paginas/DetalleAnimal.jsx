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

  // Estados para el formulario de adopción
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
      .catch(err => console.error(err))
  }, [id])

  const compartirAnimal = () => {
    if (navigator.share) {
      navigator.share({ title: `Adopta a ${animal.nombre}`, text: `Mira a ${animal.nombre}, busca un hogar en Huellitas.`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({ title: '¡Copiado!', text: 'Enlace listo', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  }

  const handleDelete = async () => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?', text: `Eliminarás a ${animal.nombre}.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545'
    });
    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/animales/${id}`);
        Swal.fire('¡Borrado!', 'El animal ha sido eliminado.', 'success');
        navigate('/'); 
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar.', 'error');
      }
    }
  };

  const handleApadrinar = async () => {
    try {
      await api.post('/apadrinar', { animal_id: id });
      Swal.fire('¡Gracias! 💖', `Eres el padrino de ${animal.nombre}.`, 'success');
    } catch (error) {
      if (error.response?.status === 400) Swal.fire('Atención', error.response.data.message, 'info'); 
      else Swal.fire('Error', 'Debes entrar en tu cuenta.', 'error');
    }
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/adoptar', { ...formAdopcion, animal_id: id });
      setMostrarModal(false);
      Swal.fire('¡Solicitud enviada! 🐾', 'El administrador revisará tu cuestionario.', 'success');
    } catch (error) {
      if (error.response?.status === 400) Swal.fire('Aviso', error.response.data.message, 'info');
      else Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  const puedeBorrar = user && (user.id === animal.user_id || user.rol === 'admin');

  return (
    <div className="container mt-4 animate__animated animate__fadeIn position-relative">
      
      {/* MODAL CUESTIONARIO ADOPCIÓN */}
      {mostrarModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-light py-4"><h4 className="fw-bold text-huellitas">Cuestionario de Adopción</h4>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmitAdopcion}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tipo de vivienda</label>
                      <select className="form-select" onChange={(e) => setFormAdopcion({...formAdopcion, tipo_vivienda: e.target.value})}>
                        <option value="Piso">Piso</option><option value="Casa">Casa</option><option value="Chalet">Chalet</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">¿Jardín cerrado?</label>
                      <select className="form-select" onChange={(e) => setFormAdopcion({...formAdopcion, tiene_jardin: e.target.value === 'true'})}>
                        <option value="false">No</option><option value="true">Sí</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Horas al día solo</label>
                      <input type="number" className="form-control" onChange={(e) => setFormAdopcion({...formAdopcion, horas_solo: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Otras mascotas</label>
                      <input type="text" className="form-control" onChange={(e) => setFormAdopcion({...formAdopcion, otras_mascotas: e.target.value})} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Motivo de adopción</label>
                      <textarea className="form-control" rows="3" onChange={(e) => setFormAdopcion({...formAdopcion, motivo: e.target.value})} required></textarea>
                    </div>
                  </div>
                  <div className="text-end mt-4">
                    <button type="button" className="btn btn-light me-2 rounded-pill" onClick={() => setMostrarModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-huellitas text-white rounded-pill">Enviar Solicitud</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INFO ANIMAL */}
      <div className="d-flex justify-content-between mb-4">
        <Link to={`/protectora/${animal.user_id}`} className="text-secondary">← Volver</Link>
        <button onClick={compartirAnimal} className="btn btn-sm btn-outline-secondary">Difundir</button>
      </div>

      <div className="row g-4">
        <div className="col-lg-6"><img src={animal.imagen_url} className="img-fluid rounded-4 w-100" alt={animal.nombre} style={{ minHeight: '450px', objectFit: 'cover' }}/></div>
        <div className="col-lg-6">
          <div className="p-4 bg-white shadow-sm rounded-4 h-100">
            <h1 className="fw-bold text-huellitas">{animal.nombre}</h1>
            <p className="text-muted">{animal.raza}</p>
            <p>{animal.descripcion}</p>
            
            <div className="mt-4 pt-3 border-top">
              {animal.estado !== 'Adoptado' ? (
                <>
                  <button onClick={() => { if(!user) return Swal.fire('Error', 'Debes entrar.', 'error'); setMostrarModal(true); }} className="btn btn-huellitas w-100 py-3 rounded-pill mb-2 fw-bold">¡Quiero adoptarlo!</button>
                  <button onClick={handleApadrinar} className="btn btn-outline-info w-100 py-2 rounded-pill fw-bold">Quiero apadrinarlo</button>
                </>
              ) : (
                <div className="alert alert-success text-center">¡Ya tiene una familia!</div>
              )}
              {puedeBorrar && <button onClick={handleDelete} className="btn btn-outline-danger w-100 mt-3 rounded-pill">Eliminar Animal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}