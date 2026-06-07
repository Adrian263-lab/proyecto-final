import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

// El componente CrearEvento proporciona una interfaz para que las protectoras puedan publicar nuevos eventos relacionados con la adopción, recaudación de fondos u otras actividades. Incluye un formulario con validación, manejo de archivos y feedback visual para mejorar la experiencia del usuario.
function CrearEvento() {
  const navigate = useNavigate();

  // Estados de dominio de datos
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState(null); // Archivo binario para la API
  const [vistaPrevia, setVistaPrevia] = useState(null);    // BLOB local para renderizado en caliente

  // Estados de control de flujo en la interfaz
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

 // Limpieza de blobs temporales para evitar fugas de memoria. Se ejecuta al desmontar el componente o al cambiar el archivo/previsualización.
  useEffect(() => {
      return () => {
          if (vistaPrevia) {
              URL.revokeObjectURL(vistaPrevia);
          }
      };
  }, [vistaPrevia]);

  // Manejo del evento de selección de archivo. Se valida que el archivo sea una imagen antes de procesarlo.
  const handleFileChange = (e) => {
    const fichero = e.target.files[0];
    
    // Programación defensiva: Verificar existencia y tipo MIME
    if (fichero && fichero.type.startsWith('image/')) {
      setImagenArchivo(fichero);
      setVistaPrevia(URL.createObjectURL(fichero)); 
    }
  };

  // Función asíncrona para manejar el envío del formulario. Utiliza FormData para enviar datos mixtos al backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación Early Return: Evita peticiones innecesarias si faltan campos clave
    if (!titulo || !descripcion || !fecha || !ubicacion) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    setEnviando(true);
    setError('');

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('fecha', fecha);
    formData.append('ubicacion', ubicacion);

    // Condicional para añadir el binario solo si el usuario interactuó con el input file
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo);
    }

    try {
      // Petición POST con sobreescritura de cabeceras para forzar la lectura del límite de multipart
      await api.post('/eventos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await Swal.fire({
        title: '¡Evento Creado!',
        text: 'El evento se ha publicado correctamente.',
        icon: 'success',
        confirmButtonColor: '#6f42c1'
      });

      navigate('/panel-protectora');

    } catch (err) {
      console.error("Fallo de integridad al registrar el evento:", err);

      // Extracción defensiva del mensaje de error para proporcionar feedback específico al usuario
      const mensaje = err.response?.data?.message || 'Hubo un error al procesar el formulario.';

      Swal.fire({
        title: 'Error de publicación',
        text: mensaje,
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontWeight: '800', color: '#6f42c1', fontSize: '2.2rem' }}>
          Publicar Nuevo Evento
        </h2>
      </div>

      
      {error && (
        <div 
          style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' }}
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '35px' }}>
          <div style={{
            width: '200px',
            height: '200px',
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {vistaPrevia ? (
              <img
                src={vistaPrevia}
                alt="Vista previa promocional del evento"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500', textAlign: 'center', padding: '10px' }}>
                Sin foto seleccionada
              </span>
            )}
          </div>
        </div>

        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="titulo" style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Título del Evento:
            </label>
            <input
              id="titulo"
              type="text"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none', color: '#334155' }}
              placeholder="Ej: Feria de Adopción"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="ubicacion" style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Ubicación:
            </label>
            <input
              id="ubicacion"
              type="text"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none', color: '#334155' }}
              placeholder="Ej: Parque Central"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="fecha" style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Fecha y Hora:
            </label>
            <input
              id="fecha"
              type="datetime-local"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none', color: '#475569' }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="imagenEvento" style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Imagen del Evento:
            </label>
            <input
              id="imagenEvento"
              type="file"
              accept="image/*"
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid #cbd5e1',
                borderRadius: '25px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#475569'
              }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
            Descripción:
          </label>
          <textarea
            id="descripcion"
            style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '16px', outline: 'none', color: '#334155', resize: 'none' }}
            rows="4"
            placeholder="Describe qué se hará en el evento..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={enviando}
            style={{
              flex: '1',
              backgroundColor: '#ff9238',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '1.05rem',
              cursor: enviando ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(255,146,56,0.2)',
              opacity: enviando ? 0.7 : 1
            }}
          >
            {enviando ? 'Guardando...' : 'Guardar Evento'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/panel-protectora')}
            disabled={enviando}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '14px 30px',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '1.05rem',
              cursor: enviando ? 'not-allowed' : 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}


export default CrearEvento;