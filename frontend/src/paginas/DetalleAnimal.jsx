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

  // Manejadores genéricos para inputs controlados
  const handleAdopcionChange = (e) => {
    const { name, value } = e.target;
    setFormAdopcion(prev => ({
      ...prev,
      [name]: value === 'true' ? true : value === 'false' ? false : value
    }));
  };

  const handleApadrinarChange = (e) => {
    const { name, value } = e.target;
    setFormApadrinar(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

      {/* 📝 MODAL 1: Cuestionario de Adopción (VISTA COMPLETA EN 2 COLUMNAS) */}
      {mostrarModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '10px'
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg"
            style={{
              width: '100%',
              maxWidth: '750px', // Ampliado para albergar 2 columnas
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Encabezado fijo compacto */}
            <div className="bg-huellitas text-white p-3 d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold m-0">📝 Cuestionario de Adopción</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModal(false)}></button>
            </div>

            {/* Formulario sin scroll y ordenado en rejilla */}
            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSubmitAdopcion}>
                <div className="row g-3">
                  {/* Columna Izquierda */}
                  <div className="col-md-6">
                    <div className="mb-2">
                      <label className="fw-bold mb-1 small">Tipo de vivienda</label>
                      <select className="form-select form-select-sm rounded-pill" name="tipo_vivienda" value={formAdopcion.tipo_vivienda} onChange={handleAdopcionChange}>
                        <option value="Piso">Piso</option>
                        <option value="Casa">Casa</option>
                        <option value="Chalet">Chalet</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="fw-bold mb-1 small">Teléfono de contacto</label>
                      <input type="tel" className="form-control form-control-sm rounded-pill" name="telefono" value={formAdopcion.telefono} onChange={handleAdopcionChange} required />
                    </div>
                    <div className="mb-2">
                      <label className="fw-bold mb-1 small">¿Otras mascotas en casa?</label>
                      <input type="text" className="form-control form-control-sm rounded-pill" name="otras_mascotas" value={formAdopcion.otras_mascotas} onChange={handleAdopcionChange} required />
                    </div>
                    <div className="mb-2">
                      <label className="fw-bold mb-1 small">¿Tienes jardín o patio?</label>
                      <select className="form-select form-select-sm rounded-pill" name="tiene_jardin" value={formAdopcion.tiene_jardin.toString()} onChange={handleAdopcionChange}>
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="fw-bold mb-1 small">Horas solo al día</label>
                      <input type="number" className="form-control form-control-sm rounded-pill" min="0" max="24" name="horas_solo" value={formAdopcion.horas_solo} onChange={handleAdopcionChange} required />
                    </div>
                  </div>

                  {/* Columna Derecha (Campos de texto largo) */}
                  <div className="col-md-6 d-flex flex-column justify-content-between">
                    <div className="mb-2 flex-grow-1">
                      <label className="fw-bold mb-1 small">Experiencia previa</label>
                      <textarea className="form-control rounded-3" rows="3" name="experiencia" value={formAdopcion.experiencia} onChange={handleAdopcionChange} style={{ height: 'calc(50% - 15px)', resize: 'none' }} required />
                    </div>
                    <div className="mb-3 flex-grow-1">
                      <label className="fw-bold mb-1 small">¿Por qué deseas adoptar?</label>
                      <textarea className="form-control rounded-3" rows="3" name="motivo" value={formAdopcion.motivo} onChange={handleAdopcionChange} style={{ height: 'calc(50% - 15px)', resize: 'none' }} required />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <button type="submit" className="btn btn-huellitas text-white w-100 rounded-pill py-2">Enviar Cuestionario</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ❤️ MODAL 2: CUESTIONARIO DE APADRINAMIENTO (VISTA COMPLETA Y COMPACTA) */}
      {mostrarModalApadrinar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '10px'
          }}
        >
          <div
            className="bg-white rounded-4 shadow-lg"
            style={{
              width: '100%',
              maxWidth: '520px', // Un poco más ancho para albergar el contenido plano sin scroll
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div className="bg-huellitas text-white p-3 d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold m-0">❤️ Apadrinar a {animal.nombre}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalApadrinar(false)}></button>
            </div>

            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSubmitApadrinar}>
                <p className="text-muted small mb-3 text-center">
                  Colaboras mensualmente con los gastos de alimentación y cuidados médicos de este peludito.
                </p>

                <div className="mb-2">
                  <label className="fw-bold mb-1 small">Aportación mensual</label>
                  <select className="form-select form-select-sm rounded-pill" name="cantidad" value={formApadrinar.cantidad} onChange={handleApadrinarChange}>
                    <option value="10">10 € / mes</option>
                    <option value="20">20 € / mes</option>
                    <option value="30">30 € / mes</option>
                    <option value="50">50 € / mes</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="fw-bold mb-1 small">Titular de la cuenta bancaria</label>
                  <input type="text" className="form-control form-control-sm rounded-pill" placeholder="Nombre y apellidos" name="titular" value={formApadrinar.titular} onChange={handleApadrinarChange} required />
                </div>

                <div className="mb-3">
                  <label className="fw-bold mb-1 small">Número de Cuenta (IBAN)</label>
                  <input type="text" className="form-control form-control-sm rounded-pill" placeholder="ES21 0000 0000 0000 0000 0000" name="iban" value={formApadrinar.iban} onChange={handleApadrinarChange} required />
                </div>

                <div className="alert alert-info rounded-3 small p-2 mb-3 text-center" style={{ fontSize: '0.8rem' }}>
                  🔒 Conexión cifrada simulada segura para fines académicos.
                </div>

                <button type="submit" className="btn btn-huellitas text-white w-100 rounded-pill py-2">Confirmar Apadrinamiento</button>
              </form>
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