import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CrearEvento() {
  const navigate = useNavigate();
  
  // Estados de los datos del evento
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null); // Para mostrar la imagen seleccionada arriba

  // Estados de carga y error
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Manejador del archivo de imagen con vista previa dinámica
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const archivo = e.target.files[0];
      setImagenArchivo(archivo);
      setVistaPrevia(URL.createObjectURL(archivo)); // Crea una URL temporal local para la etiqueta <img>
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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (err) {
      console.error("Error al crear el evento:", err);
      setError(err.response?.data?.mensaje || 'Hubo un error al procesar el formulario.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '20px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* CABECERA AL ESTILO HUELLITAS */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontWeight: '800', color: '#6f42c1', fontSize: '2.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          🐾 Registrar nuevo evento
        </h2>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: '600' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* RECUADRO SUPERIOR DE VISTA PREVIA (IGUAL AL DE REGISTRAR ANIMAL) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '220px',
            height: '220px',
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

        {/* FILA 1: TÍTULO Y UBICACIÓN */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Nombre del evento
            </label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '25px', outline: 'none', color: '#334155', backgroundColor: '#fff', fontSize: '0.95rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
              placeholder="Ej: Feria de Adopción Responsable"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Ubicación
            </label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '25px', outline: 'none', color: '#334155', backgroundColor: '#fff', fontSize: '0.95rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
              placeholder="Ej: Centro Cívico Municipal"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
            />
          </div>
        </div>

        {/* FILA 2: FECHA Y SELECTOR DE ARCHIVO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Fecha y Hora
            </label>
            <input 
              type="datetime-local" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '25px', outline: 'none', color: '#475569', backgroundColor: '#fff', fontSize: '0.95rem' }}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
              Foto del evento
            </label>
            <input 
              type="file" 
              accept="image/*"
              style={{ 
                width: '100%', 
                padding: '10px 16px', 
                border: '1px solid #e2e8f0', 
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

        {/* FILA 3: DESCRIPCIÓN COMPLETA */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
            Descripción / Historia
          </label>
          <textarea 
            style={{ width: '100%', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px', outline: 'none', color: '#334155', backgroundColor: '#fff', resize: 'none', fontSize: '0.95rem' }}
            rows="4"
            placeholder="Cuenta los detalles del evento para animar a los asistentes..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
          <small style={{ display: 'block', marginTop: '6px', color: '#64748b', fontSize: '0.8rem' }}>
            Sube una foto clara de portada para que lo encuentren pronto.
          </small>
        </div>

        {/* BOTONERA INFERIOR (NARANJA Y GRIS IDÉNTICA) */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={enviando}
            style={{ 
              flex: '1', 
              backgroundColor: '#ff9238', // Color naranja idéntico a "Guardar Peludito"
              color: '#fff', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '25px', 
              fontWeight: '700', 
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(255,146,56,0.2)',
              transition: 'opacity 0.2s ease',
              opacity: enviando ? 0.7 : 1
            }}
          >
            {enviando ? 'Guardando...' : 'Guardar Evento'}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/')}
            disabled={enviando}
            style={{ 
              backgroundColor: '#f1f5f9', 
              color: '#334155', 
              border: '1px solid #e2e8f0', 
              padding: '14px 30px', 
              borderRadius: '25px', 
              fontWeight: '600', 
              fontSize: '1.05rem',
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