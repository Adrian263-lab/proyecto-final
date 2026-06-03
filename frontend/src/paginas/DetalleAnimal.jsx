import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

export default function DetalleAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalApadrinar, setMostrarModalApadrinar] = useState(false);

  // Estados independientes para formularios
  const [formAdopcion, setFormAdopcion] = useState({
    tipo_vivienda: 'Piso',
    tiene_jardin: false,
    otras_mascotas: '',
    horas_solo: '',
    motivo: '',
    telefono: '',
    experiencia: ''
  });

  const [formApadrinar, setFormApadrinar] = useState({
    cantidad: '10',
    titular: '',
    iban: ''
  });

  useEffect(() => {
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error("Error al obtener los detalles del animal:", err));
  }, [id]);

  // 🔐 CONTROL DE AUTENTICACIÓN CENTRALIZADO
  const verificarAcceso = (abrirModalCallback, tipoActividad) => {
    if (!user) {
      Swal.fire({
        title: '¡Acción Restringida! 🔒',
        text: `Para poder realizar actividades como ${tipoActividad} a nuestros peluditos, es necesario que te registres en la plataforma.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrarse ahora',
        cancelButtonText: 'Seguir mirando',
        confirmButtonColor: '#6f42c1',
        cancelButtonColor: '#6c757d',
        borderRadius: '1rem'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/register');
        }
      });
      return;
    }
    abrirModalCallback(true);
  };

  const handleSubmitAdopcion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formAdopcion,
        animal_id: parseInt(id),
        horas_solo: parseInt(formAdopcion.horas_solo)
      };
      await api.post('/adoptar', payload);
      setMostrarModal(false);
      Swal.fire({
        title: '¡Éxito! 🐾',
        text: 'Solicitud de adopción enviada correctamente.',
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar la solicitud de adopción.',
        icon: 'error',
        confirmButtonColor: '#6f42c1'
      });
    }
  };

  const handleSubmitApadrinar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        animal_id: parseInt(id),
        cantidad: parseFloat(formApadrinar.cantidad),
        titular: formApadrinar.titular,
        iban: formApadrinar.iban
      };

      await api.post('/apadrinar', payload);
      setMostrarModalApadrinar(false);

      Swal.fire({
        title: '¡Muchas gracias! ❤️',
        text: `Has apadrinado oficialmente a ${animal.nombre}. Ya puedes gestionarlo desde tu panel.`,
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });
    } catch (error) {
      Swal.fire({
        title: 'Atención',
        text: error.response?.data?.message || 'No se pudo procesar el apadrinamiento.',
        icon: 'info',
        confirmButtonColor: '#6f42c1'
      });
    }
  };

  if (!animal) return <div className="text-center mt-5"><div className="spinner-border text-huellitas"></div></div>;

  let imagenSaneada = animal.imagen_url;
  if (!imagenSaneada || imagenSaneada.includes('loremflickr.com')) {
    imagenSaneada = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop';
  }

  return (
    <div className="container mt-5 mb-5 animate-up">

      {/* 📝 MODAL 1: Cuestionario de Adopción */}
      {mostrarModal && (
        /* 🚀 RECONFIGURADO: Cambiamos las clases y quitamos los estilos manuales de viewport. 
           Usamos un sombreado nativo uniforme y habilitamos el scroll nativo de Bootstrap. */
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', overflowY: 'auto' }}
        >
          {/* 'modal-dialog-centered' centra el formulario simétricamente a lo ancho y alto */}
          <div className="modal-dialog modal-dialog-centered my-5">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-huellitas text-white border-0 p-4 rounded-top-4">
                <h5 className="modal-title fw-bold">📝 Cuestionario de Adopción</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
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
                    <input type="tel" className="form-control rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, telefono: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Otras mascotas en casa?</label>
                    <input type="text" className="form-control rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, otras_mascotas: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">¿Tienes jardín o patio?</label>
                    <select className="form-select rounded-pill" onChange={(e) => setFormAdopcion({ ...formAdopcion, tiene_jardin: e.target.value === 'true' })}>
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Horas solo al día</label>
                    <input type="number" className="form-control rounded-pill" min="0" max="24" value={formAdopcion.horas_solo} onChange={(e) => setFormAdopcion({ ...formAdopcion, horas_solo: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="fw-bold mb-2">Experiencia previa</label>
                    <textarea className="form-control rounded-4" rows="2" onChange={(e) => setFormAdopcion({ ...formAdopcion, experiencia: e.target.value })} required />
                  </div>
                  <div className="mb-4">
                    <label className="fw-bold mb-2">¿Por qué deseas adoptar?</label>
                    <textarea className="form-control rounded-4" rows="2" onChange={(e) => setFormAdopcion({ ...formAdopcion, motivo: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-huellitas text-white w-100 rounded-pill py-2 mb-3">Enviar Cuestionario</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ❤️ MODAL 2: CUESTIONARIO DE APADRINAMIENTO */}
      {mostrarModalApadrinar && (
        /* 🚀 RECONFIGURADO: Mismo comportamiento limpio y centrado para apadrinar */
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', overflowY: 'auto' }}
        >
          <div className="modal-dialog modal-dialog-centered my-5">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-huellitas text-white border-0 p-4 rounded-top-4">
                <h5 className="modal-title fw-bold">❤️ Apadrinar a {animal.nombre}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalApadrinar(false)}></button>
              </div>

              <div className="modal-body p-4 bg-white rounded-bottom-4">
                <form onSubmit={handleSubmitApadrinar}>
                  <p className="text-muted small mb-4">
                    Al apadrinar, colaboras mensualmente con los gastos de alimentación y cuidados médicos de este peludito.
                  </p>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Aportación mensual (€)</label>
                    <select className="form-select rounded-pill" value={formApadrinar.cantidad} onChange={(e) => setFormApadrinar({ ...formApadrinar, cantidad: e.target.value })}>
                      <option value="10">10 € / mes</option>
                      <option value="20">20 € / mes</option>
                      <option value="30">30 € / mes</option>
                      <option value="50">50 € / mes</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Titular de la cuenta bancaria</label>
                    <input type="text" className="form-control rounded-pill" placeholder="Nombre y apellidos" onChange={(e) => setFormApadrinar({ ...formApadrinar, titular: e.target.value })} required />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold mb-2">Número de Cuenta (IBAN)</label>
                    <input type="text" className="form-control rounded-pill" placeholder="ES21 0000 0000 0000 0000 0000" onChange={(e) => setFormApadrinar({ ...formApadrinar, iban: e.target.value })} required />
                  </div>

                  <div className="alert alert-info rounded-3 small p-2 mb-4">
                    🔒 Conexión cifrada simulada segura para fines académicos.
                  </div>

                  <button type="submit" className="btn btn-huellitas text-white w-100 rounded-pill py-2 mb-3">Confirmar Apadrinamiento</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal de la Ficha */}
      <div className="row g-5 align-items-start">
        <div className="col-lg-6">
          <img src={imagenSaneada} className="img-fluid rounded-5 shadow-lg w-100" style={{ maxHeight: '500px', objectFit: 'cover' }} alt={animal.nombre} />
        </div>

        <div className="col-lg-6">
          <span className="badge bg-naranja-claro text-naranja rounded-pill px-3 py-2 mb-3 d-inline-block">
            {animal.estado || 'En adopción'}
          </span>
          <h1 className="display-4 fw-bold text-huellitas mb-2">{animal.nombre}</h1>
          <p className="lead text-secondary mb-4">{animal.descripcion || 'Sin descripción disponible.'}</p>

          <div className="card card-huellitas p-4 bg-white mb-4 shadow-sm">
            <h5 className="fw-bold text-huellitas mb-3">Características</h5>
            <div className="row g-3 text-dark">
              <div className="col-6"><p className="mb-1"><strong>Especie:</strong> {animal.especie?.nombre || animal.especie_nombre || 'No especificada'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Raza:</strong> {animal.raza || 'Mestizo'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Sexo:</strong> {animal.sexo || 'No especificado'}</p></div>
              <div className="col-6"><p className="mb-1"><strong>Protectora:</strong> {animal.user?.name || animal.protectora_nombre || 'Protectora Huellitas'}</p></div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            {animal.estado !== 'Adoptado' ? (
              <>
                <button onClick={() => verificarAcceso(setMostrarModal, 'adoptar')} className="btn btn-huellitas text-white btn-lg px-5">
                  ¡Quiero adoptarlo!
                </button>
                <button onClick={() => verificarAcceso(setMostrarModalApadrinar, 'apadrinar')} className="btn btn-lg btn-light border text-huellitas rounded-pill px-4 fw-bold">
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