import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente CrearEvento: formulario para la creación de eventos en la protectora.
 * Gestiona el envío de archivos (imágenes) y datos mediante FormData.
 */
export default function CrearEvento() {
  const navigate = useNavigate();

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);

  // Estados de control de flujo
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  /**
   * Maneja el cambio de archivo y genera la previsualización local.
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fichero = e.target.files[0];
      setImagenArchivo(fichero);
      setVistaPrevia(URL.createObjectURL(fichero));
    }
  };

  /**
   * Envía los datos del formulario al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo);
    }

    try {
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
      console.error("Error al crear el evento:", err);
      const mensaje = err.response?.data?.message || 'Hubo un error al procesar el formulario.';

      Swal.fire({
        title: 'Error',
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
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' }}>
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
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {vistaPrevia ? (
              <img
                src={vistaPrevia}
                alt="Vista previa"
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Título del Evento:
            </label>
            <input
              type="text"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none', color: '#334155' }}
              placeholder="Ej: Feria de Adopción"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Ubicación:
            </label>
            <input
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Fecha y Hora:
            </label>
            <input
              type="datetime-local"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', outline: 'none', color: '#475569' }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Imagen del Evento:
            </label>
            <input
              type="file"
              accept="image/*"
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: '25px', backgroundColor: '#fff', fontSize: '0.9rem', color: '#475569' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
            Descripción:
          </label>
          <textarea
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
              cursor: 'pointer',
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
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}