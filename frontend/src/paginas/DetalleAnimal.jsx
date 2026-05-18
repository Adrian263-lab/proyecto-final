import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import Swal from 'sweetalert2'

export default function DetalleAnimal() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)

  useEffect(() => {
    // Es recomendable que el backend devuelva la relación con 'user' (la protectora)
    api.get(`/animales/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error(err))
  }, [id])

  const compartirAnimal = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopta a ${animal.nombre}`,
        text: `Mira a ${animal.nombre}, busca un hogar en Huellitas.`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({ 
        title: '¡Copiado!', 
        text: 'Enlace listo para compartir', 
        icon: 'success', 
        timer: 1500, 
        showConfirmButton: false 
      });
    }
  }

  if (!animal) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-huellitas" role="status"></div>
    </div>
  )

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link 
          to={`/protectora/${animal.user_id}`} 
          style={{ color: '#666', textDecoration: 'none' }}
          className="hover-huellitas fw-medium"
        >
          <i className="bi bi-arrow-left me-2"></i>Volver a la protectora
        </Link>
        
        <button 
          onClick={compartirAnimal} 
          className="btn btn-outline-secondary rounded-pill btn-sm px-3 shadow-sm"
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-share me-2"></i>Difundir
        </button>
      </div>

      <div className="row g-4">
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100 bg-light">
            <img 
              src={animal.imagen_url || 'https://via.placeholder.com/600x600?text=Sin+Foto'} 
              className="img-fluid h-100 w-100" 
              alt={animal.nombre}
              style={{ objectFit: 'cover', minHeight: '450px' }}
            />
            {animal.estado === 'Urgente' && (
              <span className="position-absolute top-0 start-0 m-3 badge bg-danger px-3 py-2 fs-6 shadow">
                🚨 ¡URGENTE!
              </span>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN */}
        <div className="col-lg-6">
          <div className="p-4 bg-white shadow-sm rounded-4 h-100 border-top border-huellitas border-5">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1 className="fw-bold text-huellitas display-4 mb-0">{animal.nombre}</h1>
                <p className="text-muted fs-5">{animal.raza || 'Mestizo'}</p>
              </div>
              <span className={`badge rounded-pill px-3 py-2 ${animal.estado === 'Adoptado' ? 'bg-success' : 'bg-info text-white'}`}>
                {animal.estado}
              </span>
            </div>

            <hr className="my-4 opacity-25" />

            {/* FICHA TÉCNICA */}
            <div className="row text-center g-3 my-3">
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 h-100 border border-white">
                  <i className="bi bi-gender-ambiguous fs-3 text-huellitas"></i>
                  <p className="small mb-0 mt-1 fw-bold text-muted text-uppercase">{animal.sexo || 'N/A'}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 h-100 border border-white">
                  <i className="bi bi-calendar3 fs-3 text-huellitas"></i>
                  <p className="small mb-0 mt-1 fw-bold text-muted text-uppercase">{animal.edad || 'E'}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 h-100 border border-white">
                  <i className="bi bi-tag fs-3 text-huellitas"></i>
                  <p className="small mb-0 mt-1 fw-bold text-muted text-uppercase">{animal.especie?.nombre || 'Peludito'}</p>
                </div>
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="mt-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-chat-left-heart me-2 text-huellitas"></i>Su historia
              </h5>
              <p className="text-secondary leading-relaxed" style={{ textAlign: 'justify', lineHeight: '1.7' }}>
                {animal.descripcion || "Este peludito no tiene descripción aún, pero seguro que está deseando conocerte."}
              </p>
            </div>

            {/* BOTÓN DE ACCIÓN / ESTADO ADOPTADO */}
            {animal.estado !== 'Adoptado' ? (
              <div className="mt-5">
                <button className="btn btn-huellitas w-100 py-3 rounded-pill fs-5 shadow-sm fw-bold mb-3 transition-hover">
                  <i className="bi bi-heart-fill me-2"></i>¡Quiero adoptarlo!
                </button>
                <p className="small text-center text-muted">
                  Al pulsar, se enviará una notificación a la protectora.
                </p>
              </div>
            ) : (
              <div className="mt-5 p-4 bg-success bg-opacity-10 border border-success border-dashed rounded-4 text-center">
                <h4 className="text-success fw-bold mb-1">✨ ¡Ya tiene una familia! ✨</h4>
                <p className="text-success small mb-0">
                  Este animal ya ha sido adoptado y no está disponible para nuevas solicitudes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}