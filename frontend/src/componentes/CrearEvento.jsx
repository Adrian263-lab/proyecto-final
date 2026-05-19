import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CrearEvento() {
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState(null); // Guardará el archivo real
  
  // Estados de control
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Capturar el archivo cuando el usuario lo selecciona
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenArchivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo || !descripcion || !fecha || !ubicacion) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    setEnviando(true);
    setError('');

    /* REGLA DE ORO PARA SUBIR ARCHIVOS:
      No podemos enviar un objeto JSON normal si hay un fichero de por medio.
      Tenemos que empaquetarlo todo en un objeto FormData.
    */
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('fecha', fecha);
    formData.append('ubicacion', ubicacion);
    
    // Si la protectora ha seleccionado una foto, la adjuntamos al paquete
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo); // El nombre 'imagen' debe coincidir con lo que espere tu backend
    }

    try {
      // Enviamos el FormData con Axios pasándole una cabecera especial automáticamente
      await api.post('/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Si todo va bien, redirigimos a la Home para que vean su nuevo evento creado
      navigate('/');
    } catch (err) {
      console.error("Error al crear el evento:", err);
      setError(err.response?.data?.mensaje || 'Hubo un error al procesar el formulario.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn" style={{ maxWidth: '650px' }}>
      <div className="card shadow rounded-4 p-4 p-md-5 bg-white border">
        
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#6f42c1' }}>🐾 Crear Nuevo Evento</h2>
        
        {error && <div className="alert alert-danger py-2 fw-semibold">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* TÍTULO */}
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Título del Evento *</label>
            <input 
              type="text" 
              className="form-control rounded-3" 
              placeholder="Ej. Mercadillo solidario de primavera"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* FECHA */}
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Fecha del Evento *</label>
            <input 
              type="date" 
              className="form-control rounded-3" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* UBICACIÓN */}
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Ubicación / Dirección *</label>
            <input 
              type="text" 
              className="form-control rounded-3" 
              placeholder="Ej. Parque del Retiro, Madrid"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Descripción detallada *</label>
            <textarea 
              className="form-control rounded-3" 
              rows="4"
              placeholder="Explica de qué trata el evento, horarios, si pueden llevar mascotas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          {/* NUEVO CAMPO: SELECCIÓN DE ARCHIVO FOTOGRÁFICO */}
          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">Imagen del Evento (Foto de portada)</label>
            <input 
              type="file" 
              className="form-control rounded-3" 
              accept="image/*" // Restringe el selector solo a imágenes (jpg, png, webp...)
              onChange={handleFileChange}
            />
            <div className="form-text text-muted">Selecciona un archivo JPG, PNG o WEBP desde tu dispositivo.</div>
          </div>

          {/* BOTONES */}
          <div className="d-flex gap-3 mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary w-50 rounded-pill fw-bold"
              onClick={() => navigate('/')}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn text-white w-50 rounded-pill fw-bold shadow-sm"
              style={{ backgroundColor: '#6f42c1', border: 'none' }}
              disabled={enviando}
            >
              {enviando ? 'Subiendo evento...' : 'Publicar Evento 🚀'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}